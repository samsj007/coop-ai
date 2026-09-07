import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { WorkerProfile, ParsedService } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { VerifiedBadge } from '../components/VerifiedBadge';

export const ServiceBookingPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = location.state as {
    worker: WorkerProfile;
    parsedService: ParsedService;
    matchScore: number;
    distanceKm: number;
    customerLat: number;
    customerLng: number;
  };

  const [date, setDate] = useState('2026-09-06');
  const [time, setTime] = useState('10:00 AM');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState('');

  if (!stateData || !stateData.worker) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-center text-xs font-semibold text-slate-500">
          No service selected. Please return to Customer Dashboard.
        </div>
      </div>
    );
  }

  const { worker, parsedService, matchScore, distanceKm } = stateData;
  const estimatedAmount = parsedService.urgency === 'High' ? 650 : 450;

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.createBooking({
        customer_id: user?.id || 'USR-CUST-1',
        customer_name: user?.name || 'Siddharth Roy',
        customer_phone: '+91 98888 77777',
        worker_id: worker.worker_id,
        service_category: parsedService.service_category,
        issue_description: parsedService.issue,
        urgency: parsedService.urgency,
        service_address: `${worker.city} Customer Residence`,
        latitude: stateData.customerLat || 12.9716,
        longitude: stateData.customerLng || 77.5946,
        scheduled_date: date,
        scheduled_time: time,
        estimated_amount: estimatedAmount,
        payment_method: paymentMethod,
      });

      setBookingId(res.booking_id);
      setBookingComplete(true);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

    } catch (err: any) {
      alert(err.response?.data?.detail || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8 flex-1 w-full">
        <button
          onClick={() => navigate('/customer')}
          className="text-xs font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {bookingComplete ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Service Booked Successfully!</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Booking ID: <strong className="text-indigo-600 font-mono text-sm">{bookingId}</strong>. Your request has been assigned to verified provider <strong>{worker.name}</strong>.
            </p>

            <div className="pt-4">
              <button
                onClick={() => navigate('/customer')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-8 py-3 rounded-xl shadow"
              >
                Track Live Booking Progress
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-indigo-900 text-white p-6">
              <h2 className="text-2xl font-black">Confirm & Book Service</h2>
              <p className="text-xs text-indigo-200 mt-1">COOP AI Verified Service Booking</p>
            </div>

            <form onSubmit={handleConfirmBooking} className="p-6 sm:p-8 space-y-6">
              {/* Selected Worker Info */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={worker.profile_photo || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80'}
                    alt={worker.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{worker.name}</h4>
                    <p className="text-xs text-slate-500">{worker.city} • {worker.rating} ★</p>
                    <VerifiedBadge status={worker.verification_status} identityVerified={worker.identity_verified} skillVerified={worker.skill_verified} />
                  </div>
                </div>

                <div className="text-right">
                  <span className="bg-indigo-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full">
                    {matchScore}% FairShare Match
                  </span>
                  <p className="text-[11px] text-slate-500 font-bold mt-1">{distanceKm} km away</p>
                </div>
              </div>

              {/* Service Summary */}
              <div className="space-y-2 border-b border-slate-200 pb-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Category:</span>
                  <span className="font-bold text-slate-900">{parsedService.service_category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Specific Issue:</span>
                  <span className="font-bold text-slate-900">{parsedService.issue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Urgency Level:</span>
                  <span className="font-bold text-red-600 uppercase">{parsedService.urgency}</span>
                </div>
              </div>

              {/* Schedule Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Time Slot</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Simulated Payment Gateway Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Payment Simulation Method</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['UPI', 'Credit/Debit Card', 'Cash on Completion'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 rounded-xl font-bold border transition text-center ${
                        paymentMethod === method
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between text-emerald-900 text-xs">
                <div>
                  <span className="font-bold text-sm block">Estimated Service Amount</span>
                  <span className="text-[11px] text-emerald-700">Includes cooperative fair worker wage</span>
                </div>
                <span className="text-2xl font-black">₹{estimatedAmount}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg transition"
              >
                {loading ? 'Processing Booking...' : 'Confirm & Reserve Service Provider'}
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
