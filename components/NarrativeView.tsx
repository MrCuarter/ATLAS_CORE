import React from 'react';
import { MapConfig, Language } from '../types';
import * as C from '../constants';

interface NarrativeViewProps {
  config: MapConfig;
  onChange: (field: keyof MapConfig, value: any) => void;
  onSecretPlace: () => void;
  lang: Language;
  onGenerate: () => void;
}

const NarrativeView: React.FC<NarrativeViewProps> = ({ config, onChange, onSecretPlace, lang, onGenerate }) => {
  const t = C.UI_TEXT[lang];

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
    <div className="animate-fade-in pb-12 max-w-4xl mx-auto">
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
               <button 
                onClick={onSecretPlace}
                className="text-[10px] font-bold font-mono uppercase text-accent-300 border border-accent-500/30 px-3 py-1 hover:bg-accent-500/10 transition-colors flex items-center gap-2"
            >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                {t.secretPlaceBtn}
            </button>
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

      <div className="text-center">
        <button
          onClick={onGenerate}
          className="group relative inline-flex items-center justify-center px-16 py-6 text-xl font-bold text-white transition-all duration-300 bg-gray-950 border border-accent-500/50 hover:bg-accent-900/20 hover:border-accent-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.25)] rounded-sm"
        >
             <span className="absolute w-2 h-2 bg-accent-400 top-0 left-0 -mt-1 -ml-1"></span>
            <span className="absolute w-2 h-2 bg-accent-400 top-0 right-0 -mt-1 -mr-1"></span>
            <span className="absolute w-2 h-2 bg-accent-400 bottom-0 left-0 -mb-1 -ml-1"></span>
            <span className="absolute w-2 h-2 bg-accent-400 bottom-0 right-0 -mb-1 -mr-1"></span>
          <span className="font-mono tracking-widest relative z-10 flex items-center">
            <svg className="w-6 h-6 mr-3 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {t.generateAssetsBtn}
          </span>
        </button>
      </div>
    </div>
  );
};

export default NarrativeView;