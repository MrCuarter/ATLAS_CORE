import React, { useState } from 'react';
import { PromptType, Language } from '../types';
import { UI_TEXT } from '../constants';
import { enhancePromptWithGemini, generateGameAssetsPrompt } from '../services/geminiService';
import { playSuccess, playTechClick } from '../services/audioService';

interface PromptDisplayProps {
  prompt: string;
  promptType: PromptType;
  lang: Language;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt, promptType, lang }) => {
  const [copied, setCopied] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingAssets, setIsGeneratingAssets] = useState(false);
  const [displayPrompt, setDisplayPrompt] = useState(prompt);
  const [assetPrompt, setAssetPrompt] = useState<string>("");

  // Sync internal display state when the generated prompt changes from parent
  // Also reset asset prompt when main prompt changes (new context)
  React.useEffect(() => {
    setDisplayPrompt(prompt);
    setAssetPrompt(""); 
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

  const handleGenerateAssets = async () => {
      playTechClick();
      setIsGeneratingAssets(true);
      try {
          const assets = await generateGameAssetsPrompt(displayPrompt);
          setAssetPrompt(assets);
          playSuccess();
      } catch (e) {
          console.error(e);
      } finally {
          setIsGeneratingAssets(false);
      }
  };

  const t = UI_TEXT[lang];

  return (
    <div className="w-full max-w-6xl mx-auto mt-4 mb-8 animate-slide-up relative z-20">
      
      {/* Card Container - Static Layout */}
      <div className="bg-[#020617] border border-accent-900/50 rounded-lg p-3 md:p-6 shadow-2xl relative overflow-hidden group">
        
        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-500 to-transparent opacity-70"></div>
        
        <div className="flex flex-col gap-3 md:gap-4">
            
            {/* Header: SYSTEM OUTPUT */}
            <div className="flex justify-between items-end border-b border-gray-800 pb-2">
                <div className="flex items-center gap-2 md:gap-3">
                     <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full animate-pulse"></span>
                     <h3 className="text-xs md:text-base font-mono font-bold text-accent-400 tracking-[0.2em] uppercase">
                        SYSTEM_OUTPUT_
                     </h3>
                </div>
                 <span className="text-[9px] md:text-xs text-gray-500 font-mono">
                    {promptType === PromptType.MIDJOURNEY ? 'MJ V6' : 'AI'} | {displayPrompt.length} CHARS
                </span>
            </div>

            {/* Main Prompt Area */}
            <div className="relative">
                <textarea
                readOnly
                value={displayPrompt}
                className="w-full h-24 md:h-40 bg-gray-900/50 text-gray-200 font-mono text-xs md:text-base leading-relaxed p-3 md:p-4 rounded-lg border border-gray-700/50 focus:outline-none focus:border-accent-500/50 resize-none transition-all shadow-inner custom-scrollbar selection:bg-accent-900/50"
                />
                 {/* Decorative corner */}
                 <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-accent-500/30"></div>
            </div>

            {/* Actions Bar - Row Layout */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                 {/* Enhance Button */}
                <button
                    onClick={handleEnhance}
                    disabled={isEnhancing}
                    className="flex-1 py-2 md:py-3 px-2 font-bold font-mono tracking-widest text-[10px] md:text-xs uppercase transition-all border border-accent-500/50 text-accent-400 hover:bg-accent-900/20 hover:border-accent-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] flex items-center justify-center gap-2 group bg-gray-900/50 rounded-sm"
                >
                    {isEnhancing ? (
                        <span className="animate-pulse flex items-center gap-1 md:gap-2">
                            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span className="hidden sm:inline">PROCESSING...</span>
                            <span className="sm:hidden">...</span>
                        </span>
                    ) : (
                        <>
                        <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        {t.enhance}
                        </>
                    )}
                </button>

                {/* NEW: Generate Assets Button (Middle) */}
                <button
                    onClick={handleGenerateAssets}
                    disabled={isGeneratingAssets}
                    className="flex-1 py-2 md:py-3 px-2 font-bold font-mono tracking-widest text-[10px] md:text-xs uppercase transition-all border border-purple-500/50 text-purple-400 hover:bg-purple-900/20 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] flex items-center justify-center gap-2 group bg-gray-900/50 rounded-sm"
                >
                    {isGeneratingAssets ? (
                        <span className="animate-pulse flex items-center gap-1 md:gap-2">
                            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span className="hidden sm:inline">CREATING...</span>
                            <span className="sm:hidden">...</span>
                        </span>
                    ) : (
                        <>
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        {t.genGameAssets}
                        </>
                    )}
                </button>

                {/* Copy Button */}
                <button
                    onClick={handleCopy}
                    className={`flex-1 py-2 md:py-3 px-2 font-bold font-mono tracking-widest text-[10px] md:text-xs uppercase transition-all border flex items-center justify-center gap-2 group rounded-sm bg-gray-900/50
                        ${copied 
                        ? 'border-green-500 text-green-400 bg-green-900/10 shadow-[0_0_15px_rgba(74,222,128,0.2)]' 
                        : 'border-gray-600 text-gray-300 hover:border-white hover:text-white hover:bg-white/5'
                        }`}
                    >
                    {copied ? (
                        <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        {t.copied}
                        </>
                    ) : (
                        <>
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                        {t.copy}
                        </>
                    )}
                </button>
            </div>

            {/* ASSET PROMPT RESULT AREA (Conditional) */}
            {assetPrompt && (
                <div className="mt-4 pt-4 border-t border-gray-800 animate-fade-in">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
                        <h4 className="text-xs font-mono font-bold text-purple-400 tracking-[0.2em] uppercase">
                            {t.gameAssetsTitle}
                        </h4>
                    </div>
                    <div className="relative">
                        <textarea
                            readOnly
                            value={assetPrompt}
                            className="w-full h-32 bg-gray-950/50 text-purple-200 font-mono text-xs leading-relaxed p-3 rounded border border-purple-900/30 focus:outline-none resize-none custom-scrollbar"
                        />
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(assetPrompt);
                                playSuccess();
                            }}
                            className="absolute top-2 right-2 p-1 text-purple-500 hover:text-purple-300 bg-gray-900 rounded border border-purple-900/50"
                            title={t.copy}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PromptDisplay;