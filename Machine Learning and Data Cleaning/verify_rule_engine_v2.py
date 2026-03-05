import sys
import os
from pathlib import Path
import json

# Add core to path
sys.path.append(str(Path(__file__).resolve().parent / "core"))

try:
    from recommendation_engine import RecommendationEngine
except ImportError:
    # Try alternate pathing for local script run
    sys.path.append(str(Path(__file__).resolve().parent))
    from core.recommendation_engine import RecommendationEngine

def verify_persona(engine, name, answers):
    print(f"\n--- VERIFYING PERSONA: {name} ---")
    
    # 1. Process Assessment
    vector = engine.process_comprehensive_assessment(answers)
    target_role = answers.get("target_role", "General")
    
    print(f"Detected Domain: {vector['domain']}")
    print(f"Status Level: {vector['status_level']}")
    print(f"Edu Level: {vector['education_level']}")
    
    # 2. Get Recommendations
    bundle = engine.get_recommendations_from_assessment(vector, target_role)
    
    # 3. Component Checks
    
    # Domain Isolation (Jobs/Mentors)
    print("\n[Domain Isolation Check]")
    jobs = bundle.get("jobs", [])
    if jobs:
        for j in jobs[:2]:
            j_domain = engine._infer_domain(j['job_title'])
            if vector['domain'] != "General" and j_domain != "General" and j_domain != vector['domain']:
                print(f"[FAIL] Job '{j['job_title']}' is {j_domain}, user is {vector['domain']}")
            else:
                print(f"[PASS] Job '{j['job_title']}' is domain-safe.")
    else:
        print("[NOTE] No jobs found for this role.")

    mentors = bundle.get("mentors", [])
    if mentors:
        for m in mentors[:2]:
            if vector['domain'] != "General" and m['domain'] != "General" and m['domain'] != vector['domain']:
                print(f"[FAIL] Mentor '{m['name']}' is {m['domain']}, user is {vector['domain']}")
            else:
                print(f"[PASS] Mentor '{m['name']}' is domain-safe.")
    else:
        print("[NOTE] No mentors found for this domain.")

    # Qualification Floor
    print("\n[Qualification Floor Check]")
    courses = bundle.get("recommendations", [])
    user_edu_lvl = vector['education_level']
    if courses:
        for c in courses[:2]:
            c_lvl_str = str(c['level']).lower()
            # Diplomas/Degrees mapping
            c_val = 1
            if "diploma" in c_lvl_str: c_val = 3
            elif "degree" in c_lvl_str or "bachelor" in c_lvl_str: c_val = 4
            elif "master" in c_lvl_str: c_val = 5
            
            # Professional certifications are exempt
            is_prof = "professional" in c_lvl_str or "certification" in c_lvl_str
            if not is_prof and c_val < user_edu_lvl:
                print(f"[FAIL] Course '{c['course_name']}' is lvl {c_val}, user is lvl {user_edu_lvl}")
            else:
                print(f"[PASS] Course '{c['course_name']}' is level-safe.")

    # CRI Formula Check
    print("\n[CRI Formula Check]")
    cri = bundle.get("career_readiness", {})
    logs = cri.get("logs", {})
    print(f"Overall Score: {cri.get('overall')}%")
    print(f"Weights Used: Skills({logs.get('skill_alignment_after_floor', 0)}%), Exp({logs.get('exp_score', 0)}%), Demand({logs.get('demand_score', 0)}%)")
    
    if cri.get("overall", 0) > 0:
        print("[PASS] CRI is non-zero and calculated.")
    else:
        print("[FAIL] CRI calculation resulted in zero.")

    # Academic Path Check
    print("\n[Academic Path & Strategy Check]")
    if courses:
        high_conf_found = any("(High-Confidence Path)" in str(c.get("level", "")) for c in courses)
        if high_conf_found:
            print("[PASS] High-Confidence Sri Lankan programs injected successfully.")
        else:
            print("[WARNING] No High-Confidence programs injected (Check Domain/Budget match).")

        for c in courses[:3]:
            print(f"- {c['course_name']} ({c['level']}) @ {c['provider']}")

def run_suite():
    print("PATHFINDER+ HIGH-CONFIDENCE ACADEMIC VERIFICATION (PHASE 8)\n")
    engine = RecommendationEngine(from_mongo=True, show_progress=False)

    person_1_switcher = {
        "current_status": "Career Switcher",
        "experience_years": "3-5 years",
        "responsibility_level": "Planned tasks",
        "highest_education": "Bachelor's Degree",
        "target_role": "Data Analyst",
        "self_bio": "3 years in retail management. Looking to pivot into Data Analytics and BI.",
        "weekly_availability": "10-20 hours",
        "upskilling_budget": "500k+",
        "education_preference": "None",
        "ideal_workday": "Analyzing sales data, creating dashboards, SQL queries"
    }

    person_2_leader = {
        "current_status": "Working Professional",
        "experience_years": "6-10 years",
        "responsibility_level": "Supervised others",
        "highest_education": "Bachelor's Degree",
        "target_role": "Digital Marketing Specialist",
        "self_bio": "8 years in traditional marketing. Want to lead digital strategy and analytics teams.",
        "weekly_availability": "5-10 hours",
        "upskilling_budget": "200k-500k",
        "education_preference": "MSc",
        "ideal_workday": "Strategic planning, campaign tracking, leading marketing teams"
    }

    verify_persona(engine, "Persona 1 (Switcher -> Data Analyst)", person_1_switcher)
    verify_persona(engine, "Persona 2 (Leader -> Digital Marketing)", person_2_leader)

if __name__ == "__main__":
    run_suite()
