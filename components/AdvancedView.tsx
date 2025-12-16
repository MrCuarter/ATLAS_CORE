import React, { useMemo } from 'react';
import { MapConfig, MediaType, Language } from '../types';
import * as C from '../constants';
import { playTechClick } from '../services/audioService';

interface AdvancedViewProps {
  config: MapConfig;
  mediaType: MediaType;
  onChange: (field: keyof MapConfig, value: any) => void;
  onSecretPlace: () => void;
  lang: Language;
}

const AdvancedView: React.FC<AdvancedViewProps> = ({ config, mediaType, onChange, onSecretPlace, lang }) => {
  const t = C.UI_TEXT[lang];
  
  // Dynamic POI list based on selected place type
  const availablePOIs = useMemo(() => {
    return C.POI_MAPPING[config.placeType] || C.POI_MAPPING['DEFAULT'];
  }, [config.placeType]);

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
              // Translate option if lang is English using the dictionary
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
    <div className="pb-32 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      
      {/* Block 1: Scenario */}
      <div className="bg-gray-900/50 p-6 tech-border backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-accent-900 group-hover:bg-accent-500 transition-colors"></div>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center font-mono">
                <span className="text-accent-400 mr-3">01 //</span>
                {t.scenario}
            </h3>
            <button 
                onClick={() => { onSecretPlace(); playTechClick(); }}
                className="text-[10px] font-bold font-mono uppercase text-accent-300 border border-accent-500/30 px-3 py-1 hover:bg-accent-500/10 transition-colors flex items-center gap-2"
            >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                {t.secretPlaceBtn}
            </button>
        </div>
        
        <SelectGroup label={t.scale} field="scale" options={C.SCALES} />
        
        <div className="mb-4">
           <label className="block text-xs font-mono font-bold text-accent-400 uppercase tracking-widest mb-2 opacity-80">
            {t.category}
          </label>
           <div className="relative">
            <select
                value={config.placeCategory}
                onChange={(e) => {
                const newCat = e.target.value;
                if (!newCat) {
                     onChange('placeCategory', '');
                     onChange('placeType', '');
                } else {
                    const firstPlace = C.PLACES_BY_CATEGORY[newCat][0];
                    onChange('placeCategory', newCat);
                    onChange('placeType', firstPlace);
                }
                }}
                className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 block p-3 tech-input font-sans appearance-none"
            >
                 <option value="" className="text-gray-500 italic">{t.noneOption}</option>
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
        <SelectGroup label={t.poi} field="poi" options={availablePOIs} />
        <SelectGroup label={t.civilization} field="civilization" options={C.CIVILIZATIONS} />

        {/* Custom Input Block 1 */}
        <div className="mt-6 pt-4 border-t border-gray-800">
             <label className="block text-xs font-mono font-bold text-tech-500 uppercase tracking-widest mb-2">
                {t.customScenarioLabel}
            </label>
            <textarea 
                value={config.customScenario}
                onChange={(e) => onChange('customScenario', e.target.value)}
                placeholder={t.customPlaceholder}
                className="w-full bg-gray-950 border border-gray-700 text-gray-300 text-sm p-3 focus:outline-none focus:border-accent-500 h-20 resize-none tech-input font-mono"
            />
        </div>
      </div>

      {/* Block 2: Atmosphere */}
      <div className="bg-gray-900/50 p-6 tech-border backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-purple-900 group-hover:bg-purple-500 transition-colors"></div>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center font-mono">
           <span className="text-purple-400 mr-3">02 //</span>
          {t.atmosphere}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <SelectGroup label={t.time} field="time" options={C.TIMES} />
          <SelectGroup label={t.weather} field="weather" options={C.WEATHERS} />
        </div>
        <SelectGroup label={t.tech} field="renderTech" options={C.RENDER_TECHS} />
        <SelectGroup label={t.style} field="artStyle" options={C.ART_STYLES} />

         {/* Custom Input Block 2 */}
         <div className="mt-6 pt-4 border-t border-gray-800">
             <label className="block text-xs font-mono font-bold text-tech-500 uppercase tracking-widest mb-2">
                {t.customAtmosphereLabel}
            </label>
            <textarea 
                value={config.customAtmosphere}
                onChange={(e) => onChange('customAtmosphere', e.target.value)}
                placeholder={t.customPlaceholder}
                className="w-full bg-gray-950 border border-gray-700 text-gray-300 text-sm p-3 focus:outline-none focus:border-accent-500 h-20 resize-none tech-input font-mono"
            />
        </div>
      </div>

      {/* Block 3: Format */}
      <div className="bg-gray-900/50 p-6 tech-border backdrop-blur-sm relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-1 h-full bg-green-900 group-hover:bg-green-500 transition-colors"></div>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center font-mono">
           <span className="text-green-400 mr-3">03 //</span>
          {t.format}
        </h3>
        <SelectGroup label={t.zoom} field="zoom" options={C.ZOOMS} />
        <SelectGroup label={t.camera} field="camera" options={C.CAMERAS} />
        <SelectGroup label={t.ratio} field="aspectRatio" options={C.RATIOS} />
      </div>

      {/* Block 4: Video (Conditional) */}
      {mediaType === MediaType.VIDEO && (
        <div className="bg-gray-900/50 p-6 border border-orange-900/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-900 group-hover:bg-orange-500 transition-colors"></div>
          <h3 className="text-xl font-bold text-orange-400 mb-6 flex items-center font-mono">
            <span className="text-orange-600 mr-3">04 //</span>
            {t.videoSettings}
          </h3>
          <SelectGroup label={t.movement} field="videoMovement" options={C.VIDEO_MOVEMENTS} />
          <SelectGroup label={t.dynamics} field="videoDynamics" options={C.VIDEO_DYNAMICS} />
          <SelectGroup label={t.rhythm} field="videoRhythm" options={C.VIDEO_RHYTHMS} />
          
          <div className="mt-4 flex items-center p-3 bg-gray-950 border border-gray-800">
            <input 
              id="video-loop" 
              type="checkbox" 
              checked={config.videoLoop} 
              onChange={(e) => onChange('videoLoop', e.target.checked)}
              className="w-5 h-5 text-orange-600 bg-gray-900 border-gray-600 rounded focus:ring-orange-500 focus:ring-1" 
            />
            <label htmlFor="video-loop" className="ml-3 text-sm font-medium text-gray-300 font-mono">{t.loop}</label>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedView;