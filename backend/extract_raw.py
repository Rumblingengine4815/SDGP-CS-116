import pymongo
import os
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
load_dotenv(dotenv_path=env_path)

client = pymongo.MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("DATABASE_NAME", "pathfinder_plus")]

print("\n--- 🟢 RAW MONGODB COURSE SAMPLES ---")
for course in db.courses.find({"category": "Information Technology"}).limit(3):
    print(f"- {course.get('course_name', course.get('course_title'))} by {course.get('institute', course.get('provider'))} ({course.get('duration')})")

print("\n--- 🟢 RAW MONGODB JOB SAMPLES ---")
for job in db.all_jobs.find({"title": {"$regex": "Data", "$options": "i"}}).limit(3):
    print(f"- {job.get('title')} at {job.get('company')}")
