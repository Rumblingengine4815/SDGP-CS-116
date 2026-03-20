import httpx
import json

payload = {
    "role": "Working Professional",
    "name": "Kamal Perera",
    "email": "kamal@example.com",
    "education": "Bachelor's Degree in IT",
    "experience_years": "3-5 years",
    "upskilling_budget": "50k-200k",
    "weekly_availability": "10-20 hours",
    "domain": "Information Technology",
    "target_role": "Data Scientist",
    "responsibility_level": "Completed independent tasks",
    "skills": ["Python", "SQL", "Machine Learning", "Tableau", "Git"],
    "q1_problem": "I prefer taking time to analyze constraints before coding.",
    "q2_adapt": "I quickly learn new frameworks when business needs shift.",
    "q3_team": "I enjoy mentoring junior developers in my team.",
    "q4_stress": "I prioritize tasks and communicate blockers early.",
    "q5_learn": "I learn best by building hands-on projects.",
    "q6_lead": "I have occasionally led small sprint planning meetings.",
    "q7_comm": "I can explain technical data to non-technical stakeholders.",
    "q8_risk": "I take calculated risks if it improves system performance.",
    "q9_feedback": "I actively ask for code reviews to improve.",
    "q10_plan": "I map out architecture before writing any production code.",
    "q11_conflict": "I discuss disagreements objectively based on data.",
    "q12_motivate": "I am driven by solving complex algorithmic puzzles."
}

try:
    with httpx.Client(timeout=30.0) as client:
        res = client.post("http://localhost:8000/api/skill-assessment", json=payload)
        print(json.dumps(res.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
