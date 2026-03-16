
#PathFinder+ Career Guidance Chatbot

import os
from dotenv import load_dotenv
import google.generativeai as genai
from pymongo import MongoClient

# Step 1: Load API keys from .env file
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MONGO_URI      = os.getenv("MONGO_URI")
DATABASE_NAME  = os.getenv("DATABASE_NAME", "pathfinder_plus")

def connect_to_mongodb():
    """Connect to MongoDB and return the database object."""
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
        client.admin.command("ping")  # Test the connection
        print(" Connected to MongoDB")
        return client[DATABASE_NAME]
    except Exception as e:
        print(f"  Could not connect to MongoDB: {e}")
        print("   The chatbot will still work, but won't use course/job data.")
        return None


#  Step 3: Get data from MongoDB
def get_courses(db, limit=3):
    """Fetch a few courses from the database."""
    if db is None:
        return []
    try:
        courses = list(db["courses"].find({}, {"title": 1, "provider": 1, "url": 1, "_id": 0}).limit(limit))
        return courses
    except Exception as e:
        print(f" Could not fetch courses: {e}")
        return []


def get_jobs(db, limit=3):
    """Fetch a few job listings from the database."""
    if db is None:
        return []
    try:
        jobs = list(db["jobs"].find({}, {"title": 1, "company": 1, "apply_url": 1, "_id": 0}).limit(limit))
        return jobs
    except Exception as e:
        print(f" Could not fetch jobs: {e}")
        return []

# Step 4: Build context from database
def build_context(db):
    """Turn database results into a text block for the AI to use."""
    courses = get_courses(db)
    jobs    = get_jobs(db)

    context = ""

    if courses:
        context += "Available Courses on PathFinder+:\n"
        for c in courses:
            context += f"  - {c.get('title', 'N/A')} by {c.get('provider', 'N/A')} | {c.get('url', '')}\n"
        context += "\n"

    if jobs:
        context += "Available Jobs on PathFinder+:\n"
        for j in jobs:
            context += f"  - {j.get('title', 'N/A')} at {j.get('company', 'N/A')} | {j.get('apply_url', '')}\n"
        context += "\n"

    return context

