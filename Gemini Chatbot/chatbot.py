#PathFinder+ Career Guidance Chatbot (CLI Core)

import os
from google import genai
from dotenv import load_dotenv
from pymongo import MongoClient

# Prevent Windows/ISP IPv6 routing drops for the Gemini connections
os.environ["GRPC_DNS_RESOLVER"] = "native"

# Step 1: Load API keys from .env file
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MONGO_URI      = os.getenv("MONGO_URI")
DATABASE_NAME  = os.getenv("DATABASE_NAME", "pathfinder_plus")

# Step 2: Connect to MongoDB 
def connect_to_mongodb():
    """Connect to MongoDB and return the database object."""
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
        client.admin.command("ping")  # Test the connection
        print(" Connected to MongoDB")
        return client[DATABASE_NAME]
    except Exception as e:
        print(f"  Could not connect to MongoDB. Operations will continue silently.")
        return None

#  Step 3: Get data from MongoDB
def get_courses(db, limit=3):
    if db is None: return []
    try: return list(db["courses"].find({}, {"title": 1, "provider": 1, "url": 1, "_id": 0}).limit(limit))
    except Exception: return []

def get_jobs(db, limit=3):
    if db is None: return []
    try: return list(db["jobs"].find({}, {"title": 1, "company": 1, "apply_url": 1, "_id": 0}).limit(limit))
    except Exception: return []

# Step 4: Build context from database
def build_context(db):
    courses = get_courses(db)
    jobs    = get_jobs(db)
    context = ""
    if courses:
        context += "Available Courses on PathFinder+:\n"
        for c in courses: context += f"  - {c.get('title', 'N/A')} by {c.get('provider', 'N/A')} | {c.get('url', '')}\n"
    if jobs:
        context += "Available Jobs on PathFinder+:\n"
        for j in jobs: context += f"  - {j.get('title', 'N/A')} at {j.get('company', 'N/A')} | {j.get('apply_url', '')}\n"
    return context

# Step 5: Set up Gemini AI via Native Client
def setup_gemini():
    """Configure and return the native GenAI client."""
    client = genai.Client(api_key=GEMINI_API_KEY)
    print(" Gemini AI ready (via google-genai SDK)")
    return client

system_prompt = """
You are PathFinder+ chatbot, a friendly career guidance assistant for students in Sri Lanka.
Rules:
- Be friendly, short, and helpful.
- If the user is given course or job data, mention those first.
- Never make up job titles.
- Keep answers under 200 words.
"""

# Step 6: Ask the AI a question 
def ask_gemini(client, chat_history, user_message, db):
    context = build_context(db)
    
    history_str = ""
    if chat_history:
        history_str = "[RECENT HISTORY]\n"
        for block in chat_history[-4:]: history_str += f"{block}\n"
        history_str += "[END HISTORY]\n\n"

    full_message = f"{system_prompt}\n\n{history_str}\n\n"
    if context:
        full_message += f"[Local PathFinder+ Database:]\n{context}\n\n"
    full_message += f"[User question:] {user_message}"

    try:
        response = client.models.generate_content(
            model="gemma-3-1b-it",
            contents=full_message
        )
        return response.text
    except Exception as e:
        return f"Sorry, something went wrong connecting to the Google API: {e}"

# Step 7: Main chat loop
def main():
    print("=" * 50)
    print("  PathFinder+ Career Chatbot CLI")
    print("  Type 'quit' to exit | 'reset' to start over")
    print("=" * 50)

    db     = connect_to_mongodb()
    client = setup_gemini()
    chat_history = []
    print("\nPathFinder+: Hi! I'm your career guidance assistant. How can I help you today?\n")

    while True:
        user_input = input("You: ").strip()
        if not user_input: continue
        if user_input.lower() in ("quit", "exit", "bye"):
            print("PathFinder+: Good luck with your career journey! 🚀")
            break
        if user_input.lower() == "reset":
            chat_history = []
            print("PathFinder+: Conversation cleared! How can I help you?\n")
            continue

        reply = ask_gemini(client, chat_history, user_input, db)
        print(f"\nPathFinder+: {reply}\n")
        
        # Append logic tracking
        chat_history.append(f"USER: {user_input}")
        chat_history.append(f"AI: {reply}")

if __name__ == "__main__":
    main()
