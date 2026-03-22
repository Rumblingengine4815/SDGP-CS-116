from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import uvicorn

from fastapi.middleware.cors import CORSMiddleware

# Import our modular service
from chat_service import ChatService

# Load .env from the current folder
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

app = FastAPI(title="PathFinder+ Chatbot API")

# Setup CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev; narrow this down for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Database connection
client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("DATABASE_NAME")]

# Initialize the ChatService (Standalone mode: no engine passed)
chat_service = ChatService(db=db)

# Data structure for the incoming request
class ChatRequest(BaseModel):
    user_id: str
    message: str
    history: Optional[List[Dict[str, Any]]] = []

<<<<<<< HEAD
<<<<<<< HEAD
=======
from fastapi import Request
>>>>>>> feature/website-ui
import time

# Rate limiting part to prevent API abuse and quick finishing of the quota
user_last_request: Dict[str, float] = {}   # user_id throttle
ip_request_counts: Dict[str, int] = {}     # API guards
ip_last_reset: Dict[str, float] = {}
RATE_LIMIT_SECONDS = 5.0
MAX_REQUESTS_PER_MINUTE = 15

<<<<<<< HEAD
=======
>>>>>>> d46034006fbfab04e3addc49f7ed278fccc8bba9
=======
>>>>>>> feature/website-ui
@app.post("/api/chat")
async def chat_with_ui(chat_req: ChatRequest, request: Request):
    """
    Endpoint that the frontend or Postman will call.
    Includes explicit IP-based Cybersecurity Rate Limiting for GenAI guards.
    """
<<<<<<< HEAD
<<<<<<< HEAD
=======
    client_ip = request.client.host if request.client else "unknown"
>>>>>>> feature/website-ui
    current_time = time.time()
    
    # Check IP Quota per minute
    if current_time - ip_last_reset.get(client_ip, 0.0) > 60:
        ip_request_counts[client_ip] = 0
        ip_last_reset[client_ip] = current_time
        
    ip_request_counts[client_ip] += 1
    if ip_request_counts[client_ip] > MAX_REQUESTS_PER_MINUTE:
        return {"reply": "API Guard: Rate limit exceeded (15 req/min). Please wait 60 seconds."}

    # Check User ID Timeout
    last_req_time = user_last_request.get(chat_req.user_id, 0.0)
    if current_time - last_req_time < RATE_LIMIT_SECONDS:
        return {"reply": "You're sending queries too quickly! Our AI needs a moment to catch its breath. Please wait 5 seconds before asking again."}
    
    user_last_request[chat_req.user_id] = current_time

<<<<<<< HEAD
=======
>>>>>>> d46034006fbfab04e3addc49f7ed278fccc8bba9
=======
>>>>>>> feature/website-ui
    try:
        reply = chat_service.get_reply(
            user_id=chat_req.user_id,
            user_message=chat_req.message,
            chat_history=chat_req.history
        )
        return {"reply": reply}
    
    except Exception as e:
        import traceback
        error_msg = traceback.format_exc()
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

if __name__ == "__main__":
    try:
        # Runs the server on port 8002
        uvicorn.run("chat_api:app", host="0.0.0.0", port=8002, reload=False)
    except KeyboardInterrupt:
        print("\n[SYSTEM LOG] Chatbot Microservice cleanly shutdown by Host. Terminating connections...")
    except Exception as e:
        print(f"\n[CRITICAL FATAL] Unexpected shutdown: {e}")
