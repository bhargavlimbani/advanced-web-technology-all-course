import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { initialTransactions, initialBooks } from '../../utils/mockData';
import { BookOpen, Calendar, Clock, CheckCircle } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [transactions] = useLocalStorage('lms_transactions', initialTransactions);
  const [books] = useLocalStorage('lms_books', initialBooks);

  const userTransactions = transactions.filter(t => t.userId === user.id);

  // Aggregate stats
  const activeBorrowed = userTransactions.filter(t => t.status === 'issued' || t.status === 'renewed').length;
  const totalFines = userTransactions.reduce((acc, curr) => acc + (curr.fine || 0), 0);

  const getBookTitle = (id) => books.find(b => b.id === id)?.title || 'Unknown Book';

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Welcome, {user.name}</h1>
        <p className="text-slate-500 dark:text-slate-400">Here's your reading overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <BookOpen className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Currently Borrowed</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{activeBorrowed} Books</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-4">
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
            <Clock className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Fines</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">${totalFines}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Your Reading History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-medium">Book</th>
                <th className="px-6 py-4 font-medium">Issue Date</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Fine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {userTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No history found.</td>
                </tr>
              ) : userTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                    {getBookTitle(tx.bookId)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {tx.issueDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {tx.dueDate}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize \${
                      tx.status === 'returned' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-medium \${tx.fine > 0 ? 'text-red-500' : 'text-slate-500'}`}>
                    ${tx.fine}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
