
import React, { useState, useEffect, useRef } from 'react';
import { AppMode, MediaType, PromptType, MapConfig, Preset, Language, PromptCollectionItem, NarrativeMode, ThemeMode, HistoryItem } from './types';
import * as C from './constants';
import SimpleView from './components/SimpleView';
import PresetsView from './components/PresetsView';
import NarrativeView from './components/NarrativeView';
import PromptDisplay from './components/PromptDisplay';
import CollectionDisplay from './components/CollectionDisplay';
import HistoryDrawer from './components/HistoryDrawer';
import { generatePrompt, generateNarrativeCollection, getRandomElement } from './services/promptGenerator';
import { enhancePromptWithGemini } from './services/geminiService';
import { playSwitch, playTechClick, playPowerUp, playSuccess } from './services/audioService';

const getInitialConfig = (): MapConfig => ({
  scale: '',
  placeCategory: 'Civil',
  placeType: '',
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
  era: 'Edad Media',
  buildingType: 'Aldea medieval',
  themeMode: ThemeMode.FANTASY,
  anachronismPolicy: 'STRICT',
  tags: [],
  manualDetails: '',
  videoMovement: 'Desplazamiento suave'
});

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.ES);
  const [mode, setMode] = useState<AppMode>(AppMode.CONSTRUCTOR); // Default: Constructor
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.IMAGE);
  const [promptType, setPromptType] = useState<PromptType>(PromptType.UNIVERSAL);
  const [config, setConfig] = useState<MapConfig>(getInitialConfig());
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [narrativeCollection, setNarrativeCollection] = useState<PromptCollectionItem[]>([]);
  const [isGeneratingNarrative, setIsGeneratingNarrative] = useState(false);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('atlas_core_history');
    if (saved) {
        try {
            setHistory(JSON.parse(saved));
        } catch(e) { console.error("History parse error", e); }
    }
  }, []);

  // Update prompt string when config changes
  useEffect(() => {
    if (mode !== AppMode.STORYCRAFTER) {
        setGeneratedPrompt(generatePrompt(config, mediaType, promptType));
    }
  }, [config, mediaType, promptType, mode]);

  // Scroll to top of Main when mode changes
  useEffect(() => {
    if (mainRef.current) {
        setTimeout(() => {
            mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
  }, [mode]);

  const handleConfigChange = (field: keyof MapConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const saveToHistory = (textOverride?: string) => {
    const promptToSave = textOverride || generatedPrompt;
    if (!promptToSave) return;

    if (history.length > 0 && history[0].prompt === promptToSave) return;

    const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        prompt: promptToSave,
        type: promptType,
        tags: [mediaType, config.themeMode || '']
    };

    const newHistory = [newItem, ...history].slice(0, 100); 
    setHistory(newHistory);
    localStorage.setItem('atlas_core_history', JSON.stringify(newHistory));
  };

  const handleClearHistory = () => {
      setHistory([]);
      localStorage.removeItem('atlas_core_history');
      playSwitch();
  }

  const applyPreset = (preset: Preset) => {
    setConfig(prev => ({ ...getInitialConfig(), ...preset.config, tags: preset.tags, presetName: preset.name }));
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 150);
  };

  const handleWorldGen = () => {
    const randomCiv = getRandomElement(C.FANTASY_RACES);
    const randomPlace = getRandomElement(C.PLACES_BY_CIV[randomCiv] || C.PLACES_BY_CIV['DEFAULT']);
    
    // Randomize Style Wizard fields
    const randomCat = getRandomElement(C.STYLE_WIZARD_DATA.categories);
    const randomRefObj = getRandomElement(C.STYLE_WIZARD_DATA.references[randomCat] || []);
    const randomVibe = getRandomElement(C.STYLE_WIZARD_DATA.vibes);
    const randomFinish = getRandomElement(C.STYLE_WIZARD_DATA.finish);

    setConfig(prev => ({
        ...prev,
        scale: getRandomElement(C.SCALES),
        civilization: randomCiv,
        placeType: randomPlace,
        // Set detailed wizard fields
        styleCategory: randomCat,
        styleReference: randomRefObj?.label,
        styleVibe: randomVibe?.label,
        styleFinish: randomFinish?.label,
        // Keep fallback generic just in case
        artStyle: randomRefObj?.label || getRandomElement(C.ART_STYLES),
        
        time: getRandomElement(C.TIMES),
        weather: getRandomElement(C.WEATHERS),
        zoom: getRandomElement(C.ZOOMS),
        camera: getRandomElement(C.CAMERAS),
        aspectRatio: '16:9',
        presetName: '✨ PROTOCOLO ATLAS_CORE'
    }));
  };

  const handleNarrativeGeneration = async (useAI: boolean, nMode: NarrativeMode) => {
      setIsGeneratingNarrative(true);
      setNarrativeCollection([]);
      try {
        let collection = generateNarrativeCollection(config, promptType, lang, nMode);
        if (useAI) {
            const enhancementPromises = collection.map(async (item) => {
                const enhancedText = await enhancePromptWithGemini(item.prompt, promptType);
                return { ...item, prompt: enhancedText };
            });
            collection = await Promise.all(enhancementPromises);
        }
        setNarrativeCollection(collection);
        playSuccess();
      } catch (error) { console.error(error); } finally { setIsGeneratingNarrative(false); }
  };

  const t = C.UI_TEXT[lang];
  const headerBtnClass = "group relative flex items-center gap-2 px-3 py-1.5 rounded-sm bg-gray-900 border border-gray-800 hover:border-opacity-100 transition-all overflow-hidden";
  
  return (
    <div className="min-h-screen bg-[#020617] text-gray-300 font-sans selection:bg-accent-900 flex flex-col">
      <HistoryDrawer 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        history={history} 
        lang={lang} 
        onClear={handleClearHistory}
        onCopyPrompt={(txt) => {
            navigator.clipboard.writeText(txt);
            playSuccess();
        }}
      />

      <header className="sticky top-0 z-40 bg-[#020617]/95 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center h-auto sm:h-16 py-2 sm:py-0 gap-3 sm:gap-0">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                     <svg className="w-8 h-8 text-accent-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2"/><path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2"/><path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="2" fill="currentColor" /></svg>
                     <h1 className="text-lg font-bold text-white font-mono tracking-tighter hidden sm:block">ATLAS<span className="text-accent-400">_CORE</span></h1>
                </div>
                
                <nav className="flex gap-2 items-center sm:border-l sm:border-gray-800 sm:pl-6">
                     <a href="https://mistercuarter.es" target="_blank" rel="noreferrer" className={`${headerBtnClass} border-cyan-900/30 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]`}>
                        <svg className="w-3 h-3 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        <span className="text-[10px] font-bold font-mono tracking-wider text-gray-400 group-hover:text-cyan-400 transition-colors uppercase">{t.navWeb}</span>
                     </a>
                     <a href="https://laboratorio.mistercuarter.es" target="_blank" rel="noreferrer" className={`${headerBtnClass} border-purple-900/30 hover:shadow-[0_0_10px_rgba(168,85,247,0.2)] hidden md:flex`}>
                        <svg className="w-3 h-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        <span className="text-[10px] font-bold font-mono tracking-wider text-gray-400 group-hover:text-purple-400 transition-colors uppercase">{t.navLab}</span>
                     </a>
                </nav>
            </div>
            
            <div className="flex items-center gap-3">
                <button onClick={() => { setIsHistoryOpen(true); playSwitch(); }} className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 hover:border-accent-500 text-gray-500 hover:text-accent-400 rounded transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    <span className="text-[10px] font-bold font-mono">MEMORY</span>
                </button>
                <div className="flex bg-gray-900 border border-gray-800 rounded p-0.5">
                    <button onClick={() => setLang(Language.ES)} className={`px-2 py-0.5 text-[10px] font-bold ${lang === Language.ES ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>ES</button>
                    <button onClick={() => setLang(Language.EN)} className={`px-2 py-0.5 text-[10px] font-bold ${lang === Language.EN ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>EN</button>
                </div>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative flex-grow w-full">
            <div className="text-center mb-10">
                 <h1 className="text-5xl md:text-6xl font-bold text-white font-mono tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">ATLAS<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-purple-400 animate-pulse-slow">_CORE</span></h1>
                  <p className="text-xs text-accent-500/80 font-mono tracking-[0.3em] uppercase mb-6">{t.subtitle}</p>
                  <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">{t.appDescription}</p>
            </div>

            {/* NEW NAVIGATION GRID */}
            <div ref={mainRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 scroll-mt-24">
                
                {/* 1. CONSTRUCTOR (Verde) */}
                <button 
                    onClick={() => { setMode(AppMode.CONSTRUCTOR); setNarrativeCollection([]); playSwitch(); }} 
                    className={`group relative p-6 rounded-lg border text-left transition-all duration-300 overflow-hidden
                        ${mode === AppMode.CONSTRUCTOR 
                            ? 'bg-green-900/20 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.15)] scale-[1.02]' 
                            : 'bg-[#0b101b] border-gray-800 hover:border-green-500/50 hover:bg-gray-900'}
                    `}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <div className="relative z-10 w-full">
                        <h3 className={`text-xl font-mono font-bold mb-2 tracking-widest text-center ${mode === AppMode.CONSTRUCTOR ? 'text-green-400' : 'text-gray-400 group-hover:text-green-400'}`}>
                            {t.modeConstructorTitle}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono leading-relaxed">{t.modeConstructorDesc}</p>
                    </div>
                    {mode === AppMode.CONSTRUCTOR && <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500"></div>}
                </button>

                {/* 2. ARQUITECTO (Azul) */}
                <button 
                    onClick={() => { setMode(AppMode.ARCHITECT); setNarrativeCollection([]); playSwitch(); }} 
                    className={`group relative p-6 rounded-lg border text-left transition-all duration-300 overflow-hidden
                        ${mode === AppMode.ARCHITECT 
                            ? 'bg-cyan-900/20 border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.15)] scale-[1.02]' 
                            : 'bg-[#0b101b] border-gray-800 hover:border-cyan-500/50 hover:bg-gray-900'}
                    `}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-16 h-16 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    </div>
                    <div className="relative z-10 w-full">
                        <h3 className={`text-xl font-mono font-bold mb-2 tracking-widest text-center ${mode === AppMode.ARCHITECT ? 'text-cyan-400' : 'text-gray-400 group-hover:text-cyan-400'}`}>
                            {t.modeArchitectTitle}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono leading-relaxed">{t.modeArchitectDesc}</p>
                    </div>
                    {mode === AppMode.ARCHITECT && <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500"></div>}
                </button>

                {/* 3. STORYCRAFTER (Púrpura) */}
                <button 
                    onClick={() => { setMode(AppMode.STORYCRAFTER); playSwitch(); }} 
                    className={`group relative p-6 rounded-lg border text-left transition-all duration-300 overflow-hidden
                        ${mode === AppMode.STORYCRAFTER 
                            ? 'bg-purple-900/20 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)] scale-[1.02]' 
                            : 'bg-[#0b101b] border-gray-800 hover:border-purple-500/50 hover:bg-gray-900'}
                    `}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-16 h-16 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </div>
                    <div className="relative z-10 w-full">
                        <h3 className={`text-xl font-mono font-bold mb-2 tracking-widest text-center ${mode === AppMode.STORYCRAFTER ? 'text-purple-400' : 'text-gray-400 group-hover:text-purple-400'}`}>
                            {t.modeStoryTitle}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono leading-relaxed">{t.modeStoryDesc}</p>
                    </div>
                    {mode === AppMode.STORYCRAFTER && <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-500"></div>}
                </button>

            </div>

            <div className="w-full">
                {mode === AppMode.CONSTRUCTOR && <PresetsView onPresetSelect={applyPreset} onSurprise={handleWorldGen} lang={lang} config={config} mediaType={mediaType} promptType={promptType} setPromptType={setPromptType} setMediaType={setMediaType} />}
                {mode === AppMode.ARCHITECT && <SimpleView config={config} onChange={handleConfigChange} lang={lang} mediaType={mediaType} promptType={promptType} setPromptType={setPromptType} setMediaType={setMediaType} />}
                {mode === AppMode.STORYCRAFTER && (
                  <>
                    <NarrativeView config={config} onChange={handleConfigChange} lang={lang} onGenerate={handleNarrativeGeneration} isGenerating={isGeneratingNarrative} onRandom={handleWorldGen} promptType={promptType} setPromptType={setPromptType} />
                    <CollectionDisplay collection={narrativeCollection} lang={lang} />
                  </>
                )}
            </div>

            {mode !== AppMode.STORYCRAFTER && <PromptDisplay prompt={generatedPrompt} promptType={promptType} lang={lang} mode={mode} onCopy={() => saveToHistory(generatedPrompt)} mediaType={mediaType} />}
            <div ref={bottomRef} className="h-8" /> 
      </main>
      
      <footer className="border-t border-gray-800 bg-[#06090f] py-8 mt-auto">
         {/* Footer Content */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-left space-y-1">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{t.builtWith}</p>
                <p className="text-xs font-mono font-bold text-gray-400">{t.designedBy}</p>
            </div>
            {/* Socials */}
            <div className="flex items-center gap-6">
                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest hidden md:block">{t.followMe}</span>
                
                {/* X / Twitter */}
                <a href="https://x.com/MRCUARTER" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-accent-400 transition-colors" title="X (Twitter)">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </a>

                {/* Instagram */}
                <a href="https://instagram.com/MRCUARTER" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-pink-400 transition-colors" title="Instagram">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22H7.75A5.75 5.75 0 0 1 2 16.25V7.75A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25V7.75A4.25 4.25 0 0 0 16.25 3.5H7.75ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm6.5-.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
                    </svg>
                </a>

                {/* LinkedIn */}
                <a href="https://es.linkedin.com/in/norberto-cuartero-toledo-9279a813b" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-500 transition-colors" title="LinkedIn">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                    </svg>
                </a>
                
                {/* Email */}
                <a href="mailto:hola@mistercuarter.es" className="text-gray-500 hover:text-white transition-colors" title="Email">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                     </svg>
                </a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
