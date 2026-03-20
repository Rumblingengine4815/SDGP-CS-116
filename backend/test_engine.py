import sys
import os
import time

print("Loading dependencies...")
try:
    sys.path.append(os.path.abspath(".."))
    sys.path.append(os.path.abspath(os.path.join("..", "Machine Learning and Data Cleaning")))
    from backend.app.main import engine
    from backend.app.routers.skill_assessment import QuizData
    
    print("Engine loaded. Running test payload...")
    start = time.time()
    
    data = {
        "status": "Working Professional",
        "education": "Bachelor's Degree",
        "total_experience": "3-5 years",
        "responsibility_level": "Completed independent tasks",
        "career_background": "Information Technology",
        "interests": "",
        "behavioral_responses": ""
    }
    
    vector = engine.process_comprehensive_assessment(data)
    print(f"Success! Time: {time.time() - start:.2f}s")
except Exception as e:
    print("ERROR:", e)
