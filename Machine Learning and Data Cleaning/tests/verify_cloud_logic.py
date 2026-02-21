import sys
import os
import pandas as pd
from pathlib import Path

# Add core to path
parent_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(parent_dir / "core"))

from recommendation_engine import RecommendationEngine

def test_cloud_loading():
    print(">>> INITIALIZING ENGINE FROM MONGODB ATLAS <<<")
    try:
        # Initialize engine from cloud
        engine = RecommendationEngine.from_mongo()
        
        # 1. Verify Data Loading
        if engine.jobs_df is not None and not engine.jobs_df.empty:
            print(f" Success: Loaded {len(engine.jobs_df)} jobs from Cloud.")
        else:
            print(" Failed: No jobs loaded from Cloud.")
            return

        if engine.courses_df is not None and not engine.courses_df.empty:
            print(f" Success: Loaded {len(engine.courses_df)} courses from Cloud.")
        else:
            print(" Failed: No courses loaded from Cloud.")
            return

        # 2. Run a Test Recommendation
        print("\n>>> TEST mongo db <<<")
        user_skills = ["Python", "Machine Learning"]
        target_job = "Data Scientist"
        
        bundle = engine.recommend_courses(
            user_skills=user_skills,
            target_job=target_job,
            segment="Professional",
            top_n=3
        )
        
        print(f"Target Role Mapping: {bundle.get('mapped_occupation')}")
        print(f"Recommended Courses: {len(bundle.get('recommendations', []))}")
        
        for r in bundle.get('recommendations', []):
            print(f"- {r['course_name']} ({r['provider']}) [Score: {r['relevance_score']}]")
            
        print("\n CLOUD VERIFICATION COMPLETE")
        
    except Exception as e:
        print(f" ERROR encountered during cloud test: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_cloud_loading()
