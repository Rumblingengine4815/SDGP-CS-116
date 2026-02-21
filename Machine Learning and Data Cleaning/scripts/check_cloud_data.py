from pymongo import MongoClient
import os
from dotenv import load_dotenv
from pathlib import Path

def check_cloud_inventory():
    print(">>> CHECKING CLOUD DATA INVENTORY <<<")
    ml_root = Path(__file__).resolve().parent.parent
    load_dotenv(ml_root / ".env")
    
    uri = os.getenv("MONGO_URI")
    db_name = os.getenv("DATABASE_NAME", "pathfinder_plus")
    
    if not uri:
        print("Error: MONGO_URI not found in .env")
        return

    client = MongoClient(uri)
    db = client[db_name]
    
    collections = {
        "jobs": "Real Scraped Jobs",
        "courses": "Online Courses (Udemy/EdX)",
        "courses_academic": "SL Academic Degrees",
        "esco_occupations": "ESCO Career Framework",
        "mentors": "Industry Experts",
        "market_trends": "Market Insights"
    }
    
    print(f"\nConnected to Database: {db_name}")
    print("-" * 40)
    for coll, label in collections.items():
        count = db[coll].count_documents({})
        print(f"{label:<25} : {count} documents")
    print("-" * 40)
    
    # Peek at last 3 jobs
    print("\nLATEST SCRAPED JOBS (Samples):")
    latest_jobs = list(db.jobs.find({}, {"title": 1, "company": 1, "source": 1}).sort("_id", -1).limit(3))
    for j in latest_jobs:
        print(f"- {j.get('title')} at {j.get('company')} [via {j.get('source', 'Unknown')}]")

if __name__ == "__main__":
    check_cloud_inventory()
