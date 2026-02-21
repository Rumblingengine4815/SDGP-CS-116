import pandas as pd
from pathlib import Path

# Path to processed file
FILE_PATH = Path(r"c:\Users\User\Desktop\Second Year Stuff\sdgp\PathFinder+\Adjusted_Scraper\project_root\Machine Learning and Data Cleaning\data\processed\academic_courses_master.csv")

def verify_masters():
    if not FILE_PATH.exists():
        print(f"File not found: {FILE_PATH}")
        return

    print(f"Reading {FILE_PATH}...")
    try:
        df = pd.read_csv(FILE_PATH)
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return

    print(f"Total rows: {len(df)}")
    print(f"Columns: {df.columns.tolist()}")

    # Check by name
    name_masters = df[df['course_name'].str.contains('Master', case=False, na=False)]
    print(f"\nFound {len(name_masters)} courses with 'Master' in name")
    if not name_masters.empty:
        # Only show available columns
        display_cols = ['course_name', 'cost_numeric']
        available_cols = [c for c in display_cols if c in df.columns]
        print(name_masters[available_cols].head(10).to_string())

if __name__ == "__main__":
    verify_masters()
