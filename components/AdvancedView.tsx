import React, { useMemo } from 'react';
import { MapConfig, MediaType, Language, ThemeMode } from '../types';
import * as C from '../constants';
import StyleSelector from './StyleSelector';
import { playSwitch } from '../services/audioService';

interface AdvancedViewProps {
  config: MapConfig;
  mediaType: MediaType;
  onChange: (field: keyof MapConfig, value: any) => void;
  lang: Language;
}

const AdvancedView: React.FC<AdvancedViewProps> = ({ config, onChange, lang }) => {
  const t = C.UI_TEXT[lang];
  const theme = config.themeMode || ThemeMode.FANTASY;

  const handleThemeToggle = (newTheme: ThemeMode) => {
    onChange('themeMode', newTheme);
    onChange('civilization', '');
    onChange('placeType', '');
    onChange('buildingType', '');
    playSwitch();
  };

  // Determine lists based on theme (Mirroring Storycrafter logic)
  const civilizationOptions = theme === ThemeMode.FANTASY ? C.FANTASY_RACES : C.HISTORICAL_CIVS;
  const buildingOptions = theme === ThemeMode.FANTASY ? C.FANTASY_BUILDINGS : C.HISTORICAL_BUILDINGS;
  
  // Dynamic places based on selected Civ
  const placeOptions = useMemo(() => {
    if (theme === ThemeMode.FANTASY) {
        return C.PLACES_BY_CIV[config.civilization] || C.PLACES_BY_CIV['DEFAULT'];
    }
    // For Historical, we default to the standard list or could expand later
    return C.PLACES_BY_CIV['DEFAULT'];
  }, [config.civilization, theme]);

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
      <div className={`flex-[2] bg-gray-900/50 p-6 border border-gray-800 border-l-4 rounded-r-lg ${theme === ThemeMode.FANTASY ? 'border-l-purple-600' : 'border-l-orange-600'}`}>
        <h3 className="text-sm font-bold text-white mb-4 font-mono uppercase tracking-tighter flex items-center gap-2">
            <span className={theme === ThemeMode.FANTASY ? 'text-purple-600' : 'text-orange-600'}>01</span> {t.scenario}
        </h3>

        {/* Interruptor Fantasía / Histórico */}
        <div className="flex bg-gray-950 border border-gray-800 rounded mb-6 p-0.5">
            <button 
                onClick={() => handleThemeToggle(ThemeMode.FANTASY)} 
                className={`flex-1 py-1.5 text-[10px] font-bold transition-all uppercase tracking-wider rounded-sm ${theme === ThemeMode.FANTASY ? 'bg-purple-900/50 text-purple-300 border border-purple-500/30' : 'text-gray-500 hover:text-gray-300'}`}
            >
                {t.themeFantasy}
            </button>
            <button 
                onClick={() => handleThemeToggle(ThemeMode.HISTORICAL)} 
                className={`flex-1 py-1.5 text-[10px] font-bold transition-all uppercase tracking-wider rounded-sm ${theme === ThemeMode.HISTORICAL ? 'bg-orange-900/50 text-orange-300 border border-orange-500/30' : 'text-gray-500 hover:text-gray-300'}`}
            >
                {t.themeHistory}
            </button>
        </div>

        {/* Escala */}
        <Select label={t.scale} field="scale" options={C.SCALES} />
        
        {/* Lógica Storycrafter: 1A, 1B, 1C */}
        <Select 
            label={theme === ThemeMode.FANTASY ? t.labelRace : t.labelCiv} 
            field="civilization" 
            options={civilizationOptions} 
        />
        
        {theme === ThemeMode.FANTASY ? (
             <Select label={t.labelGeo} field="placeType" options={placeOptions} />
        ) : (
             <Select label={t.labelEra} field="era" options={C.HISTORICAL_ERAS} />
        )}

        <Select label={t.labelSettlement} field="buildingType" options={buildingOptions} />
      </div>

      {/* 02. ATMOSFERA (Wide) */}
      <div className="flex-[4] bg-gray-900/50 p-6 border border-gray-800 border-l-accent-500 border-l-4 rounded-r-lg">
        <h3 className="text-sm font-bold text-white mb-6 font-mono uppercase tracking-tighter flex items-center gap-2">
            <span className="text-accent-500">02</span> {t.atmosphere}
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Select label={t.time} field="time" options={C.TIMES} />
          <Select label={t.weather} field="weather" options={C.WEATHERS} />
        </div>
        <StyleSelector selectedStyle={config.artStyle} civilization={config.civilization} onSelect={(val) => onChange('artStyle', val)} lang={lang} />
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