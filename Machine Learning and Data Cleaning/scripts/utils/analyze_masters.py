import pandas as pd
from pathlib import Path

FILE_PATH = Path(r"c:\Users\User\Desktop\Second Year Stuff\sdgp\PathFinder+\Adjusted_Scraper\project_root\Machine Learning and Data Cleaning\data\processed\academic_courses_master.csv")

def check_masters():
    if not FILE_PATH.exists():
        print("File not found.")
        return
    
    try:
        df = pd.read_csv(FILE_PATH)
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return

    # Filter for Masters by name since level is removed
    masters = df[df['course_name'].str.contains('Master', case=False, na=False)]
    print(f"Total Masters (by name): {len(masters)}")
    
    # Check for placeholder price (approximate check for 2.8M)
    if 'cost_numeric' in df.columns:
        placeholders = masters[masters['cost_numeric'] == 2800000]
        print(f"Masters with 2.8M fee: {len(placeholders)}")
        
        # Check for correct price
        correct = masters[masters['cost_numeric'] == 850000]
        print(f"Masters with 850k fee: {len(correct)}")

        print("\nTop 5 Costs for Masters:")
        print(masters['cost_numeric'].value_counts().head().to_string())
    else:
        print("\n'cost_numeric' column missing!")

if __name__ == "__main__":
    check_masters()
