import React, { useState, useEffect, useRef } from 'react';
import { AppMode, MediaType, PromptType, MapConfig, Preset, Language, PromptCollectionItem } from './types';
import * as C from './constants';
import SimpleView from './components/SimpleView';
import PresetsView from './components/PresetsView';
import AdvancedView from './components/AdvancedView';
import NarrativeView from './components/NarrativeView';
import PromptDisplay from './components/PromptDisplay';
import CollectionDisplay from './components/CollectionDisplay';
import { generatePrompt, generateNarrativeCollection, getRandomElement } from './services/promptGenerator';
import { enhancePromptWithGemini } from './services/geminiService'; // Import Gemini service
import { playSwitch, playTechClick, playPowerUp, playSuccess } from './services/audioService';

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
  const [mode, setMode] = useState<AppMode>(AppMode.PRESETS); // Default to PRESETS now
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.IMAGE);
  const [promptType, setPromptType] = useState<PromptType>(PromptType.GENERIC);
  const [config, setConfig] = useState<MapConfig>(getInitialConfig());
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  
  // Ref for auto-scrolling
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Narrative Mode State
  const [narrativeCollection, setNarrativeCollection] = useState<PromptCollectionItem[]>([]);
  const [isGeneratingNarrative, setIsGeneratingNarrative] = useState(false);

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
    // After applying preset, switch to Builder so user sees the result
    setMode(AppMode.SIMPLE); 
  };

  const generateSurprise = () => {
    // Legacy support wrapper
    handleWorldGen();
  };

  const handleReset = () => {
      playTechClick();
      setConfig(getInitialConfig());
      setNarrativeCollection([]);
      // If in narrative mode, maybe stay there, otherwise go to presets? 
      // User likely wants to clear the current "Work".
  };

  // --- EPIC WORLD GEN LOGIC (Unified Randomizer) ---
  const handleWorldGen = () => {
    // 1. SCENARIO
    const randomScale = getRandomElement(C.SCALES);
    const randomCat = getRandomElement(C.PLACE_CATEGORIES);
    const randomPlace = getRandomElement(C.PLACES_BY_CATEGORY[randomCat]);
    const availablePOIs = C.POI_MAPPING[randomPlace] || C.POI_MAPPING['DEFAULT'];
    const randomPoi = getRandomElement(availablePOIs);

    // 2. COMPATIBLE CIVILIZATION
    let allowedCivs = C.CIVILIZATIONS;
    // Smart Filter: Filter Civs based on Category to avoid weird mismatches
    if (randomCat === 'Especial / Sci-Fi' || randomCat === 'Industrial / Tecnológico') {
        allowedCivs = C.CIVILIZATIONS.filter(c => 
            ['Futurista', 'Cyberpunk', 'Alienígena Orgánica', 'Alienígena Biomecánica', 'Alienígena Cristalina', 'Postindustrial', 'Steampunk', 'Base Lunar'].some(k => c.includes(k))
        );
    } else if (randomCat === 'Religioso / Mágico') {
        allowedCivs = C.CIVILIZATIONS.filter(c => 
            ['Elfos', 'No-muertos', 'Demoníaca', 'Antigua', 'Medieval', 'Imperial', 'Fantasía'].some(k => c.includes(k))
        );
    } else if (randomCat === 'Natural') {
        allowedCivs = ['Elfos', 'Tribal', 'Prehistórica', 'Ninguna', 'Nómadas', 'Antigua desaparecida'];
    }
    // Fallback if filter is too aggressive
    if (allowedCivs.length === 0) allowedCivs = C.CIVILIZATIONS;
    const randomCiv = getRandomElement(allowedCivs);

    // 3. COMPATIBLE ATMOSPHERE & STYLE
    // Smart Filter: Art Styles based on Civ
    let allowedStyles = C.ART_STYLES;
    if (randomCiv.includes('Futurista') || randomCiv.includes('Cyberpunk') || randomCiv.includes('Alienígena')) {
        allowedStyles = ['Starcraft', 'Star Wars', 'Realista cinematográfico', 'Sci-Fi cinematográfico', 'Blueprint', '3D render', 'Isométrico'];
    } else if (randomCiv.includes('Medieval') || randomCiv.includes('Imperial')) {
        allowedStyles = ['Age of Empires', 'Civilization', 'D&D', 'World of Warcraft', 'Dark fantasy', 'Realista cinematográfico', 'Dibujado a mano'];
    } else if (randomCiv.includes('Elfos') || randomCiv.includes('Tribal')) {
        allowedStyles = ['Studio Ghibli', 'World of Warcraft', 'Ilustración', 'Realista cinematográfico', 'Cartoon estilizado'];
    }
    const finalAllowedStyles = C.ART_STYLES.filter(s => allowedStyles.some(as => s.includes(as) || as.includes(s))); 
    const randomStyle = getRandomElement(finalAllowedStyles.length > 0 ? finalAllowedStyles : C.ART_STYLES);

    // Weather filtering (avoid rain in space)
    let allowedWeather = C.WEATHERS;
    if (randomCat === 'Especial / Sci-Fi' && (randomPlace.includes('Espacial') || randomPlace.includes('Lunar'))) {
        allowedWeather = C.WEATHERS.filter(w => !['Lluvia', 'Nevando', 'Tormenta eléctrica'].includes(w));
    }
    const randomWeather = getRandomElement(allowedWeather.length > 0 ? allowedWeather : C.WEATHERS);
    const randomTime = getRandomElement(C.TIMES);
    const randomRender = getRandomElement(C.RENDER_TECHS);

    // 4. FORMAT
    const randomZoom = getRandomElement(C.ZOOMS);
    const randomCamera = getRandomElement(C.CAMERAS);

    setConfig(prev => ({
        ...prev,
        // Scenario
        scale: randomScale,
        placeCategory: randomCat,
        placeType: randomPlace,
        poi: randomPoi,
        civilization: randomCiv,
        customScenario: '',
        // Atmosphere
        artStyle: randomStyle,
        time: randomTime,
        weather: randomWeather,
        zoom: randomZoom,
        camera: randomCamera,
        renderTech: randomRender,
        customAtmosphere: '',
        // Format - ENFORCE LANDSCAPE (16:9) AS REQUESTED
        aspectRatio: '16:9',
        // Meta
        presetName: '✨ PROTOCOLO ATLAS_CORE', // Renamed from GENESIS
        tags: ['Random', 'WorldGen']
    }));

    // Stay in current mode (Presets, Simple, etc)
    
    // Auto Scroll to bottom (Prompt area)
    setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNarrativeGeneration = async (useAI: boolean) => {
      if (!config.placeType) {
          alert(lang === Language.ES ? "Selecciona un Lugar primero" : "Select a Place first");
          return;
      }

      setIsGeneratingNarrative(true);
      setNarrativeCollection([]); // Clear previous

      try {
        // 1. Generate Base Collection (Instant)
        let collection = generateNarrativeCollection(config, promptType, lang);

        // 2. If AI mode is enabled, enhance each prompt
        if (useAI) {
            // Process in parallel blocks to speed it up, but not all at once to avoid rate limits
            // Since we have ~13 items, we can do them in batches or simple Promise.all if quota allows.
            // Let's do Promise.all for now as Gemini 2.5 is fast.
            
            const enhancementPromises = collection.map(async (item) => {
                try {
                    const enhancedText = await enhancePromptWithGemini(item.prompt, promptType);
                    return { ...item, prompt: enhancedText };
                } catch (e) {
                    return item; // Fallback to original if AI fails
                }
            });

            collection = await Promise.all(enhancementPromises);
        }

        setNarrativeCollection(collection);
        playSuccess();

      } catch (error) {
          console.error("Error generating collection:", error);
      } finally {
          setIsGeneratingNarrative(false);
      }
  };

  const t = C.UI_TEXT[lang];

  // Helper for tab classes
  const getTabClass = (isActive: boolean) => `
    flex-1 px-4 py-2 text-[10px] md:text-xs font-bold font-mono tracking-widest transition-all
    ${isActive 
        ? 'bg-gray-800 text-white shadow-sm' 
        : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'
    }
  `;

  return (
    <div className="min-h-screen bg-[#020617] text-gray-300 font-sans selection:bg-accent-900 selection:text-white flex flex-col">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#020617]/95 backdrop-blur-md border-b border-gray-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* LEFT: External Links */}
            <div className="flex items-center gap-4 md:gap-6">
                 <a 
                  href="https://mistercuarter.es" 
                  className="group flex items-center gap-2 text-[10px] font-mono font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => playTechClick()}
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
                  onMouseEnter={() => playTechClick()}
                >
                  <div className="w-5 h-5 rounded-sm flex items-center justify-center bg-gray-800 group-hover:bg-purple-600 transition-colors">
                     <svg className="w-3 h-3 text-current group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                     </svg>
                  </div>
                   <span className="hidden sm:inline">Laboratorio</span>
                </a>

                {/* NeoGenesis Link (Refined) */}
                <a 
                  href="https://neogenesis.mistercuarter.es" 
                  className="group flex items-center gap-2 text-[10px] font-mono font-bold text-gray-500 hover:text-green-400 transition-colors uppercase tracking-widest"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => playTechClick()}
                >
                  <div className="w-5 h-5 rounded-sm flex items-center justify-center bg-gray-800 group-hover:bg-green-600 transition-colors shadow-sm group-hover:shadow-green-900/50">
                     <svg className="w-3 h-3 text-current group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                     </svg>
                  </div>
                   <span className="hidden sm:inline group-hover:text-green-400 transition-colors">NeoGenesis</span>
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
                        onClick={() => { setLang(Language.ES); playTechClick(); }}
                        className={`px-2 py-0.5 text-[10px] font-bold font-mono transition-colors ${lang === Language.ES ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >ES</button>
                    <button 
                        onClick={() => { setLang(Language.EN); playTechClick(); }}
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

            {/* CONTROLS BAR (IMPROVED UNIFIED DESIGN) */}
            <div className="w-full max-w-6xl bg-[#0b101b] border border-gray-800/80 rounded-lg p-2 mb-8 flex flex-col lg:flex-row justify-between items-center gap-4 shadow-2xl shadow-black/50">
                
                 {/* Left: Navigation Modes (UNIFIED PILL) */}
                 <div className="flex bg-gray-950 p-1 rounded-md border border-gray-800/50 w-full lg:w-auto overflow-x-auto custom-scrollbar">
                    {/* Presets - The Head */}
                    <button
                        onClick={() => { setMode(AppMode.PRESETS); setNarrativeCollection([]); playSwitch(); }}
                        className={`px-5 py-2 rounded-sm font-bold font-mono tracking-widest transition-all text-xs whitespace-nowrap
                        ${mode === AppMode.PRESETS 
                            ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' 
                            : 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-900'}`}
                    >
                        {t.presets}
                    </button>

                    {/* Divider */}
                    <div className="w-px bg-gray-800 mx-1 my-1"></div>

                    {/* Modes - The Body */}
                    <button
                        onClick={() => { setMode(AppMode.SIMPLE); setNarrativeCollection([]); playSwitch(); }}
                        className={getTabClass(mode === AppMode.SIMPLE)}
                    >
                        {t.simple}
                    </button>
                    <button
                        onClick={() => { setMode(AppMode.ADVANCED); setNarrativeCollection([]); playSwitch(); }}
                        className={getTabClass(mode === AppMode.ADVANCED)}
                    >
                        {t.advanced}
                    </button>
                    <button
                        onClick={() => { setMode(AppMode.NARRATIVE); playSwitch(); }}
                        className={getTabClass(mode === AppMode.NARRATIVE)}
                    >
                        {t.narrative}
                    </button>
                </div>

                {/* Right Side: Configuration Tools (BALANCED GROUPS) */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto lg:ml-auto">
                    
                    {/* Reset Button (NEW) */}
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 rounded-sm font-mono font-bold text-[10px] uppercase tracking-wider text-red-400 border border-red-900/30 hover:bg-red-900/20 hover:border-red-500/50 transition-colors w-full sm:w-auto"
                        title={lang === Language.ES ? 'Reiniciar configuración' : 'Reset configuration'}
                    >
                        {t.reset}
                    </button>

                    <div className="h-6 w-px bg-gray-800 hidden sm:block"></div>

                    {/* Media Switch (Equal Size with Text) */}
                    <div className={`flex items-center bg-gray-950 border border-gray-800 rounded-md p-1 w-full sm:w-auto ${mode === AppMode.NARRATIVE ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                        <button
                        onClick={() => { setMediaType(MediaType.IMAGE); playTechClick(); }}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-sm transition-all text-[10px] font-bold font-mono tracking-wider
                        ${mediaType === MediaType.IMAGE ? 'bg-accent-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'}`}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {t.image}
                        </button>
                        <button
                        onClick={() => { setMediaType(MediaType.VIDEO); playTechClick(); }}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-sm transition-all text-[10px] font-bold font-mono tracking-wider
                        ${mediaType === MediaType.VIDEO ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'}`}
                        >
                             <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                             </svg>
                             {t.video}
                        </button>
                    </div>

                    {/* Divider (Hidden on mobile) */}
                    <div className="w-px h-8 bg-gray-800 hidden sm:block"></div>

                    {/* Prompt Type Switch (Side-by-side Equal) */}
                    <div className="flex bg-gray-950 border border-gray-800 rounded-md p-1 w-full sm:w-auto">
                        <button
                        onClick={() => { setPromptType(PromptType.GENERIC); playTechClick(); }}
                        className={`flex-1 px-4 py-2 rounded-sm text-[10px] font-bold font-mono tracking-wider transition-all uppercase 
                        ${promptType === PromptType.GENERIC 
                            ? 'bg-gray-800 text-white shadow-sm' 
                            : 'bg-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-900'}`}
                        >
                        {t.generic}
                        </button>
                        <button
                        onClick={() => { setPromptType(PromptType.MIDJOURNEY); playTechClick(); }}
                        className={`flex-1 px-4 py-2 rounded-sm text-[10px] font-bold font-mono tracking-wider transition-all uppercase 
                        ${promptType === PromptType.MIDJOURNEY 
                            ? 'bg-gray-800 text-white shadow-sm' 
                            : 'bg-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-900'}`}
                        >
                        {t.midjourney}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- GLOBAL WORLD GEN BUTTON (RE-DESIGNED) --- */}
            <div className="w-full max-w-6xl mb-8 flex justify-center animate-fade-in">
                <div className="flex flex-col items-center">
                    <button
                        onClick={() => { handleWorldGen(); playPowerUp(); }}
                        className="group relative inline-flex flex-col items-center justify-center px-12 py-4 text-sm font-bold text-amber-100 transition-all duration-300 bg-[#1c160b] border border-amber-600/40 hover:bg-amber-900/20 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] rounded-sm overflow-hidden min-w-[280px]"
                    >
                            {/* Simple border accents */}
                        <span className="absolute w-1 h-1 bg-amber-500 top-0 left-0"></span>
                        <span className="absolute w-1 h-1 bg-amber-500 bottom-0 right-0"></span>
                        
                        {/* Main Title Row */}
                        <div className="flex items-center relative z-10 mb-1">
                            <span className="mr-2 text-lg text-amber-500 group-hover:rotate-90 transition-transform duration-500">❖</span>
                            <span className="font-mono tracking-[0.1em] font-bold text-sm md:text-base">{t.worldGenBtn}</span>
                        </div>
                        
                        {/* Subtitle Description */}
                        <span className="relative z-10 text-[9px] text-amber-500/60 font-mono uppercase tracking-widest group-hover:text-amber-400/80 transition-colors">
                            {t.worldGenDesc}
                        </span>
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
                {mode === AppMode.PRESETS && (
                <PresetsView 
                    onPresetSelect={applyPreset} 
                    onSurprise={generateSurprise}
                    lang={lang}
                    config={config} 
                />
                )}
                {mode === AppMode.SIMPLE && (
                <SimpleView 
                    config={config}
                    onChange={handleConfigChange}
                    lang={lang} 
                />
                )}
                {mode === AppMode.ADVANCED && (
                <AdvancedView 
                    config={config} 
                    mediaType={mediaType} 
                    onChange={handleConfigChange} 
                    lang={lang}
                />
                )}
                {mode === AppMode.NARRATIVE && (
                  <>
                    <NarrativeView 
                      config={config}
                      onChange={handleConfigChange}
                      lang={lang}
                      onGenerate={handleNarrativeGeneration}
                      isGenerating={isGeneratingNarrative}
                    />
                    <CollectionDisplay collection={narrativeCollection} lang={lang} />
                  </>
                )}
            </div>

            {/* PromptDisplay MOVED INSIDE MAIN FLOW - Appearing after the tools */}
            {mode !== AppMode.NARRATIVE && (
               <PromptDisplay prompt={generatedPrompt} promptType={promptType} lang={lang} />
            )}
            
            {/* Anchor for auto-scrolling */}
            <div ref={bottomRef} className="h-8" /> 
        </div>
      </main>
      
       {/* FOOTER */}
      <footer className="border-t border-gray-800 bg-[#06090f] py-8 mt-auto relative z-10 pb-8">
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