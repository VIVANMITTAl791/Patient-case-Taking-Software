'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, Activity, ArrowRight, UserCheck, Sun, Moon, 
  ArrowLeft, AlertCircle, Upload, FileText, Rocket, X, Send, 
  Home as HomeIcon, FileText as FileTextIcon, Bell, BookOpen, PhoneCall, HelpCircle, Heart, Thermometer, Calendar, Weight, Droplets 
} from 'lucide-react';

export default function PatientLogin() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [fontSizeScale, setFontSizeScale] = useState(16);
  const [screenReaderActive, setScreenReaderActive] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);

  // Floating AI Assistant State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { sender: 'ai', text: 'Welcome to ArogyaKiosk Patient Gateway! Log in using your ABHA, National ID, or Mobile Number, or register a new health profile.' }
  ]);
  
  const [step, setStep] = useState(1);
  const [idType, setIdType] = useState('abha'); // 'abha' | 'national_id' | 'mobile'
  const [accountMode, setAccountMode] = useState('existing'); // 'existing' | 'new'
  const [identifierValue, setIdentifierValue] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Updated detailed patient fields including DOB, Weight, BP, Sugar & Emergency Contact
  const [formData, setFormData] = useState({
    fullName: '',
    parentName: '',
    gender: 'Male',
    dob: '',
    weight: '',
    bp: '',
    sugar: '',
    emergencyContact: '',
    bloodGroup: 'O+',
    address: '',
    newPassword: '',
    confirmPassword: '',
    uploadedReports: [] as string[]
  });

  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let aiReply = "For login assistance, please enter your 14-digit ABHA ID, 12-digit National ID, or 10-digit mobile number. If you are new, select 'Create New Account'.";
      const lower = userMsg.toLowerCase();
      if (lower.includes('abha') || lower.includes('id')) {
        aiReply = "ABHA ID must be exactly 14 numeric digits. You can link your Ayushman Bharat health records seamlessly.";
      } else if (lower.includes('password') || lower.includes('signup')) {
        aiReply = "New passwords require at least 6 characters, including an uppercase letter and a number.";
      } else if (lower.includes('bp') || lower.includes('sugar') || lower.includes('weight')) {
        aiReply = "Entering your vital health metrics (BP, Sugar, Weight) during registration helps doctors assess your risk level instantly in the command center.";
      }
      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
    }, 500);
  };

  const toggleScreenReader = () => {
    const newState = !screenReaderActive;
    setScreenReaderActive(newState);
    if (newState && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance("Screen reader active on ArogyaKiosk Patient Authentication Portal."));
      alert("Screen Reader Access Enabled.");
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      alert("Screen Reader Access Disabled.");
    }
  };

  const validateIdentifier = (type: string, val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, '');
    if (type === 'abha' && cleanVal.length !== 14) {
      return 'Please enter a correct 14-digit ABHA number.';
    } else if (type === 'national_id' && cleanVal.length !== 12) {
      return 'Please enter a correct 12-digit ID number.';
    } else if (type === 'mobile' && cleanVal.length !== 10) {
      return 'Please enter a correct 10-digit mobile number.';
    }
    return '';
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const error = validateIdentifier(idType, identifierValue);
    if (error) {
      setErrorMessage(error);
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (accountMode === 'existing') {
      const savedAccounts = JSON.parse(localStorage.getItem('registered_patients') || '{}');
      const userKey = `${idType}_${identifierValue}`;

      if (!savedAccounts[userKey]) {
        setErrorMessage('Account not found! Please register first by selecting "Create New Account".');
        return;
      }

      if (savedAccounts[userKey].password !== password) {
        setErrorMessage('Incorrect password. Please try again.');
        return;
      }

      localStorage.setItem('patient_session', JSON.stringify(savedAccounts[userKey]));
      router.push('/patient/ayush-triage');

    } else {
      const savedAccounts = JSON.parse(localStorage.getItem('registered_patients') || '{}');
      const userKey = `${idType}_${identifierValue}`;

      if (savedAccounts[userKey]) {
        setErrorMessage('Account already exists! Please switch to "Existing Account" to login.');
        return;
      }

      setStep(2);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file: File) => file.name);
      setFormData(prev => ({
        ...prev,
        uploadedReports: [...prev.uploadedReports, ...filesArray]
      }));
    }
  };

  const handleFinalRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName || !formData.dob || !formData.weight || !formData.address) {
      setErrorMessage('Please fill in all mandatory clinical and personal fields.');
      return;
    }

    const pwd = formData.newPassword;
    if (pwd.length < 6 || !/\d/.test(pwd) || !/[A-Z]/.test(pwd)) {
      setErrorMessage('Password must be at least 6 characters long and include an uppercase letter and a number.');
      return;
    }

    if (pwd !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const savedAccounts = JSON.parse(localStorage.getItem('registered_patients') || '{}');
    const userKey = `${idType}_${identifierValue}`;

    const newPatientProfile = {
      patient_id: identifierValue,
      idType: idType,
      password: pwd,
      ...formData
    };

    savedAccounts[userKey] = newPatientProfile;
    localStorage.setItem('registered_patients', JSON.stringify(savedAccounts));
    localStorage.setItem('patient_session', JSON.stringify(newPatientProfile));

    router.push('/patient/ayush-triage');
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
      fontSize: `${fontSizeScale}px`
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
        padding: '14px 16px',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
        backgroundColor: isDark ? 'rgba(2, 6, 23, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ padding: '8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: '10px', color: '#10b981' }}>
            <Activity size={20} />
          </div>
          <span style={{ fontSize: '16px', fontWeight: 800 }}>ArogyaKiosk • Patient Gateway</span>
        </div>

        <button
          onClick={() => setIsDark(!isDark)}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            color: isDark ? '#facc15' : '#0f172a',
            border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {isDark ? <Sun size={13} /> : <Moon size={13} />}
          <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </header>

      {/* 2. SECONDARY SUB-NAVBAR */}
      <div style={{
        backgroundColor: isDark ? '#060a12' : '#e2e8f0',
        borderBottom: isDark ? '1px solid #1e293b' : '1px solid #cbd5e1',
        padding: '10px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '12px', fontWeight: 700 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#10b981' }} onClick={() => router.push('/')}>
            <HomeIcon size={14} /> Home
          </span>
          <span onClick={() => setModalContent({ title: 'About Us', body: 'ArogyaKiosk is an AI-powered decentralized health platform developed for SIH 2026.' })} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: isDark ? '#cbd5e1' : '#334155' }}>
            <FileTextIcon size={14} /> About
          </span>
          <span onClick={() => setModalContent({ title: 'Rules Compliance', body: 'Operating under telemedicine guidelines and Ministry of Ayush clinical protocols.' })} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: isDark ? '#cbd5e1' : '#334155' }}>
            <BookOpen size={14} /> Rules
          </span>
          <span onClick={() => setModalContent({ title: 'Contact Support', body: 'AYUSH BHAWAN, NEW DELHI\nSupport Email: support@arogyakiosk.gov.in' })} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: isDark ? '#cbd5e1' : '#334155' }}>
            <PhoneCall size={14} /> Contact
          </span>
        </div>
      </div>

      {/* Main Container */}
      <main style={{ maxWidth: '580px', margin: 'auto', padding: '24px 16px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
          padding: '24px 20px',
          borderRadius: '24px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          
          {errorMessage && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              color: '#ef4444',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleStep1Submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '44px', height: '44px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#34d399' }}>
                  <UserCheck size={22} />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Patient Authentication</h2>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Select verification type and account status</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>Select ID Type</label>
                <select
                  value={idType}
                  onChange={(e) => { setIdType(e.target.value); setErrorMessage(''); }}
                  style={{
                    padding: '12px',
                    backgroundColor: isDark ? '#020617' : '#f8fafc',
                    border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                    borderRadius: '10px',
                    color: isDark ? '#ffffff' : '#0f172a',
                    fontSize: '13px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="abha">ABHA ID (14 digits)</option>
                  <option value="national_id">National ID / Gov ID (12 digits)</option>
                  <option value="mobile">Registered Mobile Number (10 digits)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>Account Status</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => { setAccountMode('existing'); setErrorMessage(''); }}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: accountMode === 'existing' ? '2px solid #10b981' : (isDark ? '1px solid #334155' : '1px solid #cbd5e1'),
                      backgroundColor: accountMode === 'existing' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                      color: isDark ? '#ffffff' : '#0f172a'
                    }}
                  >
                    Existing Account
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAccountMode('new'); setErrorMessage(''); }}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: accountMode === 'new' ? '2px solid #10b981' : (isDark ? '1px solid #334155' : '1px solid #cbd5e1'),
                      backgroundColor: accountMode === 'new' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                      color: isDark ? '#ffffff' : '#0f172a'
                    }}
                  >
                    Create New Account
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>
                  {idType === 'abha' ? 'Enter 14-Digit ABHA ID' : idType === 'national_id' ? 'Enter 12-Digit Government ID' : 'Enter 10-Digit Mobile Number'}
                </label>
                <input
                  type="text"
                  placeholder={idType === 'abha' ? '14 digit number' : idType === 'national_id' ? '12 digit number' : '10 digit mobile'}
                  value={identifierValue}
                  onChange={(e) => { setIdentifierValue(e.target.value); setErrorMessage(''); }}
                  style={{
                    padding: '12px',
                    backgroundColor: isDark ? '#020617' : '#f8fafc',
                    border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                    borderRadius: '10px',
                    color: isDark ? '#ffffff' : '#0f172a',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>Password</label>
                <input
                  type="password"
                  placeholder="Enter your secure password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
                  style={{
                    padding: '12px',
                    backgroundColor: isDark ? '#020617' : '#f8fafc',
                    border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                    borderRadius: '10px',
                    color: isDark ? '#ffffff' : '#0f172a',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '6px',
                  padding: '12px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)'
                }}
              >
                <span>{accountMode === 'existing' ? 'Login to Triage' : 'Next: Clinical Vitals'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleFinalRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <button
                  type="button"
                  onClick={() => { setStep(1); setErrorMessage(''); }}
                  style={{ background: 'none', border: 'none', color: '#34d399', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700 }}
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Step 2 of 2: Health Profile</span>
              </div>

              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Create Patient Health Profile</h2>
                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Vital parameters for AI triage & doctor review</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={{ padding: '10px 12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '8px', color: isDark ? '#ffffff' : '#0f172a', fontSize: '13px', outline: 'none' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>DOB *</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    style={{ padding: '10px 12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '8px', color: isDark ? '#ffffff' : '#0f172a', fontSize: '13px', outline: 'none' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    style={{ padding: '10px 12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '8px', color: isDark ? '#ffffff' : '#0f172a', fontSize: '13px', outline: 'none' }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* VITALS FIELDS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#34d399' }}>Weight (kg) *</label>
                  <input
                    type="text"
                    placeholder="e.g. 68"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    style={{ padding: '10px 8px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '8px', color: isDark ? '#ffffff' : '#0f172a', fontSize: '12px', outline: 'none' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#34d399' }}>BP (mmHg)</label>
                  <input
                    type="text"
                    placeholder="120/80"
                    value={formData.bp}
                    onChange={(e) => setFormData({ ...formData, bp: e.target.value })}
                    style={{ padding: '10px 8px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '8px', color: isDark ? '#ffffff' : '#0f172a', fontSize: '12px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#34d399' }}>Sugar (mg/dL)</label>
                  <input
                    type="text"
                    placeholder="110 Fast"
                    value={formData.sugar}
                    onChange={(e) => setFormData({ ...formData, sugar: e.target.value })}
                    style={{ padding: '10px 8px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '8px', color: isDark ? '#ffffff' : '#0f172a', fontSize: '12px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>Emergency Contact</label>
                  <input
                    type="text"
                    placeholder="Emergency Phone"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    style={{ padding: '10px 12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '8px', color: isDark ? '#ffffff' : '#0f172a', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    style={{ padding: '10px 12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '8px', color: isDark ? '#ffffff' : '#0f172a', fontSize: '13px', outline: 'none' }}
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>Create Password *</label>
                  <input
                    type="password"
                    placeholder="Min 6 chars"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    style={{ padding: '10px 12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '8px', color: isDark ? '#ffffff' : '#0f172a', fontSize: '13px', outline: 'none' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>Confirm Password *</label>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    style={{ padding: '10px 12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '8px', color: isDark ? '#ffffff' : '#0f172a', fontSize: '13px', outline: 'none' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#34d399' }}>Upload Reports</label>
                <label style={{
                  border: isDark ? '2px dashed #334155' : '2px dashed #cbd5e1',
                  padding: '12px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc'
                }}>
                  <Upload size={18} color="#34d399" />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569' }}>Click to upload files</span>
                  <input type="file" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
                {formData.uploadedReports.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                    {formData.uploadedReports.map((fileName, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#34d399' }}>
                        <FileText size={12} /> <span>{fileName}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>Address *</label>
                <textarea
                  rows={2}
                  placeholder="House No, Locality, City"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={{ padding: '10px 12px', backgroundColor: isDark ? '#020617' : '#f8fafc', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', borderRadius: '8px', color: isDark ? '#ffffff' : '#0f172a', fontSize: '13px', outline: 'none', resize: 'none' }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '6px',
                  padding: '12px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)'
                }}
              >
                <span>Register & Complete Health Profile</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

        </div>
      </main>

      {/* Interactive Modal */}
      {modalContent && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '16px'
        }}>
          <div style={{
            backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
            borderRadius: '20px', padding: '24px', maxWidth: '460px', width: '100%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: '12px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#10b981' }}>{modalContent.title}</h3>
            <p style={{ fontSize: '13px', color: isDark ? '#cbd5e1' : '#475569', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-line' }}>{modalContent.body}</p>
            <button
              onClick={() => setModalContent(null)}
              style={{ marginTop: '8px', padding: '10px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* FLOATING AI ASSISTANT */}
      <div style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: 1200 }}>
        {!isAiOpen ? (
          <button
            onClick={() => setIsAiOpen(true)}
            style={{
              width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#10b981', color: '#ffffff',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)'
            }}
            title="ArogyaKiosk AI Assistant"
          >
            <Rocket size={22} />
          </button>
        ) : (
          <div style={{
            width: 'calc(100vw - 32px)', maxWidth: '350px', height: '440px', backgroundColor: isDark ? '#0f172a' : '#ffffff',
            border: isDark ? '1px solid #1e293b' : '1px solid #cbd5e1', borderRadius: '20px',
            display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', overflow: 'hidden'
          }}>
            <div style={{ padding: '12px 16px', borderBottom: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isDark ? '#020617' : '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '6px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderRadius: '50%' }}>
                  <Rocket size={16} />
                </div>
                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: 800, margin: 0 }}>ArogyaKiosk Assistant</h3>
                  <p style={{ fontSize: '9px', color: '#94a3b8', margin: 0 }}>Login Help</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiOpen(false)}
                style={{ background: 'none', border: 'none', color: isDark ? '#ffffff' : '#0f172a', cursor: 'pointer', padding: '4px' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', lineHeight: 1.4,
                  backgroundColor: msg.sender === 'user' ? '#10b981' : (isDark ? '#1e293b' : '#f1f5f9'),
                  color: msg.sender === 'user' ? '#ffffff' : (isDark ? '#e2e8f0' : '#0f172a')
                }}>
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleAiSend} style={{ padding: '10px', borderTop: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder="Ask for help..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{
                  flex: 1, padding: '8px 10px', borderRadius: '8px',
                  backgroundColor: isDark ? '#020617' : '#f8fafc',
                  border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                  color: isDark ? '#ffffff' : '#0f172a', fontSize: '12px', outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '8px 12px', backgroundColor: '#10b981', color: '#ffffff',
                  border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <Send size={13} />
              </button>
            </form>
          </div>
        )}
      </div>

      <footer style={{
        padding: '16px',
        borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '11px',
        color: '#94a3b8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="#34d399" />
          <span>Secure Authentication & Archiving</span>
        </div>
        <div>ArogyaKiosk Prototype</div>
      </footer>
    </div>
  );
}
