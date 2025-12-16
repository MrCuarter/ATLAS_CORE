import React, { useRef } from 'react';
import { Preset, Language, MapConfig } from '../types';
import { PRESETS, UI_TEXT } from '../constants';
import { playTechClick } from '../services/audioService';

interface PresetsViewProps {
  onPresetSelect: (preset: Preset) => void;
  // onSurprise removed as it's handled globally now
  onSurprise: () => void; 
  lang: Language;
  config?: MapConfig; // Accept current config to show active state
}

const PresetsView: React.FC<PresetsViewProps> = ({ onPresetSelect, lang, config }) => {
  const t = UI_TEXT[lang];

  // Determine if we have a "custom" or "generated" protocol active that isn't just a placeholder
  const hasActiveProtocol = config && config.presetName && config.presetName.includes('ATLAS_CORE');

  return (
    <div className="pb-8 animate-fade-in pt-4">
      
      {/* ACTIVE PROTOCOL DASHBOARD - Only shows if World-Gen was run */}
      {hasActiveProtocol && (
        <div className="mb-8 p-6 bg-gray-900/80 border border-accent-500/50 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.1)] relative overflow-hidden group">
            {/* Animated Background Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-500 to-transparent animate-pulse-slow"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-accent-400 font-mono font-bold text-sm tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></span>
                        {t.activeProtocol}
                    </h3>
                    <h2 className="text-white text-2xl font-bold font-sans tracking-tight">
                        {config.presetName}
                    </h2>
                </div>
                
                {/* Visual DNA Tags */}
                <div className="flex flex-wrap gap-2">
                    {[config.civilization, config.placeType, config.weather, config.artStyle].filter(Boolean).map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-black/50 border border-accent-500/30 text-accent-300 text-xs font-mono font-bold rounded uppercase">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* Presets Grid */}
      <h3 className="text-xl font-mono font-bold text-gray-400 mb-6 pl-2 flex items-center border-l-2 border-accent-500/50">
        {t.presetsTitle}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {PRESETS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => { onPresetSelect(preset); playTechClick(); }}
            className="flex flex-col text-left p-5 bg-gray-900 border border-gray-800 hover:border-accent-500/50 hover:bg-gray-800 transition-all duration-200 group h-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-accent-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-start w-full mb-2 z-10">
              <span className="font-bold text-gray-200 group-hover:text-accent-300 text-lg leading-tight font-sans">
                {preset.name}
              </span>
            </div>
            <p className="text-sm text-gray-500 group-hover:text-gray-400 mb-4 flex-grow font-mono leading-relaxed">
              {preset.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-auto z-10">
              {preset.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-gray-950 text-[10px] uppercase tracking-wider text-tech-500 border border-gray-800 group-hover:border-accent-900/50 group-hover:text-accent-400/80">
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresetsView;