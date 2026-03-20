import pandas as pd
import sys
import os

def check_job_matrix():
    print("=" * 60)
    print(" 🔎 PATHFINDER+ AI RECOMMENDER: LIVE JOB MATRIX")
    print("=" * 60)
    
    csv_path = r'c:\Users\User\Desktop\Second Year Stuff\sdgp\PathFinder+\Adjusted_Scraper\project_root\Machine Learning and Data Cleaning\data\processed\all_jobs_master.csv'
    
    if not os.path.exists(csv_path):
        print(f"CRITICAL ERROR: Cannot locate your `jobs_df.csv` at {csv_path}")
        return

    try:
        df = pd.read_csv(csv_path)
        
        # Extract unique raw titles (handling column name standardization)
        col_name = "title" if "title" in df.columns else "Job Title"
        raw_titles = df[col_name].dropna().unique().tolist()
        
        output = []
        output.append(f"Total Scraped Job Postings:      {len(df)}")
        output.append(f"Total Unique Raw Roles (Messy):  {len(raw_titles)}")
        output.append("=" * 60 + "\n")
        
        # Apply EXACTLY the same string sanitization logic that your SBERT engine now uses natively
        # This shows exactly what roles SBERT maps CVs into.
        clean_titles = set()
        for raw_job_title in raw_titles:
            title = str(raw_job_title).lower()
            # Strip out exact words we mapped inside recommendation_engine.py
            for word in ["associate", "junior", "senior", "trainee", "intern", "lead", "assistant", "(urgently required)", "executive", "officer"]:
                title = title.replace(word, "")
            
            clean_job = title.strip().title()
            if clean_job:
                clean_titles.add(clean_job)

        output.append(f"---> SANITIZED TARGET PATHS AVAILABLE FOR SBERT ({len(clean_titles)}) <---")
        output.append("This is exactly what the Recommend Engine predicts based on your CV:")
        output.append("-" * 60)
        
        # Print all unique SBERT nodes alphabetically
        for idx, t in enumerate(sorted(list(clean_titles)), 1):
            output.append(f"{idx:03d}. {t}")
            
        output.append("\n[SUCCESS] SBERT Matrix Dump Construction Finished.")
        
        with open("available_targets.txt", "w", encoding="utf-8") as f:
            f.write("\n".join(output))
            
        print("Successfully generated available_targets.txt! Check your backend folder.")

    except Exception as e:
        print(f"CRITICAL ERROR LOADING SBERT MATRIX: {e}")

if __name__ == "__main__":
    check_job_matrix()
