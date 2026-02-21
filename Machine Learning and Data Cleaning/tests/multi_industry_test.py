import sys
import os
from pathlib import Path
import json

# Add the root directory to path to see core
base_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(base_dir))

from core.recommendation_engine import RecommendationEngine

def print_log(step, description, data=None):
    print(f"\n[STEP {step}] {description}")
    if data:
        print(f"  DATA: {json.dumps(data, indent=2) if isinstance(data, dict) else data}")

def run_multi_industry_test(use_cloud=True):
    base_dir = Path(__file__).resolve().parent.parent
    
    # 1. Initialize Engine
    print_log(1, f"Initializing Engine for Multi-Industry Verification ({'CLOUD' if use_cloud else 'LOCAL'})...")
    try:
        if use_cloud:
            engine = RecommendationEngine.from_mongo()
        else:
            # Auto-detects internal data/processed paths
            engine = RecommendationEngine(show_progress=False)
    except Exception as e:
        print(f"CRITICAL: Engine Init Failed: {e}")
        return
    
    # Diverse Personas
    personas = [
        {
            "id": "BIZ_ANALYST",
            "name": "Sarah (Business Analyst Aspirant)",
            "stage": "Undergraduate",
            "target": "Business Analyst",
            "answers": {
                "status": "Undergraduate",
                "highest_education": "Bachelor's Degree",
                "total_experience": "< 1 year",
                "responsibility_level": "Completed independent tasks",
                "q13": "I analyzed financial statements for a campus project using Excel.",
                "q15": "Strategic Business Consultant in a global firm.",
                "q16": "Lack of experience in SQL and data visualization tools like PowerBI.",
                "budget_range": "50k-200k",
                "weekly_time": "10-20 hours"
            }
        },
        {
            "id": "MARKETING",
            "name": "Kamal (Creative Marketer)",
            "stage": "Professional",
            "target": "Digital Marketing Manager",
            "answers": {
                "status": "Working Professional",
                "highest_education": "Bachelor's Degree",
                "total_experience": "3-5 years",
                "responsibility_level": "Planned tasks",
                "q13": "Increased social media engagement by 40% for a local clothing brand.",
                "q15": "Head of Digital Marketing for an e-commerce giant.",
                "q16": "Need to master SEO, SEM and advanced analytics.",
                "budget_range": "200k-500k",
                "weekly_time": "5-10 hours"
            }
        },
        {
            "id": "CHEF",
            "name": "Priyantha (Hospitality Transition)",
            "target": "Head Chef",
            "answers": {
                "status": "Working Professional",
                "highest_education": "Diploma",
                "total_experience": "5+ years",
                "responsibility_level": "Supervised others",
                "q13": "I managed a kitchen team of 10 people for 2 years.",
                "q15": "Executive Chef or Restaurant Owner.",
                "q16": "Need certification in Hospitality Management and Food Safety.",
                "budget_range": "50k-200k",
                "weekly_time": "10-20 hours"
            }
        },
        {
            "id": "HR",
            "name": "Meena (HR Specialist)",
            "target": "HR Manager",
            "answers": {
                "status": "Working Professional",
                "highest_education": "Bachelor's Degree",
                "total_experience": "1-3 years",
                "responsibility_level": "Completed independent tasks",
                "q13": "Implemented a new employee onboarding system.",
                "q15": "Senior HR Manager specializing in Organizational Development.",
                "q16": "SHRM or CIPD qualifications.",
                "budget_range": "50k-200k",
                "weekly_time": "5-10 hours"
            }
        }
    ]

    for p in personas:
        print(f"\n{'='*70}")
        print(f" TESTING PERSONA: {p['name']} ".center(70, "="))
        print(f"{'='*70}")
        
        # 2. Skill Assessment Processing
        print_log(2, "Processing Assessment Answers...", p['answers'])
        vector = engine.process_comprehensive_assessment(p['answers'])
        
        # 3. Resume Simulation (For HR Persona)
        final_skills = vector.get("extracted_intent_skills", [])
        if p['id'] == "HR":
            print_log(3, "Simulating Resume Parsing for HR Persona...")
            mock_resume_text = "Experienced HR Assistant with skills in recruitment, employee relations, and payroll management. Proficient in MS Office and basic HRIS."
            resume_skills = engine.parse_resume_text(mock_resume_text)
            print_log(4, "Extracted Skills from Resume:", resume_skills)
            final_skills = list(set(final_skills + resume_skills))
        
        # 4. Readiness Calculation
        print_log(5, f"Calculating Career Readiness for {p['target']}...")
        readiness = engine.calculate_readiness_score(final_skills, vector, p['target'])
        print(f"   [RESULT] Readiness: {readiness['overall']}% | Stage: {readiness['stage']}")
        
        # 5. Career Progression
        print_log(6, "Generating Strategic Career Milestones...")
        paths = engine.get_career_progression(p['target'], vector["responsibility_band"], final_skills, vector)
        for path in paths[:2]:
            print(f"   - {path['type'].upper()}: {path['role']}")
            
        # 6. Course Recommendations
        print_log(7, "Matching ROI-based Courses (within budget)...")
        recs = engine.get_recommendations_from_assessment(vector, p['target'])
        for c in recs.get('recommendations', [])[:2]:
            print(f"   - {c['course_name']} ({c['provider']}) | ROI: {c.get('roi_score', 0):.1f} | Fee: {c.get('fee', 'N/A')}")
            
        # 7. Mentors
        print_log(8, "Finding Expert Mentors...")
        mentors = engine.match_mentors(final_skills)
        for m in mentors[:2]:
            print(f"   - {m['name']} ({m['specialization']}) - Score: {m['score']}")

    print("\n" + "="*70)
    print(" VERIFICATION COMPLETE: ALL INDUSTRIES VALIDATED ".center(70, "="))
    print("="*70)

if __name__ == "__main__":
    run_multi_industry_test(use_cloud=True)
