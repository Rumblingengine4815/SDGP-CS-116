import sys
from pathlib import Path
ml_root = Path(__file__).resolve().parent.parent
sys.path.append(str(ml_root))

from core.recommendation_engine import RecommendationEngine
import json

def test_full_bundle():
    print(">>> TESTING FULL DASHBOARD BUNDLE (CLOUD) <<<")
    engine = RecommendationEngine.from_mongo()
    
    mock_assessment = {
        "status": "Working Professional",
        "total_experience": "3-5 years",
        "responsibility_level": "Planned tasks",
        "q13": "Automated AWS deployments with Terraform",
        "q15": "DevOps Architect",
        "q16": "Need to learn Kubernetes at scale",
        "budget_range": "50k-200k"
    }
    
    # 1. Vectorize
    vector = engine.process_comprehensive_assessment(mock_assessment)
    
    # 2. Get Bundle
    bundle = engine.get_recommendations_from_assessment(vector, "DevOps Engineer")
    
    print("\n[SUCCESS] Bundle Generated")
    print(f"Mapped Role: {bundle['mapped_occupation']}")
    print(f"Course Count: {len(bundle['recommendations'])}")
    print(f"Job Count: {len(bundle['job_ideas'])}")
    print(f"Mentor Count: {len(bundle['mentors'])}")
    print(f"Progression Steps: {len(bundle['career_progression'])}")
    
    if bundle['job_ideas']:
        print(f"\nExample Job Match: {bundle['job_ideas'][0]['job_title']} at {bundle['job_ideas'][0]['company']}")

if __name__ == "__main__":
    test_full_bundle()
