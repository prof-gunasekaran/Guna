
import React, { useState, useCallback } from 'react';
import { Book } from '../types';
import { ArrowLeft, Copy, Share2, Type, Check, Send, Scissors } from 'lucide-react';

interface ReaderProps {
  book: Book;
  onBack: () => void;
}

const Reader: React.FC<ReaderProps> = ({ book, onBack }) => {
  const [fontSize, setFontSize] = useState(22);
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'modern'>('sans');
  const [copied, setCopied] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);

  // Helper to get currently selected text
  const getSelectedText = () => {
    const selection = window.getSelection();
    return selection ? selection.toString().trim() : '';
  };

  // Monitor selection state
  const handleMouseUp = () => {
    const text = getSelectedText();
    setHasSelection(text.length > 0);
  };

  const handleCopy = useCallback(() => {
    const selectedText = getSelectedText();
    const textToCopy = selectedText || book.content;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [book.content]);

  const getFontClass = () => {
    switch (fontFamily) {
      case 'serif': return 'tamil-text-serif';
      case 'modern': return 'font-[Arima Madurai]';
      default: return 'tamil-text';
    }
  };

  const handleShare = async (platform: 'whatsapp' | 'telegram') => {
    const selectedText = getSelectedText();
    const textToShare = selectedText || book.content;
    
    // Limit share length for URL compatibility if sharing huge text
    const finalShareText = textToShare.length > 2000 ? textToShare.substring(0, 2000) + '...' : textToShare;
    const formattedText = `*${book.title}${selectedText ? ' (தேர்ந்தெடுக்கப்பட்ட பகுதி)' : ''}*\n\n${finalShareText}`;
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(formattedText)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(' ')}&text=${encodeURIComponent(formattedText)}`, '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-32" onMouseUp={handleMouseUp} onKeyUp={handleMouseUp}>
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-16 bg-slate-50/95 backdrop-blur-md py-4 z-20 border-b border-slate-200 px-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
        >
          <ArrowLeft size={20} />
          பின்செல்
        </button>

        <div className="flex items-center flex-wrap gap-3">
          {/* Font Controls */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button 
              onClick={() => setFontSize(Math.max(16, fontSize - 2))}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
              title="சிறிய எழுத்து"
            >
              <Type size={16} />
            </button>
            <span className="px-3 text-sm font-bold text-slate-700 min-w-[40px] text-center">
              {fontSize}
            </span>
            <button 
              onClick={() => setFontSize(Math.min(48, fontSize + 2))}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
              title="பெரிய எழுத்து"
            >
              <Type size={22} />
            </button>
            
            <div className="w-[1px] h-6 bg-slate-200 mx-2" />
            
            <select 
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value as any)}
              className="text-xs font-bold text-slate-600 bg-transparent border-none focus:ring-0 cursor-pointer pr-8"
            >
              <option value="sans">Sans Tamil</option>
              <option value="serif">Serif Tamil</option>
              <option value="modern">Modern Tamil</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button 
              onClick={handleCopy}
              className={`p-2 rounded-lg flex items-center gap-2 transition-all ${copied ? 'bg-green-100 text-green-700' : 'hover:bg-slate-100 text-slate-600'}`}
              title={hasSelection ? "தேர்ந்தெடுத்ததை நகலெடு" : "முழுவதையும் நகலெடு"}
            >
              {copied ? <Check size={18} /> : (hasSelection ? <Scissors size={18} className="text-indigo-500" /> : <Copy size={18} />)}
              <span className="text-sm font-bold">
                {copied ? 'முடிந்தது' : (hasSelection ? 'பகுதி நகல்' : 'முழு நகல்')}
              </span>
            </button>
            
            <div className="w-[1px] h-6 bg-slate-200 mx-1" />

            <button 
              onClick={() => handleShare('whatsapp')}
              className={`p-2 rounded-lg transition-colors ${hasSelection ? 'bg-green-50 text-green-600' : 'hover:bg-slate-50 text-slate-500'}`}
              title="வாட்ஸ்அப்"
            >
              <Send size={20} />
            </button>

            <button 
              onClick={() => handleShare('telegram')}
              className={`p-2 rounded-lg transition-colors ${hasSelection ? 'bg-sky-50 text-sky-600' : 'hover:bg-slate-50 text-slate-500'}`}
              title="டெலிகிராம்"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <article className="bg-white p-6 md:p-16 rounded-[2.5rem] shadow-xl border border-slate-100 min-h-[80vh] selection:bg-indigo-100 selection:text-indigo-900">
        <header className="mb-12 pb-8 border-b border-slate-100">
          <h1 className={`text-3xl md:text-5xl font-black text-slate-900 leading-tight ${getFontClass()}`}>
            {book.title}
          </h1>
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
              <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-600">தமிழ் மின்னூல்</span>
              <span>•</span>
              <span>{new Date(book.importedAt).toLocaleDateString('ta-IN')}</span>
            </div>
            {hasSelection && (
              <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full animate-pulse">
                பகுதி தேர்ந்தெடுக்கப்பட்டுள்ளது
              </span>
            )}
          </div>
        </header>

        <div 
          className={`text-slate-800 leading-[2] whitespace-pre-wrap transition-all duration-300 focus:outline-none ${getFontClass()}`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {book.content}
        </div>
      </article>

      {/* Floating Action Buttons for quick sharing at bottom */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/90 backdrop-blur-xl border border-white/50 p-3 rounded-3xl shadow-2xl z-40 ring-1 ring-slate-200/50">
        <div className="text-xs font-bold text-slate-400 px-2 hidden sm:block">பகிர:</div>
        <button 
          onClick={() => handleShare('whatsapp')}
          className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-200"
        >
          <Send size={18} />
          WhatsApp
        </button>
        <button 
          onClick={() => handleShare('telegram')}
          className="flex items-center gap-2 bg-[#0088cc] text-white px-6 py-3 rounded-xl font-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-200"
        >
          <Share2 size={18} />
          Telegram
        </button>
      </div>
    </div>
  );
};

export default Reader;
