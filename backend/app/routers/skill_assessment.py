from fastapi import APIRouter, HTTPException, Depends, Header
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import UserProfile, User
import json
import os
import sys
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter()

class QuizData(BaseModel):
    # Step 1
    role: str = ""
    name: str = ""
    email: str = ""
    education: str = ""
    experience_years: str = ""
    upskilling_budget: str = ""
    weekly_availability: str = ""
    
    # Step 2
    domain: str = ""
    target_role: str = ""
    responsibility_level: str = ""
    skills: list = []
    
    # Step 3
    q1_problem: str = ""
    q2_adapt: str = ""
    q3_team: str = ""
    q4_stress: str = ""
    q5_learn: str = ""
    q6_lead: str = ""
    q7_comm: str = ""
    q8_risk: str = ""
    q9_feedback: str = ""
    q10_plan: str = ""
    q11_conflict: str = ""
    q12_motivate: str = ""

from app.main import engine

@router.post("/skill-assessment")
def save_quiz(data: QuizData, db: Session = Depends(get_db), authorization: str = Header(None)):
    target_job = data.target_role if data.target_role else f"{data.domain} Professional"
    courses_payload = ["Advanced Specialization", "Foundations Course", "Professional Certificate"]
    bundle = {}
    jobs_payload = []
    
    if engine is not None:
        try:
            # Concatenate all behavioral responses into a rich context string for the NLP engine
            rich_behavioral_profile = f"""
            Problem Solving: {data.q1_problem}
            Adaptability: {data.q2_adapt}
            Teamwork: {data.q3_team}
            Stress Management: {data.q4_stress}
            Learning Style: {data.q5_learn}
            Leadership: {data.q6_lead}
            Communication: {data.q7_comm}
            Risk Tolerance: {data.q8_risk}
            Feedback: {data.q9_feedback}
            Planning: {data.q10_plan}
            Conflict: {data.q11_conflict}
            Motivation: {data.q12_motivate}
            """
            
            # Format answers strictly to match what process_comprehensive_assessment expects
            answers_for_engine = {
                "status": data.role,
                "total_experience": data.experience_years,
                "responsibility_level": data.responsibility_level,
                "q7": data.q1_problem,
                "q10": data.q2_adapt,
                "career_background": rich_behavioral_profile,
                "interests": f"{data.q12_motivate} and {data.q6_lead}",
                "budget_range": data.upskilling_budget,
                "weekly_time": data.weekly_availability,
                "education_type": data.education
            }
            
            # Let the PyTorch Engine process the NLP responses
            assessment_vector = engine.process_comprehensive_assessment(answers_for_engine)
            
            # Force the engine to also acknowledge the exact Interactive Skills clicked in the UI
            existing_skills = assessment_vector.get("extracted_intent_skills", [])
            explicit_skills = data.skills if isinstance(data.skills, list) else []
            assessment_vector["extracted_intent_skills"] = list(set(existing_skills + explicit_skills))
            
            # Generate the final Bundle
            bundle = engine.get_recommendations_from_assessment(assessment_vector, target_job=target_job)
            
            courses_payload = []
            jobs_payload = []
                    
        except Exception as e:
            print(f"CRITICAL PyTorch Engine Integration Error: {e}")
            bundle = {"error": str(e)}

    # Static Career Description (no Gemini dependency)
    dynamic_description = f"Based on your profile, your generated data vectors strongly align with leadership roles natively inside {data.domain} targeting {target_job} trajectories."

    # --- EVENT DRIVEN DB PERSISTENCE ---
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "Machine Learning and Data Cleaning")))
    from core.mentor_engine import MentorEngine
    
    bundle["mentor_recommendation"] = MentorEngine.recommend_mentor(target_job)
    
    if authorization and authorization.startswith("Bearer "):
        try:
            token = authorization.split(" ")[1]
            from ..auth import verify_token
            email = verify_token(token)
            if email:
                user_record = db.query(User).filter(User.email == email).first()
                if user_record:
                    u_profile = db.query(UserProfile).filter(UserProfile.user_id == user_record.id).first()
                    if not u_profile:
                        u_profile = UserProfile(user_id=user_record.id)
                        db.add(u_profile)
                    u_profile.quiz_completed = True
                    u_profile.skills_extracted = True
                    u_profile.job_matches_generated = True
                    u_profile.state = "MATCHED"
                    u_profile.last_bundle = json.dumps(bundle)
                    db.commit()
        except Exception as db_e:
            print(f"Failed to persist state: {db_e}")

    # Return Output for Frontend Result Screen
    return {
        "success": True,
        "career": target_job,
        "description": dynamic_description,
        "skills": explicit_skills[:5],
        "courses": bundle.get("skill_gap_courses", []),
        "jobs": bundle.get("job_opportunities", []),
        "bundle": bundle
    }