import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("⚠️ WARNING: Supabase URL or Key is missing in .env file!")
    supabase: Client = None
else:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def save_patient_profile(id_type: str, original_id: str, abha_id: str):
    if not supabase:
        return {"status": "error", "message": "Database disconnected (Check .env)"}
        
    try:
        existing_user = supabase.table("patients").select("*").eq("original_id", original_id).execute()
        
        if len(existing_user.data) > 0:
            return {
                "status": "success", 
                "message": "Welcome back! Existing profile loaded.", 
                "patient_data": existing_user.data[0]
            }
        else:
            new_patient_data = {
                "id_type": id_type,
                "original_id": original_id,
                "abha_id": abha_id,
                "role": "patient"
            }
            insert_response = supabase.table("patients").insert(new_patient_data).execute()
            
            return {
                "status": "success", 
                "message": "New patient profile created successfully!", 
                "patient_data": insert_response.data[0]
            }
            
    except Exception as e:
        print(f"Database Error: {e}")
        return {"status": "error", "message": "Failed to save patient in DB."}

def save_patient_consultation(patient_id: str, symptoms: str, medicines: str, risk_level: str):
    if not supabase:
        print("❌ Supabase client is None!")
        return None
    
    data = {
        "patient_id": patient_id,
        "symptoms": symptoms,
        "medicines": medicines,
        "risk_level": risk_level,
        "status": "Pending Review"
    }
    
    try:
        response = supabase.table("consultations").insert(data).execute()
        print("✅ SUCCESS! Consultation inserted into Supabase:", response)
        return response
    except Exception as e:
        print(f"❌ CRITICAL DATABASE INSERT ERROR: {e}")
        return None