import os
import sys
from typing import List, Any, Dict

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

class RecommendRequest(BaseModel):
    target_role: str
    skills: List[str] = []
    interests: List[str] = []
    top_n: int = 5

# --- Path setup: allow importing ML code that lives outside backend/ ---
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ML_ROOT = os.path.join(REPO_ROOT, "Machine Learning and Data Cleaning")
sys.path.append(ML_ROOT)

try:
    from core.recommendation_engine import RecommendationEngine
except Exception as e:
    raise RuntimeError(
        f"Failed to import RecommendationEngine. Check ML folder path. Error: {e}"
    )

# --- CSV paths ---
JOBS_CSV = os.path.join(ML_ROOT, "processed", "all_jobs_master.csv")
COURSES_CSV = os.path.join(ML_ROOT, "processed", "all_courses_master.csv")

from fastapi.middleware.cors import CORSMiddleware
from app.routers.users import router as auth_router

app = FastAPI(
    title="SDGP Career & Course Recommendation API",
    version="0.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load engine once (startup) ---
try:
    print("Initializing PyTorch engine natively from MongoDB clusters...")
    engine = RecommendationEngine.from_mongo()
    startup_error = None
except Exception as e:
    engine = None
    startup_error = str(e)
    print(f"CRITICAL ENGINE FAILURE: {startup_error}")

@app.get("/status")
def status():
    if engine is None:
        return {"engine_loaded": False, "error": startup_error}
    return {"engine_loaded": True}

@app.post("/api/recommend")
def recommend(req: RecommendRequest) -> Dict[str, Any]:
    """
    Generate job and course recommendations using ML engine directly.
    """
    if engine is None:
        raise HTTPException(status_code=500, detail=f"Engine not loaded: {startup_error}")

    jobs = engine.recommend_jobs(
        target_role=req.target_role,
        skills=req.skills,
        interests=req.interests,
        top_n=req.top_n,
    )

    courses = engine.recommend_courses(
        target_role=req.target_role,
        skills=req.skills,
        interests=req.interests,
        top_n=req.top_n,
    )

    return {
        "target_role": req.target_role,
        "jobs": jobs,
        "courses": courses,
    }

# --- Include Routers ---
app.include_router(auth_router, prefix="/api")

from app.routers.skill_assessment import router as quiz_router
app.include_router(quiz_router, prefix="/api")

from app.routers.resume import router as resume_router
app.include_router(resume_router, prefix="/api")
