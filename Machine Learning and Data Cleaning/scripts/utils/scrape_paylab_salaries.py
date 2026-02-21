"""
Paylab.com Salary Scraper - One-time data collection
Scrapes salary data from Paylab Sri Lanka for all IT and business roles
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
from pathlib import Path
import re

# Categories to scrape
CATEGORIES = {
    "information-technology": "Information Technology",
    "management": "Management",
    "economy-finance-accountancy": "Economy Finance Accountancy",
    "marketing-advertising-pr": "Marketing Advertising PR",
    "human-resources": "Human Resources",
    "construction-real-estate": "Construction Real Estate",
    "electrical-power-engineering": "Electrical Power Engineering",
    "mechanical-engineering": "Mechanical Engineering",
    "medicine-social-care": "Medicine Social Care",
    "education-science-research": "Education Science Research",
    "customer-support": "Customer Support",
    "commerce": "Commerce",
    "arts-culture": "Arts Culture",
    "journalism-printing-arts-media": "Journalism Printing Arts Media"
}

BASE_URL = "https://www.paylab.com/lk/salaryinfo"

def parse_salary_range(salary_text):
    """
    Extract min, avg, max from salary text like '57,012 - 233,871 LKR'
    """
    try:
        # Remove LKR and whitespace
        salary_text = salary_text.replace('LKR', '').replace(',', '').strip()
        
        # Split by dash
        parts = salary_text.split('-')
        
        if len(parts) == 2:
            min_sal = int(parts[0].strip())
            max_sal = int(parts[1].strip())
            avg_sal = (min_sal + max_sal) // 2
            return min_sal, avg_sal, max_sal
    except Exception as e:
        print(f"Error parsing salary: {salary_text} - {e}")
    
    return None, None, None

def extract_description(li_elements):
    """Extract job description from <li> elements"""
    if not li_elements:
        return ""
    
    # Get first 3 bullet points
    descriptions = []
    for li in li_elements[:3]:
        text = li.get_text(strip=True)
        if text:
            descriptions.append(text)
    
    return " ".join(descriptions)

def scrape_category(category_slug, category_name):
    """Scrape all jobs from a category"""
    url = f"{BASE_URL}/{category_slug}"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    print(f"\nScraping {category_name}...")
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        jobs = []
        
        # Find all job listing rows
        # Based on HTML: <a href="..." class="numbered-link">
        job_links = soup.find_all('a', class_='numbered-link')
        
        for link in job_links:
            try:
                # Extract job title from first <div class="col">
                title_div = link.find('div', class_='col')
                if not title_div:
                    continue
                
                job_title = title_div.get_text(strip=True)
                
                # Extract salary from <span style="white-space: nowrap;">
                salary_span = link.find('span', style=lambda x: x and 'white-space' in x)
                
                if salary_span:
                    salary_text = salary_span.get_text(strip=True)
                    min_sal, avg_sal, max_sal = parse_salary_range(salary_text)
                    
                    if avg_sal:
                        # Extract description from <ul><li> elements
                        ul_element = link.find('ul')
                        li_elements = ul_element.find_all('li') if ul_element else []
                        description = extract_description(li_elements)
                        
                        jobs.append({
                            'job_title': job_title,
                            'paylab_category': category_name,
                            'min_salary_lkr': min_sal,
                            'avg_salary_lkr': avg_sal,
                            'max_salary_lkr': max_sal,
                            'description': description,
                            'source': 'paylab.com'
                        })
                        
                        print(f"  ✓ {job_title}: {avg_sal:,} LKR")
            
            except Exception as e:
                print(f"  ✗ Error parsing job: {e}")
                continue
        
        print(f"  Found {len(jobs)} jobs in {category_name}")
        return jobs
    
    except Exception as e:
        print(f"  ✗ Error scraping {category_name}: {e}")
        return []

def main():
    """Main scraping function"""
    print("=" * 60)
    print("Paylab.com Salary Scraper - Sri Lanka")
    print("=" * 60)
    
    all_jobs = []
    
    for category_slug, category_name in CATEGORIES.items():
        jobs = scrape_category(category_slug, category_name)
        all_jobs.extend(jobs)
        
        # Respectful rate limiting (5 seconds between requests)
        time.sleep(5)
    
    # Save to CSV
    if all_jobs:
        df = pd.DataFrame(all_jobs)
        
        # Sort by average salary (descending)
        df = df.sort_values('avg_salary_lkr', ascending=False)
        
        # Save to config directory
        output_path = Path(__file__).parent.parent / "data" / "config" / "paylab_salary_mapping_full.csv"
        df.to_csv(output_path, index=False)
        
        print("\n" + "=" * 60)
        print(f"Scraping Complete!")
        print(f"Total jobs scraped: {len(all_jobs)}")
        print(f"Saved to: {output_path}")
        print("=" * 60)
        
        # Print summary statistics
        print("\nTop 10 Highest Paying Roles:")
        print(df[['job_title', 'avg_salary_lkr']].head(10).to_string(index=False))
        
        print("\nCategory Distribution:")
        print(df['paylab_category'].value_counts().to_string())
    
    else:
        print("\nNo jobs scraped. Check your internet")

if __name__ == "__main__":
    main()
