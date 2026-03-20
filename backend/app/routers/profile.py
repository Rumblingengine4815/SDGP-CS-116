from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import UserProfile, User
import sys
import os
import json

# Bind the specialized Python Pipeline engines
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "Machine Learning and Data Cleaning")))
from core.profile_engine import ProfileEngine

router = APIRouter(prefix="/api/profile", tags=["Profile Dashboard"])

def get_current_user_email(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authentication token")
    
    token = authorization.split(" ")[1]
    from ..auth import verify_token
    payload = verify_token(token)
    
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Malformed JWT Token payload")
        
    return payload["sub"]

@router.get("/status")
def get_profile_status(db: Session = Depends(get_db), email: str = Depends(get_current_user_email)):
    """
    Dedicated Node driving the State Machine Dashboard.
    Generates exact completion trajectories dynamically linked to PyTorch executions.
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found")
        
    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    
    if not profile:
        # Failsafe generation
        profile = UserProfile(user_id=user.id, state="NEW")
        db.add(profile)
        db.commit()
    
    completion = ProfileEngine.compute_profile_completion(profile)
    message = ProfileEngine.generate_message(profile)
    
    missing = []
    if not getattr(profile, 'cv_uploaded', False): missing.append("cv")
    if not getattr(profile, 'quiz_completed', False): missing.append("quiz")
    if not getattr(profile, 'skills_extracted', False): missing.append("skills")
    if not getattr(profile, 'job_matches_generated', False): missing.append("job_matches")
    
    last_bundle = {}
    if getattr(profile, 'last_bundle', None):
        try:
            last_bundle = json.loads(profile.last_bundle)
        except:
            last_bundle = {}

    return {
        "success": True,
        "completion_percentage": completion,
        "missing_components": missing,
        "message": message,
        "state": getattr(profile, 'state', "NEW"),
        "cached_results": last_bundle
    }
