import pandas as pd
from pathlib import Path
from datetime import datetime, timedelta
import os

def save_scraped_data(data, prefix, target_dir="../data/raw/jobs", keep_days=7, append=False):
    """
    Save scraped data to CSV. 
    If append=True, it adds to a [prefix]_MASTER.csv instead of using timestamps.
    """
    dir_path = Path(target_dir)
    dir_path.mkdir(parents=True, exist_ok=True)
    
    if isinstance(data, list):
        df = pd.DataFrame(data)
    else:
        df = data

    if append:
        filename = dir_path / f"{prefix}_MASTER.csv"
        file_exists = filename.exists()
        
        # Append to the existing file
        df.to_csv(filename, mode='a', index=False, header=not file_exists, encoding='utf-8-sig')
        print(f" Appended {len(df)} rows to Master: {filename}")
    else:
        # Save new timestamped file (default behavior)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = dir_path / f"{prefix}_{timestamp}.csv"
        df.to_csv(filename, index=False, encoding='utf-8-sig')
        print(f" Saved {len(df)} rows to: {filename}")
        
        # Cleanup old timestamped files
        cleanup_old_files(dir_path, prefix, keep_days)
    
    return filename

def cleanup_old_files(directory, prefix, keep_days):
    
    cutoff = datetime.now() - timedelta(days=keep_days)
    
    for file in Path(directory).glob(f"{prefix}_*.csv"):
        file_time_str = file.stem.split('_')[-2:] # Get YYYYMMDD and HHMMSS
        try:
            file_time = datetime.strptime("_".join(file_time_str), '%Y%m%d_%H%M%S')
            if file_time < cutoff:
                os.remove(file)
                print(f" Removed old file: {file.name}")
        except:
            # Fallback to file modification time if timestamp parsing fails
            if datetime.fromtimestamp(file.stat().st_mtime) < cutoff:
                os.remove(file)
                print(f" Removed old file (by mtime): {file.name}")
