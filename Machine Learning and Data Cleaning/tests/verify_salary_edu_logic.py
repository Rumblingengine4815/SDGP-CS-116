import sys
import os
from pathlib import Path
import json

# Add the root directory to path to see core
base_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(base_dir))

from core.recommendation_engine import RecommendationEngine

def verify_logic(use_cloud=True):
    base_dir = Path(__file__).resolve().parent.parent
    
    print(f">>> INITIALIZING ENGINE ({'CLOUD' if use_cloud else 'LOCAL'}) <<<")
    try:
        if use_cloud:
            engine = RecommendationEngine.from_mongo()
        else:
            jobs_path = base_dir / "data" / "processed" / "all_jobs_master.csv"
            courses_path = base_dir / "data" / "processed" / "all_courses_master.csv"
            esco_dir = base_dir / "data" / "raw" / "esco"
            engine = RecommendationEngine(
                jobs_path=str(jobs_path),
                courses_path=str(courses_path),
                esco_dir=str(esco_dir),
                show_progress=False
            )
    except Exception as e:
        print(f"CRITICAL: Engine Init Failed: {e}")
        return
    
    # CASE 1: PROFESSIONAL LOOKING FOR MSC
    test_answers_msc = {
        "status": "Working Professional",
        "total_experience": "3-5 years",
        "education_type": "MSc / Postgraduate Degree",
        "budget_range": "500k+",
        "q13": "Data Analysis and Machine Learning",
        "q15": "Senior Data Scientist"
    }
    
    # CASE 2: STUDENT LOOKING FOR DIPLOMA/JOBS
    test_answers_diploma = {
        "status": "A/L Student",
        "total_experience": "0 (None)",
        "education_type": "Diploma",
        "budget_range": "50k-200k",
        "q13": "Basic Python and Logic",
        "q15": "Junior Web Developer"
    }

    scenarios = [
        {"target": "Data Scientist", "vector": test_answers_msc, "label": "MSc Preference"},
        {"target": "Web Developer", "vector": test_answers_diploma, "label": "Diploma Preference"}
    ]

    for s in scenarios:
        print(f"\n--- TESTING SCENARIO: {s['label']} ---")
        vector = engine.process_comprehensive_assessment(s['vector'])
        results = engine.get_recommendations_from_assessment(vector, s['target'])
        
        print(f"Target Role: {s['target']}")
        print(f"Preference: {vector.get('education_preference')}")
        
        print("\n[JOB IDEAS WITH SALARY]")
        for j in results.get('job_ideas', [])[:3]:
            print(f"- {j['job_title']} at {j['company']}")
            print(f"  Est. Salary: {j['estimated_salary']}")

        print("\n[TOP COURSE RECOMMENDATIONS]")
        for c in results.get('recommendations', [])[:3]:
            print(f"- {c['course_name']} ({c['level']}) | {c['fee']}")

    print("\n>>> VERIFICATION COMPLETE <<<")

if __name__ == "__main__":
    verify_logic(use_cloud=True)
