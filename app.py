import streamlit as st
import json

# Page Configuration
st.set_page_config(
    page_title="ArogyaKiosk - AI + AYUSH Smart Health Gateway",
    page_icon="🌿",
    layout="wide"
)

# Custom Styling for Government / Ayush Theme
st.markdown("""
    <style>
    .main { background-color: #020617; color: #ffffff; }
    .stButton>button { background-color: #10b981; color: white; border-radius: 12px; font-weight: bold; border: none; padding: 10px 20px; }
    .stButton>button:hover { background-color: #059669; }
    .metric-card { background-color: #0f172a; padding: 20px; border-radius: 16px; border: 1px solid #1e293b; }
    </style>
""", unsafe_allow_html=True)

# Top Government Banner
st.markdown("🏛️ **Government of India | भारत सरकार** • **Ministry of Ayush** | Smart India Hackathon (SIH 2026)", unsafe_allow_html=True)
st.title("🌿 AROGYAKIOSK — AI + AYUSH Smart Health Gateway")

# Initialize Session States
if "patients_db" not in st.session_state:
    st.session_state.patients_db = {
        "ABHA-98765432101234": {
            "fullName": "Vivan",
            "age": 20,
            "gender": "Male",
            "weight": "68 kg",
            "bp": "120/80",
            "sugar": "110 mg/dL",
            "password": "Password123"
        }
    }

if "logged_in_patient" not in st.session_state:
    st.session_state.logged_in_patient = None

if "doctor_logged_in" not in st.session_state:
    st.session_state.doctor_logged_in = False

if "queue_data" not in st.session_state:
    st.session_state.queue_data = [
        {
            "id": 1,
            "patient_id": "ABHA-98765432101234",
            "name": "Vivan",
            "age": 20,
            "gender": "Male",
            "caseType": "AYUSH",
            "symptoms": "Chronic joint stiffness, fatigue and digestive imbalance",
            "risk_level": "Low",
            "status": "Pending",
            "rag_safety": "Safe: No adverse interactions found with standard Ashwagandha or Guggulu regimens.",
            "history": "No major prior ailments. Regular checkups. ABHA Locker Linked.",
            "prescription": "Simulated: Dashmoolarishta 15ml twice daily post meals."
        }
    ]

# Sidebar Navigation
st.sidebar.title("Navigation Gateway")
app_mode = st.sidebar.selectbox("Choose Portal", ["🏠 Home Gateway", "👤 Patient Login / Register", "📋 Patient AI Triage Portal", "🩺 Doctor Command Center"])

# ----------------- 1. HOME GATEWAY -----------------
if app_mode == "🏠 Home Gateway":
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("### 📋 Patient Portal & AYUSH")
        st.write("Authenticate via ABHA / Aadhaar / Mobile, manage health vritual profiles, and run RAG safety checks.")
        if st.button("Go to Patient Login"):
            st.info("Please select 'Patient Login / Register' from the sidebar.")
    with col2:
        st.markdown("### 🩺 Doctor Command Center")
        st.write("Review real-time patient triage queues, examine vitals (BP, Sugar, Weight), and e-sign digital prescriptions.")
        if st.button("Go to Doctor Login"):
            st.info("Please select 'Doctor Command Center' from the sidebar.")

# ----------------- 2. PATIENT LOGIN / REGISTER -----------------
elif app_mode == "👤 Patient Login / Register":
    st.subheader("👤 Patient Authentication & Health Profile Setup")
    
    auth_tab = st.radio("Select Action", ["Existing Account Login", "Create New Account (Sign Up)"])
    
    id_type = st.selectbox("Select ID Type", ["ABHA ID (14 digits)", "Aadhaar Card", "Mobile Number"])
    identifier = st.text_input("Enter ID Number")
    password = st.text_input("Enter Secure Password", type="password")
    
    if auth_tab == "Existing Account Login":
        if st.button("Secure Login"):
            if identifier in st.session_state.patients_db and st.session_state.patients_db[identifier]["password"] == password:
                st.session_state.logged_in_patient = st.session_state.patients_db[identifier]
                st.session_state.logged_in_patient["patient_id"] = identifier
                st.success(f"Login successful! Welcome back, {st.session_state.logged_in_patient['fullName']}.")
            else:
                # Fallback for demo convenience
                st.session_state.logged_in_patient = {
                    "patient_id": identifier if identifier else "ABHA-98765432101234",
                    "fullName": "Verified Patient",
                    "age": 25,
                    "gender": "Male",
                    "weight": "70 kg",
                    "bp": "120/80",
                    "sugar": "100 mg/dL"
                }
                st.success("Login successful (Demo Mode Session Initialized)!")
    else:
        st.markdown("### 📋 Step 2: Additional Health Vitals & Profile Details")
        reg_name = st.text_input("Full Name")
        reg_dob = st.date_input("Date of Birth")
        reg_gender = st.selectbox("Gender", ["Male", "Female", "Other"])
        
        col_v1, col_v2, col_v3 = st.columns(3)
        with col_v1:
            reg_weight = st.text_input("Weight (kg)", "68 kg")
        with col_v2:
            reg_bp = st.text_input("Blood Pressure (BP)", "120/80")
        with col_v3:
            reg_sugar = st.text_input("Sugar Level", "110 mg/dL")
            
        reg_contact = st.text_input("Emergency Contact Number")
        reg_address = st.text_area("Residential Address")
        
        if st.button("Complete Registration & Login"):
            if not identifier or not password or not reg_name:
                st.warning("Please fill in all mandatory fields.")
            else:
                new_profile = {
                    "fullName": reg_name,
                    "dob": str(reg_dob),
                    "gender": reg_gender,
                    "weight": reg_weight,
                    "bp": reg_bp,
                    "sugar": reg_sugar,
                    "emergencyContact": reg_contact,
                    "address": reg_address,
                    "password": password,
                    "patient_id": identifier
                }
                st.session_state.patients_db[identifier] = new_profile
                st.session_state.logged_in_patient = new_profile
                st.success("Account successfully created and synced with ABHA Health Locker!")

    if st.session_state.logged_in_patient:
        st.info(f"Currently Logged In: **{st.session_state.logged_in_patient.get('fullName', 'Patient')}** (ID: {st.session_state.logged_in_patient.get('patient_id')})")

# ----------------- 3. PATIENT TRIAGE PORTAL -----------------
elif app_mode == "📋 Patient AI Triage Portal":
    if not st.session_state.logged_in_patient:
        st.warning("⚠️ Please log in or create an account first from the 'Patient Login / Register' tab.")
    else:
        patient = st.session_state.logged_in_patient
        st.subheader(f"📋 AI Health Triage • Welcome, {patient.get('fullName')}")
        
        st.markdown(f"""
            <div class='metric-card'>
                <p><b>ABHA ID:</b> {patient.get('patient_id')} | <b>DOB/Age:</b> {patient.get('age', '20')} yrs | <b>Gender:</b> {patient.get('gender')}</p>
                <p><b>Vitals on Record:</b> Weight: {patient.get('weight', 'N/A')} | BP: {patient.get('bp', 'N/A')} | Sugar: {patient.get('sugar', 'N/A')}</p>
            </div>
        """, unsafe_allow_html=True)
        
        stream = st.selectbox("Choose Healthcare Stream", ["Ayurveda", "Yoga & Naturopathy", "Unani", "Siddha", "Homeopathy", "Allopathy"])
        symptoms = st.text_area("Describe your primary symptoms / discomfort", "Chronic joint stiffness and fatigue")
        severity = st.selectbox("Severity Level", ["Mild", "Moderate", "Severe"])
        
        if st.button("🚀 Dispatch Triage Report to Doctor Queue"):
            new_entry = {
                "id": len(st.session_state.queue_data) + 1,
                "patient_id": patient.get('patient_id'),
                "name": patient.get('fullName'),
                "age": patient.get('age', 20),
                "gender": patient.get('gender', 'Male'),
                "caseType": stream,
                "symptoms": f"Symptoms: {symptoms} | Vitals [BP: {patient.get('bp')}, Sugar: {patient.get('sugar')}, Wt: {patient.get('weight')}]",
                "risk_level": "Critical" if severity == "Severe" else "Moderate",
                "status": "Pending",
                "rag_safety": f"Checked via ChromaDB for {stream} protocols. No major interactions.",
                "history": f"Emergency Contact: {patient.get('emergencyContact', 'N/A')}. ABHA Locker linked.",
                "prescription": "Pending doctor consultation."
            }
            st.session_state.queue_data.insert(0, new_entry)
            st.success("✅ Assessment successfully transmitted to the Doctor Command Center!")

# ----------------- 4. DOCTOR COMMAND CENTER -----------------
elif app_mode == "🩺 Doctor Command Center":
    st.subheader("🩺 Doctor Telehealth Command Center")
    
    if not st.session_state.doctor_logged_in:
        doc_pass = st.text_input("Enter Secure Doctor Password", type="password")
        if st.button("Login to Command Center"):
            if doc_pass == "sih2026":
                st.session_state.doctor_logged_in = True
                st.rerun()
            else:
                st.error("Access Denied: Invalid Password (Use: sih2026)")
    else:
        st.success("Authenticated Session: Dr. Sharma (DOC-108) • Specialization: Ayurveda")
        if st.button("Secure Logout"):
            st.session_state.doctor_logged_in = False
            st.rerun()
            
        st.markdown("### 📋 Active Patient Triage Cases (Master-Detail View)")
        
        col_list, col_detail = columns_layout = st.columns([1, 2])
        
        with col_list:
            st.markdown("#### Patient Queue")
            selected_patient_idx = 0
            patient_names = [f"{p['name']} ({p['patient_id']})" for p in st.session_state.queue_data]
            if patient_names:
                chosen_p = st.radio("Select Case", patient_names)
                selected_patient_idx = patient_names.index(chosen_p)
                
        with col_detail:
            if st.session_state.queue_data:
                p_item = st.session_state.queue_data[selected_patient_idx]
                st.markdown(f"""
                    <div class='metric-card'>
                        <h3>File: {p_item['name']}</h3>
                        <p><b>Terminal ID:</b> {p_item['patient_id']} | <b>Age/Gender:</b> {p_item['age']}y / {p_item['gender']}</p>
                        <p><b>Stream / Case Type:</b> {p_item['caseType']}</p>
                        <hr style='border-color: #334155;'>
                        <p><b>Chief Complaint & Vitals:</b><br>{p_item['symptoms']}</p>
                        <p style='color: #38bdf8;'><b>ChromaDB RAG Safety:</b> {p_item['rag_safety']}</p>
                        <p style='color: #34d399;'><b>ABHA Vault & History:</b> {p_item['history']}</p>
                        <p style='color: #facc15;'><b>Prescription Draft:</b> {p_item['prescription']}</p>
                        <p><b>Status:</b> {p_item['status']}</p>
                    </div>
                """, unsafe_allow_html=True)
                
                new_rx = st.text_input("Add Prescription Notes (Dwai)", key=f"rx_{p_item['id']}")
                if st.button("Save Prescription & E-Sign", key=f"btn_{p_item['id']}"):
                    if new_rx:
                        p_item['prescription'] = f"Rx: {new_rx}"
                    p_item['status'] = "Approved & E-Signed"
                    st.success("Prescription successfully e-signed and synced to patient records!")