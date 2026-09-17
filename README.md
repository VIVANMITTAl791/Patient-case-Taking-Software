<div align="center">

# 🌿 ArogyaKiosk — AI + AYUSH Smart Health Gateway
**Transforming Rural Healthcare Delivery through Multilingual Voice Intake, AYUSH Clinical Decision Support, and Telehealth**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://patient-case-taking-software-steel.vercel.app/)
[![Streamlit Gateway](https://img.shields.io/badge/Demo_Kiosk-Streamlit-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)](https://patient-case-taking-softwareby-vivan.streamlit.app)
[![GitHub](https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/vivanmittal791)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](www.linkedin.com/in/vivanmittal)

</div>

---

## 📌 Executive Summary
**ArogyaKiosk** is a decentralized digital healthcare solution developed for **Smart India Hackathon (SIH) 2026**. Designed to bridge healthcare accessibility gaps in rural, tribal, and underserved regions, the platform digitizes patient registration, automated clinical triage, and consultation workflows. 

By integrating **AYUSH (Ayurveda, Yoga, Unani, Siddha, and Homeopathy)** treatment standards with an AI-driven Retrieval-Augmented Generation (RAG) engine, ArogyaKiosk empowers community health workers and rural patients with guided diagnostic support and rapid tele-consultation access.

---

## 🔗 Live Deployments & Demos

| Component | Platform | Status | URL |
|---|---|---|---|
| **Production Web Portal** | Vercel (Next.js 14) | 🟢 Live | [Access Portal](https://your-frontend-domain.vercel.app) |
| **Interactive Kiosk Prototype** | Streamlit Cloud | 🟢 Live | [Launch Kiosk](https://patient-case-taking-software-steel.vercel.app) |
| **Backend API Docs** | Render / Railway | 🟢 Active | `https://your-backend.onrender.com/docs` |

---

## ✨ Core Innovations

- 🗣️ **Multilingual Voice Intake:** Voice-driven case capture with real-time audio visualization (`VoiceMic`, `AnimatedDoctor`) designed for low-literacy users.
- 🆔 **Integrated Identity & Triage:** Built-in identity verification (`govt_kyc`, OTP service) feeding structured intake histories.
- 📚 **AYUSH RAG Clinical Engine:** Semantic vector search across verified AYUSH clinical guidelines via persistent ChromaDB indexing.
- 🩺 **Doctor Telehealth Command Center:** Real-time patient queues, clinical record review, and cryptographically verified e-prescriptions.
- ⚡ **Decoupled Architecture:** Client-side Next.js frontend communicating with a high-throughput asynchronous FastAPI backend.

---

## 🏗️ Architecture & Data Flow

```text
[ Patient / Health Worker ] 
             │
      (Voice / Forms)
             ▼
   [ Next.js 14 Web Portal ] ──(REST / JSON)──► [ FastAPI Backend Engine ]
                                                          │
                    ┌─────────────────────────────────────┴──────────────────────────────────┐
                    ▼                                                                        ▼
         [ RAG Decision Engine ]                                                  [ Supabase Database ]
     (LangChain + ChromaDB Store)                                              (Patient Records & History)
                    │
                    ▼
       [ AYUSH Guidelines Index ]
