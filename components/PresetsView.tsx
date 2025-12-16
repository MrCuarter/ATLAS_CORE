import React from 'react';
import { Preset, Language } from '../types';
import { PRESETS, UI_TEXT } from '../constants';
import { playPowerUp, playTechClick } from '../services/audioService';

interface PresetsViewProps {
  onPresetSelect: (preset: Preset) => void;
  onSurprise: () => void;
  lang: Language;
}

const PresetsView: React.FC<PresetsViewProps> = ({ onPresetSelect, onSurprise, lang }) => {
  const t = UI_TEXT[lang];

  return (
    <div className="pb-32 animate-fade-in">
      {/* Surprise Section */}
      <div className="mb-12 flex flex-col items-center justify-center py-6">
        {/* Main Genesis Button */}
        <button
          onClick={() => { onSurprise(); playPowerUp(); }}
          className="group relative inline-flex items-center justify-center px-12 py-5 text-lg font-bold text-white transition-all duration-300 bg-gray-950 border border-accent-500/30 hover:bg-accent-900/10 hover:border-accent-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] rounded-sm overflow-hidden w-full max-w-2xl"
        >
            <span className="absolute w-1 h-3 bg-accent-400 top-0 left-0"></span>
            <span className="absolute w-1 h-3 bg-accent-400 top-0 right-0"></span>
            <span className="absolute w-1 h-3 bg-accent-400 bottom-0 left-0"></span>
            <span className="absolute w-1 h-3 bg-accent-400 bottom-0 right-0"></span>
            
            {/* Inner glow */}
            <div className="absolute inset-0 bg-accent-400/5 blur-xl group-hover:bg-accent-400/10 transition-colors"></div>

          <span className="mr-4 text-2xl text-accent-400 group-hover:rotate-180 transition-transform duration-700">❖</span>
          <span className="font-mono tracking-widest relative z-10">{t.surpriseBtn}</span>
        </button>
      </div>

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