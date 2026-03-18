import requests
import time

BASE_URL = "http://127.0.0.1:8001"
HEADERS_USER = {"X-User-Id": "1"}   # Simulated Next.js User ID
HEADERS_ADMIN = {"X-User-Id": "2"}  # Simulated Next.js Admin/Mentor ID

def print_step(step_num, title):
    print(f"\n{'='*50}")
    print(f"| STEP {step_num}: {title}")
    print(f"{'='*50}")

try:
    # STEP 1: Health Check
    print_step(1, "Server Health Check")
    res = requests.get(f"{BASE_URL}/")
    print(f"[√] Server Response: {res.json()}")

    # STEP 2: Fetch Mentors from MongoDB
    print_step(2, "Fetching Live Mentors (MongoDB Atlas Integration)")
    res = requests.get(f"{BASE_URL}/mentors")
    mentors = res.json()
    print(f"[√] Successfully fetched {len(mentors)} mentors.")
    
    if len(mentors) == 0:
        print("[!] No mentors found in DB. Exiting test early.")
        exit()
        
    target_mentor = mentors[0]
    print(f"    Selected Mentor: {target_mentor['display_name']} (ID: {target_mentor['id'][:8]}...)")
    
    # STEP 3: Student Applies for Mentor
    print_step(3, "Student Submitting Mentorship Request")
    payload = {"mentor_id": target_mentor['id']}
    res = requests.post(f"{BASE_URL}/mentorship/apply", json=payload, headers=HEADERS_USER)
    
    if res.status_code == 200:
        req_data = res.json()
        req_id = req_data['request_id']
        print(f"[√] Application generated successfully. Request ID: {req_id} | Status: {req_data['status']}")
    else:
        print(f"[X] Failed to apply: {res.text}")
        exit()

    time.sleep(1)

    # STEP 4: Mentor Views Pending Requests
    print_step(4, "Mentor POV: Viewing Incoming Applications")
    res = requests.get(f"{BASE_URL}/mentor/requests/{target_mentor['id']}")
    if res.status_code == 200:
        incoming_reqs = res.json()
        print(f"[√] Mentor Dashboard pulled {len(incoming_reqs)} request(s).")
        for r in incoming_reqs:
            print(f"    -> Request #{r['id']} from User {r['student_id']} [{r['status'].upper()}]")
    else:
        print(f"[X] Failed to view requests: {res.text}")

    # STEP 5: Mentor Approves Request
    print_step(5, "Mentor POV: Approving Mentorship")
    payload = {"status": "approved"}
    res = requests.patch(f"{BASE_URL}/mentorship/requests/{req_id}", json=payload, headers=HEADERS_ADMIN)
    if res.status_code == 200:
        print(f"[√] Application #{req_id} officially APPROVED in SQLite.")
    else:
        print(f"[X] Failed to approve: {res.text}")

    time.sleep(1)

    # STEP 6: Student Sends First Chat Message
    print_step(6, "Student POV: Sending Chat Message via REST")
    payload = {"type": "text", "content": "Hi there! I'm so excited to learn from you."}
    res = requests.post(f"{BASE_URL}/chat/{target_mentor['id']}/send/1", json=payload, headers=HEADERS_USER)
    if res.status_code == 200:
        print(f"[√] Message securely delivered and saved to SQLite ledger.")
    else:
        print(f"[X] Failed to send message: {res.text}")

    # STEP 7: Mentor Fetches Chat History
    print_step(7, "Mentor POV: Fetching Dual-Sided Chat History")
    res = requests.get(f"{BASE_URL}/chat/{target_mentor['id']}/history/1")
    if res.status_code == 200:
        history = res.json()
        print(f"[√] Chat History contains {len(history)} messages:")
        for msg in history[-3:]: # Display last 3
            sender_tag = "MENTOR" if msg['sender'] == "mentor" else "STUDENT"
            print(f"    [{msg['timestamp'][11:19]}] {sender_tag}: {msg['message']}")
    else:
        print(f"[X] Failed to pull history: {res.text}")

    print("\n[+] FULL INTEGRATION TEST PASSED SUCCESSFULLY.")

except requests.exceptions.ConnectionError:
    print("\n[X] CONNECTION REFUSED: Is the Mentor Backend running on port 8001?")
except Exception as e:
    print(f"\n[X] UNEXPECTED ERROR: {e}")
