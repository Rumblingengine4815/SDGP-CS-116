import traceback
import json
try:
    import app.main
    with open("err.json", "w") as f:
        json.dump({"success": True}, f)
except Exception as e:
    with open("err.json", "w") as f:
        json.dump({"error": traceback.format_exc()}, f)
