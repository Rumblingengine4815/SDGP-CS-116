from app.main import engine
import json, traceback

target_job = 'Data Scientist'
vector = {'extracted_intent_skills': ['Python'], 'status_level': 2, 'experience_years': 3, 'budget_category': '< 50k'}
try:
    bundle = engine.get_recommendations_from_assessment(vector, target_job)
    recs = bundle if isinstance(bundle, list) else bundle.get('recommendations', [])
    courses_payload = [c.get('course_name', 'General Course') for c in recs[:3]]
    
    jobs_payload = engine.recommend_jobs(
        user_skills=vector.get('extracted_intent_skills', []) + ['SQL'],
        target_role=target_job,
        top_n=3
    )
    jobs = [job.get('job_title', '') for job in jobs_payload] if hasattr(jobs_payload, '__iter__') and jobs_payload else [f'Junior {target_job}', f'Senior {target_job}']
    output = {'jobs': jobs, 'courses': courses_payload, 'bundle': bundle}
    print(json.dumps(output, indent=2))
except Exception as e:
    print(traceback.format_exc())
