import sys
import json
from pathlib import Path

# Add the root directory to path to see core
base_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(base_dir))

from core.recommendation_engine import RecommendationEngine

def print_log(step, title, data=None):
    print(f"\n{'='*60}")
    print(f" STEP {step}: {title} ".center(60, "="))
    print(f"{'='*60}")
    if data:
        print(f"   {json.dumps(data, indent=3) if isinstance(data, dict) else data}")

def simulate_real_user_journey(use_cloud=True):
    # Setup Paths
    base_dir = Path(__file__).resolve().parent.parent
    
    print(f"\n>>> INITIALIZING PathFinder+ CORE ENGINE ({'CLOUD' if use_cloud else 'LOCAL'}) <<<")
    try:
        if use_cloud:
            engine = RecommendationEngine.from_mongo()
        else:
            engine = RecommendationEngine(show_progress=False)
    except Exception as e:
        print(f"CRITICAL: Engine Init Failed: {e}")
        return
    
    # 1. USER PROFILE: DATA & CUSTOMER FOCUS
    user_answers = {
        "status": "Working Professional",
        "highest_education": "Bachelor's Degree",
        "total_experience": "3-5 years",
        "responsibility_level": "Planned tasks",
        "q13": "Managed high-value client relations and used Salesforce to track churn.",
        "q15": "Customer Success Manager / Operations Lead",
        "q16": "Need to transition into data-driven strategy roles.",
        "budget_range": "50k-200k",
        "weekly_time": "5-10 hours"
    }
    
    # 2. MOCK RESUME TEXT
    mock_resume_text = """
    Samantha Perera - Client Relationship Specialist
    Skills: Salesforce, Zendesk, Relationship Management, Excel, Data Reporting.
    Experience: 3 years at Dialog Axiata.
    """
    
    # --- START LOGGING ---
    print_log(1, "User Submits Career Assessment Form", user_answers)
    
    print_log(2, "User Uploads Resume (Image/PDF)")
    resume_skills = engine.parse_resume_text(mock_resume_text)
    print_log(3, f"Result: Skills Extracted ({len(resume_skills)})", resume_skills)
    
    print_log(4, "AI Builds User Vector & Intent")
    vector = engine.process_comprehensive_assessment(user_answers)
    # Merge skills for the 'Integrated' experience
    vector["extracted_intent_skills"] = list(set(vector.get("extracted_intent_skills", []) + resume_skills))
    
    print_log(5, "Integrated API Call: Dispatching Dashboard Bundle Request")
    # This is the 'One Call' that powers everything
    target_job = "Customer Success Manager"
    bundle = engine.get_recommendations_from_assessment(vector, target_job)
    
    print("\n" + " MATCH RESULTS (SYNCED FROM MONGODB) ".center(60, "="))
    
    print(f"\n[JOB MATCHES]")
    for j in bundle['job_ideas'][:3]:
        print(f"  -> {j['job_title']} at {j['company']} ({j['relevance_score']}% Match)")

    print(f"\n[MENTOR MATCHES]")
    for m in bundle['mentors'][:2]:
        print(f"  -> {m['name']} ({m['title']} at {m['company']})")

    print(f"\n[CAREER PROGRESSION]")
    if bundle.get('career_progression'):
        for p in bundle['career_progression'][:2]:
            print(f"  -> {p['type']}: {p['role']}")
            print(f"     Advice: {p.get('advice', 'Focus on skill development')[:60]}...")
    else:
        print("  -> No specific progression data found.")

    print(f"\n[COURSE RECOMMENDATIONS]")
    for c in bundle['recommendations'][:3]:
        print(f"  * {c['course_name']} ({c['provider']}) | {c['fee']}")
        
    print("\n" + "="*60)
    print(" SHOWN LOGS SIMULATE AN ACTUAL HIGH-FIDELITY USER JOURNEY ".center(60, "="))
    print("="*60)

if __name__ == "__main__":
    simulate_real_user_journey(use_cloud=True)
