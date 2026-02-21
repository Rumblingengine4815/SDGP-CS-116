import sys
import os
from pathlib import Path
import pandas as pd

# Add the root directory to path to see core
base_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(base_dir))

from core.recommendation_engine import RecommendationEngine

def run_tests(use_cloud=True):
    print(f">>> INITIALIZING ENGINE ({'CLOUD' if use_cloud else 'LOCAL'}) <<<")
    try:
        if use_cloud:
            engine = RecommendationEngine.from_mongo()
        else:
            # Engine now auto-detects its internal ML paths
            engine = RecommendationEngine(show_progress=False)
    except Exception as e:
        print(f"CRITICAL: Engine Init Failed: {e}")
        return
    
    personas = [
        {
            "id": "OL_STUDENT",
            "name": "Arun (O/L Student)",
            "target_job": "Graphic Designer",
            "answers": {
                "status": "O/L Student",
                "highest_education": "GCE O/L",
                "total_experience": "None",
                "responsibility_level": "Followed instructions",
                "q13": "I love drawing and sketching in my notebook.",
                "q15": "I want to be a professional Graphic Designer.",
                "budget_range": "< 50k",
                "weekly_time": "10-20 hours"
            }
        },
        {
            "id": "AL_STUDENT",
            "name": "Dilini (A/L Student)",
            "target_job": "Software Engineer",
            "answers": {
                "status": "A/L Student",
                "highest_education": "GCE A/L",
                "total_experience": "None",
                "responsibility_level": "Followed instructions",
                "q13": "I learned basic HTML and CSS recently.",
                "q15": "Software Engineer in a top tech firm.",
                "budget_range": "50k-200k",
                "weekly_time": "20+ hours"
            }
        },
        {
            "id": "UNDERGRAD",
            "name": "Kasun (Undergraduate)",
            "target_job": "Data Analyst",
            "answers": {
                "status": "Undergraduate",
                "highest_education": "Bachelor's Degree",
                "total_experience": "< 1 year",
                "responsibility_level": "Completed independent tasks",
                "q13": "I built a sports data analysis project using Python.",
                "q15": "Senior Data Scientist managing AI teams.",
                "budget_range": "50k-200k",
                "weekly_time": "10-20 hours"
            }
        },
        {
            "id": "PROFESSIONAL",
            "name": "Sam (Experienced Professional)",
            "target_job": "Project Manager",
            "answers": {
                "status": "Working Professional",
                "highest_education": "Master's / PhD",
                "total_experience": "5+ years",
                "responsibility_level": "Supervised others",
                "q13": "Managed a team of 10 developers for a fintech project.",
                "q15": "CTO or Operations Director.",
                "budget_range": "200k-500k",
                "weekly_time": "5-10 hours"
            }
        },
        {
            "id": "SWITCHER",
            "name": "Nimal (Career Switcher)",
            "target_job": "Digital Marketer",
            "answers": {
                "status": "Career Transitioning",
                "highest_education": "Bachelor's Degree",
                "total_experience": "3-5 years", # In a different field
                "responsibility_level": "Planned tasks",
                "q13": "I used to work in Accounting but I love social media trends.",
                "q15": "Marketing Manager for an e-commerce brand.",
                "budget_range": "200k-500k",
                "weekly_time": "10-20 hours"
            }
        }
    ]

    for p in personas:
        print(f"\n{'='*60}")
        print(f"TESTING PERSONA: {p['name']}")
        print(f"{'='*60}")
        
        vector = engine.process_comprehensive_assessment(p['answers'])
        
        # 1. Readiness
        readiness = engine.calculate_readiness_score(vector.get("extracted_intent_skills", []), vector, p['target_job'])
        print(f"READINESS : {readiness['overall']}% ({readiness['stage']})")
        
        # 2. Careers
        career_paths = engine.get_career_progression(p['target_job'], vector["responsibility_band"], vector.get("extracted_intent_skills", []), vector)
        print("\nCAREER PATHS:")
        for path in career_paths[:2]:
            print(f" - {path['type']}: {path['role']}")
            
        # 3. Courses
        courses_res = engine.get_recommendations_from_assessment(vector, p['target_job'])
        print("\nTOP COURSES:")
        for i, c in enumerate(courses_res.get('recommendations', [])[:2], 1):
            print(f" {i}. {c['course_name']} ({c['provider']}) | ROI: {c.get('roi_score', 0):.1f}")
            
    print("\nTests complete.")

if __name__ == "__main__":
    run_tests(use_cloud=True)
