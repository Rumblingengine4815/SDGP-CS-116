from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Header
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import UserProfile, User
import json
import io
import os as system_os
import sys
import shutil
import tempfile
import fitz
import re
import traceback
from ..auth import verify_token
from app.main import engine
from core.mentor_engine import MentorEngine

router = APIRouter()

sys.path.append(system_os.path.abspath(system_os.path.join(system_os.path.dirname(__file__), "..", "..", "..", "Machine Learning and Data Cleaning")))

@router.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db), authorization: str = Header(None)):
    if engine is None:
        raise HTTPException(status_code=500, detail="PyTorch engine not loaded.")
        
    tmp_path = None
    try:
        # Save uploaded file to a temporary location
        fd, tmp_path = tempfile.mkstemp(suffix=".pdf")
        with system_os.fdopen(fd, 'wb') as out_file:
            shutil.copyfileobj(file.file, out_file)
            
        # Natively extract SBERT intent profiles and textual skills
        print(f"[Engine] Parsing Resume via Auto-Profile: {file.filename}")
        profile = engine.auto_profile(tmp_path)
        
        # Strong Semantic RegEx Extraction for Academic & Experience Baselines
        resume_text = ""
        try:
            with fitz.open(tmp_path) as doc:
                for page in doc:
                    resume_text += page.get_text().lower()
        except:
            pass
            
        education_level = "school_leaver"
        
        msc_pattern = r'\b(m\.?sc|master\'s|masters of|ph\.?d|doctorate|mba|m\.?a|mphil)\b'
        bsc_pattern = r'\b(b\.?sc|bachelor\'s|bachelors of|b\.?a|bba|undergrad|undergraduate|b\.?tech|b\.?eng)\b'
        diploma_pattern = r'\b(diploma|hnd|higher national|pgd|post graduate diploma)\b'
        al_pattern = r'\b(a/l|advanced level|gce advanced|g\.c\.e\.? a/l)\b'
        
        if re.search(msc_pattern, resume_text):
            education_level = "msc_phd"
        elif re.search(bsc_pattern, resume_text):
            education_level = "bsc"
        elif re.search(diploma_pattern, resume_text):
            education_level = "diploma"
        elif re.search(al_pattern, resume_text):
            education_level = "al"
            
        status = "Working Professional"
        experience = "3-5 years"
        
        student_pattern = r'\b(student|undergrad|undergraduate|intern|internship|trainee)\b'
        junior_pattern = r'\b(junior|associate|entry level|graduate trainee)\b'
        mid_senior_pattern = r'\b(senior|lead|manager|principal|director|head of)\b'
        
        if re.search(student_pattern, resume_text):
            status = "University Student"
            experience = "0 (None)"
        elif re.search(junior_pattern, resume_text):
            experience = "1-2 years"
        elif re.search(mid_senior_pattern, resume_text) and not re.search(student_pattern, resume_text):
            experience = "6-10 years"
        
        # Build a highly contextual assessment payload
        extracted_skills = profile.get("extracted_skills", [])
        answers_for_engine = {
            "status": status, 
            "education": education_level,
            "total_experience": experience,
            "responsibility_level": profile.get("estimated_responsibility", "Completed independent tasks"),
            "career_background": f"I have the following exact skillset from my CV: {', '.join(extracted_skills)}",
            "interests": "Growth and upskilling",
        }
        
        # Pipeline the data into the main Recommendation Engine
        assessment_vector = engine.process_comprehensive_assessment(answers_for_engine)
        assessment_vector["extracted_intent_skills"] = list(set(assessment_vector.get("extracted_intent_skills", []) + extracted_skills))
        
        target = profile.get("suggested_target", "General Professional")
        
        # Override SBERT Target Role Hallucinations using strict NLP mappings
        if re.search(r'\b(machine learning|deep learning|data science|ai|artificial intelligence|data analyst|data engineer)\b', resume_text):
            target = "Data Scientist"
        elif re.search(r'\b(software engineer|developer|full stack|frontend|backend|programmer|angular|react|java|python|c\+\+)\b', resume_text):
            target = "Software Engineer"
        elif re.search(r'\b(cyber|security|penetration|infosec|ethical hacker)\b', resume_text):
            target = "Cyber Security Expert"
        elif re.search(r'\b(ui|ux|design|designer|figma|adobe)\b', resume_text):
            target = "UI/UX Designer"

        bundle = engine.get_recommendations_from_assessment(assessment_vector, target_job=target)
        
        # Static Career Description (no Gemini dependency)
        raw_score = bundle.get("career_readiness", {}).get("overall", 50)
        dynamic_description = (
            f"Based on our structural parse of your PDF, your {len(extracted_skills)} core technical skills place you perfectly into the {target} trajectory.\n\n"
            f"Our Sri Lankan market intelligence engine recommends the following immediate actions:\n"
            f"- Pursue local or international accreditations (like NVQ or standard industry certifications) to bridge your calculated skill gaps.\n"
            f"- Realign your active portfolio strictly toward {target} deliverables to maximize interview conversion rates.\n"
            f"- Explore remote USD freelancing opportunities while aggressively networking within the Colombo corporate sector.\n"
            f"- Focus on achieving your identified short-course technical milestones to increase your {raw_score}/100 Readiness alignment."
        )
            
        # --- EVENT DRIVEN DB PERSISTENCE ---
        bundle["mentor_recommendation"] = MentorEngine.recommend_mentor(target)
        
        if authorization and authorization.startswith("Bearer "):
            try:
                token = authorization.split(" ")[1]
                email = verify_token(token)
                if email:
                    user_record = db.query(User).filter(User.email == email).first()
                    if user_record:
                        u_profile = db.query(UserProfile).filter(UserProfile.user_id == user_record.id).first()
                        if not u_profile:
                            u_profile = UserProfile(user_id=user_record.id)
                            db.add(u_profile)
                        u_profile.cv_uploaded = True
                        u_profile.skills_extracted = True
                        u_profile.job_matches_generated = True
                        u_profile.state = "MATCHED"
                        u_profile.last_bundle = json.dumps(bundle)
                        db.commit()
            except Exception as db_e:
                print(f"Failed to persist state: {db_e}")

        return {
            "success": True,
            "filename": file.filename,
            "bundle": bundle,
            "career": target,
            "description": dynamic_description,
            "skills": extracted_skills[:5]
        }
        
    except Exception as e:
        traceback.print_exc()
        print(f"CRITICAL PyTorch Engine Integration Error: {e}")
        return {"error": str(e), "bundle": {"error": str(e)}}
    finally:
        if tmp_path and system_os.path.exists(tmp_path):
            system_os.remove(tmp_path)
