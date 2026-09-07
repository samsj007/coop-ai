import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, LogOut, Wrench, Shield, Home, Grid } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-[1500] bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-slate-900 tracking-tight">COOP AI</span>
              <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                SIH26089
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Cooperative Gig Services</p>
          </div>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/"
            className="text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-lg transition hidden md:inline-flex items-center gap-1.5"
          >
            <Home className="w-4 h-4" /> Home
          </Link>

          {!isAuthenticated ? (
            <>
              <Link
                to="/register/worker"
                className="text-xs font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg border border-slate-200 hover:border-indigo-200 transition flex items-center gap-1.5"
              >
                <Wrench className="w-3.5 h-3.5 text-indigo-600" /> Join as Provider
              </Link>
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" /> Login
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Role specific dashboard links */}
              {user?.role === 'customer' && (
                <Link
                  to="/customer"
                  className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-indigo-100 transition"
                >
                  <Grid className="w-3.5 h-3.5" /> Customer Dashboard
                </Link>
              )}

              {user?.role === 'worker' && (
                <Link
                  to="/worker"
                  className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-emerald-100 transition"
                >
                  <Wrench className="w-3.5 h-3.5" /> Worker Dashboard
                </Link>
              )}

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-purple-100 transition"
                >
                  <Shield className="w-3.5 h-3.5" /> Admin Portal
                </Link>
              )}

              {/* User Profile info */}
              <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  {user?.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">{user?.role}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-600 p-2 rounded-lg hover:bg-slate-100 transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
