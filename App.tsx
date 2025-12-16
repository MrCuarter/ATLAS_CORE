import React, { useState, useEffect } from 'react';
import { AppMode, MediaType, PromptType, MapConfig, Preset, Language, PromptCollectionItem } from './types';
import * as C from './constants';
import SimpleView from './components/SimpleView';
import AdvancedView from './components/AdvancedView';
import NarrativeView from './components/NarrativeView';
import PromptDisplay from './components/PromptDisplay';
import CollectionDisplay from './components/CollectionDisplay';
import { generatePrompt, generateNarrativeCollection, getRandomElement } from './services/promptGenerator';

// Initial state helpers
const getInitialConfig = (): MapConfig => ({
  scale: '', // Default to empty (None)
  placeCategory: 'Civil',
  placeType: '', // Default to empty
  poi: '',
  civilization: '',
  customScenario: '',
  time: '',
  weather: '',
  renderTech: '',
  artStyle: '',
  customAtmosphere: '',
  zoom: '',
  camera: '',
  aspectRatio: '16:9',
  videoMovement: '',
  videoDynamics: '',
  videoRhythm: '',
  videoLoop: true,
  tags: []
});

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.ES);
  const [mode, setMode] = useState<AppMode>(AppMode.SIMPLE);
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.IMAGE);
  const [promptType, setPromptType] = useState<PromptType>(PromptType.GENERIC);
  const [config, setConfig] = useState<MapConfig>(getInitialConfig());
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  
  // Narrative Mode State
  const [narrativeCollection, setNarrativeCollection] = useState<PromptCollectionItem[]>([]);

  // Update prompt whenever config changes (Only for Simple/Advanced modes)
  useEffect(() => {
    if (mode !== AppMode.NARRATIVE) {
        setGeneratedPrompt(generatePrompt(config, mediaType, promptType));
    }
  }, [config, mediaType, promptType, mode]);

  const handleConfigChange = (field: keyof MapConfig, value: any) => {
    setConfig(prev => {
      const newConfig = { ...prev, [field]: value };
      
      // Auto-update dependent fields logic
      if (field === 'placeType') {
         // If place is cleared, clear POI
         if (!value) {
            newConfig.poi = '';
         } else {
             const availablePOIs = C.POI_MAPPING[value as string] || C.POI_MAPPING['DEFAULT'];
             if (!availablePOIs.includes(newConfig.poi)) {
               newConfig.poi = availablePOIs[0]; // Or set to ''? Let's default to first relevant POI if place selected
             }
         }
      }
      return newConfig;
    });
  };

  const applyPreset = (preset: Preset) => {
    setConfig(prev => ({
      ...getInitialConfig(), // Reset to clean slate first
      ...preset.config,
      tags: preset.tags,
      presetName: preset.name
    }));
  };

  const generateSurprise = () => {
    const randomScale = getRandomElement(C.SCALES);
    const randomCat = getRandomElement(C.PLACE_CATEGORIES);
    const randomPlace = getRandomElement(C.PLACES_BY_CATEGORY[randomCat]);
    const randomPoi = getRandomElement(C.POI_MAPPING[randomPlace] || C.POI_MAPPING['DEFAULT']);
    const randomCiv = getRandomElement(C.CIVILIZATIONS);
    const randomTime = getRandomElement(C.TIMES);
    const randomWeather = getRandomElement(C.WEATHERS);
    const randomStyle = getRandomElement(C.ART_STYLES);

    setConfig(prev => ({
      ...getInitialConfig(),
      scale: randomScale,
      placeCategory: randomCat,
      placeType: randomPlace,
      poi: randomPoi,
      civilization: randomCiv,
      time: randomTime,
      weather: randomWeather,
      artStyle: randomStyle,
      presetName: '🎲 ATLAS_RANDOM',
      tags: ['Random', 'SystemGen']
    }));
  };

  // Specific "Secret Place" Logic: Randomize Place/Cat/POI but keep Style
  const handleSecretPlace = () => {
    const randomCat = getRandomElement(C.PLACE_CATEGORIES);
    const randomPlace = getRandomElement(C.PLACES_BY_CATEGORY[randomCat]);
    const availablePOIs = C.POI_MAPPING[randomPlace] || C.POI_MAPPING['DEFAULT'];
    const randomPoi = getRandomElement(availablePOIs);

    // If in Simple mode, we also need to ensure we have *some* style set if it was empty,
    // otherwise the prompt is too bare. 
    setConfig(prev => {
        const base = mode === AppMode.SIMPLE ? (prev.placeType ? prev : getInitialConfig()) : prev;
        
        // If simple mode and no style set, add a default 'Cinematic' style to make it look good
        const styleUpdates = (mode === AppMode.SIMPLE && !base.artStyle) ? {
            artStyle: 'Realista cinematográfico',
            time: 'Mediodía',
            weather: 'Soleado'
        } : {};

        return {
            ...base,
            ...styleUpdates,
            placeCategory: randomCat,
            placeType: randomPlace,
            poi: randomPoi
        };
    });
  };

  const handleNarrativeGeneration = () => {
      if (!config.placeType) {
          alert(lang === Language.ES ? "Selecciona un Lugar primero" : "Select a Place first");
          return;
      }
      const collection = generateNarrativeCollection(config, promptType, lang);
      setNarrativeCollection(collection);
  };

  const t = C.UI_TEXT[lang];

  return (
    <div className="min-h-screen bg-[#020617] text-gray-300 font-sans selection:bg-accent-900 selection:text-white flex flex-col">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#020617]/95 backdrop-blur-md border-b border-gray-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* LEFT: External Links */}
            <div className="flex items-center gap-6">
                 <a 
                  href="https://mistercuarter.es" 
                  className="group flex items-center gap-2 text-[10px] font-mono font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-5 h-5 rounded-sm flex items-center justify-center bg-gray-800 group-hover:bg-accent-600 transition-colors">
                     <svg className="w-3 h-3 text-current group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                     </svg>
                  </div>
                  <span className="hidden sm:inline">Inicio</span>
                </a>
                
                <a 
                  href="https://laboratorio.mistercuarter.es" 
                  className="group flex items-center gap-2 text-[10px] font-mono font-bold text-gray-500 hover:text-purple-400 transition-colors uppercase tracking-widest"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-5 h-5 rounded-sm flex items-center justify-center bg-gray-800 group-hover:bg-purple-600 transition-colors">
                     <svg className="w-3 h-3 text-current group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                     </svg>
                  </div>
                   <span className="hidden sm:inline">Laboratorio</span>
                </a>
            </div>

            {/* RIGHT: Branding + Language */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center text-accent-400">
                         <svg className="w-full h-full drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="12" r="2" fill="currentColor" />
                        </svg>
                    </div>
                    <div className="hidden md:block">
                         <h1 className="text-lg font-bold text-white leading-none font-mono tracking-tighter">
                            ATLAS<span className="text-accent-400">_CORE</span>
                        </h1>
                    </div>
                </div>

                {/* Language Switcher */}
                <div className="flex bg-gray-900 border border-gray-800 rounded p-0.5">
                    <button 
                        onClick={() => setLang(Language.ES)}
                        className={`px-2 py-0.5 text-[10px] font-bold font-mono transition-colors ${lang === Language.ES ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >ES</button>
                    <button 
                        onClick={() => setLang(Language.EN)}
                        className={`px-2 py-0.5 text-[10px] font-bold font-mono transition-colors ${lang === Language.EN ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >EN</button>
                </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative flex-grow w-full">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-10 left-10 w-64 h-64 bg-accent-900/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
            
            {/* HERO SECTION - LOGO & TITLE */}
            <div className="mb-10 flex flex-col items-center justify-center animate-fade-in text-center">
                 <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                      <div className="absolute inset-0 bg-accent-500/20 blur-xl rounded-full"></div>
                      <svg className="w-24 h-24 text-accent-400 relative z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] animate-pulse-slow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                    </svg>
                 </div>
                 <h1 className="text-5xl md:text-6xl font-bold text-white leading-none font-mono tracking-tighter mb-2 text-center">
                    ATLAS<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-purple-400">_CORE</span>
                  </h1>
                  <p className="text-xs text-accent-500/80 font-mono tracking-[0.3em] uppercase mb-6">{t.subtitle}</p>
                  <p className="text-gray-400 max-w-2xl text-center text-sm md:text-base leading-relaxed animate-fade-in delay-100">
                    {t.appDescription}
                  </p>
            </div>

            {/* CONTROLS BAR */}
            <div className="w-full max-w-4xl bg-gray-900/80 backdrop-blur border border-gray-800 rounded-lg p-2 mb-12 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
                
                 {/* Mode Toggle - Moved First */}
                 <div className="flex items-center gap-1 whitespace-nowrap w-full md:w-auto bg-gray-950 p-1 rounded">
                    <button
                        onClick={() => { setMode(AppMode.SIMPLE); setNarrativeCollection([]); }}
                        className={`flex-1 md:flex-none px-3 py-1.5 rounded text-[10px] md:text-xs font-bold font-mono tracking-wider transition-all border ${mode === AppMode.SIMPLE ? 'bg-accent-600 border-accent-500 text-white shadow-lg shadow-accent-500/20' : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        {t.simple}
                    </button>
                    <button
                        onClick={() => { setMode(AppMode.ADVANCED); setNarrativeCollection([]); }}
                        className={`flex-1 md:flex-none px-3 py-1.5 rounded text-[10px] md:text-xs font-bold font-mono tracking-wider transition-all border ${mode === AppMode.ADVANCED ? 'bg-accent-600 border-accent-500 text-white shadow-lg shadow-accent-500/20' : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        {t.advanced}
                    </button>
                    <button
                        onClick={() => { setMode(AppMode.NARRATIVE); }}
                        className={`flex-1 md:flex-none px-3 py-1.5 rounded text-[10px] md:text-xs font-bold font-mono tracking-wider transition-all border ${mode === AppMode.NARRATIVE ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        {t.narrative}
                    </button>
                </div>

                <div className="w-px h-8 bg-gray-800 hidden md:block"></div>

                 {/* Media Switch */}
                <div className={`flex bg-gray-950 rounded p-1 whitespace-nowrap w-full md:w-auto ${mode === AppMode.NARRATIVE ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                    <button
                    onClick={() => setMediaType(MediaType.IMAGE)}
                    className={`flex-1 md:flex-none px-6 py-2 rounded text-xs font-bold font-mono tracking-wide transition-all ${mediaType === MediaType.IMAGE ? 'bg-accent-900/40 text-accent-400 shadow-[0_0_10px_rgba(34,211,238,0.1)] border border-accent-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                    {t.image}
                    </button>
                    <button
                    onClick={() => setMediaType(MediaType.VIDEO)}
                    className={`flex-1 md:flex-none px-6 py-2 rounded text-xs font-bold font-mono tracking-wide transition-all ${mediaType === MediaType.VIDEO ? 'bg-orange-900/40 text-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.1)] border border-orange-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                    {t.video}
                    </button>
                </div>

                <div className="w-px h-8 bg-gray-800 hidden md:block"></div>

                {/* Prompt Type Switch */}
                <div className="flex bg-gray-950 rounded p-1 whitespace-nowrap w-full md:w-auto">
                    <button
                    onClick={() => setPromptType(PromptType.GENERIC)}
                    className={`flex-1 md:flex-none px-6 py-2 rounded text-xs font-bold font-mono tracking-wide transition-all ${promptType === PromptType.GENERIC ? 'bg-gray-800 text-gray-200 border border-gray-600' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                    {t.generic}
                    </button>
                    <button
                    onClick={() => setPromptType(PromptType.MIDJOURNEY)}
                    className={`flex-1 md:flex-none px-6 py-2 rounded text-xs font-bold font-mono tracking-wide transition-all ${promptType === PromptType.MIDJOURNEY ? 'bg-gray-800 text-white border border-gray-600' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                    {t.midjourney}
                    </button>
                </div>
            </div>

            {/* Status Bar / Active Config Info */}
            <div className="w-full mb-8 flex items-center justify-between border-b border-gray-800 pb-2">
                 <div className="flex gap-2">
                    {config.presetName && mode !== AppMode.NARRATIVE && (
                        <span className="text-[10px] font-mono font-bold uppercase text-accent-400 bg-accent-900/20 border border-accent-500/30 px-2 py-1 animate-pulse-slow">
                        PROTOCOL: {config.presetName}
                        </span>
                    )}
                     {mode === AppMode.NARRATIVE && (
                        <span className="text-[10px] font-mono font-bold uppercase text-purple-400 bg-purple-900/20 border border-purple-500/30 px-2 py-1">
                        PROTOCOL: NARRATIVE COLLECTION
                        </span>
                    )}
                </div>
            </div>

            <div className="w-full">
                {mode === AppMode.SIMPLE && (
                <SimpleView 
                    onPresetSelect={applyPreset} 
                    onSurprise={generateSurprise}
                    onSecretPlace={handleSecretPlace}
                    lang={lang} 
                />
                )}
                {mode === AppMode.ADVANCED && (
                <AdvancedView 
                    config={config} 
                    mediaType={mediaType} 
                    onChange={handleConfigChange} 
                    onSecretPlace={handleSecretPlace}
                    lang={lang}
                />
                )}
                {mode === AppMode.NARRATIVE && (
                  <>
                    <NarrativeView 
                      config={config}
                      onChange={handleConfigChange}
                      onSecretPlace={handleSecretPlace}
                      lang={lang}
                      onGenerate={handleNarrativeGeneration}
                    />
                    <CollectionDisplay collection={narrativeCollection} lang={lang} />
                  </>
                )}
            </div>
        </div>
      </main>

      {/* Show PromptDisplay ONLY if NOT in Narrative Mode */}
      {mode !== AppMode.NARRATIVE && (
         <PromptDisplay prompt={generatedPrompt} promptType={promptType} lang={lang} />
      )}
      
       {/* FOOTER */}
      <footer className="border-t border-gray-800 bg-[#06090f] py-8 mt-auto relative z-10 pb-28 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                
                {/* Left Side: Credits */}
                <div className="flex flex-col items-center md:items-start text-sm font-mono text-gray-500 gap-1">
                    <p className="uppercase tracking-widest text-xs opacity-70">{t.designedBy}</p>
                    <div className="flex flex-col md:flex-row items-center md:items-baseline gap-1 md:gap-2">
                         <span className="text-gray-300 font-bold text-base">Norberto Cuartero</span>
                         <a href="https://mistercuarter.es" target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:text-accent-400 hover:underline transition-colors">
                            mistercuarter.es
                         </a>
                    </div>
                </div>

                {/* Right Side: Socials */}
                <div className="flex flex-col items-center md:items-end gap-2">
                     <p className="uppercase tracking-widest text-xs opacity-70 text-gray-500 font-mono">{t.followMe}</p>
                     <div className="flex items-center gap-4">
                        {/* Twitter / X */}
                        <a href="https://twitter.com/MrCuarter" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-900 rounded-lg hover:bg-gray-800 border border-gray-800">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                        {/* Instagram */}
                        <a href="https://instagram.com/MrCuarter" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors p-2 bg-gray-900 rounded-lg hover:bg-gray-800 border border-gray-800">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.999 7.377a4.623 4.623 0 100 9.248 4.623 4.623 0 000-9.248zm0 0c2.553 0 4.623-2.07 4.623-4.623m-9.246 0c0 2.553 2.07 4.623 4.623 4.623m4.623 4.623a4.623 4.623 0 01-4.623 4.623m-4.623-4.623a4.623 4.623 0 004.623 4.623m0 0a4.623 4.623 0 004.623-4.623m4.624-4.623a1.112 1.112 0 11-2.224 0 1.112 1.112 0 012.224 0zM17.336 6.664h.001" /><rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth="2"></rect></svg>
                        </a>
                        {/* LinkedIn */}
                        <a href="https://es.linkedin.com/in/norberto-cuartero-toledo-9279a813b" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors p-2 bg-gray-900 rounded-lg hover:bg-gray-800 border border-gray-800">
                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        </a>
                     </div>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;