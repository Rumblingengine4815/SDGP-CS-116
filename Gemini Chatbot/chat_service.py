import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Prevent Windows/ISP IPv6 routing drops for the Gemini connections
os.environ["GRPC_DNS_RESOLVER"] = "native"

class ChatService:
    def __init__(self, db=None):
        self.db = db          #  MongoDB
        self._setup_gemini()

    def _setup_gemini(self):
        """Configure the new Google GenAI Client with a strict persona."""
        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")
        
        # New Google GenAI Native Client Initialization
        self.client = genai.Client(api_key=api_key)
        
        # Instruction for the model
        self.system_instructions = (
            "You are the PathFinder+ Senior Academic & Career Advisor. The USER is a student or job-seeker "
            "seeking your guidance. "
            "MANDATE: Provide authoritative, professional, and highly specific guidance on Sri Lankan "
            "universities, degree programs, and career paths. "
            "VOICE: Direct, concierge-level helpfulness, and strictly factual. Write in a completely natural, human-like tone. "
            "CRITICAL: ABSOLUTELY NO EMOJIS UNDER ANY CIRCUMSTANCES. Do not use hashtags. Do not sound robotic or overly enthusiastic. "
            "IDENTITY: You are the human-like Advisor. The USER is the human student. Never confuse these roles. "
            "SILENT KNOWLEDGE: Never reference internal datasets, CSV files, or DATABASE records. "
            "GUARDRAILS: If a user asks non-career personal questions (e.g., 'whats my name'), politely pivot."
        )
        self.model_version = "gemini-2.5-flash"  # Bypassing the 404 restriction using the newer 2.5 architecture.

    def get_academic_context(self, query):
        """Searches MongoDB for relevant academic programs and skill-gap courses from mongo db to make it cloud capable."""
        if self.db is None: return ""
        try:
            critical_terms = {"bsc", "msc", "ba", "ma", "it", "cs", "ai", "law", "imb"}
            words = [kw.lower() for kw in str(query).split() if len(kw) > 3 or kw.lower() in critical_terms]
            if not words: words = ["university", "career", "study", "job", "institute", "college"]
            pattern = "|".join(words)
            
            academic_hits = self.db.courses_academic.find({
                "$or": [
                    {"course_title": {"$regex": pattern, "$options": "i"}},
                    {"category": {"$regex": pattern, "$options": "i"}}
                ]
            }).limit(5)
            
            skill_hits = self.db.courses.find({
                "$or": [
                    {"course_title": {"$regex": pattern, "$options": "i"}},
                    {"category": {"$regex": pattern, "$options": "i"}}
                ]
            }).limit(5)
            
            results = []
            for r in academic_hits:
                results.append(f"Degree: {r.get('course_title')} at {r.get('provider')}")
            for r in skill_hits:
                results.append(f"Course: {r.get('course_title')} ({r.get('provider')})")
                
            return " | ".join(results[:8]) if results else ""
        except Exception: 
            return ""

    def get_job_context(self, query):
        """Searches MongoDB for relevant Sri Lankan job vacancies from which we scraped from."""
        if self.db is None: return ""
        try:
            words = [kw.lower() for kw in str(query).split() if len(kw) > 3]
            if not words: return ""
            pattern = "|".join(words)
            
            job_hits = self.db.all_jobs.find({
                "$or": [
                    {"title": {"$regex": pattern, "$options": "i"}},
                    {"company": {"$regex": pattern, "$options": "i"}},
                ]
            }).limit(5)
            
            results = [f"Job: {j.get('title')} at {j.get('company')}" for j in job_hits]
            return " | ".join(results) if results else ""
        except Exception:
            return ""

    def get_smart_context(self, user_id, user_message=""):
        """Silent RAG only answers what it is questioned for and based on context and try not to hallucinate."""
        context_parts = []
        acad = self.get_academic_context(user_message)
        jobs = self.get_job_context(user_message)
        if acad: context_parts.append(f"Academic: {acad}")
        if jobs: context_parts.append(f"Live Vacancies: {jobs}")
        return " | ".join(context_parts) if context_parts else ""

    def get_reply(self, user_id, user_message, chat_history=None):
        """Standard reply logic using the new generate_content logic mimicking start_chat."""
        try:
            facts = self.get_smart_context(user_id, user_message)
            
            # Collapse history block so it seamlessly patches into generate_content
            history_str = ""
            if chat_history and isinstance(chat_history, list):
                history_str = "[RECENT CONVERSATION HISTORY]\n"
                for msg in chat_history[-5:]: # Keep Context Window tight
                    role = msg.get("role", "user")
                    # React frontend often sends parts array, extract text
                    text = msg.get("parts", [{}])[0].get("text", "") if type(msg.get("parts")) is list else str(msg)
                    history_str += f"{role.upper()}: {text}\n"
                history_str += "[END HISTORY]\n\n"

            # Construct the definitive prompt
            full_prompt = (
                f"{self.system_instructions}\n\n"
                f"{history_str}"
                f"{facts}\n\n"
                f"CURRENT USER QUESTION: {user_message}"
            )
            
            # Fire to Gem 2.5 natively
            response = self.client.models.generate_content(
                model=self.model_version,
                contents=full_prompt
            )
            return response.text
 
        except Exception as e:
            error_str = str(e).lower()
            print(f"CRITICAL CHATBOT EXCEPTION: {e}")
            if "429" in error_str or "quota" in error_str or "exhausted" in error_str:
                return "Our AI servers are currently experiencing extremely high demand and the daily API quota has been exhausted. Please try again later!"
            return "I apologize, but my connection was briefly interrupted. Could you please reiterate your question? I'm here to help."

if __name__ == "__main__":
    from pymongo import MongoClient
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client[os.getenv("DATABASE_NAME")]
    
    service = ChatService(db=db)
    print("--- PathFinder+ Chatbot (google-genai) ---")
    while True:
        user_in = input("You: ")
        if user_in.lower() in ["exit", "quit"]: break
        print(f"Assistant: {service.get_reply('test_user', user_in)}\n")
