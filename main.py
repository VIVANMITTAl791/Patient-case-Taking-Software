import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai_rag.query_engine import search_medical_guidelines
from database.supabase_client import save_patient_profile, save_patient_consultation, supabase

app = FastAPI(title="ArogyaKiosk SIH Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    id_type: str
    identifier: str

class SymptomRequest(BaseModel):
    patient_id: str = "ABHA-DEMO-001"
    symptoms: str
    medicines: str = None

class PrescriptionApproval(BaseModel):
    consultation_id: str
    prescribed_medicines: str

@app.post("/api/patient/login")
async def patient_login(data: LoginRequest):
    abha_generated = f"ABHA-{abs(hash(data.identifier)) % 10000000000}"
    result = save_patient_profile(
        id_type=data.id_type,
        original_id=data.identifier,
        abha_id=abha_generated
    )
    return result

@app.post("/api/validate-prescription")
async def validate_prescription(data: SymptomRequest):
    # Search local ChromaDB RAG guidelines
    rag_context = search_medical_guidelines(data.symptoms)
    
    # Determine risk level based on keywords
    risk_level = "Moderate" if any(word in data.symptoms.lower() for word in ["fever", "pain", "headache", "cough", "blood", "chest"]) else "Low"
    
    # Save directly to Supabase consultations table
    try:
        save_patient_consultation(
            patient_id=data.patient_id,
            symptoms=data.symptoms,
            medicines=data.medicines or "None",
            risk_level=risk_level
        )
    except Exception as e:
        print(f"Database save error: {e}")

    return {
        "riskLevel": risk_level,
        "warning": "Cross-referenced with clinical guidelines. Avoid unprescribed combination therapy.",
        "recommendation": "Consult the duty physician at the kiosk and monitor vitals.",
        "guidelineMatch": f"{rag_context[:150]}..."
    }

@app.get("/api/doctor/consultations")
async def get_doctor_consultations():
    if not supabase:
        return {"status": "error", "message": "Database disconnected", "data": []}
    try:
        response = supabase.table("consultations").select("*").order("created_at", desc=True).execute()
        return {"status": "success", "data": response.data if response.data else []}
    except Exception as e:
        return {"status": "error", "message": str(e), "data": []}

@app.post("/api/doctor/approve")
async def approve_prescription(data: PrescriptionApproval):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database disconnected")
    
    try:
        response = supabase.table("consultations").update({
            "medicines": data.prescribed_medicines,
            "status": "Approved & Prescribed"
        }).eq("id", data.consultation_id).execute()
        
        return {"status": "success", "message": "Prescription approved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000)