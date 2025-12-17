import React, { useState } from 'react';
import { MapConfig, Language } from '../types';
import * as C from '../constants';
import { playPowerUp, playSwitch } from '../services/audioService';

interface NarrativeViewProps {
  config: MapConfig;
  onChange: (field: keyof MapConfig, value: any) => void;
  lang: Language;
  onGenerate: (useAI: boolean) => void;
  isGenerating?: boolean; // New prop for loading state
}

const NarrativeView: React.FC<NarrativeViewProps> = ({ config, onChange, lang, onGenerate, isGenerating }) => {
  const t = C.UI_TEXT[lang];
  const [useAI, setUseAI] = useState(false);

  const toggleAI = () => {
    playSwitch();
    setUseAI(!useAI);
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
      <div className="text-center mb-8">
        <h2 className="text-2xl font-mono font-bold text-white mb-2">{t.narrative} MODE</h2>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">{t.narrativeIntro}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* WORLD DATA */}
        <div className="bg-gray-900/50 p-6 tech-border backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent-600"></div>
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white font-mono">1. CONTEXTO</h3>
          </div>
          
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
          <SelectGroup label={t.place} field="placeType" options={C.PLACES_BY_CATEGORY[config.placeCategory] || []} />
          <SelectGroup label={t.civilization} field="civilization" options={C.CIVILIZATIONS} />
        </div>

        {/* VISUAL DNA */}
        <div className="bg-gray-900/50 p-6 tech-border backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-600"></div>
          <h3 className="text-lg font-bold text-white mb-4 font-mono">2. ADN VISUAL</h3>
          <div className="grid grid-cols-2 gap-4">
            <SelectGroup label={t.time} field="time" options={C.TIMES} />
            <SelectGroup label={t.weather} field="weather" options={C.WEATHERS} />
          </div>
          <SelectGroup label={t.style} field="artStyle" options={C.ART_STYLES} />
          <SelectGroup label={t.tech} field="renderTech" options={C.RENDER_TECHS} />
        </div>
      </div>

      {/* POI SETTINGS (NEW SECTION) */}
      <div className="bg-gray-900/50 p-6 tech-border backdrop-blur-sm relative overflow-hidden mb-8">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-600"></div>
          <h3 className="text-lg font-bold text-white mb-4 font-mono">3. CONFIGURACIÓN DE POIs</h3>
          <p className="text-xs text-gray-500 mb-4">Afecta solo a las escenas interiores (POIs y Entrada).</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <SelectGroup label={t.camera} field="camera" options={C.CAMERAS} />
            <SelectGroup label={t.zoom} field="zoom" options={C.ZOOMS} />
            <SelectGroup label={t.ratio} field="aspectRatio" options={C.RATIOS} />
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

      <div className="text-center">
        <button
          onClick={() => { if (!isGenerating) { onGenerate(useAI); playPowerUp(); } }}
          disabled={isGenerating}
          className={`group relative inline-flex items-center justify-center px-16 py-6 text-xl font-bold text-white transition-all duration-300 rounded-sm border
            ${isGenerating 
                ? 'bg-gray-800 border-gray-700 cursor-not-allowed opacity-80' 
                : 'bg-gray-950 border-accent-500/50 hover:bg-accent-900/20 hover:border-accent-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.25)]'
            }`}
        >
          {!isGenerating && (
              <>
                <span className="absolute w-2 h-2 bg-accent-400 top-0 left-0 -mt-1 -ml-1"></span>
                <span className="absolute w-2 h-2 bg-accent-400 top-0 right-0 -mt-1 -mr-1"></span>
                <span className="absolute w-2 h-2 bg-accent-400 bottom-0 left-0 -mb-1 -ml-1"></span>
                <span className="absolute w-2 h-2 bg-accent-400 bottom-0 right-0 -mb-1 -mr-1"></span>
              </>
          )}
          
          <span className="font-mono tracking-widest relative z-10 flex items-center">
            {isGenerating ? (
                <>
                 <svg className="animate-spin h-5 w-5 mr-3 text-accent-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 {t.processing}
                </>
            ) : (
                <>
                <svg className="w-6 h-6 mr-3 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {t.generateAssetsBtn}
                </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

export default NarrativeView;