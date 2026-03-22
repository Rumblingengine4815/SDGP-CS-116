import pandas as pd
import torch
from sentence_transformers import SentenceTransformer
import json
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from pathlib import Path
import math

def build_onet_infrastructure():
    print("="*60)
    print(" 🛠️ BUILDING O*NET TAXONOMY & PYTORCH EMBEDDINGS")
    print("="*60)
    
    env_path = Path(__file__).resolve().parent / '.env'
    load_dotenv(dotenv_path=env_path)
    
    root_dir = Path(__file__).resolve().parent.parent / 'Machine Learning and Data Cleaning' / 'data' / 'onet' / 'db_30_2_text'
    
    if not root_dir.exists():
        print(f"❌ Critical Error: O*NET DB not found at {root_dir}")
        return

    # 1. Load O*NET CSVs (Tab delimited text files)
    print("Loading O*NET Structured Data...")
    
    # Use explicit encoding and quoting parameters to bypass corrupted bytes
    occ_df = pd.read_csv(root_dir / 'Occupation Data.txt', sep='\t', on_bad_lines='skip', encoding='utf-8')
    skills_df = pd.read_csv(root_dir / 'Skills.txt', sep='\t', on_bad_lines='skip', encoding='utf-8')
    tasks_df = pd.read_csv(root_dir / 'Task Statements.txt', sep='\t', on_bad_lines='skip', encoding='utf-8')
    alt_df = pd.read_csv(root_dir / 'Alternate Titles.txt', sep='\t', on_bad_lines='skip', encoding='utf-8')
    
    # 2. Aggregate Data per O*NET-SOC Code
    print("Aggregating Skills, Tasks, and Alternate Titles...")
    
    # Group Skills by SOC Code (Element Name contains the skill)
    skills_grouped = skills_df.groupby('O*NET-SOC Code')['Element Name'].apply(list).to_dict()
    
    # Group Tasks by SOC Code
    tasks_grouped = tasks_df.groupby('O*NET-SOC Code')['Task'].apply(list).to_dict()
    
    # Group Alternate Titles by SOC Code
    alt_grouped = alt_df.groupby('O*NET-SOC Code')['Alternate Title'].apply(list).to_dict() if 'Alternate Title' in alt_df.columns else alt_df.groupby('O*NET-SOC Code')['Reported Job Title'].apply(list).to_dict()

    # 3. Construct the Unified JSON Dictionaries
    onet_taxonomy = []
    texts_to_embed = []
    
    print(f"Synthesizing {len(occ_df)} O*NET Official Occupations...")
    for _, row in occ_df.iterrows():
        code = row['O*NET-SOC Code']
        title = row['Title']
        desc = row['Description']
        
        req_skills = skills_grouped.get(code, [])
        req_tasks = tasks_grouped.get(code, [])
        alt_titles = alt_grouped.get(code, [])
        
        # Build document embedding string
        # Combining title, desc, skills and tasks creates the ultimate semantic profile for this role.
        sbert_doc = f"{title}. {desc} Skills: {', '.join(req_skills[:15])}. Tasks: {', '.join(req_tasks[:5])}."
        texts_to_embed.append(sbert_doc)
        
        onet_taxonomy.append({
            "onet_soc_code": code,
            "target_title": title,
            "description": desc,
            "alternate_titles": alt_titles[:15], # cap for db optimization
            "skills": req_skills,
            "tasks": req_tasks,
            "sbert_context": sbert_doc
        })
        
    # 4. Generate SBERT PyTorch Tensor
    print("\nLoading SentenceTransformer 'all-MiniLM-L6-v2' (Downloading if not cached)...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    print("Generating Cosine Matrices for O*NET Occupations (This takes ~30 seconds)...")
    embeddings = model.encode(texts_to_embed, show_progress_bar=True, convert_to_tensor=True)
    
    tensor_out = Path(__file__).resolve().parent / "core" / "onet_embeddings.pt"
    # Ensure core dir exists
    tensor_out.parent.mkdir(exist_ok=True)
    torch.save(embeddings, tensor_out)
    print(f"✅ SBERT Tensors successfully mapped and saved strictly to {tensor_out}")
    
    # Save a quick JSON lookup dict mapping index to code
    idx_map = {i: obj["onet_soc_code"] for i, obj in enumerate(onet_taxonomy)}
    with open(tensor_out.parent / "onet_idx_map.json", "w") as f:
        json.dump(idx_map, f)

    # 5. Push to MongoDB (Cloud Ready Infrastructure!)
    print("\n☁️ Pushing Taxonomy structural definitions to MongoDB Cluster...")
    MONGO_URI = os.getenv("MONGO_URI")
    DB_NAME = os.getenv("DATABASE_NAME", "pathfinder_plus")
    
    if not MONGO_URI:
        print("❌ Cannot push to MongoDB. MONGO_URI missing from .env!")
        return
        
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=10000)
        db = client[DB_NAME]
        coll = db['onet_taxonomy']
        
        # Clear out legacy / old inserts
        coll.delete_many({})
        
        chunk_sz = 100
        t_chunks = math.ceil(len(onet_taxonomy) / chunk_sz)
        succ = 0
        for i in range(t_chunks):
            chnk = onet_taxonomy[i*chunk_sz : (i+1)*chunk_sz]
            coll.insert_many(chnk)
            succ += len(chnk)
            
        print(f"✅ Successfully inserted {succ} isolated O*NET Profiles into the Cloud Database!")
    except Exception as e:
        print(f"❌ MONGODB ERROR: {str(e)}")
    finally:
        if 'client' in locals() and client:
            client.close()
            
    print("\n🚀 O*NET PIPELINE COMPLETED AND CLOUD READY! 🚀")

if __name__ == "__main__":
    build_onet_infrastructure()
