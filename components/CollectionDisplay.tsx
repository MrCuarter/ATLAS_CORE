import React, { useState } from 'react';
import { PromptCollectionItem, Language } from '../types';
import { UI_TEXT } from '../constants';

interface CollectionDisplayProps {
  collection: PromptCollectionItem[];
  lang: Language;
}

const CollectionDisplay: React.FC<CollectionDisplayProps> = ({ collection, lang }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const t = UI_TEXT[lang];

  if (!collection || collection.length === 0) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    // Construct the structured prompt for the AI agent
    const intro = t.copyInstructionHeader;
    const body = collection.map((c, i) => `### ${i+1}. ${c.title}\n${c.prompt}`).join('\n\n');
    
    const fullText = `${intro}\n${body}`;
    
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="w-full animate-fade-in mt-12 pb-8">
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <h3 className="text-2xl font-mono font-bold text-white flex items-center">
          <span className="w-3 h-3 bg-accent-500 mr-3 animate-pulse"></span>
          ASSET COLLECTION ({collection.length})
        </h3>
        <button
          onClick={handleCopyAll}
          className={`px-6 py-2 rounded text-xs font-bold font-mono tracking-widest transition-all flex items-center gap-2 border ${copiedAll ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-gray-900 border-accent-500 text-accent-400 hover:bg-accent-900/20'}`}
        >
          {copiedAll ? t.copied : t.copyAll}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {collection.map((item, idx) => (
          <div key={idx} className="bg-gray-900 border border-gray-800 p-4 relative group hover:border-accent-500/30 transition-all flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                item.type === 'MAP' ? 'bg-blue-900/20 border-blue-500/50 text-blue-400' :
                item.type === 'PERSPECTIVE' ? 'bg-purple-900/20 border-purple-500/50 text-purple-400' :
                item.type === 'VICTORY' ? 'bg-yellow-900/20 border-yellow-500/50 text-yellow-400' :
                'bg-gray-800 border-gray-600 text-gray-400'
              }`}>
                {item.type}
              </span>
              <button
                onClick={() => handleCopy(item.prompt, idx)}
                className="text-gray-500 hover:text-white transition-colors"
                title={t.copy}
              >
                {copiedIndex === idx ? (
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                )}
              </button>
            </div>
            
            <h4 className="text-sm font-bold text-white mb-2 font-mono uppercase truncate" title={item.title}>{item.title}</h4>
            <div className="bg-gray-950 p-2 text-xs text-gray-400 font-mono overflow-y-auto max-h-32 border border-gray-800 rounded mb-2 flex-grow custom-scrollbar">
              {item.prompt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionDisplay;