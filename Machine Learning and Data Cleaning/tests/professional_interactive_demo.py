import os
import sys
import pandas as pd
import json

# Add core directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'core'))
from recommendation_engine import RecommendationEngine

def print_separator(char="=", length=80):
    print(char * length)

def safe_str(s):
    """Clean string for Windows terminal output"""
    if not s: return ""
    # Remove common non-ASCII characters that break Windows CMD
    return str(s).encode('ascii', 'ignore').decode('ascii')

def display_full_dashboard(name, target_job, results):
    print_separator("#")
    print(f" PATHFINDER+ PROFESSIONAL DASHBOARD FOR: {safe_str(name).upper()}")
    print(f" Target Role: {safe_str(target_job)}")
    print_separator("#")

    # 1. Mapped Occupation
    print(f"\n[1] Mapped Industry Occupation: {safe_str(results.get('mapped_occupation'))}")
    
    # 2. Skill Gap Analysis
    print("\n[2] Skill Gap Analysis:")
    cg = [safe_str(s) for s in results.get('compulsory_skills', [])]
    og = [safe_str(s) for s in results.get('optional_skills', [])]
    print(f"  Compulsory Gaps: {', '.join(cg)}")
    print(f"  Optional Gaps: {', '.join(og)}")
    
    # 3. Assessment Questions
    print("\n[3] Personalized Skill Assessment (Next Steps):")
    for i, q in enumerate(results.get('assessment_questions', []), 1):
        q_text = q.get('question') if isinstance(q, dict) else str(q)
        print(f"  {i}. {safe_str(q_text)}")

    # 4. Career Readiness & Salary
    print("\n[4] Readiness & Market Insights:")
    readiness = results.get('readiness_score', {})
    print(f"  Career Readiness Index: {readiness.get('overall', 0)}/100 ({safe_str(readiness.get('stage', 'N/A'))})")
    print(f"  Salary Estimate: {safe_str(results.get('salary_estimate', 'N/A'))}")
    
    # 5. Career Progression & Alternate Paths
    print("\n[5] Career Strategy:")
    progression = results.get('career_progression', [])
    if isinstance(progression, list) and progression:
        prog_str = " -> ".join([safe_str(p['role']) if isinstance(p, dict) else safe_str(p) for p in progression])
        print(f"  Progression Path: {prog_str}")
        for p in progression:
            if isinstance(p, dict):
                print(f"    - {safe_str(p.get('type'))}: {safe_str(p.get('role'))} ({safe_str(p.get('typical_years', 'N/A'))})")
                print(f"      Advice: {safe_str(p.get('advice'))}")
    else:
        print("  Progression Path: N/A")
    
    alt_paths = [safe_str(s) for s in results.get('alternate_paths', [])]
    print(f"  Alternate Opportunities: {', '.join(alt_paths)}")

    # 6. Personalized Market Trends
    print("\n[6] Personalized Market Insights:")
    trends = results.get('market_trends', {})
    if "error" in trends:
        print(f"  Note: {safe_str(trends['error'])}")
    else:
        print(f"  Domain: {safe_str(trends.get('field', 'General'))}")
        skills = [safe_str(s) for s in trends.get('top_demanded_skills', {}).keys()]
        print(f"  Hot Skills in this domain: {', '.join(skills)}")
        print("  Key Market Segments:")
        for seg in trends.get('segments', [])[:2]:
            if isinstance(seg, dict):
                seg_skills = [safe_str(s) for s in seg.get('skills', [])]
                print(f"    - {safe_str(seg.get('segment'))}: High demand for {', '.join(seg_skills)}")

    # 7. ROI-Based Recommendations
    print("\n[7] Top ROI-Based Learning Recommendations:")
    if results.get('caveats'):
        for caveat in results['caveats']:
            print(f"  {safe_str(caveat)}")
            
    for i, r in enumerate(results.get('recommendations', []), 1):
        rel_val = r.get('relevance_score', 0)
        print(f"  {i}. {safe_str(r['course_name'])} [{safe_str(r['provider'])}]")
        print(f"     Fee: {safe_str(r['fee'])} | Relevance Score: {rel_val:.1f}")
        print(f"     Link: {safe_str(r['url'])}")
        print(f"     Why: {safe_str(r['why_recommended'])}")

    # 8. Job Recommendations
    print("\n[8] Current Market Job Openings (Skill Gap Matching):")
    for i, j in enumerate(results.get('job_ideas', [])[:3], 1):
        print(f"  {i}. {safe_str(j['job_title'])} at {safe_str(j['company'])}")
        print(f"     Skill Gap: {j['skill_gap_pct']}% | Deadline: {safe_str(j['deadline'])}")
        print(f"     Link: {safe_str(j['url'])}")

    # 9. 12-Month Action Plan
    print("\n[9] Personalized 12-Month Roadmap:")
    for step in results.get('action_plan', []):
        print(f"  [{safe_str(step['period'])}] {safe_str(step['focus'])}")
        print(f"    Milestone: {safe_str(step['milestone'])}")

    print("\n" + "="*80 + "\n")

def run_scenarios():
    test_dir = os.path.dirname(os.path.abspath(__file__))
    ml_dir = os.path.dirname(test_dir)
    jobs_path = os.path.join(ml_dir, "data", "processed", "all_jobs_master.csv")
    courses_path = os.path.join(ml_dir, "data", "processed", "all_courses_master.csv")
    esco_dir = os.path.join(ml_dir, "data", "raw", "esco")

    print("[INIT] Loading PathFinder+ Professional Engine (Cloud)...")
    engine = RecommendationEngine(from_mongo=True, show_progress=False)

    scenarios = [
        {
            "name": "Arjun (O/L Student)",
            "skills": ["Drawing", "English", "Logic"],
            "target": "Graphic Designer",
            "segment": "Student",
            "budget": 200000,
            "location": "Colombo"
        },
        {
            "name": "Sanduni (A/L Student - Low Budget)",
            "skills": ["Mathematics", "Physics", "Chemistry"],
            "target": "Software Engineer",
            "segment": "Student",
            "budget": 50000,
            "location": "Kandy"
        },
        {
            "name": "Miyuru (Professional Switcher)",
            "skills": ["Quality Assurance", "Selenium", "Manual Testing"],
            "target": "DevOps Engineer",
            "segment": "Professional",
            "budget": 500000,
            "location": "Online"
        }
    ]

    for s in scenarios:
        res = engine.recommend_courses(
            user_skills=s['skills'],
            target_job=s['target'],
            segment=s['segment'],
            max_budget=s['budget'],
            location=s['location']
        )
        display_full_dashboard(s['name'], s['target'], res)

if __name__ == "__main__":
    run_scenarios()
