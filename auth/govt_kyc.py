def process_govt_kyc(id_type: str, identifier: str):
    """
    SIH USP: Automatically generates ABHA ID if patient uses AADHAAR.
    """
    if id_type == "ABHA":
        return {
            "status": "success",
            "abha_id": identifier,
            "message": "Existing ABHA ID verified."
        }
        
    elif id_type == "AADHAAR":
        # Hackathon Demo Logic: Hum maan lete hain e-KYC successful ho gaya
        mock_new_abha = "14-8888-9999-00" 
        return {
            "status": "success",
            "abha_id": mock_new_abha,
            "message": f"e-KYC verified! Auto-generated new ABHA ID: {mock_new_abha}"
        }
        
    else:
        return {
            "status": "pending",
            "message": "OTP sent to Mobile Number."
        }