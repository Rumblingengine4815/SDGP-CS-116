import requests
import json
import traceback

payload = {
    "role": "Working Professional",
    "name": "Test User",
    "email": "test@test.com",
    "education": "Bachelor's Degree",
    "experience_years": "3-5 years",
    "upskilling_budget": "< 50k",
    "weekly_availability": "10-20 hours",
    "domain": "Information Technology",
    "target_role": "Data Scientist",
    "responsibility_level": "Planned tasks",
    "skills": ["Python"],
    "q1_problem": "A",
    "q2_adapt": "B",
    "q3_team": "C",
    "q4_stress": "D",
    "q5_learn": "E",
    "q6_lead": "F",
    "q7_comm": "G",
    "q8_risk": "H",
    "q9_feedback": "I",
    "q10_plan": "J",
    "q11_conflict": "K",
    "q12_motivate": "L"
}

try:
    res = requests.post("http://127.0.0.1:8000/api/quiz", json=payload)
    with open("quiz_debug.json", "w") as f:
        json.dump({
            "status_code": res.status_code,
            "response": res.text
        }, f, indent=2)
except Exception as e:
    with open("quiz_debug.json", "w") as f:
        json.dump({"error": traceback.format_exc()}, f)
