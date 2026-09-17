'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  HeartPulse, Stethoscope, ShieldCheck, Activity, ArrowRight, 
  Database, Sparkles, Sun, Moon, PhoneCall, HelpCircle, Radio, 
  CheckCircle2, Cpu, Lock, Zap, Award, Globe, Rocket, X, Send, Share2, MessageCircle, Home as HomeIcon, FileText, Bell, BookOpen 
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [fontSizeScale, setFontSizeScale] = useState(16);
  const [visitorCount] = useState(946601);

  // Modal State for Portal Links & Footer Useful Links
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { sender: 'ai', text: 'Welcome to ArogyaKiosk! I am your Astronaut Assistant. Are you a Patient looking for triage or a Doctor logging into the Command Center?' }
  ]);

  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    const newMessages = [...messages, { sender: 'user', text: userMsg }];
    setMessages(newMessages);
    setChatInput('');

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let aiReply = "I am specifically programmed to assist with ArogyaKiosk navigation and features only.";

      if (lower.includes('patient') || lower.includes('triage') || lower.includes('login') || lower.includes('portal')) {
        aiReply = "Patients can click on 'Patient Portal & AYUSH' below to log in using ABHA or Mobile number, fill questionnaires, and upload medical vault reports.";
      } else if (lower.includes('doctor') || lower.includes('command') || lower.includes('queue')) {
        aiReply = "Doctors can click the 'Doctor Login' button on the top right to access the live triage queue, ChromaDB safety flags, and e-sign prescriptions.";
      } else if (lower.includes('sos') || lower.includes('emergency')) {
        aiReply = "The SOS 108 button at the top instantly triggers emergency ambulance dispatch protocols and alerts nearby nodal health centers.";
      } else if (lower.includes('rag') || lower.includes('ai') || lower.includes('chromadb')) {
        aiReply = "Our system uses local ChromaDB vector databases to run real-time safety checks against herb-drug interactions for AYUSH and Allopathy treatments.";
      } else {
        aiReply = "ArogyaKiosk is an AI-powered multi-stream health platform supporting Ayurveda, Yoga, Unani, Siddha, Homeopathy, and Allopathy.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
    }, 500);
  };

  const handleThemeToggle = () => {
    const nextState = !isDark;
    setIsDark(nextState);
    if (nextState) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#020617';
      document.documentElement.style.color = '#ffffff';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#f8fafc';
      document.documentElement.style.color = '#0f172a';
    }
  };

  // Click handler for Portals & Useful Links
  const handleLinkClick = (name: string) => {
    let title = name;
    let body = "";

    switch (name) {
      case 'india.gov.in':
        title = "National Portal of India (india.gov.in)";
        body = "The National Portal of India provides a single-window access to information and services being provided by the various Indian Government entities.";
        break;
      case 'Ministry of Ayush':
        title = "Ministry of Ayush, Government of India";
        body = "The Ministry of Ayush is tasked with developing education, research and propagation of indigenous alternative medicine systems in India, including Ayurveda, Yoga, Unani, Siddha, and Homeopathy.";
        break;
      case 'Digital India':
        title = "Digital India Initiative";
        body = "Digital India is a campaign launched by the Government of India to ensure that government services are made available to citizens electronically by improved online infrastructure.";
        break;
      case 'GatiShakti':
        title = "PM GatiShakti National Master Plan";
        body = "PM GatiShakti is a digital platform bringing 16 ministries including Railways and Roadways together for integrated planning and coordinated implementation of infrastructure connectivity projects.";
        break;
      case 'MyGov India':
        title = "MyGov India Citizen Engagement Platform";
        body = "MyGov is a citizen-centric platform that empowers people to connect with the Government and contribute towards good governance.";
        break;
      case 'Website Policies':
        title = "ArogyaKiosk Website Policies";
        body = "Includes Hyperlinking Policy, Copyright Policy, Privacy Policy, and Terms & Conditions compliant with Government of India web guidelines.";
        break;
      case 'Terms and Conditions':
        title = "Terms and Conditions";
        body = "By accessing ArogyaKiosk, you agree to abide by the national telemedicine standards and Ministry of Ayush digital health compliance rules.";
        break;
      case 'Sitemap & FAQs':
        title = "Sitemap & Frequently Asked Questions";
        body = "Q: How do I link my ABHA ID?\nA: Enter your 14-digit ABHA ID on the patient login or triage screen to instantly sync your health records.";
        break;
      case 'User Manual':
        title = "ArogyaKiosk Official User Manual";
        body = "Step 1: Authenticate via ABHA or Mobile Number.\nStep 2: Select healthcare stream (Allopathy or AYUSH).\nStep 3: Complete AI triage questionnaire with voice support.\nStep 4: Connect with Doctor Command Center.";
        break;
      default:
        title = name;
        body = `Redirecting to official government portal for ${name}...`;
    }

    setModalContent({ title, body });
  };

  useEffect(() => {
    document.documentElement.style.backgroundColor = '#020617';
    document.documentElement.style.color = '#ffffff';
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: isDark ? '#020617' : '#f8fafc',
      color: isDark ? '#ffffff' : '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      fontFamily: 'sans-serif',
      fontSize: `${fontSizeScale}px`,
      transition: 'all 0.3s ease',
      position: 'relative'
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
          <span style={{ cursor: 'pointer' }}>Screen Reader Access</span>
          <span>|</span>
          <span style={{ cursor: 'pointer' }}>Skip to main content</span>
        </div>
      </div>

      {/* Top Navbar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 32px',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
        backgroundColor: isDark ? 'rgba(2, 6, 23, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ padding: '10px', backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px', color: '#10b981' }}>
            <HeartPulse size={24} />
          </div>
          <div>
            <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '0.05em', display: 'block' }}>
              AROGYAKIOSK
            </span>
            <span style={{ fontSize: '9px', color: '#34d399', fontWeight: 700, letterSpacing: '0.1em' }}>
              AI + AYUSH SMART HEALTH GATEWAY
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href="tel:108"
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
            }}
          >
            <PhoneCall size={14} />
            <span>SOS 108</span>
          </a>

          <button
            onClick={() => setShowHelp(true)}
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
              color: '#34d399',
              border: isDark ? '1px solid #334155' : '1px solid #cbd5e1'
            }}
          >
            <HelpCircle size={14} />
            <span>Guide</span>
          </button>

          <button
            onClick={handleThemeToggle}
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
            onClick={() => router.push('/doctor')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#0f172a',
              color: '#ffffff',
              border: 'none'
            }}
          >
            <Stethoscope size={14} color="#34d399" />
            <span>Doctor Login</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1100px', margin: 'auto', padding: '60px 24px', width: '100%', display: 'flex', flexDirection: 'column', gap: '80px', boxSizing: 'border-box' }}>
        
        {/* HERO SECTION */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '9999px',
              color: '#34d399',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              <Sparkles size={14} color="#facc15" />
              <span>Smart India Hackathon • Enterprise Prototype</span>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '9999px',
              color: '#60a5fa',
              fontSize: '12px',
              fontWeight: 600
            }}>
              <Radio size={14} className="animate-pulse" />
              <span>FastAPI + ChromaDB RAG Active</span>
            </div>
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, margin: 0 }}>
            Self Service, <br />
            <span style={{ color: '#34d399' }}>Simplified Health.</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: isDark ? '#94a3b8' : '#475569', maxWidth: '750px', lineHeight: 1.6, margin: 0 }}>
            Next-gen decentralized AI triage kiosk. Instant local RAG-powered safety checks, ABHA ID sync, multi-stream AYUSH guidance, and live doctor consultations built for rural and urban healthcare centers.
          </p>

          {/* Action Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '20px' }}>
            <div 
              onClick={() => router.push('/patient/login')}
              style={{
                padding: '36px',
                borderRadius: '28px',
                cursor: 'pointer',
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', filter: 'blur(20px)' }}></div>
              <div style={{ padding: '14px', backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: '18px', width: 'fit-content', color: '#34d399', marginBottom: '20px' }}>
                <Activity size={32} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Patient Portal & AYUSH <ArrowRight size={22} color="#34d399" />
              </h3>
              <p style={{ fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.6 }}>
                Login via ABHA or Mobile number. Choose from Ayurveda, Yoga, Unani, Siddha, and Homeopathy streams with voice-to-text RAG checks.
              </p>
            </div>

            <div 
              onClick={() => router.push('/doctor')}
              style={{
                padding: '36px',
                borderRadius: '28px',
                cursor: 'pointer',
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', filter: 'blur(20px)' }}></div>
              <div style={{ padding: '14px', backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: '18px', width: 'fit-content', color: '#60a5fa', marginBottom: '20px' }}>
                <Stethoscope size={32} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Doctor Command Center <ArrowRight size={22} color="#60a5fa" />
              </h3>
              <p style={{ fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.6 }}>
                Access real-time patient triage queues, review AI risk alerts, monitor clinical safety flags, and e-sign digital prescriptions instantly.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: HOW IT WORKS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: 'auto' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Seamless Workflow</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '8px 0 12px 0' }}>How ArogyaKiosk Works</h2>
            <p style={{ fontSize: '1rem', color: isDark ? '#94a3b8' : '#64748b' }}>Designed for extreme ease of use in public health centers and community clinics.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '45px', height: '45px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '18px' }}>01</div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>ABHA / ID Verification</h3>
              <p style={{ fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b', margin: 0, lineHeight: 1.6 }}>Authenticate securely using your 14-digit ABHA ID or registered mobile number with password protection.</p>
            </div>

            <div style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '45px', height: '45px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '18px' }}>02</div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>AI Triage & AYUSH Stream</h3>
              <p style={{ fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b', margin: 0, lineHeight: 1.6 }}>Select Allopathy or traditional AYUSH care (Ayurveda, Yoga, Unani, Siddha, Homeopathy) and speak/type symptoms in Hindi or English.</p>
            </div>

            <div style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '45px', height: '45px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '18px' }}>03</div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Doctor Sync & E-Sign</h3>
              <p style={{ fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b', margin: 0, lineHeight: 1.6 }}>Live queue syncs your case with the doctor's dashboard. Get instant digital prescriptions delivered via automated SMS/WhatsApp alerts.</p>
            </div>
          </div>
        </section>

        {/* SECTION 3: KEY ENTERPRISE FEATURES */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: 'auto' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cutting-Edge Tech</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '8px 0 12px 0' }}>Enterprise & Security Highlights</h2>
            <p style={{ fontSize: '1rem', color: isDark ? '#94a3b8' : '#64748b' }}>Engineered to meet national digital health infrastructure standards.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', padding: '24px', borderRadius: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ padding: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderRadius: '12px' }}><Cpu size={22} /></div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0' }}>Local RAG Engine</h4>
                <p style={{ fontSize: '13px', color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>ChromaDB vector search cross-checks clinical safety and herb-drug interactions.</p>
              </div>
            </div>

            <div style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', padding: '24px', borderRadius: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ padding: '10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '12px' }}><Lock size={22} /></div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0' }}>ABHA Compliance</h4>
                <p style={{ fontSize: '13px', color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>Decentralized health record management following Ayushman Bharat guidelines.</p>
              </div>
            </div>

            <div style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', padding: '24px', borderRadius: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ padding: '10px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '12px' }}><Globe size={22} /></div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0' }}>Bilingual Voice</h4>
                <p style={{ fontSize: '13px', color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>Seamless Web Speech API integration supporting Hindi and English voice inputs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* WORKABLE IMPORTANT LINKS BADGES */}
        <section style={{
          backgroundColor: isDark ? '#090d16' : '#e2e8f0',
          padding: '30px 24px',
          borderRadius: '20px',
          border: isDark ? '1px solid #1e293b' : '1px solid #cbd5e1',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1px' }}>
            Our Important Portals & Links
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', flexWrap: 'wrap', maxWidth: '1000px', margin: '0 auto' }}>
            {['india.gov.in', 'Ministry of Ayush', 'Digital India', 'GatiShakti', 'MyGov India'].map((badge, idx) => (
              <div 
                key={idx} 
                onClick={() => handleLinkClick(badge)}
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                  border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', 
                  borderRadius: '10px', 
                  fontSize: '13px', 
                  fontWeight: 700, 
                  color: '#34d399', 
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s' 
                }}
              >
                {badge} ↗
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Interactive Modal for Links */}
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
              Close Portal View
            </button>
          </div>
        </div>
      )}

      {/* Quick Help Modal */}
      {showHelp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#34d399' }}>ArogyaKiosk User Guide</h3>
            <p style={{ fontSize: '14px', color: isDark ? '#cbd5e1' : '#475569', lineHeight: 1.6, margin: 0 }}>
              1. Click on <strong>Patient Portal & AYUSH</strong> to login or register using ABHA ID or Mobile Number.<br/>
              2. Select your preferred healthcare domain (Allopathy or AYUSH streams like Ayurveda/Yoga).<br/>
              3. Use <strong>Voice Input</strong> or text to describe your symptoms in Hindi or English.<br/>
              4. Review RAG safety assessment and download your digital prescription slip.
            </p>
            <button
              onClick={() => setShowHelp(false)}
              style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Got it, Close Guide
            </button>
          </div>
        </div>
      )}

      {/* FLOATING ASTRONAUT AI ASSISTANT */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1200 }}>
        {!isAiOpen ? (
          <button
            onClick={() => setIsAiOpen(true)}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.5)'
            }}
            title="ArogyaKiosk AI Assistant"
          >
            <Rocket size={28} />
          </button>
        ) : (
          <div style={{
            width: '360px',
            height: '480px',
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            border: isDark ? '1px solid #1e293b' : '1px solid #cbd5e1',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '16px 20px', borderBottom: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isDark ? '#020617' : '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderRadius: '50%' }}>
                  <Rocket size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>ArogyaKiosk Astronaut</h3>
                  <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>App Scope Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiOpen(false)}
                style={{ background: 'none', border: 'none', color: isDark ? '#ffffff' : '#0f172a', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  lineHeight: 1.4,
                  backgroundColor: msg.sender === 'user' ? '#10b981' : (isDark ? '#1e293b' : '#f1f5f9'),
                  color: msg.sender === 'user' ? '#ffffff' : (isDark ? '#e2e8f0' : '#0f172a')
                }}>
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleAiSend} style={{ padding: '12px', borderTop: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Ask about app features..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: isDark ? '#020617' : '#f8fafc',
                  border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                  color: isDark ? '#ffffff' : '#0f172a',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* OFFICIAL MINISTRY FOOTER WITH WORKABLE USEFUL LINKS */}
      <footer style={{
        backgroundColor: '#070b14',
        color: '#94a3b8',
        padding: '40px 32px 20px 32px',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        boxSizing: 'border-box'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontWeight: 800, fontSize: '16px' }}>
              <Stethoscope size={20} color="#10b981" /> ArogyaKiosk Enterprise
            </div>
            <p style={{ fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
              AYUSH BHAWAN, B Block, GPO Complex, INA, NEW DELHI - 110023
            </p>
            <p style={{ fontSize: '12px', margin: 0, color: '#34d399' }}>
              For Technical Help : support@arogyakiosk.gov.in
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#fff', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Useful Links</h4>
            <span onClick={() => handleLinkClick('Website Policies')} style={{ fontSize: '12px', cursor: 'pointer', color: '#60a5fa' }}>Website Policies</span>
            <span onClick={() => handleLinkClick('Terms and Conditions')} style={{ fontSize: '12px', cursor: 'pointer', color: '#60a5fa' }}>Terms and Conditions</span>
            <span onClick={() => handleLinkClick('Sitemap & FAQs')} style={{ fontSize: '12px', cursor: 'pointer', color: '#60a5fa' }}>Sitemap & FAQs</span>
            <span onClick={() => handleLinkClick('User Manual')} style={{ fontSize: '12px', cursor: 'pointer', color: '#60a5fa' }}>User Manual</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#fff', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Connect With Us</h4>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ padding: '8px', backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}><Share2 size={16} /></div>
              <div style={{ padding: '8px', backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}><Globe size={16} /></div>
              <div style={{ padding: '8px', backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}><MessageCircle size={16} /></div>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '10px' }}>
              LAST UPDATE VERSION : [13-SEP-2026] <br />
              VISITORS COUNT: <strong style={{ color: '#34d399' }}>{visitorCount}</strong>
            </div>
          </div>

        </div>

        <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', fontSize: '12px', color: '#64748b' }}>
          Website content owned by Ministry of Ayush, Government of India. Developed for Smart India Hackathon (SIH 2026).
        </div>
      </footer>

    </div>
  );
}