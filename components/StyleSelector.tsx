import React, { useState, useEffect } from 'react';
import { UI_TEXT, STYLES_ARTISTIC, STYLES_GAMES, STYLES_MEDIA } from '../constants';
import { Language } from '../types';
import { playTechClick } from '../services/audioService';

interface StyleSelectorProps {
  selectedStyle: string;
  civilization?: string; // New prop to check for clashes
  onSelect: (style: string) => void;
  lang: Language;
  isSimpleMode?: boolean;
}

type StyleCategory = 'ART' | 'GAME' | 'MEDIA';

// Helper to detect thematic clashes
const detectClash = (style: string, civ: string): string | null => {
  if (!style || !civ) return null;
  const s = style.toLowerCase();
  const c = civ.toLowerCase();

  const isSciFiStyle = s.includes('cyber') || s.includes('neon') || s.includes('mass effect') || s.includes('halo') || s.includes('destiny') || s.includes('starcraft') || s.includes('matrix');
  const isAncientCiv = c.includes('medieval') || c.includes('elfos') || c.includes('orcos') || c.includes('prehist') || c.includes('romana') || c.includes('antigua') || c.includes('tribu');

  const isCartoonStyle = s.includes('mario') || s.includes('simpsons') || s.includes('adventure time') || s.includes('pokemon') || s.includes('disney');
  const isSeriousCiv = c.includes('terror') || c.includes('lovecraft') || c.includes('dark fantasy') || c.includes('realista');

  if (isSciFiStyle && isAncientCiv) return "ANACHRONISM_WARNING";
  if (isCartoonStyle && isSeriousCiv) return "TONE_CLASH_WARNING";
  
  return null;
};

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, civilization, onSelect, lang, isSimpleMode = false }) => {
  const [activeCategory, setActiveCategory] = useState<StyleCategory>('ART');
  const [clashWarning, setClashWarning] = useState<string | null>(null);
  const t = UI_TEXT[lang];

  useEffect(() => {
    if (civilization && selectedStyle) {
        setClashWarning(detectClash(selectedStyle, civilization));
    } else {
        setClashWarning(null);
    }
  }, [selectedStyle, civilization]);

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

  const renderWarning = () => {
      if (clashWarning === "ANACHRONISM_WARNING") {
          return (
              <div className="mb-3 p-2 bg-yellow-900/20 border border-yellow-600/50 rounded flex items-start gap-2 animate-fade-in">
                  <svg className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <div>
                      <h4 className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">FUSIÓN ANACRÓNICA</h4>
                      <p className="text-[10px] text-yellow-200/70 leading-tight">
                          El estilo <strong>{selectedStyle}</strong> forzará una reinterpretación tecnológica de la civilización <strong>{civilization}</strong>.
                      </p>
                  </div>
              </div>
          );
      }
      if (clashWarning === "TONE_CLASH_WARNING") {
        return (
            <div className="mb-3 p-2 bg-pink-900/20 border border-pink-600/50 rounded flex items-start gap-2 animate-fade-in">
                <svg className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                    <h4 className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">CHOQUE TONAL</h4>
                    <p className="text-[10px] text-pink-200/70 leading-tight">
                        El estilo <strong>{selectedStyle}</strong> suavizará drásticamente la temática <strong>{civilization}</strong>.
                    </p>
                </div>
            </div>
        );
      }
      return null;
  };

  return (
    <div className="w-full">
      {/* Label */}
      <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-mono font-bold text-accent-400 uppercase tracking-widest flex items-center">
            {!isSimpleMode && <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></span>}
            {t.style}
          </h3>
          {selectedStyle && (
              <span className="text-[9px] font-mono text-gray-500 uppercase bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
                  PRIORIDAD ALTA
              </span>
          )}
      </div>

      {/* Warning Area */}
      {renderWarning()}

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
                  relative px-2 py-1 text-[10px] sm:text-xs font-mono transition-all duration-200 border rounded
                  flex items-center justify-center text-center h-12 leading-tight break-words
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