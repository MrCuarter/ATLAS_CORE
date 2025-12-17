import React from 'react';
import { MapConfig, MediaType, Language } from '../types';
import * as C from '../constants';
import StyleSelector from './StyleSelector';

interface AdvancedViewProps {
  config: MapConfig;
  mediaType: MediaType;
  onChange: (field: keyof MapConfig, value: any) => void;
  lang: Language;
}

const AdvancedView: React.FC<AdvancedViewProps> = ({ config, onChange, lang }) => {
  const t = C.UI_TEXT[lang];

  const Select = ({ label, field, options, className = "" }: { label: string, field: keyof MapConfig, options: string[], className?: string }) => (
    <div className={`mb-4 ${className}`}>
      <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</label>
      <select
        value={config[field] as string}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full bg-gray-950 border border-gray-800 text-gray-300 text-xs p-2 focus:border-accent-500 outline-none transition-colors"
      >
        <option value="">{t.noneOption}</option>
        {options.map(opt => <option key={opt} value={opt}>{C.PROMPT_TRANSLATIONS[opt] || opt}</option>)}
      </select>
    </div>
  );

  return (
    <div className="pb-8 w-full max-w-7xl mx-auto flex flex-col xl:flex-row gap-6 animate-fade-in items-stretch">
      
      {/* 01. NUCLEO (Narrow) */}
      <div className="flex-[2] bg-gray-900/50 p-6 border border-gray-800 border-l-accent-500 border-l-4 rounded-r-lg">
        <h3 className="text-sm font-bold text-white mb-6 font-mono uppercase tracking-tighter flex items-center gap-2">
            <span className="text-accent-500">01</span> {t.scenario}
        </h3>
        <Select label={t.scale} field="scale" options={C.SCALES} />
        <Select label={t.civilization} field="civilization" options={C.FANTASY_RACES} />
        <Select label={t.place} field="placeType" options={C.PLACES_BY_CIV[config.civilization] || C.PLACES_BY_CIV['DEFAULT']} />
        <Select label={t.labelSettlement} field="buildingType" options={C.SETTLEMENT_TYPES} />
      </div>

      {/* 02. ATMOSFERA (Wide) */}
      <div className="flex-[4] bg-gray-900/50 p-6 border border-gray-800 border-l-purple-600 border-l-4 rounded-r-lg">
        <h3 className="text-sm font-bold text-white mb-6 font-mono uppercase tracking-tighter flex items-center gap-2">
            <span className="text-purple-600">02</span> {t.atmosphere}
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Select label={t.time} field="time" options={C.TIMES} />
          <Select label={t.weather} field="weather" options={C.WEATHERS} />
        </div>
        <StyleSelector selectedStyle={config.artStyle} onSelect={(val) => onChange('artStyle', val)} lang={lang} />
      </div>

      {/* 03. FORMATO (Narrow, Yellow accent) */}
      <div className="flex-[2] bg-gray-900/50 p-6 border border-gray-800 border-l-amber-500 border-l-4 rounded-r-lg">
        <h3 className="text-sm font-bold text-white mb-6 font-mono uppercase tracking-tighter flex items-center gap-2">
            <span className="text-amber-500">03</span> {t.format}
        </h3>
        <Select label={t.zoom} field="zoom" options={C.ZOOMS} />
        <Select label={t.camera} field="camera" options={C.CAMERAS} />
        <Select label={t.ratio} field="aspectRatio" options={C.RATIOS} />
        <div className="mt-6 border-t border-gray-800 pt-4">
           <label className="block text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest mb-2">{t.customPlaceholder}</label>
           <textarea 
            placeholder="Ej: Niebla volumétrica, iluminación cenital dramática..."
            value={config.customAtmosphere} 
            onChange={(e) => onChange('customAtmosphere', e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 text-gray-400 text-xs p-3 h-28 resize-none focus:border-amber-500 outline-none transition-all placeholder:italic"
           />
        </div>
      </div>

    </div>
  );
};

export default AdvancedView;