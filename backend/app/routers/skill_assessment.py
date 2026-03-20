from fastapi import APIRouter, HTTPException
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
def save_quiz(data: QuizData):
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
            
            # Force the engine t also acknowledge the exact Interactive Skills clicked in the UI
            existing_skills = assessment_vector.get("extracted_intent_skills", [])
            explicit_skills = data.skills if isinstance(data.skills, list) else []
            assessment_vector["extracted_intent_skills"] = list(set(existing_skills + explicit_skills))
            
            # Generate the final Bundle
            bundle = engine.get_recommendations_from_assessment(assessment_vector, target_job=target_job)
            
            # Extract formatted course names (or the full dictionary if frontend needs more)
            recs = bundle if isinstance(bundle, list) else bundle.get("recommendations", [])
            if recs:
                courses_payload = [c.get("course_name", "General Course") for c in recs[:3]]
                
            # getting roles froom mongodb
            raw_jobs = bundle.get("target_roles", bundle.get("top_job_matches", bundle.get("job_recommendations", [])))
            for j in raw_jobs:
                if isinstance(j, dict):
                    jobs_payload.append({
                        "job_title": j.get("job_title", j.get("title", "Unknown Role")),
                        "company": j.get("company", "PathFinder+ Partners"),
                        "link": j.get("link", j.get("apply_url", j.get("job_url", "#"))),
                        "relevance_score": j.get("relevance_score", 0)
                    })
                elif isinstance(j, str):
                    jobs_payload.append({"job_title": j, "company": "Domain Partner", "link": "#", "relevance_score": 0})
                    
        except Exception as e:
            print(f"CRITICAL PyTorch Engine Integration Error: {e}")
            bundle = {"error": str(e)}

    #  Fail-Safe GenAI Explainability Wrapper 
    # Attempt to dynamically generate a conversational career insight using gemma-3-1b-it.
    # If the network hangs or quota is exhausted, seamlessly fallback to the standard static dictionary.
    
    dynamic_description = f"Based on your profile, your {len(explicit_skills)} explicit skills and 12-point NLP behavior vectors strongly align with leadership roles in {data.domain}."
    
    try:
        import os
        from google import genai
        
        # Hardcode bypass for Sri Lankan ISP IPv6 gRPC dropouts, forcing IPv4 REST Transport.
        os.environ["GRPC_DNS_RESOLVER"] = "native"
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        
        if gemini_api_key:
            client = genai.Client(
                api_key=gemini_api_key,
                http_options={'api_version': 'v1alpha', 'transport': 'rest'}
            )
            
            # Extract strict metrics from the PyTorch payload to constrain hallucination
            readiness = bundle.get("summary", {}).get("readiness_score", 50)
            missing = ", ".join(bundle.get("skill_intelligence", {}).get("skills_to_strengthen", [])[:3])
            
            strict_prompt = (
                f"You are a Senior Academic Advisor. The user wants to be a {target_job}. "
                f"Our PyTorch ML model scored their career readiness at {readiness}/100 and identified they need to learn: {missing}. "
                "Output exactly six distinct professional, actionable bullet points explaining their career readiness and focus areas. "
                "Strictly separate the six points with the delimiter '|||' and do not use any other formatting or markdown."
            )
            
            response = client.models.generate_content(
                model='models/gemma-3-1b-it',
                contents=strict_prompt,
            )
            
            if response.text:
                dynamic_description = response.text.replace('\n', ' ').strip()
                
    except Exception as e:
        print(f"GenAI Fallback Triggered (Network/Quota limit): {e}")

    #  Return Output for Frontend Result Screen 
    return {
        "career": target_job,
        "description": dynamic_description,
        "skills": explicit_skills[:5],
        "courses": courses_payload,
        "jobs": [job.get("job_title", "") for job in jobs_payload] if hasattr(jobs_payload, '__iter__') and jobs_payload else [f"Junior {target_job}", f"Senior {target_job}"],
        "bundle": bundle # Provide the complete ML report to the frontend
    }