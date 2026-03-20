from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, HTTPException, Depends, Header
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from datetime import datetime
import os, uuid, shutil
from pathlib import Path
import cloudinary
import cloudinary.uploader

from sqlalchemy import (
    create_engine, Column, Integer, String, Boolean, DateTime, ForeignKey, Text
)
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# ---------------------------
# App + Storage
# ---------------------------
app = FastAPI(title="Mentor Mentorship Backend (FastAPI)")

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# DB (SQLite for Chat & Requests)
# ---------------------------
DATABASE_URL = "sqlite:///./mentor_chat.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------------------
# MongoDB (Mentors Data)
# ---------------------------
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# Cloudinary Setup
cloudinary.config( 
  cloud_name = os.getenv("CLOUD_NAME"), 
  api_key = os.getenv("CLOUDINARY_KEY"), 
  api_secret = os.getenv("API_SECRET"),
  secure=True
)

try:
    mongo_client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
    mongo_db = mongo_client[os.getenv("DATABASE_NAME", "pathfinder_plus")]
    mentors_collection = mongo_db["mentors"]
except Exception as e:
    print(f"MongoDB init error: {e}")
    mentors_collection = None

# ---------------------------
# Models
# ---------------------------
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    role = Column(String(20), default="user")  

class Assessment(Base):
    __tablename__ = "assessments"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AssessmentResult(Base):
    __tablename__ = "assessment_results"
    id = Column(Integer, primary_key=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    skill_name = Column(String(80), nullable=False)
    score = Column(Integer, nullable=False) 
        

class MentorshipRequest(Base):
    __tablename__ = "mentorship_requests"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mentor_id = Column(String(120), nullable=False) # MongoDB Str ID
    status = Column(String(20), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatMessageLog(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mentor_id = Column(String(120), nullable=False) # MongoDB Str ID
    sender = Column(String(20), nullable=False) # "user" or "mentor"
    message = Column(Text, nullable=False)
    attachment_url = Column(String(255), nullable=True) # Optional file path/url
    timestamp = Column(DateTime, default=datetime.utcnow)

# ---------------------------
# Schemas
# ---------------------------
class UserCreate(BaseModel):
    name: str
    role: str = "user"

class MentorCreate(BaseModel):
    display_name: str
    is_real: bool = False
    bio: str = ""
    active: bool = True
    expertise: Dict[str, int] = {} 

class AssessmentCreateOut(BaseModel):
    assessment_id: int

class AssessmentResultsIn(BaseModel):
    results: Dict[str, int]  

class ApplyIn(BaseModel):
    mentor_id: str

class ApproveIn(BaseModel):
    status: str  

class MessageIn(BaseModel):
    type: str = "text"   
    content: str
    attachment_url: Optional[str] = None

class MentorLoginIn(BaseModel):
    email: str
    password: str

def get_me(x_user_id: Optional[str] = Header(None), db: Session = Depends(get_db)) -> User:
    if not x_user_id:
        raise HTTPException(401, "Missing X-User-Id header")
    me = db.get(User, int(x_user_id))
    if not me:
        raise HTTPException(401, "Invalid user")
    return me


# Recommendation Engine
# ---------------------------
def recommend_mentors(results: Dict[str, int], top_k: int = 5):
    needs = {k.lower(): max(0, 100 - int(v)) for k, v in results.items()}

    if mentors_collection is None: return []
    mentors = list(mentors_collection.find())
    
    scored = []
    from bson import ObjectId
    for m in mentors:
        # expertise is a list like ["Circuit Design", "Java"]
        expertise_list = m.get("expertise", [])
        if isinstance(expertise_list, dict):
            skill_map = {k.lower(): int(v) for k, v in expertise_list.items()}
        else:
            skill_map = {str(k).lower(): 8 for k in expertise_list} # Give static power 8 to array items
            
        score = sum(needs.get(skill, 0) * skill_map.get(skill, 0) for skill in needs.keys())
        scored.append((m, score))

    scored.sort(key=lambda x: x[1], reverse=True)
    return scored[:top_k]

# ---------------------------
# Startup: create tables + seed fake mentors
# ---------------------------
@app.on_event("startup")
def startup():
    Base.metadata.create_all(engine)
    db = SessionLocal()
    try:
        # SQLite Users
        if db.query(User).count() == 0:
            db.add_all([
                User(name="User Demo", role="user"),  
                User(name="Admin Demo", role="admin"),     
            ])
            db.commit()

        # MongoDB Seed
        # Removed static fake mentor data seeding as live scraped data exists
        if mentors_collection is not None:
            print(f"MongoDB connected successfully with {mentors_collection.count_documents({})} mentors!")

    finally:
        db.close()
        
# ---------------------------
# Endpoints
# ---------------------------
@app.get("/")
def home():
    return {"message": "Mentor backend running "}

# Users
@app.post("/users")
def create_user(data: UserCreate, db: Session = Depends(get_db)):
    u = User(name=data.name, role=data.role)
    db.add(u)
    db.commit()
    db.refresh(u)
    return {"id": u.id, "name": u.name, "role": u.role}

# Mentors
@app.get("/mentors")
def list_mentors():
    if mentors_collection is None: 
        raise HTTPException(500, "MongoDB collection is not configured.")
        
    try:
        mentors = list(mentors_collection.find())
    except Exception as e:
        raise HTTPException(500, f"Database connection error: {str(e)}")
    
    formatted = []
    for m in mentors:
        exp = m.get("expertise", [])
        if isinstance(exp, list): exp_dict = {k: 8 for k in exp}
        else: exp_dict = exp
        
        formatted.append({
            "id": str(m["_id"]), 
            "display_name": m.get("name", m.get("display_name", "Unknown")), 
            "is_real": m.get("is_real", True), 
            "bio": m.get("bio", ""), 
            "active": m.get("active", True), 
            "expertise": exp_dict,
            "sector": m.get("sector", "Professional")
        })
    return formatted

@app.post("/mentors")
def create_mentor(data: MentorCreate, me: User = Depends(get_me)):
    if me.role != "admin":
        raise HTTPException(403, "Admin only")
    if mentors_collection is None:
        raise HTTPException(500, "MongoDB not configured")
        
    doc = {
        "display_name": data.display_name,
        "is_real": data.is_real,
        "bio": data.bio,
        "active": data.active,
        "expertise": data.expertise
    }
    result = mentors_collection.insert_one(doc)
    return {"mentor_id": str(result.inserted_id)}

@app.post("/mentor/login")
def login_mentor(data: MentorLoginIn):
    if data.password != "admin123":
        raise HTTPException(401, "Invalid credentials")
        
    import re
    # Extract the name part before @ to try a fuzzy match
    name_part = data.email.split("@")[0].replace(".", " ")
    query = {"$or": [
        {"contact": re.compile(f"^{data.email}$", re.IGNORECASE)},
        {"email": re.compile(f"^{data.email}$", re.IGNORECASE)},
        {"display_name": re.compile(name_part, re.IGNORECASE)},
        {"name": re.compile(name_part, re.IGNORECASE)}
    ]}
    
    if mentors_collection is not None:
        mentor = mentors_collection.find_one(query)
        if mentor:
            return {
                "token": f"simulated-jwt-{str(mentor['_id'])}",
                "mentor": {
                    "id": str(mentor["_id"]),
                    "display_name": mentor.get("name", mentor.get("display_name", "Unknown")),
                    "sector": mentor.get("sector", "Professional")
                }
            }
            
    raise HTTPException(404, f"No mentor found matching '{name_part}'. Please check your email prefix.")

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    MAX_FILE_SIZE = 8 * 1024 * 1024 # 8MB
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 8MB.")
        
    try:
        # Upload buffer directly to Cloudinary Bucket
        result = cloudinary.uploader.upload(
            file.file, 
            resource_type="auto", # auto-detects images, pdfs, videos, etc
            use_filename=True,
            folder="pathfinder_chat_attachments"
        )
        
        # Return CDN URL matching the frontend expectation
        return {"url": result["secure_url"]}
    except Exception as e:
        print(f"Cloudinary Upload Failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload file to cloud storage.")

# Assessment + Suggestions (your “Suggested Mentors based on Skill Assessment” page)
@app.post("/assessments", response_model=AssessmentCreateOut)
def create_assessment(db: Session = Depends(get_db), me: User = Depends(get_me)):
    a = Assessment(user_id=me.id)
    db.add(a)
    db.commit()
    db.refresh(a)
    return AssessmentCreateOut(assessment_id=a.id)

@app.post("/assessments/{assessment_id}/results")
def submit_assessment_results(assessment_id: int, data: AssessmentResultsIn, db: Session = Depends(get_db), me: User = Depends(get_me)):
    a = db.get(Assessment, assessment_id)
    if not a or a.user_id != me.id:
        raise HTTPException(404, "Assessment not found")

    for skill, score in data.results.items():
        db.add(AssessmentResult(assessment_id=assessment_id, skill_name=skill, score=int(score)))
    db.commit()
    return {"ok": True}


@app.get("/assessments/{assessment_id}/suggestions")
def get_suggestions(assessment_id: int, db: Session = Depends(get_db), me: User = Depends(get_me)):
    a = db.get(Assessment, assessment_id)
    if not a or a.user_id != me.id:
        raise HTTPException(404, "Assessment not found")

    rows = db.query(AssessmentResult).filter(AssessmentResult.assessment_id == assessment_id).all()
    if not rows:
        raise HTTPException(400, "No results submitted")

    results = {r.skill_name: r.score for r in rows}
    top = recommend_mentors(results, top_k=5)
    return [
        {
            "mentor_id": str(m["_id"]), 
            "display_name": m.get("name", m.get("display_name", "Unknown")), 
            "bio": m.get("bio", ""), 
            "match_score": score, 
            "expertise": m.get("expertise", {})
        } 
        for (m, score) in top
    ]

# Apply / Approve (Apply button -> Request pending/approved)
@app.post("/mentorship/apply")
def apply_for_mentor(data: ApplyIn, db: Session = Depends(get_db), me: User = Depends(get_me)):
    from bson.objectid import ObjectId
    try:
        if mentors_collection is None:
            raise HTTPException(500, "MongoDB collection is not configured.")
        mentor = mentors_collection.find_one({"_id": ObjectId(data.mentor_id)})
    except Exception as e:
        raise HTTPException(400, f"Invalid Mentor ID format or database error: {str(e)}")
        
    if not mentor or not mentor.get("active", True): #in case no mentors
        raise HTTPException(404, "Mentor not available")

    req = MentorshipRequest(user_id=me.id, mentor_id=data.mentor_id, status="pending")
    db.add(req)
    db.commit()
    db.refresh(req)
    return {"request_id": req.id, "status": req.status}  

@app.get("/mentorship/my-requests")
def my_all_requests(db: Session = Depends(get_db), me: User = Depends(get_me)):
    reqs = db.query(MentorshipRequest).filter(MentorshipRequest.user_id == me.id).all()
    # Ensure latest status overrides old ones if any duplicates exist
    status_map = {}
    for r in reqs:
        status_map[r.mentor_id] = {"status": r.status, "request_id": r.id}
    return status_map
      
@app.get("/mentorship/my-request")
def my_latest_request(db: Session = Depends(get_db), me: User = Depends(get_me)):
    req = (
        db.query(MentorshipRequest)
        .filter(MentorshipRequest.user_id == me.id)
        .order_by(MentorshipRequest.id.desc())
        .first()
    )
    if not req:
        return {"has_request": False}

    from bson.objectid import ObjectId
    try:
        if mentors_collection is None:
            raise HTTPException(500, "MongoDB collection is not configured.")
        mentor = mentors_collection.find_one({"_id": ObjectId(req.mentor_id)})
    except Exception as e:
        raise HTTPException(500, f"Database error fetching mentor: {str(e)}")
    
    return {
        "has_request": True,
        "request_id": req.id,
        "status": req.status,
        "mentor": {"id": str(mentor["_id"]), "display_name": mentor.get("name", mentor.get("display_name", "Unknown")), "bio": mentor.get("bio", "")} if mentor else None
    }
    
# --- MENTOR PERSPECTIVE ENDPOINTS ---

@app.get("/mentor/requests/{mentor_id}")
def get_incoming_requests(mentor_id: str, db: Session = Depends(get_db)):
    """Fetch all pending student applications directed to this mentor."""
    requests = (
        db.query(MentorshipRequest, User.name)
        .join(User, MentorshipRequest.user_id == User.id)
        .filter(MentorshipRequest.mentor_id == mentor_id, MentorshipRequest.status == "pending")
        .all()
    )
    return [{"request_id": r.id, "user_id": r.user_id, "student_name": name, "status": r.status, "created_at": r.created_at} for r, name in requests]

@app.get("/mentor/students/{mentor_id}")
def get_assigned_students(mentor_id: str, db: Session = Depends(get_db)):
    """Fetch all approved students assigned to this mentor."""
    requests = (
        db.query(MentorshipRequest, User.name)
        .join(User, MentorshipRequest.user_id == User.id)
        .filter(MentorshipRequest.mentor_id == mentor_id, MentorshipRequest.status == "approved")
        .all()
    )
    return [{"user_id": r.user_id, "student_name": name, "status": r.status, "assigned_at": r.created_at} for r, name in requests]


@app.patch("/mentorship/requests/{request_id}")
def approve_or_reject_request(request_id: int, data: ApproveIn, db: Session = Depends(get_db)):
    req = db.get(MentorshipRequest, request_id)
    if not req:
        raise HTTPException(404, "Request not found")
    if data.status not in ("approved", "rejected"):
        raise HTTPException(400, "status must be approved or rejected")
    req.status = data.status
    db.commit()
    return {"request_id": req.id, "status": req.status}

# Chat Endpoints
import shutil
from fastapi import UploadFile, File

@app.get("/chat/history/{mentor_id}")
def get_chat_history(mentor_id: str, db: Session = Depends(get_db)):
    """Fetch chat history for a specific mentor room."""
    messages = db.query(ChatMessageLog).filter(ChatMessageLog.mentor_id == mentor_id).order_by(ChatMessageLog.id.asc()).all()
    return [
        {
            "id": msg.id,
            "sender": msg.sender,
            "text": msg.message,
            "message": msg.message,
            "attachment_url": msg.attachment_url,
            "timestamp": msg.timestamp
        }
        for msg in messages
    ]
@app.delete("/chat/history/{mentor_id}")
def clear_chat_history(mentor_id: str, db: Session = Depends(get_db)):
    """Wipe the chat history block for a specific mentor room."""
    db.query(ChatMessageLog).filter(ChatMessageLog.mentor_id == mentor_id).delete()
    db.commit()
    return {"status": "cleared"}

@app.post("/chat/upload")
def upload_chat_file(file: UploadFile = File(...)):
    """Securely uploads a file (PDF/Image) locally to be attached in the chat."""
    import os
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"/{file_path}", "filename": file.filename}

#  WEBSOCKET CONNECTION MANAGER
class ConnectionManager:
    def __init__(self):
        # Format: { "mentor_id": [websocket1, websocket2, ...] }
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, mentor_id: str):
        await websocket.accept()
        if mentor_id not in self.active_connections:
            self.active_connections[mentor_id] = []
        self.active_connections[mentor_id].append(websocket)

    def disconnect(self, websocket: WebSocket, mentor_id: str):
        if mentor_id in self.active_connections:
            self.active_connections[mentor_id].remove(websocket)
            if not self.active_connections[mentor_id]:
                del self.active_connections[mentor_id]

    async def broadcast(self, mentor_id: str, message: dict):
        if mentor_id in self.active_connections:
            for connection in self.active_connections[mentor_id]:
                await connection.send_json(message)

manager = ConnectionManager()

# --- WEBSOCKET CHAT ENDPOINT ---

@app.websocket("/ws/chat/{mentor_id}/{user_role}")
async def websocket_chat(websocket: WebSocket, mentor_id: str, user_role: str, db: Session = Depends(get_db)):
    """
    Live WebSocket Chat Endpoint for Real-time Demo Sync.
    connects BOTH Student and Mentor tabs to the same room (`mentor_id`).
    `user_role` should be either 'user' or 'mentor'
    """
    await manager.connect(websocket, mentor_id)
    print(f"[{user_role.upper()}] Connected to room: {mentor_id}")

    try:
        while True:
            data = await websocket.receive_json()
            content = data.get("content", "")
            attachment_url = data.get("attachment_url")
            
            # Save to SQLite (using user_id=1 for simple MVP demo)
            new_msg = ChatMessageLog(
                user_id=1,
                mentor_id=mentor_id, 
                sender=user_role, 
                message=content,
                attachment_url=attachment_url
            )
            db.add(new_msg)
            db.commit()
            db.refresh(new_msg)
            
            # Broadcast to all tabs viewing this mentor
            msg_payload = {
                "id": new_msg.id,
                "sender": user_role,
                "message": new_msg.message,
                "attachment_url": new_msg.attachment_url,
                "timestamp": new_msg.timestamp.isoformat()
            }
            await manager.broadcast(mentor_id, msg_payload)
            
            # Hybrid Bot: Only reply if Student sends a message, and only simple standard replies
            if user_role == "user" and content:
                content_lower = content.lower()
                
                bot_text = None
                if any(greet in content_lower for greet in ["hello", "hi", "hey"]):
                    bot_text = "Hi there! I am currently online. How can I help you today?"
                elif "internship" in content_lower or "job" in content_lower:
                    bot_text = "I'd be happy to help you find an internship! Let's review your CV first."
                elif "skill" in content_lower or "learn" in content_lower:
                    bot_text = "Great initiative! We can definitely focus on building those foundational skills."
                    
                if bot_text:
                    bot_msg = ChatMessageLog(
                        user_id=1, mentor_id=mentor_id, sender="mentor", message=bot_text
                    )
                    db.add(bot_msg)
                    db.commit()
                    db.refresh(bot_msg)
                    
                    bot_payload = {
                        "id": bot_msg.id, "sender": "mentor", "message": bot_msg.message, 
                        "attachment_url": None, "timestamp": bot_msg.timestamp.isoformat()
                    }
                    import asyncio
                    await asyncio.sleep(1) # Small delay so it feels like typing
                    await manager.broadcast(mentor_id, bot_payload)

    except WebSocketDisconnect:
        manager.disconnect(websocket, mentor_id)
        print(f"[{user_role.upper()}] Disconnected from room: {mentor_id}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)