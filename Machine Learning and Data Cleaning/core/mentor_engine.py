class MentorEngine:
    @staticmethod
    def recommend_mentor(target_role: str):
        target = str(target_role).lower()
        if "data" in target or "machine learning" in target or "ai" in target:
            return {
                "mentor_title": "Senior Data Scientist (Python, ML, Statistics)",
                "key_skills": ["Python", "TensorFlow", "SQL", "Cloud Architecture"],
                "why_this_mentor": "Matches your trajectory in data-centric roles and can guide your portfolio toward production ML deployments."
            }
        elif "software" in target or "developer" in target or "engineer" in target or "programmer" in target:
            return {
                "mentor_title": "Lead Software Engineer (System Design, Scalability)",
                "key_skills": ["System Design", "Microservices", "CI/CD", "Backend Architecture"],
                "why_this_mentor": "Perfect for leveling up your software engineering foundation into enterprise scalability."
            }
        elif "security" in target or "cyber" in target or "infosec" in target:
            return {
                "mentor_title": "Cybersecurity Consultant (Penetration Testing, SOC)",
                "key_skills": ["Network Security", "Ethical Hacking", "Cryptography", "Compliance"],
                "why_this_mentor": "Will help you bridge the gap between theoretical knowledge and offensive/defensive operations."
            }
        elif "design" in target or "ui/ux" in target or "figma" in target:
            return {
                "mentor_title": "Principal Product Designer (UX Strategy, Figma)",
                "key_skills": ["User Research", "Wireframing", "Interaction Design", "Prototyping"],
                "why_this_mentor": "Ideal for helping you compose a high-converting creative portfolio and user-centric workflows."
            }
        elif "finance" in target or "account" in target or "audit" in target:
            return {
                "mentor_title": "Director of Finance (FP&A, Auditing, Corporate Strategy)",
                "key_skills": ["Financial Modeling", "Corporate Auditing", "CIMA/CA pathways", "Risk Management"],
                "why_this_mentor": "Essential for guiding you through the complex corporate finance and accounting accreditations."
            }
        else:
            return {
                "mentor_title": "Senior Industry Executive (Strategy & Innovation)",
                "key_skills": ["Business Strategy", "Leadership", "Agile Management", "Communication"],
                "why_this_mentor": "A critical resource for high-level vertical progression and horizontal pivoting in your specific sector."
            }
