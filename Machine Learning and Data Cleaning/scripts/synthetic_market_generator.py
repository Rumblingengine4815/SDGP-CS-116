
import json
import random
import csv
from pathlib import Path
from datetime import datetime, timedelta

# Synthetic mentor profiles for now since we can't find actual real multiple mentors
SRI_LANKAN_COMPANIES = [
    "WSO2", "IFS", "Virtusa", "99x", "Pearson Lanka", "Sysco LABS", "MillenniumIT ESP",
    "John Keells Octave", "Dialog Axiata", "Mobitel", "Hemas Holdings", "Mas Holdings",
    "Brandix", "Commercial Bank", "Sampath Bank", "Hatton National Bank", "LSEG Technology",
    "Creative Software", "Gapstars", "Calcey Technologies", "PickMe"
]

ROLES = {
    "Software Engineering": ["Software Engineer", "Senior Software Engineer", "Tech Lead", "Associate Architect", "QA Engineer"],
    "Data Science": ["Data Analyst", "Data Scientist", "Machine Learning Engineer", "BI Analyst", "Data Engineer"],
    "Business": ["Business Analyst", "Product Manager", "Project Manager", "Marketing Executive", "Digital Marketing Manager"],
    "Engineering": ["Civil Engineer", "Electrical Engineer", "Mechanical Engineer", "Quantity Surveyor"]
}

SKILLS_POOL = {
    "Software Engineering": ["Python", "Java", "React", "Node.js", "AWS", "Docker", "Kubernetes", "C#", ".NET", "SQL"],
    "Data Science": ["Python", "Pandas", "Scikit-Learn", "TensorFlow", "SQL", "Tableau", "PowerBI", "Excel", "BigQuery"],
    "Business": ["JIRA", "Excel", "PowerPoint", "Communication", "Leadership", "Agile", "Scrum", "Market Research", "SEO"],
    "Engineering": ["AutoCAD", "Revit", "SolidWorks", "Project Management", "Construction Safety", "Circuit Design"]
}

MENTOR_BIOS = [
    "Passionate about mentoring the next generation of tech leaders.",
    "10+ years of industry experience in building scalable systems.",
    "Helping students bridge the gap between academia and industry.",
    "Expert in digital transformation and agile methodologies.",
    "Focused on career guidance for young professionals."
]

FIRST_NAME_LIST = ["Kavindu", "Shehan", "Dilshan", "Nadeesha", "Ramesh", "Aisha", "Saman", "Kumari", "Rajiv", "Priya"]
LAST_NAME_LIST = ["Fernando", "Perera", "Silva", "Gunawardena", "Wijesinghe", "Ranasinghe", "Jayawardena", "De Silva", "Fernando", "Perera"]

def generate_mentors(output_path, count=15):
    mentors = []
    
    for i in range(count):
        sector = random.choice(list(ROLES.keys()))
        role = random.choice(ROLES[sector])
        company = random.choice(SRI_LANKAN_COMPANIES)
        first_name = random.choice(FIRST_NAME_LIST)
        last_name = random.choice(LAST_NAME_LIST)
        
        mentor = {
            "id": f"mentor_{i+1:03d}",
            "name": f"{first_name} {last_name}", # random name combinations
            "title": role,
            "company": company,
            "sector": sector,
            "bio": random.choice(MENTOR_BIOS),
            "expertise": random.sample(SKILLS_POOL[sector], 3),
            "availability": "Weekends",
            "contact": f"mentor{i+1}@{company.lower().replace(' ', '')}.com"
        }
        mentors.append(mentor)
        
    with open(output_path, 'w') as f:
        json.dump(mentors, f, indent=2)
    print(f"Generated {count} synthetic mentors at {output_path}")

def generate_job_descriptions(output_path, count=50):
    jobs = []
    headers = ["title", "company", "description", "category", "location", "date", "url"]
    
    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        
        for _ in range(count):
            sector = random.choice(list(ROLES.keys()))
            role = random.choice(ROLES[sector])
            company = random.choice(SRI_LANKAN_COMPANIES)
            skills = ", ".join(random.sample(SKILLS_POOL[sector], 4))
            
            # Rich Description Generation like LinkedIn Job
            desc = f"""
            **Job Title:** {role}
            **Company:** {company}
            
            **About Us:**
            {company} is a leading organization in Sri Lanka with worldwide clients looking for talented individuals to join our {sector} team.
            
            **Key Responsibilities:**
            - Work on challenging projects using modern technologies.
            - Collaborate with cross-functional teams.
            - Delivering high-quality solutions.
            
            **Requirements:**
            - Experience with {skills}.
            - Strong problem-solving skills.
            - Good communication and teamwork.
            
            **How to Apply:**
            Send your CV to careers@{company.lower().replace(' ', '')}.com
            """
            
            jobs.append([
                role,
                company,
                desc,
                sector,
                "Colombo, Sri Lanka",
                (datetime.now() - timedelta(days=random.randint(0, 30))).strftime("%Y-%m-%d"),
                f"https://www.linkedin.com/jobs/view/{random.randint(1000000, 9999999)}"
            ])
            
        writer.writerows(jobs)
    print(f" Generated {count} synthetic jobs at {output_path}")

if __name__ == "__main__":
    # save to the main ml data directory in processed
    base_path = Path(__file__).parent.parent / "Machine Learning and Data Cleaning" / "data" / "processed"
    base_path.mkdir(parents=True, exist_ok=True)
    
    generate_mentors(base_path / "mentors.json")
    generate_job_descriptions(base_path / "synthetic_jobs.csv")

