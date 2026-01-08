
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapConfig, Language, NarrativeMode, ThemeMode, PromptType } from '../types';
import * as C from '../constants';
import { playSwitch, playTechClick, playSuccess } from '../services/audioService';
import { generatePOISuggestions, analyzeImageStyle } from '../services/geminiService';

interface NarrativeViewProps {
  config: MapConfig;
  onChange: (field: keyof MapConfig, value: any) => void;
  lang: Language;
  onGenerate: (useAI: boolean, mode: NarrativeMode) => void;
  isGenerating?: boolean; 
  onRandom: () => void;
  promptType: PromptType;
  setPromptType: (type: PromptType) => void;
}

const NarrativeView: React.FC<NarrativeViewProps> = ({ config, onChange, lang, onGenerate, isGenerating, onRandom, promptType, setPromptType }) => {
  const t = C.UI_TEXT[lang];
  const [pois, setPois] = useState<string[]>(config.manualPOIs || Array(6).fill(''));
  const [isLoadingPois, setIsLoadingPois] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Default to Fantasy if undefined, allow toggle
  const theme = config.themeMode || ThemeMode.FANTASY;

  // Lists based on theme
  const civList = theme === ThemeMode.FANTASY ? C.FANTASY_RACES : C.HISTORICAL_CIVS;
  const buildingList = theme === ThemeMode.FANTASY ? C.FANTASY_BUILDINGS : C.HISTORICAL_BUILDINGS;
  
  const placeList = useMemo(() => {
    if (theme === ThemeMode.FANTASY) {
        return C.PLACES_BY_CIV[config.civilization] || C.PLACES_BY_CIV['DEFAULT'];
    }
    // Historical uses Locations
    return C.LOCATIONS;
  }, [config.civilization, theme]);

  // Sync internal POIs with config
  useEffect(() => {
    if (config.manualPOIs && config.manualPOIs.length > 0) {
        setPois(prev => {
             if (prev[0] === '' && config.manualPOIs && config.manualPOIs[0] !== '') return config.manualPOIs;
             return prev;
        });
    }
  }, [config.manualPOIs]);

  // OFFLINE AUTO-POIS: When Civilization changes, update POIs with Predefined ones (no AI)
  // This logic now checks for special "Space" context for Humans to give better offline defaults
  useEffect(() => {
    if (config.civilization) {
         let civKey = config.civilization;
         // HACK: Improve offline mapping for Sci-Fi contexts if Humans are selected with specific places
         if (civKey === 'Humanos' && (config.placeType?.includes('Espacio') || config.placeType?.includes('Base') || config.era?.includes('Futuro'))) {
             civKey = 'Sci-Fi';
         }
         if (civKey === 'Humanos' && (config.placeType?.includes('Cyber') || config.era?.includes('Cyberpunk'))) {
             civKey = 'Cyberpunk';
         }

         const predefined = C.getPredefinedPOIs(civKey);
         // Only update if current POIs are empty or basic default
         setPois(predefined);
         onChange('manualPOIs', predefined);
    }
  }, [config.civilization, config.placeType, config.era]);

  const handlePoiChange = (index: number, value: string) => {
    const newPois = [...pois];
    newPois[index] = value;
    setPois(newPois);
    onChange('manualPOIs', newPois);
  };

  const handleGeneratePois = async () => {
    if (!config.placeType || !config.civilization) return;
    playTechClick();
    setIsLoadingPois(true);
    try {
        const building = config.buildingType || 'Structure';
        const suggestions = await generatePOISuggestions(config.placeType, config.civilization, building, lang);
        
        if (suggestions && suggestions.length > 0) {
            const safeSuggestions = suggestions.slice(0, 6);
            while (safeSuggestions.length < 6) safeSuggestions.push("");
            
            setPois(safeSuggestions);
            onChange('manualPOIs', safeSuggestions);
            playSuccess();
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoadingPois(false);
    }
  };

  const handleThemeToggle = (newTheme: ThemeMode) => {
    onChange('themeMode', newTheme);
    onChange('civilization', '');
    onChange('placeType', '');
    onChange('buildingType', '');
    playSwitch();
  };

  // HANDLER FOR WIZARD STYLE FIELDS (Block 2)
  const handleWizardChange = (field: keyof MapConfig, value: string) => {
    playTechClick();
    onChange(field, value);
    
    // Cascade resets
    if (field === 'styleCategory') {
        onChange('styleReference', '');
        onChange('styleVibe', '');
        onChange('styleFinish', '');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
          alert(t.imageTooBig || "Image too big (Max 5MB)");
          return;
      }

      playTechClick();
      setIsAnalyzingImage(true);

      const reader = new FileReader();
      reader.onloadend = async () => {
          const base64 = reader.result as string;
          onChange('referenceImageBase64', base64);
          
          const extractedStyle = await analyzeImageStyle(base64);
          
          if (extractedStyle) {
              onChange('extractedStyle', extractedStyle);
              playSuccess();
          } else {
              alert("Could not extract style.");
          }
          setIsAnalyzingImage(false);
      };
      reader.readAsDataURL(file);
  };

  const clearImage = () => {
      onChange('extractedStyle', undefined);
      onChange('referenceImageBase64', undefined);
      if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const Select = ({ label, value, options, onChangeVal, disabled = false }: { label: string, value: string, options: string[], onChangeVal: (val: string) => void, disabled?: boolean }) => (
    <div className="mb-4">
        <label className={`block text-[10px] text-gray-500 mb-1 font-mono uppercase font-bold ${disabled ? 'opacity-50' : ''}`}>{label}</label>
        <select 
            value={value} 
            onChange={(e) => { playTechClick(); onChangeVal(e.target.value); }}
            disabled={disabled}
            className={`w-full bg-gray-950 border border-gray-800 p-3 text-sm text-gray-200 outline-none focus:border-accent-500 transition-colors rounded-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <option value="">{t.noneOption}</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
  );

  return (
    <div className="animate-fade-in pb-8 max-w-6xl mx-auto">
      
      {/* HEADER TITLE */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-2">{t.storycrafterTitle}</h2>
        <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">MOTOR DE GENERACIÓN NARRATIVA MULTI-ASSET</p>
      </div>

      {/* ROW 1: CORE + VISUAL DNA (SIDE BY SIDE) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* BLOQUE 1: NÚCLEO DE ESCENARIO */}
            <div className={`bg-gray-900/50 p-5 border border-gray-800 border-l-4 rounded-r-lg ${theme === ThemeMode.FANTASY ? 'border-l-purple-600' : 'border-l-orange-600'} relative`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-sm font-bold text-white font-mono flex items-center gap-2 uppercase tracking-tighter`}>
                        <span className={theme === ThemeMode.FANTASY ? 'text-purple-500' : 'text-orange-500'}>01.</span> {t.scenario}
                    </h3>
                    
                    {/* RANDOM BUTTON NEXT TO TITLE */}
                    <button 
                        onClick={() => { playSwitch(); onRandom(); }}
                        className="bg-gray-800 hover:bg-gray-700 text-white p-1.5 rounded transition-all border border-gray-700 hover:border-gray-500"
                        title="Randomize Scenario & Style"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    </button>
                </div>

                {/* Theme Toggle */}
                <div className="flex bg-gray-950 border border-gray-800 rounded mb-4 p-0.5">
                    <button 
                        onClick={() => handleThemeToggle(ThemeMode.FANTASY)} 
                        className={`flex-1 py-1.5 text-[10px] font-bold transition-all uppercase tracking-wider rounded-sm ${theme === ThemeMode.FANTASY ? 'bg-purple-900/50 text-purple-300 border border-purple-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        {t.themeFantasy}
                    </button>
                    <button 
                        onClick={() => handleThemeToggle(ThemeMode.HISTORICAL)} 
                        className={`flex-1 py-1.5 text-[10px] font-bold transition-all uppercase tracking-wider rounded-sm ${theme === ThemeMode.HISTORICAL ? 'bg-orange-900/50 text-orange-300 border border-orange-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        {t.themeHistory}
                    </button>
                </div>
                
                <Select 
                    label={theme === ThemeMode.FANTASY ? t.labelRace : t.labelCiv} 
                    value={config.civilization} 
                    options={civList} 
                    onChangeVal={(v) => onChange('civilization', v)} 
                />

                <Select 
                    label={theme === ThemeMode.FANTASY ? t.labelGeo : "GEOLOCALIZACIÓN"} 
                    value={config.placeType} 
                    options={placeList} 
                    onChangeVal={(v) => onChange('placeType', v)} 
                />

                <Select 
                    label={t.labelSettlement} 
                    value={config.buildingType} 
                    options={buildingList} 
                    onChangeVal={(v) => onChange('buildingType', v)} 
                />
            </div>

            {/* BLOQUE 2: ADN VISUAL (WIZARD DROPDOWNS) */}
            <div className={`bg-gray-900/50 p-5 border border-gray-800 border-l-4 rounded-r-lg ${theme === ThemeMode.FANTASY ? 'border-l-purple-600' : 'border-l-orange-600'}`}>
                <div className="flex justify-between items-center mb-4">
                     <h3 className={`text-sm font-bold text-white font-mono uppercase tracking-tighter flex items-center gap-2`}>
                        <span className={theme === ThemeMode.FANTASY ? 'text-purple-500' : 'text-orange-500'}>02.</span> ADN VISUAL
                    </h3>
                </div>
                
                {/* IMAGE UPLOAD UI */}
                <div className="mb-6 p-4 bg-gray-950 border border-dashed border-gray-700 rounded-lg text-center hover:border-accent-500/50 transition-colors">
                    {config.referenceImageBase64 ? (
                        <div className="relative">
                            <img src={config.referenceImageBase64} alt="Ref" className="h-32 mx-auto rounded border border-gray-700 object-cover mb-3" />
                            {isAnalyzingImage ? (
                                <div className="text-xs font-mono text-accent-400 animate-pulse">{t.analyzingStyle || "Analizando estilo con IA..."}</div>
                            ) : (
                                <div className="text-left">
                                    <label className="text-[9px] text-green-500 font-bold uppercase tracking-wider mb-1 block">✅ {t.styleExtracted || "ESTILO EXTRAÍDO"}</label>
                                    <textarea 
                                        value={config.extractedStyle || ''}
                                        onChange={(e) => onChange('extractedStyle', e.target.value)}
                                        className="w-full h-16 bg-gray-900 border border-green-900/50 text-[10px] text-gray-300 p-2 rounded focus:outline-none focus:border-green-500"
                                    />
                                </div>
                            )}
                            <button 
                                onClick={clearImage} 
                                className="absolute top-0 right-0 bg-red-900/80 text-white p-1 rounded-full hover:bg-red-700"
                                title="Remove Image"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    ) : (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="cursor-pointer"
                        >
                            <div className="text-2xl mb-2">📸</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.uploadRefLabel || "SUBIR REFERENCIA VISUAL"}</div>
                            <div className="text-[9px] text-gray-600">{t.uploadRefDesc || "La IA copiará el estilo de tu imagen"}</div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleImageUpload}
                            />
                        </div>
                    )}
                </div>

                {/* Wizard UI (Disabled if image uploaded) */}
                <div className={`space-y-4 transition-opacity ${config.extractedStyle ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                    {/* 1. Category */}
                    <Select 
                        label="CATEGORÍA / MEDIO" 
                        value={config.styleCategory || ''} 
                        options={C.STYLE_WIZARD_DATA.categories} 
                        onChangeVal={(v) => handleWizardChange('styleCategory', v)} 
                    />

                    {/* 2. Reference (Dependent on Category) */}
                    <Select 
                        label="REFERENTE VISUAL" 
                        value={config.styleReference || ''} 
                        options={config.styleCategory ? C.STYLE_WIZARD_DATA.references[config.styleCategory]?.map(r => r.label) || [] : []} 
                        onChangeVal={(v) => handleWizardChange('styleReference', v)}
                        disabled={!config.styleCategory} 
                    />

                    {/* 3. Vibe */}
                    <Select 
                        label="SENSACIÓN / ATMÓSFERA" 
                        value={config.styleVibe || ''} 
                        options={C.STYLE_WIZARD_DATA.vibes.map(v => v.label)} 
                        onChangeVal={(v) => handleWizardChange('styleVibe', v)}
                        disabled={!config.styleReference} 
                    />

                    {/* 4. Finish */}
                    <Select 
                        label="ACABADO FINAL" 
                        value={config.styleFinish || ''} 
                        options={C.STYLE_WIZARD_DATA.finish.map(f => f.label)} 
                        onChangeVal={(v) => handleWizardChange('styleFinish', v)} 
                        disabled={!config.styleVibe}
                    />
                </div>
            </div>
      </div>

      {/* ROW 2: POIS (FULL WIDTH) */}
      <div className={`mb-8 bg-gray-900/50 p-6 border border-gray-800 border-t-4 rounded-lg ${theme === ThemeMode.FANTASY ? 'border-t-purple-600' : 'border-t-orange-600'}`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className={`text-sm font-bold text-white font-mono uppercase tracking-tighter flex items-center gap-2`}>
                    <span className={theme === ThemeMode.FANTASY ? 'text-purple-500' : 'text-orange-500'}>03.</span> {t.poiTitle}
                </h3>
                
                {/* BOTON REGENERATE */}
                <button 
                    onClick={handleGeneratePois}
                    disabled={isLoadingPois || !config.placeType}
                    className="px-4 py-2 bg-gray-950 border border-gray-700 hover:border-accent-500 hover:text-accent-400 text-gray-400 font-mono font-bold text-[10px] rounded transition-all flex items-center gap-2 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoadingPois ? (
                        <span className="flex items-center gap-2"><svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg> GENERANDO...</span>
                    ) : (
                        <span>✨ GENERAR POIS CON IA</span>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pois.map((poi, idx) => (
                    <div key={idx} className="relative group">
                        <span className="absolute left-3 top-3 text-[10px] font-mono text-gray-600 font-bold">0{idx + 1}</span>
                        <input 
                            type="text"
                            value={poi}
                            onChange={(e) => handlePoiChange(idx, e.target.value)}
                            placeholder={`Punto de Interés ${idx + 1}`}
                            className="w-full bg-gray-950 border border-gray-800 p-3 pl-8 text-sm text-white placeholder-gray-700 focus:border-accent-500 outline-none transition-colors rounded-sm"
                        />
                    </div>
                ))}
            </div>
      </div>

      {/* ROW 3: PLATFORM SELECTOR (Now before Generation Buttons) */}
      <div className="mb-8 bg-gray-900/30 border border-gray-800 rounded-lg p-6">
        <h3 className="text-sm font-mono font-bold text-accent-400 mb-4 uppercase tracking-widest flex items-center">
             <span className="w-6 h-6 bg-accent-900 text-white rounded-full flex items-center justify-center mr-3 text-[10px]">04.</span> 
             {t.stepPlatform}
        </h3>
        <p className="text-xs text-gray-500 mb-6 font-mono border-b border-gray-800 pb-4">{t.stepPlatformSubtitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
                onClick={() => { playTechClick(); setPromptType(PromptType.UNIVERSAL); }}
                className={`p-4 rounded border text-left transition-all relative overflow-hidden group
                ${promptType === PromptType.UNIVERSAL ? 'bg-blue-900/30 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-gray-950 border-gray-800 hover:border-gray-600'}`}
            >
                <div className="font-bold font-mono text-sm mb-1 text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {t.formatUniversal}
                </div>
                <div className="text-[10px] text-gray-400">{t.formatUniversalDesc}</div>
            </button>

            <button
                onClick={() => { playTechClick(); setPromptType(PromptType.MIDJOURNEY); }}
                className={`p-4 rounded border text-left transition-all relative overflow-hidden group
                ${promptType === PromptType.MIDJOURNEY ? 'bg-purple-900/30 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-gray-950 border-gray-800 hover:border-gray-600'}`}
            >
                <div className="font-bold font-mono text-sm mb-1 text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    {t.formatMJ}
                </div>
                <div className="text-[10px] text-gray-400">{t.formatMJDesc}</div>
            </button>

            <button
                onClick={() => { playTechClick(); setPromptType(PromptType.ADVANCED); }}
                className={`p-4 rounded border text-left transition-all relative overflow-hidden group
                ${promptType === PromptType.ADVANCED ? 'bg-orange-900/30 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'bg-gray-950 border-gray-800 hover:border-gray-600'}`}
            >
                <div className="font-bold font-mono text-sm mb-1 text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    {t.formatAdvanced}
                </div>
                <div className="text-[10px] text-gray-400">{t.formatAdvancedDesc}</div>
            </button>
        </div>
      </div>

      {/* ROW 4: GENERATION BUTTONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            
            {/* 1. MUNDO */}
            <button 
                onClick={() => onGenerate(false, NarrativeMode.WORLD)} // Changed to false (No AI) by default
                disabled={isGenerating || (!config.styleReference && !config.extractedStyle) || !config.civilization}
                className={`relative p-6 rounded-lg text-left transition-all border group overflow-hidden
                ${(!config.styleReference && !config.extractedStyle) ? 'bg-gray-900 border-gray-800 opacity-50 cursor-not-allowed' : 'bg-cyan-900/20 border-cyan-500/30 hover:bg-cyan-900/40 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]'}
                `}
            >
                <div className="text-2xl mb-2">🌍</div>
                <div className="font-mono font-bold text-sm tracking-widest text-cyan-400 mb-1">GENERAR MUNDO</div>
                <p className="text-[10px] text-cyan-200/50 leading-tight">Pack completo de Escenarios Vacíos: Mapa Cenital + Mapa Isométrico (Zoom Detalle) + 6 Interiores/Exteriores Sin Personajes.</p>
                {isGenerating && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>}
            </button>

            {/* 2. UI */}
            <button 
                onClick={() => onGenerate(false, NarrativeMode.UI)} // Changed to false (No AI) by default
                disabled={isGenerating || (!config.styleReference && !config.extractedStyle)}
                className={`relative p-6 rounded-lg text-left transition-all border group overflow-hidden
                ${(!config.styleReference && !config.extractedStyle) ? 'bg-gray-900 border-gray-800 opacity-50 cursor-not-allowed' : 'bg-purple-900/20 border-purple-500/30 hover:bg-purple-900/40 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]'}
                `}
            >
                <div className="text-2xl mb-2">🔮</div>
                <div className="font-mono font-bold text-sm tracking-widest text-purple-400 mb-1">GENERAR INTERFAZ DE JUEGO</div>
                <p className="text-[10px] text-purple-200/50 leading-tight">Kit completo de UI: Botones, Ventanas de Diálogo, Iconos y Paneles. Layout en rejilla limpio.</p>
            </button>

            {/* 3. PERSONAJES */}
            <button 
                onClick={() => onGenerate(false, NarrativeMode.CHARACTERS)} // Changed to false (No AI) by default
                disabled={isGenerating || (!config.styleReference && !config.extractedStyle) || !config.civilization}
                className={`relative p-6 rounded-lg text-left transition-all border group overflow-hidden
                ${(!config.styleReference && !config.extractedStyle) ? 'bg-gray-900 border-gray-800 opacity-50 cursor-not-allowed' : 'bg-pink-900/20 border-pink-500/30 hover:bg-pink-900/40 hover:border-pink-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.1)]'}
                `}
            >
                <div className="text-2xl mb-2">⚔️</div>
                <div className="font-mono font-bold text-sm tracking-widest text-pink-400 mb-1">GENERAR PERSONAJES</div>
                <p className="text-[10px] text-pink-200/50 leading-tight">Hoja de diseño completa: Héroes (3 poses), Villanos, NPCs y Mascotas. Optimizado para evitar solapamientos.</p>
            </button>

      </div>

    </div>
  );
};

export default NarrativeView;
