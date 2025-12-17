import React, { useState } from 'react';
import { PromptType, Language, AppMode } from '../types';
import { UI_TEXT } from '../constants';
import { enhancePromptWithGemini } from '../services/geminiService';
import { playSuccess, playTechClick } from '../services/audioService';

interface PromptDisplayProps {
  prompt: string;
  promptType: PromptType;
  lang: Language;
  mode: AppMode;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt, promptType, lang, mode }) => {
  const [copied, setCopied] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [displayPrompt, setDisplayPrompt] = useState(prompt);

  React.useEffect(() => {
    setDisplayPrompt(prompt);
  }, [prompt]);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayPrompt);
    playSuccess();
    setCopied(true);
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

  const t = UI_TEXT[lang];
  // Only show enhance button in Narrative mode to maintain consistency across a world project
  const showEnhance = mode === AppMode.NARRATIVE;

  return (
    <div className="w-full max-w-6xl mx-auto mt-4 mb-8 animate-slide-up relative z-20">
      <div className="bg-[#020617] border border-accent-900/50 rounded-lg p-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-500 to-transparent opacity-70"></div>
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end border-b border-gray-800 pb-2">
                <div className="flex items-center gap-3">
                     <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></span>
                     <h3 className="text-xs md:text-base font-mono font-bold text-accent-400 tracking-[0.2em] uppercase">SYSTEM_OUTPUT_</h3>
                </div>
                 <span className="text-xs text-gray-500 font-mono">{promptType === PromptType.MIDJOURNEY ? 'MJ V6' : 'GENERIC AI'} | {displayPrompt.length} CHARS</span>
            </div>

            <textarea
                readOnly
                value={displayPrompt}
                className="w-full h-44 bg-gray-900/50 text-gray-200 font-mono text-sm md:text-base leading-relaxed p-4 rounded-lg border border-gray-700/50 focus:outline-none resize-none custom-scrollbar"
            />

            <div className="flex gap-3">
                {showEnhance && (
                    <button
                        onClick={handleEnhance}
                        disabled={isEnhancing}
                        className="flex-[2] py-4 px-4 font-bold font-mono tracking-widest text-xs uppercase transition-all border border-accent-500/50 text-accent-400 hover:bg-accent-900/20 flex items-center justify-center gap-2 group bg-gray-900/50 rounded-sm"
                    >
                        {isEnhancing ? "ANALIZANDO..." : "OPTIMIZAR CON IA"}
                    </button>
                )}
                <button
                    onClick={handleCopy}
                    className={`flex-1 py-4 px-4 font-bold font-mono tracking-widest text-xs uppercase transition-all border flex items-center justify-center gap-3 group rounded-sm bg-gray-900/50
                        ${copied ? 'border-green-500 text-green-400 bg-green-900/10' : 'border-gray-600 text-gray-300 hover:border-white hover:text-white'}`}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    {copied ? t.copied : t.copy}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDisplay;