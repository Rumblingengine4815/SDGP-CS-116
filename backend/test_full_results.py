import sys
import os
from pathlib import Path
import json

# Add project root to path
ml_root = Path(__file__).resolve().parent.parent / "Machine Learning and Data Cleaning"
sys.path.append(str(ml_root))

from core.recommendation_engine import RecommendationEngine

print("Initializing PathFinder+ Recommendation Engine for Multi-Industry Audit...")
engine = RecommendationEngine.from_mongo()
engine.show_progress = False

personas = [
    {
        "id": "HEALTHCARE: Senior Nurse Practitioner",
        "target_job": "specialised nurse",
        "answers": {
            "career_stage": "Working Professional",
            "highest_education": "Bachelor's Degree",
            "experience_years": "5-10 years",
            "responsibility_level": "Managed outcomes / budgets",
            "career_background": "I have been a registered nurse for 7 years in the ICU.",
            "key_achievements": "Handled critical patient care and trained 5 junior nurses.",
            "upskilling_budget": "50k-200k",
            "weekly_availability": "10-20 hours",
            "problem_solving": "Assess the impact on goals and align the team",
            "adaptability": "Pivot quickly while documenting the change",
            "education_preference": "MSc",
            "domain": "Healthcare"
        }
    },
    {
        "id": "BUSINESS: Financial Controller",
        "target_job": "financial planner",
        "answers": {
            "career_stage": "Working Professional",
            "highest_education": "Master's Degree (MBA)",
            "experience_years": "10+ years",
            "responsibility_level": "Managed outcomes / budgets",
            "career_background": "12 years in corporate accounting and financial planning.",
            "key_achievements": "Reduced corporate tax liability by 15% through rigorous auditing.",
            "upskilling_budget": "500k+",
            "weekly_availability": "< 5 hours",
            "problem_solving": "Assess the impact on goals and align the team",
            "adaptability": "Assess the impact on goals and align the team",
            "education_preference": "Postgraduate",
            "domain": "Finance"
        }
    },
    {
        "id": "DATA SCIENCE: AI Engineer",
        "target_job": "data scientist",
        "answers": {
            "career_stage": "Career Switcher",
            "highest_education": "Master's Degree (MBA)",
            "experience_years": "3-5 years",
            "responsibility_level": "Completed independent tasks",
            "career_background": "I have been analyzing business data in Excel but I've recently started learning Python and PyTorch.",
            "key_achievements": "Built a predictive model for sales forecasting.",
            "upskilling_budget": "50k-200k",
            "weekly_availability": "10-20 hours",
            "problem_solving": "Analyze the root cause and propose a new approach",
            "adaptability": "Pivot quickly while documenting the change",
            "education_preference": "MSc",
            "domain": "IT"
        }
    }
]

report = []
for p in personas:
    report.append(f"\n{'='*80}\n CASE STUDY: {p['id']}\n{'='*80}")
    
    vector = engine.process_comprehensive_assessment(p["answers"])
    bundle = engine.get_recommendations_from_assessment(vector, p["target_job"])
    
    sh = bundle.get("career_snapshot", {})
    report.append(f"\n1. target: {sh.get('target_role')} | Industry: {sh.get('preferred_industry')}")
    
    intel = bundle.get("skill_intelligence", {})
    report.append(f"\n2. SKILLS ACQUIRED: {', '.join(intel.get('current_skills', [])[:3])}")
    report.append(f"   SKILL GAPS: {', '.join(intel.get('strengthen', [])[:3])}")
    
    jobs = bundle.get("job_opportunities", [])
    report.append(f"\n3. LIVE JOBS:")
    for j in jobs[:2]:
        report.append(f"   - {j['job_title']} at {j.get('company', 'Confidential')}")
        
    courses = bundle.get("recommended_education", [])
    report.append(f"\n4. COURSES:")
    for c in courses[:2]:
        report.append(f"   - {c['course_name']} ({c.get('provider', 'N/A')})")
        
    market = bundle.get("market_demand", {})
    report.append(f"\n5. MARKET TRENDING SEGMENTS:")
    for s in market.get("segments", [])[:2]:
        report.append(f"   - {s.get('segment')} ({s.get('demand')} jobs)")

with open("industry_results.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(report))
    
print("Extraction complete. Check industry_results.txt.")
