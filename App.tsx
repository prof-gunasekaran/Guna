
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              setCurrentView(AppView.LIBRARY);
              setSelectedBook(null);
            }}
          >
            <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-700 transition-colors">
              <BookOpen className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight hidden sm:block">
              தமிழ் மின்னூல் படிப்பான்
            </h1>
          </div>

          <nav className="flex items-center gap-1 sm:gap-4">
            <button
              onClick={() => {
                setCurrentView(AppView.LIBRARY);
                setSelectedBook(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                currentView === AppView.LIBRARY 
                  ? 'bg-indigo-100 text-indigo-700 font-bold' 
                  : 'text-slate-600 hover:bg-slate-100'
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
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                currentView === AppView.IMPORTER 
                  ? 'bg-indigo-100 text-indigo-700 font-bold' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <PlusCircle size={18} />
              <span className="hidden sm:inline">பதிவேற்று</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6">
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
      <footer className="bg-white border-t border-slate-200 py-6 px-6 text-center text-slate-400 text-sm">
        <p className="font-bold">© 2024 தமிழ் மின்னூல் படிப்பான்</p>
        <p className="mt-1">அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை</p>
      </footer>
    </div>
  );
};

export default App;
