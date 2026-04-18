import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { initialTransactions, initialBooks, initialUsers } from '../../utils/mockData';
import { Button } from '../../shared/components/Button';
import { RefreshCcw, LogIn, LogOut } from 'lucide-react';

export default function TransactionManager() {
  const [transactions, setTransactions] = useLocalStorage('lms_transactions', initialTransactions);
  const [books, setBooks] = useLocalStorage('lms_books', initialBooks);
  const [users] = useLocalStorage('lms_users', initialUsers);

  const [activeTab, setActiveTab] = useState('issue');
  
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  
  // Watch values for live previews
  const watchBookId = watch('bookId');
  const watchUserId = watch('userId');
  const watchReturnDate = watch('returnDate');
  const watchTransactionId = watch('transactionId');

  const selectedBook = books.find(b => b.id.toString() === watchBookId);
  const selectedUser = users.find(u => u.id.toString() === watchUserId);
  const selectedTx = transactions.find(t => t.id.toString() === watchTransactionId);

  const calculateFine = (dueDate, returnDate) => {
    if (!dueDate || !returnDate) return 0;
    const due = new Date(dueDate);
    const ret = new Date(returnDate);
    const diffTime = ret - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * 5 : 0; // $5 per day
  };

  const onIssue = (data) => {
    if (selectedBook.availableCopies <= 0) {
      alert("No copies available!");
      return;
    }
    const newTx = {
      id: Date.now(),
      bookId: parseInt(data.bookId),
      userId: data.userId,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      returnDate: null,
      fine: 0,
      status: 'issued'
    };
    setTransactions([...transactions, newTx]);
    setBooks(books.map(b => b.id === newTx.bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b));
    alert("Book issued successfully");
    reset();
  };

  const onReturn = (data) => {
    const fineAmt = calculateFine(selectedTx.dueDate, data.returnDate);
    const updatedTx = { ...selectedTx, returnDate: data.returnDate, fine: fineAmt, status: 'returned' };
    
    setTransactions(transactions.map(t => t.id === updatedTx.id ? updatedTx : t));
    setBooks(books.map(b => b.id === selectedTx.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b));
    alert(`Book returned successfully. Fine: $${fineAmt}`);
    reset();
  };

  const onRenew = (data) => {
    const updatedTx = { ...selectedTx, dueDate: data.newDueDate, status: 'renewed' };
    setTransactions(transactions.map(t => t.id === updatedTx.id ? updatedTx : t));
    alert("Book renewed successfully.");
    reset();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Transaction Management</h1>
        <p className="text-slate-500 dark:text-slate-400">Issue, return, and renew books</p>
      </div>

      <div className="flex space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
        {['issue', 'return', 'renew'].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); reset(); }}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all capitalize flex items-center justify-center space-x-2 \${
              activeTab === tab 
                ? 'bg-white text-slate-800 dark:bg-slate-700 dark:text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tab === 'issue' && <LogOut className="w-4 h-4" />}
            {tab === 'return' && <LogIn className="w-4 h-4" />}
            {tab === 'renew' && <RefreshCcw className="w-4 h-4" />}
            <span>{tab} Book</span>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
        {activeTab === 'issue' && (
          <form onSubmit={handleSubmit(onIssue)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Select Book</label>
                <select {...register('bookId', { required: true })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white">
                  <option value="">-- Choose Book --</option>
                  {books.map(b => <option key={b.id} value={b.id}>{b.title} ({b.availableCopies} avail)</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Select Student</label>
                <select {...register('userId', { required: true })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white">
                  <option value="">-- Choose Student --</option>
                  {users.filter(u => u.role === 'student').map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Issue Date</label>
                <input type="date" {...register('issueDate', { required: true })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Due Date</label>
                <input type="date" {...register('dueDate', { required: true })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
              </div>
            </div>

            {selectedBook && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-800 dark:text-blue-300 text-sm">
                <strong>Preview:</strong> Issuing "{selectedBook.title}" to {selectedUser?.name || '...'} <br/>
                Availability: {selectedBook.availableCopies > 0 ? <span className="text-green-600 dark:text-green-400">Available</span> : <span className="text-red-600 dark:text-red-400">Out of Stock</span>}
              </div>
            )}
            
            <Button type="submit" disabled={!selectedBook || selectedBook.availableCopies <= 0} className="w-full">Issue Book</Button>
          </form>
        )}

        {activeTab === 'return' && (
          <form onSubmit={handleSubmit(onReturn)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-slate-300">Select Active Transaction</label>
              <select {...register('transactionId', { required: true })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white">
                <option value="">-- Choose Transaction --</option>
                {transactions.filter(t => t.status !== 'returned').map(t => (
                  <option key={t.id} value={t.id}>
                    TX#{t.id} - {books.find(b => b.id === t.bookId)?.title} (Due: {t.dueDate})
                  </option>
                ))}
              </select>
            </div>
            
            {selectedTx && (
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Return Date</label>
                <input type="date" {...register('returnDate', { required: true })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
              </div>
            )}

            {selectedTx && watchReturnDate && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-800 dark:text-amber-300 text-sm">
                <strong>Fine Preview:</strong> ${calculateFine(selectedTx.dueDate, watchReturnDate)}
              </div>
            )}

            <Button type="submit" disabled={!selectedTx || !watchReturnDate} className="w-full">Process Return</Button>
          </form>
        )}

        {activeTab === 'renew' && (
          <form onSubmit={handleSubmit(onRenew)} className="space-y-5">
           <div>
              <label className="block text-sm font-medium mb-1 dark:text-slate-300">Select Active Transaction</label>
              <select {...register('transactionId', { required: true })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white">
                <option value="">-- Choose Transaction --</option>
                {transactions.filter(t => t.status !== 'returned').map(t => (
                  <option key={t.id} value={t.id}>
                    TX#{t.id} - {books.find(b => b.id === t.bookId)?.title} (Due: {t.dueDate})
                  </option>
                ))}
              </select>
            </div>

            {selectedTx && (
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">New Due Date</label>
                <input type="date" {...register('newDueDate', { required: true })} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
              </div>
            )}

            <Button type="submit" disabled={!selectedTx} className="w-full">Renew Book</Button>
          </form>
        )}
      </div>
    </div>
  );
}
