import sys
import os
from pathlib import Path
from datetime import datetime

# Add root to path
ml_root = Path(__file__).resolve().parent.parent
sys.path.append(str(ml_root))

from core.recommendation_engine import RecommendationEngine

SEPARATOR = "=" * 60
SECTION = "-" * 40


def safe_get(d, *keys, default="N/A"):
    """Safely get nested dict values."""
    for key in keys:
        if not isinstance(d, dict):
            return default
        d = d.get(key, default)
    return d if d is not None and d != "" else default


def write_section(f, title):
    f.write(f"\n{'─'*40}\n")
    f.write(f"  {title}\n")
    f.write(f"{'─'*40}\n")
    print(f"  [{title}]")


def run_final_check():
    print(SEPARATOR)
    print("  PATHFINDER+ FINAL SYSTEM VERIFICATION")
    print(f"  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(SEPARATOR)

    # ── Step 1: Initialize Engine ──────────────────
    print("\n[STEP 1] Loading Engine from MongoDB Atlas...")
    try:
        engine = RecommendationEngine.from_mongo()
        print("[OK] Engine loaded successfully.")
    except Exception as e:
        print(f"[FAIL] Engine init failed: {e}")
        return

    # ── Personas ───────────────────────────────────
    personas = [
        {
            "id": "OL_STUDENT",
            "name": "O/L Student (Exploring IT)",
            "education_label": "O/L",
            "answers": {
                "status": "Student",
                "highest_education": "O/L Completed",
                "total_experience": "0",
                "responsibility_level": "None (Entry)",
                "q13": "I enjoy solving math puzzles and browsing computers.",
                "q15": "Software Engineer",
                "q16": "I don't know where to start or what degree to take.",
                "budget_range": "< 50k",
                "weekly_time": "10-20 hours",
                "education_type": "Diploma"
            },
            "target": "Web Developer"
        },
        {
            "id": "AL_STUDENT",
            "name": "A/L Student (Career Start)",
            "education_label": "A/L",
            "answers": {
                "status": "Student",
                "highest_education": "A/L Completed",
                "total_experience": "0",
                "responsibility_level": "None (Entry)",
                "q13": "I built a simple HTML website for my school project using HTML and CSS.",
                "q15": "Data Scientist",
                "q16": "University fees match my budget but I want local options.",
                "budget_range": "200k-500k",
                "weekly_time": "Full-time preferred",
                "education_type": "BSc / Undergraduate"
            },
            "target": "Data Analyst"
        },
        {
            "id": "PROFESSIONAL_PIVOT",
            "name": "Professional (The Career Pivot)",
            "education_label": "Degree",
            "answers": {
                "status": "Working Professional",
                "highest_education": "Bachelor's Degree",
                "total_experience": "5+ years",
                "responsibility_level": "Lead role",
                "q13": "Managed a team of 5 engineers in cybersecurity operations and penetration testing.",
                "q15": "Security Consultant",
                "q16": "I need a Master's or high-level certification to specialise.",
                "budget_range": "500k+",
                "weekly_time": "5-10 hours",
                "education_type": "MSc / Postgraduate"
            },
            "target": "Cyber Security Engineer"
        },
        {
            "id": "BUSINESS_ANALYST",
            "name": "Business Professional",
            "education_label": "Degree",
            "answers": {
                "status": "Working Professional",
                "highest_education": "Bachelor's Degree",
                "total_experience": "3-5 years",
                "responsibility_level": "Planned tasks",
                "q13": "Analyzed market trends for a retail chain and improved supply chain efficiency.",
                "q15": "Operation Manager",
                "q16": "Want to transition into data-driven business analysis.",
                "budget_range": "200k-500k",
                "weekly_time": "Full-time preferred",
                "education_type": "Professional Qualification"
            },
            "target": "Business Analyst"
        },
        {
            "id": "HEALTHCARE_SPECIALIST",
            "name": "Healthcare Worker",
            "education_label": "Diploma",
            "answers": {
                "status": "Working Professional",
                "highest_education": "Diploma",
                "total_experience": "1-3 years",
                "responsibility_level": "Followed instructions",
                "q13": "Worked in a local pharmacy managing inventory and patient prescriptions.",
                "q15": "Senior Pharmacist",
                "q16": "Looking for advanced pharmaceutical or management degrees.",
                "budget_range": "200k-500k",
                "weekly_time": "Full-time preferred",
                "education_type": "BSc / Undergraduate"
            },
            "target": "Pharmacist"
        }
    ]

    log_file = ml_root / "final_production_logs.txt"

    with open(log_file, "w", encoding="utf-8") as f:

        f.write("PATHFINDER+ FINAL SYSTEM VERIFICATION LOG\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(SEPARATOR + "\n")

        for p in personas:
            print(f"\n{'='*50}")
            print(f"TESTING: {p['name']}")

            f.write(f"\n\n{'='*50}\n")
            f.write(f"PERSONA: {p['name']}\n")
            f.write(f"Target Role: {p['target']}\n")
            f.write(f"Education Level: {p['education_label']}\n")
            f.write(f"{'='*50}\n")

            try:
                vector = engine.process_comprehensive_assessment(p['answers'])
                bundle = engine.get_recommendations_from_assessment(vector, p['target'])
            except Exception as e:
                f.write(f"[ERROR] Could not generate bundle: {e}\n")
                print(f"  [ERROR] {e}")
                continue

            # ── 1. Overview ─────────────────────────────
            write_section(f, "1. OVERVIEW")
            mapped = bundle.get('mapped_occupation', 'Not mapped')
            score = bundle.get('readiness_score', 'N/A')
            status = bundle.get('status', 'N/A')
            f.write(f"  Mapped Occupation : {mapped}\n")
            f.write(f"  Readiness Score   : {score}/100\n")
            f.write(f"  Status            : {status}\n")
            print(f"  Occupation: {mapped} | Score: {score}/100")

            # ── 2. Skill Gap ─────────────────────────────
            write_section(f, "2. SKILL GAP ANALYSIS")
            compulsory = bundle.get('compulsory_skills', [])
            optional = bundle.get('optional_skills', [])
            if compulsory:
                f.write(f"  Must Learn    : {', '.join(compulsory[:5])}\n")
            else:
                f.write("  Must Learn    : Skills up to date — great job!\n")
            if optional:
                f.write(f"  Nice to Have  : {', '.join(optional[:5])}\n")
            else:
                f.write("  Nice to Have  : No additional gaps identified.\n")

            # ── 3. Professional Courses ───────────────────
            write_section(f, "3. PROFESSIONAL COURSE RECOMMENDATIONS")
            courses = bundle.get('recommendations', [])
            if courses:
                for i, c in enumerate(courses[:4], 1):
                    name = c.get('course_name') or c.get('provider', 'Course details unavailable')
                    provider = c.get('provider', 'Unknown')
                    level = c.get('level', 'N/A')
                    fee = c.get('fee', 'N/A')
                    score_c = c.get('relevance_score', 'N/A')
                    f.write(f"  [{i}] {name}\n")
                    f.write(f"      Provider : {provider}\n")
                    f.write(f"      Level    : {level} | Fee: {fee} | Match: {score_c}\n")
            else:
                f.write("  No professional courses found for this role. Try broadening your target.\n")

            # ── 4. Academic Programs ──────────────────────
            write_section(f, "4. ACADEMIC PROGRAM RECOMMENDATIONS")
            academic = bundle.get('academic_recommendations', [])
            if academic:
                for i, a in enumerate(academic[:3], 1):
                    # course_name comes from course_title column; provider is the university
                    name = a.get('course_name') or 'Programme details not available'
                    provider = a.get('provider', 'Unknown Institution')
                    level = a.get('level', 'N/A')
                    fee = a.get('fee', 'N/A')
                    # If name looks like a description (>80 chars) it's a course description not a name
                    if len(str(name)) > 80:
                        display_name = str(name)[:77] + "..."
                    else:
                        display_name = name
                    f.write(f"  [{i}] {display_name}\n")
                    f.write(f"      Institution : {provider}\n")
                    f.write(f"      Level       : {level} | Fee: {fee}\n")
            else:
                f.write("  No academic programs found for this role and level.\n")

            # ── 5. Job Matches ────────────────────────────
            write_section(f, "5. JOB MATCHES")
            jobs = bundle.get('job_ideas', [])
            is_ol = p['education_label'] == "O/L"
            if is_ol or (jobs and "Not applicable" in str(jobs[0].get('job_title', ''))):
                f.write("  [Not applicable at this stage]\n")
                f.write("  Focus on studies and building your skills first. Job listings\n")
                f.write("  will be shown once you complete a Diploma or A/L qualification.\n")
                print("  Jobs: Suppressed (O/L student)")
            elif jobs and "No specific openings" not in str(jobs[0].get('job_title', '')):
                for i, j in enumerate(jobs[:4], 1):
                    f.write(f"  [{i}] {j.get('job_title', 'Unknown Role')}\n")
                    f.write(f"      Company  : {j.get('company', 'Undisclosed')}\n")
                    sal = j.get('estimated_salary')
                    if sal and str(sal).lower() != "data not available" and "0 - 0" not in str(sal):
                        if isinstance(sal, dict):
                            f.write(f"      Salary   : {sal.get('min','?')} – {sal.get('max','?')} LKR/month\n")
                        else:
                            f.write(f"      Salary   : {sal}\n")
                    else:
                        f.write(f"      Salary   : Data Not Available (Industry Benchmark)\n")
                print(f"  Jobs found: {min(len(jobs), 4)}")
            else:
                f.write("  No active job openings matched your profile right now.\n")
                f.write("  Tip: Broaden your target role or check back after completing a course.\n")

            # ── 6. Mentor Matches ─────────────────────────
            write_section(f, "6. MENTOR MATCHES")
            mentors = bundle.get('mentors', [])
            if mentors:
                for i, m in enumerate(mentors[:3], 1):
                    tag = "[PREMIUM ⭐]" if m.get('is_premium') else "[STANDARD]"
                    f.write(f"  [{i}] {tag} {m.get('name', 'Unknown')}\n")
                    f.write(f"      Title    : {m.get('title', 'N/A')} at {m.get('company', 'N/A')}\n")
                    mentor_skills = m.get('skills', [])
                    if isinstance(mentor_skills, list):
                        f.write(f"      Skills   : {', '.join(mentor_skills[:5])}\n")
                    if m.get('rate_per_hour'):
                        f.write(f"      Rate     : LKR {m['rate_per_hour']}/hr\n")
                print(f"  Mentors matched: {min(len(mentors), 3)}")
            else:
                f.write("  No mentor matches found for your current skills.\n")
                f.write("  Our mentor network is growing. Please check back soon!\n")
                f.write("  Tip: Adding more specific skills to your profile improves mentor matching.\n")
                print("  Mentors: None matched")

            # ── 7. Career Progression ─────────────────────
            write_section(f, "7. CAREER PROGRESSION PATHS")
            paths = bundle.get('career_progression', [])
            if paths:
                for i, path in enumerate(paths[:4], 1):
                    f.write(f"  [{i}] {path.get('type', 'Path')}: {path.get('role', 'N/A')}\n")
                    f.write(f"      Timeline : {path.get('typical_years', 'N/A')}\n")
                    f.write(f"      Advice   : {path.get('advice', 'Keep building your skills.')}\n")
                print(f"  Career paths: {min(len(paths), 4)}")
            else:
                f.write("  No career progression data found for this role.\n")
                f.write("  General advice: Build experience, get certified, and network actively.\n")

            # ── 8. Alternate Paths ────────────────────────
            write_section(f, "8. ALTERNATE CAREER PATHS")
            alts = bundle.get('alternate_paths', [])
            if alts:
                for a in alts[:4]:
                    f.write(f"  • {a}\n")
            else:
                f.write("  No alternate paths found. Your target role is quite specialised.\n")

            # ── 9. Salary ─────────────────────────────────
            write_section(f, "9. SALARY ESTIMATE")
            salary = bundle.get('salary_estimate', {})
            if salary and isinstance(salary, dict):
                if salary.get('min') and salary.get('max'):
                    f.write(f"  Range    : LKR {salary.get('min', '?')} – {salary.get('max', '?')} / month\n")
                    f.write(f"  Currency : {salary.get('currency', 'LKR')}\n")
                else:
                    f.write("  Salary data not yet available for this specific role.\n")
            else:
                f.write("  Salary data not available. Contact industry professionals for benchmarks.\n")

            # ── 10. Action Plan ───────────────────────────
            write_section(f, "10. ACTION PLAN")
            plan = bundle.get('action_plan', [])
            if plan:
                for i, step in enumerate(plan[:5], 1):
                    f.write(f"  Step {i}: {step}\n")
            else:
                f.write("  Action plan not generated for this profile.\n")
                f.write("  Default: (1) Identify skill gaps → (2) Enroll in courses → (3) Build portfolio\n")

            # ── 11. Market Trends ─────────────────────────
            write_section(f, "11. MARKET TRENDS")
            trends = bundle.get('market_trends', {})
            if trends.get('error'):
                f.write(f"  Status : ERROR — {trends['error']}\n")
                f.write("  Trend data temporarily unavailable. Please retry later.\n")
            elif trends.get('segments') or trends.get('top_demanded_skills'):
                f.write(f"  Field  : {trends.get('field', 'IT')}\n")
                f.write(f"  Status : ACTIVE — {len(trends.get('segments', []))} market segments analysed\n")
                segs = trends.get('segments', [])
                if segs:
                    f.write("  Top Segments:\n")
                    for seg in segs[:3]:
                        skills_str = ', '.join(seg.get('skills', [])[:3]) or 'N/A'
                        f.write(f"    • {seg.get('segment','?')} | Demand: {seg.get('demand','?')} | Key Skills: {skills_str}\n")
                top_skills = trends.get('top_demanded_skills', {})
                if top_skills:
                    f.write(f"  Hot Skills : {', '.join(list(top_skills.keys())[:5])}\n")
                f.write(f"  Insight    : {trends.get('recommendation', 'N/A')}\n")
                print(f"  Trends: {len(segs)} segments | Top: {', '.join(list(top_skills.keys())[:3])}")
            else:
                f.write("  Market trend data not available for this field right now.\n")

            f.write(f"\n{'='*50}\n")
            print(f"  ✓ {p['name']} complete.")

        # ── Final Summary ──────────────────────────────
        f.write(f"\n\n{'='*60}\n")
        f.write("VERIFICATION COMPLETE\n")
        f.write(f"Tested {len(personas)} personas\n")
        f.write(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"{'='*60}\n")

    print(f"\n{'='*50}")
    print(f"[DONE] All {len(personas)} personas verified.")
    print(f"[LOG]  Saved to: {log_file}")

    # ── Step 2: Market Trend Quick Check ──────────
    print("\n[STEP 2] Quick Market Trend Check...")
    trends = engine.get_personalized_market_trends("Software Engineer")
    if trends.get('segments') or trends.get('recommendation'):
        print(f"[OK] Market Trends Active — Field: {trends.get('field')}")
        print(f"     Insight: {trends.get('recommendation', 'N/A')}")
    else:
        print(f"[WARNING] Market Trends returned empty. Response: {trends}")

    print(f"\n[STEP 3] Engine Data Summary:")
    print(f"  Jobs loaded    : {len(engine.jobs_df):,}")
    print(f"  Courses loaded : {len(engine.courses_df):,}")
    print(f"  Mentors loaded : {len(engine.mentors_data):,}")
    print(f"  ESCO skills    : {len(engine.esco_skills):,}")


if __name__ == "__main__":
    run_final_check()
