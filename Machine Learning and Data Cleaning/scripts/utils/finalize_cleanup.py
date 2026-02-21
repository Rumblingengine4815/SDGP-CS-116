import shutil
import os
from pathlib import Path

def main():
    root = Path(__file__).parent.parent 
    # Current script is in scripts/, so root is Machine Learning...
    
    # 1. Replace Jobs File
    source = root / "data" / "processed" / "all_jobs_master_cleaned.csv"
    dest = root / "data" / "processed" / "all_jobs_master.csv"
    
    if source.exists():
        print(f"Moving {source.name} to {dest.name}...")
        try:
            shutil.move(str(source), str(dest))
            print("Success.")
        except Exception as e:
            print(f"Failed to move: {e}")
    else:
        print(f"Source file not found: {source}")

    # 2. Delete Legacy Files
    files_to_delete = [
        root / "scripts" / "esco_hybrid_approach_example.py",
        root / "tests" / "demo_advanced_features.py",
        root / "tests" / "test_diversity_progression.py",
        # root / "Machine Learning and Data Cleaning" / "scripts" / "esco_hybrid_approach_example.py" 
        # (adjusted for relative path from this script execution)
    ]
    
    for f in files_to_delete:
        if f.exists():
            print(f"Deleting {f.name}...")
            try:
                os.remove(f)
                print("Deleted.")
            except Exception as e:
                print(f"Failed to delete {f.name}: {e}")
        else:
            print(f"File not found (already deleted?): {f.name}")

if __name__ == "__main__":
    main()
