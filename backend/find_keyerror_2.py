from app.main import engine
import traceback
import json

target_job = 'Data Scientist'
vector = {'extracted_intent_skills': ['Python'], 'status_level': 2, 'experience_years': 3, 'budget_category': '< 50k'}
try:
    bundle = engine.get_recommendations_from_assessment(vector, target_job)
    with open('keyerror.json', 'w') as f:
        json.dump({'success': True, 'bundle': bundle}, f)
except Exception as e:
    with open('keyerror.json', 'w') as f:
        json.dump({'error': traceback.format_exc()}, f)
