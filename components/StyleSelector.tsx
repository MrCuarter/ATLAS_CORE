import React, { useState } from 'react';
import { UI_TEXT, STYLES_ARTISTIC, STYLES_GAMES, STYLES_MEDIA } from '../constants';
import { Language } from '../types';
import { playTechClick } from '../services/audioService';

interface StyleSelectorProps {
  selectedStyle: string;
  onSelect: (style: string) => void;
  lang: Language;
  isSimpleMode?: boolean;
}

type StyleCategory = 'ART' | 'GAME' | 'MEDIA';

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onSelect, lang, isSimpleMode = false }) => {
  const [activeCategory, setActiveCategory] = useState<StyleCategory>('ART');
  const t = UI_TEXT[lang];

  // Helper to get items based on category
  const getItems = (cat: StyleCategory) => {
    let items = [];
    if (cat === 'ART') items = STYLES_ARTISTIC;
    else if (cat === 'GAME') items = STYLES_GAMES;
    else items = STYLES_MEDIA;

    if (isSimpleMode) {
      return items.slice(0, 12);
    }
    return items;
  };

  const currentItems = getItems(activeCategory);

  return (
    <div className="w-full">
      {/* Label */}
      <h3 className="text-sm font-mono font-bold text-accent-400 mb-3 uppercase tracking-widest flex items-center">
        {!isSimpleMode && <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></span>}
        {t.style}
      </h3>

      {/* Triple Toggle Switch */}
      <div className="flex bg-gray-950 p-1 rounded border border-gray-800 mb-4">
        <button
          onClick={() => { setActiveCategory('ART'); playTechClick(); }}
          className={`flex-1 py-2 text-[10px] sm:text-xs font-bold font-mono tracking-wider transition-all rounded-sm uppercase ${
            activeCategory === 'ART'
              ? 'bg-purple-900/40 text-purple-300 border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
              : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'
          }`}
        >
          {t.styleArt}
        </button>
        <button
          onClick={() => { setActiveCategory('GAME'); playTechClick(); }}
          className={`flex-1 py-2 text-[10px] sm:text-xs font-bold font-mono tracking-wider transition-all rounded-sm uppercase ${
            activeCategory === 'GAME'
              ? 'bg-purple-900/40 text-purple-300 border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
              : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'
          }`}
        >
          {t.styleGame}
        </button>
        <button
          onClick={() => { setActiveCategory('MEDIA'); playTechClick(); }}
          className={`flex-1 py-2 text-[10px] sm:text-xs font-bold font-mono tracking-wider transition-all rounded-sm uppercase ${
            activeCategory === 'MEDIA'
              ? 'bg-purple-900/40 text-purple-300 border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
              : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'
          }`}
        >
          {t.styleMedia}
        </button>
      </div>

      {/* Grid Container */}
      <div className={`
        bg-gray-950 border border-gray-800 rounded p-2 custom-scrollbar
        ${isSimpleMode ? 'h-auto' : 'h-64 overflow-y-auto'}
      `}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {currentItems.map((style) => {
            const isSelected = selectedStyle === style;
            return (
              <button
                key={style}
                onClick={() => { onSelect(style); playTechClick(); }}
                className={`
                  relative px-3 py-2 text-[10px] sm:text-xs font-mono text-left transition-all duration-200 border rounded
                  ${isSelected 
                    ? 'bg-purple-900/30 border-purple-400 text-white shadow-[0_0_10px_rgba(168,85,247,0.2)]' 
                    : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                  }
                `}
              >
                {/* Selection marker dot */}
                {isSelected && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-purple-400 rounded-full shadow-[0_0_5px_rgba(168,85,247,0.8)]"></div>
                )}
                {style}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StyleSelector;