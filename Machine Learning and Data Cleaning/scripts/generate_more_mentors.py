import json
import random
from pathlib import Path

# Sri Lankan Tech Companies
COMPANIES = [
    "PickMe", "WSO2", "99x", "Virtusa", "LSEG Technology", "MillenniumIT ESP",
    "Calcey Technologies", "Sysco LABS", "hSenid Mobile", "CodeGen International",
    "IFS", "Brandix", "John Keells Holdings", "Commercial Bank", "Sampath Bank",
    "Hatton National Bank", "Dialog Axiata", "SLT", "Mas Holdings", "Hayleys"
]

# Job Titles by Sector
SECTORS = {
    "Software Engineering": [
        "Software Engineer", "Senior Software Engineer", "Tech Lead", 
        "Engineering Manager", "Solutions Architect", "DevOps Engineer",
        "Full Stack Developer", "Backend Engineer", "Frontend Developer"
    ],
    "Data Science": [
        "Data Scientist", "Data Engineer", "ML Engineer", "Data Analyst",
        "Business Intelligence Analyst", "Analytics Manager"
    ],
    "Business": [
        "Product Manager", "Project Manager", "Business Analyst",
        "Marketing Manager", "HR Manager", "Operations Manager"
    ],
    "Engineering": [
        "Electrical Engineer", "Mechanical Engineer", "Civil Engineer",
        "Quantity Surveyor", "Project Engineer"
    ]
}

# Skills by Sector
SKILLS = {
    "Software Engineering": [
        ["Python", "Django", "PostgreSQL"],
        ["Java", "Spring Boot", "Microservices"],
        ["React", "Node.js", "MongoDB"],
        ["Kubernetes", "Docker", "AWS"],
        ["C#", ".NET", "Azure"],
        ["Go", "gRPC", "Redis"]
    ],
    "Data Science": [
        ["Python", "Pandas", "Scikit-Learn"],
        ["SQL", "BigQuery", "Tableau"],
        ["TensorFlow", "PyTorch", "MLOps"],
        ["PowerBI", "Excel", "Data Visualization"],
        ["Spark", "Hadoop", "Data Engineering"]
    ],
    "Business": [
        ["Agile", "Scrum", "JIRA"],
        ["Product Strategy", "Roadmapping", "Stakeholder Management"],
        ["Market Research", "SEO", "Digital Marketing"],
        ["Leadership", "Team Building", "Communication"],
        ["Excel", "PowerPoint", "Data Analysis"]
    ],
    "Engineering": [
        ["AutoCAD", "Revit", "SolidWorks"],
        ["Project Management", "Construction Safety", "Quality Control"],
        ["Circuit Design", "PCB Design", "Embedded Systems"],
        ["Structural Analysis", "Civil 3D", "Cost Estimation"]
    ]
}

# Bio templates
BIOS = [
    "Passionate about mentoring the next generation of tech leaders.",
    "Focused on career guidance for young professionals.",
    "Helping students bridge the gap between academia and industry.",
    "Expert in digital transformation and agile methodologies.",
    "10+ years of industry experience in building scalable systems.",
    "Committed to empowering aspiring professionals through mentorship."
]

# Sri Lankan names
FIRST_NAMES = ["Saman", "Kumari", "Priya", "Ramesh", "Dilshan", "Nadeesha", 
               "Aisha", "Kavindu", "Shehan", "Tharindu", "Nimal", "Chamara"]
LAST_NAMES = ["Silva", "Fernando", "Perera", "Wijesinghe", "Gunawardena", 
              "Jayawardena", "De Silva", "Ranasinghe", "Dissanayake"]

def generate_mentor(mentor_id):
    """Generate a single mentor profile"""
    sector = random.choice(list(SECTORS.keys()))
    title = random.choice(SECTORS[sector])
    company = random.choice(COMPANIES)
    name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
    expertise = random.choice(SKILLS[sector])
    bio = random.choice(BIOS)
    
    return {
        "id": f"mentor_{mentor_id:03d}",
        "name": name,
        "title": title,
        "company": company,
        "sector": sector,
        "bio": bio,
        "expertise": expertise,
        "availability": "Weekends",
        "contact": f"mentor{mentor_id}@{company.lower().replace(' ', '')}.com"
    }

def main():
    """Generate 50 mentors"""
    mentors = []
    
    # Generate 50 unique mentors
    for i in range(1, 51):
        mentors.append(generate_mentor(i))
    
    # Save to file
    output_path = Path(__file__).parent.parent / "data" / "processed" / "mentors.json"
    
    with open(output_path, 'w') as f:
        json.dump(mentors, f, indent=2)
    
    print(f"Generated {len(mentors)} mentors")
    print(f"Saved to: {output_path}")
    
    # Print summary
    sector_counts = {}
    for mentor in mentors:
        sector = mentor['sector']
        sector_counts[sector] = sector_counts.get(sector, 0) + 1
    
    print("\nMentor Distribution:")
    for sector, count in sorted(sector_counts.items()):
        print(f"  - {sector}: {count}")

if __name__ == "__main__":
    main()
