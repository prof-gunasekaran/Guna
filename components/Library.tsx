
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
        {books.map((book) => (
          <div 
            key={book.id}
            className="group flex flex-col space-y-3 animate-fadeIn"
          >
            {/* Realistic Book Wrapper */}
            <div 
              className="relative aspect-[3/4] cursor-pointer perspective-1000"
              onClick={() => onOpen(book)}
            >
              <div className={`w-full h-full rounded-r-lg shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-rotate-y-12 group-hover:scale-105 origin-left flex flex-col ${book.coverColor} relative overflow-hidden border-l-4 border-black/20`}>
                {/* Book Spine Effect */}
                <div className="absolute inset-y-0 left-0 w-4 bg-black/10 z-10" />
                
                {/* Cover Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center z-20">
                  <div className="w-full h-[1px] bg-white/30 mb-4" />
                  <h3 className="text-white font-black text-sm sm:text-base leading-tight line-clamp-4 px-2 drop-shadow-md tamil-text">
                    {book.title}
                  </h3>
                  <div className="w-full h-[1px] bg-white/30 mt-4" />
                </div>

                {/* Texture Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />
                <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/paper.png')] pointer-events-none" />
              </div>

              {/* Delete Button Overlay */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(book.id);
                }}
                className="absolute -top-2 -right-2 p-2 bg-white text-slate-400 hover:text-red-600 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 border border-slate-100"
                title="நீக்கு"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Book Info */}
            <div className="space-y-1 cursor-pointer" onClick={() => onOpen(book)}>
              <h4 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                {book.title}
              </h4>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                {new Date(book.importedAt).toLocaleDateString('ta-IN')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
