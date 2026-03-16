import os
import google.generativeai as genai
from dotenv import load_dotenv

class ChatService:
    def __init__(self, db=None):
        self.db = db          #  MongoDB
        self._setup_gemini()


    def _setup_gemini(self):
        """Configure Gemini with a strict persona to save tokens since well this is a free tier accut."""
        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        
        # Instruction for the model
        self.system_instructions = (
            "You are the PathFinder+ Senior Academic & Career Advisor. The USER is a student or job-seeker "
            "seeking your guidance. "
            "MANDATE: Provide authoritative, professional, and highly specific guidance on Sri Lankan "
            "universities, degree programs, and career paths. "
            "VOICE: Direct, concierge-level helpfulness, and strictly factual. Avoid conversational filler. "
            "IDENTITY: You are the AI Advisor. The USER is the human student. Never confuse these roles. "
            "SILENT KNOWLEDGE: Never reference internal datasets, CSV files, or DATABASE records. "
            "GUARDRAILS: If a user asks non-career personal questions (e.g., 'whats my name'), politely pivot: "
            "'I focus on academic and career advisory. How can I help with your professional goals?'"
        )

        # Using models/gemma-3-1b-it as and it is light and effcient for our needs and uses fewer tokens
        self.model = genai.GenerativeModel(
            model_name="models/gemma-3-1b-it"
        )

    def get_academic_context(self, query):
