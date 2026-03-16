
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
