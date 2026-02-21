import os
import sys
from pathlib import Path

# Add project root to sys.path
root = Path(__file__).resolve().parent.parent
sys.path.append(str(root))

from core.recommendation_engine import RecommendationEngine

print(">>> Starting Minimal Test <<<")
try:
    engine = RecommendationEngine.from_mongo()
    print(">>> Engine Loaded Successfully <<<")
    
    dummy_vector = {
        "status_level": 1,
        "experience_years": 0,
        "extracted_intent_skills": ["python"],
        "budget_category": "< 50k",
        "intent_embedding": [0.1] * 384
    }
    
    print(">>> Running recommend_courses <<<")
    try:
        bundle = engine.recommend_courses(
            user_skills=["python"],
            target_job="Software Engineer",
            assessment_vector=dummy_vector
        )
        print(">>> Test Finished Successfully <<<")
        print(f"Bundle Keys: {list(bundle.keys())}")
    except Exception as e:
        print(f">>> recommend_courses failed: {e}")
        traceback.print_exc()
        
except Exception as e:
    import traceback
    print(">>> GLOBAL TEST FAILURE <<<")
    traceback.print_exc()
