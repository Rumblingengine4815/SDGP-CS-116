import inspect
from app.main import engine
with open('mongo_src.py', 'w', encoding='utf-8') as f:
    f.write(inspect.getsource(engine.from_mongo))
