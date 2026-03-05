# 🧠 Machine Learning Engine: Handover & Execution Guide

This guide provides full instructions for a backend developer to run, integrate, and maintain the PathFinder+ Recommendation Engine.

---

## 🛠️ 1. Prerequisites & Environment Setup

The engine is built with **Python 3.10+** and uses **PyTorch** for embeddings.

### **Step 1: Install Dependencies**
Run this in the root `Machine Learning and Data Cleaning/` directory:
```bash
pip install -r requirements.txt
```

### **Step 2: Configure Environment**
Create a `.env` file in the root directory (copy from existing or create new):
```env
MONGO_URI="your_mongodb_atlas_connection_string"
DATABASE_NAME="pathfinder_plus"
# Optional: Only if using the Chatbot feature
GEMINI_API_KEY="your_google_ai_key"
```

---

## 🚀 2. Running the Engine (Initialization)

The engine is encapsulated in the `RecommendationEngine` class. It is designed to be **Cloud-Native**, meaning it pulls everything (Jobs, Courses, Mentors) from MongoDB Atlas at startup.

### **Quick Start Code**
```python
from core.recommendation_engine import RecommendationEngine

# 1. Initialize (Automatically loads data from Cloud)
engine = RecommendationEngine(show_progress=True)

# 2. Get a comprehensive career roadmap bundle
# Input: Assessment results + Target Role
user_profile = {
    "status_level": 2,      # 0: O/L, 1: A/L, 2: Undergrad, 3: Pro
    "experience_years": 3,
    "current_skills": ["Python", "SQL", "Excel"]
}

bundle = engine.get_recommendations_from_assessment(
    user_skills=user_profile["current_skills"],
    target_job="Data Analyst",
    user_level="Intermediate",
    assessment_vector=user_profile
)

# 3. Access the results
print(f"Readiness: {bundle['readiness_score']['overall']}%")
print(f"Top Course: {bundle['recommendations'][0]['course_title']}")
print(f"Top Mentor: {bundle['mentors'][0]['name']}")
```

---

## 💾 3. Managing ML Model Artifacts

The engine uses semantic search powered by **SBERT**. The "Models" are stored as `.pt` (PyTorch) files in the `models/` folder.

### **Must-Have Files in `models/`:**
*   `job_embeddings.pt`: Vector index for 3,000+ jobs.
*   `course_embeddings_all_courses_master.pt`: Vector index for professional courses.
*   `esco_occ_embeddings.pt`: Mapping index for 2,500+ standard occupations.

> [!IMPORTANT]
> **If you add new data to MongoDB**, you MUST regenerate these embeddings so the engine can search them. Run:
> ```bash
> python scripts/generate_model_artifacts.py
> ```

---

## 🛠️ 4. Common Maintenance Tasks

| Task | Script to Run | Description |
| :--- | :--- | :--- |
| **Verify System** | `python tests/final_system_verification.py` | Runs 5 persona simulations and generates a `final_production_logs.txt`. |
| **Sync Database** | `python scripts/push_to_mongo.py` | Uploads local CSV data to MongoDB Atlas. |
| **Optimize DB** | `python scripts/utils/create_mongo_indexes.py` | Creates indexes in MongoDB for 20x faster search. |
| **Check Health** | `python scripts/check_cloud_data.py` | Verifies that the engine can successfully talk to MongoDB. |

---

## 🔗 5. Integration Notes
*   **Input**: The engine expects a list of `user_skills` (strings) and a `target_job` (string).
*   **Output**: Returns a JSON-compatible dictionary containing `recommendations`, `jobs`, `mentors`, `readiness_score`, and a step-by-step `action_plan`.
*   **Performance**: The first initialization takes 3-5 seconds (loading models into memory). Subsequent calls are sub-second (<200ms).

---
*For architectural details, refer to `docs/CODE_ARCHITECTURE_GUIDE.md`.*
