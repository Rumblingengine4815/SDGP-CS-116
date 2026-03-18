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
            "You are the PathFinder+ Senior Academic & Career Advisor, specialized exclusively for the Sri Lankan landscape. "
            "Your goal is to provide concierge-level guidance for students and professionals in Sri Lanka.\n\n"
            "STRICT GUIDELINES:\n"
            "1. ONLY discuss Sri Lankan universities, institutes, job vacancies, and mentors. If context is provided, prioritize it.\n"
            "2. DO NOT recommend international universities (USA, UK, Australia, etc.) unless they have a direct local campus or partnership mentioned in the context.\n"
            "3. If a user asks about general global topics, politely pivot focus back to how it applies to their career path within Sri Lanka.\n"
            "4. Strictly maintain a professional, helpful, and direct persona. Identify yourself as the senior advisor and the user as the student/professional.\n"
            "5. SILENT KNOWLEDGE: Use the provided context (Academic Options, Live Vacancies, Mentors) as if it is your own deep expertise. Never mention 'I have searched a database' or 'Based on the context file'.\n"
            "6. GUARDRAILS: Politely decline personal/off-topic questions and refocus on academic/career help.\n"
            "7. MENTOR LINKS: If you recommend a specific mentor from the context, strictly provide a link for the user to connect with them in this exact format: [Connect with Mentor on PathFinder+](http://localhost:3000/mentors?required_skill=___) replacing ___ with the relevant skill.\n"
        )

        # Using models/gemma-3-1b-it as and it is light and effcient for our needs and uses fewer tokens
        self.model = genai.GenerativeModel(
            model_name="models/gemma-3-1b-it"
        )

    def get_academic_context(self, query):
        """Searches specific 'courses' collection for localized degrees and programs."""
        if self.db is None: return ""
        try:
            # 1. Smarter Keyword Extraction: Filter out common conversational words
            stop_words = {"interested", "pursuing", "provide", "guidance", "programs", "available", "resources", "best", "where", "what", "want", "some"}
            critical_terms = {"bsc", "msc", "ba", "ma", "it", "cs", "ai", "law", "imb"}
            
            raw_words = [kw.lower().strip("?!.,") for kw in str(query).split()]
            words = []
            for w in raw_words:
                if w in stop_words: continue
                if len(w) > 4 or w in critical_terms:
                    # Use word boundaries for short terms to avoid "it" matching "Italian"
                    if w in critical_terms:
                        words.append(rf"\b{w}\b")
                    else:
                        words.append(w)
            
            if not words: words = [r"\buniversity\b", r"\bdegree\b", "study"]
            pattern = "|".join(words)
            
            # 2. Query Primary Courses Collection
            hits = self.db.courses.find({
                "$or": [
                    {"course_title": {"$regex": pattern, "$options": "i"}},
                    {"category": {"$regex": pattern, "$options": "i"}}
                ]
            }).limit(8)
            
            results = []
            for r in hits:
                title = r.get('course_title')
                provider = r.get('provider')
                if title and provider:
                    results.append(f"{title} at {provider}")
                elif title:
                    results.append(title)
                
            return "Academic Options: " + " | ".join(results) if results else ""
        except Exception: 
            return ""

    def get_job_context(self, query):
        """Searches MongoDB for relevant Sri Lankan job vacancies."""
        if self.db is None: return ""
        try:
            critical_terms = {"it", "cs", "ai", "hr", "qa"}
            raw_words = [kw.lower().strip("?!.,") for kw in str(query).split() if len(kw) > 3 or kw.lower() in critical_terms]
            
            search_terms = []
            for w in raw_words:
                if w in critical_terms:
                    search_terms.append(rf"\b{w}\b")
                else:
                    search_terms.append(w)
                    
            if not search_terms: return ""
            pattern = "|".join(search_terms)
            
            job_hits = self.db.jobs.find({
                "$or": [
                    {"title": {"$regex": pattern, "$options": "i"}},
                    {"company": {"$regex": pattern, "$options": "i"}},
                    {"category": {"$regex": pattern, "$options": "i"}}
                ]
            }).limit(5)
            
            results = [f"Job: {j.get('title')} at {j.get('company')}" for j in job_hits]
            return " | ".join(results) if results else ""
        except Exception:
            return ""

    def get_mentor_context(self, query):
        """Searches MongoDB for relevant Mentors based on skills or job titles."""
        if self.db is None: return ""
        try:
            critical_terms = {"it", "cs", "ai", "hr", "qa", "developer", "engineer", "designer", "manager", "data"}
            raw_words = [kw.lower().strip("?!.,") for kw in str(query).split() if len(kw) > 3 or kw.lower() in critical_terms]
            
            search_terms = []
            for w in raw_words:
                if w in critical_terms:
                    search_terms.append(rf"\b{w}\b")
                else:
                    search_terms.append(w)
                    
            if not search_terms: return ""
            pattern = "|".join(search_terms)
            
            hits = self.db.mentors.find({
                "$or": [
                    {"currentRole": {"$regex": pattern, "$options": "i"}},
                    {"bio": {"$regex": pattern, "$options": "i"}},
                    {"skills": {"$regex": pattern, "$options": "i"}}
                ] # Assuming scraped linkedin structure has currentRole or bio or skills
            }).limit(3)
            
            results = []
            for m in hits:
                name = m.get('name', 'Expert')
                role = m.get('currentRole', m.get('sector', 'Professional'))
                company = m.get('company', '')
                location = m.get('location', 'Sri Lanka')
                
                info = f"Mentor: {name} ({role}"
                if company: info += f" at {company}"
                info += f" in {location})"
                results.append(info)
                
            return "Available Mentors: " + " | ".join(results) if results else ""
        except Exception:
            return ""

    def get_smart_context(self, user_id, user_message=""):
        """Silent RAG only answers what it is questioned for and based on context and try not to hallucinate."""
        context_parts = []
        acad = self.get_academic_context(user_message)
        jobs = self.get_job_context(user_message)
        mentors = self.get_mentor_context(user_message)
        
        if acad: context_parts.append(f"Academic: {acad}")
        if jobs: context_parts.append(f"Live Vacancies: {jobs}")
        if mentors: context_parts.append(f"Mentors: {mentors}")
        
        if self.db is not None and user_id != "test_user": # Ignore test_user to prevent hardcoded Python Web Dev bias
            user = self.db.users.find_one({"_id": user_id})
            if user: 
                context_parts.append(f"User Profile: Skills={user.get('skills')}, Goal={user.get('target_job')}")
        
        return " | ".join(context_parts) if context_parts else ""

    def get_reply(self, user_id, user_message, chat_history=None):
        """Standard reply logic using the smart context."""
        try:
            facts = self.get_smart_context(user_id, user_message)
            full_prompt = (
                f"{self.system_instructions}\n\n"
                f"{facts}\n\n"
                f"USER: {user_message}"
            )
            
            chat = self.model.start_chat(history=chat_history or [])
            response = chat.send_message(full_prompt)
            return response.text
 
        except Exception as e:
            print(f"DEBUG - AI Error: {e}")
            return "I'm having a technical hiccup right now. Please try again in a minute!"


if __name__ == "__main__":
    # This allows you to run the file directly for testing
    from pymongo import MongoClient
    
    # Setup connection from the env files
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client[os.getenv("DATABASE_NAME")]
    
    # Initialize (we'll skip the RecommendationEngine for now to keep it simple otherwise too problematic for now probably a future feature)
    service = ChatService(db=db)
    
    print("--- PathFinder+ Chatbot CLI Test ---")
    while True:
        user_in = input("You: ")
        if user_in.lower() in ["exit", "quit"]: break
        print(f"Assistant: {service.get_reply('test_user', user_in)}\n")
