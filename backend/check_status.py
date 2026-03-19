import requests
try:
    print(requests.get('http://127.0.0.1:8000/status', timeout=5).json())
except Exception as e:
    print('Failed:', str(e))
