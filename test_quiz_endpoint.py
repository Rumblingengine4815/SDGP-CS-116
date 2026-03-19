import requests
import json

payload = {
  "role": "Working Professional",
  "name": "Jane",
  "email": "jane@example.com",
  "education": "Master's Degree",
  "experience_years": "3-5 years",
  "upskilling_budget": "< 50k",
  "weekly_availability": "10-20 hours",
  "domain": "Information Technology",
  "target_role": "Data Scientist",
  "responsibility_level": "Planned tasks",
  "skills": ["Python", "SQL", "Machine Learning"],
  "problem_solving": "Analyze the root cause and propose a new approach",
  "adaptability": "Pivot quickly while documenting the change",
  "self_bio": "I love playing with AI and solving data problems",
  "ideal_workday": "Coding models and visualizing data"
}

try:
    res = requests.post("http://127.0.0.1:8000/api/quiz", json=payload)
    with open("temp_bundle_utf8.json", "w", encoding="utf-8") as f:
        json.dump(res.json(), f, indent=2)
except Exception as e:
    print(f"Failed to request: {e}")
