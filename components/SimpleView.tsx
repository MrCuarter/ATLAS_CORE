import React, { useRef, useEffect } from 'react';
import { MapConfig, Language } from '../types';
import { UI_TEXT, SCALES, CAMERAS, PLACES_BY_CATEGORY, PLACE_CATEGORIES } from '../constants';
import { playTechClick } from '../services/audioService';
import StyleSelector from './StyleSelector';

interface SimpleViewProps {
  config: MapConfig;
  onChange: (field: keyof MapConfig, value: any) => void;
  lang: Language;
}

// Helper to determine the category of a selected "Top Place"
const getCategoryForPlace = (place: string): string => {
  for (const cat of PLACE_CATEGORIES) {
    if (PLACES_BY_CATEGORY[cat].includes(place)) {
      return cat;
    }
  }
  return 'Civil'; // Fallback
};

// SHORTCUT LISTS FOR "FAST" MODE
const FAST_PLACES = [
  'Fortaleza', 'Ciudad', 'Prisión', 'Bosque ancestral', 
  'Templo', 'Base espacial', 'Ruinas antiguas', 'Cyberpunk Megacity', 
  'Puerto', 'Mazmorra', 'Cordillera', 'Desierto abierto'
];

const FAST_CIVS = [
  'Humana genérica', 'Medieval', 'Futurista', 'Cyberpunk', 
  'Elfos', 'Orcos', 'Imperial', 'Alienígena Orgánica'
];

const SimpleView: React.FC<SimpleViewProps> = ({ config, onChange, lang }) => {
  const t = UI_TEXT[lang];
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new sections appear
  useEffect(() => {
    if (endRef.current) {
        // Small delay to allow DOM to update
        setTimeout(() => {
            endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
  }, [config.scale, config.placeType, config.civilization, config.artStyle, config.camera]);

  const handlePlaceSelect = (place: string) => {
    const cat = getCategoryForPlace(place);
    onChange('placeCategory', cat);
    onChange('placeType', place);
  };

  const renderSection = (
    stepTitle: string,
    items: string[],
    currentValue: string,
    onSelect: (val: string) => void,
    visible: boolean,
    customGridClass?: string
  ) => {
    if (!visible) return null;

    return (
      <div className="mb-8 animate-fade-in bg-gray-900/30 border border-gray-800 p-6 rounded-lg backdrop-blur-sm">
        <h3 className="text-sm font-mono font-bold text-accent-400 mb-4 uppercase tracking-widest flex items-center">
            <span className="w-2 h-2 bg-accent-500 rounded-full mr-3 animate-pulse"></span>
            {stepTitle}
        </h3>
        <div className={customGridClass || "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"}>
          {items.map(item => {
             // For "Cyberpunk Megacity", we manually map it to "Ciudad" in backend but keep label
             const isSelected = currentValue === item || (item === 'Cyberpunk Megacity' && currentValue === 'Ciudad' && config.civilization === 'Cyberpunk');
             
             return (
              <button
                key={item}
                onClick={() => { onSelect(item); playTechClick(); }}
                className={`
                  relative px-2 py-2 text-xs sm:text-sm font-medium transition-all duration-200 border rounded
                  flex items-center justify-center text-center h-14 leading-tight break-words
                  ${isSelected 
                    ? 'bg-accent-900/40 border-accent-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                    : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600 hover:bg-gray-900'
                  }
                `}
              >
                {/* Selection marker */}
                {isSelected && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent-400 rounded-full shadow-[0_0_5px_rgba(34,211,238,0.8)]"></div>
                )}
                {item}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="pb-8 max-w-5xl mx-auto">
      
      {/* 1. SCALE */}
      {renderSection(
        t.stepScale, 
        SCALES, 
        config.scale, 
        (val) => onChange('scale', val), 
        true,
        "grid grid-cols-1 sm:grid-cols-2 gap-3"
      )}

      {/* 2. PLACE (Shortcuts) - Revealed when Scale is selected */}
      {renderSection(
        t.stepPlace, 
        FAST_PLACES, 
        config.placeType, 
        handlePlaceSelect, 
        !!config.scale
      )}

      {/* 3. CIVILIZATION - Revealed when Place is selected */}
      {renderSection(
        t.stepCiv, 
        FAST_CIVS, 
        config.civilization, 
        (val) => onChange('civilization', val), 
        !!config.placeType
      )}

      {/* 4. STYLE - Revealed when Civ is selected */}
      {!!config.civilization && (
        <div className="mb-8 animate-fade-in bg-gray-900/30 border border-gray-800 p-6 rounded-lg backdrop-blur-sm">
           <div className="mb-4">
             <span className="text-xs font-bold text-gray-500 uppercase mr-2">4.</span>
             {/* Title inside StyleSelector handles the main label */}
           </div>
           <StyleSelector 
             selectedStyle={config.artStyle}
             onSelect={(val) => onChange('artStyle', val)}
             lang={lang}
             isSimpleMode={true}
           />
        </div>
      )}

      {/* 5. CAMERA - Revealed when Style is selected */}
      {renderSection(
        t.stepCamera, 
        CAMERAS, 
        config.camera, 
        (val) => onChange('camera', val), 
        !!config.artStyle
      )}

       {/* 6. RATIO - Revealed when Camera is selected */}
       {!!config.camera && (
           <div className="mb-8 animate-fade-in bg-gray-900/30 border border-gray-800 p-6 rounded-lg backdrop-blur-sm">
             <h3 className="text-sm font-mono font-bold text-accent-400 mb-4 uppercase tracking-widest flex items-center">
                <span className="w-2 h-2 bg-accent-500 rounded-full mr-3 animate-pulse"></span>
                {t.stepRatio}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: t.ratioCinema, val: '16:9', icon: 'rectangle' },
                    { label: t.ratioMobile, val: '9:16', icon: 'vertical' },
                    { label: t.ratioSquare, val: '1:1', icon: 'square' },
                    { label: t.ratioUltra, val: '21:9', icon: 'ultra' }
                ].map((opt) => (
                    <button
                        key={opt.val}
                        onClick={() => { onChange('aspectRatio', opt.val); playTechClick(); }}
                        className={`
                        flex flex-col items-center justify-center p-2 border rounded transition-all duration-200 h-24
                        ${config.aspectRatio.includes(opt.val) 
                            ? 'bg-accent-900/40 border-accent-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                            : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600 hover:bg-gray-900'
                        }
                        `}
                    >
                        {/* CSS Shapes for Icons */}
                        <div className={`border-2 border-current mb-2 opacity-80 ${
                            opt.icon === 'rectangle' ? 'w-8 h-5' :
                            opt.icon === 'vertical' ? 'w-5 h-8' :
                            opt.icon === 'square' ? 'w-6 h-6' : 'w-10 h-4'
                        }`}></div>
                        <span className="text-xs font-bold text-center">{opt.label}</span>
                    </button>
                ))}
            </div>
           </div>
       )}
       
       {/* Invisible div to track end of content for auto-scroll */}
       <div ref={endRef} className="h-4"></div>
    </div>
  );
};

export default SimpleView;