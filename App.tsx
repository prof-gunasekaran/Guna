
import React, { useState, useEffect, useCallback } from 'react';
import { Book, AppView } from './types';
import Library from './components/Library';
import Reader from './components/Reader';
import Importer from './components/Importer';
import { BookOpen, Library as LibraryIcon, PlusCircle } from 'lucide-react';

const STORAGE_KEY = 'tamil_pdf_reader_books';

const App: React.FC = () => {
  // Initialize state directly from storage
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load books from storage", e);
      return [];
    }
  });
  
  const [currentView, setCurrentView] = useState<AppView>(AppView.LIBRARY);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Persistence effect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }, [books]);

  const handleAddBook = (newBook: Book) => {
    setBooks(prev => [newBook, ...prev]);
    setCurrentView(AppView.LIBRARY);
  };

  const handleOpenBook = (book: Book) => {
    setSelectedBook(book);
    setCurrentView(AppView.READER);
  };

  const handleDeleteBook = useCallback((id: string) => {
    if (!id) return;
    
    const confirmDelete = window.confirm("இந்த நூலை உங்கள் நூலகத்திலிருந்து நீக்க விரும்புகிறீர்களா?");
    if (confirmDelete) {
      setBooks(prevBooks => {
        const filtered = prevBooks.filter(book => book.id !== id);
        // Explicitly return a new array to ensure re-render
        return [...filtered];
      });
      
      // If the currently reading book is deleted, go back to library
      if (selectedBook?.id === id) {
        setSelectedBook(null);
        setCurrentView(AppView.LIBRARY);
      }
    }
  }, [selectedBook]);

  return (
    <div className="min-h-screen bg-[#fdfcfb] flex flex-col selection:bg-orange-100 selection:text-orange-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-stone-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => {
              setCurrentView(AppView.LIBRARY);
              setSelectedBook(null);
            }}
          >
            <div className="bg-orange-600 p-2.5 rounded-2xl group-hover:bg-orange-700 transition-all duration-300 shadow-lg shadow-orange-100 group-hover:rotate-6">
              <BookOpen className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-stone-800 tracking-tight hidden sm:block tamil-text">
                தமிழ் மின்னூல் படிப்பான்
              </h1>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 hidden sm:block">
                Tamil Digital Reader
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-6">
            <button
              onClick={() => {
                setCurrentView(AppView.LIBRARY);
                setSelectedBook(null);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-300 font-bold text-sm ${
                currentView === AppView.LIBRARY 
                  ? 'bg-stone-900 text-white shadow-xl shadow-stone-200' 
                  : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              <LibraryIcon size={18} />
              <span className="hidden sm:inline">நூலகம்</span>
            </button>
            <button
              onClick={() => {
                setCurrentView(AppView.IMPORTER);
                setSelectedBook(null);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-300 font-bold text-sm ${
                currentView === AppView.IMPORTER 
                  ? 'bg-orange-600 text-white shadow-xl shadow-orange-100' 
                  : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              <PlusCircle size={18} />
              <span className="hidden sm:inline">பதிவேற்று</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 sm:p-10">
        {currentView === AppView.LIBRARY && (
          <Library 
            books={books} 
            onOpen={handleOpenBook} 
            onDelete={handleDeleteBook}
            onImportRequest={() => setCurrentView(AppView.IMPORTER)}
          />
        )}
        {currentView === AppView.IMPORTER && (
          <Importer onComplete={handleAddBook} />
        )}
        {currentView === AppView.READER && selectedBook && (
          <Reader 
            book={selectedBook} 
            onBack={() => {
              setCurrentView(AppView.LIBRARY);
              setSelectedBook(null);
            }} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-100 py-10 px-6 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-stone-300">
            <div className="w-12 h-[1px] bg-stone-200" />
            <BookOpen size={20} />
            <div className="w-12 h-[1px] bg-stone-200" />
          </div>
          <p className="font-black text-stone-800 tamil-text">© 2024 தமிழ் மின்னூல் படிப்பான்</p>
          <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">Crafted for Tamil Literature</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
