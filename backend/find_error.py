import json
import traceback

try:
    from app import main
    print('Import successful')
except Exception as e:
    with open('err.json', 'w') as f:
        json.dump({'error': traceback.format_exc()}, f)
    print('Failed, wrote to err.json')
