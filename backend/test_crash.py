import httpx
print("Testing /api/resume/upload ...")
try:
    files = {"file": ("test.txt", b"Mock resume payload", "text/plain")}
    # Extended timeout to safely pass the PyTorch 15-second loading phase
    res = httpx.post("http://localhost:8000/api/resume/upload", files=files, timeout=60.0)
    print("STATUS:", res.status_code)
    print("RESPONSE:", res.text)
except Exception as e:
    print("PYTHON EXCEPTION:", e)
