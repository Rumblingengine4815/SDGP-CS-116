import requests
import json

payload = {
    "role": "student", "experience_years": "0-2", "responsibility_level": "entry",
    "domain": "IT", "target_role": "Software Engineer", "skills": ["Python", "React"],
    "name": "Test", "email": "test@example.com", "education": "BSc in CS",
    "q1_problem": "I analyze issues deeply.", "q2_adapt": "I adapt quickly.",
    "q3_team": "I lead teams.", "q4_stress": "I remain calm.",
    "q5_learn": "I read docs.", "q6_lead": "I guide peers.",
    "q7_comm": "I am clear.", "q8_risk": "I am cautious.",
    "q9_feedback": "I welcome it.", "q10_plan": "I use Jira.",
    "q11_conflict": "I mediate.", "q12_motivate": "I intrinsically solve."
}

try:
    res = requests.post("http://localhost:8000/api/skill-assessment", json=payload)
    print(f"Status: {res.status_code}")
    print(res.text[:1000]) # First 1000 chars
except Exception as e:
    print(f"REQUEST CRASHED: {e}")
