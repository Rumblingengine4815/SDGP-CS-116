import json
import sys

def deduplicate_mentors(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            mentors = json.load(f)
            
        print(f"Original mentor count: {len(mentors)}")
        
        seen_names = set()
        deduplicated = []
        
        for mentor in mentors:
            # We want to keep unique names.
            # Convert to lower to catch slight variations
            name_key = mentor.get('name', '').strip().lower()
            
            if name_key not in seen_names:
                seen_names.add(name_key)
                deduplicated.append(mentor)
                
        print(f"Deduplicated mentor count: {len(deduplicated)}")
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(deduplicated, f, indent=2, ensure_ascii=False)
            
        print("Successfully deduplicated mentors.")
        
    except Exception as e:
        print(f"Error deduplicating mentors: {e}")
        sys.exit(1)

if __name__ == "__main__":
    filepath = "c:/Users/User/Desktop/Second Year Stuff/sdgp/PathFinder+/Adjusted_Scraper/project_root/Machine Learning and Data Cleaning/data/processed/mentors.json"
    deduplicate_mentors(filepath)
