import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, User, Shield } from 'lucide-react';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    // Mock register logic
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      email: data.email,
      role: data.role,
      token: 'mock-jwt-token'
    };
    login(mockUser);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 text-center space-y-2">
          <div className="mx-auto bg-primary-100 dark:bg-primary-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
            <BookOpen className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Create Account</h2>
          <p className="text-slate-500 dark:text-slate-400">Join the LMS Nexus</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-0 space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              type="text"
              placeholder="John Doe"
              className={`w-full px-4 py-3 rounded-xl border \${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-primary-500'} bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' } })}
              type="email"
              placeholder="name@university.edu"
              className={`w-full px-4 py-3 rounded-xl border \${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-primary-500'} bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <input
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min length 6' } })}
              type="password"
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl border \${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-primary-500'} bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Role</label>
            <div className="grid grid-cols-2 gap-4">
              <label className="relative cursor-pointer">
                <input {...register('role', { required: 'Role is required' })} type="radio" value="student" className="peer sr-only" />
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center peer-checked:border-primary-500 peer-checked:bg-primary-50 dark:peer-checked:bg-primary-900/20 transition-all">
                  <User className="h-6 w-6 mx-auto mb-2 text-slate-500 peer-checked:text-primary-600 dark:peer-checked:text-primary-400" />
                  <span className="font-medium text-sm text-slate-700 dark:text-slate-300 peer-checked:text-primary-700 dark:peer-checked:text-primary-400">Student</span>
                </div>
              </label>
              
              <label className="relative cursor-pointer">
                <input {...register('role', { required: 'Role is required' })} type="radio" value="librarian" className="peer sr-only" />
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center peer-checked:border-primary-500 peer-checked:bg-primary-50 dark:peer-checked:bg-primary-900/20 transition-all">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-slate-500 peer-checked:text-primary-600 dark:peer-checked:text-primary-400" />
                  <span className="font-medium text-sm text-slate-700 dark:text-slate-300 peer-checked:text-primary-700 dark:peer-checked:text-primary-400">Librarian</span>
                </div>
              </label>
            </div>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-medium text-lg rounded-xl transition-colors shadow-lg shadow-primary-600/30 mt-4"
          >
            Register
          </button>
        </form>

        <div className="p-6 border-t border-slate-100 dark:border-slate-700 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
