from fastapi import APIRouter, UploadFile, File, HTTPException
import io

router = APIRouter()
from app.main import engine

import os
import shutil
import tempfile

@router.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...)):
    if engine is None:
        raise HTTPException(status_code=500, detail="PyTorch engine not loaded.")
        
    tmp_path = None
    try:
        # Save uploaded file to a temporary location
        fd, tmp_path = tempfile.mkstemp(suffix=".pdf")
        with os.fdopen(fd, 'wb') as out_file:
            shutil.copyfileobj(file.file, out_file)
            
        # Natively extract SBERT intent profiles and textual skills
        print(f"[Engine] Parsing Resume via Auto-Profile: {file.filename}")
        profile = engine.auto_profile(tmp_path)
        
        # Build a highly contextual assessment payload
        extracted_skills = profile.get("extracted_skills", [])
        answers_for_engine = {
            "status": "Working Professional", 
            "total_experience": "3-5 years",
            "responsibility_level": profile.get("estimated_responsibility", "Planned tasks"),
            "career_background": f"I have the following exact skillset from my CV: {', '.join(extracted_skills)}",
            "interests": "Growth and upskilling",
        }
        
        # Pipeline the data into the main Recommendation Engine
        assessment_vector = engine.process_comprehensive_assessment(answers_for_engine)
        assessment_vector["extracted_intent_skills"] = list(set(assessment_vector.get("extracted_intent_skills", []) + extracted_skills))
        
        target = profile.get("suggested_target", "General Professional")
        bundle = engine.get_recommendations_from_assessment(assessment_vector, target_job=target)
        
        return {
            "success": True,
            "filename": file.filename,
            "bundle": bundle
        }
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"CRITICAL PyTorch Engine Integration Error: {e}")
        return {"error": str(e), "bundle": {"error": str(e)}}
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)
