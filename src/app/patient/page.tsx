'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, ShieldCheck, ArrowRight } from 'lucide-react';

export default function PatientLogin() {
  const router = useRouter();
  const [idType, setIdType] = useState('Aadhaar');
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      alert('Please enter your identification number');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/patient/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_type: idType, identifier: identifier })
      });

      const data = await response.json();
      localStorage.setItem('patient_session', JSON.stringify(data));
      router.push('/patient/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      alert('Failed to connect to backend server. Make sure FastAPI is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-white text-slate-900">
      
      {/* Left Branding Panel (Dark Green Theme matching reference) */}
      <div className="md:w-1/2 bg-[#063b2d] text-white p-10 md:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Background decorative leaf / circles effect */}
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#0a4d3a] rounded-full blur-2xl pointer-events-none opacity-50"></div>
        
        <div className="relative z-10">
          <div className="p-3 bg-[#0d5c44] border border-[#147a5b] rounded-2xl w-fit text-emerald-400 mb-6 shadow-inner">
            <Leaf size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">ArogyaKiosk</h1>
          <p className="text-emerald-300 font-medium text-sm md:text-base">Your health, rooted in care</p>
        </div>

        <div className="relative z-10 space-y-4 my-auto py-12">
          <h2 className="text-3xl md:text-4xl font-extrabold">Welcome back.</h2>
          <p className="text-emerald-100/70 text-sm md:text-base max-w-md leading-relaxed">
            Log in to review your consultations, track symptoms, and pick up your case where you left off.
          </p>
        </div>

        <div className="relative z-10 pt-6 border-t border-emerald-900/60 flex items-center space-x-2 text-xs text-emerald-300/60">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>Secured with ABHA Interoperability Standard</span>
        </div>
      </div>

      {/* Right Login Form Panel (Clean White Style) */}
      <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Log in to your account</h2>
            <p className="text-sm text-slate-500 mt-1">Enter your details to access your dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Select ID Type
              </label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900 text-sm cursor-pointer"
              >
                <option value="Aadhaar">Aadhaar Card</option>
                <option value="Mobile">Mobile Number</option>
                <option value="VoterID">Voter ID / PAN</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Enter ID Number / Details
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g., 9876543210 or ABHA-1234"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-900 text-sm placeholder-slate-400 shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-[#063b2d] hover:bg-[#0a4d3a] text-white font-bold rounded-xl shadow-lg shadow-emerald-900/10 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{loading ? 'Verifying...' : 'Log in'}</span>
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-4">
            Don't have an account? <span className="text-emerald-700 font-semibold cursor-pointer hover:underline">Create one at the kiosk</span>
          </div>
        </div>
      </div>

    </div>
  );
}