import sys, os
sys.path.append(os.path.abspath('../Machine Learning and Data Cleaning'))
import inspect
from core.recommendation_engine import RecommendationEngine
with open('fast_init_src.py', 'w', encoding='utf-8') as f:
    f.write(inspect.getsource(RecommendationEngine.__init__))
