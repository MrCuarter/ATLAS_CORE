import React, { useRef, useEffect, useMemo } from 'react';
import { MapConfig, Language } from '../types';
import { UI_TEXT, SCALES, CAMERAS, RATIOS, FANTASY_RACES, PLACES_BY_CIV } from '../constants';
import { playTechClick } from '../services/audioService';
import StyleSelector from './StyleSelector';

interface SimpleViewProps {
  config: MapConfig;
  onChange: (field: keyof MapConfig, value: any) => void;
  lang: Language;
}

const SimpleView: React.FC<SimpleViewProps> = ({ config, onChange, lang }) => {
  const t = UI_TEXT[lang];
  const endRef = useRef<HTMLDivElement>(null);

  const dynamicPlaces = useMemo(() => {
    return PLACES_BY_CIV[config.civilization] || PLACES_BY_CIV['DEFAULT'];
  }, [config.civilization]);

  useEffect(() => {
    if (endRef.current) setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [config.scale, config.civilization, config.placeType, config.artStyle]);

  const renderGrid = (title: string, items: string[], current: string, field: keyof MapConfig, visible: boolean) => {
    if (!visible) return null;
    return (
      <div className="mb-8 animate-fade-in bg-gray-900/30 border border-gray-800 p-6 rounded-lg backdrop-blur-sm">
        <h3 className="text-sm font-mono font-bold text-accent-400 mb-4 uppercase tracking-widest flex items-center">
            <span className="w-2 h-2 bg-accent-500 rounded-full mr-3 animate-pulse"></span> {title}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {items.map(item => (
            <button
              key={item}
              onClick={() => { onChange(field, item); playTechClick(); }}
              className={`px-2 py-2 text-[10px] sm:text-xs font-medium transition-all duration-200 border rounded h-14 leading-tight
                ${current === item ? 'bg-accent-900/40 border-accent-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="pb-8 max-w-5xl mx-auto">
      {renderGrid(t.stepScale, SCALES, config.scale, 'scale', true)}
      {renderGrid(t.stepCiv, FANTASY_RACES, config.civilization, 'civilization', !!config.scale)}
      {renderGrid(t.stepPlace, dynamicPlaces.slice(0, 8), config.placeType, 'placeType', !!config.civilization)}

      {!!config.placeType && (
        <div className="mb-8 animate-fade-in bg-gray-900/30 border border-gray-800 p-6 rounded-lg">
           <StyleSelector selectedStyle={config.artStyle} civilization={config.civilization} onSelect={(val) => onChange('artStyle', val)} lang={lang} isSimpleMode={true} />
        </div>
      )}

      {renderGrid(t.stepCamera, CAMERAS, config.camera, 'camera', !!config.artStyle)}
      {renderGrid(t.stepRatio, RATIOS, config.aspectRatio, 'aspectRatio', !!config.camera)}
      <div ref={endRef} className="h-4"></div>
    </div>
  );
};

export default SimpleView;