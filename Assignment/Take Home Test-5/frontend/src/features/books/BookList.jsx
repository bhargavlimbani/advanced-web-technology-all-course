import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { initialBooks } from '../../utils/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../shared/components/Button';
import { BookForm } from './BookForm';

export default function BookList() {
  const { user } = useAuth();
  const [books, setBooks] = useLocalStorage('lms_books', initialBooks);
  
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const categories = useMemo(() => Array.from(new Set(books.map(b => b.category))), [books]);

  const filteredBooks = books.filter(book => 
    (book.title.toLowerCase().includes(search.toLowerCase()) || book.author.toLowerCase().includes(search.toLowerCase())) &&
    (filterCategory ? book.category === filterCategory : true)
  );

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const currentBooks = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSaveBook = (bookData) => {
    if (bookData.id) {
      setBooks(books.map(b => b.id === bookData.id ? bookData : b));
    } else {
      setBooks([...books, { ...bookData, id: Date.now(), availableCopies: bookData.totalCopies }]);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter(b => b.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Books Catalog</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and browse the library collection</p>
        </div>
        {user?.role === 'librarian' && (
          <Button onClick={() => { setEditingBook(null); setIsModalOpen(true); }} className="space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Book</span>
          </Button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
        >
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-medium">Title & Author</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Availability</th>
                {user?.role === 'librarian' && <th className="px-6 py-4 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {currentBooks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No books found.</td>
                </tr>
              ) : currentBooks.map((book) => (
                <tr key={book.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{book.title}</div>
                    <div className="text-sm text-slate-500">{book.author}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full \${book.availableCopies > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {book.availableCopies} / {book.totalCopies} available
                      </span>
                    </div>
                  </td>
                  {user?.role === 'librarian' && (
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => { setEditingBook(book); setIsModalOpen(true); }} className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(book.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-sm text-slate-500">Page {currentPage} of {totalPages}</span>
            <div className="flex space-x-2">
              <Button disabled={currentPage === 1} variant="secondary" onClick={() => setCurrentPage(p => p - 1)}>Prev</Button>
              <Button disabled={currentPage === totalPages} variant="secondary" onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>

      <BookForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} book={editingBook} onSubmit={handleSaveBook} />
    </div>
  );
}
