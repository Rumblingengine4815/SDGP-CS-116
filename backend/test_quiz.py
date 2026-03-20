import httpx
print("Testing /api/skill-assessment ...")
try:
    payload = {
        "role": "Working Professional", "name": "Test", "email": "test@test.com", "education": "Bachelor's Degree",
        "experience_years": "3-5 years", "upskilling_budget": "50k-200k", "weekly_availability": "10-20 hours",
        "domain": "Information Technology", "target_role": "Data Scientist", "responsibility_level": "Completed independent tasks",
        "skills": ["Python", "Machine Learning"],
        "q1_problem": "A", "q2_adapt": "A", "q3_team": "A", "q4_stress": "A",
        "q5_learn": "A", "q6_lead": "A", "q7_comm": "A", "q8_risk": "A",
        "q9_feedback": "A", "q10_plan": "A", "q11_conflict": "A", "q12_motivate": "A"
    }
    with httpx.Client(timeout=60.0) as client:
        res = client.post("http://localhost:8000/api/skill-assessment", json=payload)
        print("STATUS:", res.status_code)
        print("RESPONSE:", res.text[:500])
except Exception as e:
    print("PYTHON EXCEPTION:", e)
