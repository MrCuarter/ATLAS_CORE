import React, { useState } from 'react';
import { PromptType, Language } from '../types';
import { UI_TEXT } from '../constants';
import { enhancePromptWithGemini } from '../services/geminiService';
import { playSuccess, playTechClick } from '../services/audioService';

interface PromptDisplayProps {
  prompt: string;
  promptType: PromptType;
  lang: Language;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt, promptType, lang }) => {
  const [copied, setCopied] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [displayPrompt, setDisplayPrompt] = useState(prompt);

  // Sync internal display state when the generated prompt changes from parent
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
        playSuccess(); // Optional: Play success when enhancement is done
    } catch (e) {
        console.error(e);
        // Fail silently in UI to avoid disrupting user flow, error is logged in console
    } finally {
        setIsEnhancing(false);
    }
  };

  const t = UI_TEXT[lang];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      {/* GLOW EFFECT BORDER TOP */}
      <div className="h-1 bg-gradient-to-r from-transparent via-accent-500 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.8)]"></div>
      
      <div className="bg-[#020617]/95 backdrop-blur-xl border-t border-accent-900/50 p-4 md:p-6 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
            
            {/* Header: SYSTEM OUTPUT */}
            <div className="flex justify-between items-end border-b border-gray-800 pb-2">
                <div className="flex items-center gap-3">
                     <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></span>
                     <h3 className="text-sm md:text-base font-mono font-bold text-accent-400 tracking-[0.2em] uppercase">
                        SYSTEM_OUTPUT_
                     </h3>
                </div>
                 <span className="text-[10px] md:text-xs text-gray-500 font-mono">
                    {promptType === PromptType.MIDJOURNEY ? 'MODE: MIDJOURNEY V6' : 'MODE: GENERIC AI'} | {displayPrompt.length} CHARS
                </span>
            </div>

            {/* Main Prompt Area */}
            <div className="relative group">
                <textarea
                readOnly
                value={displayPrompt}
                className="w-full h-32 md:h-40 bg-gray-900/50 text-gray-200 font-mono text-sm md:text-base leading-relaxed p-4 rounded-lg border border-gray-700/50 focus:outline-none focus:border-accent-500/50 resize-none transition-all shadow-inner custom-scrollbar selection:bg-accent-900/50"
                />
                 {/* Decorative corner */}
                 <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-accent-500/30"></div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                 {/* Enhance Button */}
                <button
                    onClick={handleEnhance}
                    disabled={isEnhancing}
                    className="flex-1 py-4 px-6 font-bold font-mono tracking-widest text-xs uppercase transition-all border border-accent-500/50 text-accent-400 hover:bg-accent-900/20 hover:border-accent-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] flex items-center justify-center gap-3 group bg-black/40"
                >
                    {isEnhancing ? (
                        <span className="animate-pulse flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            PROCESSING...
                        </span>
                    ) : (
                        <>
                        <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        {t.enhance}
                        </>
                    )}
                </button>

                {/* Copy Button */}
                <button
                    onClick={handleCopy}
                    className={`flex-1 py-4 px-6 font-bold font-mono tracking-widest text-xs uppercase transition-all border flex items-center justify-center gap-3 group bg-black/40
                        ${copied 
                        ? 'border-green-500 text-green-400 bg-green-900/10 shadow-[0_0_15px_rgba(74,222,128,0.2)]' 
                        : 'border-gray-600 text-gray-300 hover:border-white hover:text-white hover:bg-white/5'
                        }`}
                    >
                    {copied ? (
                        <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        {t.copied}
                        </>
                    ) : (
                        <>
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                        {t.copy}
                        </>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDisplay;