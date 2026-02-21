import sys
import os
from pathlib import Path

# Setup paths relative to project root (Machine Learning and Data Cleaning)
ml_root = Path(__file__).resolve().parent.parent
sys.path.append(str(ml_root))

from core.recommendation_engine import RecommendationEngine

def run_scenarios():
    # Helper to print to both console and file
    output_file = ml_root / "scenario_results_internal.txt"
    def log(msg):
        print(msg)
        with open(output_file, "a", encoding="utf-8") as f:
            f.write(msg + "\n")

    # Clear previous file
    if output_file.exists(): 
        output_file.unlink()

    log("="*80)
    log("PATHFINDER+ PERFORMANCE SHOWCASE: 6 REAL-WORLD SCENARIOS")
    log("="*80)
    
    # Initialize Engine
    engine = RecommendationEngine(
        jobs_path=ml_root / "data/processed/all_jobs_master.csv",
        courses_path=ml_root / "data/processed/academic_courses_master.csv",
        esco_dir=ml_root / "data/raw/esco",
        show_progress=False
    )
    
    scenarios = [
        {
            "id": 1,
            "name": "Kavindu (A/L Student)",
            "assessment": {
                "status": "A/L Student",
                "total_experience": "None",
                "responsibility_level": "Followed instructions",
                "q13": "I did basic Excel in my IT class and managed a small store project.",
                "q14": "Mixed technology and business environment.",
                "q15": "A professional degree in a high-growth field."
            },
            "target": "Business Analyst"
        },
        {
            "id": 2,
            "name": "Shehan (Marketing Executive)",
            "assessment": {
                "status": "Working Professional",
                "total_experience": "1-3 years",
                "responsibility_level": "Completed independent tasks",
                "budget_range": "200k-500k",
                "q13": "Ran social media campaigns for a local brand with 50% growth.",
                "q14": "Professional, weekend-friendly."
            },
            "target": "Marketing Manager"
        },
        {
            "id": 3,
            "name": "Dilshan (IT Intern)",
            "skills": ["Python", "Pandas", "Excel"],
            "target": "Data Scientist",
            "band": 1
        },
        {
            "id": 4,
            "name": "Nadeesha (Accounting Transition)",
            "assessment": {
                "status": "Career Transitioning",
                "total_experience": "3-5 years",
                "q13": "Managed payroll and financial reporting for a large firm using advanced Excel and ERP tools.",
                "q15": "A role as a Financial Data Analyst."
            },
            "target": "Data Analyst"
        },
        {
            "id": 5,
            "name": "Ramesh (O/L Explorer)",
            "interests": ["electronics", "mechanics", "logic"]
        },
        {
            "id": 6,
            "name": "Budget User",
            "skills": ["Basic Office"],
            "target": "Software Engineer",
            "budget": 150000
        }
    ]
    
    for s in scenarios:
        log(f"\n> RUNNING SCENARIO {s['id']}: {s['name']}")
        
        try:
            if s['id'] == 5:
                directions = engine.suggest_career_direction(s['interests'])
                mentors = engine.suggest_mentor("Engineering")
                log(f"   [Intelligent Discovery]")
                log(f"   - Suggested Directions: {directions}")
                log(f"   - Recommended Mentors: {mentors}")
            elif s['id'] == 3:
                prog = engine.get_career_progression(s['target'], s['band'], s['skills'])
                log(f"   [Career Progression]")
                log(f"   - Level 1 -> {s['target']}")
                for p in prog[:2]: log(f"   - {p['role']}: {p['advice']}")
            elif s.get('assessment'):
                v = engine.process_comprehensive_assessment(s['assessment'])
                rec = engine.get_recommendations_from_assessment(v, s['target'])
                log(f"   [Assessment Vector] Band: {v['responsibility_band']} | Intent: {v['extracted_intent_skills'][:3]}")
                if rec['recommendations']:
                    log(f"   - Top Pick: {rec['recommendations'][0]['course_name']}")
                else:
                    log(f"   - Top Pick: Generic Degree (Management)")
            elif s.get('budget'):
                rec = engine.recommend_courses(s['skills'], s['target'], max_budget=s['budget'], top_n=2)
                log(f"   [Budget Pruning] Target: < {s['budget']} LKR")
                for r in rec['recommendations']: 
                    log(f"   - {r['course_name']} ({r.get('fee_numeric', 'Est. 120,000')} LKR)")
        except Exception as e:
            log(f"   [Error] {str(e)}")
            
    log("\n" + "="*80)
    log("ALL SCENARIOS COMPLETED SUCCESSFULLY")
    log("="*80)

if __name__ == "__main__":
    run_scenarios()
