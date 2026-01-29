import requests
import time
import logging
import random
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry as UrlRetry

def fetch_with_retry(url, headers=None, retries=3, timeout=30):
    """Fetch URL with exponential backoff and connection pooling"""
    
    # Default headers that mimic a real browser
    default_headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
    }
    
    # Merge with provided headers
    if headers:
        default_headers.update(headers)
    
    # Create session with connection pooling
    session = requests.Session()
    
    # Configure retry strategy
    retry_strategy = UrlRetry(
        total=retries,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET", "HEAD"]
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    
    for attempt in range(retries):
        try:
            # Exponential backoff with jitter
            if attempt > 0:
                base_delay = min(2 ** attempt, 32)  # Cap at 32 seconds
                jitter = random.uniform(0, base_delay * 0.1)
                sleep_time = base_delay + jitter
                logging.warning(f"Retry {attempt}/{retries} for {url} after {sleep_time:.1f}s")
                time.sleep(sleep_time)
            
            res = session.get(url, headers=default_headers, timeout=timeout)
            res.raise_for_status()
            session.close()
            return res
            
        except requests.exceptions.ConnectionError as e:
            if attempt < retries - 1:
                logging.warning(f"Connection error (attempt {attempt+1}/{retries}): {e}")
            else:
                logging.error(f"Failed to fetch {url} after {retries} attempts: {e}")
                session.close()
                return None
        except requests.exceptions.Timeout as e:
            if attempt < retries - 1:
                logging.warning(f"Timeout error (attempt {attempt+1}/{retries}): {e}")
            else:
                logging.error(f"Timeout fetching {url} after {retries} attempts: {e}")
                session.close()
                return None
        except requests.exceptions.RequestException as e:
            if attempt < retries - 1:
                logging.warning(f"Request error (attempt {attempt+1}/{retries}): {e}")
            else:
                logging.error(f"Failed to fetch {url} after {retries} attempts: {e}")
                session.close()
                return None
    
    session.close()
    return None
