import json

class ProfileEngine:
    @staticmethod
    def compute_profile_completion(user_profile):
        score = 0
        total = 4
        
        if not user_profile:
            return 0
            
        if getattr(user_profile, 'cv_uploaded', False): score += 1
        if getattr(user_profile, 'quiz_completed', False): score += 1
        if getattr(user_profile, 'skills_extracted', False): score += 1
        if getattr(user_profile, 'job_matches_generated', False): score += 1
        
        return int((score / total) * 100)

    @staticmethod
    def generate_message(user_profile):
        if not user_profile:
            return "Create an account and complete your profile to unlock your personalized roadmap."
            
        cv_up = getattr(user_profile, 'cv_uploaded', False)
        quiz_up = getattr(user_profile, 'quiz_completed', False)
        jobs_gen = getattr(user_profile, 'job_matches_generated', False)
        state = getattr(user_profile, 'state', "NEW")
        
        if not cv_up and not quiz_up:
            return "Upload your CV or take the Quiz to unlock your personalized career roadmap."
            
        if (cv_up or quiz_up) and state == "ANALYZED" and not jobs_gen:
            return "Analyzing your profile vectors to generate specialized job matches..."
            
        if jobs_gen or state == "MATCHED":
            return "Your personalized career roadmap is successfully mapped and ready for execution."
            
        return "Complete your profile to unlock actionable ML insights."
