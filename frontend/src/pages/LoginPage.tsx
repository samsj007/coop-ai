import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User as UserIcon, Lock, Shield, Wrench, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const LoginPage: React.FC = () => {
  const [role, setRole] = useState<'customer' | 'worker' | 'admin'>('customer');
  const [email, setEmail] = useState('customer@coopai.demo');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole: 'customer' | 'worker' | 'admin') => {
    setRole(newRole);
    setError(null);
    if (newRole === 'customer') {
      setEmail('customer@coopai.demo');
      setPassword('demo123');
    } else if (newRole === 'worker') {
      setEmail('rajesh.plumber@coopai.demo');
      setPassword('demo123');
    } else {
      setEmail('admin@coopai.org');
      setPassword('admin123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userData = await api.login(email, password, role);
      login(userData);

      if (userData.role === 'customer') navigate('/customer');
      else if (userData.role === 'worker') navigate('/worker');
      else if (userData.role === 'admin') navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white text-center relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              ⚡
            </div>
            <h2 className="text-2xl font-black tracking-tight">Login to COOP AI</h2>
            <p className="text-xs text-slate-300 mt-1">Select your access role to proceed</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl mb-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleRoleChange('customer')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1 transition ${
                  role === 'customer'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" /> Customer
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('worker')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1 transition ${
                  role === 'worker'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" /> Provider
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1 transition ${
                  role === 'admin'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5" /> Admin
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {role === 'admin' ? 'Admin Email / Username' : 'Email Address / Mobile'}
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                  Remember session
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Demo Reset: Use default credentials demo123"); }} className="text-indigo-600 hover:underline font-semibold">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-sm py-3 rounded-xl shadow-md transition disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : `Login as ${role.toUpperCase()}`}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to={role === 'worker' ? '/register/worker' : '/register/customer'} className="text-indigo-600 font-bold hover:underline">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
