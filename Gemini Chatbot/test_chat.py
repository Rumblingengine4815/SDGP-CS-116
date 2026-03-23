import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

print("Simulating API Calls directly...")

for m in ["gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-2.0-flash", "gemini-2.5-flash"]:
    try:
        response = client.models.generate_content(model=m, contents="Hello")
        print(f"SUCCESS: {m}")
        break
    except Exception as e:
        print(f"FAILED: {m} -> {e}")
