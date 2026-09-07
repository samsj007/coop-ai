import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, ShieldCheck, Zap, ArrowRight,
  Star, Wrench
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                SIH26089 • Next-Gen Cooperative Gig Marketplace
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Find the Right Skilled Worker.{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
                  Build a Stronger Cooperative.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed font-normal">
                COOP AI connects households, institutions, and verified skilled service providers through natural language AI service understanding, transparent FairShare worker allocation, and cooperative demand intelligence.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/customer"
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-extrabold text-sm px-7 py-4 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
                >
                  <Zap className="w-4 h-4 fill-current" /> Find a Service
                </Link>

                <Link
                  to="/register/worker"
                  className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700 font-bold text-sm px-7 py-4 rounded-xl backdrop-blur-md flex items-center justify-center gap-2 transition hover:border-slate-500"
                >
                  <Wrench className="w-4 h-4 text-indigo-400" /> Join as Service Provider
                </Link>

                <Link
                  to="/login"
                  className="w-full sm:w-auto text-slate-300 hover:text-white font-semibold text-sm px-5 py-4 flex items-center justify-center gap-1 transition"
                >
                  Login <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 text-left">
                <div>
                  <p className="text-2xl font-black text-white">20+</p>
                  <p className="text-xs text-slate-400">Pre-Seeded Skilled Workers</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-indigo-400">100%</p>
                  <p className="text-xs text-slate-400">Verified Credentials</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-amber-400">7-Factor</p>
                  <p className="text-xs text-slate-400">FairShare Allocation</p>
                </div>
              </div>
            </div>

            {/* Right Interactive AI Demo Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center justify-between mb-4 border-b border-slate-700/70 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs font-mono text-indigo-300 bg-indigo-950/80 px-2.5 py-1 rounded border border-indigo-800/50">
                    Gemini AI Parser
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-700/60 text-xs">
                    <span className="text-slate-400 block mb-1 font-semibold">Natural Language Customer Input:</span>
                    <p className="text-amber-200 font-medium text-sm">
                      "My kitchen tap is leaking and I need a plumber today."
                    </p>
                  </div>

                  <div className="bg-indigo-950/60 p-4 rounded-xl border border-indigo-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-indigo-300 font-bold">Identified Service:</span>
                      <span className="bg-indigo-600 text-white font-extrabold px-2.5 py-0.5 rounded-md">Plumbing</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-indigo-300 font-bold">Problem:</span>
                      <span className="text-white font-medium">Kitchen tap leakage</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-indigo-300 font-bold">Urgency:</span>
                      <span className="bg-red-500/20 text-red-300 font-extrabold px-2 py-0.5 rounded border border-red-500/40">High</span>
                    </div>
                  </div>

                  <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>FairShare Recommended: <strong>Rajesh Kumar (94% Match)</strong></span>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold">3.2 km</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How COOP AI Works Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest mb-2">Transparent Process</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">How COOP AI Works</h3>
            <p className="mt-3 text-slate-600 text-sm">
              Empowering both households and skilled workers with AI accuracy and cooperative fairness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center mb-4 shadow">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Natural Language Request</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Describe your issue in normal natural words. Gemini AI converts your prompt into structured requirement data.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center mb-4 shadow">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">7-Factor FairShare Allocation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates skill, availability, location, experience, rating, and workload to distribute work equitably among workers.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center mb-4 shadow">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Verified Worker Dispatch</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Only workers with verified Aadhaar/ID and skill certifications can accept jobs for total household safety.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center mb-4 shadow">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Cooperative Welfare Fund</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Platform surplus funds flow into worker healthcare & insurance, creating a sustainable worker-owned ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest mb-2">India-Wide Coverage</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Skilled Household & Community Services</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { name: 'Plumbing', icon: '🚰', desc: 'Pipe repair, taps & drains' },
              { name: 'Electrical', icon: '⚡', desc: 'Wiring, switches & lights' },
              { name: 'Carpentry', icon: '🪚', desc: 'Furniture & door lock repair' },
              { name: 'Cleaning', icon: '🧹', desc: 'Deep house & sanitation' },
              { name: 'Painting', icon: '🎨', desc: 'Wall touchup & full paint' },
              { name: 'AC Service', icon: '❄️', desc: 'Filter clean & gas refill' },
              { name: 'Appliance Repair', icon: '🔌', desc: 'Washing machine, TV, fridge' },
              { name: 'Gardening', icon: '🪴', desc: 'Lawn care & pruning' },
              { name: 'Mason', icon: '🧱', desc: 'Tiles & structural restoration' },
              { name: 'Tutoring', icon: '📚', desc: 'Home tuition & academics' },
            ].map((s) => (
              <div
                key={s.name}
                onClick={() => navigate('/customer')}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition cursor-pointer text-center group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{s.icon}</div>
                <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Workers Highlight Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest mb-2">100% Vetted Personnel</h2>
              <h3 className="text-3xl font-extrabold text-slate-900">Featured Verified Workers</h3>
            </div>
            <Link to="/customer" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 mt-2 md:mt-0">
              View All 20 Pre-Seeded Providers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: 'Rajesh Kumar', role: 'Plumber', city: 'Bengaluru', rating: 4.9, exp: '8.5 Yrs', jobs: 142, img: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80' },
              { name: 'Ananya Sundaram', role: 'Electrician', city: 'Chennai', rating: 4.8, exp: '6.0 Yrs', jobs: 98, img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
              { name: 'Suresh Reddy', role: 'Carpenter', city: 'Hyderabad', rating: 4.95, exp: '11 Yrs', jobs: 210, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
              { name: 'Priya Patil', role: 'Cleaning Expert', city: 'Mumbai', rating: 4.75, exp: '5.0 Yrs', jobs: 84, img: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80' },
            ].map((w, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition">
                <div className="h-44 overflow-hidden relative">
                  <img src={w.img} alt={w.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                    <ShieldCheck className="w-3 h-3" /> Identity & Skill Verified
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-slate-900 text-base">{w.name}</h4>
                  <p className="text-xs text-indigo-600 font-semibold">{w.role} • {w.city}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200">
                    <span className="font-bold text-amber-600 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" /> {w.rating}
                    </span>
                    <span>{w.jobs} Completed Jobs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Callout */}
      <section className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black tracking-tight mb-4">Ready to Experience COOP AI?</h2>
          <p className="text-indigo-100 text-sm max-w-xl mx-auto mb-8">
            Access immediate natural language AI service parsing, fair share allocation, and verified professionals near you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/customer"
              className="bg-white text-indigo-900 font-black text-sm px-8 py-3.5 rounded-xl shadow-lg hover:bg-slate-100 transition"
            >
              Customer Dashboard
            </Link>
            <Link
              to="/register/worker"
              className="bg-indigo-900 text-white border border-indigo-400 font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-indigo-950 transition"
            >
              Register as Worker
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
