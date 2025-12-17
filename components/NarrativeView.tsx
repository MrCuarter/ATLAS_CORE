import React, { useState, useEffect } from 'react';
import { MapConfig, Language, NarrativeMode } from '../types';
import * as C from '../constants';
import { playPowerUp, playSwitch, playTechClick } from '../services/audioService';
import { generatePOISuggestions } from '../services/geminiService';
import { getRandomElement } from '../services/promptGenerator';
import StyleSelector from './StyleSelector';

// Fisher-Yates helper for local shuffling
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface NarrativeViewProps {
  config: MapConfig;
  onChange: (field: keyof MapConfig, value: any) => void;
  lang: Language;
  onGenerate: (useAI: boolean, mode: NarrativeMode) => void;
  isGenerating?: boolean; 
  onRandom: () => void; 
}

const NarrativeView: React.FC<NarrativeViewProps> = ({ config, onChange, lang, onGenerate, isGenerating, onRandom }) => {
  const t = C.UI_TEXT[lang];
  const [useAI, setUseAI] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [isSuggestingPOIs, setIsSuggestingPOIs] = useState(false);

  // Initialize manual POIs if empty
  useEffect(() => {
    if (!config.manualPOIs || config.manualPOIs.length === 0) {
        onChange('manualPOIs', ['', '', '', '', '', '']);
    }
  }, []);

  const toggleAI = () => {
    playSwitch();
    setUseAI(!useAI);
  };

  const toggleMode = (manual: boolean) => {
    playSwitch();
    setIsManualMode(manual);
  };

  // AUTO-FILL POIS WHEN PLACE CHANGES (Assistant Mode Only)
  const handlePlaceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newPlace = e.target.value;
      const cat = C.PLACE_CATEGORIES.find(c => C.PLACES_BY_CATEGORY[c].includes(newPlace)) || config.placeCategory;
      
      onChange('placeCategory', cat);
      onChange('placeType', newPlace);

      // Logic to auto-populate the 6 POI fields
      if (!isManualMode && newPlace) {
          let rawPOIs = C.POI_MAPPING[newPlace] || C.POI_MAPPING['DEFAULT'];
          // Ensure we have enough by mixing defaults if needed
          if (rawPOIs.length < 6) {
              rawPOIs = [...new Set([...rawPOIs, ...C.POI_MAPPING['DEFAULT']])];
          }
          // Shuffle and pick 6
          const selected = shuffleArray(rawPOIs).slice(0, 6);
          onChange('manualPOIs', selected);
      }
  };

  const handleManualPOIChange = (index: number, val: string) => {
      const newPOIs = [...(config.manualPOIs || ['', '', '', '', '', ''])];
      newPOIs[index] = val;
      onChange('manualPOIs', newPOIs);
  };

  const handleAISuggest = async () => {
      if (!config.placeType) {
          alert(lang === Language.ES ? "Por favor escribe un Lugar primero" : "Please type a Place first");
          return;
      }
      playTechClick();
      setIsSuggestingPOIs(true);
      try {
          const suggestions = await generatePOISuggestions(config.placeType, config.civilization);
          if (suggestions && suggestions.length > 0) {
              // Ensure exactly 6
              const finalPOIs = suggestions.slice(0, 6);
              while (finalPOIs.length < 6) finalPOIs.push("");
              onChange('manualPOIs', finalPOIs);
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsSuggestingPOIs(false);
      }
  };

  const SelectGroup = ({ label, field, options }: { label: string, field: keyof MapConfig, options: string[] }) => (
    <div className="mb-4">
      <label className="block text-xs font-mono font-bold text-accent-400 uppercase tracking-widest mb-2 opacity-80">
        {label}
      </label>
      <div className="relative">
        <select
          value={config[field] as string}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 block p-3 hover:bg-gray-800 transition-colors appearance-none tech-input font-sans"
        >
          <option value="" className="text-gray-500 italic">{t.noneOption}</option>
          {options.map(opt => {
             const displayLabel = lang === Language.EN ? (C.PROMPT_TRANSLATIONS[opt] || opt) : opt;
             return <option key={opt} value={opt}>{displayLabel}</option>;
          })}
        </select>
         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in pb-8 max-w-4xl mx-auto">
      
      {/* NEW HEADER DESIGN WITH FX */}
      <div className="text-center mb-10 relative">
        <div className="flex items-center justify-center gap-4 mb-4">
            
            {/* Center: Title & Logo with FX */}
            <div className="flex flex-col items-center">
                 <div className="w-16 h-16 bg-purple-900/20 border border-purple-500/30 rounded-full flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                    <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                 </div>
                 
                 {/* FX TITLE */}
                 <div className="relative flex items-center gap-2">
                     <svg className="w-6 h-6 text-orange-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path d="M19 12l-7-7-7 7"/></svg> {/* Hammer Icon Placeholder/Abstract */}
                     
                     <h2 className="text-3xl font-mono font-bold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse">
                        {t.storycrafterTitle}
                     </h2>
                     
                     <svg className="w-6 h-6 text-orange-500 transform scale-x-[-1] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path d="M19 12l-7-7-7 7"/></svg>
                 </div>
            </div>
        </div>
        
        <p className="text-gray-400 text-sm max-w-xl mx-auto">{t.narrativeIntro}</p>
        
        {/* MODE TOGGLE */}
        <div className="flex justify-center mt-6">
            <div className="bg-gray-900 border border-gray-700 p-1 rounded-full flex gap-1 shadow-md">
                <button
                    onClick={() => toggleMode(false)}
                    className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all ${!isManualMode ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                    {t.modeAssistant}
                </button>
                <button
                    onClick={() => toggleMode(true)}
                    className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all ${isManualMode ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                    {t.modeManual}
                </button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        {/* 1. CONTEXTO */}
        <div className="bg-gray-900/50 p-6 tech-border backdrop-blur-sm relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent-600"></div>
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white font-mono">1. {isManualMode ? t.manualContextTitle : t.scenario}</h3>
          </div>
          
          {isManualMode ? (
              // MANUAL MODE INPUTS
              <div className="space-y-4">
                  <div>
                      <label className="block text-xs font-mono font-bold text-accent-400 uppercase tracking-widest mb-2 opacity-80">{t.place}</label>
                      <input 
                          type="text" 
                          value={config.placeType}
                          onChange={(e) => onChange('placeType', e.target.value)}
                          placeholder={t.manualPlacePlaceholder}
                          className="w-full bg-gray-950 border border-gray-700 text-white p-3 focus:border-accent-500 focus:outline-none"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-mono font-bold text-accent-400 uppercase tracking-widest mb-2 opacity-80">{t.civilization}</label>
                      <input 
                          type="text" 
                          value={config.civilization}
                          onChange={(e) => onChange('civilization', e.target.value)}
                          placeholder={t.manualCivPlaceholder}
                          className="w-full bg-gray-950 border border-gray-700 text-white p-3 focus:border-accent-500 focus:outline-none"
                      />
                  </div>
                   {/* MANUAL DETAILS instead of Scale */}
                  <div>
                      <label className="block text-xs font-mono font-bold text-accent-400 uppercase tracking-widest mb-2 opacity-80">{t.manualDetailsLabel}</label>
                      <input 
                          type="text" 
                          value={config.manualDetails || ''}
                          onChange={(e) => onChange('manualDetails', e.target.value)}
                          placeholder={t.manualDetailsPlaceholder}
                          className="w-full bg-gray-950 border border-gray-700 text-white p-3 focus:border-accent-500 focus:outline-none"
                      />
                  </div>
              </div>
          ) : (
              // ASSISTANT MODE INPUTS
              <>
                <div className="mb-4">
                    <label className="block text-xs font-mono font-bold text-accent-400 uppercase tracking-widest mb-2 opacity-80">
                    {t.category}
                    </label>
                    <div className="relative">
                    <select
                        value={config.placeCategory}
                        onChange={(e) => {
                        const newCat = e.target.value;
                        if (newCat) {
                            const firstPlace = C.PLACES_BY_CATEGORY[newCat][0];
                            onChange('placeCategory', newCat);
                            onChange('placeType', firstPlace);
                            // Also trigger POI autofill for the first place
                            if (firstPlace) {
                                let rawPOIs = C.POI_MAPPING[firstPlace] || C.POI_MAPPING['DEFAULT'];
                                if (rawPOIs.length < 6) rawPOIs = [...new Set([...rawPOIs, ...C.POI_MAPPING['DEFAULT']])];
                                const selected = shuffleArray(rawPOIs).slice(0, 6);
                                onChange('manualPOIs', selected);
                            }
                        }
                        }}
                        className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 block p-3 tech-input font-sans appearance-none"
                    >
                        {C.PLACE_CATEGORIES.map(cat => {
                            const displayLabel = lang === Language.EN ? (C.PROMPT_TRANSLATIONS[cat] || cat) : cat;
                            return <option key={cat} value={cat}>{displayLabel}</option>;
                        })}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                    </div>
                </div>
                {/* SPECIAL HANDLING FOR PLACE SELECT TO TRIGGER POI FILL */}
                <div className="mb-4">
                  <label className="block text-xs font-mono font-bold text-accent-400 uppercase tracking-widest mb-2 opacity-80">
                    {t.place}
                  </label>
                  <div className="relative">
                    <select
                      value={config.placeType}
                      onChange={handlePlaceSelect}
                      className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 block p-3 hover:bg-gray-800 transition-colors appearance-none tech-input font-sans"
                    >
                      <option value="" className="text-gray-500 italic">{t.noneOption}</option>
                      {C.PLACES_BY_CATEGORY[config.placeCategory].map(opt => {
                        const displayLabel = lang === Language.EN ? (C.PROMPT_TRANSLATIONS[opt] || opt) : opt;
                        return <option key={opt} value={opt}>{displayLabel}</option>;
                      })}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>

                <SelectGroup label={t.civilization} field="civilization" options={C.CIVILIZATIONS} />
                
                {/* RANDOM BUTTON IN ASSISTANT MODE (Compact) */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                     <button
                        onClick={() => { onRandom(); playPowerUp(); }}
                        className="w-full py-2 bg-[#1c160b] border border-amber-600/30 text-amber-500 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-900/20 hover:border-amber-500 transition-all flex items-center justify-center gap-2"
                     >
                        <span className="text-lg leading-none">❖</span> {t.worldGenCompact}
                     </button>
                </div>
              </>
          )}
        </div>

        {/* 2. ADN VISUAL */}
        <div className="bg-gray-900/50 p-6 tech-border backdrop-blur-sm relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-600"></div>
          <h3 className="text-lg font-bold text-white mb-4 font-mono">2. ADN VISUAL</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <SelectGroup label={t.time} field="time" options={C.TIMES} />
            <SelectGroup label={t.weather} field="weather" options={C.WEATHERS} />
          </div>
          
          {/* NEW STYLE SELECTOR */}
          <div className="mb-4 flex-grow">
             <StyleSelector 
                selectedStyle={config.artStyle}
                onSelect={(val) => {
                    onChange('artStyle', val);
                    onChange('renderTech', ''); // Clear renderTech
                }}
                lang={lang}
                isSimpleMode={false}
             />
          </div>
          
          {/* CUSTOM ATMOSPHERE - Visible in BOTH modes now */}
          <div className="mt-auto border-t border-gray-800 pt-4">
             <label className="block text-xs font-mono font-bold text-purple-400 uppercase tracking-widest mb-2 opacity-80">{t.customAtmosphereLabel}</label>
             <textarea
                value={config.customAtmosphere}
                onChange={(e) => onChange('customAtmosphere', e.target.value)}
                placeholder={t.customPlaceholder}
                className="w-full bg-gray-950 border border-gray-800 text-gray-300 text-xs p-2 h-16 resize-none focus:border-purple-500 focus:outline-none"
             />
          </div>
        </div>
      </div>

      {/* 3. POI SETTINGS (VISIBLE IN BOTH MODES NOW) */}
      <div className="bg-gray-900/50 p-6 tech-border backdrop-blur-sm relative overflow-hidden mb-8">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-600"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h3 className="text-lg font-bold text-white font-mono">3. {isManualMode ? t.manualPOITitle : "CONFIGURACIÓN DE POIs"}</h3>
                <p className="text-xs text-gray-500">{t.manualPOIDesc}</p>
              </div>
              
              {/* AI SUGGEST BUTTON (ALWAYS VISIBLE FOR CONVENIENCE) */}
               <button
               onClick={handleAISuggest}
               disabled={isSuggestingPOIs}
               className="px-4 py-2 bg-orange-600/20 border border-orange-500 text-orange-400 text-xs font-bold tracking-widest hover:bg-orange-600/40 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-wait"
             >
               {isSuggestingPOIs ? (
                   <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               ) : (
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               )}
               {t.suggestPOIsBtn}
             </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <SelectGroup label={t.camera} field="camera" options={C.CAMERAS} />
            <SelectGroup label={t.zoom} field="zoom" options={C.ZOOMS} />
            <SelectGroup label={t.ratio} field="aspectRatio" options={C.RATIOS} />
          </div>
          
          {/* POI INPUTS GRID (ALWAYS VISIBLE) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-800 pt-4 animate-fade-in">
              {(config.manualPOIs || Array(6).fill('')).map((poi, idx) => (
                  <div key={idx} className="relative">
                      <label className="absolute -top-2 left-2 px-1 bg-[#0f172a] text-[9px] text-orange-500 font-bold uppercase tracking-widest">
                          POI {idx + 1}
                      </label>
                      <input
                        type="text"
                        value={poi}
                        onChange={(e) => handleManualPOIChange(idx, e.target.value)}
                        className="w-full bg-gray-950 border border-gray-700 text-gray-200 text-sm p-3 focus:border-orange-500 focus:outline-none"
                        placeholder={`POI ${idx + 1}...`}
                      />
                  </div>
              ))}
          </div>
      </div>

      {/* AI TOGGLE */}
      <div className="flex justify-center mb-6">
          <button 
            onClick={toggleAI}
            className={`flex items-center gap-3 px-4 py-2 rounded border transition-all duration-300 group
                ${useAI 
                    ? 'bg-purple-900/30 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                    : 'bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-600'
                }`}
          >
             <div className={`w-10 h-5 rounded-full relative transition-colors ${useAI ? 'bg-purple-500' : 'bg-gray-700'}`}>
                 <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform duration-300 ${useAI ? 'left-6' : 'left-1'}`}></div>
             </div>
             <div className="text-left">
                 <div className="text-xs font-bold font-mono tracking-wider">{t.enableAI}</div>
                 <div className="text-[10px] opacity-70 hidden sm:block">{t.enableAIDesc}</div>
             </div>
          </button>
      </div>

      {/* THREE ACTION BUTTONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* BUTTON 1: GENERATE WORLD */}
          <button
            onClick={() => { if (!isGenerating) { onGenerate(useAI, NarrativeMode.WORLD); playPowerUp(); } }}
            disabled={isGenerating}
            className={`group relative flex flex-col items-center justify-center p-6 border transition-all duration-300 rounded-sm
              ${isGenerating ? 'bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed' : 'bg-[#0b101b] border-accent-500/30 hover:bg-accent-900/20 hover:border-accent-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]'}
            `}
          >
             <div className="mb-2 text-accent-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <span className="font-mono font-bold tracking-widest text-sm text-white">GENERAR MUNDO</span>
             <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide">Mapa + Portada + POIs</span>
          </button>

          {/* BUTTON 2: GENERATE UI */}
          <button
            onClick={() => { if (!isGenerating) { onGenerate(useAI, NarrativeMode.UI); playPowerUp(); } }}
            disabled={isGenerating}
            className={`group relative flex flex-col items-center justify-center p-6 border transition-all duration-300 rounded-sm
              ${isGenerating ? 'bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed' : 'bg-[#0b101b] border-purple-500/30 hover:bg-purple-900/20 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]'}
            `}
          >
             <div className="mb-2 text-purple-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
             </div>
             <span className="font-mono font-bold tracking-widest text-sm text-white">GENERAR INTERFAZ</span>
             <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide">Botones + Ventanas + HUD</span>
          </button>

          {/* BUTTON 3: GENERATE CHARACTERS */}
          <button
            onClick={() => { if (!isGenerating) { onGenerate(useAI, NarrativeMode.CHARACTERS); playPowerUp(); } }}
            disabled={isGenerating}
            className={`group relative flex flex-col items-center justify-center p-6 border transition-all duration-300 rounded-sm
              ${isGenerating ? 'bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed' : 'bg-[#0b101b] border-orange-500/30 hover:bg-orange-900/20 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]'}
            `}
          >
             <div className="mb-2 text-orange-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
             </div>
             <span className="font-mono font-bold tracking-widest text-sm text-white">GENERAR PERSONAJES</span>
             <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide">Héroes + Villanos + Insignias</span>
          </button>

      </div>
    </div>
  );
};

export default NarrativeView;