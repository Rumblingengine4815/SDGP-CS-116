from fastapi import APIRouter, HTTPException
from pymongo import MongoClient
import os
from dotenv import load_dotenv

router = APIRouter()
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "pathfinder_plus")

@router.get("/career-paths")
def get_career_paths():
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        db = client[DATABASE_NAME]
        
        # Fetch all inserted career path nodes
        paths = db.career_paths.find({}, {"_id": 0})
        
        # Build dictionary identical to what the Next.js frontend expects natively
        result = {}
        for doc in paths:
            if "track_name" in doc and "steps" in doc:
                result[doc["track_name"]] = doc["steps"]
                
        if not result:
            raise HTTPException(status_code=404, detail="No career paths found in database.")
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
