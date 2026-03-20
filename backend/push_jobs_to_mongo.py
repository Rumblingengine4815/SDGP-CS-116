import pandas as pd
import json
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import math
import sys
from pathlib import Path

# Load env securely
env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=env_path)

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DATABASE_NAME", "pathfinder_plus")

if not MONGO_URI:
    print("❌ ERROR: MONGO_URI not found in .env file.")
    sys.exit(1)

def push_to_mongo():
    try:
        print(f"🔄 Connecting to MongoDB (Timeout 10s)...")
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=10000)
        # Test connection
        client.server_info()
        db = client[DB_NAME]
        collection = db['all_jobs']
        
        master_file_path = Path(r'c:\Users\User\Desktop\Second Year Stuff\sdgp\PathFinder+\Adjusted_Scraper\project_root\Machine Learning and Data Cleaning\data\processed\all_jobs_master.csv')
        
        if not master_file_path.exists():
            print(f"❌ ERROR: Cannot find {master_file_path}")
            sys.exit(1)
            
        print(f"📊 Loading Data from {master_file_path.name}")
        df = pd.read_csv(master_file_path, low_memory=False)
        
        # Clean Pandas NA to standard empty strings for MongoDB
        df = df.fillna("")
        records = df.to_dict('records')
        
        print(f"🗑️ Clearing existing records in '{collection.name}' collection to prevent duplicates...")
        collection.delete_many({})
        
        chunk_size = 500
        total_chunks = math.ceil(len(records) / chunk_size)
        
        print(f"🚀 Pushing {len(records)} records in {total_chunks} chunks...")
        
        success_count = 0
        for i in range(total_chunks):
            chunk = records[i*chunk_size : (i+1)*chunk_size]
            try:
                collection.insert_many(chunk)
                success_count += len(chunk)
                print(f"   [{i+1}/{total_chunks}] Inserted {len(chunk)} records. Total success: {success_count}")
            except Exception as e:
                print(f"   ❌ ERROR inserting chunk {i+1}: {str(e)}")
                # We do not crash, we continue to prevent dropping the entire pipeline
                
        print(f"✅ Finished pushing to MongoDB. Successfully inserted {success_count} out of {len(records)} records.")
        
    except Exception as e:
        print(f"🔥 FATAL ERROR: {str(e)}")
        sys.exit(1)
    finally:
        if 'client' in locals() and client:
            client.close()
            print("🔌 MongoDB connection closed securely.")

if __name__ == "__main__":
    push_to_mongo()
