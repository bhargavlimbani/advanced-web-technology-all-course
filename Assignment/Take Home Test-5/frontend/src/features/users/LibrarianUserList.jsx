import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { initialUsers } from '../../utils/mockData';
import { Shield, User, Search, Settings } from 'lucide-react';
import { Button } from '../../shared/components/Button';

export default function LibrarianUserList() {
  const [users, setUsers] = useLocalStorage('lms_users', initialUsers);
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRole = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        return { ...u, role: u.role === 'student' ? 'librarian' : 'student' };
      }
      return u;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400">View and manage system access</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                {user.role === 'librarian' ? <Shield className="w-6 h-6" /> : <User className="w-6 h-6" />}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize \${
                user.role === 'librarian' 
                  ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                  : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {user.role}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{user.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{user.email}</p>
            
            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-400">ID: {user.id}</span>
              <Button onClick={() => toggleRole(user.id)} variant="secondary" className="px-3 py-1 text-sm h-8">
                Toggle Role
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
