import requests
import zipfile
import io
import os
from pathlib import Path

def download_onet():
    versions = ["30_2", "30_1", "29_3", "29_2", "29_1", "28_3", "28_2"]
    
    dest_dir = Path(r'c:\Users\User\Desktop\Second Year Stuff\sdgp\PathFinder+\Adjusted_Scraper\project_root\Machine Learning and Data Cleaning\data\onet')
    dest_dir.mkdir(parents=True, exist_ok=True)
    
    # We will try a few versions backwards until one is successful
    for v in versions:
        url = f"https://www.onetcenter.org/dl_files/database/db_{v}_text.zip"
        print(f"Trying to download O*NET version {v} from {url}...")
        try:
            # Added a proper User-Agent to avoid 403 Forbidden checks
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
            response = requests.get(url, headers=headers, stream=True, timeout=15)
            
            if response.status_code == 200:
                print("Download started. Extracting ZIP archive directly into memory...")
                with zipfile.ZipFile(io.BytesIO(response.content)) as z:
                    z.extractall(dest_dir)
                print(" O*NET Database successfully harvested!")
                return
            else:
                print(f"Version {v} returned status code {response.status_code}. Trying next...")
                
        except Exception as e:
            print(f"Error fetching {v}: {e}")
            
    print(" Critical: Could not download any O*NET versions.")

if __name__ == "__main__":
    download_onet()
