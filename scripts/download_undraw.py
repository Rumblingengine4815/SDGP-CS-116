import os
import time
import requests

TARGET_COLOR = "#7C3AED"
BASE_DIR = os.path.join("frontend", "pathfinder_frontend", "public", "illustrations")
os.makedirs(BASE_DIR, exist_ok=True)

ILLUSTRATIONS = {
    "career progress": "hero.svg",
    "artificial intelligence": "ai-feature.svg",
    "team collaboration": "mentors.svg",
    "online test": "quiz.svg",
    "goals": "goals.svg",
    "people search": "search.svg",
    "empty street": "empty.svg",
    "secure login": "login.svg",
    "dashboard": "dashboard.svg",
    "no data": "no-data.svg",
    "messaging": "chat.svg",
    "learning": "learning.svg",
    "quiz": "skill-quiz.svg",
    "page not found": "404.svg",
    "processing": "processing.svg"
}

print(f"Downloading {len(ILLUSTRATIONS)} illustrations to {BASE_DIR}...")

for query, filename in ILLUSTRATIONS.items():
    try:
        # Search unDraw API
        print(f"Searching for '{query}'...")
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        res = requests.get(f"https://undraw.co/api/v2/search?q={query}", headers=headers, timeout=10)
        data = res.json()
        
        if not data.get("illustrators"):
            print(f"  [!] Skipped {filename} - No results found.")
            continue
            
        # Get the first result's direct SVG URL
        svg_url = data["illustrators"][0]["image"]
        
        # Download the raw SVG code
        svg_code = requests.get(svg_url, headers=headers, timeout=10).text
        
        # Inject the custom PathFinder+ purple brand color
        svg_code = svg_code.replace("#6c63ff", TARGET_COLOR)
        
        # Save to disk
        out_path = os.path.join(BASE_DIR, filename)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(svg_code)
            
        print(f"  [+] Saved {filename}")
        time.sleep(0.5) # Be nice to the API
        
    except Exception as e:
        print(f"  [X] Failed to get {filename}: {e}")

print("Done.")
