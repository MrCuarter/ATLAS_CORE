import React, { useState } from 'react';
import { PromptType, Language, AppMode, MediaType } from '../types';
import { UI_TEXT } from '../constants';
import { enhancePromptWithGemini, generateDerivedScene } from '../services/geminiService';
import { playSuccess, playTechClick } from '../services/audioService';

interface PromptDisplayProps {
  prompt: string;
  promptType: PromptType;
  lang: Language;
  mode: AppMode;
  onCopy?: () => void;
  mediaType: MediaType; // Added prop
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt, promptType, lang, mode, onCopy, mediaType }) => {
  const [copied, setCopied] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isDeriving, setIsDeriving] = useState(false);
  const [displayPrompt, setDisplayPrompt] = useState(prompt);

  React.useEffect(() => {
    setDisplayPrompt(prompt);
  }, [prompt]);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayPrompt);
    playSuccess();
    setCopied(true);
    if (onCopy) onCopy(); // Trigger save to history
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnhance = async () => {
    playTechClick();
    setIsEnhancing(true);
    try {
        const enhanced = await enhancePromptWithGemini(displayPrompt, promptType);
        setDisplayPrompt(enhanced);
        playSuccess();
    } catch (e) {
        console.error(e);
    } finally {
        setIsEnhancing(false);
    }
  };

  const handleDerive = async () => {
    playTechClick();
    setIsDeriving(true);
    try {
        const isVideo = displayPrompt.includes("VIDEO") || displayPrompt.includes("motion") || displayPrompt.includes("Camera Movement");
        const type = isVideo ? MediaType.VIDEO : MediaType.IMAGE;
        
        const derived = await generateDerivedScene(displayPrompt, type);
        setDisplayPrompt(derived);
        playSuccess();
    } catch (e) {
        console.error(e);
    } finally {
        setIsDeriving(false);
    }
  };

  const t = UI_TEXT[lang];
  const showEnhance = mode !== AppMode.CONSTRUCTOR;
  const isVideo = mediaType === MediaType.VIDEO;

  const getModelLabel = () => {
      if (promptType === PromptType.MIDJOURNEY) return 'MJ V6';
      if (promptType === PromptType.UNIVERSAL) return 'GEMINI / DALL-E';
      if (promptType === PromptType.ADVANCED) return 'STABLE DIFFUSION';
      return 'GENERIC AI';
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-4 mb-8 animate-slide-up relative z-20">
      <div className={`bg-[#020617] border rounded-lg p-6 shadow-2xl relative overflow-hidden group transition-colors duration-500 ${isVideo ? 'border-red-900/30' : 'border-accent-900/50'}`}>
        
        {/* Dynamic top border glow */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent to-transparent opacity-70 ${isVideo ? 'via-red-500' : 'via-accent-500'}`}></div>
        
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end border-b border-gray-800 pb-2">
                <div className="flex items-center gap-3">
                     <span className={`w-2 h-2 rounded-full animate-pulse ${isVideo ? 'bg-red-500' : 'bg-accent-500'}`}></span>
                     <h3 className={`text-xs md:text-base font-mono font-bold tracking-[0.2em] uppercase ${isVideo ? 'text-red-400' : 'text-accent-400'}`}>
                        SYSTEM_OUTPUT_
                     </h3>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* MEDIA TYPE INDICATOR */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${isVideo ? 'bg-red-950/50 border-red-500/30 text-red-400' : 'bg-blue-950/50 border-blue-500/30 text-blue-400'}`}>
                        {isVideo ? 'VÍDEO / CINEMATIC' : 'IMAGEN / STATIC'}
                    </span>
                    <span className="text-xs text-gray-500 font-mono border-l border-gray-800 pl-3">
                        {getModelLabel()} | {displayPrompt.length} CHARS
                    </span>
                </div>
            </div>

            <textarea
                readOnly
                value={displayPrompt}
                className={`w-full h-44 bg-gray-900/50 text-gray-200 font-mono text-sm md:text-base leading-relaxed p-4 rounded-lg border focus:outline-none resize-none custom-scrollbar transition-colors duration-500 ${isVideo ? 'border-red-900/20 focus:border-red-500/30' : 'border-gray-700/50 focus:border-accent-500/30'}`}
            />

            <div className="flex gap-3">
                {showEnhance && (
                    <button
                        onClick={handleEnhance}
                        disabled={isEnhancing || isDeriving}
                        className="flex-[2] py-4 px-4 font-bold font-mono tracking-widest text-xs uppercase transition-all border border-accent-500/50 text-accent-400 hover:bg-accent-900/20 flex items-center justify-center gap-2 group bg-gray-900/50 rounded-sm"
                    >
                        {isEnhancing ? "ANALIZANDO..." : "OPTIMIZAR CON IA"}
                    </button>
                )}
                
                {/* COPY BUTTON */}
                <button
                    onClick={handleCopy}
                    className={`flex-1 py-4 px-4 font-bold font-mono tracking-widest text-xs uppercase transition-all border flex items-center justify-center gap-3 group rounded-sm bg-gray-900/50
                        ${copied ? 'border-green-500 text-green-400 bg-green-900/10' : 'border-gray-600 text-gray-300 hover:border-white hover:text-white'}`}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    {copied ? t.copied : t.copy}
                </button>

                {/* DERIVE SCENE BUTTON */}
                <button
                    onClick={handleDerive}
                    disabled={isEnhancing || isDeriving}
                    className="flex-[2] py-4 px-4 font-bold font-mono tracking-widest text-xs uppercase transition-all border border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/20 flex items-center justify-center gap-2 group bg-gray-900/50 rounded-sm"
                >
                     {isDeriving ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-3 w-3 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            {t.deriveLoading}
                        </span>
                     ) : (
                        t.deriveBtn
                     )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDisplay;