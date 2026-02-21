
import React, { useState, useRef } from 'react';
import { Book } from '../types';
import { processDocument } from '../services/documentService';
import { Upload, Loader2, FileText, AlertCircle, Share2 } from 'lucide-react';

interface ImporterProps {
  onComplete: (book: Book) => void;
}

const COVER_COLORS = [
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-violet-500',
  'bg-sky-500',
  'bg-fuchsia-500',
  'bg-teal-500'
];

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const Importer: React.FC<ImporterProps> = ({ onComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ['pdf', 'docx'];
    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    if (!allowedExtensions.includes(extension)) {
      setError("தயவுசெய்து PDF அல்லது Word (.docx) கோப்பை மட்டும் தேர்ந்தெடுக்கவும்.");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      setProgress('கோப்பிலிருந்து உரையைப் பிரித்தெடுக்கிறது...');
      
      const rawResult = await processDocument(file);
      
      setProgress('நூலகத்தில் சேர்க்கப்படுகிறது...');
      
      const newBook: Book = {
        id: generateId(),
        title: rawResult.title,
        content: rawResult.content,
        importedAt: Date.now(),
        coverColor: COVER_COLORS[Math.floor(Math.random() * COVER_COLORS.length)]
      };

      setTimeout(() => {
        onComplete(newBook);
      }, 500);

    } catch (err: any) {
      console.error("Processing failed", err);
      setError(err.message || "கோப்பைப் பதிவேற்றுவதில் சிக்கல் ஏற்பட்டது. மீண்டும் முயலவும்.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 animate-fadeIn">
      <div className="bg-white rounded-[3rem] border-2 border-dashed border-stone-200 p-16 text-center space-y-10 shadow-xl shadow-stone-100 relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-stone-50 rounded-full blur-3xl opacity-50" />

        <div className="relative z-10 mx-auto w-28 h-28 bg-stone-50 rounded-[2rem] flex items-center justify-center text-orange-600 shadow-inner">
          {isProcessing ? (
            <Loader2 className="animate-spin" size={48} />
          ) : (
            <Upload size={48} className="group-hover:scale-110 transition-transform duration-500" />
          )}
        </div>

        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl font-black text-stone-800 tracking-tight tamil-text">கோப்பைப் பதிவேற்று</h2>
          <p className="text-stone-400 font-medium max-w-xs mx-auto">உங்கள் PDF அல்லது Word (.docx) கோப்புகளை இங்கே இழுத்துப் போடவும் அல்லது தேர்ந்தெடுக்கவும்</p>
        </div>

        {isProcessing ? (
          <div className="relative z-10 space-y-6 max-w-sm mx-auto">
            <div className="flex items-center justify-center gap-4 text-orange-600 font-black text-sm uppercase tracking-widest">
              <Loader2 className="animate-spin" size={20} />
              <span>{progress}</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden shadow-inner">
              <div className="bg-orange-500 h-full w-full transition-all duration-1000 ease-out" />
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center gap-6">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-stone-900 hover:bg-orange-600 text-white px-12 py-5 rounded-2xl font-black shadow-2xl shadow-stone-200 transition-all duration-300 flex items-center gap-4 active:scale-95 group"
            >
              <FileText size={22} className="group-hover:rotate-12 transition-transform" />
              <span>கோப்பைத் தேர்ந்தெடு</span>
            </button>
            <div className="flex items-center gap-4 text-[10px] font-black text-stone-300 uppercase tracking-[0.2em]">
              <div className="w-8 h-[1px] bg-stone-100" />
              <span>PDF & DOCX ONLY</span>
              <div className="w-8 h-[1px] bg-stone-100" />
            </div>
          </div>
        )}

        {error && (
          <div className="relative z-10 flex items-center gap-3 p-5 bg-red-50 text-red-600 rounded-2xl text-sm font-bold justify-center border border-red-100 animate-shake">
            <AlertCircle size={20} />
            {error}
          </div>
        )}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-4">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
            <FileText size={20} />
          </div>
          <h4 className="font-black text-stone-800 text-sm tamil-text">அனைத்து கோப்புகளும்</h4>
          <p className="text-xs text-stone-400 leading-relaxed font-medium">PDF மற்றும் Word (.docx) கோப்புகளிலிருந்து உரையை எளிதாகப் பிரித்தெடுக்கலாம்.</p>
        </div>
        
        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <Upload size={20} />
          </div>
          <h4 className="font-black text-stone-800 text-sm tamil-text">வேகமான செயலாக்கம்</h4>
          <p className="text-xs text-stone-400 leading-relaxed font-medium">படங்கள் தவிர்க்கப்பட்டு உரை மட்டும் மிக வேகமாகப் பிரித்தெடுக்கப்படும்.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-4">
          <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
            <Share2 size={20} />
          </div>
          <h4 className="font-black text-stone-800 text-sm tamil-text">எளிதான பகிர்வு</h4>
          <p className="text-xs text-stone-400 leading-relaxed font-medium">முக்கியமான பகுதிகளை மட்டும் தேர்ந்தெடுத்து சமூக ஊடகங்களில் பகிரலாம்.</p>
        </div>
      </div>
    </div>
  );
};

export default Importer;
