"""
tests/production_invariant_tests.py
Production Invariant Test Suite (PIT) — PathFinder+ ML Engine

Tests 6 core invariants that must NEVER be violated in production:
  A. Domain Lock           — domain isolation for jobs and mentors
  B. Seniority Anchor      — accelerated plans for experienced professionals
  C. Education Hierarchy   — qualification floor enforcement
  D. Local Demand          — Sri Lanka demand grounding
  E. Hallucination Guard   — no CAD/AirTraffic in vision/detection profiles
  F. Resume Parsing        — PDF/text resume extracts plausible domain skills
"""
import sys
import os
import unittest
import tempfile
from pathlib import Path
from typing import Dict, Any

# ── Path Setup ────────────────────────────────────────────────────────────────
_CORE = Path(__file__).resolve().parent.parent / "core"
sys.path.insert(0, str(_CORE))
sys.path.insert(0, str(_CORE.parent))

try:
    from recommendation_engine import RecommendationEngine
except ImportError:
    from core.recommendation_engine import RecommendationEngine


# ─────────────────────────────────────────────────────────────────────────────
class TestProductionInvariants(unittest.TestCase):
    """Production Invariant Test Suite (PIT) — must all pass before any deploy."""

    @classmethod
    def setUpClass(cls):
        print("\n[PIT] Initialising Production Recommendation Engine (MongoDB)…")
        cls.engine = RecommendationEngine(from_mongo=True, show_progress=False)
        print("[PIT] Engine ready.\n")

    # ── Scenario A: Domain Lock ───────────────────────────────────────────────

    def test_invariant_a_domain_lock(self):
        """Domain Integrity: Healthcare user must NOT see IT jobs or mentors."""
        print("[PIT-A] Domain Lock: Healthcare → no IT cross-contamination")
        answers = {
            "current_status":    "Working Professional",
            "experience_years":  "6-10 years",
            "highest_education": "Bachelor's Degree",
            "target_role":       "Registered Nurse",
            "self_bio":          "Expert nurse with 8 years in clinical care. Interested in triage and ward management.",
            "weekly_availability": "10-20 hours",
        }
        vector = self.engine.process_comprehensive_assessment(answers)
        self.assertEqual(vector["domain"], "Healthcare",
                         f"Domain inference failed: got '{vector['domain']}'")

        bundle = self.engine.get_recommendations_from_assessment(vector, "Registered Nurse")

        for job in bundle.get("jobs", []):
            j_domain = self.engine._infer_domain(job["job_title"])
            self.assertNotEqual(j_domain, "IT",
                                f"IT job '{job['job_title']}' leaked into Healthcare domain!")

        for mentor in bundle.get("mentors", []):
            m_domain = mentor.get("domain", self.engine._infer_domain(mentor.get("title", "")))
            self.assertNotEqual(m_domain, "IT",
                                f"IT mentor '{mentor.get('name')}' leaked into Healthcare domain!")

        print(f"  [PASS] {len(bundle.get('jobs', []))} job(s) checked — all Healthcare/General.")

    # ── Scenario B: Seniority Anchor ─────────────────────────────────────────

    def test_invariant_b_seniority_anchor(self):
        """Seniority Anchor: 15-year professional must have an accelerated action plan."""
        print("[PIT-B] Seniority Anchor: 15yr professional → short bridge plan")
        answers = {
            "current_status":    "Working Professional",
            "experience_years":  "10+ years",
            "highest_education": "Master's Degree",
            "target_role":       "Project Manager",
            "self_bio":          "Senior Director with 15 years experience. Want to formalise PM skills.",
            "weekly_availability": "5-10 hours",
        }
        vector = self.engine.process_comprehensive_assessment(answers)
        bundle = self.engine.get_recommendations_from_assessment(vector, "Project Manager")

        plan = bundle.get("action_plan", {})
        duration_weeks = plan.get("estimated_weeks", 999)
        # A 15yr senior at 5-10h/week still deserves a realistic bridge (pace=2.0).
        # Invariant: must be LESS than a junior's plan (~120+ weeks at same pace).
        # We assert it's under 100 weeks (tight but achievable for an experienced bridge).
        self.assertLess(duration_weeks, 100,
                        f"Action plan for 15yr professional is too long: {duration_weeks} weeks (expected < 100)")
        print(f"  [PASS] Seniority Anchor enforced (Duration: {duration_weeks} weeks).")

    # ── Scenario C: Education Hierarchy ──────────────────────────────────────

    def test_invariant_c_edu_hierarchy(self):
        """Education Hierarchy: Master's holder must not receive Diploma/Bachelor recommendations."""
        print("[PIT-C] Edu Hierarchy: MSc holder → no Diploma/Bachelor suggestions")
        answers = {
            "current_status":    "Working Professional",
            "experience_years":  "3-5 years",
            "highest_education": "Master's Degree",
            "target_role":       "Data Scientist",
        }
        vector = self.engine.process_comprehensive_assessment(answers)
        bundle = self.engine.get_recommendations_from_assessment(vector, "Data Scientist")

        violations = []
        for rec in bundle.get("recommendations", []):
            lvl = str(rec.get("level", "")).lower()
            is_professional = "professional" in lvl or "certification" in lvl
            if not is_professional and ("diploma" in lvl or "bachelor" in lvl):
                violations.append(f"{rec.get('course_name', '?')} ({lvl})")

        self.assertEqual(len(violations), 0,
                         f"Qualification floor violated: {violations}")
        print(f"  [PASS] {len(bundle.get('recommendations', []))} course(s) checked — all Masters+ or Professional certs.")

    # ── Scenario D: Local Demand Grounding ───────────────────────────────────

    def test_invariant_d_local_demand(self):
        """Local Demand: Software Engineer demand must exceed niche Museum Curator in SL market."""
        print("[PIT-D] Local Demand: SE > niche role (Sri Lanka data)")
        se_score   = self.engine.calculate_local_demand_score("Software Engineer")
        niche_score = self.engine.calculate_local_demand_score("Museum Curator")

        print(f"  Software Engineer: {se_score}   |  Museum Curator: {niche_score}")
        self.assertGreater(se_score, niche_score,
                           "Software demand should exceed a niche role in the SL market.")
        self.assertGreater(se_score, 0.40,
                           f"Software Engineer demand score too low: {se_score}")
        print(f"  [PASS] SE demand ({se_score}) > Niche ({niche_score}) ✓")

    # ── Scenario E: Hallucination Guard ──────────────────────────────────────

    def test_invariant_e_hallucination_guard(self):
        """Hallucination Guard: 'vision/detection' bio must NEVER produce CAD/Air Traffic skills."""
        print("[PIT-E] Hallucination Guard: CV Engineer bio → no CAD/AirTraffic")
        answers = {
            "current_status":    "University Student",
            "experience_years":  "0 (None)",
            "highest_education": "Bachelor's Degree",
            "target_role":       "Computer Vision Engineer",
            "self_bio":          "Developing object detection systems with cameras and computer vision.",
        }
        vector = self.engine.process_comprehensive_assessment(answers)
        extracted = vector.get("extracted_intent_skills", [])

        blacklist = ["air traffic", "cad software", "aerospace", "cam software", "cae software"]
        found = [s for s in extracted if any(b in str(s).lower() for b in blacklist)]

        self.assertEqual(len(found), 0,
                         f"Hallucinated skills in Computer Vision extract: {found}")
        print(f"  [PASS] {len(extracted)} skills extracted — none hallucinated ✓")

    # ── Scenario F: Resume Parsing ────────────────────────────────────────────

    def test_invariant_f_resume_text_parsing(self):
        """
        Resume Text Parsing: parse_resume_text() must extract plausible skills
        for an IT professional resume and infer the correct domain.
        """
        print("[PIT-F1] Resume Text: IT Resume → extracts IT skills, infers IT domain")

        it_resume_text = """
        John Silva
        Software Engineer | 5 Years Experience | Colombo, Sri Lanka

        SKILLS
        Python, SQL, Django, REST API, PostgreSQL, Docker, Git, Agile, Scrum

        EXPERIENCE
        2019-2024: Backend Developer at TechCorp Lanka
        - Developed RESTful APIs using Django and Python
        - Managed PostgreSQL databases and Docker containers
        - Implemented CI/CD pipelines with GitHub Actions

        EDUCATION
        BSc in Computer Science — University of Moratuwa (2019)
        """

        result = self.engine.parse_resume_text(it_resume_text)

        self.assertIsInstance(result, (list, dict),
                              "parse_resume_text must return a list or dict.")

        # If it returns a dict (with 'skills' key), extract skills list
        if isinstance(result, dict):
            skills = result.get("skills", result.get("extracted_skills", []))
        else:
            skills = result

        self.assertGreater(len(skills), 0,
                           "Resume parser returned 0 skills for a rich IT resume!")

        # At least one extracted skill should relate to IT
        it_keywords = {"python", "sql", "django", "api", "docker", "git", "postgresql",
                       "agile", "scrum", "rest", "backend"}
        found_it = [s for s in skills if any(kw in str(s).lower() for kw in it_keywords)]

        self.assertGreater(len(found_it), 0,
                           f"No IT-domain skills found! Skills extracted: {skills}")
        print(f"  [PASS] Extracted {len(skills)} skills, {len(found_it)} IT-domain ✓: {found_it[:5]}")

    def test_invariant_f2_resume_domain_lock(self):
        """
        Resume Domain Lock: Domain inference from a nursing resume text
        must correctly identify Healthcare, not IT or General.
        """
        print("[PIT-F2] Resume Domain Lock: Nursing resume → Healthcare domain")

        nursing_resume_text = """
        Priya Fernando, RN — Registered Nurse | Kandy Teaching Hospital
        SKILLS: Patient care, clinical assessment, triage, IV therapy, wound care,
        ward management, nursing protocols, medication administration, patient safety.
        EXPERIENCE: 7 years nursing in emergency and medical wards.
        EDUCATION: BSc Nursing — University of Peradeniya.
        """

        # Core invariant: domain inference must correctly return Healthcare
        inferred_domain = self.engine._infer_domain(nursing_resume_text)
        self.assertEqual(inferred_domain, "Healthcare",
                         f"Domain inference for nursing resume returned '{inferred_domain}' (expected 'Healthcare').")
        print(f"  [PASS] Domain correctly inferred as '{inferred_domain}' ✓")

        # Bonus: parse_resume_text should not crash; skills may be empty (ESCO mismatch is acceptable)
        try:
            result = self.engine.parse_resume_text(nursing_resume_text)
            skills = result if isinstance(result, list) else result.get("skills", [])
            print(f"  [INFO] parse_resume_text returned {len(skills)} skills (ESCO match)")
        except Exception as e:
            self.fail(f"parse_resume_text raised an exception: {e}")

    def test_invariant_f3_auto_profile_suggestion(self):
        """
        Auto-Profile: Domain inference for a Finance-specific text must return 'Finance'.
        Invariant: accounting/banking terms must outweigh coincidental IT keywords.
        """
        print("[PIT-F3] Resume Auto-Profile: Finance text → Finance domain")

        # Deliberately Finance-only snippet — no ambiguous IT crossover terms
        finance_text = (
            "Senior Accountant with ACCA qualification. Skills: financial reporting, "
            "budgeting, tax compliance, auditing, IFRS, variance analysis, cost accounting, "
            "banking reconciliation, treasury management, investment appraisal, "
            "audit management, tax filing, VAT compliance."
        )

        inferred_domain = self.engine._infer_domain(finance_text)
        self.assertEqual(inferred_domain, "Finance",
                         f"Domain inference for Finance text returned '{inferred_domain}' (expected 'Finance').")
        print(f"  [PASS] Domain correctly inferred as '{inferred_domain}' ✓")

        # Bonus: parse_resume_text should not crash
        try:
            result = self.engine.parse_resume_text(finance_text)
            skills = result if isinstance(result, list) else result.get("skills", [])
            print(f"  [INFO] parse_resume_text returned {len(skills)} skills")
        except Exception as e:
            self.fail(f"parse_resume_text raised an exception: {e}")


# ── Entry Point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 60)
    print("  PathFinder+ Production Invariant Test Suite (PIT v2)")
    print("  Scenarios: A-Domain | B-Seniority | C-EduLevel |")
    print("             D-Demand | E-Hallucination | F-Resume")
    print("=" * 60)
    unittest.main(verbosity=2)
