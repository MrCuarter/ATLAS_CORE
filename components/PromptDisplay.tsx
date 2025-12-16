import React, { useState } from 'react';
import { PromptType, Language } from '../types';
import { UI_TEXT } from '../constants';
import { enhancePromptWithGemini } from '../services/geminiService';

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
  // But only if we aren't currently holding an enhanced version that is different?
  // Actually, standard behavior: if the user changes settings, it overrides the AI enhancement.
  React.useEffect(() => {
    setDisplayPrompt(prompt);
  }, [prompt]);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnhance = async () => {
    if (!process.env.API_KEY) {
        alert("API Key missing");
        return;
    }
    setIsEnhancing(true);
    try {
        const enhanced = await enhancePromptWithGemini(displayPrompt, promptType);
        setDisplayPrompt(enhanced);
    } catch (e) {
        console.error(e);
        alert("Error connecting to Gemini AI");
    } finally {
        setIsEnhancing(false);
    }
  };

  const t = UI_TEXT[lang];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-700 p-4 shadow-2xl z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-grow w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400 font-mono uppercase tracking-widest">
              {promptType === PromptType.MIDJOURNEY ? 'MIDJOURNEY' : 'GENERIC'} Output
            </span>
            <span className="text-xs text-gray-500">
              {displayPrompt.length} chars
            </span>
          </div>
          <div className="relative">
            <textarea
              readOnly
              value={displayPrompt}
              className="w-full h-20 bg-gray-900 text-gray-300 font-mono text-sm p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-accent-500 resize-none"
            />
          </div>
        </div>
        
        <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto h-20">
            {/* Enhance Button */}
            <button
                onClick={handleEnhance}
                disabled={isEnhancing}
                className="flex-1 rounded-lg font-bold text-sm transition-all border border-purple-500 text-purple-400 hover:bg-purple-900/30 flex items-center justify-center gap-2 px-4"
            >
                {isEnhancing ? (
                    <span className="animate-pulse">Gemini 2.5...</span>
                ) : (
                    <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    {t.enhance}
                    </>
                )}
            </button>

            {/* Copy Button */}
            <button
            onClick={handleCopy}
            className={`flex-1 rounded-lg font-bold text-sm transition-all transform active:scale-95 flex items-center justify-center gap-2 px-4
                ${copied 
                ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]' 
                : 'bg-accent-600 hover:bg-accent-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                }`}
            >
            {copied ? (
                <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                {t.copied}
                </>
            ) : (
                <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                {t.copy}
                </>
            )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default PromptDisplay;