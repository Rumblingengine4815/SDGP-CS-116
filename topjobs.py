
from seleniumbase import SB
import pandas as pd
import time
from datetime import datetime
import re
import signal
import sys
from pathlib import Path

# Add project root to sys.path to allow importing utils
sys.path.append(str(Path(__file__).resolve().parent.parent.parent.parent))
from utils.data_handler import save_scraped_data


def save_jobs_optimized(all_jobs, prefix="topjobs_PARTIAL"):
    
    if not all_jobs:
        print("\nNo jobs to save")
        return None
    
    # Calculate absolute path to target directory
    project_root = Path(__file__).resolve().parent.parent.parent.parent
    target_path = project_root / "data" / "raw" / "jobs"
    
    filename = save_scraped_data(all_jobs, prefix, target_dir=target_path, keep_days=7)
    
    return pd.read_csv(filename)


def scrape_topjobs_optimized(max_pages=100):
  

    print("=" * 80)
    print("TOPJOBS OPTIMIZED SCRAPER")
    print("=" * 80)

    all_jobs = []
    seen_job_codes = set()  # Track what we've seen
    stop_requested = False

    def signal_handler(sig, frame):
        nonlocal stop_requested
        print("\nStop requested! Saving current progress...")
        stop_requested = True

    # Register Ctrl+C handler
    signal.signal(signal.SIGINT, signal_handler)

    with SB(uc=True, headless=True) as sb:  # Back to headless for speed

        for page in range(1, max_pages + 1):
            # Check if stop requested
            if stop_requested:
                print("\nStopping as requested...")
                break

            print(f"\nPage {page}/{max_pages}", end=" ")

            url = f"https://www.topjobs.lk/applicant/vacancybyfunctionalarea.jsp?jst=OPEN&page={page}"

            try:
                sb.open(url)
                time.sleep(4)

                # Get page source
                page_source = sb.get_page_source()

                # Find all job rows
                tr_pattern = r'<tr id="tr\d+"[^>]*onclick="createAlert\(\'([^\']+)\',\'([^\']+)\',\'([^\']+)\',\'([^\']+)\'[^>]*>(.*?)</tr>'
                matches = re.findall(tr_pattern, page_source, re.DOTALL)

                print(f"- Found {len(matches)} jobs", end=" - ")

                extracted = 0

                for match in matches:
                    try:
                        rid, ac, jc, ec, content = match

                        # Skip if already seen this job code
                        job_code_match = re.search(r'>(\d{7})', content)
                        job_code = job_code_match.group(1) if job_code_match else ""

                        if job_code in seen_job_codes:
                            continue

                        if job_code:
                            seen_job_codes.add(job_code)

                        # Extract title
                        title_match = re.search(r'<h2><span>([^<]+)</span></h2>', content)
                        if not title_match:
                            continue
                        title = title_match.group(1).strip()

                        # Extract company
                        company_match = re.search(r'<h1>([^<]+)</h1>', content)
                        company = company_match.group(1).strip() if company_match else "Unknown"

                        # Extract ALL text content from the row
                        text_content = re.sub(r'<[^>]+>', ' ', content)
                        text_content = re.sub(r'\s+', ' ', text_content).strip()

                        # Extract dates
                        date_pattern = r'(\w{3}\s+\w{3}\s+\d{2}\s+\d{4})'
                        dates = re.findall(date_pattern, content)
                        posted_date = dates[0] if len(dates) > 0 else ""
                        closing_date = dates[1] if len(dates) > 1 else ""

                        # Extract location - look for Sri Lankan cities
                        location = ""
                        locations = ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Matara', 'Negombo',
                                     'Jaffna', 'Batticaloa', 'Trincomalee', 'Kurunegala', 'Anuradhapura',
                                     'Ratnapura', 'Badulla', 'Kalutara', 'Nuwara Eliya', 'Ampara',
                                     'Hambantota', 'Polonnaruwa', 'Nugegoda', 'Dehiwala', 'Moratuwa',
                                     'Kotte', 'Maharagama', 'Battaramulla', 'Rajagiriya', 'Malabe']

                        for loc in locations:
                            if loc in text_content:
                                location = loc
                                break

                        # Build URL
                        job_url = f"https://www.topjobs.lk/employer/JobAdvertismentServlet?rid={rid}&ac={ac}&jc={jc}&ec={ec}"

                        job = {
                            'job_id': f"TJ-{job_code}" if job_code else f"TJ-{page}-{extracted}",
                            'title': title,
                            'company': company,
                            'location': location,
                            'posted_date': posted_date,
                            'closing_date': closing_date,
                            'job_code': job_code,
                            'job_url': job_url,
                            'source': 'TopJobs.lk',
                            'scraped_at': datetime.now().isoformat()
                        }

                        all_jobs.append(job)
                        extracted += 1

                    except:
                        continue

                print(f"Extracted {extracted} unique")

                if extracted == 0 and page > 5:
                    print("\n   Multiple pages with 0 new jobs, stopping")
                    break

                time.sleep(2)

            except Exception as e:
                print(f"Error: {str(e)[:50]}")
                time.sleep(3)
                continue

    print(f"\n{'=' * 80}")
    print(f"TOTAL UNIQUE JOBS: {len(all_jobs)}")
    print(f"{'=' * 80}")

    if all_jobs:
        # Save with appropriate prefix
        prefix = "topjobs_PARTIAL" if stop_requested else "topjobs_FINAL"
        df = save_jobs_optimized(all_jobs, prefix=prefix)

        # Statistics
        print("\n" + "=" * 80)
        print(" STATISTICS")
        print("=" * 80)
        print(f"Total unique jobs: {len(df)}")
        print(f"With location: {df['location'].ne('').sum()} ({df['location'].ne('').sum() / len(df) * 100:.1f}%)")
        print(
            f"With closing date: {df['closing_date'].ne('').sum()} ({df['closing_date'].ne('').sum() / len(df) * 100:.1f}%)")
        print(f"With job code: {df['job_code'].ne('').sum()} ({df['job_code'].ne('').sum() / len(df) * 100:.1f}%)")

        print(f"\nTop 15 Companies:")
        print(df['company'].value_counts().head(15).to_string())

        if df['location'].ne('').sum() > 0:
            print(f"\nTop 10 Locations:")
            print(df['location'].value_counts().head(10).to_string())

        print("\n" + "=" * 80)
        print("SAMPLE (First 10)")
        print("=" * 80)
        print(df[['title', 'company', 'location', 'closing_date']].head(10).to_string())

        return df

    return None


if __name__ == "__main__":
    print("\n TOPJOBS scraper")
    print("\n Press Ctrl+C at any time to stop and save progress!\n")

    pages = input("Pages? (default=4 for ~1,500 jobs): ").strip()
    pages = int(pages) if pages else 4

    print(f"\nStarting {pages} pages...")
    print(f"Estimated time: ~{pages * 2 / 60:.0f} minutes\n")

    df = scrape_topjobs_optimized(max_pages=pages)

    if df is not None:
        print("\n" + "=" * 80)
        print("Completed scraping!")
        print("=" * 80)
        print(f"\n You now have {len(df)} unique TopJobs job entries!")

    print("\nDone!")