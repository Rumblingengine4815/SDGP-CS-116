
import csv
import logging
import time
import random
from datetime import datetime
from typing import List, Dict, Optional
import re
import os

import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('../../../../job_scraper.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


def save_to_csv(jobs: List[Dict], filename: str):
    """Save jobs to CSV"""
    if not jobs:
        logger.warning("No jobs to save")
        return

    fieldnames = ['job_title', 'company', 'location', 'job_type', 'posted_date',
                  'closing_date', 'description', 'required_skills', 'salary', 'job_url', 'source']

    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(jobs)

    logger.info(f"Saved {len(jobs)} jobs to {filename}")
    print(f" Saved {len(jobs)} jobs to {filename}")


def append_to_csv(jobs: List[Dict], filename: str):
    """Append jobs to CSV - keeps existing data"""
    if not jobs:
        return

    fieldnames = ['job_title', 'company', 'location', 'job_type', 'posted_date',
                  'closing_date', 'description', 'required_skills', 'salary', 'job_url', 'source']

    # Check if file exists
    file_exists = os.path.isfile(filename)

    with open(filename, 'a', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        writer.writerows(jobs)

    logger.info(f"Appended {len(jobs)} jobs to {filename}")


class JobBoardScraper:
   

    def __init__(self):
        self.jobs_data: List[Dict] = []
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })

    def _get_page(self, url: str, max_retries: int = 3) -> Optional[str]:
        for attempt in range(max_retries):
            try:
                response = self.session.get(url, timeout=30)
                response.raise_for_status()
                #Using apparent encoding for UTF-8 detection to prevent mojibake
                if response.encoding == 'ISO-8859-1':
                    response.encoding = response.apparent_encoding or 'utf-8'
                return response.text
            except Exception as e:
                logger.warning(f"Attempt {attempt + 1} failed: {e}")
                if attempt < max_retries - 1:
                    time.sleep(3)
        return None

    def _clean_text(self, text: Optional[str]) -> str:
        if not text:
            return ""
        return re.sub(r'\s+', ' ', text.strip())



class IkmanJobsScraper(JobBoardScraper):
    """ikman.lk scraper"""

    def __init__(self):
        super().__init__()
        self.base_url = "https://ikman.lk"

    def scrape_all_jobs(self, max_pages: int = 50) -> List[Dict]:
        logger.info("Starting ikman.lk")
        page, consecutive_empty = 1, 0

        while page <= max_pages:
            logger.info(f"ikman page {page}/{max_pages}")
            html = self._get_page(f"{self.base_url}/en/ads/sri-lanka/jobs?page={page}")

            if not html:
                consecutive_empty += 1
                if consecutive_empty >= 3:
                    break
                page += 1
                continue

            soup = BeautifulSoup(html, 'html.parser')
            jobs = self._extract(soup)

            if not jobs:
                consecutive_empty += 1
                if consecutive_empty >= 3:
                    logger.info("ikman: 3 consecutive empty pages, stopping")
                    break
            else:
                consecutive_empty = 0
                self.jobs_data.extend(jobs)
                logger.info(f"ikman page {page}: +{len(jobs)} jobs (Total: {len(self.jobs_data)})")
                print(f"  Page {page}: +{len(jobs)} jobs (Total: {len(self.jobs_data)})")

            page += 1
            time.sleep(random.uniform(1, 2))

        logger.info(f"ikman.lk complete: {len(self.jobs_data)} jobs")
        return self.jobs_data

    def _extract(self, soup):
        jobs = []
        listings = soup.find_all('li', class_=re.compile('normal--')) or \
                   soup.find_all('div', class_='ad-item') or \
                   soup.find_all('article')

        for listing in listings:
            try:
                job = {'job_title': '', 'company': '', 'location': '', 'job_type': '',
                       'posted_date': '', 'closing_date': '', 'description': '',
                       'required_skills': '', 'salary': '', 'job_url': '', 'source': 'ikman.lk'}

                title = listing.find('a', href=re.compile('/ad/'))
                if title:
                    # Target only the job title text, avoiding nested spans with metadata
                    # We do this by collecting strings but stopping/skipping at nested metadata tags
                    title_text = ""
                    for child in title.children:
                        if isinstance(child, str):
                            title_text += child
                        elif child.name not in ['span', 'div', 'p']:
                            title_text += child.get_text()
                    
                    job['job_title'] = self._clean_text(title_text)
                    href = title['href']
                    job['job_url'] = href if href.startswith('http') else f"{self.base_url}{href}"

                    # Extract job type from title
                    title_lower = job['job_title'].lower()
                    if 'full-time' in title_lower or 'full time' in title_lower:
                        job['job_type'] = 'Full-time'
                    elif 'part-time' in title_lower or 'part time' in title_lower:
                        job['job_type'] = 'Part-time'
                    elif 'intern' in title_lower:
                        job['job_type'] = 'Internship'
                    elif 'contract' in title_lower:
                        job['job_type'] = 'Contract'

                location = listing.find(class_=re.compile('location', re.I))
                if location:
                    job['location'] = self._clean_text(location.get_text())

                if job['job_title']:
                    jobs.append(job)
            except:
                continue

        return jobs



def main():
    print("=" * 80)
    print("IKMAN.LK JOB SCRAPER")
    print("=" * 80)
    print("Scraping job listings and saving progress automatically.")
    print()

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    output_file = f'ikman_{timestamp}.csv'

    all_jobs = []

    print("Starting scrape for ikman.lk...")
    print("-" * 80)

    try:
        ikman = IkmanJobsScraper()
        jobs = ikman.scrape_all_jobs(max_pages=50)
        all_jobs.extend(jobs)
        save_to_csv(all_jobs, output_file)

        print(f"\nScraping completed.")
        print(f"Jobs collected: {len(jobs)}")
        print(f"Data saved to: {output_file}")

    except KeyboardInterrupt:
        print("\nProcess interrupted by user. Saving collected data...")
        save_to_csv(all_jobs, output_file)
        print(f"Saved {len(all_jobs)} jobs to {output_file}")
        return

    except Exception as e:
        print(f"An error occurred: {e}")

    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Total jobs collected: {len(all_jobs)}")

    if all_jobs:
        print(f"Output file: {output_file}")
    else:
        print("No jobs were collected.")
