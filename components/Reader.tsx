
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
    <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn pb-32" onMouseUp={handleMouseUp} onKeyUp={handleMouseUp}>
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sticky top-20 bg-[#fdfcfb]/90 backdrop-blur-xl py-6 z-40 border-b border-stone-200 px-6 rounded-2xl shadow-sm">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-stone-600 hover:text-orange-600 font-black transition-all group"
        >
          <div className="bg-stone-100 p-2 rounded-xl group-hover:bg-orange-50 transition-colors">
            <ArrowLeft size={20} />
          </div>
          <span>பின்செல்</span>
        </button>

        <div className="flex items-center flex-wrap gap-4">
          {/* Font Controls */}
          <div className="flex items-center bg-white border border-stone-200 rounded-2xl p-1.5 shadow-sm">
            <button 
              onClick={() => setFontSize(Math.max(16, fontSize - 2))}
              className="p-2.5 hover:bg-stone-50 rounded-xl text-stone-500 transition-colors"
              title="சிறிய எழுத்து"
            >
              <Type size={16} />
            </button>
            <span className="px-4 text-sm font-black text-stone-800 min-w-[48px] text-center">
              {fontSize}
            </span>
            <button 
              onClick={() => setFontSize(Math.min(48, fontSize + 2))}
              className="p-2.5 hover:bg-stone-50 rounded-xl text-stone-500 transition-colors"
              title="பெரிய எழுத்து"
            >
              <Type size={22} />
            </button>
            
            <div className="w-[1px] h-8 bg-stone-100 mx-3" />
            
            <select 
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value as any)}
              className="text-xs font-black text-stone-600 bg-transparent border-none focus:ring-0 cursor-pointer pr-10 py-2"
            >
              <option value="sans">Sans Tamil</option>
              <option value="serif">Serif Tamil</option>
              <option value="modern">Modern Tamil</option>
            </select>
          </div>

          <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-2xl p-1.5 shadow-sm">
            <button 
              onClick={handleCopy}
              className={`p-2.5 rounded-xl flex items-center gap-3 transition-all ${copied ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-stone-50 text-stone-600'}`}
              title={hasSelection ? "தேர்ந்தெடுத்ததை நகலெடு" : "முழுவதையும் நகலெடு"}
            >
              {copied ? <Check size={18} /> : (hasSelection ? <Scissors size={18} className="text-orange-500" /> : <Copy size={18} />)}
              <span className="text-xs font-black uppercase tracking-wider">
                {copied ? 'நகலெடுக்கப்பட்டது' : (hasSelection ? 'பகுதி நகல்' : 'முழு நகல்')}
              </span>
            </button>
            
            <div className="w-[1px] h-8 bg-stone-100 mx-1" />

            <button 
              onClick={() => handleShare('whatsapp')}
              className={`p-2.5 rounded-xl transition-all ${hasSelection ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-stone-50 text-stone-400 hover:text-emerald-500'}`}
              title="வாட்ஸ்அப்"
            >
              <Send size={20} />
            </button>

            <button 
              onClick={() => handleShare('telegram')}
              className={`p-2.5 rounded-xl transition-all ${hasSelection ? 'bg-sky-50 text-sky-600' : 'hover:bg-stone-50 text-stone-400 hover:text-sky-500'}`}
              title="டெலிகிராம்"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <article className="bg-white p-8 md:p-20 rounded-[3rem] shadow-2xl shadow-stone-200/50 border border-stone-100 min-h-[80vh] relative overflow-hidden">
        {/* Subtle Paper Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper.png')]" />
        
        <header className="mb-16 pb-12 border-b border-stone-100 relative z-10">
          <div className="flex items-center gap-3 text-orange-600 font-black text-[10px] uppercase tracking-[0.3em] mb-6">
            <div className="w-8 h-[2px] bg-orange-600/20" />
            <span>தமிழ் இலக்கியம்</span>
          </div>
          
          <h1 className={`text-4xl md:text-6xl font-black text-stone-900 leading-[1.15] tracking-tight ${getFontClass()}`}>
            {book.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between mt-10 gap-6">
            <div className="flex items-center gap-6 text-stone-400 text-xs font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-stone-200" />
                <span>மின்னூல்</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-stone-200" />
                <span>{new Date(book.importedAt).toLocaleDateString('ta-IN')}</span>
              </div>
            </div>
            
            {hasSelection && (
              <div className="flex items-center gap-2 text-[10px] font-black text-orange-600 bg-orange-50 px-4 py-2 rounded-full border border-orange-100 animate-pulse uppercase tracking-wider">
                <Scissors size={12} />
                பகுதி தேர்ந்தெடுக்கப்பட்டுள்ளது
              </div>
            )}
          </div>
        </header>

        <div 
          className={`text-stone-800 leading-[2.2] whitespace-pre-wrap transition-all duration-500 focus:outline-none relative z-10 ${getFontClass()}`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {book.content}
        </div>

        {/* Decorative End Mark */}
        <div className="mt-20 flex justify-center opacity-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-stone-400" />
            <div className="w-2 h-2 rounded-full bg-stone-400" />
            <div className="w-12 h-[1px] bg-stone-400" />
          </div>
        </div>
      </article>

      {/* Floating Action Buttons for quick sharing at bottom */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-stone-900/90 backdrop-blur-2xl p-4 rounded-[2rem] shadow-2xl z-50 border border-white/10">
        <div className="text-[10px] font-black text-stone-400 px-3 uppercase tracking-widest hidden sm:block">பகிர:</div>
        <button 
          onClick={() => handleShare('whatsapp')}
          className="flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-green-900/20"
        >
          <Send size={20} />
          WhatsApp
        </button>
        <button 
          onClick={() => handleShare('telegram')}
          className="flex items-center gap-3 bg-[#0088cc] text-white px-8 py-4 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-900/20"
        >
          <Share2 size={20} />
          Telegram
        </button>
      </div>
    </div>
  );
};

export default Reader;
