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
      position: 'relative',
      width: '100%',
      overflowX: 'hidden'
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
        gap: '10px',
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
          <span className="hidden sm:inline" style={{ cursor: 'pointer' }}>Screen Reader Access</span>
        </div>
      </div>

      {/* Top Navbar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 16px',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
        backgroundColor: isDark ? 'rgba(2, 6, 23, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ padding: '8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: '10px', color: '#10b981' }}>
            <HeartPulse size={22} />
          </div>
          <div>
            <span style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '0.05em', display: 'block' }}>
              AROGYAKIOSK
            </span>
            <span style={{ fontSize: '8px', color: '#34d399', fontWeight: 700, letterSpacing: '0.08em' }}>
              AI + AYUSH GATEWAY
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <a
            href="tel:108"
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              textDecoration: 'none'
            }}
          >
            <PhoneCall size={13} />
            <span>108</span>
          </a>

          <button
            onClick={() => setShowHelp(true)}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              color: '#34d399',
              border: isDark ? '1px solid #334155' : '1px solid #cbd5e1'
            }}
          >
            <HelpCircle size={13} />
            <span className="hidden sm:inline">Guide</span>
          </button>

          <button
            onClick={handleThemeToggle}
            style={{
              padding: '7px 12px',
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
            onClick={() => router.push('/doctor')}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: '12px',
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
            <Stethoscope size={13} color="#34d399" />
            <span>Doctor Login</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1100px', margin: 'auto', padding: '32px 16px', width: '100%', display: 'flex', flexDirection: 'column', gap: '48px', boxSizing: 'border-box' }}>
        
        {/* HERO SECTION */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '9999px',
              color: '#34d399',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              <Sparkles size={12} color="#facc15" />
              <span>SIH Enterprise Prototype</span>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '9999px',
              color: '#60a5fa',
              fontSize: '11px',
              fontWeight: 600
            }}>
              <Radio size={12} className="animate-pulse" />
              <span>FastAPI + ChromaDB Active</span>
            </div>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.15, margin: 0 }}>
            Self Service, <br />
            <span style={{ color: '#34d399' }}>Simplified Health.</span>
          </h1>

          <p style={{ fontSize: '1rem', color: isDark ? '#94a3b8' : '#475569', maxWidth: '750px', lineHeight: 1.6, margin: 0 }}>
            Next-gen decentralized AI triage kiosk. Instant local RAG-powered safety checks, ABHA ID sync, multi-stream AYUSH guidance, and live doctor consultations built for rural and urban healthcare centers.
          </p>

          {/* Action Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '12px' }}>
            <div 
              onClick={() => router.push('/patient/login')}
              style={{
                padding: '24px',
                borderRadius: '20px',
                cursor: 'pointer',
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: '14px', width: 'fit-content', color: '#34d399', marginBottom: '16px' }}>
                <Activity size={26} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Patient Portal & AYUSH <ArrowRight size={20} color="#34d399" />
              </h3>
              <p style={{ fontSize: '13px', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.5, margin: 0 }}>
                Login via ABHA or Mobile number. Select AYUSH / Allopathy streams with voice-to-text RAG checks.
              </p>
            </div>

            <div 
              onClick={() => router.push('/doctor')}
              style={{
                padding: '24px',
                borderRadius: '20px',
                cursor: 'pointer',
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '12px', backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: '14px', width: 'fit-content', color: '#60a5fa', marginBottom: '16px' }}>
                <Stethoscope size={26} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Doctor Command Center <ArrowRight size={20} color="#60a5fa" />
              </h3>
              <p style={{ fontSize: '13px', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.5, margin: 0 }}>
                Access live patient queues, review AI risk alerts, monitor clinical safety flags, and e-sign digital prescriptions.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: HOW IT WORKS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: 'auto' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Seamless Workflow</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, margin: '6px 0 8px 0' }}>How ArogyaKiosk Works</h2>
            <p style={{ fontSize: '0.9rem', color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>Designed for extreme ease of use in public health centers and community clinics.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', padding: '24px', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '16px' }}>01</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>ABHA / ID Verification</h3>
              <p style={{ fontSize: '13px', color: isDark ? '#94a3b8' : '#64748b', margin: 0, lineHeight: 1.5 }}>Authenticate securely using your 14-digit ABHA ID or registered mobile number.</p>
            </div>

            <div style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', padding: '24px', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '16px' }}>02</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>AI Triage & AYUSH Stream</h3>
              <p style={{ fontSize: '13px', color: isDark ? '#94a3b8' : '#64748b', margin: 0, lineHeight: 1.5 }}>Select traditional AYUSH care or Allopathy and speak symptoms in Hindi or English.</p>
            </div>

            <div style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', padding: '24px', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '18px' }}>03</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Doctor Sync & E-Sign</h3>
              <p style={{ fontSize: '13px', color: isDark ? '#94a3b8' : '#64748b', margin: 0, lineHeight: 1.5 }}>Live queue syncs case with the doctor. Get instant digital prescriptions via SMS/WhatsApp.</p>
            </div>
          </div>
        </section>

        {/* SECTION 3: KEY ENTERPRISE FEATURES */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: 'auto' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cutting-Edge Tech</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, margin: '6px 0 8px 0' }}>Security & Highlights</h2>
            <p style={{ fontSize: '0.9rem', color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>Engineered to meet national digital health infrastructure standards.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', padding: '20px', borderRadius: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderRadius: '10px' }}><Cpu size={20} /></div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px 0' }}>Local RAG Engine</h4>
                <p style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>ChromaDB vector search cross-checks safety and interactions.</p>
              </div>
            </div>

            <div style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', padding: '20px', borderRadius: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '10px' }}><Lock size={20} /></div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px 0' }}>ABHA Compliance</h4>
                <p style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>Decentralized health record management following national guidelines.</p>
              </div>
            </div>

            <div style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', padding: '20px', borderRadius: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '10px' }}><Globe size={20} /></div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px 0' }}>Bilingual Voice</h4>
                <p style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', margin: 0 }}>Seamless Web Speech API supporting Hindi & English voice inputs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* WORKABLE IMPORTANT LINKS BADGES */}
        <section style={{
          backgroundColor: isDark ? '#090d16' : '#e2e8f0',
          padding: '24px 16px',
          borderRadius: '16px',
          border: isDark ? '1px solid #1e293b' : '1px solid #cbd5e1',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
            Important Portals & Links
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', flexWrap: 'wrap', maxWidth: '1000px', margin: '0 auto' }}>
            {['india.gov.in', 'Ministry of Ayush', 'Digital India', 'GatiShakti', 'MyGov India'].map((badge, idx) => (
              <div 
                key={idx} 
                onClick={() => handleLinkClick(badge)}
                style={{ 
                  padding: '8px 14px', 
                  backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                  border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', 
                  borderRadius: '8px', 
                  fontSize: '12px', 
                  fontWeight: 700, 
                  color: '#34d399', 
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
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
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '16px'
        }}>
          <div style={{
            backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
            borderRadius: '20px', padding: '24px', maxWidth: '480px', width: '100%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: '14px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#10b981' }}>{modalContent.title}</h3>
            <p style={{ fontSize: '13px', color: isDark ? '#cbd5e1' : '#475569', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-line' }}>{modalContent.body}</p>
            <button
              onClick={() => setModalContent(null)}
              style={{ marginTop: '10px', padding: '10px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
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
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#34d399' }}>ArogyaKiosk User Guide</h3>
            <p style={{ fontSize: '13px', color: isDark ? '#cbd5e1' : '#475569', lineHeight: 1.5, margin: 0 }}>
              1. Click on <strong>Patient Portal & AYUSH</strong> to login or register using ABHA ID or Mobile Number.<br/>
              2. Select your preferred healthcare domain (Allopathy or AYUSH streams).<br/>
              3. Use <strong>Voice Input</strong> or text to describe your symptoms in Hindi or English.<br/>
              4. Review RAG safety assessment and connect with doctor.
            </p>
            <button
              onClick={() => setShowHelp(false)}
              style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
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
      <div style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: 1200 }}>
        {!isAiOpen ? (
          <button
            onClick={() => setIsAiOpen(true)}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)'
            }}
            title="ArogyaKiosk AI Assistant"
          >
            <Rocket size={24} />
          </button>
        ) : (
          <div style={{
            width: 'calc(100vw - 32px)',
            maxWidth: '360px',
            height: '460px',
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            border: isDark ? '1px solid #1e293b' : '1px solid #cbd5e1',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '14px 16px', borderBottom: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isDark ? '#020617' : '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '6px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderRadius: '50%' }}>
                  <Rocket size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 800, margin: 0 }}>ArogyaKiosk Astronaut</h3>
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

            <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  lineHeight: 1.4,
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
                placeholder="Ask about features..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  borderRadius: '8px',
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
                  padding: '8px 12px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
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

      {/* OFFICIAL MINISTRY FOOTER */}
      <footer style={{
        backgroundColor: '#070b14',
        color: '#94a3b8',
        padding: '32px 16px 16px 16px',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        boxSizing: 'border-box'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: 800, fontSize: '15px' }}>
              <Stethoscope size={18} color="#10b981" /> ArogyaKiosk Enterprise
            </div>
            <p style={{ fontSize: '12px', lineHeight: 1.5, margin: 0 }}>
              AYUSH BHAWAN, B Block, GPO Complex, INA, NEW DELHI - 110023
            </p>
            <p style={{ fontSize: '12px', margin: 0, color: '#34d399' }}>
              support@arogyakiosk.gov.in
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#fff', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Useful Links</h4>
            <span onClick={() => handleLinkClick('Website Policies')} style={{ fontSize: '12px', cursor: 'pointer', color: '#60a5fa' }}>Website Policies</span>
            <span onClick={() => handleLinkClick('Terms and Conditions')} style={{ fontSize: '12px', cursor: 'pointer', color: '#60a5fa' }}>Terms and Conditions</span>
            <span onClick={() => handleLinkClick('Sitemap & FAQs')} style={{ fontSize: '12px', cursor: 'pointer', color: '#60a5fa' }}>Sitemap & FAQs</span>
            <span onClick={() => handleLinkClick('User Manual')} style={{ fontSize: '12px', cursor: 'pointer', color: '#60a5fa' }}>User Manual</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#fff', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Connect With Us</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ padding: '6px', backgroundColor: '#1e293b', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}><Share2 size={15} /></div>
              <div style={{ padding: '6px', backgroundColor: '#1e293b', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}><Globe size={15} /></div>
              <div style={{ padding: '6px', backgroundColor: '#1e293b', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}><MessageCircle size={15} /></div>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
              LAST UPDATE : [13-SEP-2026] <br />
              VISITORS: <strong style={{ color: '#34d399' }}>{visitorCount}</strong>
            </div>
          </div>

        </div>

        <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', fontSize: '11px', color: '#64748b' }}>
          Website content owned by Ministry of Ayush, Government of India. Developed for Smart India Hackathon (SIH 2026).
        </div>
      </footer>

    </div>
  );
}
