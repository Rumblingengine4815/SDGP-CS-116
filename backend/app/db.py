import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_REST_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Warning: Missing SUPABASE_REST_URL or SUPABASE_KEY in environment variables.")

# Create the client safely
supabase: Client = create_client(
    SUPABASE_URL or "https://placeholder.supabase.co", 
    SUPABASE_KEY or "anon-key-placeholder"
)