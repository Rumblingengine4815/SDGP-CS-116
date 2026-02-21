from pymongo import MongoClient
import os
from dotenv import load_dotenv
import pandas as pd

load_dotenv("Machine Learning and Data Cleaning/.env")
client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("DATABASE_NAME", "pathfinder_plus")]

print("--- Data Diagnostics ---")
# ESCO
esco_count = db.esco_occupations.count_documents({})
esco_security = db.esco_occupations.count_documents({"preferredLabel": {"$regex": "security", "$options": "i"}})
print(f"ESCO Occupations: {esco_count} total, {esco_security} security related")

# Jobs
jobs_count = db.jobs.count_documents({})
jobs_security = db.jobs.count_documents({"title": {"$regex": "security", "$options": "i"}})
print(f"Jobs: {jobs_count} total, {jobs_security} security related")

# Courses
courses_count = db.courses.count_documents({})
courses_security = db.courses.count_documents({"course_title": {"$regex": "security", "$options": "i"}})
print(f"Courses: {courses_count} total, {courses_security} security related")

# Sample some ESCO labels to see if field names are different
sample = db.esco_occupations.find_one({}, {"_id": 0})
print(f"\nESCO Sample Keys: {list(sample.keys()) if sample else 'None'}")
if sample:
    print(f"ESCO Sample: {sample}")
