import pandas as pd
import json
import os
import glob
from pathlib import Path

def generate_skills_json():
    print("=" * 60)
    print(" 🧠 PATHFINDER+ SKILL EXTRACTION ENGINE")
    print("=" * 60)
    
    root_dir = Path(r'c:\Users\User\Desktop\Second Year Stuff\sdgp\PathFinder+\Adjusted_Scraper\project_root')
    processed_dir = root_dir / 'Machine Learning and Data Cleaning' / 'data' / 'processed'
    alt_processed_dir = root_dir / 'Machine Learning and Data Cleaning' / 'processed'
    
    csv_files = glob.glob(str(processed_dir / '*.csv')) + glob.glob(str(alt_processed_dir / '*.csv'))
    
    all_skills = set()
    skill_cols = ["skills", "Skill", "extracted_skills", "Required Skills", "job_skills", "Skill Requirements", "required_skills"]
    
    print(f"Scanning {len(csv_files)} datasets in {processed_dir.name}...")
    
    for f in csv_files:
        try:
            df = pd.read_csv(f, low_memory=False)
            found_cols = [c for c in skill_cols if c in df.columns]
            if found_cols:
                print(f" -> Mining from {Path(f).name} using columns: {found_cols}")
                for col in found_cols:
                    for val in df[col].dropna():
                        # Split by comma or newline
                        parts = str(val).replace('\n', ',').split(',')
                        for p in parts:
                            clean_p = p.strip().title()
                            # Basic string filter to avoid scraping noise and sentences
                            if 2 < len(clean_p) < 35 and not any(char in clean_p for char in [":", ";", "(", ")", "[", "]", "*", "<", ">", "|"]):
                                all_skills.add(clean_p)
        except Exception as e:
            print(f" -> Skipped {Path(f).name} due to read error.")
            
    sorted_skills = sorted(list(all_skills))
    print("=" * 60)
    print(f"✅ Extracted {len(sorted_skills)} pristine unique market skills.")
    
    # Save natively to Frontend Public Directory so React can fetch it 0ms latency
    frontend_public = root_dir / "frontend" / "pathfinder_frontend" / "public"
    frontend_public.mkdir(parents=True, exist_ok=True)
    
    out_file = frontend_public / "assessment_skills.json"
    
    # Format the payload for extremely fast frontend mapping maps
    payload = [
        {"id": idx, "label": skill, "value": skill.lower()}
        for idx, skill in enumerate(sorted_skills)
    ]
    
    with open(out_file, "w", encoding="utf-8") as out:
        json.dump(payload, out, indent=4)
        
    print(f"📦 Successfully compiled & exported to: {out_file}")

if __name__ == "__main__":
    generate_skills_json()
