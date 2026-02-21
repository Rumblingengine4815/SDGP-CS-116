

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pandas as pd
import time
from datetime import datetime
import re


HEADLESS = False
MAX_PAGES_PER_SUBJECT = 3



def setup_driver():
    options = Options()
    if HEADLESS:
        options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--no-sandbox")
    return webdriver.Chrome(options=options)

def is_ad_or_promo(title, text, url):

    combined = f"{title} {text} {url}".lower()

    # Ad/promo keywords
    bad_keywords = [
        '50% off', 'save 50%', 'discount', 'special offer', 'sale',
        'gift card', 'never expires', 'perfect gift', 'limited time',
        'coursera plus', 'courseraplus', 'subscribe now', 'membership',
        'bootcamp enrollment', 'enroll now for', 'special pricing'
    ]

    return any(keyword in combined for keyword in bad_keywords)


def extract_price(text, elem=None):
    """Extract price with Free/Paid detection"""
    text_lower = text.lower()

    # Free indicators
    free_keywords = ['free course', 'free online', 'free certificate',
                     'audit for free', 'free enrollment', 'no cost']
    if any(kw in text_lower for kw in free_keywords):
        return "Free"

    # Paid indicators
    paid_keywords = ['paid course', 'paid certificate', 'subscription required',
                     'premium', 'certificate fee']
    if any(kw in text_lower for kw in paid_keywords):
        return "Paid"

    # Price patterns
    price_match = re.search(r'\$[\d,]+(?:\.\d{2})?|rs\.?\s*[\d,]+|lkr\s*[\d,]+', text, re.IGNORECASE)
    if price_match:
        return price_match.group(0)

    # Try element
    if elem:
        try:
            price_elem = elem.find_element(By.CSS_SELECTOR, "[aria-label='Pricing'], .price")
            return price_elem.text.strip() or "Paid"
        except:
            pass

    return "Paid"  # Default to Paid if unclear



def scrape_classcentral(driver):
    """Scrape Class Central - 30+ categories × 3 pages"""

    print("\n" + "=" * 80)
    print("SCRAPING CLASS CENTRAL (30+ categories × 3 pages each)")
    print("=" * 80)

    subjects = [
        # Various Categories for listings
        'programming-and-software-development', 'data-science', 'computer-science',
        'information-technology', 'cybersecurity', 'web-development',
        'mobile-development', 'cloud-computing', 'artificial-intelligence', 'machine-learning',

        
        'business', 'management', 'entrepreneurship', 'marketing', 'finance',
        'accounting', 'human-resources', 'project-management', 'leadership', 'strategy',

        'design', 'graphic-design', 'ux', 'art-and-design', 'photography',

       
        'health', 'medicine', 'biology', 'chemistry', 'physics', 'nutrition', 'mental-health',

       
        'education', 'psychology', 'social-sciences', 'law', 'history',

        
        'engineering', 'mechanical-engineering', 'electrical-engineering'
    ]

    courses = []

    for subject in subjects:
        print(f"\n {subject.replace('-', ' ').title()}")

        for page_num in range(1, MAX_PAGES_PER_SUBJECT + 1):
            url = f"https://www.classcentral.com/subject/{subject}" + (f"?page={page_num}" if page_num > 1 else "")
            print(f"  Page {page_num}...", end=" ")

            try:
                driver.get(url)
                WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
                time.sleep(4)

                # Scroll to load content
                for _ in range(2):
                    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                    time.sleep(1)

    
                elems = (driver.find_elements(By.CSS_SELECTOR, "li[data-lookup-course]") or
                         driver.find_elements(By.CSS_SELECTOR, "li.course-list-course") or
                         driver.find_elements(By.CSS_SELECTOR, "li[itemscope]"))

                print(f"{len(elems)} found", end=" ")
                page_added = 0

                for elem in elems[:40]:
                    try:
                        text = elem.text.strip()
                        if len(text) < 20:
                            continue

                        # Title
                        title = None
                        for tag in ['h2', 'h3', 'h4']:
                            try:
                                title = elem.find_element(By.TAG_NAME, tag).text.strip()
                                if title and len(title) > 5:
                                    break
                            except:
                                continue

                        if not title:
                            try:
                                title = elem.find_element(By.CSS_SELECTOR, "[itemprop='name']").text.strip()
                            except:
                                continue

                        if not title or len(title) < 5:
                            continue

                        # URL
                        try:
                            url_elem = elem.find_element(By.TAG_NAME, 'a')
                            course_url = url_elem.get_attribute('href')
                            if not course_url.startswith('http'):
                                course_url = f"https://www.classcentral.com{course_url}"
                        except:
                            course_url = url

                        # FILTER ADS
                        if is_ad_or_promo(title, text, course_url):
                            continue

                       
                        provider = "Unknown"
                        for line in text.split('\n'):
                            line = line.strip()
                            
                            if ['ratings at', 'replies..'] in line.lower() or ['rating','comments'] in line.lower():
                                continue
                            if any(p in line.lower() for p in ['university', 'coursera', 'edx', 'udacity',
                                                               'udemy', 'linkedin', 'mit', 'stanford', 'harvard']):
                                provider = line
                                break

                        # Price (better detection)
                        cost = extract_price(text, elem)

                        # Duration
                        duration = "Self-paced"
                        dur_match = re.search(r'(\d+)\s*(hour|week|month|day)s?', text, re.IGNORECASE)
                        if dur_match:
                            duration = dur_match.group(0)

                        courses.append({
                            'course_title': title,
                            'provider': provider,
                            'platform': 'Class Central',
                            'duration': duration,
                            'cost': cost,
                            'course_url': course_url,
                            'category': subject.replace('-', ' ').title(),
                            'country': 'International',
                            'source': 'Class Central'
                        })
                        page_added += 1

                    except:
                        continue

                print(f"→ {page_added} added")
                time.sleep(2)

            except Exception as e:
                print(f"Error: {str(e)[:30]}")
                continue

        total = len([c for c in courses if c['source'] == 'Class Central'])
        print(f" Total so far: {total}")

    return courses




def scrape_ousl(driver):
    """Scrape OUSL - All pages"""

    print("\n" + "=" * 80)
    print("SCRAPING OPEN UNIVERSITY OF SRI LANKA (All Pages)")
    print("=" * 80)

    courses = []
    page_num = 1

    while True:
        url = f"https://ou.ac.lk/find-a-programme/" + (f"?wpv_paged={page_num}" if page_num > 1 else "")
        print(f"\n  Page {page_num}...", end=" ")

        try:
            driver.get(url)
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            time.sleep(4)

            # Scroll
            for _ in range(3):
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(1)

            # Find course links
            h5_links = driver.find_elements(By.CSS_SELECTOR, "h5 a, h4 a, h3 a")
            prog_links = driver.find_elements(By.CSS_SELECTOR, "a[href*='/programme/']")

            all_links = list({elem.get_attribute('href'): elem for elem in h5_links + prog_links}.values())

            if not all_links:
                print("No more courses")
                break

            print(f"{len(all_links)} found", end=" ")
            page_added = 0

            for elem in all_links:
                try:
                    title = elem.text.strip()
                    link = elem.get_attribute('href')

                    if not title or len(title) < 10 or not link:
                        continue

                    # Categorize
                    cat = "General"
                    t = title.lower()
                    if any(w in t for w in ['computer', 'it', 'software', 'programming', 'web', 'data']):
                        cat = "IT & Technology"
                    elif any(w in t for w in ['business', 'management', 'mba', 'accounting', 'finance', 'marketing']):
                        cat = "Business & Management"
                    elif any(w in t for w in ['nursing', 'health', 'medical', 'pharmacy', 'counselling']):
                        cat = "Healthcare"
                    elif any(w in t for w in ['engineering', 'mechanical', 'civil', 'electrical']):
                        cat = "Engineering"
                    elif any(w in t for w in ['education', 'teaching', 'pedagogy']):
                        cat = "Education"
                    elif any(w in t for w in ['law', 'legal']):
                        cat = "Law"
                    elif any(w in t for w in ['science', 'mathematics', 'physics', 'chemistry', 'biology']):
                        cat = "Science"
                    elif any(w in t for w in ['english', 'language', 'linguistics']):
                        cat = "Languages"

                    courses.append({
                        'course_title': title,
                        'provider': 'OUSL',
                        'platform': 'OUSL',
                        'duration': 'Varies by program',
                        'cost': 'Contact OUSL',
                        'course_url': link,
                        'category': cat,
                        'country': 'Sri Lanka',
                        'source': 'Open University of Sri Lanka'
                    })
                    page_added += 1

                except:
                    continue

            print(f"→ {page_added} added")

            if page_added == 0 or page_num >= 10:  # Stop if no courses or max 10 pages
                break

            page_num += 1
            time.sleep(2)

        except:
            break

    total = len([c for c in courses if c['source'] == 'Open University of Sri Lanka'])
    print(f"\n Total OUSL courses foound: {total}")
    return courses


def scrape_uom(driver):
    """Scrape UoM Open Learning"""

    print("\n" + "=" * 80)
    print("SCRAPING UNIVERSITY OF MORATUWA")
    print("=" * 80)

    courses = []
    paths = [
        'fullstack-developer', 'python-programmer', 'web-developer',
        'data-scientist', 'software-tester', 'devops-professional',
        'mobile-developer', 'ux-professional', 'security-professional',
        'cloud-developer', 'project-management'
    ]

    for path in paths:
        try:
            driver.get(f"https://open.uom.lk/{path}.html")
            time.sleep(3)

            for link in driver.find_elements(By.CSS_SELECTOR, "a[href*='lms/course']"):
                try:
                    title = link.text.strip()
                    url = link.get_attribute('href')

                    if len(title) >= 10 and url:
                        courses.append({
                            'course_title': title,
                            'provider': 'University of Moratuwa',
                            'platform': 'UoM Open Learning',
                            'duration': 'Self-paced',
                            'cost': 'Free',
                            'course_url': url,
                            'category': 'IT & Technology',
                            'country': 'Sri Lanka',
                            'source': 'University of Moratuwa'
                        })
                except:
                    continue
        except:
            continue

    print(f"Total UoM courses: {len(courses)}")
    return courses



def scrape_all():
    """Main function to scrape all sources and compile data"""
    print("=" * 80)

    print("=" * 80 + "\n")

    input("Press Enter to start scraping...")

    driver = setup_driver()
    all_courses = []

    try:
        all_courses.extend(scrape_classcentral(driver))
        all_courses.extend(scrape_ousl(driver))
        all_courses.extend(scrape_uom(driver))
    finally:
        driver.quit()

    if all_courses:
        df = pd.DataFrame(all_courses)

        # Remove duplicates
        before = len(df)
        df = df.drop_duplicates(subset=['course_title', 'provider'], keep='first')

        # Save to current directory
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"courses_final_{timestamp}.csv"
        df.to_csv(filename, index=False, encoding='utf-8-sig')

        # Statistics
        print("\n" + "=" * 80)
        print("SCRAPING COMPLETE!")
        print("=" * 80)
        print(f"Total scraped: {before}")
        print(f"Duplicates removed: {before - len(df)}")
        print(f"Unique courses: {len(df)}")
        print(f"Saved to: {filename}")

        print("\nBY SOURCE:")
        print(df['source'].value_counts().to_string())

        print("\nBY COUNTRY:")
        print(df['country'].value_counts().to_string())

        free = df[df['cost'].str.contains('free|Free|FREE', case=False, na=False)].shape[0]
        paid = df[df['cost'].str.contains('paid|Paid|PAID', case=False, na=False)].shape[0]
        other = len(df) - free - paid

        print(f"\nPrices")
        print(f"   Free: {free} ({free / len(df) * 100:.2f}%)")
        print(f"   Paid: {paid} ({paid / len(df) * 100:.2f}%)")
        print(f"   Other/Check: {other} ({other / len(df) * 100:.2f}%)")

        print("\n (First 25):")
        print(df[['course_title', 'provider', 'cost', 'category']].head(25).to_string())

        return df

    print("\n No courses scraped!")
    return None


if __name__ == "__main__":
    scrape_all()