
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { MapConfig, Language, MediaType, ThemeMode, PromptType } from '../types';
import { 
    UI_TEXT, 
    FANTASY_RACES, 
    HISTORICAL_CIVS, 
    HISTORICAL_ERAS,
    LOCATIONS, 
    getLocationsByEra,
    getBuildingsByEra,
    FANTASY_BUILDINGS,
    MAP_PERSPECTIVES, 
    SCENE_PERSPECTIVES, 
    VIDEO_MOTIONS,
    STYLE_WIZARD_DATA
} from '../constants';
import { playTechClick, playSwitch } from '../services/audioService';

interface SimpleViewProps {
  config: MapConfig;
  onChange: (field: keyof MapConfig, value: any) => void;
  lang: Language;
  mediaType: MediaType;
  promptType: PromptType;
  setPromptType: (type: PromptType) => void;
  setMediaType: (type: MediaType) => void;
}

const SimpleView: React.FC<SimpleViewProps> = ({ config, onChange, lang, mediaType, promptType, setPromptType, setMediaType }) => {
  const t = UI_TEXT[lang];
  const [activeStep, setActiveStep] = useState(1);
  const [wizardStep, setWizardStep] = useState(0); // 0=Category, 1=Ref, 2=Vibe, 3=Detail, 4=Clarity, 5=Finish

  // Refs for sequential scrolling
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const stepEraRef = useRef<HTMLDivElement>(null); 
  const step4Ref = useRef<HTMLDivElement>(null);
  const step5Ref = useRef<HTMLDivElement>(null);
  const step6Ref = useRef<HTMLDivElement>(null);
  const step7Ref = useRef<HTMLDivElement>(null);
  const step8Ref = useRef<HTMLDivElement>(null); // Format (Img/Video)
  const step9Ref = useRef<HTMLDivElement>(null); // Motion (Conditional)
  const step10Ref = useRef<HTMLDivElement>(null); // Platform

  // Auto-scroll helper
  const scrollToStep = (stepNumber: number, ref: React.RefObject<HTMLDivElement | null>) => {
    setActiveStep(Math.max(activeStep, stepNumber));
    setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleSelection = (step: number, field: keyof MapConfig, value: any, nextRef: React.RefObject<HTMLDivElement | null>) => {
    playTechClick();
    
    // TOGGLE LOGIC: If value matches current config, deselect it (set to empty/undefined)
    if (config[field] === value) {
        onChange(field, typeof value === 'string' ? '' : undefined);
        return; // Do not auto-scroll on deselect
    }

    onChange(field, value);
    if (nextRef) {
        scrollToStep(step + 1, nextRef);
    }
  };

  const handleSkip = (step: number, field: keyof MapConfig, nextRef: React.RefObject<HTMLDivElement | null>) => {
    playTechClick();
    onChange(field, ''); // Clear value
    if (nextRef) {
        scrollToStep(step + 1, nextRef);
    }
  };

  // Determine lists dynamically
  const isFantasy = config.themeMode === ThemeMode.FANTASY;
  const isHistorical = config.themeMode === ThemeMode.HISTORICAL;
  const civList = isFantasy ? FANTASY_RACES : HISTORICAL_CIVS;
  const perspectiveList = config.assetType === 'MAP' ? MAP_PERSPECTIVES : SCENE_PERSPECTIVES;
  const isVideo = mediaType === MediaType.VIDEO;

  // DYNAMIC LISTS based on ERA (only for Historical mode)
  const currentLocationList = isFantasy ? LOCATIONS : getLocationsByEra(config.era);
  const currentBuildingList = isFantasy ? FANTASY_BUILDINGS : getBuildingsByEra(config.era);

  // --- STYLE WIZARD HANDLERS (BLOCK 6) ---
  const handleWizardReset = () => {
    playSwitch();
    setWizardStep(0);
    onChange('styleCategory', undefined);
    onChange('styleReference', undefined);
    onChange('styleVibe', undefined);
    onChange('styleDetail', undefined);
    onChange('styleClarity', undefined);
    onChange('styleFinish', undefined);
    onChange('artStyle', ''); // Clear legacy
  };

  const handleWizardStep = (field: keyof MapConfig, value: string) => {
    playTechClick();
    
    // TOGGLE LOGIC FOR WIZARD
    if (config[field] === value) {
        onChange(field, undefined);
        return;
    }

    // Cascade reset logic
    if (field === 'styleCategory') {
        setWizardStep(1);
        onChange('styleReference', undefined);
        onChange('styleVibe', undefined);
        onChange('styleDetail', undefined);
        onChange('styleClarity', undefined);
        onChange('styleFinish', undefined);
    } else if (field === 'styleReference') {
        setWizardStep(2);
        onChange('styleVibe', undefined);
        onChange('styleDetail', undefined);
        onChange('styleClarity', undefined);
        onChange('styleFinish', undefined);
        onChange('artStyle', value); // Map reference to legacy field for compatibility
    } else if (field === 'styleVibe') {
        setWizardStep(3);
        onChange('styleDetail', undefined);
        onChange('styleClarity', undefined);
        onChange('styleFinish', undefined);
    } else if (field === 'styleDetail') {
        setWizardStep(4);
        onChange('styleClarity', undefined);
        onChange('styleFinish', undefined);
    } else if (field === 'styleClarity') {
        setWizardStep(5);
        onChange('styleFinish', undefined);
    }

    onChange(field, value);
    
    // If complete (field is Finish), trigger scroll to next block
    if (field === 'styleFinish') {
        scrollToStep(7, step7Ref);
    }
  };

  const handleWizardSkip = (field: keyof MapConfig, nextStepIdx: number) => {
      playTechClick();
      onChange(field, ''); // Clear
      setWizardStep(nextStepIdx);
      if (field === 'styleFinish') {
        scrollToStep(7, step7Ref);
      }
  };

  const SkipBtn = ({ onClick }: { onClick: () => void }) => (
      <button 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className="text-[9px] text-gray-500 hover:text-white underline decoration-dotted uppercase tracking-wider ml-auto transition-colors"
      >
          SALTAR
      </button>
  );

  // --- RENDERS ---

  const renderBlock1 = () => (
    <div ref={step1Ref} className="mb-12 animate-fade-in">
        <h3 className="text-sm font-mono font-bold text-accent-400 mb-4 uppercase tracking-widest flex items-center">
             <span className="w-6 h-6 bg-accent-900 text-white rounded-full flex items-center justify-center mr-3 text-[10px]">1</span> 
             {t.stepScale}
        </h3>
        <div className="grid grid-cols-2 gap-4">
            <button
                onClick={() => handleSelection(1, 'assetType', 'MAP', step2Ref)}
                className={`h-24 rounded border flex flex-col items-center justify-center gap-2 transition-all ${config.assetType === 'MAP' ? 'bg-accent-900/40 border-accent-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600'}`}
            >
                <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                <span className="font-bold font-mono text-xs">MAPA TÁCTICO</span>
            </button>
            <button
                onClick={() => handleSelection(1, 'assetType', 'SCENE', step2Ref)}
                className={`h-24 rounded border flex flex-col items-center justify-center gap-2 transition-all ${config.assetType === 'SCENE' ? 'bg-cyan-900/40 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600'}`}
            >
                <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="font-bold font-mono text-xs">ESCENA / POI</span>
            </button>
        </div>
    </div>
  );

  const renderBlock2 = () => {
      if (!config.assetType) return null;
      return (
        <div ref={step2Ref} className="mb-12 animate-fade-in scroll-mt-24">
            <h3 className="text-sm font-mono font-bold text-accent-400 mb-4 uppercase tracking-widest flex items-center">
                <span className="w-6 h-6 bg-accent-900 text-white rounded-full flex items-center justify-center mr-3 text-[10px]">2</span> 
                {t.stepTheme}
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => handleSelection(2, 'themeMode', ThemeMode.FANTASY, step3Ref)}
                    className={`p-4 rounded border text-left transition-all ${isFantasy ? 'bg-purple-900/20 border-purple-500 text-white' : 'bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-600'}`}
                >
                    <div className="font-bold font-mono text-xs mb-1 text-purple-400">FANTASÍA</div>
                    <div className="text-[10px] opacity-70">Elfos, Orcos, Magia...</div>
                </button>
                <button
                    onClick={() => handleSelection(2, 'themeMode', ThemeMode.HISTORICAL, step3Ref)}
                    className={`p-4 rounded border text-left transition-all ${!isFantasy ? 'bg-orange-900/20 border-orange-500 text-white' : 'bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-600'}`}
                >
                    <div className="font-bold font-mono text-xs mb-1 text-orange-400">HISTÓRICO</div>
                    <div className="text-[10px] opacity-70">Roma, Vikingos, Japón...</div>
                </button>
            </div>
        </div>
      );
  };

  const renderBlock3 = () => {
    if (!config.assetType) return null;
    const nextRef = isHistorical ? stepEraRef : step4Ref;
    return (
        <div ref={step3Ref} className={`mb-12 transition-all duration-500 scroll-mt-24 ${activeStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none'}`}>
             <h3 className="text-sm font-mono font-bold text-accent-400 mb-4 uppercase tracking-widest flex items-center">
                <span className="w-6 h-6 bg-accent-900 text-white rounded-full flex items-center justify-center mr-3 text-[10px]">3</span> 
                {t.stepCiv}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {civList.map(item => (
                    <button
                        key={item}
                        onClick={() => handleSelection(3, 'civilization', item, nextRef)}
                        className={`px-2 py-3 text-[10px] font-medium transition-all duration-200 border rounded
                        ${config.civilization === item ? 'bg-accent-900/40 border-accent-400 text-white' : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600'}`}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
  };

  const renderBlockEra = () => {
      if (!isHistorical) return null;
      return (
        <div ref={stepEraRef} className={`mb-12 transition-all duration-500 scroll-mt-24 ${activeStep >= 3 && config.civilization ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none'}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-mono font-bold text-orange-400 uppercase tracking-widest flex items-center">
                    <span className="w-6 h-6 bg-orange-900 text-white rounded-full flex items-center justify-center mr-3 text-[10px]">3B</span> 
                    {t.stepEra}
                </h3>
                <SkipBtn onClick={() => handleSkip(3, 'era', step4Ref)} />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {HISTORICAL_ERAS.map(item => (
                    <button
                        key={item}
                        onClick={() => handleSelection(3, 'era', item, step4Ref)}
                        className={`px-2 py-3 text-[10px] font-medium transition-all duration-200 border rounded
                        ${config.era === item ? 'bg-orange-900/40 border-orange-400 text-white' : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600'}`}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
      );
  }

  const renderBlock4 = () => (
    <div ref={step4Ref} className={`mb-12 transition-all duration-500 scroll-mt-24 ${activeStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none'}`}>
        <h3 className="text-sm font-mono font-bold text-accent-400 mb-4 uppercase tracking-widest flex items-center">
            <span className="w-6 h-6 bg-accent-900 text-white rounded-full flex items-center justify-center mr-3 text-[10px]">4</span> 
            {t.stepPlace}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {currentLocationList.map(item => (
                <button
                    key={item}
                    onClick={() => handleSelection(4, 'placeType', item, step5Ref)}
                    className={`px-2 py-3 text-[10px] font-medium transition-all duration-200 border rounded
                    ${config.placeType === item ? 'bg-accent-900/40 border-accent-400 text-white' : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600'}`}
                >
                    {item}
                </button>
            ))}
        </div>
    </div>
  );

  const renderBlock5 = () => (
    <div ref={step5Ref} className={`mb-12 transition-all duration-500 scroll-mt-24 ${activeStep >= 5 ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none'}`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-mono font-bold text-accent-400 uppercase tracking-widest flex items-center">
                <span className="w-6 h-6 bg-accent-900 text-white rounded-full flex items-center justify-center mr-3 text-[10px]">5</span> 
                {t.stepBuild}
            </h3>
            <SkipBtn onClick={() => handleSkip(5, 'buildingType', step6Ref)} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {currentBuildingList.map(item => (
                <button
                    key={item}
                    onClick={() => handleSelection(5, 'buildingType', item, step6Ref)}
                    className={`px-2 py-3 text-[10px] font-medium transition-all duration-200 border rounded
                    ${config.buildingType === item ? 'bg-accent-900/40 border-accent-400 text-white' : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600'}`}
                >
                    {item}
                </button>
            ))}
        </div>
    </div>
  );

  const renderBlock6 = () => (
    <div ref={step6Ref} className={`mb-12 transition-all duration-500 scroll-mt-24 ${activeStep >= 6 ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none'}`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-mono font-bold text-accent-400 uppercase tracking-widest flex items-center">
                <span className="w-6 h-6 bg-accent-900 text-white rounded-full flex items-center justify-center mr-3 text-[10px]">6</span> 
                {t.stepStyle}
            </h3>
            {config.styleCategory && (
                <button onClick={handleWizardReset} className="text-[9px] text-gray-500 hover:text-white uppercase font-bold tracking-wider">
                    RESET ESTILO
                </button>
            )}
        </div>
        
        <div className="bg-gray-900/30 border border-gray-800 p-4 rounded-lg space-y-6">
            {/* 6A */}
            <div>
                <h4 className="text-[10px] font-mono font-bold text-gray-500 mb-2 uppercase">6A. ¿A qué se parece este mundo?</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {STYLE_WIZARD_DATA.categories.map(cat => (
                        <button key={cat} onClick={() => handleWizardStep('styleCategory', cat)} className={`px-2 py-2 text-[10px] font-medium border rounded transition-all ${config.styleCategory === cat ? 'bg-purple-900/40 border-purple-400 text-white' : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600'}`}>{cat}</button>
                    ))}
                </div>
            </div>
            {/* 6B */}
            <div className={`transition-all duration-300 ${wizardStep < 1 ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex justify-between items-center mb-2">
                     <h4 className="text-[10px] font-mono font-bold text-gray-500 uppercase">6B. Elige un referente visual</h4>
                     <SkipBtn onClick={() => handleWizardSkip('styleReference', 2)} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {config.styleCategory && STYLE_WIZARD_DATA.references[config.styleCategory]?.map(ref => (
                        <button key={ref.label} onClick={() => handleWizardStep('styleReference', ref.label)} className={`px-2 py-2 text-[10px] font-medium border rounded transition-all flex flex-col items-center justify-center h-16 ${config.styleReference === ref.label ? 'bg-purple-900/40 border-purple-400 text-white' : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600'}`}><span className="font-bold leading-tight">{ref.label}</span><span className="text-[8px] opacity-60 font-normal leading-tight mt-1">{ref.desc}</span></button>
                    ))}
                </div>
            </div>
            {/* 6C */}
            <div className={`transition-all duration-300 ${wizardStep < 2 ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex justify-between items-center mb-2">
                     <h4 className="text-[10px] font-mono font-bold text-gray-500 uppercase">6C. ¿Qué sensación transmite?</h4>
                     <SkipBtn onClick={() => handleWizardSkip('styleVibe', 3)} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {STYLE_WIZARD_DATA.vibes.map(v => (
                        <button key={v.label} onClick={() => handleWizardStep('styleVibe', v.label)} className={`px-2 py-2 text-[10px] font-medium border rounded transition-all ${config.styleVibe === v.label ? 'bg-purple-900/40 border-purple-400 text-white' : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600'}`}>{v.label}</button>
                    ))}
                </div>
            </div>
            {/* 6D */}
            <div className={`transition-all duration-300 ${wizardStep < 3 ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-[10px] font-mono font-bold text-gray-500 uppercase">6D. Nivel de detalle</h4>
                    <SkipBtn onClick={() => handleWizardSkip('styleDetail', 4)} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {STYLE_WIZARD_DATA.details.map(d => (
                        <button key={d.label} onClick={() => handleWizardStep('styleDetail', d.label)} className={`px-2 py-2 text-[10px] font-medium border rounded transition-all ${config.styleDetail === d.label ? 'bg-purple-900/40 border-purple-400 text-white' : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600'}`}>{d.label}</button>
                    ))}
                </div>
            </div>
            {/* 6E */}
             <div className={`transition-all duration-300 ${wizardStep < 4 ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-[10px] font-mono font-bold text-gray-500 uppercase">6E. Claridad del entorno</h4>
                    <SkipBtn onClick={() => handleWizardSkip('styleClarity', 5)} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {STYLE_WIZARD_DATA.clarity.map(c => (
                        <button key={c.label} onClick={() => handleWizardStep('styleClarity', c.label)} className={`px-2 py-2 text-[10px] font-medium border rounded transition-all ${config.styleClarity === c.label ? 'bg-purple-900/40 border-purple-400 text-white' : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600'}`}>{c.label}</button>
                    ))}
                </div>
            </div>
            {/* 6F */}
             <div className={`transition-all duration-300 ${wizardStep < 5 ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-[10px] font-mono font-bold text-gray-500 uppercase">6F. Acabado visual final</h4>
                    <SkipBtn onClick={() => handleWizardSkip('styleFinish', 6)} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {STYLE_WIZARD_DATA.finish.map(f => (
                        <button key={f.label} onClick={() => handleWizardStep('styleFinish', f.label)} className={`px-2 py-2 text-[10px] font-medium border rounded transition-all ${config.styleFinish === f.label ? 'bg-purple-900/40 border-purple-400 text-white' : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600'}`}>{f.label}</button>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );

  const renderBlock7 = () => (
    <div ref={step7Ref} className={`mb-12 transition-all duration-500 scroll-mt-24 ${activeStep >= 7 ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none'}`}>
        <h3 className="text-sm font-mono font-bold text-accent-400 mb-4 uppercase tracking-widest flex items-center">
            <span className="w-6 h-6 bg-accent-900 text-white rounded-full flex items-center justify-center mr-3 text-[10px]">7</span> 
            {t.stepCamera}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {perspectiveList.map(item => (
                <button
                    key={item}
                    onClick={() => handleSelection(7, 'camera', item, step8Ref)}
                    className={`px-2 py-3 text-[10px] font-medium transition-all duration-200 border rounded
                    ${config.camera === item ? 'bg-accent-900/40 border-accent-400 text-white' : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600'}`}
                >
                    {item}
                </button>
            ))}
        </div>
    </div>
  );

  // === NEW BLOCK 8: OUTPUT FORMAT (IMAGE / VIDEO) ===
  const renderBlock8 = () => (
      <div ref={step8Ref} className={`mb-12 transition-all duration-500 scroll-mt-24 ${activeStep >= 7 && config.camera ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none'}`}>
        <h3 className="text-sm font-mono font-bold text-accent-400 mb-4 uppercase tracking-widest flex items-center">
             <span className="w-6 h-6 bg-accent-900 text-white rounded-full flex items-center justify-center mr-3 text-[10px]">8</span> 
             {t.stepFormat}
        </h3>
        <div className="flex gap-4">
            <button
                onClick={() => { playTechClick(); setMediaType(MediaType.IMAGE); scrollToStep(10, step10Ref); }}
                className={`flex-1 p-6 rounded border text-center transition-all group relative overflow-hidden
                ${mediaType === MediaType.IMAGE ? 'bg-blue-900/30 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-gray-950 border-gray-800 hover:border-gray-600'}`}
            >
                <div className="text-3xl mb-2">🖼️</div>
                <div className={`font-bold font-mono text-sm tracking-widest ${mediaType === MediaType.IMAGE ? 'text-blue-400' : 'text-gray-400'}`}>IMAGEN</div>
            </button>

            <button
                onClick={() => { playTechClick(); setMediaType(MediaType.VIDEO); scrollToStep(9, step9Ref); }}
                className={`flex-1 p-6 rounded border text-center transition-all group relative overflow-hidden
                ${mediaType === MediaType.VIDEO ? 'bg-red-900/30 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-gray-950 border-gray-800 hover:border-gray-600'}`}
            >
                <div className="text-3xl mb-2">🎥</div>
                <div className={`font-bold font-mono text-sm tracking-widest ${mediaType === MediaType.VIDEO ? 'text-red-400' : 'text-gray-400'}`}>VÍDEO</div>
            </button>
        </div>
      </div>
  );

  // === NEW BLOCK 9: VIDEO MOTION (CONDITIONAL) ===
  const renderBlock9 = () => {
      if (mediaType !== MediaType.VIDEO) return null;
      return (
        <div ref={step9Ref} className={`mb-12 transition-all duration-500 scroll-mt-24 ${activeStep >= 8 ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none'}`}>
            <h3 className="text-sm font-mono font-bold text-red-400 mb-2 uppercase tracking-widest flex items-center">
                <span className="w-6 h-6 bg-red-900 text-white rounded-full flex items-center justify-center mr-3 text-[10px]">9</span> 
                {t.stepMotion}
            </h3>
            <p className="text-xs text-gray-500 mb-6 font-mono">{t.stepMotionHelp}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {VIDEO_MOTIONS.map(m => (
                    <button
                        key={m.id}
                        onClick={() => { playTechClick(); onChange('videoMovement', m.label); scrollToStep(10, step10Ref); }}
                        className={`px-3 py-4 text-[10px] font-medium transition-all duration-200 border rounded flex flex-col items-center justify-center gap-1
                        ${config.videoMovement === m.label ? 'bg-red-900/40 border-red-400 text-white shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600'}`}
                    >
                        <span className="font-bold">{m.label}</span>
                    </button>
                ))}
            </div>
        </div>
      );
  };

  // === NEW BLOCK 10: PLATFORM ===
  const renderBlock10 = () => (
      <div ref={step10Ref} className={`mb-12 transition-all duration-500 scroll-mt-24 ${activeStep >= 8 ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none'}`}>
        <h3 className="text-sm font-mono font-bold text-accent-400 mb-2 uppercase tracking-widest flex items-center">
             <span className="w-6 h-6 bg-accent-900 text-white rounded-full flex items-center justify-center mr-3 text-[10px]">10</span> 
             {t.stepPlatform}
        </h3>
        <p className="text-xs text-gray-500 mb-6 font-mono">{t.stepPlatformSubtitle}</p>

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
  );

  return (
    <div className="pb-8 max-w-5xl mx-auto pt-4 px-2">
      {renderBlock1()}
      {renderBlock2()}
      {renderBlock3()}
      {renderBlockEra()}
      {renderBlock4()}
      {renderBlock5()}
      {renderBlock6()}
      {renderBlock7()}
      {renderBlock8()}
      {renderBlock9()}
      {renderBlock10()}
    </div>
  );
};

export default SimpleView;
