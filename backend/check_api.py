import requests
import json

base_url = "http://localhost:8000/api"

print("Triggering /skill-assessment...")
data = {
    "user_id": "demo_test",
    "answers": {},
    "implicit_skills": ["python"],
    "explicit_skills": ["python", "react"],
    "target_industry": "Information Technology",
    "target_role": "Software Engineer",
    "segment": "Student",
    "experience_years": 0,
    "max_budget": None,
    "max_duration": None,
    "preferred_location": "Colombo"
}

try:
    r = requests.post(f"{base_url}/skill-assessment", json=data)
    with open("api_test_results_utf8.txt", "w", encoding="utf-8") as f:
        f.write(f"Status: {r.status_code}\n")
        f.write(json.dumps(r.json(), indent=2))
    print("Assessment Test payload written to api_test_results_utf8.txt")
except Exception as e:
    print(f"Connection Error: {e}")
