
import csv
import logging
import time
import random
from datetime import datetime
from typing import List, Dict, Optional
import re

import requests
from bs4 import BeautifulSoup
import sys
from pathlib import Path

# Add project root to sys.path to allow importing utils
sys.path.append(str(Path(__file__).resolve().parent.parent.parent.parent))
from utils.data_handler import save_scraped_data

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('course_scraper.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


def save_to_csv_optimized(courses: List[Dict], prefix: str):
    """Save courses using shared data handler"""
    if not courses:
        logger.warning("No courses to save")
        return None

    # Calculate absolute path to target directory
    project_root = Path(__file__).resolve().parent.parent.parent.parent
    target_path = project_root / "data" / "raw" / "courses"
    
    filename = save_scraped_data(courses, prefix, target_dir=target_path, keep_days=7)
    
    return filename


class CourseScraper:
    """Base scraper"""

    def __init__(self):
        self.courses_data: List[Dict] = []
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })

    def _get_page(self, url: str, max_retries: int = 3) -> Optional[str]:
        for attempt in range(max_retries):
            try:
                response = self.session.get(url, timeout=30)
                response.raise_for_status()
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


class PickACourseScraper(CourseScraper):
    """pickacourse.lk scraper - 7,217 courses!"""

    def __init__(self):
        super().__init__()
        self.base_url = "https://www.pickacourse.lk"

    def scrape_all_courses(self, max_pages: int = 100) -> List[Dict]:
        logger.info("Starting pickacourse.lk")
        page, consecutive_empty = 1, 0

        while page <= max_pages:
            url = f"{self.base_url}/courses?page={page}"
            logger.info(f"pickacourse page {page}/{max_pages}")
            print(f"  Page {page}: ", end='', flush=True)

            html = self._get_page(url)
            if not html:
                consecutive_empty += 1
                if consecutive_empty >= 3:
                    break
                page += 1
                continue

            soup = BeautifulSoup(html, 'html.parser')
            courses = self._extract(soup)

            if not courses:
                consecutive_empty += 1
                print(f"No courses")
                if consecutive_empty >= 3:
                    logger.info("3 empty pages, stopping")
                    break
            else:
                consecutive_empty = 0
                self.courses_data.extend(courses)
                print(f"+{len(courses)} courses (Total: {len(self.courses_data)})")

            page += 1
            time.sleep(random.uniform(1, 2))

        logger.info(f"pickacourse.lk complete: {len(self.courses_data)} courses")
        return self.courses_data

    def _extract(self, soup):
        courses = []

        # The courses are in list items
        course_items = soup.find_all('li')

        for item in course_items:
            try:
                # Look for course link
                link = item.find('a', href=re.compile(r'/course/'))
                if not link:
                    continue

                course = {
                    'course_name': '',
                    'institute': '',
                    'duration': '',
                    'fees': '',
                    'category': '',
                    'level': '',
                    'location': '',
                    'mode': '',
                    'description': '',
                    'course_url': '',
                    'source': 'pickacourse.lk'
                }

                # Course name & URL
                course['course_url'] = link.get('href', '')
                if not course['course_url'].startswith('http'):
                    course['course_url'] = f"{self.base_url}{course['course_url']}"

                # Get all text from item
                text = item.get_text('|', strip=True)
                parts = text.split('|')

                if len(parts) >= 1:
                    course['course_name'] = self._clean_text(parts[0])

                # Category (usually second item)
                if len(parts) >= 2:
                    course['category'] = self._clean_text(parts[1])

                # Level (usually last clear text item)
                for part in reversed(parts):
                    if any(level in part for level in
                           ['Certificate', 'Diploma', 'Degree', 'Masters', 'PhD', 'Foundation']):
                        course['level'] = self._clean_text(part)
                        break

                # Institute (usually last item with full words)
                if len(parts) >= 3:
                    course['institute'] = self._clean_text(parts[-1])

                if course['course_name']:
                    courses.append(course)

            except Exception as e:
                logger.warning(f"Error extracting course: {e}")
                continue

        return courses


class CoursenetScraper(CourseScraper):
    """coursenet.lk scraper"""

    def __init__(self):
        super().__init__()
        self.base_url = "https://www.coursenet.lk"

    def scrape_all_courses(self, max_pages: int = 100) -> List[Dict]:
        logger.info("Starting coursenet.lk")
        page, consecutive_empty = 1, 0

        while page <= max_pages:
            url = f"{self.base_url}/courses?page={page}"
            logger.info(f"coursenet page {page}/{max_pages}")
            print(f"  Page {page}: ", end='', flush=True)

            html = self._get_page(url)
            if not html:
                consecutive_empty += 1
                if consecutive_empty >= 3:
                    break
                page += 1
                continue

            soup = BeautifulSoup(html, 'html.parser')
            courses = self._extract(soup)

            if not courses:
                consecutive_empty += 1
                print(f"No courses")
                if consecutive_empty >= 3:
                    break
            else:
                consecutive_empty = 0
                self.courses_data.extend(courses)
                print(f"+{len(courses)} courses (Total: {len(self.courses_data)})")

            page += 1
            time.sleep(random.uniform(1, 2))

        logger.info(f"coursenet.lk complete: {len(self.courses_data)} courses")
        return self.courses_data

    def _extract(self, soup):
        courses = []

        # Find all course cards/links
        course_links = soup.find_all('a', href=re.compile(r'/courses/|/course/'))

        for link in course_links:
            try:
                course = {
                    'course_name': '',
                    'institute': '',
                    'duration': '',
                    'fees': '',
                    'category': '',
                    'level': '',
                    'location': '',
                    'mode': '',
                    'description': '',
                    'course_url': '',
                    'source': 'coursenet.lk'
                }

                # Course name & URL
                course['course_name'] = self._clean_text(link.get_text())
                course['course_url'] = link.get('href', '')
                if not course['course_url'].startswith('http'):
                    course['course_url'] = f"{self.base_url}{course['course_url']}"

                # Try to get level from nearby text
                parent = link.parent
                if parent:
                    text = parent.get_text().lower()
                    if 'diploma' in text:
                        course['level'] = 'Diploma'
                    elif 'degree' in text or 'bachelor' in text:
                        course['level'] = 'Degree'
                    elif 'masters' in text or 'mba' in text:
                        course['level'] = 'Masters'
                    elif 'certificate' in text:
                        course['level'] = 'Certificate'
                    elif 'phd' in text:
                        course['level'] = 'PhD'

                if course['course_name'] and len(course['course_name']) > 5:
                    courses.append(course)

            except Exception as e:
                continue

        return courses


class CourseLKScraper(CourseScraper):
    """course.lk scraper"""

    def __init__(self):
        super().__init__()
        self.base_url = "https://course.lk"

    def scrape_all_courses(self, max_pages: int = 100) -> List[Dict]:
        logger.info("Starting course.lk")
        page, consecutive_empty = 1, 0

        while page <= max_pages:
            # Try different URL patterns
            urls_to_try = [
                f"{self.base_url}/courses?page={page}",
                f"{self.base_url}/courses/{page}",
                f"{self.base_url}/?page={page}",
            ]

            html = None
            for url in urls_to_try:
                html = self._get_page(url)
                if html and len(html) > 1000:  # Got valid content
                    break

            if not html:
                consecutive_empty += 1
                if consecutive_empty >= 3:
                    break
                page += 1
                continue

            soup = BeautifulSoup(html, 'html.parser')
            courses = self._extract(soup)

            if not courses:
                consecutive_empty += 1
                if consecutive_empty >= 3:
                    break
            else:
                consecutive_empty = 0
                self.courses_data.extend(courses)
                logger.info(f"course.lk page {page}: +{len(courses)}")
                print(f"  Page {page}: +{len(courses)} courses (Total: {len(self.courses_data)})")

            page += 1
            time.sleep(random.uniform(1, 2))

        logger.info(f"course.lk complete: {len(self.courses_data)} courses")
        return self.courses_data

    def _extract(self, soup):
        courses = []

        # Find all links that might be courses
        all_links = soup.find_all('a', href=True)

        for link in all_links:
            try:
                href = link.get('href', '')
                text = link.get_text().strip()

                # Skip if doesn't look like a course
                if len(text) < 10 or not text:
                    continue

                course = {
                    'course_name': '',
                    'institute': '',
                    'duration': '',
                    'fees': '',
                    'category': '',
                    'level': '',
                    'location': '',
                    'mode': '',
                    'description': '',
                    'course_url': '',
                    'source': 'course.lk'
                }

                course['course_name'] = self._clean_text(text)
                course['course_url'] = href if href.startswith('http') else f"{self.base_url}{href}"

                # Extract level from title
                title_lower = text.lower()
                if 'diploma' in title_lower:
                    course['level'] = 'Diploma'
                elif 'degree' in title_lower or 'bachelor' in title_lower:
                    course['level'] = 'Degree'
                elif 'masters' in title_lower:
                    course['level'] = 'Masters'
                elif 'certificate' in title_lower:
                    course['level'] = 'Certificate'

                if course['course_name']:
                    courses.append(course)

            except Exception as e:
                continue

        return courses


def main():
    print("=" * 80)
    print("SRI LANKAN COURSE SCRAPER - WORKING VERSION")
    print("Saves after EACH site!")
    print("=" * 80)
    print()

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    output_file = f'sri_lanka_courses_{timestamp}.csv'
    all_courses = []

    # 1. pickacourse.lk (7,217 courses!)
    print("[1/3] Scraping pickacourse.lk (7,217+ courses)...")
    print("-" * 80)
    try:
        pac = PickACourseScraper()
        courses = pac.scrape_all_courses(max_pages=361)  # 361 pages total
        all_courses.extend(courses)
        save_to_csv_optimized(all_courses, "sri_lanka_courses")
        print(f"✓ pickacourse.lk: {len(courses)} courses")
        print()
    except KeyboardInterrupt:
        print("\n Interrupted! Saving...")
        save_to_csv(all_courses, output_file)
        return
    except Exception as e:
        print(f" Error: {e}")

    # 2. coursenet.lk
    print("[2/3] Scraping coursenet.lk...")
    print("-" * 80)
    try:
        cn = CoursenetScraper()
        courses = cn.scrape_all_courses(max_pages=100)
        all_courses.extend(courses)
        save_to_csv_optimized(all_courses, "sri_lanka_courses")
        print(f"✓ coursenet.lk: {len(courses)} courses")
        print()
    except KeyboardInterrupt:
        print("\n Interrupted! Saving...")
        save_to_csv(all_courses, output_file)
        return
    except Exception as e:
        print(f"✗ Error: {e}")

    # 3. course.lk
    print("[3/3] Scraping course.lk...")
    print("-" * 80)
    try:
        cl = CourseLKScraper()
        courses = cl.scrape_all_courses(max_pages=50)
        all_courses.extend(courses)
        save_to_csv_optimized(all_courses, "sri_lanka_courses")
        print(f"✓ course.lk: {len(courses)} courses")
        print()
    except KeyboardInterrupt:
        print("\nInterrupted! Saving...")
        save_to_csv(all_courses, output_file)
        return
    except Exception as e:
        print(f" Error: {e}")

    # Summary
    print("\n" + "=" * 80)
    print("FINAL SUMMARY")
    print("=" * 80)
    print(f"Total courses: {len(all_courses)}")

    if all_courses:
        sources, levels = {}, {}
        for course in all_courses:
            sources[course['source']] = sources.get(course['source'], 0) + 1
            levels[course['level'] or 'Unknown'] = levels.get(course['level'] or 'Unknown', 0) + 1

        print("\nCourses by source:")
        for s, c in sorted(sources.items(), key=lambda x: x[1], reverse=True):
            print(f"  {s}: {c}")

        print("\nCourses by level:")
        for l, c in sorted(levels.items(), key=lambda x: x[1], reverse=True)[:10]:
            print(f"  {l}: {c}")

        print(f"\n File: {output_file}")
        print("=" * 80)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nInterrupted")
    except Exception as e:
        print(f"\n Error: {e}")