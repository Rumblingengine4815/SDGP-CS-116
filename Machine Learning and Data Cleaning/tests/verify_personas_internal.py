import sys
import os
from pathlib import Path

# Add the scripts directory to path
script_dir = Path(__file__).resolve().parent.parent / "scripts"
sys.path.append(str(script_dir))

from recommendation_engine import RecommendationEngine

def run_persona_tests():
    # Setup paths
    base_dir = Path(__file__).resolve().parent.parent
    jobs_path = base_dir / "data" / "processed" / "all_jobs_master.csv"
    courses_path = base_dir / "data" / "processed" / "all_courses_master.csv"
    esco_dir = base_dir / "data" / "raw" / "esco"
    
    print("Initializing Engine (Models & Embeddings)...")
    engine = RecommendationEngine(
        jobs_path=str(jobs_path),
        courses_path=str(courses_path),
        esco_dir=str(esco_dir),
        show_progress=False
    )
    
    personas = [
        {
            "id": "OL",
            "name": "Arun",
            "stage": "O/L Student",
            "goal": "Graphic Designer",
            "answers": {
                "status": "O/L Student",
                "total_experience": "None",
                "responsibility_level": "Followed instructions",
                "highest_education": "GCE O/L",
                "q13": "I love drawing and anime art.",
                "q15": "I want to be a professional Graphic Designer or Illustrator.",
                "q16": "I don't know which tools like Adobe to use first.",
                "budget_range": "< 50k",
                "weekly_time": "10-20 hours"
            }
        },
        {
            "id": "AL",
            "name": "Dilini",
            "stage": "A/L Student",
            "goal": "Software Engineer",
            "answers": {
                "status": "A/L Student",
                "total_experience": "None",
                "responsibility_level": "Followed instructions",
                "highest_education": "GCE A/L",
                "q13": "I learned Python basics in school.",
                "q15": "Software Engineer at a multinational company.",
                "q16": "Finding the right university or degree pathway.",
                "budget_range": "50k-200k",
                "weekly_time": "20+ hours"
            }
        },
        {
            "id": "GRAD",
            "name": "Kasun",
            "stage": "Undergraduate",
            "goal": "Data Scientist",
            "answers": {
                "status": "Undergraduate",
                "total_experience": "< 1 year",
                "responsibility_level": "Completed independent tasks",
                "highest_education": "Bachelor's Degree",
                "q13": "Automated data cleaning with pandas.",
                "q15": "Data Scientist working in FinTech.",
                "q16": "Advanced SQL and machine learning deployment.",
                "budget_range": "50k-200k",
                "weekly_time": "10-20 hours"
            }
        },
        {
            "id": "PROF",
            "name": "Sam",
            "stage": "Professional",
            "goal": "Cloud Architect",
            "answers": {
                "status": "Working Professional",
                "total_experience": "5+ years",
                "responsibility_level": "Supervised others",
                "highest_education": "Bachelor's Degree",
                "q13": "Leading a team of web developers.",
                "q15": "Cloud Solution Architect for AWS/Azure.",
                "q16": "Certification costs and high-level architectural knowledge.",
                "budget_range": "200k-500k",
                "weekly_time": "5-10 hours"
            }
        },
        {
            "id": "SWITCH",
            "name": "Nimal",
            "stage": "Switcher",
            "goal": "Full Stack Developer",
            "answers": {
                "status": "Career Transitioning",
                "total_experience": "3-5 years",
                "responsibility_level": "Planned tasks",
                "highest_education": "Bachelor's Degree",
                "q13": "Managed customer accounts in a bank.",
                "q15": "Mid-level Full Stack Developer.",
                "q16": "Transitioning from non-tech to tech salary levels.",
                "budget_range": "200k-500k",
                "weekly_time": "10-20 hours"
            }
        }
    ]

    for p in personas:
        print(f"\n==================================================")
        print(f"TESTING PERSONA: {p['name']} ({p['stage']} -> {p['goal']})")
        print(f"==================================================")
        
        vector = engine.process_comprehensive_assessment(p['answers'])
        readiness = engine.calculate_readiness_score(vector.get("extracted_intent_skills", []), vector, p['goal'])
        
        print(f"CRI: {readiness['overall']}% | Stage: {readiness['stage']}")
        
        # Paths
        paths = engine.get_career_progression(p['goal'], vector["responsibility_band"], vector.get("extracted_intent_skills", []), vector)
        print("PATHS:")
        for path in paths[:2]:
            print(f" - {path['type']}: {path['role']}")
            
        # Courses
        courses = engine.get_recommendations_from_assessment(vector, p['goal'])
        print("RECS:")
        for c in courses.get('recommendations', [])[:2]:
            print(f" - {c['course_name']} ({c['provider']}) | ROI: {c.get('roi_score', 0):.1f}")
            
    print("\nVerified all 5 scenarios.")

if __name__ == "__main__":
    run_persona_tests()
