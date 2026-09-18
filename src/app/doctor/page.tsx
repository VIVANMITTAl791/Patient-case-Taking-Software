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
        padding: '16px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '24px',
          padding: '28px 20px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '14px', backgroundColor: 'rgba(59, 130, 246, 0.15)', borderRadius: '16px', color: '#60a5fa' }}>
              <Lock size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>Doctor Command Gateway</h2>
              <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Restricted Medical Portal • Authorized Personnel Only</p>
            </div>
          </div>

          {loginError && (
            <div style={{ padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#ef4444', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleDoctorLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Doctor ID / Code</label>
              <input
                type="text"
                placeholder="e.g. DOC-108"
                value={docId}
                onChange={(e) => setDocId(e.target.value)}
                style={{ padding: '12px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '13px', outline: 'none' }}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Secure Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={docPassword}
                onChange={(e) => setDocPassword(e.target.value)}
                style={{ padding: '12px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '13px', outline: 'none' }}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '6px',
                padding: '14px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Key size={16} /> Access Console
            </button>
          </form>

          <button
            onClick={() => router.push('/')}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer', fontWeight: 600, marginTop: '4px' }}
          >
            ← Back to Home
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

      {/* Navbar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
        backgroundColor: isDark ? 'rgba(2, 6, 23, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        width: '100%',
        boxSizing: 'border-box',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ padding: '8px', backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: '10px', color: '#60a5fa' }}>
            <Stethoscope size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>Doctor Command Center</h1>
            <p style={{ fontSize: '11px', color: '#34d399', margin: 0 }}>Session: Dr. Sharma (DOC-108)</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsDark(!isDark)}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              color: isDark ? '#facc15' : '#0f172a',
              border: isDark ? '1px solid #334155' : '1px solid #cbd5e1'
            }}
          >
            {isDark ? <Sun size={13} /> : <Moon size={13} />}
          </button>

          <button
            onClick={handleDoctorLogout}
            style={{
              padding: '6px 12px',
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
            <LogOut size={13} /> Logout
          </button>
        </div>
      </header>

      {/* 2. SECONDARY SUB-NAVBAR */}
      <div style={{
        backgroundColor: isDark ? '#060a12' : '#e2e8f0',
        borderBottom: isDark ? '1px solid #1e293b' : '1px solid #cbd5e1',
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', fontSize: '11px', fontWeight: 700 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#10b981' }} onClick={() => router.push('/')}>
            <HomeIcon size={14} /> Home
          </span>
          <span onClick={() => setModalContent({ title: 'About Command Gateway', body: 'Authorized physician terminal for tele-triage, RAG interaction review, and e-prescriptions.' })} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: isDark ? '#cbd5e1' : '#334155' }}>
            <FileTextIcon size={14} /> About
          </span>
          <span onClick={() => setModalContent({ title: 'Telemedicine Compliance', body: 'Compliant with national digital health protocols and Ministry of Ayush clinical guidelines.' })} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: isDark ? '#cbd5e1' : '#334155' }}>
            <BookOpen size={14} /> Protocol
          </span>
        </div>
      </div>

      {/* Main Content: MASTER-DETAIL VIEW */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>Recent Clinical Cases</h2>
            <p style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', margin: '2px 0 0 0' }}>Review AI-prepared clinical context and e-sign prescriptions.</p>
          </div>

          <button
            onClick={fetchQueue}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              color: '#10b981',
              border: isDark ? '1px solid #1e293b' : '1px solid #cbd5e1',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* RESPONSIVE MASTER-DETAIL CONTAINER */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'start' }}>
          
          {/* LEFT: Cases List */}
          <div style={{
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxHeight: '65vh',
            overflowY: 'auto'
          }}>
            {queue.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px', fontSize: '12px' }}>No active cases.</p>
            ) : (
              queue.map((item) => {
                const isSelected = selectedPatient?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPatient(item)}
                    style={{
                      padding: '12px',
                      borderRadius: '14px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? (isDark ? '#064e3b' : '#d1fae5') : (isDark ? '#020617' : '#f8fafc'),
                      border: isSelected ? '2px solid #10b981' : (isDark ? '1px solid #1e293b' : '1px solid #cbd5e1'),
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: isSelected ? '#10b981' : (isDark ? '#1e293b' : '#e2e8f0'),
                        color: isSelected ? '#fff' : (isDark ? '#34d399' : '#0f172a'),
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px'
                      }}>
                        {item.name ? item.name.charAt(0).toUpperCase() : 'P'}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: isSelected ? '#34d399' : (isDark ? '#fff' : '#0f172a') }}>
                          {item.name || 'Patient'}
                        </div>
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                          {item.age || '25'} yrs • {item.gender || 'Male'}
                        </div>
                        <div style={{ fontSize: '9px', color: '#38bdf8', fontWeight: 700, marginTop: '2px' }}>
                          {item.caseType || 'AYUSH'} • {item.status === 'Approved & E-Signed' ? '✓ VERIFIED' : 'PENDING'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} color={isSelected ? '#34d399' : '#94a3b8'} />
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT: Unified Patient Context Panel */}
          {selectedPatient ? (
            <div style={{
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '20px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.15)'
            }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderBottom: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', paddingBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>Clinical Context File</span>
                  <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '2px 0 0 0' }}>{selectedPatient.name || 'Patient Profile'}</h3>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Terminal: {selectedPatient.patient_id}</p>
                </div>
                <span style={{
                  padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700,
                  backgroundColor: selectedPatient.status === 'Approved & E-Signed' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                  color: selectedPatient.status === 'Approved & E-Signed' ? '#34d399' : '#f59e0b'
                }}>
                  {selectedPatient.status === 'Approved & E-Signed' ? '✓ Verified' : 'Pending'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#60a5fa', margin: 0 }}>Patient Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
                  <div style={{ backgroundColor: isDark ? '#020617' : '#f8fafc', padding: '10px', borderRadius: '10px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1' }}>
                    <span style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Name</span>
                    <strong style={{ fontSize: '13px' }}>{selectedPatient.name || 'N/A'}</strong>
                  </div>
                  <div style={{ backgroundColor: isDark ? '#020617' : '#f8fafc', padding: '10px', borderRadius: '10px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1' }}>
                    <span style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Age</span>
                    <strong style={{ fontSize: '13px' }}>{selectedPatient.age || 'N/A'} yrs</strong>
                  </div>
                  <div style={{ backgroundColor: isDark ? '#020617' : '#f8fafc', padding: '10px', borderRadius: '10px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1' }}>
                    <span style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Case</span>
                    <strong style={{ fontSize: '13px', color: '#34d399' }}>{selectedPatient.caseType || 'AYUSH'}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#60a5fa', margin: 0 }}>Symptoms & Complaints</h4>
                <div style={{ padding: '12px', backgroundColor: isDark ? '#020617' : '#f8fafc', borderRadius: '10px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', fontSize: '13px', lineHeight: 1.5 }}>
                  {selectedPatient.symptoms}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <div style={{ backgroundColor: isDark ? '#020617' : '#f8fafc', padding: '12px', borderRadius: '10px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <ShieldAlert size={12} /> ChromaDB RAG Check
                  </span>
                  <p style={{ fontSize: '12px', margin: 0, color: isDark ? '#cbd5e1' : '#475569' }}>{selectedPatient.rag_safety}</p>
                </div>

                <div style={{ backgroundColor: isDark ? '#020617' : '#f8fafc', padding: '12px', borderRadius: '10px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <History size={12} /> Vault History
                  </span>
                  <p style={{ fontSize: '12px', margin: 0, color: isDark ? '#cbd5e1' : '#475569' }}>{selectedPatient.history}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#60a5fa', margin: 0 }}>Current Prescription Draft</h4>
                <div style={{ padding: '12px', backgroundColor: isDark ? '#064e3b' : '#d1fae5', borderRadius: '10px', border: '1px solid #10b981', fontSize: '13px', color: isDark ? '#34d399' : '#065f46', fontWeight: 600 }}>
                  {selectedPatient.prescription || 'Pending doctor consultation.'}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', paddingTop: '10px', borderTop: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: '100%' }}>
                  <button
                    onClick={() => setActiveVideoCall(selectedPatient)}
                    style={{
                      flex: 1, padding: '10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa',
                      border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '10px', fontWeight: 700, fontSize: '12px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                    }}
                  >
                    <Video size={14} /> Video Call
                  </button>

                  <button
                    onClick={() => setActivePrescriptionModal(selectedPatient)}
                    style={{
                      flex: 1, padding: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', fontWeight: 700, fontSize: '12px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                    }}
                  >
                    <PlusCircle size={14} /> Add Rx
                  </button>
                </div>

                <div style={{ width: '100%', marginTop: '4px' }}>
                  {selectedPatient.status !== 'Approved & E-Signed' ? (
                    <button
                      onClick={() => handleApprove(selectedPatient.id)}
                      style={{
                        width: '100%', padding: '12px', backgroundColor: '#10b981', color: '#ffffff',
                        border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '13px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      <Check size={16} /> E-Sign & Verify Case
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#34d399', fontSize: '12px', fontWeight: 800, padding: '8px' }}>
                      <CheckCircle2 size={16} /> Case Verified & E-Signed ✓
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
              Select a patient from the list to view their complete file.
            </div>
          )}

        </div>

      </main>

      {/* Prescription Modal */}
      {activePrescriptionModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1300,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{
            backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
            borderRadius: '20px', width: '100%', maxWidth: '480px', padding: '20px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>Add Prescription & Upload Slip</h3>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>Patient: {activePrescriptionModal.name}</p>
              </div>
              <button onClick={() => setActivePrescriptionModal(null)} style={{ background: 'none', border: 'none', color: isDark ? '#fff' : '#0f172a', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>Prescribed Medicines / Treatment</label>
              <textarea
                rows={3}
                placeholder="e.g. 1. Ashwagandha 500mg twice daily..."
                value={newRxText}
                onChange={(e) => setNewRxText(e.target.value)}
                style={{ padding: '10px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '8px', color: isDark ? '#fff' : '#0f172a', fontSize: '13px', outline: 'none', resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase' }}>Upload Prescription Slip (PDF / Image)</label>
              <label style={{
                border: isDark ? '2px dashed #334155' : '2px dashed #cbd5e1',
                padding: '14px',
                borderRadius: '10px',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc'
              }}>
                <Upload size={20} color="#60a5fa" />
                <span style={{ fontSize: '11px', fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569' }}>Click to upload slip or signed report</span>
                <input type="file" multiple onChange={handleFileUploadByDoctor} style={{ display: 'none' }} />
              </label>

              {uploadedSlipFiles.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                  {uploadedSlipFiles.map((fname, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#60a5fa' }}>
                      <FileText size={12} /> <span>{fname}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                onClick={() => setActivePrescriptionModal(null)}
                style={{ flex: 1, padding: '10px', backgroundColor: '#1e293b', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSavePrescriptionToPatientFolder(activePrescriptionModal.patient_id)}
                style={{ flex: 2, padding: '10px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '12px' }}
              >
                Save & Sync
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {activeVideoCall && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(10px)', zIndex: 1000,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: '16px', boxSizing: 'border-box', overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Consult: <span style={{ color: '#34d399' }}>{activeVideoCall.name}</span>
              </h3>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>ID: {activeVideoCall.patient_id}</p>
            </div>
            <button
              onClick={() => setActiveVideoCall(null)}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '6px', borderRadius: '50%', color: '#ffffff', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', maxWidth: '1200px', margin: '12px auto', width: '100%', flex: 1 }}>
            <div style={{
              backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden', minHeight: '220px'
            }}>
              {!isVideoOff ? (
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '56px', height: '56px', backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                    <Video size={26} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Live Stream Active</span>
                </div>
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '13px' }}>Video Stream Off</div>
              )}
            </div>

            <div style={{
              backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b',
              padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px'
            }}>
              <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#34d399', margin: 0 }}>Consult Notes</h4>
              <div style={{ fontSize: '11px', color: '#cbd5e1' }}><strong>Symptoms:</strong> {activeVideoCall.symptoms}</div>
              <div style={{ fontSize: '11px', color: '#cbd5e1' }}><strong>RAG:</strong> {activeVideoCall.rag_safety}</div>
              <div style={{ fontSize: '11px', color: '#cbd5e1' }}><strong>Rx:</strong> {activeVideoCall.prescription}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', maxWidth: '1200px', margin: '0 auto', width: '100%', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: isMuted ? '#dc2626' : '#1e293b', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: isVideoOff ? '#dc2626' : '#1e293b', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}
            >
              {isVideoOff ? 'Start Video' : 'Stop Video'}
            </button>
            <button
              onClick={() => setActiveVideoCall(null)}
              style={{ padding: '10px 18px', borderRadius: '10px', backgroundColor: '#dc2626', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        padding: '14px 16px',
        borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '6px',
        fontSize: '11px',
        color: '#94a3b8',
        backgroundColor: isDark ? 'rgba(2, 6, 23, 0.9)' : 'rgba(255, 255, 255, 0.9)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="#60a5fa" />
          <span>Telehealth Console • HIPAA & ABHA Compliant</span>
        </div>
        <div>ArogyaKiosk Prototype</div>
      </footer>
    </div>
  );
}
