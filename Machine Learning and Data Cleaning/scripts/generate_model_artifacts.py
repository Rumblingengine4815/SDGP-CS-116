import pandas as pd
import torch
from sentence_transformers import SentenceTransformer
from pathlib import Path
import os

def generate_artifacts(jobs_path, courses_path, esco_dir, output_dir):
    """
    Pre-computes SBERT embeddings for ESCO occupations and courses.
    """
    print(f"Loading transformer: all-MiniLM-L6-v2...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    # 1. ESCO Occupations
    print(f"Processing ESCO occupations from {esco_dir}...")
    esco_occ = pd.read_csv(Path(esco_dir) / "occupations_en.csv")
    esco_titles = esco_occ['preferredLabel'].tolist()
    esco_embs = model.encode(esco_titles, convert_to_tensor=True)
    torch.save(esco_embs, output_path / "esco_occ_embeddings.pt")
    print(f"Saved ESCO embeddings to {output_path / 'esco_occ_embeddings.pt'}")
    
    # 2. Courses
    print(f"Processing courses from {courses_path}...")
    courses_df = pd.read_csv(courses_path)
    # Match the logic in recommendation_engine.py for course text
    course_texts = (courses_df['course_title'] + " " + courses_df['category'].fillna("")).tolist()
    course_embs = model.encode(course_texts, convert_to_tensor=True)
    torch.save(course_embs, output_path / "course_embeddings.pt")
    print(f"Saved course embeddings to {output_path / 'course_embeddings.pt'}")

    # 3. Jobs (Master)
    if os.path.exists(jobs_path):
        print(f"Processing jobs from {jobs_path}...")
        jobs_df = pd.read_csv(jobs_path)
        # Embeddings for faster loading
        job_titles = jobs_df['title'].tolist()
        job_embs = model.encode(job_titles, convert_to_tensor=True)
        torch.save(job_embs, output_path / "job_embeddings.pt")
        print(f"Saved job embeddings to {output_path / 'job_embeddings.pt'}")

if __name__ == "__main__":
    # Standard paths based on recommendation_engine.py and project structure
    PROJECT_ROOT = Path(__file__).parent.parent
    
    # We use the paths as seen in the recommendation_engine.py's test block
    generate_artifacts(
        jobs_path=PROJECT_ROOT / "data/processed/xpressjobs_cleaned_with_descriptions.csv",
        courses_path=PROJECT_ROOT / "data/raw/courses_final_20260124_234728.csv",
        esco_dir=PROJECT_ROOT / "data/raw/esco",
        output_dir=PROJECT_ROOT / "models"
    )
