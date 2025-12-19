
import React, { useState, useEffect } from 'react';
import { Preset, Language, MapConfig, PromptType, MediaType } from '../types';
import { ARCHETYPE_DEFINITIONS, UI_TEXT } from '../constants';
import { playTechClick, playSuccess } from '../services/audioService';
import { generatePrompt, getRandomElement } from '../services/promptGenerator';

interface PresetsViewProps {
  onPresetSelect: (preset: Preset) => void;
  onSurprise: () => void; 
  lang: Language;
  config: MapConfig;
  mediaType: MediaType;
  promptType: PromptType;
  setPromptType: (type: PromptType) => void;
  setMediaType: (type: MediaType) => void;
}

const PresetsView: React.FC<PresetsViewProps> = ({ onPresetSelect, lang, config, mediaType, promptType, setPromptType, setMediaType }) => {
  const [selectedPresets, setSelectedPresets] = useState<Preset[]>([]);
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const t = UI_TEXT[lang];

  const shufflePresets = () => {
    playTechClick();
    const newSelection: Preset[] = [];
    
    // Generate 9 random coherent presets based on archetypes
    for (let i = 0; i < 9; i++) {
        const archetype = getRandomElement(ARCHETYPE_DEFINITIONS);
        
        // Pick random attributes from the coherent pool of the archetype
        const civ = getRandomElement(archetype.civs);
        const place = getRandomElement(archetype.places);
        const style = getRandomElement(archetype.styles);
        const isScene = Math.random() > 0.5; // 50% chance of being a Scene vs Map
        
        // Generate a dynamic name
        const prefixes = ['Reino', 'Valle', 'Bastión', 'Imperio', 'Ruinas', 'Santuario', 'Ciudad', 'Enclave'];
        const randomPrefix = getRandomElement(prefixes);
        // Fallback name logic if civ or place is undefined (though they shouldn't be)
        const name = `${randomPrefix} ${civ.split(' ')[0]}`;

        const newPreset: Preset = {
            name: name.toUpperCase(),
            description: `Generado por IA: ${archetype.name} - ${civ}`,
            tags: [isScene ? "ESCENA" : "MAPA", style.toUpperCase(), archetype.name.toUpperCase()],
            config: {
                civilization: civ,
                placeType: place,
                buildingType: 'Asentamiento Principal', // Generic fallback, prompts usually handle details
                artStyle: style,
                era: archetype.era,
                aspectRatio: '16:9',
                zoom: isScene ? 'Escena (Detalle)' : 'Región (Medio)',
                camera: isScene ? 'Cinematic Frontal View' : 'Cenital (90º)',
                scale: 'Meso (Ciudad, Región)',
                time: 'Mediodía',
                weather: 'Soleado',
                videoMovement: 'Desplazamiento suave'
            }
        };
        newSelection.push(newPreset);
    }
    
    setSelectedPresets(newSelection);
  };

  useEffect(() => {
    shufflePresets();
    // Force Image mode when entering Constructor to ensure consistency since selector is removed
    setMediaType(MediaType.IMAGE);
  }, []);

  const handlePresetClick = (preset: Preset) => {
    onPresetSelect(preset);
    const prompt = generatePrompt(preset.config as MapConfig, mediaType, promptType);
    navigator.clipboard.writeText(prompt);
    playSuccess();
    setCopiedName(preset.name);
    setTimeout(() => setCopiedName(null), 2000);
  };

  return (
    <div className="pb-8 animate-fade-in pt-4">
      
      {/* HEADER WITH SHUFFLE BUTTON */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {selectedPresets.map((preset, idx) => {
          const isCopied = copiedName === preset.name;
          // Colors based on tags for visual variety
          const isFantasy = preset.tags.some(t => ['Alta Fantasía', 'Fantasía Oscura', 'Oriente Místico'].includes(t));
          const isHistorical = preset.tags.some(t => ['Mundo Antiguo', 'Norte Salvaje'].includes(t));
          
          let categoryColor = "text-purple-400 border-purple-900/50";
          let categoryLabel = preset.tags[2] || "GENÉRICO"; // Use archetype name

          if (categoryLabel === 'FUTURO & NEÓN' || categoryLabel === 'RETRO & PIXEL') {
             categoryColor = "text-cyan-400 border-cyan-900/50";
          } else if (isHistorical) {
             categoryColor = "text-orange-400 border-orange-900/50";
          }

          return (
            <button
              key={idx}
              onClick={() => handlePresetClick(preset)}
              className={`
                flex flex-col text-left p-0 bg-gray-900/50 border transition-all duration-300 group h-full relative overflow-hidden backdrop-blur-sm rounded-lg
                ${isCopied ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)] scale-[1.02]' : 'border-gray-800 hover:border-accent-500/50 hover:bg-gray-800/80 hover:scale-[1.01]'}
              `}
            >
                {/* Header of Card */}
                <div className="w-full bg-gray-950 p-4 border-b border-gray-800 flex justify-between items-start">
                    <div>
                        <div className="flex gap-2 mb-1">
                            <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 border rounded ${categoryColor} bg-gray-900 uppercase`}>
                                {categoryLabel}
                            </span>
                        </div>
                        <h4 className={`mt-1 font-bold text-lg leading-tight font-sans ${isCopied ? 'text-green-400' : 'text-gray-200 group-hover:text-white'}`}>
                            {preset.name}
                        </h4>
                    </div>
                    {/* ID */}
                    <span className="text-gray-800 font-mono text-xl font-bold opacity-30 select-none">#{idx + 1}</span>
                </div>

                {/* Tech Specs Box */}
                <div className="p-4 flex-grow w-full">
                    <p className="text-xs text-gray-500 mb-4 italic font-mono min-h-[2.5em]">{preset.description}</p>
                    
                    <div className="bg-gray-950/80 border border-gray-800 rounded p-3 text-[10px] font-mono space-y-2 text-gray-400">
                        <div className="flex justify-between border-b border-gray-800/50 pb-1">
                            <span className="opacity-50">LUGAR:</span>
                            <span className="text-gray-300 font-bold truncate max-w-[150px] text-right">{preset.config.placeType}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-800/50 pb-1">
                             <span className="opacity-50">ESTILO:</span>
                             <span className="text-accent-400 font-bold truncate max-w-[150px] text-right">{preset.config.artStyle}</span>
                        </div>
                         <div className="flex justify-between border-b border-gray-800/50 pb-1">
                             <span className="opacity-50">TIPO:</span>
                             <span className="text-gray-300 font-bold">{preset.tags[0]}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={`w-full py-2 text-center text-[9px] font-mono font-bold uppercase tracking-widest border-t border-gray-800 transition-colors ${isCopied ? 'bg-green-900/20 text-green-400' : 'bg-gray-950 text-gray-600 group-hover:bg-gray-900 group-hover:text-accent-400'}`}>
                    {isCopied ? t.copied : "SELECCIONAR PROTOTIPO"}
                </div>
            </button>
          );
        })}
      </div>

      {/* NEW PLATFORM SELECTOR AT BOTTOM */}
      <div className="bg-[#0b101b] border border-gray-800 rounded-lg p-6 max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 left-0 w-1 h-full bg-accent-500"></div>
         {/* Removed the number "10" from this header */}
         <h3 className="text-sm font-mono font-bold text-accent-400 mb-4 uppercase tracking-widest flex items-center">
             {t.stepPlatform}
        </h3>
        <p className="text-xs text-gray-500 mb-6 font-mono border-b border-gray-800 pb-4">{t.stepPlatformSubtitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
                onClick={() => { playTechClick(); setPromptType(PromptType.UNIVERSAL); }}
                className={`p-4 rounded border text-left transition-all relative overflow-hidden group
                ${promptType === PromptType.UNIVERSAL ? 'bg-blue-900/30 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-gray-950 border-gray-800 hover:border-gray-600'}`}
            >
                <div className="font-bold font-mono text-sm mb-1 text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {t.formatUniversal}
                </div>
                <div className="text-[10px] text-gray-400">{t.formatUniversalDesc}</div>
            </button>

            <button
                onClick={() => { playTechClick(); setPromptType(PromptType.MIDJOURNEY); }}
                className={`p-4 rounded border text-left transition-all relative overflow-hidden group
                ${promptType === PromptType.MIDJOURNEY ? 'bg-purple-900/30 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-gray-950 border-gray-800 hover:border-gray-600'}`}
            >
                <div className="font-bold font-mono text-sm mb-1 text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    {t.formatMJ}
                </div>
                <div className="text-[10px] text-gray-400">{t.formatMJDesc}</div>
            </button>

            <button
                onClick={() => { playTechClick(); setPromptType(PromptType.ADVANCED); }}
                className={`p-4 rounded border text-left transition-all relative overflow-hidden group
                ${promptType === PromptType.ADVANCED ? 'bg-orange-900/30 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'bg-gray-950 border-gray-800 hover:border-gray-600'}`}
            >
                <div className="font-bold font-mono text-sm mb-1 text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    {t.formatAdvanced}
                </div>
                <div className="text-[10px] text-gray-400">{t.formatAdvancedDesc}</div>
            </button>
        </div>
      </div>

    </div>
  );
};

export default PresetsView;
