import React from 'react';
import { HistoryItem, Language } from '../types';
import { UI_TEXT } from '../constants';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  lang: Language;
  onClear: () => void;
  onCopyPrompt: (text: string) => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, history, lang, onClear, onCopyPrompt }) => {
  const t = UI_TEXT[lang];

  const handleDownload = () => {
    if (history.length === 0) return;

    const content = history.map((item, idx) => {
      const date = new Date(item.timestamp).toLocaleString();
      return `[${idx + 1}] ${date} - ${item.type}\nPROMPT:\n${item.prompt}\n-----------------------------------\n`;
    }).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Atlas_Core_History_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300"
        ></div>
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#0b101b] border-l border-accent-900 z-50 transform transition-transform duration-300 ease-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 bg-[#06090f] flex justify-between items-center">
            <h2 className="text-xl font-mono font-bold text-accent-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {t.memoryTitle}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-4">
                    <svg className="w-16 h-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <p className="font-mono text-xs">{t.memoryEmpty}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((item) => (
                        <div key={item.id} className="bg-gray-900 border border-gray-800 p-4 rounded-lg relative group hover:border-accent-500/30 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-mono text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded border ${item.type.includes('Midjourney') ? 'border-purple-900 text-purple-400 bg-purple-900/10' : 'border-blue-900 text-blue-400 bg-blue-900/10'}`}>{item.type}</span>
                            </div>
                            <p className="text-xs text-gray-300 font-mono line-clamp-3 mb-2 opacity-80">{item.prompt}</p>
                            <button 
                                onClick={() => onCopyPrompt(item.prompt)}
                                className="w-full py-1.5 mt-1 bg-gray-950 hover:bg-accent-900/30 border border-gray-800 hover:border-accent-500/50 text-gray-400 hover:text-accent-400 text-[10px] font-bold font-mono uppercase rounded transition-colors"
                            >
                                {t.copy}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-800 bg-[#06090f] grid grid-cols-2 gap-3">
             <button 
                onClick={handleDownload}
                disabled={history.length === 0}
                className="flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold font-mono rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                {t.memoryDownload}
             </button>
             <button 
                onClick={onClear}
                disabled={history.length === 0}
                className="flex items-center justify-center gap-2 py-3 bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 text-red-400 text-xs font-bold font-mono rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                {t.memoryClear}
             </button>
        </div>

      </div>
    </>
  );
};

export default HistoryDrawer;