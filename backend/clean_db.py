from app.database import engine
from sqlalchemy import text

print("Connecting to Supabase PostgreSQL cluster...")
try:
    with engine.begin() as conn:
        print("Truncating 'users' and cascading generic profile vectors...")
        # Since user_profiles inherits user_id, wipe profiles first to clear foreign key locks if any
        conn.execute(text("TRUNCATE TABLE user_profiles CASCADE;"))
        conn.execute(text("TRUNCATE TABLE users CASCADE;"))
        print("Stale bcrypt hashes totally erased. System is clean.")
except Exception as e:
    print("Truncation failed:", e)
