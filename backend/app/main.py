from typing import List
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(
    title="SDGP Career & Course Recommendation API",
    version="0.2.0"
)

@app.get("/health")
def health_check():
    """
    Health check endpoint to verify backend is running.
    """
    return {
        "status": "ok",
        "message": "Backend is running successfully"
    }

class RecommendRequest(BaseModel):
    target_role: str = Field(..., examples=["Software Engineer"])
    skills: List[str] = Field(default_factory=list, examples=[["python", "sql", "java"]])
    interests: List[str] = Field(default_factory=list, examples=[["backend", "web development"]])
    top_n: int = Field(default=5, ge=1, le=20)
