import React, { useState, useEffect, useRef } from 'react';
import { AppMode, MediaType, PromptType, MapConfig, Preset, Language, PromptCollectionItem, NarrativeMode, ThemeMode } from './types';
import * as C from './constants';
import SimpleView from './components/SimpleView';
import PresetsView from './components/PresetsView';
import AdvancedView from './components/AdvancedView';
import NarrativeView from './components/NarrativeView';
import PromptDisplay from './components/PromptDisplay';
import CollectionDisplay from './components/CollectionDisplay';
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
  manualDetails: ''
});

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.ES);
  const [mode, setMode] = useState<AppMode>(AppMode.PRESETS);
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.IMAGE);
  const [promptType, setPromptType] = useState<PromptType>(PromptType.GENERIC);
  const [config, setConfig] = useState<MapConfig>(getInitialConfig());
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const [narrativeCollection, setNarrativeCollection] = useState<PromptCollectionItem[]>([]);
  const [isGeneratingNarrative, setIsGeneratingNarrative] = useState(false);

  useEffect(() => {
    if (mode !== AppMode.NARRATIVE) {
        setGeneratedPrompt(generatePrompt(config, mediaType, promptType));
    }
  }, [config, mediaType, promptType, mode]);

  const handleConfigChange = (field: keyof MapConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const applyPreset = (preset: Preset) => {
    setConfig(prev => ({ ...getInitialConfig(), ...preset.config, tags: preset.tags, presetName: preset.name }));
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 150);
  };

  const handleWorldGen = () => {
    const randomCiv = getRandomElement(C.FANTASY_RACES);
    const randomPlace = getRandomElement(C.PLACES_BY_CIV[randomCiv] || C.PLACES_BY_CIV['DEFAULT']);
    setConfig(prev => ({
        ...prev,
        scale: getRandomElement(C.SCALES),
        civilization: randomCiv,
        placeType: randomPlace,
        artStyle: getRandomElement(C.ART_STYLES),
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
  const getTabClass = (isActive: boolean) => `flex-1 px-4 py-2 text-[10px] md:text-xs font-bold font-mono tracking-widest transition-all ${isActive ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'}`;

  return (
    <div className="min-h-screen bg-[#020617] text-gray-300 font-sans selection:bg-accent-900 flex flex-col">
      <header className="sticky top-0 z-40 bg-[#020617]/95 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
                 <svg className="w-8 h-8 text-accent-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2"/><path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2"/><path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="2" fill="currentColor" /></svg>
                 <h1 className="text-lg font-bold text-white font-mono tracking-tighter">ATLAS<span className="text-accent-400">_CORE</span></h1>
            </div>
            <div className="flex bg-gray-900 border border-gray-800 rounded p-0.5">
                <button onClick={() => setLang(Language.ES)} className={`px-2 py-0.5 text-[10px] font-bold ${lang === Language.ES ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>ES</button>
                <button onClick={() => setLang(Language.EN)} className={`px-2 py-0.5 text-[10px] font-bold ${lang === Language.EN ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>EN</button>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative flex-grow w-full">
            <div className="text-center mb-10">
                 <h1 className="text-5xl md:text-6xl font-bold text-white font-mono tracking-tighter mb-2">ATLAS<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-purple-400">_CORE</span></h1>
                  <p className="text-xs text-accent-500/80 font-mono tracking-[0.3em] uppercase mb-6">{t.subtitle}</p>
                  <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">{t.appDescription}</p>
            </div>

            <div className="w-full max-w-6xl mx-auto bg-[#0b101b] border border-gray-800 rounded-lg p-2 mb-8 flex flex-col lg:flex-row justify-between items-center gap-4">
                 <div className="flex bg-gray-950 p-1 rounded-md border border-gray-800 w-full lg:w-auto">
                    <button onClick={() => { setMode(AppMode.PRESETS); setNarrativeCollection([]); playSwitch(); }} className={`px-5 py-2 rounded-sm font-bold font-mono tracking-widest text-xs ${mode === AppMode.PRESETS ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400'}`}>{t.presets}</button>
                    <button onClick={() => { setMode(AppMode.SIMPLE); setNarrativeCollection([]); playSwitch(); }} className={getTabClass(mode === AppMode.SIMPLE)}>{t.simple}</button>
                    <button onClick={() => { setMode(AppMode.ADVANCED); setNarrativeCollection([]); playSwitch(); }} className={getTabClass(mode === AppMode.ADVANCED)}>{t.advanced}</button>
                    <button onClick={() => { setMode(AppMode.NARRATIVE); playSwitch(); }} className={getTabClass(mode === AppMode.NARRATIVE)}>{t.narrative}</button>
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="flex bg-gray-950 border border-gray-800 rounded-md p-1 w-full sm:w-auto">
                        <button onClick={() => setPromptType(PromptType.GENERIC)} className={`flex-1 px-4 py-2 rounded-sm text-[10px] font-bold font-mono ${promptType === PromptType.GENERIC ? 'bg-gray-800 text-white' : 'text-gray-500'}`}>{t.generic}</button>
                        <button onClick={() => setPromptType(PromptType.MIDJOURNEY)} className={`flex-1 px-4 py-2 rounded-sm text-[10px] font-bold font-mono ${promptType === PromptType.MIDJOURNEY ? 'bg-gray-800 text-white' : 'text-gray-500'}`}>{t.midjourney}</button>
                    </div>
                </div>
            </div>

            <div className="w-full">
                {mode === AppMode.PRESETS && <PresetsView onPresetSelect={applyPreset} onSurprise={handleWorldGen} lang={lang} config={config} mediaType={mediaType} promptType={promptType} />}
                {mode === AppMode.SIMPLE && <SimpleView config={config} onChange={handleConfigChange} lang={lang} />}
                {mode === AppMode.ADVANCED && <AdvancedView config={config} mediaType={mediaType} onChange={handleConfigChange} lang={lang} />}
                {mode === AppMode.NARRATIVE && (
                  <>
                    <NarrativeView config={config} onChange={handleConfigChange} lang={lang} onGenerate={handleNarrativeGeneration} isGenerating={isGeneratingNarrative} onRandom={handleWorldGen} />
                    <CollectionDisplay collection={narrativeCollection} lang={lang} />
                  </>
                )}
            </div>

            {mode !== AppMode.NARRATIVE && <PromptDisplay prompt={generatedPrompt} promptType={promptType} lang={lang} mode={mode} />}
            <div ref={bottomRef} className="h-8" /> 
      </main>
      
      <footer className="border-t border-gray-800 bg-[#06090f] py-8 text-center">
        <p className="text-gray-500 font-mono text-xs mb-2">{t.designedBy} Norberto Cuartero</p>
        <div className="flex justify-center gap-4">
             <a href="https://mistercuarter.es" target="_blank" rel="noreferrer" className="text-accent-500 hover:underline">mistercuarter.es</a>
        </div>
      </footer>
    </div>
  );
};

export default App;