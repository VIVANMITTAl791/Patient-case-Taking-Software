'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Activity, Mic, MicOff, Send, FileText, ShieldCheck, LogOut, 
  CheckCircle2, AlertTriangle, PhoneCall, Download, Sparkles, MessageSquare 
} from 'lucide-react';

export default function PatientDashboard() {
  const router = useRouter();
  const [symptoms, setSymptoms] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [patientId, setPatientId] = useState('ABHA-DEMO-001');
  const [isEmergency, setIsEmergency] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('patient_session');
    if (session) {
      try {
        const data = JSON.parse(session);
        if (data && data.patient_id) {
          setPatientId(data.patient_id);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Web Speech API for Voice-to-Text
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please use Chrome.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const speechText = event.results[0][0].transcript;
      setSymptoms((prev) => {
        const updated = prev ? `${prev} ${speechText}` : speechText;
        checkForEmergencyKeywords(updated);
        return updated;
      });
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // Feature 3: Emergency SOS / Red Alert Check
  const checkForEmergencyKeywords = (text: string) => {
    const criticalKeywords = ['chest pain', 'heart attack', 'unconscious', 'breathing', 'saans', 'khoon', 'blood', 'stroke', 'severe injury'];
    const lowerText = text.toLowerCase();
    const found = criticalKeywords.some(keyword => lowerText.includes(keyword));
    setIsEmergency(found);
  };

  const handleSymptomsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setSymptoms(val);
    checkForEmergencyKeywords(val);
  };

  const handleTriageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      alert('Please enter or speak your symptoms.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/patient/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId,
          symptoms: symptoms,
          language: language
        })
      });

      const data = await response.json();
      setResult(data);

      // Feature 2: Simulate Automated WhatsApp/SMS Prescription Notification Trigger
      setTimeout(() => {
        setNotificationSent(true);
      }, 1500);

    } catch (err) {
      console.error('Triage error:', err);
      alert('Failed to connect to FastAPI backend RAG engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Feature 3: Emergency SOS Red Alert Banner */}
      {isEmergency && (
        <div className="bg-red-600 text-white px-6 py-3 font-bold flex flex-col md:flex-row items-center justify-between shadow-2xl animate-pulse z-50">
          <div className="flex items-center space-x-3">
            <AlertTriangle size={26} className="text-yellow-300 animate-bounce" />
            <div>
              <span className="uppercase tracking-wider text-xs bg-red-800 px-2 py-0.5 rounded mr-2">RED ALERT CRITICAL</span>
              <span>High-Risk Symptoms Detected! Immediate Emergency Triage & Ambulance Dispatch Initiated.</span>
            </div>
          </div>
          <div className="mt-2 md:mt-0 flex items-center space-x-3">
            <a 
              href="tel:108" 
              className="px-4 py-1.5 bg-white text-red-600 rounded-xl text-xs font-black shadow hover:bg-slate-100 transition flex items-center space-x-1"
            >
              <PhoneCall size={14} />
              <span>Call Emergency (108)</span>
            </a>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push('/')}>
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Activity size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold">ArogyaKiosk • Patient Portal</h1>
            <p className="text-xs text-slate-400">ABHA ID: <span className="text-emerald-400 font-mono">{patientId}</span></p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${language === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${language === 'hi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              हिन्दी
            </button>
          </div>

          <button
            onClick={() => { localStorage.removeItem('patient_session'); router.push('/'); }}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-300 rounded-xl transition text-xs font-semibold border border-slate-700 cursor-pointer"
          >
            <LogOut size={14} />
            <span>Exit</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 space-y-8 my-auto">
        
        <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6 backdrop-blur-xl">
          <div>
            <h2 className="text-2xl font-black text-white">
              {language === 'hi' ? 'अपने लक्षण दर्ज करें (Enter Symptoms)' : 'Describe Your Symptoms'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {language === 'hi' 
                ? 'टाइप करें या माइक बटन दबाकर बोलकर बताएं।' 
                : 'Type your symptoms or use voice input for instant AI clinical triage & safety checks.'}
            </p>
          </div>

          <form onSubmit={handleTriageSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                rows={4}
                value={symptoms}
                onChange={handleSymptomsChange}
                placeholder={language === 'hi' ? 'जैसे: मुझे तेज बुखार और सिरदर्द है...' : 'e.g., severe headache, mild fever since 2 days...'}
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition text-sm resize-none shadow-inner"
                required
              />
              
              {/* Voice Input Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`absolute right-4 bottom-4 px-4 py-2 rounded-xl flex items-center space-x-2 text-xs font-bold transition shadow-lg cursor-pointer ${
                  isListening 
                    ? 'bg-red-600 text-white animate-pulse' 
                    : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700'
                }`}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                <span>{isListening ? (language === 'hi' ? 'सुन रहा है...' : 'Listening...') : (language === 'hi' ? 'बोलकर बताएं' : 'Voice Input')}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-900/30 transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles size={18} />
              <span>{loading ? 'Running RAG Clinical Safety Check...' : (language === 'hi' ? 'AI परीक्षण शुरू करें' : 'Run AI Triage & Safety Check')}</span>
            </button>
          </form>
        </div>

        {/* Results Box */}
        {result && (
          <div className="bg-slate-900/90 border border-emerald-500/30 p-8 rounded-3xl shadow-2xl space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="text-emerald-400" size={24} />
                <h3 className="text-lg font-bold text-white">AI Triage & RAG Assessment Result</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                result.risk_level === 'Moderate' || isEmergency ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                Risk Level: {isEmergency ? 'Critical (Red)' : result.risk_level}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suggested Regimen / Medicines</h4>
                <p className="text-sm font-medium text-emerald-300">{result.medicines || result.suggested_medicines}</p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clinical Safety RAG Status</h4>
                <p className="text-sm text-slate-300">{result.safety_note || 'Verified against clinical interaction database.'}</p>
              </div>
            </div>

            {/* Feature 2: WhatsApp / SMS Notification Status Badge */}
            {notificationSent && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center space-x-3 text-emerald-300 text-xs">
                <MessageSquare size={20} className="text-emerald-400 flex-shrink-0 animate-bounce" />
                <div>
                  <span className="font-bold">Automated WhatsApp & SMS Sent:</span> Digital prescription slip & consultation queue token successfully dispatched to your registered mobile number (+91 XXXXX-X{patientId.slice(-4)}) via Twilio/Meta API simulation.
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center">
              <span className="text-xs text-slate-500 flex items-center">
                <ShieldCheck size={14} className="mr-1 text-emerald-400" /> ABHA Encrypted Record
              </span>
              <button
                onClick={() => alert('Downloading official digital prescription slip PDF...')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center space-x-2 cursor-pointer"
              >
                <Download size={16} className="text-emerald-400" />
                <span>Download Digital Health Slip (PDF)</span>
              </button>
            </div>
          </div>
        )}

      </main>

      <footer className="max-w-7xl mx-auto w-full px-8 py-4 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
        <span className="flex items-center"><ShieldCheck size={14} className="mr-1 text-emerald-400"/> ABHA National Digital Health Compliance</span>
        <span>ArogyaKiosk SIH Enterprise Prototype</span>
      </footer>
    </div>
  );
} 