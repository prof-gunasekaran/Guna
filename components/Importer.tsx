
import React, { useState, useRef } from 'react';
import { Book } from '../types';
import { processDocument } from '../services/documentService';
import { Upload, Loader2, FileText, AlertCircle } from 'lucide-react';

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
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center space-y-8">
        <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
          {isProcessing ? (
            <Loader2 className="animate-spin" size={40} />
          ) : (
            <Upload size={40} />
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">கோப்பைப் பதிவேற்று</h2>
          <p className="text-slate-500">PDF அல்லது Word (.docx) கோப்பைத் தேர்ந்தெடுக்கவும்</p>
        </div>

        {isProcessing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-indigo-600 font-medium">
              <Loader2 className="animate-spin" size={20} />
              <span>{progress}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-indigo-500 h-full w-full transition-all duration-500" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 transition-all flex items-center gap-3 active:scale-95"
            >
              <FileText size={20} />
              கோப்பைத் தேர்ந்தெடு
            </button>
            <p className="text-xs text-slate-400">PDF மற்றும் Word (.docx) கோப்புகள் ஆதரிக்கப்படுகின்றன</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl text-sm justify-center border border-red-100">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
      </div>

      <div className="mt-12 bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
        <h3 className="font-bold text-indigo-800 mb-2">தகவல்:</h3>
        <ul className="text-sm text-indigo-700 space-y-2 list-disc list-inside">
          <li>இப்போது நீங்கள் Word (.docx) கோப்புகளையும் பதிவேற்றலாம்.</li>
          <li>படங்கள் தானாகவே தவிர்க்கப்பட்டு உரை மட்டும் பிரித்தெடுக்கப்படும்.</li>
          <li>உரைத் தேர்வின் மூலம் குறிப்பிட்ட பகுதியை மட்டும் நகலெடுக்கலாம் அல்லது பகிரலாம்.</li>
        </ul>
      </div>
    </div>
  );
};

export default Importer;
