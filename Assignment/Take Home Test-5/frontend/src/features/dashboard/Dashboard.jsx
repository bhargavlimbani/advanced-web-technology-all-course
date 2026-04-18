import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import StudentDashboard from '../users/StudentDashboard';
import { Shield } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'librarian') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="bg-primary-50 dark:bg-primary-900/30 p-6 rounded-full inline-block">
          <Shield className="w-16 h-16 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-2">Librarian Workspace</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Welcome back, {user.name}. Use the sidebar to manage books, oversee transactions, and view reports.
          </p>
        </div>
      </div>
    );
  }

  return <StudentDashboard />;
}
