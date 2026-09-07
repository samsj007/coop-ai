import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, ArrowLeft } from 'lucide-react';
import { api } from '../api/client';
import type { WorkerProfile } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { VerifiedBadge } from '../components/VerifiedBadge';

export const WorkerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getWorkerById(id)
        .then(setWorker)
        .catch(() => alert('Worker not found'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading || !worker) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-xs font-semibold text-slate-500">
          Loading Worker Profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-4">
              <img
                src={worker.profile_photo || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80'}
                alt={worker.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500 shadow"
              />
              <div>
                <h1 className="text-2xl font-black text-slate-900">{worker.name}</h1>
                <p className="text-xs text-indigo-600 font-semibold">{worker.skills.join(', ')}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" /> {worker.address}, {worker.city}, {worker.state}
                </p>
                <div className="mt-2">
                  <VerifiedBadge status={worker.verification_status} identityVerified={worker.identity_verified} skillVerified={worker.skill_verified} />
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-2xl font-black text-amber-600 flex items-center gap-1">
                <Star className="w-5 h-5 fill-current text-amber-500" /> {worker.rating}
              </span>
              <p className="text-xs text-slate-500 font-semibold">{worker.completed_jobs} Jobs Completed</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-slate-500 block">Years Experience</span>
              <span className="font-extrabold text-slate-900 text-sm">{worker.years_experience} Yrs</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-slate-500 block">Service Area</span>
              <span className="font-extrabold text-slate-900 text-sm">{worker.service_area}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-slate-500 block">Languages Spoken</span>
              <span className="font-extrabold text-slate-900 text-sm">{worker.languages.join(', ')}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-slate-500 block">Verification Status</span>
              <span className="font-extrabold text-emerald-600 text-sm">{worker.verification_status}</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
