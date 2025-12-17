import React, { useState, useEffect } from 'react';
import { Preset, Language, MapConfig, PromptType, MediaType } from '../types';
import { PRESET_BUCKETS, UI_TEXT } from '../constants';
import { playTechClick, playSuccess } from '../services/audioService';
import { generatePrompt } from '../services/promptGenerator';

interface PresetsViewProps {
  onPresetSelect: (preset: Preset) => void;
  onSurprise: () => void; 
  lang: Language;
  config: MapConfig;
  mediaType: MediaType;
  promptType: PromptType;
}

const PresetsView: React.FC<PresetsViewProps> = ({ onPresetSelect, lang, config, mediaType, promptType }) => {
  const [selectedPresets, setSelectedPresets] = useState<Preset[]>([]);
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const t = UI_TEXT[lang];

  // Logic to select 1 random preset from each of the 9 specific buckets
  const shufflePresets = () => {
    playTechClick();
    const newSelection: Preset[] = [];
    
    // Pick exactly one from each category bucket 1 to 9
    for (let i = 1; i <= 9; i++) {
        const bucket = PRESET_BUCKETS[i];
        if (bucket && bucket.length > 0) {
            const randomPreset = bucket[Math.floor(Math.random() * bucket.length)];
            newSelection.push(randomPreset);
        }
    }
    
    setSelectedPresets(newSelection);
  };

  // Initial load
  useEffect(() => {
    shufflePresets();
  }, []);

  const handlePresetClick = (preset: Preset) => {
    // 1. Update the app state first so PromptDisplay receives it
    onPresetSelect(preset);

    // 2. Generate the final prompt string using current application context
    const prompt = generatePrompt(preset.config as MapConfig, mediaType, promptType);
    
    // 3. Copy to clipboard
    navigator.clipboard.writeText(prompt);
    
    // 4. Feedback
    playSuccess();
    setCopiedName(preset.name);
    setTimeout(() => setCopiedName(null), 2000);
  };

  return (
    <div className="pb-8 animate-fade-in pt-4">
      
      {/* HEADER WITH SHUFFLE BUTTON */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-800 pb-6">
        <h3 className="text-xl font-mono font-bold text-gray-400 flex items-center border-l-2 border-accent-500/50 pl-4 uppercase tracking-widest">
          {t.presetsTitle}
        </h3>
        
        <button
          onClick={shufflePresets}
          className="group relative flex items-center gap-3 px-8 py-3 bg-gray-950 border border-accent-500/30 text-accent-400 font-mono font-bold text-xs uppercase tracking-widest hover:bg-accent-900/20 hover:border-accent-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all overflow-hidden"
        >
          <span className="absolute left-0 top-0 w-1 h-full bg-accent-500 group-hover:w-full transition-all opacity-10"></span>
          <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t.shuffleBtn}
        </button>
      </div>

      {/* 9 Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedPresets.map((preset, idx) => {
          const isCopied = copiedName === preset.name;
          return (
            <button
              key={idx}
              onClick={() => handlePresetClick(preset)}
              className={`
                flex flex-col text-left p-6 bg-gray-900/50 border transition-all duration-300 group h-full relative overflow-hidden backdrop-blur-sm
                ${isCopied ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-gray-800 hover:border-accent-500/50 hover:bg-gray-800/80'}
              `}
            >
              {/* Icon / Overlay */}
              <div className="absolute top-2 right-2">
                 {isCopied ? (
                    <svg className="w-5 h-5 text-green-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                 ) : (
                    <svg className="w-5 h-5 text-gray-700 group-hover:text-accent-500/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                 )}
              </div>

              {/* Bucket ID Indicator (Subtle background) */}
              <div className="absolute -bottom-2 -right-2 opacity-5 font-mono text-6xl italic group-hover:opacity-10 transition-opacity">
                {idx + 1}
              </div>

              {/* Top Detail: Map format indicator */}
              <div className="flex items-center gap-2 mb-3">
                 <div className="w-8 h-4 border border-gray-700 flex items-center justify-center">
                    <div className="w-full h-px bg-gray-800"></div>
                 </div>
                 <span className="text-[9px] font-mono text-gray-500 uppercase tracking-tighter">PLANO: 16:9 | CENITAL</span>
              </div>
              
              <div className="flex justify-between items-start w-full mb-2">
                <span className={`font-bold text-lg leading-tight font-sans transition-colors ${isCopied ? 'text-green-400' : 'text-gray-200 group-hover:text-accent-300'}`}>
                  {preset.name}
                </span>
              </div>
              
              <p className="text-xs text-gray-500 group-hover:text-gray-400 mb-6 flex-grow font-mono leading-relaxed italic">
                "{preset.description}"
              </p>

              <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                {preset.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-950 text-[9px] uppercase tracking-wider text-tech-500 border border-gray-800">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bottom copy info */}
              <div className={`mt-4 pt-3 border-t border-gray-800 text-[10px] font-mono uppercase tracking-widest text-center transition-colors ${isCopied ? 'text-green-500' : 'text-gray-600 group-hover:text-accent-500'}`}>
                 {isCopied ? t.copied : "CARGAR Y COPIAR PLANO"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PresetsView;