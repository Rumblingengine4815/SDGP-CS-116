import pandas as pd
from pathlib import Path

def consolidate_courses():
    current_dir = Path(__file__).parent
    processed_dir = current_dir / "../data/processed"
    raw_dir = current_dir / "../data/raw"
    
    academic_path = processed_dir / "academic_courses_master.csv"
    skillgap_path = raw_dir / "courses_final_20260124_234728.csv"
    output_path = processed_dir / "all_courses_master.csv"

    print("Consolidating course data...")

    # Load Academic Courses
    if academic_path.exists():
        df_acad = pd.read_csv(academic_path)
        # Standardize Acad schema
        df_acad = df_acad.rename(columns={
            "course_name": "course_title",
            "institute": "provider",
            "fees": "cost"
        })
        df_acad["type"] = "Academic"
        # Select common columns
        cols = ["course_title", "provider", "category", "duration", "cost", "course_url", "source", "type", "description"]
        # Ensure columns exist
        for col in cols:
            if col not in df_acad.columns:
                df_acad[col] = ""
        df_acad = df_acad[cols]
    else:
        print(f"Warning: Academic courses not found at {academic_path}")
        df_acad = pd.DataFrame()

    # Load Skill Gap Courses
    if skillgap_path.exists():
        df_skill = pd.read_csv(skillgap_path)
        df_skill["type"] = "Skill Gap"
        # Standardize Skill schema
        if "description" not in df_skill.columns:
            df_skill["description"] = ""
        # Map columns
        cols = ["course_title", "provider", "category", "duration", "cost", "course_url", "source", "type", "description"]
        for col in cols:
            if col not in df_skill.columns:
                df_skill[col] = ""
        df_skill = df_skill[cols]
    else:
        print(f"Warning: Skill gap courses not found at {skillgap_path}")
        df_skill = pd.DataFrame()

    # Combine
    all_courses = pd.concat([df_acad, df_skill], ignore_index=True)
    
    # Simple cleaning
    all_courses["course_title"] = all_courses["course_title"].fillna("Unknown Course")
    all_courses = all_courses.drop_duplicates(subset=["course_title", "provider"])

    # Save
    all_courses.to_csv(output_path, index=False)
    print(f"Successfully consolidated {len(all_courses)} courses to {output_path}")

if __name__ == "__main__":
    consolidate_courses()
