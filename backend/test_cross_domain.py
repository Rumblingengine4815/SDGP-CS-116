import sys
import os
from pathlib import Path

# Add project root to path so we can import 'core'
project_root = Path(__file__).resolve().parent.parent / "Machine Learning and Data Cleaning"
sys.path.append(str(project_root))

from core.recommendation_engine import RecommendationEngine

print("Initializing Recommendation Engine (this may take ~60 seconds to pull ML dicts)...")
engine = RecommendationEngine.from_mongo()

# Mock the parse_resume method to simulate different CVs without needing PDF files
original_parse = engine.parse_resume

test_personas = {
    "1. Healthcare (Nurse Practitioner)": ["patient care", "vital signs", "cpr", "wound care", "medical records", "empathy", "nursing"],
    "2. Business (Project Manager)": ["project management", "agile", "budgeting", "leadership", "stakeholder management", "jira"],
    "3. Data Science (AI Engineer)": ["python", "machine learning", "pandas", "tensorflow", "pytorch", "data visualization", "predictive modeling"],
    "4. Lorion's CV (Software Engineering Undergrad)": ["python", "typescript", "microsoft 365", "spring boot", "react.js", "nextjs", "prompt engineering", "machine learning"],
    "5. Accounting (Financial Analyst)": ["financial analysis", "forecasting", "excel", "accounting", "tax preparation", "bookkeeping"]
}

print("\nRunning Cross-Domain SBERT Semantic Extraction Tests...")
output_log = []

for persona, skills in test_personas.items():
    # temporarily patch parse_resume to return our mock skills
    engine.parse_resume = lambda path: skills
    
    # Run auto_profile
    profile = engine.auto_profile("mock_path.pdf")
    
    output_log.append(f"\n{'-'*60}")
    output_log.append(f"PERSONA: {persona}")
    output_log.append(f"Detected Skills: {', '.join(skills)}")
    output_log.append(f"➡️ SBERT ML Predicted Target Job: {profile.get('suggested_target')}")
    output_log.append(f"{'-'*60}")

# Restore
engine.parse_resume = original_parse
with open("tests_output.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(output_log))
print("\nTests Complete!")
