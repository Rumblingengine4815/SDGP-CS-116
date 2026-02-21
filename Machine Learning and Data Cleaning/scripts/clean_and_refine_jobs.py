import pandas as pd
import re
import unicodedata
from pathlib import Path

# Load ESCO skills for extraction
def load_esco_skills(esco_path):
    try:
        df = pd.read_csv(esco_path)
        return set(df['preferredLabel'].str.lower().tolist())
    except Exception as e:
        print(f"Warning: Could not load ESCO skills from {esco_path}: {e}")
        return set()

def extract_skills_from_text(text, skill_set):
    if not isinstance(text, str): return ""
    found = []
    text_lower = text.lower()
    # Simple check for now - can be optimized
    for skill in skill_set:
        # Check for whole word match to avoid substrings like 'c' in 'cat'
        if f" {skill} " in f" {text_lower} ": 
            found.append(skill.title())
    return ",".join(found)

def is_english_or_common(text):
    
    #Checks if a string is primarily English/ASCII.
    
    if not isinstance(text, str) or not text.strip():
        return False
    
    # Remove common Sri Lankan job site noise
    text = re.sub(r'MEMBER[A-Z].*', '', text)
    text = re.sub(r'Rs \d+.*', '', text)

    try:
        # If encoding/decoding as ascii works, it's safe
        text.encode('ascii')
        return True
    except UnicodeEncodeError:
        # If it has non-ascii, check for Sinhala block (U+0D80 to U+0DFF)
        for char in text:
            if '\u0d80' <= char <= '\u0dff':
                return False
        # Also check for the specific 'à' sequence common in the mojibake seen
        if 'à' in text and ('¶' in text or '·' in text):
            return False
        
        # Counting and comparing ascii
        non_ascii = len([c for c in text if ord(c) > 127])
        if non_ascii / len(text) > 0.2: # More than 20% is junk
            return False
            
    return True

def clean_job_title(text):
    if not isinstance(text, str): return ""
    
    text = unicodedata.normalize("NFKD", text)
   # Similar noise patterns for ikman
    noise_patterns = [
        r'Fairmax International.*',
        r'Grace International.*',
        r'SIYALAKA \(PVT\) LTD.*',
        r'Emperor Cafe.*',
        r'Part Time Jobs Holdings.*',
        r'DINSARA.*',
        r'SPAR Sri Lanka.*',
        r'Uber Affiliate.*',
        r'TACO BELL.*',
        r'Rs [\d,]+.*',
        r'MEMBER.*',
        r'\d+ (minutes|hour|hours|day|days) ago',
        r'\d+ (minutes|hour|hours|day|days)',
        r'FEATURED',
    ]
    
    clean_text = text
    for pattern in noise_patterns:
        clean_text = re.sub(pattern, '', clean_text, flags=re.IGNORECASE)
    
    clean_text = clean_text.encode("ascii", "ignore").decode("utf-8")
    
    # Cleanup dashes and whitespace
    clean_text = re.sub(r'\s*-\s*', ' - ', clean_text)
    clean_text = re.sub(r'\s+', ' ', clean_text).strip()
    
    return clean_text

def process_file(file_path):
    print(f"Reading {file_path}...")
    df = pd.read_csv(file_path)
    initial_count = len(df)
    
    # Step 1: Filter out rows that are clearly Sinhala or Mojibake in the title
    if 'title' in df.columns:
        df = df[df['title'].apply(is_english_or_common)]
        print(f"Rows after language filter: {len(df)} (Removed {initial_count - len(df)})")
        
        # Step 2: Clean the remaining titles
        df['title'] = df['title'].apply(clean_job_title)
        
        # Step 3: Remove rows that became empty or too short
        df = df[df['title'].str.len() > 6]
    
    # Step 4: Final Deduplication
    dedupe_cols = ['title', 'company', 'location']
    dedupe_cols = [c for c in dedupe_cols if c in df.columns]
    
    df = df.drop_duplicates(subset=dedupe_cols, keep='first')

    # Step 5: Extract Skills (if missing)
    if 'extracted_skills' not in df.columns or df['extracted_skills'].isna().mean() > 0.5:
        print("Extracting skills from descriptions (this may take a while)...")
        esco_path = file_path.parent.parent / "raw/esco/skills_en.csv"
        skill_set = load_esco_skills(esco_path)
        
        if skill_set:
            # Fallback basics if ESCO fails or is too specific
            basic_tech = {"python", "java", "sql", "javascript", "react", "node.js", 
                          "c++", "c#", "aws", "docker", "communication", "leadership", 
                          "agile", "scrum", "excel", "project management", "sales"}
            skill_set.update(basic_tech)
            
            # Use apply with a progress indicator if possible, else just apply
            df['extracted_skills'] = df['description'].apply(lambda x: extract_skills_from_text(x, skill_set))
            print("Skill extraction complete.")
        else:
            print("Skipping extraction due to missing ESCO data.")

    final_count = len(df)
    print(f"Final cleaned count: {final_count} (Total removed: {initial_count - final_count})")
    
    # Save back to a cleaned master file
    output_path = file_path.parent / "all_jobs_master_cleaned.csv"
    df.to_csv(output_path, index=False)
    print(f"Saved to {output_path}")
    return output_path

if __name__ == "__main__":
    # Use relative path from the script's location
    current_dir = Path(__file__).parent
    target = current_dir / "../data/processed/all_jobs_master.csv"
    
    if target.exists():
        process_file(target)
    else:
        print(f"Error: File not found at {target.resolve()}")
