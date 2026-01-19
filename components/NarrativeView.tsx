
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapConfig, Language, NarrativeMode, ThemeMode, PromptType, StyleMode } from '../types';
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

// --- EXTRACTED COMPONENTS (STABLE IDENTITY) ---

const SimpleInput = React.memo(({ label, value, onChangeVal, placeholder }: { label: string, value: string, onChangeVal: (val: string) => void, placeholder: string }) => (
  <div className="mb-4">
      <label className="block text-[10px] text-gray-500 mb-1 font-mono uppercase font-bold">{label}</label>
      <input 
          type="text"
          value={value}
          onChange={(e) => onChangeVal(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-gray-900/50 border border-gray-700 p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent-400 rounded-sm transition-colors"
      />
  </div>
));

const SmartSelect = React.memo(({ 
  label, 
  value, 
  options, 
  onChangeVal, 
  disabled = false, 
  placeholder = "Escribe tu opción personalizada...",
  allowManual = true,
  noneOptionText
}: { 
  label: string, 
  value: string, 
  options: string[], 
  onChangeVal: (val: string) => void, 
  disabled?: boolean, 
  placeholder?: string,
  allowManual?: boolean,
  noneOptionText: string
}) => {
  const isManual = value && !options.includes(value);
  
  return (
    <div className="mb-4">
        <label className={`block text-[10px] text-gray-500 mb-1 font-mono uppercase font-bold ${disabled ? 'opacity-50' : ''}`}>{label}</label>
        <div className="relative">
            <select 
                value={isManual ? "MANUAL_OVERRIDE" : value} 
                onChange={(e) => { 
                    playTechClick(); 
                    if (e.target.value === "MANUAL_OVERRIDE") {
                        onChangeVal(""); // Clear value to force manual input appearance
                    } else {
                        onChangeVal(e.target.value); 
                    }
                }}
                disabled={disabled}
                className={`w-full bg-gray-950 border border-gray-800 p-3 text-sm text-gray-200 outline-none focus:border-accent-500 transition-colors rounded-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <option value="">{noneOptionText}</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
                {allowManual && <option value="MANUAL_OVERRIDE" className="text-accent-400 font-bold bg-gray-900">✏️ INPUT MANUAL / OTRO</option>}
            </select>
        </div>
        
        {/* MANUAL INPUT BOX */}
        {isManual && allowManual && (
            <div className="mt-2 animate-fade-in">
                <input 
                    type="text"
                    value={value}
                    onChange={(e) => onChangeVal(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-accent-900/10 border border-accent-500/50 p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-400 rounded-sm"
                    autoFocus
                />
            </div>
        )}
    </div>
  );
});

const NarrativeView: React.FC<NarrativeViewProps> = ({ config, onChange, lang, onGenerate, isGenerating, onRandom, promptType, setPromptType }) => {
  const t = C.UI_TEXT[lang];
  const [pois, setPois] = useState<string[]>(config.manualPOIs || Array(6).fill(''));
  const [isLoadingPois, setIsLoadingPois] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const theme = config.themeMode || ThemeMode.FANTASY;
  const styleMode = config.styleMode || StyleMode.ASSISTED;

  // Generate random placeholders for Custom Mode on mount
  const placeholders = useMemo(() => {
      const civs = [
          "Un país de plátanos", 
          "Monos salvajes con smoking", 
          "Alienígenas con cabeza de perro", 
          "Sociedad de tostadoras sintientes", 
          "Caballeros montados en caracoles gigantes",
          "Piratas informáticos del siglo XVIII"
      ];
      const eras = [
          "Año 3000 (pero sin tecnología)", 
          "La Era del Hielo de Vainilla", 
          "Tiempo detenido a las 5:00 PM", 
          "Prehistoria con láseres"
      ];
      const places = [
          "Ciudad construida sobre una tortuga", 
          "Oficina burocrática infinita", 
          "Supermercado laberíntico", 
          "Nube de algodón de azúcar tóxica",
          "Volcán de chocolate"
      ];
      const buildings = [
          "Rascacielos de naipes", 
          "Búnker de peluche", 
          "Templo dedicado al WiFi", 
          "Fábrica de arcoíris líquidos"
      ];
      
      const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

      return {
          civ: getRandom(civs),
          era: getRandom(eras),
          place: getRandom(places),
          build: getRandom(buildings)
      };
  }, []);

  // --- DYNAMIC LIST LOGIC ---
  const civList = theme === ThemeMode.FANTASY ? C.FANTASY_RACES : C.HISTORICAL_CIVS;
  
  // DETERMINE CONTEXT (Space / Future)
  const isFutureContext = (config.era && (config.era.includes('Futuro') || config.era.includes('Cyberpunk') || config.era.includes('Año 4000'))) || false;
  
  const placeList = useMemo(() => {
    if (theme === ThemeMode.FANTASY) {
        return C.PLACES_BY_CIV[config.civilization] || C.PLACES_BY_CIV['DEFAULT'];
    }
    // Historical uses Locations, but filters by Era
    if (isFutureContext) {
        return C.LOCATIONS; // Includes Space
    }
    // Remove Space locations for ancient history
    return C.LOCATIONS.filter(l => !l.includes('Espacio') && !l.includes('Planeta') && !l.includes('Lunar'));
  }, [config.civilization, theme, isFutureContext]);

  const buildingList = useMemo(() => {
      if (isFutureContext || (config.placeType && (config.placeType.includes('Espacio') || config.placeType.includes('Planeta')))) {
          return C.SPACE_BUILDINGS_LIST;
      }
      return theme === ThemeMode.FANTASY ? C.FANTASY_BUILDINGS : C.HISTORICAL_BUILDINGS;
  }, [theme, isFutureContext, config.placeType]);

  // Sync internal POIs with config
  useEffect(() => {
    if (config.manualPOIs && config.manualPOIs.length > 0) {
        setPois(prev => {
             if (prev[0] === '' && config.manualPOIs && config.manualPOIs[0] !== '') return config.manualPOIs;
             return prev;
        });
    }
  }, [config.manualPOIs]);

  // OFFLINE AUTO-POIS: Update when context changes (Only for standard themes)
  useEffect(() => {
    if (theme === ThemeMode.CUSTOM) return; // Don't overwrite custom input
    if (config.civilization || config.era || config.placeType) {
         // Smart predefined selection
         const predefined = C.getPredefinedPOIs(config.civilization, config.era, config.placeType, config.buildingType);
         // Update only if significant change or empty
         setPois(predefined);
         onChange('manualPOIs', predefined);
    }
  }, [config.civilization, config.placeType, config.era, config.buildingType, theme]);

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
    // Clear values when switching to ensure clean slate
    onChange('civilization', '');
    onChange('era', '');
    onChange('placeType', '');
    onChange('buildingType', '');
    playSwitch();
  };

  const handleStyleModeToggle = (newMode: StyleMode) => {
      onChange('styleMode', newMode);
      playSwitch();
  };

  const handleWizardChange = (field: keyof MapConfig, value: string) => {
    playTechClick();
    onChange(field, value);
    if (field === 'styleCategory') {
        onChange('styleReference', '');
        onChange('styleVibe', '');
    }
  };

  const processFile = async (file: File) => {
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
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
          processFile(file);
      }
  };

  const clearImage = () => {
      onChange('extractedStyle', undefined);
      onChange('referenceImageBase64', undefined);
      if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getBorderColor = () => {
      if (theme === ThemeMode.FANTASY) return 'border-l-purple-600';
      if (theme === ThemeMode.HISTORICAL) return 'border-l-orange-600';
      return 'border-l-cyan-600'; // Custom
  }

  const getThemeColorClass = (target: ThemeMode) => {
      if (target === ThemeMode.FANTASY) return 'text-purple-300 border-purple-500/30 bg-purple-900/50';
      if (target === ThemeMode.HISTORICAL) return 'text-orange-300 border-orange-500/30 bg-orange-900/50';
      return 'text-cyan-300 border-cyan-500/30 bg-cyan-900/50';
  }

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
            <div className={`bg-gray-900/50 p-5 border border-gray-800 border-l-4 rounded-r-lg ${getBorderColor()} relative transition-colors duration-300`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-sm font-bold text-white font-mono flex items-center gap-2 uppercase tracking-tighter`}>
                        <span className={theme === ThemeMode.FANTASY ? 'text-purple-500' : theme === ThemeMode.HISTORICAL ? 'text-orange-500' : 'text-cyan-500'}>01.</span> {t.scenario}
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

                {/* Theme Toggle (3 Options) */}
                <div className="flex bg-gray-950 border border-gray-800 rounded mb-4 p-0.5">
                    <button 
                        onClick={() => handleThemeToggle(ThemeMode.FANTASY)} 
                        className={`flex-1 py-1.5 text-[10px] font-bold transition-all uppercase tracking-wider rounded-sm ${theme === ThemeMode.FANTASY ? getThemeColorClass(ThemeMode.FANTASY) : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        {t.themeFantasy}
                    </button>
                    <button 
                        onClick={() => handleThemeToggle(ThemeMode.HISTORICAL)} 
                        className={`flex-1 py-1.5 text-[10px] font-bold transition-all uppercase tracking-wider rounded-sm ${theme === ThemeMode.HISTORICAL ? getThemeColorClass(ThemeMode.HISTORICAL) : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        {t.themeHistory}
                    </button>
                    <button 
                        onClick={() => handleThemeToggle(ThemeMode.CUSTOM)} 
                        className={`flex-1 py-1.5 text-[10px] font-bold transition-all uppercase tracking-wider rounded-sm ${theme === ThemeMode.CUSTOM ? getThemeColorClass(ThemeMode.CUSTOM) : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        {t.themeCustom}
                    </button>
                </div>
                
                {theme === ThemeMode.CUSTOM ? (
                    /* CUSTOM MODE: SIMPLE TEXT INPUTS */
                    <div className="animate-fade-in space-y-4">
                        <SimpleInput 
                            label="1A. CIVILIZACIÓN / ENTIDAD (OPCIONAL)" 
                            value={config.civilization || ''} 
                            onChangeVal={(v) => onChange('civilization', v)} 
                            placeholder={`Ej: ${placeholders.civ}`}
                        />
                        <SimpleInput 
                            label="1B. ÉPOCA / ERA (OPCIONAL)" 
                            value={config.era || ''} 
                            onChangeVal={(v) => onChange('era', v)} 
                            placeholder={`Ej: ${placeholders.era}`}
                        />
                         <SimpleInput 
                            label="1C. CONTEXTO / LUGAR (OPCIONAL)" 
                            value={config.placeType || ''} 
                            onChangeVal={(v) => onChange('placeType', v)} 
                            placeholder={`Ej: ${placeholders.place}`}
                        />
                         <SimpleInput 
                            label="1D. EDIFICACIÓN PRINCIPAL (OPCIONAL)" 
                            value={config.buildingType || ''} 
                            onChangeVal={(v) => onChange('buildingType', v)} 
                            placeholder={`Ej: ${placeholders.build}`}
                        />
                    </div>
                ) : (
                    /* STANDARD MODES: SMART SELECTS */
                    <div className="animate-fade-in">
                        {/* 1A. CIVILIZATION */}
                        <SmartSelect 
                            label={theme === ThemeMode.FANTASY ? t.labelRace : t.labelCiv} 
                            value={config.civilization || ''} 
                            options={civList} 
                            onChangeVal={(v) => onChange('civilization', v)} 
                            placeholder="Escribe el nombre de la civilización..."
                            noneOptionText={t.noneOption}
                        />

                        {/* 1B. ERA (Only Historical) */}
                        {theme === ThemeMode.HISTORICAL && (
                            <SmartSelect 
                                label={t.labelEra} 
                                value={config.era || ''} 
                                options={C.HISTORICAL_ERAS} 
                                onChangeVal={(v) => onChange('era', v)} 
                                placeholder="Define la época temporal..."
                                noneOptionText={t.noneOption}
                            />
                        )}

                        {/* 1C. GEOLOCATION */}
                        <SmartSelect 
                            label={t.labelGeo} 
                            value={config.placeType || ''} 
                            options={placeList} 
                            onChangeVal={(v) => onChange('placeType', v)} 
                            placeholder="¿Dónde ocurre esto?"
                            noneOptionText={t.noneOption}
                        />

                        {/* 1D. EDIFICATION */}
                        <SmartSelect 
                            label={t.labelSettlement} 
                            value={config.buildingType || ''} 
                            options={buildingList} 
                            onChangeVal={(v) => onChange('buildingType', v)} 
                            placeholder="Tipo de estructura principal..."
                            allowManual={false} // Manual input disabled for standard modes
                            noneOptionText={t.noneOption}
                        />
                    </div>
                )}
            </div>

            {/* BLOQUE 2: ADN VISUAL (3-TAB SYSTEM) */}
            <div className={`bg-gray-900/50 p-5 border border-gray-800 border-l-4 rounded-r-lg ${getBorderColor()} transition-colors duration-300`}>
                <div className="flex justify-between items-center mb-4">
                     <h3 className={`text-sm font-bold text-white font-mono uppercase tracking-tighter flex items-center gap-2`}>
                        <span className={theme === ThemeMode.FANTASY ? 'text-purple-500' : theme === ThemeMode.HISTORICAL ? 'text-orange-500' : 'text-cyan-500'}>02.</span> ADN VISUAL
                    </h3>
                </div>
                
                {/* Style Mode Toggle */}
                <div className="flex bg-gray-950 border border-gray-800 rounded mb-4 p-0.5">
                    <button onClick={() => handleStyleModeToggle(StyleMode.ASSISTED)} className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-sm transition-all ${styleMode === StyleMode.ASSISTED ? 'bg-gray-800 text-white' : 'text-gray-500'}`}>{t.styleAssisted}</button>
                    <button onClick={() => handleStyleModeToggle(StyleMode.REF_IMAGE)} className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-sm transition-all ${styleMode === StyleMode.REF_IMAGE ? 'bg-gray-800 text-white' : 'text-gray-500'}`}>{t.styleVisualRef}</button>
                    <button onClick={() => handleStyleModeToggle(StyleMode.MANUAL)} className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-sm transition-all ${styleMode === StyleMode.MANUAL ? 'bg-gray-800 text-white' : 'text-gray-500'}`}>{t.styleCustom}</button>
                </div>

                {/* TAB CONTENT: ASSISTED */}
                {styleMode === StyleMode.ASSISTED && (
                    <div className="animate-fade-in space-y-4">
                        <SmartSelect label="2A. CATEGORÍA" value={config.styleCategory || ''} options={C.STYLE_WIZARD_DATA.categories} onChangeVal={(v) => handleWizardChange('styleCategory', v)} noneOptionText={t.noneOption} />
                        <SmartSelect label="2B. REFERENTE VISUAL" value={config.styleReference || ''} options={config.styleCategory ? C.STYLE_WIZARD_DATA.references[config.styleCategory]?.map(r => r.label) || [] : []} onChangeVal={(v) => handleWizardChange('styleReference', v)} disabled={!config.styleCategory} noneOptionText={t.noneOption} />
                        <SmartSelect label="2C. SENSACIÓN / ATMÓSFERA" value={config.styleVibe || ''} options={C.STYLE_WIZARD_DATA.vibes.map(v => v.label)} onChangeVal={(v) => handleWizardChange('styleVibe', v)} disabled={!config.styleReference} noneOptionText={t.noneOption} />
                    </div>
                )}

                {/* TAB CONTENT: VISUAL REF (DRAG & DROP) */}
                {styleMode === StyleMode.REF_IMAGE && (
                    <div className="animate-fade-in">
                        {config.referenceImageBase64 ? (
                            <div className="relative border border-green-900/50 rounded bg-gray-950/50 p-4 text-center">
                                <img src={config.referenceImageBase64} alt="Ref" className="h-32 mx-auto rounded border border-gray-700 object-cover mb-3" />
                                <div className="text-[9px] font-bold text-green-500 uppercase tracking-wider mb-2">✅ {t.styleExtracted}</div>
                                <textarea readOnly value={config.extractedStyle || ''} className="w-full h-16 bg-transparent text-[10px] text-gray-400 border-none resize-none text-center focus:ring-0" />
                                <button onClick={clearImage} className="absolute top-2 right-2 text-gray-500 hover:text-red-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                            </div>
                        ) : (
                            <div 
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all gap-3 ${isDragging ? 'border-green-500 bg-green-900/20' : 'border-gray-700 hover:border-accent-500/50 hover:bg-gray-900'}`}
                            >
                                <div className="text-3xl">{isDragging ? '📂' : '📸'}</div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{isDragging ? "SUELTA LA IMAGEN" : t.uploadDragDrop}</div>
                                <p className="text-[9px] text-gray-600">{t.uploadRefDesc}</p>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </div>
                        )}
                        {isAnalyzingImage && <div className="text-center mt-2 text-xs font-mono text-accent-400 animate-pulse">{t.analyzingStyle}</div>}
                    </div>
                )}

                {/* TAB CONTENT: MANUAL */}
                {styleMode === StyleMode.MANUAL && (
                    <div className="animate-fade-in">
                        <label className="block text-[10px] text-gray-500 mb-2 font-mono uppercase font-bold">DESCRIPCIÓN DE ESTILO MANUAL</label>
                        <textarea 
                            value={config.manualStyle || ''}
                            onChange={(e) => onChange('manualStyle', e.target.value)}
                            placeholder={t.manualStylePlaceholder}
                            className="w-full h-48 bg-gray-900/50 border border-gray-700 p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent-400 rounded-sm resize-none leading-relaxed"
                        />
                    </div>
                )}
            </div>
      </div>

      {/* ROW 2: POIS (FULL WIDTH) */}
      <div className={`mb-8 bg-gray-900/50 p-6 border border-gray-800 border-t-4 rounded-lg ${getBorderColor()} transition-colors duration-300`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className={`text-sm font-bold text-white font-mono uppercase tracking-tighter flex items-center gap-2`}>
                    <span className={theme === ThemeMode.FANTASY ? 'text-purple-500' : theme === ThemeMode.HISTORICAL ? 'text-orange-500' : 'text-cyan-500'}>03.</span> {t.poiTitle}
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

      {/* AI RECOMMENDATION WARNING */}
      {(theme === ThemeMode.CUSTOM || styleMode === StyleMode.MANUAL) && (
          <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded flex items-start gap-3 animate-slide-up">
              <span className="text-xl">⚠️</span>
              <p className="text-xs text-yellow-200/80 font-mono leading-relaxed mt-1">
                  {t.customInputWarning}
              </p>
          </div>
      )}

      {/* ROW 4: GENERATION BUTTONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            
            {/* 1. MUNDO */}
            <button 
                onClick={() => onGenerate(false, NarrativeMode.WORLD)} // Changed to false (No AI) by default
                disabled={isGenerating || (!config.civilization)}
                className={`relative p-6 rounded-lg text-left transition-all border group overflow-hidden
                ${(!config.civilization) ? 'bg-gray-900 border-gray-800 opacity-50 cursor-not-allowed' : 'bg-cyan-900/20 border-cyan-500/30 hover:bg-cyan-900/40 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]'}
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
                disabled={isGenerating}
                className={`relative p-6 rounded-lg text-left transition-all border group overflow-hidden
                ${isGenerating ? 'bg-gray-900 border-gray-800 opacity-50 cursor-not-allowed' : 'bg-purple-900/20 border-purple-500/30 hover:bg-purple-900/40 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]'}
                `}
            >
                <div className="text-2xl mb-2">🔮</div>
                <div className="font-mono font-bold text-sm tracking-widest text-purple-400 mb-1">GENERAR INTERFAZ DE JUEGO</div>
                <p className="text-[10px] text-purple-200/50 leading-tight">Kit completo de UI: Botones, Ventanas de Diálogo, Iconos y Paneles. Layout en rejilla limpio.</p>
            </button>

            {/* 3. PERSONAJES */}
            <button 
                onClick={() => onGenerate(false, NarrativeMode.CHARACTERS)} // Changed to false (No AI) by default
                disabled={isGenerating || (!config.civilization)}
                className={`relative p-6 rounded-lg text-left transition-all border group overflow-hidden
                ${(!config.civilization) ? 'bg-gray-900 border-gray-800 opacity-50 cursor-not-allowed' : 'bg-pink-900/20 border-pink-500/30 hover:bg-pink-900/40 hover:border-pink-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.1)]'}
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
