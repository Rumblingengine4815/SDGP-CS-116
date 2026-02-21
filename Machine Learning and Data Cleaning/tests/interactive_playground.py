import os
import sys
import pandas as pd
import json

# Add project root to path so we can import recommendation_engine
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(base_dir, "Machine Learning and Data Cleaning", "core"))

try:
    from recommendation_engine import RecommendationEngine
except ImportError:
    # Fallback if pathing is slightly different
    sys.path.append(os.path.join(base_dir, "core"))
    from recommendation_engine import RecommendationEngine

def print_separator(char="=", length=80):
    print(char * length)

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def main():
    # Setup paths
    ml_dir = os.path.join(base_dir, "Machine Learning and Data Cleaning")
    jobs_path = os.path.join(ml_dir, "data", "processed", "all_jobs_master.csv")
    courses_path = os.path.join(ml_dir, "data", "processed", "all_courses_master.csv")
    esco_dir = os.path.join(ml_dir, "data", "raw", "esco")

    clear_screen()
    print_separator("#")
    print("      PATHFINDER+ INTERACTIVE PLAYGROUND (PROMPT & TRY)")
    print_separator("#")
    print("\n[INIT] Initializing recommendation engine from Cloud MongoDB...")
    
    try:
        engine = RecommendationEngine(show_progress=False)
        print("✅ Engine Ready!")
    except Exception as e:
        print(f"❌ Initialization Failed: {e}")
        return

    while True:
        print("\n" + "-"*40)
        print(" CREATE YOUR CAREER SCENARIO")
        print("-"*40)
        
        name = input("\nEnter your name: ").strip() or "Guest"
        target_role = input("Enter your target job (e.g., Software Engineer): ").strip() or "Data Scientist"
        skills_input = input("Enter your current skills (comma separated): ").strip()
        user_skills = [s.strip() for s in skills_input.split(",")] if skills_input else []
        
        print("\nSelect your level:")
        print("0: O/L Student")
        print("1: A/L Student")
        print("2: Undergraduate / Intern")
        print("3: Professional")
        
        level_choice = input("Choice (0-3): ").strip()
        level_map = {"0": 0, "1": 1, "2": 2, "3": 3}
        status_level = level_map.get(level_choice, 2)
        
        exp_years = input("Years of experience (0 if student): ").strip() or "0"
        
        print(f"\n[SYSTEM] Calculating roadmap for {name} -> {target_role}...")
        
        # Build assessment vector
        vector = {
            "status_level": status_level,
            "experience_years": int(exp_years),
            "extracted_intent_skills": user_skills  # Engine expects this key
        }
        
        # Get recommendations
        try:
            bundle = engine.get_recommendations_from_assessment(
                assessment_vector=vector,
                target_job=target_role
            )
            
            print_separator("-")
            print(f" COMPREHENSIVE ROADMAP FOR {name.upper()}")
            print_separator("-")
            
            print(f"\n[1] READINESS SCORE: {bundle.get('readiness_score', {}).get('overall', 0)}/100")
            print(f"    Current Stage: {bundle.get('readiness_score', {}).get('stage', 'N/A')}")
            
            print(f"\n[2] MAPPED ESCO ROLE: {bundle.get('mapped_occupation')}")
            
            print(f"    Compulsory: {', '.join(bundle.get('compulsory_skills', []))}")
            
            print(f"\n[3.5] SKILL ASSESSMENT (Next Steps):")
            for i, q in enumerate(bundle.get('assessment_questions', []), 1):
                q_text = q.get('question') if isinstance(q, dict) else str(q)
                print(f"    {i}. {q_text}")
            
            print(f"\n[4] TOP RECOMMENDATIONS:")
            for i, c in enumerate(bundle.get('recommendations', [])[:3], 1):
                print(f"    {i}. {c['course_name']} ({c.get('provider')})")
                print(f"       Fee: {c.get('fee')} | Relevance: {c.get('relevance_score', 0):.1f}")
            
            print(f"\n[5] JOB MATCHES:")
            for i, j in enumerate(bundle.get('job_ideas', [])[:3], 1):
                if j.get('job_title') == 'Not applicable at this stage':
                    print(f"    - {j['message']}")
                    break
                print(f"    {i}. {j['job_title']} at {j.get('company')}")
            
            print("\n[6] MENTOR MATCHES:")
            for i, m in enumerate(bundle.get('mentors', [])[:2], 1):
                print(f"    {i}. {m['name']} ({m.get('title')}) - Score: {m.get('score')}")

        except Exception as e:
            print(f"\n❌ Error generating roadmap: {e}")
            import traceback
            traceback.print_exc()

        again = input("\nTry another scenario? (y/n): ").lower()
        if again != 'y':
            print("Thank you for using PathFinder+!")
            break

if __name__ == "__main__":
    main()
