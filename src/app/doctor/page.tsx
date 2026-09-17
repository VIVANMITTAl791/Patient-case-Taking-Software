'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Stethoscope, ShieldCheck, Activity, Users, AlertTriangle, 
  CheckCircle2, RefreshCw, LogOut, Sun, Moon, Check, Plus, 
  Video, ShieldAlert, History, X, PhoneOff, Mic, MicOff, Send, Rocket, FileText, PlusCircle, Upload, Lock, Key, Shield, QrCode, 
  Home as HomeIcon, FileText as FileTextIcon, Bell, BookOpen, PhoneCall, HelpCircle, ChevronRight, UserCheck 
} from 'lucide-react';

export default function DoctorDashboard() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fontSizeScale, setFontSizeScale] = useState(16);
  const [screenReaderActive, setScreenReaderActive] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [docId, setDocId] = useState('');
  const [docPassword, setDocPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [queue, setQueue] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  const [activePrescriptionModal, setActivePrescriptionModal] = useState<any | null>(null);
  const [newRxText, setNewRxText] = useState('');
  const [uploadedSlipFiles, setUploadedSlipFiles] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true);
    const authSession = sessionStorage.getItem('doctor_authenticated');
    if (authSession === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    loadQueueFromStorage();
  }, []);

  const loadQueueFromStorage = () => {
    const storedQueue = localStorage.getItem('doctor_queue');
    if (storedQueue) {
      try {
        const parsed = JSON.parse(storedQueue);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQueue(parsed);
          setSelectedPatient(parsed[0]);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    
    const defaultQueue = [
      { 
        id: 1, 
        patient_id: 'ABHA-98765432101234', 
        name: 'Vivan',
        age: 20,
        gender: 'Male',
        caseType: 'AYUSH',
        symptoms: 'Chronic joint stiffness, fatigue and digestive imbalance', 
        risk_level: 'Low', 
        status: 'Pending',
        rag_safety: 'Safe: No adverse interactions found with standard Ashwagandha or Guggulu regimens.',
        history: 'No major prior ailments. Regular checkups. ABHA Locker Linked.',
        prescription: 'Simulated: Dashmoolarishta 15ml twice daily post meals.'
      },
      { 
        id: 2, 
        patient_id: 'ABHA-11223344556677', 
        name: 'Lakshay',
        age: 29,
        gender: 'Male',
        caseType: 'AYUSH',
        symptoms: 'Mild respiratory congestion and seasonal allergy', 
        risk_level: 'Moderate', 
        status: 'Pending',
        rag_safety: 'Safe under professional observation.',
        history: 'Prior seasonal asthma checkups.',
        prescription: 'Pending doctor consultation.'
      }
    ];
    setQueue(defaultQueue);
    setSelectedPatient(defaultQueue[0]);
  };

  const toggleScreenReader = () => {
    const newState = !screenReaderActive;
    setScreenReaderActive(newState);
    if (newState && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance("Screen reader active on ArogyaKiosk Doctor Command Center."));
      alert("Screen Reader Access Enabled.");
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      alert("Screen Reader Access Disabled.");
    }
  };

  const handleDoctorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (docId.trim() === 'DOC-108' && docPassword === 'sih2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('doctor_authenticated', 'true');
    } else {
      setLoginError('Access Denied: Invalid Doctor ID or Secure Password.');
    }
  };

  const handleDoctorLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('doctor_authenticated');
    setDocId('');
    setDocPassword('');
  };

  const [activeVideoCall, setActiveVideoCall] = useState<any | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const fetchQueue = () => {
    setLoading(true);
    loadQueueFromStorage();
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  const handleApprove = (id: number) => {
    const updated = queue.map(item => item.id === id ? { ...item, status: 'Approved & E-Signed' } : item);
    setQueue(updated);
    if (selectedPatient && selectedPatient.id === id) {
      setSelectedPatient({ ...selectedPatient, status: 'Approved & E-Signed' });
    }
    localStorage.setItem('doctor_queue', JSON.stringify(updated));
  };

  const handleFileUploadByDoctor = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files).map((f: any) => f.name);
      setUploadedSlipFiles(prev => [...prev, ...filesArr]);
    }
  };

  const handleSavePrescriptionToPatientFolder = (patientId: string) => {
    if (!newRxText.trim() && uploadedSlipFiles.length === 0) {
      alert('Please enter prescription details or upload at least one slip file.');
      return;
    }

    const updatedQueue = queue.map(item => {
      if (item.patient_id === patientId) {
        const updatedItem = {
          ...item,
          prescription: newRxText ? `${item.prescription || ''} | Rx: ${newRxText}` : item.prescription,
          history: uploadedSlipFiles.length > 0 ? `${item.history}, Doctor Slips: ${uploadedSlipFiles.join(', ')}` : item.history
        };
        if (selectedPatient?.patient_id === patientId) {
          setSelectedPatient(updatedItem);
        }
        return updatedItem;
      }
      return item;
    });

    setQueue(updatedQueue);
    localStorage.setItem('doctor_queue', JSON.stringify(updatedQueue));

    alert('Prescription and medical slips successfully uploaded to patient folder!');
    setActivePrescriptionModal(null);
    setNewRxText('');
    setUploadedSlipFiles([]);
  };

  if (!isClient) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#020617',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        padding: '24px'
      }}>
        <div style={{
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '28px',
          padding: '40px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.15)', borderRadius: '20px', color: '#60a5fa' }}>
              <Lock size={32} />
            </div>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 900, margin: 0 }}>Doctor Command Gateway</h2>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Restricted Medical Portal • Authorized Personnel Only</p>
            </div>
          </div>

          {loginError && (
            <div style={{ padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', color: '#ef4444', fontSize: '12px', fontWeight: 700, textAlign: 'center' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleDoctorLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Doctor ID / Nodal Code</label>
              <input
                type="text"
                placeholder="Enter Doctor ID (e.g. DOC-108)"
                value={docId}
                onChange={(e) => setDocId(e.target.value)}
                style={{ padding: '14px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none' }}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Secure Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={docPassword}
                onChange={(e) => setDocPassword(e.target.value)}
                style={{ padding: '14px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none' }}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '10px',
                padding: '16px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Key size={18} /> Authenticate & Access Console
            </button>
          </form>

          <button
            onClick={() => router.push('/')}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer', fontWeight: 600, marginTop: '8px' }}
          >
            ← Back to Home Gateway
          </button>
        </div>
      </div>
    );
  }

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
      position: 'relative',
      boxSizing: 'border-box'
    }}>
      
      {/* 1. GOVERNMENT TOP BAR */}
      <div style={{
        backgroundColor: '#0b1329',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '8px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '12px',
        color: '#94a3b8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ backgroundColor: '#ff9933', width: '14px', height: '10px', display: 'inline-block' }}></span>
          <span style={{ fontWeight: 700, color: '#fff' }}>Government of India | भारत सरकार</span>
          <span style={{ color: '#10b981', fontWeight: 600 }}>• Ministry of Ayush</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => setFontSizeScale(14)} style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>A-</button>
            <button onClick={() => setFontSizeScale(16)} style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>A</button>
            <button onClick={() => setFontSizeScale(18)} style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>A+</button>
          </div>
          <span>|</span>
          <span onClick={toggleScreenReader} style={{ cursor: 'pointer', color: screenReaderActive ? '#34d399' : '#94a3b8', fontWeight: screenReaderActive ? 700 : 400 }}>
            {screenReaderActive ? 'Screen Reader [ON]' : 'Screen Reader Access'}
          </span>
          <span>|</span>
          <span onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })} style={{ cursor: 'pointer', color: '#60a5fa' }}>Skip to main content</span>
        </div>
      </div>

      {/* Navbar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 32px',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
        backgroundColor: isDark ? 'rgba(2, 6, 23, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ padding: '10px', backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: '12px', color: '#60a5fa' }}>
            <Stethoscope size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>ArogyaKiosk • Doctor Command Center</h1>
            <p style={{ fontSize: '12px', color: '#34d399', margin: 0 }}>Authenticated Session: Dr. Sharma (DOC-108) • Specialization: Ayurveda</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setIsDark(!isDark)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              color: isDark ? '#facc15' : '#0f172a',
              border: isDark ? '1px solid #334155' : '1px solid #cbd5e1'
            }}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>

          <button
            onClick={handleDoctorLogout}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LogOut size={14} /> Secure Logout
          </button>
        </div>
      </header>

      {/* 2. SECONDARY SUB-NAVBAR */}
      <div style={{
        backgroundColor: isDark ? '#060a12' : '#e2e8f0',
        borderBottom: isDark ? '1px solid #1e293b' : '1px solid #cbd5e1',
        padding: '12px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', fontSize: '13px', fontWeight: 700 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#10b981' }} onClick={() => router.push('/')}>
            <HomeIcon size={16} /> Home
          </span>
          <span onClick={() => setModalContent({ title: 'About Us - Ministry of Ayush & ArogyaKiosk', body: 'ArogyaKiosk is an AI-powered decentralized health platform developed for Smart India Hackathon.' })} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: isDark ? '#cbd5e1' : '#334155' }}>
            <FileTextIcon size={16} /> About Us
          </span>
          <span onClick={() => setModalContent({ title: 'Acts & Rules Compliance', body: 'Operating under national telemedicine guidelines and Ministry of Ayush clinical protocols.' })} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: isDark ? '#cbd5e1' : '#334155' }}>
            <BookOpen size={16} /> Acts & Rules
          </span>
          <span onClick={() => setModalContent({ title: 'System Notifications', body: '• ChromaDB RAG Vector search engine synchronized.\n• All Kiosk authentication endpoints active.' })} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: isDark ? '#cbd5e1' : '#334155' }}>
            <Bell size={16} /> Notification
          </span>
          <span onClick={() => setModalContent({ title: 'Contact Ministry Support', body: 'AYUSH BHAWAN, NEW DELHI - 110023\nSupport Email: support@arogyakiosk.gov.in' })} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: isDark ? '#cbd5e1' : '#334155' }}>
            <PhoneCall size={16} /> Contact Us
          </span>
        </div>
      </div>

      {/* Main Content: MASTER-DETAIL SPLIT VIEW */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '30px 24px', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, margin: 0 }}>Recent Clinical Cases</h2>
            <p style={{ fontSize: '13px', color: isDark ? '#94a3b8' : '#64748b', margin: '2px 0 0 0' }}>Select a patient case from the left to review the AI-prepared clinical context in a single file.</p>
          </div>

          <button
            onClick={fetchQueue}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              color: '#10b981',
              border: isDark ? '1px solid #1e293b' : '1px solid #cbd5e1',
              cursor: 'pointer',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Cases</span>
          </button>
        </div>

        {/* SPLIT LAYOUT: Left List & Right Unified Patient File */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* LEFT: Patient Cases List */}
          <div style={{
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
            borderRadius: '24px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: '75vh',
            overflowY: 'auto'
          }}>
            {queue.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px', fontSize: '13px' }}>No active cases.</p>
            ) : (
              queue.map((item) => {
                const isSelected = selectedPatient?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPatient(item)}
                    style={{
                      padding: '16px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? (isDark ? '#064e3b' : '#d1fae5') : (isDark ? '#020617' : '#f8fafc'),
                      border: isSelected ? '2px solid #10b981' : (isDark ? '1px solid #1e293b' : '1px solid #cbd5e1'),
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        backgroundColor: isSelected ? '#10b981' : (isDark ? '#1e293b' : '#e2e8f0'),
                        color: isSelected ? '#fff' : (isDark ? '#34d399' : '#0f172a'),
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '15px'
                      }}>
                        {item.name ? item.name.charAt(0).toUpperCase() : 'P'}
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: isSelected ? '#34d399' : (isDark ? '#fff' : '#0f172a') }}>
                          {item.name || 'Patient'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          {item.age || '25'} years • {item.gender || 'Male'}
                        </div>
                        <div style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 700, marginTop: '2px' }}>
                          {item.caseType || 'AYUSH'} CASE • {item.status === 'Approved & E-Signed' ? '✓ VERIFIED' : 'PENDING'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} color={isSelected ? '#34d399' : '#94a3b8'} />
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT: Unified Single File Patient Context Panel */}
          {selectedPatient ? (
            <div style={{
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
              borderRadius: '24px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
            }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI-Prepared Patient Context File</span>
                  <h3 style={{ fontSize: '26px', fontWeight: 900, margin: '2px 0 0 0' }}>{selectedPatient.name || 'Patient Profile'}</h3>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Terminal ID: {selectedPatient.patient_id}</p>
                </div>
                <span style={{
                  padding: '6px 14px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700,
                  backgroundColor: selectedPatient.status === 'Approved & E-Signed' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                  color: selectedPatient.status === 'Approved & E-Signed' ? '#34d399' : '#f59e0b'
                }}>
                  {selectedPatient.status === 'Approved & E-Signed' ? '✓ Physician Verified' : 'Pending Verification'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#60a5fa', margin: 0 }}>Patient Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                  <div style={{ backgroundColor: isDark ? '#020617' : '#f8fafc', padding: '12px', borderRadius: '12px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1' }}>
                    <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Name</span>
                    <strong style={{ fontSize: '14px' }}>{selectedPatient.name || 'N/A'}</strong>
                  </div>
                  <div style={{ backgroundColor: isDark ? '#020617' : '#f8fafc', padding: '12px', borderRadius: '12px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1' }}>
                    <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Age</span>
                    <strong style={{ fontSize: '14px' }}>{selectedPatient.age || 'N/A'} yrs</strong>
                  </div>
                  <div style={{ backgroundColor: isDark ? '#020617' : '#f8fafc', padding: '12px', borderRadius: '12px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1' }}>
                    <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Gender</span>
                    <strong style={{ fontSize: '14px' }}>{selectedPatient.gender || 'N/A'}</strong>
                  </div>
                  <div style={{ backgroundColor: isDark ? '#020617' : '#f8fafc', padding: '12px', borderRadius: '12px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1' }}>
                    <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Case Type</span>
                    <strong style={{ fontSize: '14px', color: '#34d399' }}>{selectedPatient.caseType || 'AYUSH'}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#60a5fa', margin: 0 }}>Chief Complaint & Symptoms</h4>
                <div style={{ padding: '16px', backgroundColor: isDark ? '#020617' : '#f8fafc', borderRadius: '14px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', fontSize: '14px', lineHeight: 1.5 }}>
                  {selectedPatient.symptoms}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div style={{ backgroundColor: isDark ? '#020617' : '#f8fafc', padding: '16px', borderRadius: '14px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <ShieldAlert size={14} /> ChromaDB RAG Safety Check
                  </span>
                  <p style={{ fontSize: '13px', margin: 0, color: isDark ? '#cbd5e1' : '#475569' }}>{selectedPatient.rag_safety}</p>
                </div>

                <div style={{ backgroundColor: isDark ? '#020617' : '#f8fafc', padding: '16px', borderRadius: '14px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <History size={14} /> ABHA Vault & Medical History
                  </span>
                  <p style={{ fontSize: '13px', margin: 0, color: isDark ? '#cbd5e1' : '#475569' }}>{selectedPatient.history}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#60a5fa', margin: 0 }}>Current Prescription / Treatment Draft</h4>
                <div style={{ padding: '16px', backgroundColor: isDark ? '#064e3b' : '#d1fae5', borderRadius: '14px', border: '1px solid #10b981', fontSize: '14px', color: isDark ? '#34d399' : '#065f46', fontWeight: 600 }}>
                  {selectedPatient.prescription || 'Pending doctor consultation.'}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setActiveVideoCall(selectedPatient)}
                    style={{
                      padding: '10px 16px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa',
                      border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '12px', fontWeight: 700, fontSize: '13px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                  >
                    <Video size={16} /> Start Video Consult
                  </button>

                  <button
                    onClick={() => setActivePrescriptionModal(selectedPatient)}
                    style={{
                      padding: '10px 16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', fontWeight: 700, fontSize: '13px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                  >
                    <PlusCircle size={16} /> Add Rx & Upload Slip
                  </button>
                </div>

                {selectedPatient.status !== 'Approved & E-Signed' ? (
                  <button
                    onClick={() => handleApprove(selectedPatient.id)}
                    style={{
                      padding: '12px 24px', backgroundColor: '#10b981', color: '#ffffff',
                      border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '14px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    <Check size={18} /> E-Sign & Verify Case
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '13px', fontWeight: 800 }}>
                    <CheckCircle2 size={18} /> Case Verified & E-Signed ✓
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
              Select a patient from the left list to view their complete medical file.
            </div>
          )}

        </div>

      </main>

      {/* Interactive Modal for Sub-Navbar items */}
      {modalContent && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px'
        }}>
          <div style={{
            backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
            borderRadius: '24px', padding: '32px', maxWidth: '500px', width: '100%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: '16px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#10b981' }}>{modalContent.title}</h3>
            <p style={{ fontSize: '14px', color: isDark ? '#cbd5e1' : '#475569', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>{modalContent.body}</p>
            <button
              onClick={() => setModalContent(null)}
              style={{ marginTop: '12px', padding: '12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ADD PRESCRIPTION & UPLOAD MEDICAL SLIP MODAL */}
      {activePrescriptionModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1300,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
            borderRadius: '24px', width: '100%', maxWidth: '560px', padding: '30px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Add Prescription & Upload Medical Slip</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>Patient: {activePrescriptionModal.name} ({activePrescriptionModal.patient_id})</p>
              </div>
              <button onClick={() => setActivePrescriptionModal(null)} style={{ background: 'none', border: 'none', color: isDark ? '#fff' : '#0f172a', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>Prescribed Medicines / Treatment (Dwai)</label>
              <textarea
                rows={3}
                placeholder="e.g. 1. Ashwagandha 500mg twice daily post meals&#10;2. Dashmoolarishta 15ml"
                value={newRxText}
                onChange={(e) => setNewRxText(e.target.value)}
                style={{ padding: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '10px', color: isDark ? '#fff' : '#0f172a', fontSize: '13px', outline: 'none', resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase' }}>Upload Medical Slip / Prescription Document (PDF, Image, Scan)</label>
              <label style={{
                border: isDark ? '2px dashed #334155' : '2px dashed #cbd5e1',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc'
              }}>
                <Upload size={24} color="#60a5fa" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569' }}>Click to upload doctor signed prescription or report</span>
                <input type="file" multiple onChange={handleFileUploadByDoctor} style={{ display: 'none' }} />
              </label>

              {uploadedSlipFiles.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                  {uploadedSlipFiles.map((fname, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#60a5fa' }}>
                      <FileText size={14} /> <span>{fname}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button
                onClick={() => setActivePrescriptionModal(null)}
                style={{ flex: 1, padding: '12px', backgroundColor: '#1e293b', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSavePrescriptionToPatientFolder(activePrescriptionModal.patient_id)}
                style={{ flex: 2, padding: '12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
              >
                Save & Sync to Patient Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WORKING VIDEO CALL MODAL OVERLAY */}
      {activeVideoCall && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(2, 6, 23, 0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '16px 24px',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Secure Telehealth Consult: <span style={{ color: '#34d399' }}>{activeVideoCall.name || activeVideoCall.patient_id}</span>
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Terminal ID: {activeVideoCall.patient_id} • Encrypted WebRTC Stream</p>
            </div>
            <button
              onClick={() => setActiveVideoCall(null)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                padding: '8px',
                borderRadius: '50%',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', maxWidth: '1200px', margin: '12px auto', width: '100%', flex: 1, maxHeight: 'calc(100vh - 160px)' }}>
            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '20px',
              border: '1px solid #1e293b',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              minHeight: '280px'
            }}>
              {!isVideoOff ? (
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '70px', height: '70px', backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                    <Video size={32} />
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>Live Video Feed: {activeVideoCall.name || 'Patient'}</span>
                  <span style={{ fontSize: '11px', color: '#34d399', backgroundColor: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '9999px' }}>Connected (HD 1080p)</span>
                </div>
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>Video Stream Paused</div>
              )}

              <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '120px', height: '80px', backgroundColor: '#020617', borderRadius: '10px', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#94a3b8' }}>
                Doctor (You)
              </div>
            </div>

            <div style={{
              backgroundColor: '#0f172a',
              borderRadius: '20px',
              border: '1px solid #1e293b',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              overflowY: 'auto'
            }}>
              <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#34d399', margin: 0 }}>Consultation Notes</h4>
              <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.4 }}>
                <strong>Assessment:</strong> {activeVideoCall.symptoms}
              </div>
              <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.4 }}>
                <strong>RAG Safety:</strong> {activeVideoCall.rag_safety}
              </div>
              <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.4 }}>
                <strong>Prescription Draft:</strong> {activeVideoCall.prescription}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', maxWidth: '1200px', margin: '0 auto', width: '100%', paddingBottom: '8px' }}>
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{
                padding: '12px 18px',
                borderRadius: '14px',
                backgroundColor: isMuted ? '#dc2626' : '#1e293b',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                fontSize: '13px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
              <span>{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              style={{
                padding: '12px 18px',
                borderRadius: '14px',
                backgroundColor: isVideoOff ? '#dc2626' : '#1e293b',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                fontSize: '13px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              <Video size={16} />
              <span>{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
            </button>

            <button
              onClick={() => setActiveVideoCall(null)}
              style={{
                padding: '12px 22px',
                borderRadius: '14px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                fontSize: '13px',
                boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)'
              }}
            >
              <PhoneOff size={16} />
              <span>End Call</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        padding: '20px 32px',
        borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: '#94a3b8',
        backgroundColor: isDark ? 'rgba(2, 6, 23, 0.9)' : 'rgba(255, 255, 255, 0.9)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="#60a5fa" />
          <span>Doctor Telehealth Console • HIPAA & ABHA Compliant</span>
        </div>
        <div>ArogyaKiosk SIH Enterprise Prototype</div>
      </footer>
    </div>
  );
}