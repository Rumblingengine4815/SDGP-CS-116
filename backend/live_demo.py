import sys
import os
import json
import traceback

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from backend.app.main import engine

print("\n--- 🟢 LIVE PYTORCH MONGODB QUERY ---")

assessment = {
    "experience_years": 4,
    "responsibility_band": 1,
    "education_level": 3,
    "status_level": 2,
    "target_role": "Data Scientist",
    "domain": "Information Technology",
    "extracted_intent_skills": ["Python", "SQL", "Machine Learning"]
}

try:
    live_bundle = engine.recommend_courses(
        user_skills=["Python", "SQL", "Machine Learning"],
        target_job="Data Scientist",
        top_n=3,
        assessment_vector=assessment
    )

    output_path = os.path.join(os.path.dirname(__file__), "demo_output.json")
    with open(output_path, "w") as f:
        json.dump(live_bundle, f, indent=2)

    print("\n[SUCCESS] Wrote unified PyTorch payload to demo_output.json")
except Exception as e:
    error_path = os.path.join(os.path.dirname(__file__), "demo_error.log")
    with open(error_path, "w") as f:
        f.write(traceback.format_exc())
    print(f"\n[FATAL] Array Out-of-Bounds Dumped to {error_path}")
