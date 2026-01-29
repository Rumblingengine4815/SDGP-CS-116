

from seleniumbase import SB
import pandas as pd
import time
from datetime import datetime
import re
import sys
from pathlib import Path

# Add project root to sys.path to allow importing utils
sys.path.append(str(Path(__file__).resolve().parent.parent.parent.parent))
from utils.data_handler import save_scraped_data


def scrape_all_categories(max_pages_per_category=3):


    job_categories = {
        # TECH JOBS
        "Software Engineering": [
            "software engineer",
            "software developer",
            "full stack developer",
            "backend developer",
            "frontend developer",
            "mobile developer",
            "web developer",
            "developer"
        ],
        "Data & AI": [
            "data analyst",
            "data scientist",
            "business intelligence",
            "data engineer",
            "machine learning",
            "AI "
        ],
        "IT & Infrastructure": [
            "DevOps engineer",
            "system administrator",
            "network engineer",
            "IT support",
            "cloud engineer",
            "cybersecurity"
        ],
        "QA & Testing": [
            "QA engineer",
            "test engineer",
            "quality assurance"
        ],
        "UI/UX": [
            "UI designer",
            "UX designer",
            "graphic designer"
        ],

        # BUSINESS JOBS
        "Business & Product": [
            "business analyst",
            "product manager",
            "project manager",
            "business development",
            "consultant"
        ],

        # SALES & MARKETING
        "Sales": [
            "sales executive",
            "sales manager",
            "sales representative",
            "account manager"
        ],
        "Marketing": [
            "marketing manager",
            "digital marketing",
            "content marketing",
            "social media manager",
            "SEO specialist"
        ],

        # FINANCE & ACCOUNTING
        "Finance & Accounting": [
            "accountant",
            "financial analyst",
            "finance manager",
            "auditor",
            "accounts executive"
        ],

        # HR & ADMIN
        "HR & Admin": [
            "HR manager",
            "HR executive",
            "recruiter",
            "administrative officer",
            "office administrator"
        ],

        # CUSTOMER SERVICE
        "Customer Service": [
            "customer service",
            "customer support",
            "call center",
            "customer care"
        ],

        # OPERATIONS
        "Operations": [
            "operations manager",
            "supply chain",
            "logistics coordinator",
            "warehouse manager"
        ],

        # ENGINEERING (Non-IT)
        "Engineering": [
            "civil engineer",
            "mechanical engineer",
            "electrical engineer",
            "industrial engineer"
        ],

        # HEALTHCARE
        "Healthcare": [
            "nurse",
            "pharmacist",
            "medical officer",
            "healthcare"
        ],

        # EDUCATION
        "Education": [
            "teacher",
            "lecturer",
            "trainer",
            "education"
        ],

        # OTHER
        "Management": [
            "manager",
            "executive",
            "supervisor",
            "chef"
        ]
    }

    print("=" * 80)
    print("XPRESSJOBS - ALL CATEGORIES")
    print("=" * 80)
    print(f"Categories to scrape: {len(job_categories)}")
    print(f"Total search terms: {sum(len(terms) for terms in job_categories.values())}")
    print(f"Pages per category: {max_pages_per_category}")
    print("=" * 80)

    all_jobs = []
    total_scraped = 0
    category_count = 0

    with SB(uc=True, headless=True) as sb:

        for category, search_terms in job_categories.items():
            category_count += 1
            print(f"\n{'=' * 80}")
            print(f"[{category_count}/{len(job_categories)}] CATEGORY: {category}")
            print(f"{'=' * 80}")

            category_jobs = []

            for search_term in search_terms:
                print(f"\nSearching: {search_term}")

                term_jobs = []

                for page in range(1, max_pages_per_category + 1):
                    try:
                        url = f"https://xpress.jobs/jobs?KeyWord={search_term.replace(' ', '%20')}&page={page}"

                        sb.open(url)
                        sb.sleep(5)

                        sb.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                        sb.sleep(8)

                       
                        links = sb.find_elements("a[href*='/jobs/view/'], a[href*='/Jobs/View']")

                        if not links:
                            if page == 1:
                                print(f"Page {page}: No jobs found")
                            break

                        print(f"Page {page}: Found {len(links)} listings", end="")

                        seen_urls = set()
                        page_count = 0

                        for link in links:
                            try:
                                job_url = link.get_attribute('href')

                                if job_url in seen_urls:
                                    continue
                                seen_urls.add(job_url)

                                # Get text
                                title_text = link.text.strip()

                                if not title_text or len(title_text) < 5:
                                    continue

                                # Create job entry
                                job = {
                                    'raw_title': title_text,
                                    'job_url': job_url if job_url.startswith(
                                        'http') else f"https://xpress.jobs{job_url}",
                                    'category': category,
                                    'search_term': search_term,
                                    'scraped_date': datetime.now().strftime('%Y-%m-%d')
                                }

                                term_jobs.append(job)
                                page_count += 1

                            except Exception as e:
                                continue

                        print(f" → Extracted {page_count}")

                        if page_count == 0:
                            break

                        time.sleep(5)

                    except Exception as e:
                        print(f" Error on page {page}: {str(e)[:60]}")
                        break

                if term_jobs:
                    category_jobs.extend(term_jobs)
                    print(f"Total for '{search_term}': {len(term_jobs)}")
                else:
                    print(f" No jobs for '{search_term}'")

                time.sleep(1)

            if category_jobs:
                all_jobs.extend(category_jobs)
                total_scraped += len(category_jobs)
                print(f"\n   Category '{category}' total: {len(category_jobs)} jobs")

            # Brief pause between categories
            time.sleep(2)

    print("\n" + "=" * 80)
    print("SCRAPING COMPLETE")
    print("=" * 80)
    print(f"Total jobs scraped: {total_scraped}")

    if all_jobs:
        # Create DataFrame
        df = pd.DataFrame(all_jobs)

        # Remove duplicates by URL
        initial_count = len(df)
        df = df.drop_duplicates(subset=['job_url'], keep='first')
        duplicates_removed = initial_count - len(df)

        print(f"Duplicates removed: {duplicates_removed}")
        print(f"Unique jobs: {len(df)}")

        # Calculate absolute path to target directory
        project_root = Path(__file__).resolve().parent.parent.parent.parent
        target_path = project_root / "data" / "raw" / "jobs"

        

        # Clean the data automatically
        print("\n" + "=" * 80)
        print("CLEANING DATA")
        print("=" * 80)

        cleaned_df = clean_job_data(df)
        cleaned_filename = save_scraped_data(cleaned_df, "xpressjobs_ALL_CATEGORIES_CLEAN", target_dir=target_path, keep_days=7)
        print(f" Cleaned data saved to: {cleaned_filename}")

       
        print("\n" + "=" * 80)
        print("STATISTICS")
        print("=" * 80)

        print("\nJobs by Category:")
        print(cleaned_df['category'].value_counts().to_string())

        print("\nTop Job Titles:")
        if 'title' in cleaned_df.columns:
            print(cleaned_df['title'].value_counts().head(20).to_string())

        print("\nTop Companies:")
        if 'company' in cleaned_df.columns:
            companies = cleaned_df['company'].dropna()
            if len(companies) > 0:
                print(companies.value_counts().head(15).to_string())

        print("\n" + "=" * 80)
        print(f"TOTAL UNIQUE JOBS: {len(cleaned_df)}")
        print("=" * 80)

        return cleaned_df
    else:
        print(" No jobs scraped were scraped")
        return None


def clean_job_data(df):
  
    cleaned_jobs = []

    sri_lanka_locations = [
        "Colombo", "Kandy", "Galle", "Jaffna",
        "Kurunegala", "Gampaha", "Nugegoda",
        "Dehiwala", "Maharagama", "Malabe",
        "Battaramulla", "Kotte", "Rajagiriya"
    ]

    for _, row in df.iterrows():
        try:
            text = str(row['raw_title']).strip()
            text = re.sub(r'\s+', ' ', text)

            original_text = text

            
            # Removing APPLY NOW first
           
            text = re.sub(r'APPLY NOW', '', text, flags=re.IGNORECASE)

            
            # Get Days Left for the Job entity
          
            days_match = re.search(r'(\d+\s+days?\s+left)', text, re.IGNORECASE)
            days_left = days_match.group(1) if days_match else None
            text = re.sub(r'\d+\s+days?\s+left', '', text, flags=re.IGNORECASE)

            # Extract Job Type
            
            job_type = None
            if re.search(r'Full[- ]?Time', text, re.IGNORECASE):
                job_type = "Full-Time"
            elif re.search(r'Part[- ]?Time', text, re.IGNORECASE):
                job_type = "Part-Time"
            elif re.search(r'Contract', text, re.IGNORECASE):
                job_type = "Contract"
            elif re.search(r'Intern', text, re.IGNORECASE):
                job_type = "Internship"

            text = re.sub(r'Full[- ]?Time|Part[- ]?Time|Contract|Intern(ship)?',
                          '', text, flags=re.IGNORECASE)

            # -------------------------
            # Extract Location
            # -------------------------
            location = None
            for loc in sri_lanka_locations:
                if re.search(rf'\b{loc}\b', text):
                    location = loc
                    text = re.sub(rf'\b{loc}\b', '', text)
                    break

            # -------------------------
            # Extract Title (before first "|")
            # -------------------------
            if "|" in original_text:
                title = original_text.split("|")[0].strip()
            else:
                # fallback
                title = text.split("  ")[0].strip()

            title = re.sub(r'\s+', ' ', title)

            # Extract Seniority Level
            
            level = None
            if re.search(r'\bSenior\b|\bLead\b|\bPrincipal\b|\bManager\b|\bHead\b', title, re.IGNORECASE):
                level = "Senior"
            elif re.search(r'\bJunior\b|\bAssociate\b|\bAssistant\b', title, re.IGNORECASE):
                level = "Junior"
            elif re.search(r'\bIntern\b', title, re.IGNORECASE):
                level = "Intern"
            else:
                level = "Mid"

            
            # Extract Company
            # After removing known elements
           
            remaining = original_text

            remaining = remaining.replace(title, "")
            remaining = re.sub(r'\d+\s+days?\s+left', '', remaining, flags=re.IGNORECASE)
            remaining = re.sub(r'Full[- ]?Time|Part[- ]?Time|Contract|Intern(ship)?|APPLY NOW',
                               '', remaining, flags=re.IGNORECASE)

            for loc in sri_lanka_locations:
                remaining = re.sub(rf'\b{loc}\b', '', remaining)

            remaining = re.sub(r'\|', '', remaining)
            remaining = re.sub(r'\s+', ' ', remaining).strip()

            # Extract company as longest phrase
            company_match = re.search(r'([A-Z][A-Za-z0-9&().,\s\-]{4,})', remaining)
            company = company_match.group(1).strip() if company_match else None

            cleaned_jobs.append({
                'title': title,
                'company': company,
                'location': location,
                'job_type': job_type,
                'days_left': days_left,
                'level': level,
                'job_url': row['job_url'],
                'category': row['category'],
                'search_term': row['search_term'],
                'scraped_date': row['scraped_date']
            })

        except:
            continue

    cleaned_df = pd.DataFrame(cleaned_jobs)

    # Remove weak rows
    cleaned_df = cleaned_df.dropna(subset=['title'])
    cleaned_df = cleaned_df[cleaned_df['title'].str.len() > 3]

    # Remove duplicates properly
    cleaned_df = cleaned_df.drop_duplicates(subset=['job_url'])

    return cleaned_df


if __name__ == "__main__":
    print("\n" + "=" * 80)
    print("XPRESSJOBS web scraper")
    print("=" * 80)

    try:
        pages_input = input("\nPages per category (default=3): ").strip()
        max_pages = int(pages_input) if pages_input else 3

        if max_pages <= 0:
            raise ValueError("Pages must be greater than 0")

    except ValueError:
        print("Invalid input. Using default value: 3 pages.")
        max_pages = 3
    
    except KeyboardInterrupt:
        print("\n\ Scraping interrupted by user (Ctrl+C).")
        print(" Exiting...")

    print(f"\nStarting FULL scrape with {max_pages} page(s) per category...\n")

    result = scrape_all_categories(max_pages_per_category=max_pages)

    if result is not None and not result.empty:
        print("\n Scraping completed successfully.")
        print(f" Final dataset size: {len(result)} jobs")
    else:
        print("\n No data scraped.")

    print("\n Complete!")
