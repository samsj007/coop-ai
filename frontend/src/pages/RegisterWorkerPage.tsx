import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Upload, ArrowRight, ArrowLeft, ShieldAlert, Award } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const ALL_SKILLS = [
  'Plumbing', 'Electrical', 'Carpentry', 'Cleaning', 'Painting',
  'AC Service', 'Appliance Repair', 'Gardening', 'Mason', 'Tutoring'
];

export const RegisterWorkerPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('123456');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pinCode, setPinCode] = useState('560038');

  const [skills, setSkills] = useState<string[]>(['Plumbing']);
  const [yearsExperience, setYearsExperience] = useState(5.0);
  const [previousWorkDesc, setPreviousWorkDesc] = useState('');

  const [idType, setIdType] = useState('Aadhaar Card');
  const [bankAccountName, setBankAccountName] = useState('');
  const [upiId, setUpiId] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleFinalSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const user = await api.registerWorker({
        full_name: fullName || 'New Provider Candidate',
        mobile: mobile || '+91 98765 00000',
        otp,
        email: email || `worker.${Date.now()}@coopai.demo`,
        password: password || 'demo123',
        profile_photo: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
        address: address || 'Indiranagar 100ft road',
        city,
        state,
        pin_code: pinCode,
        latitude: 12.9716,
        longitude: 77.5946,
        skills,
        years_experience: Number(yearsExperience),
        previous_work_description: previousWorkDesc || 'Experienced service provider',
        id_type: idType,
        id_document_url: 'https://example.com/demo-id.pdf',
        certificate_url: 'https://example.com/demo-cert.pdf',
        bank_account_name: bankAccountName || 'Demo Bank Account',
        upi_id: upiId || 'demo@upi'
      });

      login(user);
      navigate('/worker');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Step Indicator Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span>Step {step} of 8</span>
            <span className="text-indigo-600 uppercase font-extrabold">
              {step === 1 && 'Basic Information'}
              {step === 2 && 'Address & Location'}
              {step === 3 && 'Skill Selection'}
              {step === 4 && 'Experience'}
              {step === 5 && 'ID Verification'}
              {step === 6 && 'Skill Verification'}
              {step === 7 && 'Payment Details'}
              {step === 8 && 'Final Review & Submit'}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${(step / 8) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8">
          
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 border-b pb-2">Step 1 — Basic Information</h3>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Demo Mobile OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-amber-50 border border-amber-300 font-mono text-center font-bold text-xs"
                  />
                  <span className="text-[10px] text-amber-700 block mt-1">DEMO OTP mode active (123456)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@coopai.demo"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Address & India-Wide Location */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 border-b pb-2">Step 2 — Address & Location (India-Wide)</h3>
              <p className="text-xs text-slate-500">COOP AI operates across all Indian cities.</p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Door No, Street, Area"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {['Bengaluru', 'Chennai', 'Hyderabad', 'Mumbai', 'Delhi', 'Pune', 'Kolkata', 'Ahmedabad', 'Coimbatore', 'Madurai', 'Trichy'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Skills */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 border-b pb-2">Step 3 — Select Your Skills</h3>
              <p className="text-xs text-slate-500">You can select multiple skills.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                {ALL_SKILLS.map((skill) => {
                  const selected = skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`p-3 rounded-xl text-xs font-bold border transition flex items-center justify-between ${
                        selected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <span>{skill}</span>
                      {selected && <Check className="w-4 h-4 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Experience */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 border-b pb-2">Step 4 — Experience & Work History</h3>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Years of Experience</label>
                <input
                  type="number"
                  step="0.5"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Previous Work Description</label>
                <textarea
                  rows={4}
                  value={previousWorkDesc}
                  onChange={(e) => setPreviousWorkDesc(e.target.value)}
                  placeholder="Describe your previous experience, major projects, and service background..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          )}

          {/* STEP 5: ID Verification */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 border-b pb-2">Step 5 — Identity Verification Upload</h3>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Government Approved ID Type</label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Aadhaar Card">Aadhaar Card</option>
                  <option value="PAN Card">PAN Card</option>
                  <option value="Voter ID">Voter ID</option>
                  <option value="Driving License">Driving License</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50">
                <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Upload {idType} Document Image / PDF</p>
                <p className="text-[11px] text-slate-500 mt-1">Prototype Upload Simulated</p>
              </div>
            </div>
          )}

          {/* STEP 6: Skill Verification */}
          {step === 6 && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 border-b pb-2">Step 6 — Skill Certificate & Qualification</h3>
              <div className="border-2 border-dashed border-purple-200 rounded-2xl p-6 text-center bg-purple-50/50">
                <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-purple-900">Upload Trade Certificate / ITI / Skill Qualification</p>
                <p className="text-[11px] text-purple-700 mt-1">Proof of technical proficiency</p>
              </div>
            </div>
          )}

          {/* STEP 7: Payment Details */}
          {step === 7 && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 border-b pb-2">Step 7 — Bank / UPI Payout Account</h3>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Account Holder Name</label>
                <input
                  type="text"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  placeholder="Name as per bank account"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">UPI ID for Direct Payouts</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@upi"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          )}

          {/* STEP 8: Final Review & Submit */}
          {step === 8 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Submit Application for Admin Review</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                After submission, your account status will be set to <strong>"Verification Pending"</strong>. You will be able to log in, but cannot accept customer job requests until Admin approves your identity and skill documents.
              </p>

              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg transition"
              >
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </div>
          )}

          {/* Step Controls */}
          {step < 8 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-xs font-extrabold shadow flex items-center gap-1.5 ml-auto"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
};
