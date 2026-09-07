import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Power, CheckCircle2, MapPin,
  HeartHandshake, Navigation, Home, Play, Check, TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import type { WorkerProfile, Booking } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { VerifiedBadge } from '../components/VerifiedBadge';

export const WorkerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState<'AVAILABLE' | 'OFFLINE'>('AVAILABLE');

  useEffect(() => {
    if (user) {
      loadWorkerData();
    }
  }, [user]);

  const loadWorkerData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const wId = user.user_id || user.id;
      const wData = await api.getWorkerById(wId);
      setProfile(wData);
      setAvailability(wData.availability === 'OFFLINE' ? 'OFFLINE' : 'AVAILABLE');

      const bData = await api.getWorkerBookings(wId);
      setBookings(bData);
    } catch (e) {
      console.error('Failed to load worker data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    if (!profile) return;
    const nextAvail = availability === 'AVAILABLE' ? 'OFFLINE' : 'AVAILABLE';
    setAvailability(nextAvail);
    try {
      await api.toggleWorkerAvailability(profile.worker_id, nextAvail);
    } catch (e) {
      console.error('Failed to toggle availability', e);
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      await api.updateBookingStatus(bookingId, newStatus);
      loadWorkerData();
    } catch (e) {
      alert('Failed to update booking status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-xs font-semibold text-slate-500">
          Loading Service Provider Dashboard...
        </div>
      </div>
    );
  }

  const isPending = profile?.verification_status !== 'APPROVED';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Profile Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={profile?.profile_photo || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80'}
                alt={profile?.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
              />
              <div>
                <h1 className="text-2xl font-black">{profile?.name}</h1>
                <p className="text-xs text-slate-300 font-semibold">{profile?.skills.join(', ')} • {profile?.city}</p>
                <div className="mt-2">
                  <VerifiedBadge
                    status={profile?.verification_status || 'PENDING'}
                    identityVerified={profile?.identity_verified}
                    skillVerified={profile?.skill_verified}
                  />
                </div>
              </div>
            </div>

            {/* Availability Toggle */}
            <button
              onClick={handleToggleAvailability}
              className={`px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-lg transition ${
                availability === 'AVAILABLE'
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Power className="w-4 h-4" />
              {availability === 'AVAILABLE' ? 'ONLINE — Ready for Jobs' : 'OFFLINE'}
            </button>
          </div>
        </div>

        {/* VERIFICATION PENDING LOCK SCREEN */}
        {isPending && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-8 text-center space-y-4 shadow-md">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-amber-900">Verification Pending</h2>
            <p className="text-xs text-amber-800 max-w-xl mx-auto leading-relaxed">
              Your government ID proof and trade skill certificates are currently under review by the COOP AI Admin Committee. To maintain high safety for households, unverified workers cannot accept job requests.
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-200/60 text-amber-900 text-xs font-extrabold px-4 py-2 rounded-xl">
              Status: {profile?.verification_status} — Admin Action Required
            </div>
          </div>
        )}

        {/* WORKER METRICS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Total Earnings</span>
            <span className="text-2xl font-black text-slate-900">₹{profile?.earnings.toLocaleString()}</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Rating</span>
            <span className="text-2xl font-black text-amber-600">{profile?.rating} ★</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Completed Jobs</span>
            <span className="text-2xl font-black text-indigo-600">{profile?.completed_jobs}</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Current Workload</span>
            <span className="text-2xl font-black text-emerald-600">{profile?.current_workload} Active</span>
          </div>
        </div>

        {/* INCOMING & ACTIVE JOB REQUESTS */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-6">
          <h2 className="text-lg font-black text-slate-900 flex items-center justify-between border-b pb-3">
            <span>Incoming Service Requests & Active Work</span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {bookings.length} Total
            </span>
          </h2>

          {bookings.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No active job requests right now. Ensure your status is set to ONLINE to receive nearby FairShare assignments!
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.booking_id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
                        {b.booking_id}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base mt-1">
                        {b.service_category} — {b.issue_description}
                      </h3>
                      <p className="text-xs text-slate-600">Customer: {b.customer_name} ({b.customer_phone})</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600" /> {b.service_address}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="font-extrabold text-emerald-700 text-base">₹{b.estimated_amount}</span>
                      <p className="text-xs text-slate-500 font-bold uppercase">{b.status}</p>
                    </div>
                  </div>

                  {/* WORKER LIFECYCLE CONTROLS */}
                  {isPending ? (
                    <p className="text-xs text-amber-700 font-bold">
                      Account verification pending. You cannot perform job actions yet.
                    </p>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      {b.status === 'REQUESTED' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(b.booking_id, 'ACCEPTED')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow flex items-center gap-1"
                          >
                            <Check className="w-4 h-4" /> Accept Job
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(b.booking_id, 'CANCELLED')}
                            className="bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs px-4 py-2.5 rounded-xl"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {b.status === 'ACCEPTED' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(b.booking_id, 'ON_THE_WAY')}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow flex items-center gap-1.5"
                        >
                          <Navigation className="w-4 h-4" /> Start Trip (On The Way)
                        </button>
                      )}

                      {b.status === 'ON_THE_WAY' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(b.booking_id, 'ARRIVED')}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow flex items-center gap-1.5"
                        >
                          <Home className="w-4 h-4" /> I Have Arrived at Location
                        </button>
                      )}

                      {b.status === 'ARRIVED' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(b.booking_id, 'IN_PROGRESS')}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow flex items-center gap-1.5"
                        >
                          <Play className="w-4 h-4" /> Start Service Work
                        </button>
                      )}

                      {b.status === 'IN_PROGRESS' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(b.booking_id, 'COMPLETED')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Complete Service Job
                        </button>
                      )}

                      {b.status === 'COMPLETED' && (
                        <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Service Completed & Payment Received
                        </span>
                      )}
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>

        {/* DEMAND NEAR YOU INSIGHT */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md border border-indigo-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
            <TrendingUp className="w-4 h-4" />
            <span>Demand Near You (Community Radar)</span>
          </div>
          <p className="text-xs text-slate-200 font-medium">
            {profile?.skills?.[0] || 'Electrical'} services are showing increasing demand in {profile?.city || 'Chennai'} high-demand areas like Anna Nagar & Velachery. Keep your status ONLINE to receive automated FairShare job dispatches!
          </p>
        </div>

        {/* COOPERATIVE WELFARE & INSIGHTS */}
        <div className="bg-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-indigo-800 space-y-3">
          <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5" /> Cooperative Welfare Fund & Dividend Support
          </h3>
          <p className="text-xs text-indigo-200 leading-relaxed">
            As a COOP AI service provider, 5% of platform surpluses are allocated to your worker healthcare pool, emergency insurance, and annual cooperative dividends.
          </p>
        </div>

      </main>

      <Footer />
    </div>
  );
};

