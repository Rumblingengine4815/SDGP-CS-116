import sys
import os
import pandas as pd
import json

# Add scripts to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'scripts'))

from recommendation_engine import RecommendationEngine

def run_e2e_test():
    print("==================================================")
    print("       PATHFINDER+ END-TO-END SYSTEM TEST        ")
    print("==================================================")
    
    # 1. Initialization
    print("\n[1] INITIALIZATION")
    base_dir = os.path.dirname(os.path.dirname(__file__))
    jobs_path = os.path.join(base_dir, "data", "processed", "all_jobs_master.csv")
    courses_path = os.path.join(base_dir, "data", "processed", "all_courses_master.csv")
    esco_dir = os.path.join(base_dir, "data", "raw", "esco")
    
    print(f"Loading engine from: {base_dir}")
    try:
        engine = RecommendationEngine(jobs_path, courses_path, esco_dir, show_progress=True)
        print(" Engine initialized successfully")
    except Exception as e:
        print(f" Engine initialization failed: {e}")
        return

    # 2. Mock User Profile (Student/Intern)
    print("\n[2] SCENARIO A: STUDENT / INTERNSHIP SEEKER")
    student_assessment = {
        "status": "Undergraduate",
        "total_experience": "None",
        "responsibility_level": "Followed instructions",
        "budget_range": "< 50k",
        "weekly_time": "10-20 hours",
        "q13": "Built a simple web scraper in Python", # Intent
        # ... other answers would be processed by process_comprehensive_assessment internally
        # But we can simulate the vector directly if we want, or use the public method if availability
    }
    
    # We'll use the public method to process answers -> vector
    # Mocking the scoring config since it might be loaded dynamically
    # For this test, we construct the vector manually to ensure control if config is complex
    student_vector = {
        "status_level": 0,
        "experience_years": 0,
        "responsibility_band": 0,
        "budget_category": "< 50k",
        "extracted_intent_skills": ["python", "web scraping"]
    }
    
    print(f"User Vector: {student_vector}")
    
    # 3. Internship Recommendations
    print("\n   >> Testing Internship Logic...")
    is_intern = engine._should_recommend_internships(student_vector)
    if is_intern:
        print("    Correctly identified as Internship Candidate")
    else:
        print("    FAILED to identify as Internship Candidate")
        
    progression = engine.get_career_progression("Software Engineer", 0, ["python"], assessment_vector=student_vector)
    print(f"   Generated {len(progression)} progression paths")
    
    intern_paths = [p for p in progression if "Internship" in p.get("type", "")]
    if intern_paths:
        print(f"    Found {len(intern_paths)} internship paths: {intern_paths[0]['role']}")
    else:
        print("    No internship paths found in recommendations")

    # 4. Course Recommendations
    print("\n[3] COURSE RECOMMENDATIONS")
    target_job = "Junior Software Engineer"
    print(f"   Target: {target_job}")
    
    # Mocking recommend_courses output since we are testing the integration
    try:
        courses = engine.get_recommendations_from_assessment(student_vector, target_job)
        print(f"    Recommended {len(courses)} courses")
        if len(courses) > 0:
            print(f"   Top Course: {courses[0]['course_title']} ({courses[0].get('provider', 'Unknown')})")
    except Exception as e:
        print(f"    Course recommendation failed: {e}")

    # 5. Salary Estimation (Paylab)
    print("\n[4] SALARY DATA CHECK")
   
    
    if hasattr(engine, 'pricing_config') and engine.pricing_config:
        print(f"   Pricing config loaded ({len(engine.pricing_config)} items)")
        sample_role = list(engine.pricing_config.keys())[0]
        print(f"   Sample: {sample_role} -> {engine.pricing_config[sample_role]}")
    else:
        print("    Pricing config empty or not found (Check pricing_estimates.json)")

    # 6. Mentors
    print("\n[5] MENTOR MATCHING")
    if hasattr(engine, 'mentors_data') and engine.mentors_data:
        print(f"   ✅ Mentors loaded ({len(engine.mentors_data)} profiles)")
        print(f"   Sample Mentor: {engine.mentors_data[0].get('name')}, {engine.mentors_data[0].get('specialization')}")
        
        # Simulate simple matching (logic might be in API, but lets simulate)
        # Find mentor with matching skill
        skill = "python"
        matching_mentors = [m for m in engine.mentors_data if skill.lower() in str(m.get('skills', [])).lower()]
        if matching_mentors:
            print(f"    Found {len(matching_mentors)} mentors for 'Python'")
        else:
            print("  No mentors found for 'Python'")
    else:
        print("Mentors data not loaded")

    print("\n==================================================")
    print("               TEST COMPLETE                      ")
    print("==================================================")

if __name__ == "__main__":
    run_e2e_test()
