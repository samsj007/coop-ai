import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, MapPin, Bot, Clock, CheckCircle2, ArrowRight, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import type { ParsedService, ScoredWorker, Booking } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MapView } from '../components/MapView';
import { VerifiedBadge } from '../components/VerifiedBadge';
import { FairShareScoreCard } from '../components/FairShareScoreCard';
import { ServiceTrackingStepper } from '../components/ServiceTrackingStepper';
import { AIChatAssistantModal } from '../components/AIChatAssistantModal';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Natural Language Input State
  const [naturalInput, setNaturalInput] = useState('My kitchen tap is leaking and I need a plumber today.');
  const [city, setCity] = useState('Bengaluru');
  const [lat, setLat] = useState(12.9716);
  const [lng, setLng] = useState(77.5946);

  const [parsing, setParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedService | null>(null);
  const [scoredWorkers, setScoredWorkers] = useState<ScoredWorker[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<ScoredWorker | null>(null);

  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [historyBookings, setHistoryBookings] = useState<Booking[]>([]);

  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;
    try {
      const data = await api.getCustomerBookings(user.id);
      setActiveBookings(data.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED'));
      setHistoryBookings(data.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED'));
    } catch (e) {
      console.error('Failed to load bookings', e);
    }
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          alert(`Location set to your current GPS position (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        },
        () => {
          alert('Unable to retrieve location. Defaulting to city center.');
        }
      );
    }
  };

  const handleAnalyzeAndFindWorkers = async () => {
    if (!naturalInput.trim()) return;
    setParsing(true);
    try {
      const parsed = await api.parseNaturalLanguage(naturalInput, city, lat, lng);
      setParsedResult(parsed);

      const workers = await api.allocateFairShare(
        parsed.service_category,
        parsed.urgency,
        lat,
        lng
      );
      setScoredWorkers(workers);
      if (workers.length > 0) {
        setSelectedWorker(workers[0]);
      }
    } catch (err) {
      alert('Failed to analyze request. Please try again.');
    } finally {
      setParsing(false);
    }
  };

  const handleBookNow = (scoredW: ScoredWorker) => {
    if (!parsedResult) return;
    navigate('/book', {
      state: {
        worker: scoredW.worker,
        parsedService: parsedResult,
        matchScore: scoredW.total_match_score,
        distanceKm: scoredW.distance_km,
        customerLat: lat,
        customerLng: lng,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Header Greeting */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> Customer Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                How can we help you today, {user?.name}?
              </h1>
              <p className="text-slate-300 text-xs mt-1">
                Enter your household issue in natural words or chat with COOP AI Assistant.
              </p>
            </div>

            <button
              onClick={() => setIsAssistantOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 transition"
            >
              <Bot className="w-4 h-4" /> AI Request Assistant
            </button>
          </div>
        </div>

        {/* AI NATURAL LANGUAGE SERVICE REQUEST BOX */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-indigo-600" /> Describe Your Household Service Problem
          </h2>

          <div className="space-y-4">
            <div className="relative">
              <textarea
                rows={3}
                value={naturalInput}
                onChange={(e) => setNaturalInput(e.target.value)}
                placeholder="e.g. My kitchen tap is leaking and I need a plumber today..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-transparent focus:outline-none font-bold text-slate-800"
                  >
                    {['Bengaluru', 'Chennai', 'Hyderabad', 'Mumbai', 'Delhi', 'Pune', 'Kolkata', 'Ahmedabad', 'Coimbatore', 'Madurai', 'Trichy'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5" /> Use My GPS Location
                </button>
              </div>

              <button
                type="button"
                onClick={handleAnalyzeAndFindWorkers}
                disabled={parsing}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm px-6 py-3 rounded-2xl shadow-md flex items-center gap-2 transition disabled:opacity-50"
              >
                {parsing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Request...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Analyze Request & Match Workers
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* AI UNDERSTANDING & MATCH RESULTS */}
        {parsedResult && (
          <div className="space-y-6">
            
            {/* Structured AI Understanding Box */}
            <div className="bg-indigo-950 text-white p-6 rounded-3xl shadow-xl border border-indigo-800 space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-800 pb-3">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-amber-300" /> AI Natural Language Service Understanding
                </span>
                {parsedResult.demo_mode && (
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded border border-amber-500/40">
                    NLP Rule Engine Fallback
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-indigo-900/60 p-3 rounded-xl border border-indigo-700/50">
                  <span className="text-indigo-300 block mb-1">Service Category</span>
                  <span className="font-black text-sm text-amber-300">{parsedResult.service_category}</span>
                </div>
                <div className="bg-indigo-900/60 p-3 rounded-xl border border-indigo-700/50">
                  <span className="text-indigo-300 block mb-1">Identified Problem</span>
                  <span className="font-bold text-white">{parsedResult.issue}</span>
                </div>
                <div className="bg-indigo-900/60 p-3 rounded-xl border border-indigo-700/50">
                  <span className="text-indigo-300 block mb-1">Urgency Level</span>
                  <span className={`font-black uppercase ${parsedResult.urgency === 'High' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {parsedResult.urgency}
                  </span>
                </div>
                <div className="bg-indigo-900/60 p-3 rounded-xl border border-indigo-700/50">
                  <span className="text-indigo-300 block mb-1">Preferred Timing</span>
                  <span className="font-bold text-white">{parsedResult.preferred_date}</span>
                </div>
              </div>

              <p className="text-xs text-indigo-200 italic">
                "{parsedResult.ai_explanation}"
              </p>
            </div>

            {/* RECOMMENDED WORKERS & MAP */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Workers List */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center justify-between">
                  <span>Top FairShare Recommended Workers</span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2.5 py-1 rounded-full">
                    {scoredWorkers.length} Found
                  </span>
                </h3>

                {scoredWorkers.map((sw) => {
                  const isSelected = selectedWorker?.worker.worker_id === sw.worker.worker_id;

                  return (
                    <div
                      key={sw.worker.worker_id}
                      onClick={() => setSelectedWorker(sw)}
                      className={`bg-white rounded-3xl p-5 border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 ring-2 ring-indigo-100 shadow-xl'
                          : 'border-slate-200 hover:border-indigo-300 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={sw.worker.profile_photo || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80'}
                            alt={sw.worker.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                          />
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-base">{sw.worker.name}</h4>
                            <p className="text-xs text-slate-500">{sw.worker.city}, {sw.worker.state}</p>
                            <div className="mt-1">
                              <VerifiedBadge status={sw.worker.verification_status} identityVerified={sw.worker.identity_verified} skillVerified={sw.worker.skill_verified} />
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="bg-indigo-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow">
                            {sw.total_match_score}% Match
                          </span>
                          <p className="text-xs text-slate-500 mt-1.5 font-bold">{sw.distance_km} km away</p>
                        </div>
                      </div>

                      {/* 7-Factor Score Breakdown */}
                      <FairShareScoreCard scoredWorker={sw} />

                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="text-xs text-slate-600">
                          <span className="font-bold text-slate-900">{sw.worker.rating} ★</span> ({sw.worker.completed_jobs} jobs) • Workload: {sw.worker.current_workload} active
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookNow(sw);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow transition flex items-center gap-1"
                        >
                          Book Service Now <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Map View */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-lg font-black text-slate-900">Service Area Map</h3>
                <MapView
                  centerLat={lat}
                  centerLng={lng}
                  workers={scoredWorkers.map(s => s.worker)}
                  selectedWorkerId={selectedWorker?.worker.worker_id}
                  onWorkerSelect={(w) => {
                    const match = scoredWorkers.find(sw => sw.worker.worker_id === w.worker_id);
                    if (match) setSelectedWorker(match);
                  }}
                  height="460px"
                />
              </div>

            </div>
          </div>
        )}

        {/* ACTIVE & UPCOMING BOOKINGS */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" /> Active Service Bookings
            </h2>
            <button onClick={loadBookings} className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {activeBookings.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No active bookings. Submit a natural language service request above to book a verified worker!
            </div>
          ) : (
            <div className="space-y-4">
              {activeBookings.map((b) => (
                <div key={b.booking_id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
                        {b.booking_id}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-sm mt-1">
                        {b.service_category} — {b.issue_description}
                      </h3>
                      <p className="text-xs text-slate-500">Worker: {b.worker_name || 'Assigned Worker'}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="font-extrabold text-emerald-700 text-sm">₹{b.estimated_amount}</span>
                      <p className="text-[11px] text-slate-400 font-semibold">{b.scheduled_date} • {b.scheduled_time}</p>
                    </div>
                  </div>

                  {/* Stepper showing live progress */}
                  <ServiceTrackingStepper status={b.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SERVICE HISTORY */}
        {historyBookings.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Completed Service History
            </h2>
            <div className="space-y-3">
              {historyBookings.map((hb) => (
                <div key={hb.booking_id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{hb.service_category}</span>
                    <p className="text-slate-500">{hb.issue_description} ({hb.scheduled_date})</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* AI Assistant Chat Modal */}
      <AIChatAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onSelectSuggestedService={(service, issue) => {
          setNaturalInput(`I need ${service} for: ${issue}`);
          setIsAssistantOpen(false);
        }}
      />

      <Footer />
    </div>
  );
};
