import React, { useState, useMemo } from 'react';
import { MapConfig, Language, NarrativeMode, ThemeMode } from '../types';
import * as C from '../constants';
import { playSwitch } from '../services/audioService';
import StyleSelector from './StyleSelector';

interface NarrativeViewProps {
  config: MapConfig;
  onChange: (field: keyof MapConfig, value: any) => void;
  lang: Language;
  onGenerate: (useAI: boolean, mode: NarrativeMode) => void;
  isGenerating?: boolean; 
  onRandom: () => void; 
}

const NarrativeView: React.FC<NarrativeViewProps> = ({ config, onChange, lang, onGenerate, isGenerating }) => {
  const t = C.UI_TEXT[lang];
  const [isManual, setIsManual] = useState(false);
  const theme = config.themeMode || ThemeMode.FANTASY;

  // Check for anachronisms
  const showAnachronism = useMemo(() => {
    if (theme === ThemeMode.FANTASY) return false;
    const futureEras = ['Año 2050', 'Año 3000', 'Año 4000', 'Cyberpunk', 'Futuro'];
    // Simple check if civ is ancient and era is future
    const ancientCivs = ['Egipcia', 'Griega', 'Romana', 'Azteca', 'Maya', 'Inca', 'Vikinga'];
    return futureEras.some(e => config.era.includes(e)) && ancientCivs.some(c => config.civilization.includes(c));
  }, [config.civilization, config.era, theme]);

  const handleThemeToggle = (newTheme: ThemeMode) => {
    onChange('themeMode', newTheme);
    onChange('civilization', '');
    onChange('placeType', '');
    onChange('buildingType', '');
    playSwitch();
  };

  const handleModeToggle = (manual: boolean) => {
      setIsManual(manual);
      playSwitch();
  }

  const dynamicPlaces = useMemo(() => {
    if (theme === ThemeMode.FANTASY) {
        return C.PLACES_BY_CIV[config.civilization] || C.PLACES_BY_CIV['DEFAULT'];
    }
    return C.PLACES_BY_CIV['DEFAULT'];
  }, [config.civilization, theme]);

  return (
    <div className="animate-fade-in pb-8 max-w-5xl mx-auto">
      
      {/* HEADER & TOGGLES */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-6">{t.storycrafterTitle}</h2>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            {/* THEME TOGGLE */}
            <div className="bg-gray-900 border border-gray-800 p-1 rounded-full flex shadow-xl">
                <button 
                    onClick={() => handleThemeToggle(ThemeMode.FANTASY)} 
                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${theme === ThemeMode.FANTASY ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    {t.themeFantasy}
                </button>
                <button 
                    onClick={() => handleThemeToggle(ThemeMode.HISTORICAL)} 
                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${theme === ThemeMode.HISTORICAL ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    {t.themeHistory}
                </button>
            </div>

            {/* MODE TOGGLE (Assistant vs Manual) */}
            <div className="bg-gray-900 border border-gray-800 p-1 rounded-full flex shadow-xl">
                 <button 
                    onClick={() => handleModeToggle(false)} 
                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${!isManual ? 'bg-accent-600 text-white shadow-lg shadow-accent-900/50' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    {t.modeAssistant}
                </button>
                <button 
                    onClick={() => handleModeToggle(true)} 
                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${isManual ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    {t.modeManual}
                </button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        {/* BLOQUE 1: NÚCLEO DE ESCENARIO */}
        <div className={`bg-gray-900/50 p-6 border border-gray-800 border-t-4 rounded-r-lg ${theme === ThemeMode.FANTASY ? 'border-t-purple-600' : 'border-t-orange-600'}`}>
            <h3 className={`text-lg font-bold text-white mb-6 font-mono flex items-center gap-2 uppercase tracking-tighter`}>
                <span className={theme === ThemeMode.FANTASY ? 'text-purple-500' : 'text-orange-500'}>1.</span> {t.scenario}
            </h3>
            
            <div className="space-y-4">
                {/* 1A */}
                <div>
                    <label className="block text-[10px] text-gray-500 mb-1 font-mono uppercase font-bold">
                        {theme === ThemeMode.FANTASY ? t.labelRace : t.labelCiv}
                    </label>
                    {!isManual ? (
                        <select 
                            value={config.civilization} 
                            onChange={(e) => onChange('civilization', e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 p-3 text-sm text-gray-200 outline-none focus:border-accent-500 transition-colors"
                        >
                            <option value="">{t.noneOption}</option>
                            {(theme === ThemeMode.FANTASY ? C.FANTASY_RACES : C.HISTORICAL_CIVS).map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    ) : (
                        <input 
                            type="text" 
                            value={config.civilization} 
                            onChange={(e) => onChange('civilization', e.target.value)} 
                            className="w-full bg-gray-950 border border-gray-800 p-3 text-sm text-white placeholder-gray-600 focus:border-accent-500 outline-none" 
                            placeholder={theme === ThemeMode.FANTASY ? "Ej: Enanos de Lava, Hadas del Hielo..." : "Ej: Imperio Otomano, Mayas..."} 
                        />
                    )}
                </div>

                {/* 1B */}
                <div>
                    <label className="block text-[10px] text-gray-500 mb-1 font-mono uppercase font-bold">
                        {theme === ThemeMode.FANTASY ? t.labelGeo : t.labelEra}
                    </label>
                    
                    {theme === ThemeMode.FANTASY ? (
                        // FANTASY 1B: GEOLOCATION
                        !isManual ? (
                            <select 
                                value={config.placeType} 
                                onChange={(e) => onChange('placeType', e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 p-3 text-sm text-gray-200 outline-none focus:border-accent-500"
                            >
                                <option value="">{t.noneOption}</option>
                                {dynamicPlaces.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        ) : (
                            <input 
                                type="text" 
                                value={config.placeType} 
                                onChange={(e) => onChange('placeType', e.target.value)} 
                                className="w-full bg-gray-950 border border-gray-800 p-3 text-sm text-white placeholder-gray-600 focus:border-accent-500 outline-none" 
                                placeholder="Ej: Bosque de Cristal, Montaña Flotante..." 
                            />
                        )
                    ) : (
                        // HISTORICAL 1B: ERA
                        !isManual ? (
                            <select 
                                value={config.era} 
                                onChange={(e) => onChange('era', e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 p-3 text-sm text-gray-200 outline-none focus:border-accent-500"
                            >
                                <option value="">{t.noneOption}</option>
                                {C.HISTORICAL_ERAS.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        ) : (
                            <input 
                                type="text" 
                                value={config.era} 
                                onChange={(e) => onChange('era', e.target.value)} 
                                className="w-full bg-gray-950 border border-gray-800 p-3 text-sm text-white placeholder-gray-600 focus:border-accent-500 outline-none" 
                                placeholder="Ej: Año 3000, Siglo XVIII..." 
                            />
                        )
                    )}
                </div>

                {/* Anachronism Warning for Historical Mode */}
                {theme === ThemeMode.HISTORICAL && showAnachronism && (
                    <div className="p-3 bg-orange-950/20 border border-orange-500/50 rounded animate-fade-in shadow-lg">
                        <p className="text-[10px] font-bold text-orange-400 mb-1 flex items-center gap-2">⚠️ {t.anachronismTitle}</p>
                        <div className="flex gap-2 mt-2">
                            <button onClick={() => onChange('anachronismPolicy', 'STRICT')} className={`flex-1 py-1 text-[9px] font-bold border rounded ${config.anachronismPolicy === 'STRICT' ? 'bg-orange-600 border-orange-500 text-white' : 'border-orange-500/50 text-orange-500'}`}>{t.anachronismStrict}</button>
                            <button onClick={() => onChange('anachronismPolicy', 'CHAOS')} className={`flex-1 py-1 text-[9px] font-bold border rounded ${config.anachronismPolicy === 'CHAOS' ? 'bg-orange-600 border-orange-500 text-white' : 'border-orange-500/50 text-orange-500'}`}>{t.anachronismChaos}</button>
                        </div>
                    </div>
                )}

                {/* 1C: EDIFICATION */}
                <div>
                    <label className="block text-[10px] text-gray-500 mb-1 font-mono uppercase font-bold">{t.labelSettlement}</label>
                    {!isManual ? (
                        <select 
                            value={config.buildingType} 
                            onChange={(e) => onChange('buildingType', e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 p-3 text-sm text-gray-200 outline-none focus:border-accent-500"
                        >
                             <option value="">{t.noneOption}</option>
                            {(theme === ThemeMode.FANTASY ? C.FANTASY_BUILDINGS : C.HISTORICAL_BUILDINGS).map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    ) : (
                        <input 
                            type="text" 
                            value={config.buildingType} 
                            onChange={(e) => onChange('buildingType', e.target.value)} 
                            className="w-full bg-gray-950 border border-gray-800 p-3 text-sm text-white placeholder-gray-600 focus:border-accent-500 outline-none" 
                            placeholder="Ej: Base lunar, Templo en ruinas..." 
                        />
                    )}
                </div>

                {/* DETALLE PERSONALIZADO (AÑADIDO PARA MANUAL FANTASÍA) */}
                {theme === ThemeMode.FANTASY && isManual && (
                     <div className="animate-fade-in pt-2">
                        <label className="block text-[10px] text-gray-500 mb-1 font-mono uppercase font-bold text-purple-400">DETALLE PERSONALIZADO</label>
                        <textarea 
                           value={config.manualPOIs?.[0] || ''} 
                           onChange={(e) => onChange('manualPOIs', [e.target.value])} 
                           className="w-full bg-gray-950 border border-gray-800 p-3 text-sm text-white placeholder-gray-600 focus:border-purple-500 outline-none resize-none h-16 rounded-sm" 
                           placeholder="Ej: Un árbol gigante con runas brillantes, una estatua de un dios olvidado..." 
                       />
                   </div>
                )}

                {/* HISTORICAL PLACE EXTRA (Since it doesn't fit in 1B which is Era) */}
                {theme === ThemeMode.HISTORICAL && isManual && (
                    <div>
                         <label className="block text-[10px] text-gray-500 mb-1 font-mono uppercase font-bold">DETALLE GEOGRÁFICO (MANUAL)</label>
                         <input 
                            type="text" 
                            value={config.placeType} 
                            onChange={(e) => onChange('placeType', e.target.value)} 
                            className="w-full bg-gray-950 border border-gray-800 p-3 text-sm text-white placeholder-gray-600 focus:border-accent-500 outline-none" 
                            placeholder="Ej: Costa del Mediterráneo, Desierto del Gobi..." 
                        />
                    </div>
                )}
            </div>
        </div>

        {/* BLOQUE 2: ADN VISUAL */}
        <div className={`bg-gray-900/50 p-6 border border-gray-800 border-t-4 rounded-r-lg ${theme === ThemeMode.FANTASY ? 'border-t-purple-600' : 'border-t-orange-600'}`}>
            <h3 className={`text-lg font-bold text-white mb-6 font-mono uppercase tracking-tighter flex items-center gap-2`}>
                 <span className={theme === ThemeMode.FANTASY ? 'text-purple-500' : 'text-orange-500'}>2.</span> ADN VISUAL
            </h3>
            
            <StyleSelector selectedStyle={config.artStyle} onSelect={(val) => onChange('artStyle', val)} lang={lang} />
            
            <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                     <label className="block text-[10px] text-gray-500 mb-1 font-mono uppercase font-bold">{t.time}</label>
                     <select value={config.time} onChange={(e) => onChange('time', e.target.value)} className="w-full bg-gray-950 border border-gray-800 p-2.5 text-xs text-gray-400 outline-none focus:border-accent-500">
                        <option value="">{t.noneOption}</option>
                        {C.TIMES.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] text-gray-500 mb-1 font-mono uppercase font-bold">{t.weather}</label>
                    <select value={config.weather} onChange={(e) => onChange('weather', e.target.value)} className="w-full bg-gray-950 border border-gray-800 p-2.5 text-xs text-gray-400 outline-none focus:border-accent-500">
                        <option value="">{t.noneOption}</option>
                        {C.WEATHERS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
            </div>

            {isManual && (
                <div className="mt-4">
                     <label className="block text-[10px] text-gray-500 mb-1 font-mono uppercase font-bold">ATMÓSFERA Y TÉCNICA</label>
                     <textarea value={config.manualDetails} onChange={(e) => onChange('manualDetails', e.target.value)} className="w-full bg-gray-950 border border-gray-800 p-3 text-sm text-white h-20 resize-none placeholder-gray-600 focus:border-accent-500 outline-none" placeholder="Ej: Niebla volumétrica, render Unreal Engine 5, iluminación dramática..." />
                </div>
            )}
        </div>
      </div>

      <div className="flex gap-4 max-w-2xl mx-auto">
          <button 
            onClick={() => onGenerate(true, NarrativeMode.WORLD)} 
            disabled={isGenerating || !config.artStyle}
            className={`flex-1 py-5 rounded-sm font-mono font-bold text-sm tracking-[0.2em] transition-all shadow-2xl uppercase
              ${!config.artStyle ? 'bg-gray-800 text-gray-500' : 'bg-accent-600 hover:bg-accent-500 text-white shadow-accent-500/20'}
            `}
          >
            {isGenerating ? 'PROCESANDO...' : t.worldGenBtn}
          </button>
      </div>

    </div>
  );
};

export default NarrativeView;