'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, AlertTriangle, Activity, Send, LogOut } from 'lucide-react';

export default function PatientDashboard() {
  const router = useRouter();
  const [patientData, setPatientData] = useState<any>(null);
  const [symptoms, setSymptoms] = useState('');
  const [medicines, setMedicines] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem('patient_session');
    if (session) {
      setPatientData(JSON.parse(session));
    }
  }, []);

  const handleSafetyCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      alert('Please enter your symptoms');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/validate-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientData?.abha_id || 'ABHA-DEMO-001',
          symptoms: symptoms,
          medicines: medicines || 'None'
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('API Error:', err);
      alert('Failed to connect to AI Safety Backend. Make sure FastAPI server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('patient_session');
    router.push('/patient/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="bg-white shadow-sm rounded-xl p-6 mb-6 border border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ArogyaKiosk Patient Portal</h1>
            <p className="text-sm text-gray-600">
              ABHA ID: <span className="font-semibold text-indigo-600">{patientData?.abha_id || 'ABHA-DEMO-001'}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </button>
        </header>

        <div className="bg-white shadow-sm rounded-xl p-6 mb-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Activity className="mr-2 text-indigo-600" size={20} /> AI Symptom & Prescription Safety Checker
          </h2>
          <form onSubmit={handleSafetyCheck} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter Your Symptoms</label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g., High fever, body ache, dry cough for 2 days"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications (Optional)</label>
              <input
                type="text"
                value={medicines}
                onChange={(e) => setMedicines(e.target.value)}
                placeholder="e.g., Paracetamol, Cetirizine"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center justify-center shadow-md cursor-pointer"
            >
              {loading ? 'Analyzing with RAG & Saving to DB...' : <> <Send className="mr-2 h-4 w-4" /> Run AI Safety Check </>}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <ShieldCheck className="mr-2 text-green-600" size={22} /> Safety Analysis Result
              </h3>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                result.riskLevel === 'Moderate' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
              }`}>
                Risk Level: {result.riskLevel}
              </span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-amber-50 border-l-4 border-amber-500 text-amber-900 rounded-r-lg">
                <p className="font-semibold flex items-center"><AlertTriangle className="mr-1.5 h-4 w-4" /> Warning:</p>
                <p>{result.warning}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-blue-900">
                <p className="font-semibold">AI Recommendation:</p>
                <p>{result.recommendation}</p>
              </div>
            </div>
            <div className="pt-2 text-center text-xs text-green-600 font-medium">
              ✓ Successfully saved to Supabase! Now go to Doctor Dashboard and click Refresh.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}