import pandas as pd
from pathlib import Path

def merge_linkedin_data():
    root_dir = Path(r'c:\Users\User\Desktop\Second Year Stuff\sdgp\PathFinder+\Adjusted_Scraper\project_root')
    
    linkedin_file = root_dir / 'Machine Learning and Data Cleaning' / 'processed' / 'linkedin_sri_lanka_IT_jobs.csv'
    master_file = root_dir / 'Machine Learning and Data Cleaning' / 'data' / 'processed' / 'all_jobs_master.csv'
    
    print(f"Reading {linkedin_file.name}...")
    df_linkedin = pd.read_csv(linkedin_file)
    
    # Map columns to match master csv: title,company,location,description,date,url,source,data_type
    df_new = pd.DataFrame()
    df_new['title'] = df_linkedin['title']
    df_new['company'] = df_linkedin['company']
    df_new['location'] = df_linkedin['location']
    df_new['description'] = df_linkedin['description']
    df_new['date'] = df_linkedin['posted_date']
    df_new['url'] = df_linkedin['job_url']
    df_new['source'] = 'LinkedIn'
    df_new['data_type'] = 'Historical/Kaggle'
    
    print(f"Reading {master_file.name}...")
    df_master = pd.read_csv(master_file)
    
    # Append
    print("Appending datasets...")
    df_combined = pd.concat([df_master, df_new], ignore_index=True)
    
    # Drop duplicates based on URL
    prev_len = len(df_combined)
    df_combined = df_combined.drop_duplicates(subset=['url'])
    print(f"Dropped {prev_len - len(df_combined)} duplicate URLs.")
    
    # Also drop based on title and company in case linkedin is same as topjobs
    prev_len = len(df_combined)
    df_combined = df_combined.drop_duplicates(subset=['title', 'company'])
    print(f"Dropped {prev_len - len(df_combined)} duplicate Title+Company.")
    
    print(f"Saving merged dataset: {len(df_combined)} total jobs.")
    df_combined.to_csv(master_file, index=False)
    
    print("✅ Successfully merged LinkedIn IT Job Dataset into all_jobs_master.csv")

if __name__ == "__main__":
    merge_linkedin_data()
