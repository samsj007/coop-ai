import React, { useState, useEffect } from 'react';
import {
  Shield, ShieldCheck, CheckCircle2, TrendingUp, RefreshCw, Check
} from 'lucide-react';
import { api } from '../api/client';
import type { WorkerProfile, Booking, DemandIntelligence } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { VerifiedBadge } from '../components/VerifiedBadge';
import { CommunityDemandRadar } from '../components/CommunityDemandRadar';

export const AdminDashboard: React.FC = () => {
  const [pendingWorkers, setPendingWorkers] = useState<WorkerProfile[]>([]);
  const [allWorkers, setAllWorkers] = useState<WorkerProfile[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [demandIntel, setDemandIntel] = useState<DemandIntelligence | null>(null);
  const [activeTab, setActiveTab] = useState<'verification' | 'workers' | 'bookings' | 'intelligence'>('verification');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const pending = await api.getPendingWorkers();
      setPendingWorkers(pending);

      const workers = await api.getWorkers();
      setAllWorkers(workers);

      const bookings = await api.getAllBookingsAdmin();
      setAllBookings(bookings);

      const intel = await api.getDemandIntelligence();
      setDemandIntel(intel);
    } catch (e) {
      console.error('Failed to load admin data', e);
    }
  };

  const handleVerifyAction = async (workerId: string, action: 'APPROVE' | 'REJECT' | 'REQUEST_INFO') => {
    try {
      await api.adminVerifyWorker(workerId, action);
      alert(`Worker ${workerId} verification action '${action}' recorded.`);
      loadAdminData();
    } catch (e) {
      alert('Action failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-bold px-3 py-1 rounded-full mb-2">
              <Shield className="w-3.5 h-3.5" /> Secure Admin Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              COOP AI Verification & Cooperative Intelligence
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Multi-level worker verification, job monitoring, and fairshare demand analytics.
            </p>
          </div>

          <button
            onClick={loadAdminData}
            className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
          </button>
        </div>

        {/* ADMIN STATS SUMMARY */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Pending Verifications</span>
            <span className="text-2xl font-black text-amber-600">{pendingWorkers.length} Pending</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Verified Workers</span>
            <span className="text-2xl font-black text-emerald-600">{allWorkers.filter(w => w.verification_status === 'APPROVED').length} Active</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">FairShare Balance Index</span>
            <span className="text-2xl font-black text-indigo-600">{demandIntel?.overview.fairshare_balance_index || 92.5}%</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Welfare Fund Pool</span>
            <span className="text-2xl font-black text-purple-600">₹{demandIntel?.overview.cooperative_welfare_fund_inr.toLocaleString() || '14,850'}</span>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-slate-200 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('verification')}
            className={`pb-3 px-4 border-b-2 transition ${
              activeTab === 'verification'
                ? 'border-purple-600 text-purple-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Worker Verification Queue ({pendingWorkers.length})
          </button>
          <button
            onClick={() => setActiveTab('intelligence')}
            className={`pb-3 px-4 border-b-2 transition ${
              activeTab === 'intelligence'
                ? 'border-purple-600 text-purple-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Cooperative Demand Intelligence
          </button>
          <button
            onClick={() => setActiveTab('workers')}
            className={`pb-3 px-4 border-b-2 transition ${
              activeTab === 'workers'
                ? 'border-purple-600 text-purple-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Worker Directory ({allWorkers.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 px-4 border-b-2 transition ${
              activeTab === 'bookings'
                ? 'border-purple-600 text-purple-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            All Service Bookings ({allBookings.length})
          </button>
        </div>

        {/* TAB 1: WORKER VERIFICATION QUEUE */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-slate-900">Multi-Level Worker Verification Dashboard</h2>

            {pendingWorkers.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-500 text-xs border border-slate-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                All service provider applications have been verified and processed!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingWorkers.map((w) => (
                  <div key={w.worker_id} className="bg-white rounded-3xl p-6 border border-amber-200 shadow-md space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={w.profile_photo || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80'}
                          alt={w.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                        />
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-base">{w.name}</h3>
                          <p className="text-xs text-indigo-600 font-semibold">{w.skills.join(', ')}</p>
                          <p className="text-xs text-slate-500">{w.city}, {w.state} ({w.phone})</p>
                        </div>
                      </div>

                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                        {w.verification_status}
                      </span>
                    </div>

                    {/* Multi-Level Inspection Details */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Years Experience:</span>
                        <span className="font-bold">{w.years_experience} Years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">ID Document Type:</span>
                        <span className="font-bold">{w.id_type || 'Aadhaar Card'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Address:</span>
                        <span className="font-bold">{w.address}</span>
                      </div>
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleVerifyAction(w.worker_id, 'APPROVE')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl shadow transition flex items-center justify-center gap-1"
                      >
                        <ShieldCheck className="w-4 h-4" /> Approve & Grant Verified Badge
                      </button>

                      <button
                        type="button"
                        onClick={() => handleVerifyAction(w.worker_id, 'REJECT')}
                        className="bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs px-3 py-2.5 rounded-xl"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COOPERATIVE DEMAND INTELLIGENCE */}
        {activeTab === 'intelligence' && (
          <div className="space-y-8">
            <CommunityDemandRadar />

            <h2 className="text-lg font-black text-slate-900 pt-4 border-t border-slate-200">
              Demand Intelligence & Skill Shortage Analytics
            </h2>


            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Service Demand Trends */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" /> High Demand Services & Growth Rate
                </h3>

                <div className="space-y-3">
                  {demandIntel?.demand_trends.map((dt) => (
                    <div key={dt.service} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-extrabold text-slate-900 text-sm">{dt.service}</span>
                        <p className="text-slate-500">{dt.demand_count} Service Requests</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="bg-indigo-100 text-indigo-800 font-extrabold px-3 py-1 rounded-full">
                          {dt.growth}
                        </span>
                        {dt.shortage_alert && (
                          <span className="bg-red-100 text-red-700 font-bold px-2.5 py-1 rounded-full animate-pulse">
                            Shortage Alert
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cooperative AI System Insights */}
              <div className="lg:col-span-5 bg-indigo-950 text-white rounded-3xl p-6 border border-indigo-800 space-y-4">
                <h3 className="text-base font-bold text-amber-300">Cooperative Impact Summary</h3>
                <ul className="space-y-3 text-xs leading-relaxed text-indigo-100">
                  {demandIntel?.insights.map((ins, idx) => (
                    <li key={idx} className="bg-indigo-900/60 p-3 rounded-xl border border-indigo-700/50 flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{ins}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WORKER DIRECTORY */}
        {activeTab === 'workers' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-900">All Registered Service Providers</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 uppercase text-[10px] font-bold text-slate-500">
                  <tr>
                    <th className="p-3">Worker ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Skills</th>
                    <th className="p-3">City</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3">Completed Jobs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allWorkers.map((w) => (
                    <tr key={w.worker_id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-indigo-600">{w.worker_id}</td>
                      <td className="p-3 font-bold text-slate-900">{w.name}</td>
                      <td className="p-3">{w.skills.join(', ')}</td>
                      <td className="p-3">{w.city}</td>
                      <td className="p-3">
                        <VerifiedBadge status={w.verification_status} identityVerified={w.identity_verified} skillVerified={w.skill_verified} />
                      </td>
                      <td className="p-3 font-bold text-amber-600">{w.rating} ★</td>
                      <td className="p-3 font-semibold">{w.completed_jobs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ALL BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-900">Platform Bookings Audit</h2>
            <div className="space-y-3">
              {allBookings.map((b) => (
                <div key={b.booking_id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-indigo-600">{b.booking_id}</span> — <strong className="text-slate-900">{b.service_category}</strong> ({b.issue_description})
                    <p className="text-slate-500">Customer: {b.customer_name} | Worker: {b.worker_name || b.worker_id}</p>
                  </div>
                  <span className="bg-indigo-100 text-indigo-800 font-extrabold px-3 py-1 rounded-full uppercase">
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};
