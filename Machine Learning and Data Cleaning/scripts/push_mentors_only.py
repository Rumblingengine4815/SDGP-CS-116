import json
import os
from pathlib import Path
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

def main():
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    db_name = os.getenv("DATABASE_NAME", "pathfinder_plus")
    
    client = MongoClient(mongo_uri)
    db = client[db_name]
    
    mentors_path = Path(__file__).parent.parent / "data" / "processed" / "mentors.json"
    
    if not mentors_path.exists():
        print("Mentors file not found!")
        return
        
    with open(mentors_path, "r", encoding="utf-8") as f:
        mentors = json.load(f)
        
    collection = db["mentors"]
    # Drop existing mentors to start fresh
    collection.drop()
    
    if mentors:
        collection.insert_many(mentors)
        print(f"Successfully uploaded {len(mentors)} mentors to MongoDB!")
    else:
        print("No mentors to upload.")

if __name__ == "__main__":
    main()
