import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "pathfinder.db")

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    columns = [
        ("state", "VARCHAR(50) DEFAULT 'NEW'"),
        ("cv_uploaded", "BOOLEAN DEFAULT 0"),
        ("quiz_completed", "BOOLEAN DEFAULT 0"),
        ("skills_extracted", "BOOLEAN DEFAULT 0"),
        ("job_matches_generated", "BOOLEAN DEFAULT 0"),
        ("last_bundle", "TEXT DEFAULT '{}'")
    ]
    
    for col_name, col_type in columns:
        try:
            cursor.execute(f"ALTER TABLE user_profiles ADD COLUMN {col_name} {col_type};")
            print(f"Added column {col_name}")
        except sqlite3.OperationalError as e:
            print(f"Column {col_name} already exists or error: {e}")
            
    conn.commit()
    conn.close()
    print("Database Migration Successful.")
except Exception as e:
    print(f"Migration Failed: {e}")
