import requests
from bs4 import BeautifulSoup
import csv
import time
import logging
from datetime import datetime
from pathlib import Path
import re
import sys

# Add project root to sys.path to allow importing utils
sys.path.append(str(Path(__file__).resolve().parent.parent.parent.parent))
from utils.data_handler import save_scraped_data

BASE_URL = "https://www.gazette.lk/jobs"
MAX_PAGES = 5
DELAY = 1.5

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

OUTPUT_DIR = Path("output")
LOG_DIR = Path("logs")
OUTPUT_DIR.mkdir(exist_ok=True)
LOG_DIR.mkdir(exist_ok=True)

CSV_FILE = OUTPUT_DIR / "gazette_jobs.csv"
LOG_FILE = LOG_DIR / "gazette.log"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler()
    ]
)

def clean(text):
    return re.sub(r"\s+", " ", text).strip()


def scrape_gazette():
    logging.info("Starting Gazette.lk deep scrape")
    jobs = []

    for page in range(1, MAX_PAGES + 1):
        url = f"{BASE_URL}/page/{page}"
        logging.info(f"Scraping page {page}: {url}")

        r = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(r.text, "html.parser")

        posts = soup.select("article.post")
        logging.info(f"Found {len(posts)} posts")

        if not posts:
            break

        for post in posts:
            try:
                title_el = post.select_one("h2.entry-title a")
                title = clean(title_el.text)
                job_url = title_el["href"]

                posted_date = ""
                date_el = post.select_one("time.entry-date")
                if date_el:
                    posted_date = date_el.text.strip()

                categories = [
                    c.text.strip()
                    for c in post.select("footer.entry-footer a")
                ]

                image_url = ""
                img = post.select_one("img.wp-post-image")
                if img:
                    image_url = img.get("src", "")

                d = requests.get(job_url, headers=HEADERS, timeout=15)
                detail = BeautifulSoup(d.text, "html.parser")

                content = detail.select_one("div.entry-content")
                full_text = clean(content.get_text("\n")) if content else ""

                # Extract structured info
                closing_date = ""
                qualifications = ""
                organization = ""

                for line in full_text.split("\n"):
                    l = line.lower()
                    if "closing date" in l:
                        closing_date = line
                    if "qualification" in l:
                        qualifications += line + " "
                    if any(k in l for k in ["ministry", "department", "bank", "authority"]):
                        organization = line

               
                gazette_image = ""
                for img in content.find_all("img"):
                    src = img.get("src", "")
                    if "wp-content/uploads" in src:
                        gazette_image = src
                        break

                jobs.append({
                    "title": title,
                    "organization": organization,
                    "job_type": ", ".join(categories),
                    "posted_date": posted_date,
                    "closing_date": closing_date,
                    "qualifications": clean(qualifications),
                    "description": full_text,
                    "gazette_image": gazette_image,
                    "source": "gazette.lk",
                    "url": job_url,
                    "scraped_at": datetime.now().isoformat()
                })

            except Exception as e:
                logging.error(f"Error parsing job: {e}")

        time.sleep(DELAY)

    save_csv_optimized(jobs)
    logging.info(f"Gazette scrape finished. Total saved: {len(jobs)}")


def save_csv_optimized(jobs):
    if not jobs:
        logging.warning("No jobs to save")
        return None

   
    project_root = Path(__file__).resolve().parent.parent.parent.parent
    target_path = project_root / "data" / "raw" / "jobs"
    
    filename = save_scraped_data(jobs, "gazette_jobs", target_dir=target_path, keep_days=7)
    
    logging.info(f"Saved CSV → {filename}")
    return filename


if __name__ == "__main__":
    scrape_gazette()
