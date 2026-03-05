"""
PathFinder+ 12-Point Assessment CLI
Try the career assessment locally and see your results!
"""
import sys
import os
from pathlib import Path
from typing import Dict, Any

# Setup paths
ml_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ml_root))

try:
    from core.recommendation_engine import RecommendationEngine
except ImportError:
    print("Error: Could not find RecommendationEngine. Make sure you are in the project root.")
    sys.exit(1)

def run_assessment():
    print("="*60)
    print("      WELCOME TO PATHFINDER+ CAREER ASSESSMENT")
    print("="*60)
    print("Please answer the following 12 questions to generate your profile.\n")

    answers = {}
    
    # 1. Career Stage
    print("1. What is your current career stage?")
    print("   [A] Student / School Leaver")
    print("   [B] University Student")
    print("   [C] Working Professional")
    print("   [D] Career Switcher")
    choice = input("Choice (A/B/C/D): ").upper()
    stage_map = {"A": "Student / School Leaver", "B": "University Student", "C": "Working Professional", "D": "Career Switcher"}
    answers["current_status"] = stage_map.get(choice, "Student / School Leaver")

    # 2. Highest Education
    print("\n2. What is your highest level of education?")
    print("   [A] O/L or School Level")
    print("   [B] A/L")
    print("   [C] Diploma")
    print("   [D] Bachelor's Degree")
    print("   [E] Master's / PhD")
    choice = input("Choice (A/B/C/D/E): ").upper()
    edu_map = {"A": "O/L or School Level", "B": "A/L", "C": "Diploma", "D": "Bachelor's Degree", "E": "Master's / PhD"}
    answers["highest_education"] = edu_map.get(choice, "Bachelor's Degree")

    # 3. Experience Years
    print("\n3. How many years of professional experience do you have?")
    print("   [A] 0 (None)")
    print("   [B] 1-2 years")
    print("   [C] 3-5 years")
    print("   [D] 6-10 years")
    print("   [E] 10+ years")
    choice = input("Choice (A/B/C/D/E): ").upper()
    exp_map = {"A": "0 (None)", "B": "1-2 years", "C": "3-5 years", "D": "6-10 years", "E": "10+ years"}
    answers["experience_years"] = exp_map.get(choice, "0 (None)")

    # 4. Target Role
    answers["target_role"] = input("\n4. What is your target career role? (e.g. Software Engineer, Data Analyst): ")

    # 5. Responsibility Level
    print("\n5. What was your highest level of responsibility in your previous/current role?")
    print("   [A] Followed instructions")
    print("   [B] Completed independent tasks")
    print("   [C] Planned tasks")
    print("   [D] Supervised others")
    print("   [E] Managed outcomes / budgets")
    choice = input("Choice (A/B/C/D/E): ").upper()
    resp_map = {"A": "Followed instructions", "B": "Completed independent tasks", "C": "Planned tasks", "D": "Supervised others", "E": "Managed outcomes / budgets"}
    answers["responsibility_level"] = resp_map.get(choice, "Followed instructions")

    # 6. Self Bio
    answers["self_bio"] = input("\n6. Briefly describe your background and key skills (free text): ")

    # 7. Key Achievements
    answers["key_achievements"] = input("\n7. What are your key professional or academic achievements?: ")

    # 8. Ideal Workday
    answers["ideal_workday"] = input("\n8. Describe your ideal workday or the tasks you enjoy most: ")

    # 9. Problem Solving Style
    print("\n9. How do you typically approach a difficult technical problem?")
    print("   [A] Search for similar issues and try common fixes")
    print("   [B] Analyze the root cause and propose a new approach")
    print("   [C] Collaborate with others to find the most efficient fix")
    print("   [D] Escalate immediately")
    choice = input("Choice (A/B/C/D): ").upper()
    ps_map = {"A": "Search for similar issues and try common fixes", "B": "Analyze the root cause and propose a new approach", "C": "Collaborate with others to find the most efficient fix", "D": "Escalate immediately"}
    answers["problem_solving"] = ps_map.get(choice, "Search for similar issues and try common fixes")

    # 10. Adaptability
    print("\n10. How do you handle a sudden change in project direction?")
    print("   [A] Follow the new directives strictly")
    print("   [B] Pivot quickly while documenting the change")
    print("   [C] Assess the impact on goals and align the team")
    print("   [D] Resist changes that disrupt workflow")
    choice = input("Choice (A/B/C/D): ").upper()
    ad_map = {"A": "Follow the new directives strictly", "B": "Pivot quickly while documenting the change", "C": "Assess the impact on goals and align the team", "D": "Resist changes that disrupt workflow"}
    answers["adaptability"] = ad_map.get(choice, "Follow the new directives strictly")

    # 11. Upskilling Budget
    print("\n11. What is your total budget for upskilling/coursework?")
    print("   [A] < 50k LKR")
    print("   [B] 50k-200k LKR")
    print("   [C] 200k-500k LKR")
    print("   [D] 500k+ LKR")
    choice = input("Choice (A/B/C/D): ").upper()
    budget_map = {"A": "< 50k", "B": "50k-200k", "C": "200k-500k", "D": "500k+"}
    answers["upskilling_budget"] = budget_map.get(choice, "< 50k")

    # 12. Weekly Availability
    print("\n12. How many hours per week can you dedicate to learning?")
    print("   [A] 5-10 hours")
    print("   [B] 10-20 hours")
    print("   [C] 20+ hours")
    choice = input("Choice (A/B/C): ").upper()
    time_map = {"A": "5-10 hours", "B": "10-20 hours", "C": "20+ hours"}
    answers["weekly_availability"] = time_map.get(choice, "10-20 hours")

    print("\n" + "="*60)
    print("      GENERATING YOUR CAREER INSIGHTS... (Please wait)")
    print("="*60 + "\n")

    # Initialize Engine
    engine = RecommendationEngine(show_progress=False)
    
    # Process Assessment
    vector = engine.process_comprehensive_assessment(answers)
    bundle = engine.get_recommendations_from_assessment(vector, answers["target_role"])

    # Display Results
    print(f"TARGET ROLE: {bundle['mapped_occupation'].upper()}")
    print(f"CAREER READINESS (CRI): {bundle['career_readiness']['overall']}/100")
    print(f"STAGE: {bundle['career_readiness']['stage']}")
    print("-" * 40)
    
    print("\nTOP RECOMMENDED COURSES:")
    for i, c in enumerate(bundle['recommendations'][:3], 1):
        print(f"[{i}] {c['course_name']} ({c['provider']})")
        print(f"    Fee: {c['fee']} | Duration: {c['duration']}")
        print(f"    Link: {c['url']}")

    print("\nCAREER ROADMAP (Vertical Progression):")
    for r in [r for r in bundle.get('career_roadmap', []) if r['type'] == 'Vertical']:
        print(f" ▸ {r['title']} ({int(r['similarity']*100)}% Match)")

    print("\nSALARY INTELLIGENCE (LKR/Month):")
    sal = bundle.get('salary_intelligence', {})
    if sal:
        print(f" Avg: {sal.get('avg_salary', 0):,} | Range: {sal.get('min_salary', 0):,} - {sal.get('max_salary', 0):,}")

    print("\n" + "="*60)
    print("   COMPREHENSIVE RESULTS WRITTEN TO PROJECT ROOT:")
    print("   'assessment_verification_report.txt'")
    print("="*60 + "\n")

if __name__ == "__main__":
    run_assessment()
