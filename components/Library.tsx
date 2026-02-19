
import React from 'react';
import { Book as BookType } from '../types';
import { Trash2, ExternalLink, Library as LibIcon } from 'lucide-react';

interface LibraryProps {
  books: BookType[];
  onOpen: (book: BookType) => void;
  onDelete: (id: string) => void;
  onImportRequest: () => void;
}

const Library: React.FC<LibraryProps> = ({ books, onOpen, onDelete, onImportRequest }) => {
  if (books.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="bg-indigo-50 p-8 rounded-full">
          <LibIcon size={64} className="text-indigo-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">உங்கள் நூலகம் காலியாக உள்ளது</h2>
          <p className="text-slate-500 max-w-sm">
            புதிய PDF அல்லது Word கோப்புகளை பதிவேற்ற கீழேயுள்ள பொத்தானை அழுத்தவும்.
          </p>
        </div>
        <button
          onClick={onImportRequest}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
        >
          கோப்பைத் தேர்ந்தெடு
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">எனது நூலகம்</h2>
          <p className="text-slate-500 mt-1">{books.length} நூல்கள் சேமிக்கப்பட்டுள்ளன</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <div 
            key={book.id}
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col"
          >
            {/* Cover Mockup */}
            <div 
              className={`h-48 ${book.coverColor} flex items-center justify-center p-6 relative cursor-pointer overflow-hidden`}
              onClick={() => onOpen(book)}
            >
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded shadow-lg transform group-hover:scale-105 transition-transform duration-300 z-10">
                <span className="text-slate-800 font-bold text-center block text-sm leading-tight line-clamp-3">
                  {book.title}
                </span>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 
                  className="font-bold text-slate-800 line-clamp-2 leading-snug cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => onOpen(book)}
                >
                  {book.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  {new Date(book.importedAt).toLocaleDateString('ta-IN')} அன்று சேர்க்கப்பட்டது
                </p>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => onOpen(book)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-indigo-50 text-indigo-600 py-2.5 rounded-lg font-bold transition-all border border-slate-100 hover:border-indigo-100 active:scale-95"
                >
                  <ExternalLink size={16} />
                  படிக்க
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(book.id);
                  }}
                  className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100 active:scale-90"
                  aria-label="Delete Book"
                  title="நீக்கு"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
