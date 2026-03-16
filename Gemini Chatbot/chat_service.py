import os
import google.generativeai as genai
from dotenv import load_dotenv

class ChatService:
    def __init__(self, db=None):
        self.db = db          #  MongoDB
        self._setup_gemini()

