import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { initialTransactions, initialBooks } from '../../utils/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ReportDashboard() {
  const [transactions] = useLocalStorage('lms_transactions', initialTransactions);
  const [books] = useLocalStorage('lms_books', initialBooks);

  // Group transactions by month for chart
  const monthlyData = transactions.reduce((acc, tx) => {
    const month = tx.issueDate.substring(0, 7); // YYYY-MM
    if (!acc[month]) acc[month] = { name: month, issued: 0, returned: 0 };
    acc[month].issued += 1;
    if (tx.status === 'returned') acc[month].returned += 1;
    return acc;
  }, {});
  
  const chartData = Object.values(monthlyData).sort((a, b) => a.name.localeCompare(b.name));

  const overdueBooks = transactions.filter(t => {
    if (t.status === 'returned') return false;
    return new Date(t.dueDate) < new Date();
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Reports Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">Library activity and analytics</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Issue & Return Trends</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="issued" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Issued" />
              <Bar dataKey="returned" fill="#10b981" radius={[4, 4, 0, 0]} name="Returned" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Overdue Books ({overdueBooks.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-medium">Book Title</th>
                <th className="px-6 py-4 font-medium">User ID</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium">Days Overdue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {overdueBooks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No overdue books at the moment.</td>
                </tr>
              ) : overdueBooks.map((tx) => {
                const book = books.find(b => b.id === tx.bookId);
                const diffTime = new Date() - new Date(tx.dueDate);
                const daysOverdue = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                
                return (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{book?.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{tx.userId}</td>
                    <td className="px-6 py-4 text-sm text-red-600 dark:text-red-400">{tx.dueDate}</td>
                    <td className="px-6 py-4 text-sm font-bold text-red-600 dark:text-red-400">{daysOverdue} days</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
