import pandas as pd
from pathlib import Path
import glob
import logging
from datetime import datetime

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
RAW_DIR = PROJECT_ROOT / "Machine Learning and Data Cleaning" / "data" / "raw" / "jobs"
PROCESSED_DIR = PROJECT_ROOT / "Machine Learning and Data Cleaning" / "data" / "processed"
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

def standardize_columns(df, source_name):
    """Map source-specific columns to standard format."""
    df = df.copy()
    
    mapping = {}
    data_type = 'Live'

    if source_name == 'XpressJobs':
        mapping = {'job_url': 'url', 'scraped_date': 'date'}
    elif source_name == 'LinkedIn':
        mapping = {'company_name': 'company', 'job_url': 'url', 'posted_date': 'date'}
        data_type = 'Training'
    elif source_name == 'TopJobs':
        # Latest TopJobs format uses 'scraped_at' and 'url'
        mapping = {'scraped_at': 'date', 'job_url': 'url'}
    elif source_name == 'Ikman':
        mapping = {'job_title': 'title', 'job_url': 'url', 'posted_date': 'date', 'scraped_at': 'date'}
    
    df.rename(columns=mapping, inplace=True)
    
    # If source is already in columns, use it
    if 'source' in df.columns and pd.notna(df['source']).any():
        source_val = df['source'].iloc[0]
        if pd.notna(source_val):
             source_name = source_val

    # Required columns for the engine
    required = ['title', 'company', 'location', 'description', 'date', 'url']
    for col in required:
        if col not in df.columns:
            df[col] = "Not Specified"
            
    df['source'] = source_name
    df['data_type'] = data_type
    
    return df[required + ['source', 'data_type']]

def merge_jobs():
    """Main function to find and merge all job CSVs."""
    logger.info(f"Searching for mutiple scraped files in: {RAW_DIR}")
    
    all_dfs = []
    
    # Define source patterns
    sources = {
        'XpressJobs': "xpressjobs_ALL_CATEGORIES_CLEAN_*.csv",
        'LinkedIn': "linkedin_sri_lanka_IT_jobs.csv",
        'TopJobs': "topjobs_FINAL_*.csv",
        'Ikman': "ikman_*.csv"
    }
    
    for source_name, pattern in sources.items():
        files = glob.glob(str(RAW_DIR / pattern))
        for f in files:
            try:
                df = pd.read_csv(f)
                if not df.empty:
                    df = standardize_columns(df, source_name)
                    all_dfs.append(df)
                    logger.info(f"Loaded {source_name} from {Path(f).name}: {len(df)} rows")
            except Exception as e:
                logger.error(f"Failed to load {f}: {e}")


    
    if not all_dfs:
        logger.warning("No job data found to merge!")
        return

    master_df = pd.concat(all_dfs, ignore_index=True)
    initial_count = len(master_df)
    
    # conversion for date filtering
    # Use dayfirst=False and errors='coerce' to be safe
    master_df['temp_date'] = pd.to_datetime(master_df['date'], errors='coerce')
    
    # Log NaT count
    nat_count = master_df['temp_date'].isna().sum()
    if nat_count > 0:
        logger.warning(f"{nat_count} rows have invalid dates and may be filtered out.")
        # Fallback: if date is invalid but source is recent (today's scrape), keep it?
        # Actually, let's just make sure we capture today's dates.
    
    cutoff_date = datetime.now() - pd.Timedelta(days=30)
    
    # filter out old jobs (but keep NaT if they are from today's scrape? No, better fix scraper)
    # For now, let's keep NaT jobs to be safe if they were just loaded.
    master_df = master_df[(master_df['temp_date'] >= cutoff_date) | (master_df['temp_date'].isna())]
    
    removed_count = initial_count - len(master_df)
    if removed_count > 0:
        logger.info(f"Removed {removed_count} jobs older than 30 days (or invalid dates)")
    
    # drop duplicates (Source-aware)
    # prioritize most recent date if available
    master_df = master_df.sort_values('temp_date', ascending=False)
    
    # 1. Primary Deduplication (Exact URL)
    before_exact = len(master_df)
    master_df.drop_duplicates(subset=['url'], keep='first', inplace=True)
    
    # 2. Secondary Deduplication (Title + Company)
    # Sometimes same job has different tracking URLs
    before_title_comp = len(master_df)
    master_df.drop_duplicates(subset=['title', 'company'], keep='first', inplace=True)
    
    logger.info(f"Deduplication: Removed {before_exact - len(master_df)} exact URL dupes and {before_title_comp - len(master_df)} title/company dupes.")
    
    master_df = master_df.dropna(subset=['title'])
    
    # clean up temp column
    master_df.drop(columns=['temp_date'], inplace=True)
    
    logger.info(f"Final Count by Source:")
    source_counts = master_df['source'].value_counts()
    for src, count in source_counts.items():
        logger.info(f"- {src}: {count}")
    
    logger.info(f"Successfully merged into {len(master_df)} total unique jobs.")
    
    output_path = PROCESSED_DIR / "all_jobs_master.csv"
    master_df.to_csv(output_path, index=False)
    logger.info(f"Master dataset saved to {output_path}")

if __name__ == "__main__":
    merge_jobs()
