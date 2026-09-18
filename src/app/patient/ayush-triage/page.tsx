'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, ShieldCheck, FileText, Upload, CheckCircle2, User, Stethoscope, Sun, Moon, LogOut, Mic, MicOff, Bot, Rocket, X, Send, ArrowRight, ArrowLeft, Globe, Volume2, Sparkles, WifiOff, Wifi, QrCode, Shield, Home as HomeIcon, FileText as FileTextIcon, Bell, BookOpen, PhoneCall } from 'lucide-react';

export default function PatientDashboard() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [fontSizeScale, setFontSizeScale] = useState(16);
  const [screenReaderActive, setScreenReaderActive] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);

  const [activeTab, setActiveTab] = useState<'triage' | 'vault' | 'history'>('triage');
  const [patientSession, setPatientSession] = useState<any>(null);

  // ABHA Health Locker Auto-Sync State
  const [abhaSynced, setAbhaSynced] = useState(true);
  const [abhaIdInput, setAbhaIdInput] = useState('');

  // Network & Offline Edge AI state
  const [isOnline, setIsOnline] = useState(true);

  // Language & Persistent Mode states
  const [lang, setLang] = useState<'en' | 'hi' | 'pa' | 'hr'>('en');
  const [interactionMode, setInteractionMode] = useState<'written' | 'voice'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('kiosk_mode') as 'written' | 'voice') || 'written';
    }
    return 'written';
  });

  // Triage Questionnaire states
  const [stream, setStream] = useState('Ayurveda');
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    primarySymptoms: '',
    duration: '',
    severity: 'Mild',
    lifestyle: '',
    allergies: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [vaultReports, setVaultReports] = useState<string[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);

  // Floating AI Assistant State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { sender: 'ai', text: 'Welcome to ArogyaKiosk! ABHA Health Locker and Voice Assistant are active.' }
  ]);

  const streamsList = [
    { id: 'Ayurveda', label: '🌿 Ayurveda', desc: 'Traditional herbal & holistic healing' },
    { id: 'Yoga', label: '🧘 Yoga & Naturopathy', desc: 'Natural elements & posture therapy' },
    { id: 'Unani', label: '🏺 Unani Medicine', desc: 'Greco-Arabic traditional balance' },
    { id: 'Siddha', label: '📜 Siddha System', desc: 'Ancient Tamil medicinal tradition' },
    { id: 'Homeopathy', label: '💧 Homeopathy', desc: 'Micro-dose constitutional care' },
    { id: 'Allopathy', label: '💊 Allopathy (Modern)', desc: 'Evidence-based modern medicine' }
  ];

  const t = {
    en: {
      portalTitle: "ArogyaKiosk • Patient Portal",
      tabTriage: "AI Triage",
      tabVault: "Medical Vault",
      tabHistory: "Saved History",
      title: "Smart Health Questionnaire",
      subtitle: "Select your preferred healthcare stream and mode",
      streamLabel: "Choose Healthcare Stream",
      q1: "1. What are your primary symptoms?",
      q2: "2. How long have you been experiencing this?",
      q3: "3. Severity Level",
      q4: "4. Any specific lifestyle or dietary habits?",
      q5: "5. Known allergies or prior medications?",
      next: "Next: General Questions",
      preview: "Preview Summary Report",
      back: "Back",
      submit: "Send Report to Doctor Queue"
    },
    hi: {
      portalTitle: "आरोग्यकिऑस्क • रोगी पोर्टल",
      tabTriage: "AI ट्राइएज",
      tabVault: "मेडिकल वॉल्ट",
      tabHistory: "सुरक्षित इतिहास",
      title: "स्मार्ट स्वास्थ्य प्रश्नावली",
      subtitle: "अपनी पसंदीदा स्वास्थ्य सेवा स्ट्रीम और मोड चुनें",
      streamLabel: "स्वास्थ्य सेवा स्ट्रीम चुनें",
      q1: "1. आपके मुख्य लक्षण क्या हैं?",
      q2: "2. आप कब से इस समस्या का अनुभव कर रहे हैं?",
      q3: "3. गंभीरता का स्तर",
      q4: "4. कोई विशिष्ट जीवनशैली या आहार संबंधी आदतें?",
      q5: "5. ज्ञात एलर्जी या पिछली दवाएं?",
      next: "अगला: सामान्य प्रश्न",
      preview: "सारांश रिपोर्ट देखें",
      back: "पीछे",
      submit: "डॉक्टर कतार में रिपोर्ट भेजें"
    },
    pa: {
      portalTitle: "ਆਰੋਗਿਆਕਿਓਸਕ • ਮਰੀਜ਼ ਪੋਰਟਲ",
      tabTriage: "AI ਟ੍ਰੀਏਜ",
      tabVault: "ਮੈਡੀਕਲ ਵੌਲਟ",
      tabHistory: "ਸੁਰੱਖਿਅਤ ਇਤਿਹਾਸ",
      title: "ਸਮਾਰਟ ਸਿਹਤ ਪ੍ਰਸ਼ਨਾਵਲੀ",
      subtitle: "ਆਪਣੀ ਪਸੰਦੀਦਾ ਸਿਹਤ ਸੰਭਾਲ ਸਟ੍ਰੀਮ ਚੁਣੋ",
      streamLabel: "ਸਿਹਤ ਸੰਭਾਲ ਸਟ੍ਰੀਮ ਚੁਣੋ",
      q1: "1. ਤੁਹਾਡੇ ਮੁੱਖ ਲੱਛਣ ਕੀ ਹਨ?",
      q2: "2. ਤੁਸੀਂ ਕਦੋਂ ਤੋਂ ਇਸ ਸਮੱਸਿਆ ਦਾ ਸਾਹਮਣਾ ਕਰ ਰਹੇ ਹੋ?",
      q3: "3. ਗੰਭੀਰਤਾ ਦਾ ਪੱਧਰ",
      q4: "4. ਕੋਈ ਖਾਸ ਜੀਵਨ ਸ਼ੈਲੀ ਜਾਂ ਖਾਣ-ਪੀਣ ਦੀਆਂ ਆਦਤਾਂ?",
      q5: "5. ਜਾਣੀ-ਪਛਾਣੀ ਐਲਰਜੀ ਜਾਂ ਪਿਛਲੀਆਂ ਦਵਾਈਆਂ?",
      next: "ਅਗਲਾ: ਆਮ ਸਵਾਲ",
      preview: "ਸੰਖੇਪ ਰਿਪੋਰਟ ਦੇਖੋ",
      back: "ਪਿੱਛੇ",
      submit: "ਡਾਕਟਰ ਕਤਾਰ ਵਿੱਚ ਰਿਪੋਰਟ ਭੇਜੋ"
    },
    hr: {
      portalTitle: "आरोग्यकिऑस्क • मरीज पोर्टल (हरियाणवी)",
      tabTriage: "तबत जांच",
      tabVault: "पर्ची लॉकर",
      tabHistory: "पुरानी पर्चियां",
      title: "तबत और बीमारी की प्रश्नावली",
      subtitle: "अपनी पसंद की चिकित्सा पद्धति और तरीका चुणो",
      streamLabel: "चिकित्सा पद्धति चुणो",
      q1: "1. थारे शरीर मैं के दिक्कत या दर्द होरा है?",
      q2: "2. यो दर्द या बीमारी कितने दिना ते है?",
      q3: "3. बीमारी कितनी तगड़ी (गंभीर) है?",
      q4: "4. खान-पीन और रहण-सहन कैसा है?",
      q5: "5. पैहले कोए एलर्जी या गोली खाई हो तो बतायो?",
      next: "आगे चालो: फेर के हाल हैं",
      preview: "रिपोर्ट चेक करो",
      back: "पाछे जाओ",
      submit: "डॉक्टर कै कतार मैं भेज दो"
    }
  }[lang];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      window.addEventListener('online', () => setIsOnline(true));
      window.addEventListener('offline', () => setIsOnline(false));
    }
  }, []);

  // Login Check
  useEffect(() => {
    const session = localStorage.getItem('patient_session');
    if (!session) {
      router.push('/patient/login');
      return;
    }
    const parsed = JSON.parse(session);
    setPatientSession(parsed);
    setAbhaIdInput(parsed.patient_id || 'ABHA-98765432101234');
    if (parsed.uploadedReports) setVaultReports(parsed.uploadedReports);
    if (parsed.medicalHistory) setMedicalHistory(parsed.medicalHistory);
  }, [router]);

  const toggleScreenReader = () => {
    const newState = !screenReaderActive;
    setScreenReaderActive(newState);
    if (newState && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance("Screen reader active on ArogyaKiosk Patient Triage Portal."));
      alert("Screen Reader Access Enabled.");
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      alert("Screen Reader Access Disabled.");
    }
  };

  const handleModeChange = (mode: 'written' | 'voice') => {
    setInteractionMode(mode);
    localStorage.setItem('kiosk_mode', mode);
    if (mode === 'voice') {
      speakText("Voice mode is active.");
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && interactionMode === 'voice') {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' || lang === 'hr' ? 'hi-IN' : lang === 'pa' ? 'pa-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const startGlobalListening = (fieldKey: string) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'hi' || lang === 'hr' ? 'hi-IN' : lang === 'pa' ? 'pa-IN' : 'en-US';
      recognition.interimResults = false;

      setIsListening(true);
      speakText(lang === 'hr' ? "बोलियो, सुणोरा हूँ..." : "Listening, please speak your symptoms...");

      recognition.onresult = (event: any) => {
        const speechText = event.results[0][0].transcript;
        setAnswers(prev => ({
          ...prev,
          [fieldKey]: (prev as any)[fieldKey] ? `${(prev as any)[fieldKey]} ${speechText}` : speechText
        }));
        setIsListening(false);
        speakText("समझ लिया गया है।");
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  const handleFinalSubmit = () => {
    setSubmitted(true);
    const summaryReportText = `
      [STREAM: ${stream.toUpperCase()}] [ABHA: ${abhaIdInput}]
      - Primary Symptoms: ${answers.primarySymptoms}
      - Duration: ${answers.duration}
      - Severity: ${answers.severity}
      - Lifestyle: ${answers.lifestyle || 'None'}
      - Allergies: ${answers.allergies || 'None'}
    `.trim();

    const newHistoryItem = {
      date: new Date().toLocaleDateString(),
      stream,
      summary: summaryReportText,
      status: 'Pending Doctor Review'
    };
    const updatedHistory = [newHistoryItem, ...medicalHistory];
    setMedicalHistory(updatedHistory);

    if (patientSession) {
      const updatedSession = { ...patientSession, medicalHistory: updatedHistory };
      setPatientSession(updatedSession);
      localStorage.setItem('patient_session', JSON.stringify(updatedSession));
    }

    const existingQueue = JSON.parse(localStorage.getItem('doctor_queue') || '[]');
    const newQueueEntry = {
      id: Date.now(),
      patient_id: abhaIdInput,
      name: patientSession?.fullName || 'Verified Patient',
      age: patientSession?.age || '25',
      gender: patientSession?.gender || 'Male',
      symptoms: summaryReportText,
      risk_level: answers.severity === 'Severe' || answers.primarySymptoms.toLowerCase().includes('pain') ? 'Critical' : 'Moderate',
      status: 'Pending',
      rag_safety: `Checked via ChromaDB for ${stream} guidelines. ABHA Locker Linked.`,
      history: `Vault Reports: ${vaultReports.join(', ')}`,
      prescription: 'Pending doctor consultation.'
    };
    localStorage.setItem('doctor_queue', JSON.stringify([newQueueEntry, ...existingQueue]));
    speakText("थारी रिपोर्ट डॉक्टर कै कड़ै भेज दी गी है।");
  };

  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'ai', text: "ABHA Health Locker & Voice Agent active. How can I help?" }]);
    }, 500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      maxWidth: '100vw',
      overflowX: 'hidden',
      backgroundColor: isDark ? '#020617' : '#f8fafc',
      color: isDark ? '#ffffff' : '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      fontFamily: 'sans-serif',
      fontSize: `${fontSizeScale}px`,
      position: 'relative'
    }}>
      
      {/* 1. GOVERNMENT TOP BAR */}
      <div style={{
        backgroundColor: '#0b1329',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '11px',
        color: '#94a3b8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ backgroundColor: '#ff9933', width: '12px', height: '8px', display: 'inline-block' }}></span>
          <span style={{ fontWeight: 700, color: '#fff' }}>भारत सरकार | Govt of India</span>
          <span style={{ color: '#10b981', fontWeight: 600 }}>• Ministry of Ayush</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => setFontSizeScale(14)} style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>A-</button>
            <button onClick={() => setFontSizeScale(16)} style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>A</button>
            <button onClick={() => setFontSizeScale(18)} style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>A+</button>
          </div>
          <span className="hidden sm:inline">|</span>
          <span onClick={toggleScreenReader} className="hidden sm:inline" style={{ cursor: 'pointer', color: screenReaderActive ? '#34d399' : '#94a3b8', fontWeight: screenReaderActive ? 700 : 400 }}>
            {screenReaderActive ? 'Reader [ON]' : 'Screen Reader'}
          </span>
        </div>
      </div>

      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
        backgroundColor: isDark ? 'rgba(2, 6, 23, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ padding: '8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: '10px', color: '#10b981' }}>
            <Activity size={20} />
          </div>
          <div>
            <span style={{ fontSize: '16px', fontWeight: 700, display: 'block' }}>{t.portalTitle}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontSize: '11px', color: '#34d399' }}>{patientSession?.fullName || 'Verified Patient'}</span>
              <span style={{ fontSize: '9px', padding: '1px 6px', borderRadius: '9999px', backgroundColor: 'rgba(59,130,246,0.15)', color: '#60a5fa', fontWeight: 700 }}>
                ABHA Verified ✓
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', padding: '4px 8px', borderRadius: '8px' }}>
            <Globe size={14} color="#34d399" />
            <select
              value={lang}
              onChange={(e: any) => setLang(e.target.value)}
              style={{ background: 'none', border: 'none', color: isDark ? '#ffffff' : '#0f172a', fontSize: '11px', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
            >
              <option value="en" style={{ background: '#0f172a' }}>EN</option>
              <option value="hi" style={{ background: '#0f172a' }}>HI</option>
              <option value="pa" style={{ background: '#0f172a' }}>PA</option>
              <option value="hr" style={{ background: '#0f172a' }}>HR</option>
            </select>
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              color: isDark ? '#facc15' : '#0f172a',
              border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isDark ? <Sun size={12} /> : <Moon size={12} />}
          </button>

          <button
            onClick={() => {
              localStorage.removeItem('patient_session');
              router.push('/patient/login');
            }}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <LogOut size={12} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '12px 16px', borderBottom: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('triage')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'triage' ? '#10b981' : (isDark ? '#0f172a' : '#ffffff'),
            color: activeTab === 'triage' ? '#ffffff' : '#94a3b8',
            border: 'none'
          }}
        >
          {t.tabTriage}
        </button>
        <button
          onClick={() => setActiveTab('vault')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'vault' ? '#10b981' : (isDark ? '#0f172a' : '#ffffff'),
            color: activeTab === 'vault' ? '#ffffff' : '#94a3b8',
            border: 'none'
          }}
        >
          {t.tabVault} ({vaultReports.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'history' ? '#10b981' : (isDark ? '#0f172a' : '#ffffff'),
            color: activeTab === 'history' ? '#ffffff' : '#94a3b8',
            border: 'none'
          }}
        >
          {t.tabHistory} ({medicalHistory.length})
        </button>
      </div>

      <main style={{ maxWidth: '900px', margin: '20px auto', padding: '0 16px', width: '100%', boxSizing: 'border-box' }}>
        
        {activeTab === 'triage' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* ABHA STATUS WIDGET */}
            <div style={{
              backgroundColor: isDark ? '#064e3b' : '#d1fae5',
              border: '1px solid #10b981',
              padding: '12px 16px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} color="#34d399" />
              <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#34d399' : '#065f46' }}>
                ABHA Health Locker Linked ({abhaIdInput})
              </span>
            </div>

            {/* MAIN QUESTIONNAIRE CONTAINER */}
            <div style={{
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
              padding: '24px 16px',
              borderRadius: '20px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {!submitted ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', paddingBottom: '16px' }}>
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={18} color="#34d399" /> {t.title}
                      </h2>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>{t.subtitle} • Step {step} of 3</p>
                    </div>

                    <div style={{ display: 'flex', backgroundColor: isDark ? '#020617' : '#f1f5f9', padding: '4px', borderRadius: '10px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1' }}>
                      <button
                        type="button"
                        onClick={() => handleModeChange('written')}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          backgroundColor: interactionMode === 'written' ? '#10b981' : 'transparent',
                          color: interactionMode === 'written' ? '#ffffff' : '#94a3b8',
                          border: 'none'
                        }}
                      >
                        Type
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModeChange('voice')}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          backgroundColor: interactionMode === 'voice' ? '#10b981' : 'transparent',
                          color: interactionMode === 'voice' ? '#ffffff' : '#94a3b8',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Volume2 size={12} /> Voice
                      </button>
                    </div>
                  </div>

                  {step === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#34d399' }}>{t.streamLabel}</label>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                          {streamsList.map((s) => (
                            <div
                              key={s.id}
                              onClick={() => setStream(s.id)}
                              style={{
                                padding: '12px 14px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                backgroundColor: stream === s.id ? (isDark ? '#064e3b' : '#d1fae5') : (isDark ? '#020617' : '#f8fafc'),
                                border: stream === s.id ? '2px solid #10b981' : (isDark ? '1px solid #1e293b' : '1px solid #cbd5e1'),
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px'
                              }}
                            >
                              <span style={{ fontSize: '13px', fontWeight: 800, color: stream === s.id ? '#34d399' : (isDark ? '#ffffff' : '#0f172a') }}>{s.label}</span>
                              <span style={{ fontSize: '10px', color: '#94a3b8' }}>{s.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#34d399' }}>{t.q1}</label>
                          {interactionMode === 'voice' && (
                            <button
                              type="button"
                              onClick={() => startGlobalListening('primarySymptoms')}
                              style={{ background: isListening ? '#ef4444' : '#10b981', color: '#ffffff', border: 'none', padding: '4px 10px', borderRadius: '9999px', fontSize: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Mic size={12} /> {isListening ? 'Listening...' : 'Speak'}
                            </button>
                          )}
                        </div>
                        <textarea
                          rows={3}
                          placeholder="e.g. Joint pain, fatigue..."
                          value={answers.primarySymptoms}
                          onChange={(e) => setAnswers({ ...answers, primarySymptoms: e.target.value })}
                          style={{ padding: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '12px', color: isDark ? '#ffffff' : '#0f172a', fontSize: '13px', outline: 'none', resize: 'none' }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!answers.primarySymptoms.trim()) {
                            alert('Please describe your primary symptoms.');
                            return;
                          }
                          setStep(2);
                        }}
                        style={{ marginTop: '6px', padding: '12px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <span>{t.next}</span> <ArrowRight size={16} />
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8' }}>{t.q2}</label>
                        <input
                          type="text"
                          placeholder="e.g. 3 days"
                          value={answers.duration}
                          onChange={(e) => setAnswers({ ...answers, duration: e.target.value })}
                          style={{ padding: '10px 12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '10px', color: isDark ? '#ffffff' : '#0f172a', fontSize: '13px', outline: 'none' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8' }}>{t.q3}</label>
                        <select
                          value={answers.severity}
                          onChange={(e) => setAnswers({ ...answers, severity: e.target.value })}
                          style={{ padding: '10px 12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '10px', color: isDark ? '#ffffff' : '#0f172a', fontSize: '13px', outline: 'none' }}
                        >
                          <option value="Mild">Mild</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Severe">Severe</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8' }}>{t.q4}</label>
                        <input
                          type="text"
                          placeholder="e.g. Vegetarian"
                          value={answers.lifestyle}
                          onChange={(e) => setAnswers({ ...answers, lifestyle: e.target.value })}
                          style={{ padding: '10px 12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '10px', color: isDark ? '#ffffff' : '#0f172a', fontSize: '13px', outline: 'none' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8' }}>{t.q5}</label>
                        <input
                          type="text"
                          placeholder="e.g. None"
                          value={answers.allergies}
                          onChange={(e) => setAnswers({ ...answers, allergies: e.target.value })}
                          style={{ padding: '10px 12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '10px', color: isDark ? '#ffffff' : '#0f172a', fontSize: '13px', outline: 'none' }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                        <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '12px', backgroundColor: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#fff' : '#0f172a', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>{t.back}</button>
                        <button type="button" onClick={() => setStep(3)} style={{ flex: 2, padding: '12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '13px' }}>{t.preview}</button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ backgroundColor: isDark ? '#020617' : '#f8fafc', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', padding: '16px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 900, margin: 0, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FileText size={18} /> Final Summary Report
                        </h3>
                        <div style={{ fontSize: '12px', lineHeight: 1.5, color: isDark ? '#cbd5e1' : '#334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div><strong>ABHA ID:</strong> {abhaIdInput}</div>
                          <div><strong>Selected Stream:</strong> {stream}</div>
                          <div><strong>Primary Symptoms:</strong> {answers.primarySymptoms}</div>
                          <div><strong>Duration:</strong> {answers.duration || 'Not specified'}</div>
                          <div><strong>Severity Level:</strong> {answers.severity}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="button" onClick={() => setStep(2)} style={{ flex: 1, padding: '12px', backgroundColor: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#fff' : '#0f172a', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>{t.back}</button>
                        <button type="button" onClick={handleFinalSubmit} style={{ flex: 2, padding: '12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '13px' }}>{t.submit}</button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 0', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                  <CheckCircle2 size={56} color="#10b981" />
                  <h3 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>Report Dispatched to Doctor Queue!</h3>
                  <p style={{ fontSize: '12px', color: '#94a3b8', maxWidth: '440px', margin: 0 }}>Your medical summary and ABHA locker details have been sent to the Doctor Command Center.</p>
                  <button onClick={() => { setSubmitted(false); setStep(1); }} style={{ padding: '10px 20px', backgroundColor: '#1e293b', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, marginTop: '8px', fontSize: '12px' }}>Start New Assessment</button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'vault' && (
          <div style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', padding: '24px 16px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>Medical Vault & Records</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Auto-synced from Ayushman Bharat Digital Mission (ABHA).</p>
            <label style={{ border: '2px dashed #334155', padding: '24px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer' }}>
              <Upload size={28} color="#34d399" />
              <span style={{ display: 'block', marginTop: '8px', fontSize: '13px', fontWeight: 700 }}>Upload New Report</span>
              <input type="file" multiple onChange={(e) => {
                if(e.target.files) setVaultReports([...vaultReports, ...Array.from(e.target.files).map((f: any)=>f.name)]);
              }} style={{ display: 'none' }} />
            </label>
            {vaultReports.map((file, idx) => (
              <div key={idx} style={{ padding: '10px 14px', backgroundColor: isDark ? '#020617' : '#f8fafc', borderRadius: '10px', border: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} color="#34d399" /> <span style={{ fontSize: '12px', fontWeight: 600 }}>{file}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', padding: '24px 16px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>Saved Medical History</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Access your online records anytime.</p>
            {medicalHistory.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>No records found.</p>
            ) : (
              medicalHistory.map((item, idx) => (
                <div key={idx} style={{ padding: '14px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: '1px solid #334155', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#34d399', fontWeight: 800 }}>
                    <span>Stream: {item.stream}</span>
                    <span>Date: {item.date}</span>
                  </div>
                  <p style={{ fontSize: '12px', margin: 0, lineHeight: 1.5 }}>{item.summary}</p>
                  <div style={{ fontSize: '11px', color: '#facc15', fontWeight: 700 }}>Status: {item.status}</div>
                </div>
              ))
            )}
          </div>
        )}

      </main>

      {/* Floating AI Assistant */}
      <div style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: 1200 }}>
        {!isAiOpen ? (
          <button onClick={() => setIsAiOpen(true)} style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)' }}>
            <Rocket size={22} />
          </button>
        ) : (
          <div style={{ width: 'calc(100vw - 32px)', maxWidth: '350px', height: '440px', backgroundColor: isDark ? '#0f172a' : '#ffffff', border: '1px solid #334155', borderRadius: '20px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>AI Assistant</span>
              <button onClick={() => setIsAiOpen(false)} style={{ background: 'none', border: 'none', color: isDark ? '#fff' : '#0f172a', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {messages.map((m, i) => <div key={i} style={{ padding: '8px 12px', borderRadius: '10px', background: m.sender==='user'?'#10b981':'#1e293b', color: '#fff', fontSize: '11px' }}>{m.text}</div>)}
            </div>
            <form onSubmit={handleAiSend} style={{ padding: '10px', borderTop: '1px solid #334155', display: 'flex', gap: '6px' }}>
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask anything..." style={{ flex: 1, padding: '8px 10px', background: isDark ? '#020617' : '#f8fafc', border: '1px solid #334155', color: isDark ? '#fff' : '#0f172a', borderRadius: '8px', fontSize: '11px', outline: 'none' }} />
              <button type="submit" style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px' }}><Send size={13} /></button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
