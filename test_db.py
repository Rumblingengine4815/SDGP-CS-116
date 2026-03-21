import psycopg2

db_url = "postgresql://postgres:pathfinderplus@db.fivqjyegpeatgeatbbdj.supabase.co:5432/postgres"

print("Trying direct connection...")
try:
    conn = psycopg2.connect(db_url, connect_timeout=5)
    print("SUCCESS: Connected to Supabase DB directly!")
    conn.close()
except Exception as e:
    print("FAILED direct connection:", e)
