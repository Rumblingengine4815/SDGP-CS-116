import requests
import json
import os
import time

BASE_URL = "http://127.0.0.1:8000/api"

def test_api_routes():
    print("\n" + "="*50)
    print(" 🚀 PathFinder+ End-to-End REST Simulation 🚀")
    print("="*50)
    
    # 1. TEST SKILL ASSESSMENT (JSON POST)
    print("\n[TEST 1] Initiating POST payload to `/skill-assessment`...")
    quiz_payload = {
        "role": "University Student",
        "name": "Test User",
        "email": "test@pathfinder.com",
        "education": "BSc Computer Science",
        "experience_years": "0 (None)",
        "upskilling_budget": "50k - 100k",
        "weekly_availability": "10-20 hours",
        "domain": "IT",
        "target_role": "Full Stack Developer",
        "responsibility_level": "Completed independent tasks",
        "skills": ["JavaScript", "React.js", "Python"],
        "q1_problem": "Search for similar issues and try common fixes",
        "q2_adapt": "Pivot quickly while documenting the change",
        "q3_team": "Collaborate heavily",
        "q4_stress": "Take regular breaks",
        "q5_learn": "Hands-on projects",
        "q6_lead": "Lead by example",
        "q7_comm": "Clear written logs",
        "q8_risk": "Moderate",
        "q9_feedback": "Welcome constructive criticism",
        "q10_plan": "Agile sprints",
        "q11_conflict": "Direct communication",
        "q12_motivate": "Building cool systems"
    }
    
    start = time.time()
    try:
        res = requests.post(f"{BASE_URL}/skill-assessment", json=quiz_payload, timeout=20)
        dt = time.time() - start
        
        if res.status_code == 200:
            data = res.json()
            score = data.get("bundle", {}).get("summary", {}).get("readiness_score", "N/A")
            ai_desc = data.get("description", "Missing AI Desc")
            print(f"✅ Success (200 OK) in {dt:.2f}s | Readiness: {score}/100")
            print(f"📝 AI Gen Description Snippet: {ai_desc[:100]}...")
            print(f"🎯 Recommended Job 1: {data.get('jobs', [''])[0]}")
        else:
            print(f"❌ Failed! Status: {res.status_code}")
            print(res.text)
    except Exception as e:
        print(f"❌ Exception dropping Quiz Endpoint: {e}")

    # 2. TEST RESUME UPLOAD (MULTI-PART FORM)
    print("\n[TEST 2] Initiating MULTIPART Form to `/resume/upload`...")
    
    # We create a dummy binary payload.
    # The actual PyMuPDF (fitz) backend handles corrupt/empty PDFs gracefully via except blocks.
    dummy_pdf_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 712 Td\n(Python React Developer) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000114 00000 n \n0000000216 00000 n \n0000000304 00000 n \ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n397\n%%EOF\n"
    
    with open("dummy_cv.pdf", "wb") as f:
        f.write(dummy_pdf_content)

    start = time.time()
    try:
        with open("dummy_cv.pdf", "rb") as f:
            files = {'file': ('dummy_cv.pdf', f, 'application/pdf')}
            res2 = requests.post(f"{BASE_URL}/resume/upload", files=files, timeout=20)
            dt2 = time.time() - start
            
            if res2.status_code == 200:
                data2 = res2.json()
                print(f"✅ Success (200 OK) in {dt2:.2f}s")
                print(f"📝 Parsed Target Career: {data2.get('career')}")
                ai_desc2 = data2.get("description", "Missing")
                print(f"🧠 AI Insight Snippet: {ai_desc2[:100]}...")
            else:
                print(f"❌ Failed! Status: {res2.status_code}")
                print(res2.text)
    except Exception as e:
        print(f"❌ Exception dropping Resume Endpoint: {e}")
    finally:
        os.remove("dummy_cv.pdf")

    print("\n" + "="*50)
    print(" End-to-End Test Suite Finalized.")
    print("="*50 + "\n")

if __name__ == "__main__":
    test_api_routes()
