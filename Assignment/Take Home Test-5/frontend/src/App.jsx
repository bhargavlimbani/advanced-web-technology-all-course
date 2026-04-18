import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { Layout } from './shared/components/Layout';

import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './features/dashboard/Dashboard';
import BookList from './features/books/BookList';
import TransactionManager from './features/transactions/TransactionManager';
import LibrarianUserList from './features/users/LibrarianUserList';
import ReportDashboard from './features/reports/ReportDashboard';

const Unauthorized = () => <div className="text-2xl text-red-500 p-8">Unauthorized Access</div>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/books" element={<BookList />} />
              
              {/* Librarian Only Routes */}
              <Route element={<ProtectedRoute roles={['librarian']} />}>
                <Route path="/transactions" element={<TransactionManager />} />
                <Route path="/users" element={<LibrarianUserList />} />
                <Route path="/reports" element={<ReportDashboard />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
