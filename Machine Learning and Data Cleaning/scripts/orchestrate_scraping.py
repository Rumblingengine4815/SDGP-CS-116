import os
import subprocess
import logging
import time
from datetime import datetime, timedelta
from pathlib import Path
import sys

# find project root
# Traverse up until we find 'project_root' or stop at a reasonable limit
current = Path(__file__).resolve().parent
PROJECT_ROOT = None
for _ in range(5):
    if current.name == "project_root":
        PROJECT_ROOT = current
        break
    current = current.parent

if not PROJECT_ROOT:
    PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

SCRAPER_DIR = PROJECT_ROOT / "Machine Learning and Data Cleaning" / "data" / "raw" / "scrapers"
DATA_DIR = PROJECT_ROOT / "Machine Learning and Data Cleaning" / "data" / "raw" / "jobs"
LOG_DIR = PROJECT_ROOT / "Machine Learning and Data Cleaning" / "data" / "logs"

# ensure directories exist
LOG_DIR.mkdir(parents=True, exist_ok=True)

# setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_DIR / "scraper_status.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("ScraperOrchestrator")

def cleanup_old_files(directory, days=30):
    # delete jobs older ththan 30 days
    logger.info(f"starting cleanup in {directory} (older than {days} days)")
    now = datetime.now()
    cutoff = now - timedelta(days=days)
    
    count = 0
    if not directory.exists():
        return
        
    for item in directory.glob("*"):
        if item.is_file():
            # check modification time
            mtime = datetime.fromtimestamp(item.stat().st_mtime)
            if mtime < cutoff:
                try:
                    item.unlink()
                    count += 1
                    logger.info(f"deleted expired: {item.name}")
                except Exception as e:
                    logger.error(f"failed to delete {item.name}: {e}")
    
    logger.info(f"cleanup finished. removed {count} files.")

def run_scraper(name, script_path, args=None):
    """run a python scraper script and stream output in real-time"""
    logger.info(f"starting scraper: {name}")
    
    cmd = [sys.executable, str(script_path)]
    if args:
        cmd.extend(args)
        
    start_time = time.time()
    # Ensure subprocesses use UTF-8
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"
    
    try:
        # stream output in real-time
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            cwd=str(script_path.parent),
            bufsize=1,
            universal_newlines=True,
            encoding='utf-8',
            errors='replace',
            env=env
        )

        for line in process.stdout:
            print(f"[{name}] {line.strip()}", flush=True)
            # optionally log important lines
            if any(kw in line.lower() for kw in ["error", "success", "scraped", "saving"]):
                logger.info(f"{name}: {line.strip()}")

        process.wait()
        duration = time.time() - start_time
        
        if process.returncode == 0:
            logger.info(f"scraper {name} finished successfully in {duration:.1f}s")
            return True
        else:
            logger.error(f"scraper {name} failed with exit code {process.returncode}")
            return False
            
    except Exception as e:
        logger.error(f"unexpected error running {name}: {e}")
        return False

def orchestrate():
    """main orchestration flow"""
    logger.info("="*50)
    logger.info("SCHEDULED SCRAPING START")
    logger.info("="*50)
    
    # cleanup old data
    cleanup_old_files(DATA_DIR, days=30)
    
   
    scrapers = [
        ("TopJobs", SCRAPER_DIR / "topjobs.py", ["2"]), # run 2 pages in auto mode
        ("Ikman", SCRAPER_DIR / "ikmanjobs.py", []),
        ("Xpress", SCRAPER_DIR / "generalxpess.py", ["2"]) # run 2 pages in auto mode
    ]
    
    results = {}
    for name, path, args in scrapers:
        if path.exists():
            success = run_scraper(name, path, args)
            results[name] = "SUCCESS" if success else "FAILED"
        else:
            logger.warning(f"scraper script not found: {path}")
            results[name] = "NOT FOUND"
            
    # 4. merge all jobs
    logger.info("Starting final data merge...")
    merge_script = PROJECT_ROOT / "Machine Learning and Data Cleaning" / "scripts" / "merge_all_jobs.py"
    if merge_script.exists():
        run_scraper("MergeAllJobs", merge_script, [])
    else:
        logger.warning(f"merge script not found: {merge_script}")
            
    # 5. summary
    logger.info("="*50)
    logger.info("SCRAPING SUMMARY")
    for name, status in results.items():
        logger.info(f"- {name}: {status}")
    logger.info("="*50)

if __name__ == "__main__":
    orchestrate()
