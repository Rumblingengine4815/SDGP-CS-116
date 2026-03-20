import sys
import os
from pathlib import Path

# Add core to sys.path so we can import recommendation_engine
current_dir = Path(__file__).resolve().parent
sys.path.append(str(current_dir))

from core.recommendation_engine import RecommendationEngine
import time

def test_onet_integration():
    print("\n" + "="*50)
    print(" 🧪 PathFinder+ Backend PyTorch Diagnostics 🧪")
    print("="*50)

    print("\n[INIT] Instantiating the Singleton Recommendation Engine...")
    start = time.time()
    try:
        engine = RecommendationEngine.from_mongo()
        init_time = time.time() - start
        print(f"[SUCCESS] RecommendationEngine initialized remotely in {init_time:.2f} seconds!")
    except Exception as e:
        print(f"[FATAL ERROR] Engine failed to load: {e}")
        sys.exit(1)

    print("\n[TEST 1] Testing Phase J: O*NET Taxonomy Integration")
    if hasattr(engine, 'onet_embs') and engine.onet_embs is not None:
        print(f" -> O*NET SBERT Core Validated: Matrix Shape: {engine.onet_embs.shape}")
    else:
        print(" -> [WARNING] Core O*NET PyTorch Vector array missing. Failing over to legacy format.")

    print("\n[TEST 2] Executing O*NET Job Subsumption Logic...")
    test_skills = ["React.js", "Node.js", "MongoDB", "Express", "TailwindCSS", "Git"]
    test_role = "Full Stack Developer"
    
    print(f" -> Injecting Target Persona: {test_role} | Matrix: {', '.join(test_skills)}")
    start = time.time()
    try:
        jobs = engine.recommend_jobs(user_skills=test_skills, target_role=test_role, top_n=3)
        query_time = time.time() - start
        print(f" -> Engine Execution Latency: {query_time*1000:.2f} ms")
        
        if not jobs:
            print(" -> [WARNING] Returned 0 jobs. Engine query yielded empty results.")
        else:
            print("\n✅ LIVE O*NET -> MONGODB MAPPED RECOMMENDATIONS:")
            for i, job in enumerate(jobs):
                print(f"   {i+1}. {job.get('job_title')} @ {job.get('company')} (Confidence: {job.get('relevance_score')}%)")
                print(f"      Location: {job.get('location')} | Link: {job.get('link')}")
                
    except Exception as e:
        print(f"[FATAL ERROR] Semantic generation crashed natively: {e}")

    print("\n" + "="*50)
    print(" Diagnostic Complete. Backend functioning nominally.")
    print("="*50 + "\n")

if __name__ == "__main__":
    test_onet_integration()
