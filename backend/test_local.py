import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Machine Learning and Data Cleaning")))

from core.recommendation_engine import RecommendationEngine

print("Loading engine...")
engine = RecommendationEngine.from_mongo()
print("Engine loaded.")

import fitz
tmp_path = "test_run_res.pdf"
doc = fitz.open()
page = doc.new_page()
page.insert_text((50, 50), "John Doe\nSoftware Engineer\nPython, React, Machine Learning, Leadership")
doc.save(tmp_path)
doc.close()

try:
    print("Testing auto_profile...")
    profile = engine.auto_profile(tmp_path)
    
    answers = {
        "status": "Working Professional", 
        "education": "bsc",
        "total_experience": "3-5 years",
        "responsibility_level": "Completed independent tasks",
        "career_background": f"I have the following exact skillset from my CV: {', '.join(profile.get('extracted_skills', []))}",
        "interests": "Growth",
    }
    
    print("Testing process_comprehensive_assessment...")
    vec = engine.process_comprehensive_assessment(answers)
    
    print("Testing get_recommendations_from_assessment...")
    bundle = engine.get_recommendations_from_assessment(vec, target_job="Software Engineer")
    
    import json
    # TEST JSON SERIALIZATION
    s = json.dumps(bundle)
    print("SUCCESS! JSON LENGTH:", len(s))
    
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    if os.path.exists(tmp_path):
        os.remove(tmp_path)
