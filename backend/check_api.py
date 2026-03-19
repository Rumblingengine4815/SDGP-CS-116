import requests
try:
    res = requests.get('http://127.0.0.1:8000/status', timeout=2)
    print('Status API:', res.status_code, res.text)
except Exception as e:
    print('Error:', e)
