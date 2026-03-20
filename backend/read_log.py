import sys
try:
    with open('backend_log.txt', 'rb') as f:
        raw = f.read()
    try:
        content = raw.decode('utf-16le')
    except UnicodeDecodeError:
        content = raw.decode('utf-8', errors='ignore')
    lines = content.splitlines()
    print('\n'.join(lines[-150:]))
except Exception as e:
    print("Failed to read log:", e)
