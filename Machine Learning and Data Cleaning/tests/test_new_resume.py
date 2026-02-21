import sys
import os
from pathlib import Path

# Add the ML root directory to path to see core
project_root = Path(__file__).resolve().parent.parent
sys.path.append(str(project_root))

from core.recommendation_engine import RecommendationEngine

def test_resume_integration(resume_path_str, use_cloud=True):
    path = Path(resume_path_str)
    resume_name = path.name
    print(f"\n" + "="*50)
    print(f" TESTING RESUME: {resume_name} ({'CLOUD' if use_cloud else 'LOCAL'})")
    print("="*50)
    
    # 1. Initialize Engine
    try:
        if use_cloud:
            engine = RecommendationEngine.from_mongo()
        else:
            jobs_path = project_root / "data" / "processed" / "all_jobs_master.csv"
            courses_path = project_root / "data" / "processed" / "all_courses_master.csv"
            esco_dir = project_root / "data" / "raw" / "esco"
            engine = RecommendationEngine(str(jobs_path), str(courses_path), str(esco_dir), show_progress=False)
    except Exception as e:
        print(f"[ERROR] Engine Init Failed: {e}")
        return

    if not path.exists():
        print(f"[ERROR] Resume not found at {path}")
        return

    # 2. Extract Skills (Uses the new unified parse_resume)
    print(f"\n[STEP 1] Extracting skills...")
    try:
        skills = engine.parse_resume(str(path))
        print(f"[OK] Extracted Skills: {', '.join(skills) if skills else 'None'}")
    except Exception as e:
        print(f"[ERROR] Resume Parsing Failed: {e}")
        return

    # 3. Auto Profile
    print(f"\n[STEP 2] Auto-Profiling...")
    try:
        profile = engine.auto_profile(str(path))
        suggested_role = profile.get("suggested_target", "Software Engineer")
        print(f"[OK] Suggested Role: {suggested_role}")
    except Exception as e:
        print(f"[ERROR] Auto-Profile Failed: {e}")
        suggested_role = "Software Engineer"

    # 4. Recommendations
    print(f"\n[STEP 3] Generating Recommendations...")
    try:
        mock_assessment = {
            "status_level": 3,
            "responsibility_band": 2,
            "extracted_intent_skills": skills,
        }
        response = engine.get_recommendations_from_assessment(mock_assessment, suggested_role)
        courses = response.get('recommendations', [])
        print(f"[OK] Found {len(courses)} course recommendations")
        for i, c in enumerate(courses[:2], 1):
             print(f"  {i}. {c['course_name']} ({c['provider']})")
             
        mentors = engine.match_mentors(skills)
        print(f"[OK] Found {len(mentors)} mentor matches")
    except Exception as e:
        print(f"[ERROR] Logic Failed: {e}")

if __name__ == "__main__":
    resume_dir = project_root / "resume_test"
    test_files = [
        resume_dir / "lorion.pdf",
        resume_dir / "resume.avif",
        resume_dir / "Simple-Resume-Format.jpg"
    ]
    
    # Run cloud test by default if possible
    for test_file in test_files:
        if test_file.exists():
            test_resume_integration(test_file, use_cloud=True)
        else:
            print(f"Skipping missing test file: {test_file}")
