import React from 'react';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
              ⚡
            </div>
            <span className="text-xl font-bold text-white tracking-tight">COOP AI</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            AI-Powered Cooperative Gig Services Platform connecting verified skilled workers with households & institutions across India.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-semibold bg-indigo-950 border border-indigo-800 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> SIH26089 Platform
          </span>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Services Across India</h4>
          <ul className="text-xs space-y-2">
            <li>Plumbing & Water Systems</li>
            <li>Electrical & Wiring Repairs</li>
            <li>AC & Home Appliance Service</li>
            <li>Carpentry & Furniture Assembly</li>
            <li>House Deep Cleaning & Hygiene</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Cooperative Model</h4>
          <ul className="text-xs space-y-2">
            <li>FairShare Allocation Engine</li>
            <li>Multi-Level Worker Verification</li>
            <li>Worker Healthcare Welfare Fund</li>
            <li>Cooperative Demand Intelligence</li>
            <li>Transparent Pricing & Earnings</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Coverage & Trust</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Active in Bengaluru, Chennai, Hyderabad, Mumbai, Delhi, Pune, Kolkata, Ahmedabad, Coimbatore, Madurai, Trichy & across India.
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> 100% Identity & Skill Verified Workers
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© 2026 COOP AI. SIH26089 Cooperative Gig Services Platform. All rights reserved.</p>
        <p className="flex items-center gap-1 mt-2 sm:mt-0">
          Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> for Indian Communities & Worker Cooperatives.
        </p>
      </div>
    </footer>
  );
};
