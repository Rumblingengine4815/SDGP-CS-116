import sys
import os
from pathlib import Path
import json

# Add core to path
sys.path.append(str(Path(__file__).resolve().parent / "core"))

try:
    from recommendation_engine import RecommendationEngine
except ImportError:
    # Try alternate pathing for local script run
    sys.path.append(str(Path(__file__).resolve().parent))
    from core.recommendation_engine import RecommendationEngine

def test_production_lockin():
    print("🚀 STARTING PRODUCTION RULE ENGINE VERIFICATION\n")
    engine = RecommendationEngine(from_mongo=True, show_progress=False)
    
    # CASE 1: Healthcare User (Nursing)
    # Target role: "Nurse"
    # Should NOT see IT mentors or CAD skills
    print("--- CASE 1: HEALTHCARE (NURSING) ---")
    answers_nurse = {
        "current_status": "Working Professional",
        "experience_years": "3-5 years",
        "highest_education": "Bachelor's Degree",
        "target_role": "Registered Nurse",
        "self_bio": "I have experience in patient care and triage. Looking to specialize in clinical management.",
        "weekly_availability": "10-20 hours"
    }
    
    vector_nurse = engine.process_comprehensive_assessment(answers_nurse)
    print(f"Domain Detected: {vector_nurse['domain']}")
    
    # Check Skill Extraction (Prevention of 'Air Traffic' / 'CAD')
    extracted = vector_nurse['extracted_intent_skills']
    print(f"Extracted Skills: {extracted}")
    forbidden = ["air traffic", "cad", "cam", "cae"]
    for f in forbidden:
        if any(f in s.lower() for s in extracted):
            print(f"❌ FAIL: Hallucinated skill '{f}' found in Healthcare context!")
    
    # Check recommendations
    recs = engine.get_recommendations_from_assessment(vector_nurse, "Registered Nurse")
    
    # Check Mentor Domain
    mentors = recs.get('mentors', [])
    for m in mentors:
        m_domain = engine._infer_domain(m['title'])
        if m_domain == "IT":
            print(f"❌ FAIL: IT Mentor '{m['name']}' ({m['title']}) recommended to Healthcare user!")
        else:
            print(f"✅ PASS: Mentor '{m['name']}' is domain-safe ({m_domain})")

    # CASE 2: Master's Holder (IT)
    # Should NOT be recommended Diplomas
    print("\n--- CASE 2: QUALIFICATION FLOOR (MASTER'S HOLDER) ---")
    answers_msc = {
        "current_status": "Working Professional",
        "experience_years": "6-10 years",
        "highest_education": "Master's Degree",
        "target_role": "Data Scientist",
        "self_bio": "Expert in Python and Statistics. Seeking advanced research roles.",
        "weekly_availability": "5-10 hours"
    }
    vector_msc = engine.process_comprehensive_assessment(answers_msc)
    recs_msc = engine.get_recommendations_from_assessment(vector_msc, "Data Scientist")
    
    courses = recs_msc.get('recommendations', [])
    for c in courses:
        lvl = str(c['level']).lower()
        if "diploma" in lvl or "foundation" in lvl:
            print(f"❌ FAIL: Diploma '{c['course_name']}' recommended to Master's holder!")
        else:
            print(f"✅ PASS: Course '{c['course_name']}' is level-safe ({lvl})")

    # CASE 3: Fresh Graduate (Engineering/CV)
    # Target: Computer Vision Engineer
    # Check for CAD/CAM hallucination
    print("\n--- CASE 3: COMPUTER VISION GRADUATE (HALLUCINATION CHECK) ---")
    answers_cv = {
        "current_status": "University Student",
        "experience_years": "0 (None)",
        "highest_education": "Bachelor's Degree",
        "target_role": "Computer Vision Engineer",
        "self_bio": "Final year project on deep learning for object detection. Familiar with OpenCV and PyTorch.",
        "weekly_availability": "20+ hours"
    }
    vector_cv = engine.process_comprehensive_assessment(answers_cv)
    extracted_cv = vector_cv['extracted_intent_skills']
    print(f"Extracted CV Skills: {extracted_cv}")
    if any(f in " ".join(extracted_cv).lower() for f in ["cad ", "cam ", "cae ", "air traffic"]):
         print(f"❌ FAIL: Hallucinated Engineering skills in CV context!")
    else:
         print(f"✅ PASS: No CAD/CAM/AirTraffic hallucination in CV extraction.")

    # CASE 4: CRI Metrics Verification
    print("\n--- CASE 4: CRI METRICS VERIFICATION ---")
    cri = recs_msc.get('career_readiness', {})
    print(f"CRI Total: {cri.get('overall')}")
    print(f"Metrics: {json.dumps(cri.get('logs', {}), indent=2)}")
    
    if cri.get('logs', {}).get('demand_score') > 0:
        print("✅ PASS: Local Demand Score is calculated.")
    else:
        print("❌ FAIL: Local Demand Score is zero/missing.")

if __name__ == "__main__":
    test_production_lockin()
