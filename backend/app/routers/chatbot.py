from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os, time
from dotenv import load_dotenv
from pymongo import MongoClient
import sys

# Crucially load the Master .env immediately before Mongo bindings
load_dotenv(os.path.join(os.path.abspath(os.path.dirname(__file__)), "..", "..", ".env"))

router = APIRouter()

# Allow importing the chatbot logic from the standalone Gemini Chatbot folder
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
GEMINI_ROOT = os.path.join(REPO_ROOT, "Gemini Chatbot")
if GEMINI_ROOT not in sys.path:
    sys.path.append(GEMINI_ROOT)

try:
    from chat_service import ChatService
except Exception as e:
    ChatService = None
    print(f"Failed to load ChatService: {e}")

# Securely initialize MongoDB connection using standard .env
client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
db = client[os.getenv("DATABASE_NAME", "pathfinder_plus")]

if ChatService:
    chat_service = ChatService(db=db)
else:
    chat_service = None

class ChatRequest(BaseModel):
    user_id: str
    message: str
    history: Optional[List[Dict[str, Any]]] = []

# Rate Limit Logic
user_last_request: Dict[str, float] = {}   
ip_request_counts: Dict[str, int] = {}     
ip_last_reset: Dict[str, float] = {}
RATE_LIMIT_SECONDS = 5.0
MAX_REQUESTS_PER_MINUTE = 15

@router.post("")
async def chat_with_ui(chat_req: ChatRequest, request: Request):
    """
    Unified NLP Endpoint executing generative context evaluation natively inside the API Router.
    """
    if not chat_service:
        raise HTTPException(status_code=500, detail="ChatService micro-architecture not resolved during boot.")
        
    client_ip = request.client.host if request.client else "unknown"
    current_time = time.time()
    
    if current_time - ip_last_reset.get(client_ip, 0.0) > 60:
        ip_request_counts[client_ip] = 0
        ip_last_reset[client_ip] = current_time
        
    ip_request_counts[client_ip] = ip_request_counts.get(client_ip, 0) + 1
    if ip_request_counts[client_ip] > MAX_REQUESTS_PER_MINUTE:
        return {"reply": "API Guard: Rate limit exceeded (15 req/min). Please wait 60 seconds."}

    last_req_time = user_last_request.get(chat_req.user_id, 0.0)
    if current_time - last_req_time < RATE_LIMIT_SECONDS:
        return {"reply": "You're sending queries too quickly! Our AI needs a moment to catch its breath. Please wait 5 seconds before asking again."}
    
    user_last_request[chat_req.user_id] = current_time

    try:
        reply = chat_service.get_reply(
            user_id=chat_req.user_id,
            user_message=chat_req.message,
            chat_history=chat_req.history
        )
        return {"reply": reply}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
