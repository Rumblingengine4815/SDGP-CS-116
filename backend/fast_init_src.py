    def __init__(self, jobs_path=None, courses_path=None, esco_dir=None, models_dir=None, force_refresh=False, show_progress=True, from_mongo=False):
        # Global Root Detection (Relative to core/)
        self.ml_root = Path(__file__).resolve().parent.parent
        self.show_progress = show_progress
        
        # State Initialization 
        self.jobs_df = pd.DataFrame()
        self.courses_df = pd.DataFrame()
        self.academic_df = pd.DataFrame()
        self.career_progressions_df = pd.DataFrame()
        self.esco_occ = pd.DataFrame(columns=["preferredLabel", "conceptUri"])
        self.esco_skills = pd.DataFrame(columns=["preferredLabel", "conceptUri"])
        self.occ_skill_rel = pd.DataFrame(columns=["occupationUri", "skillUri", "relationType"])
        self.broader_occ = pd.DataFrame(columns=["conceptUri", "broaderUri"])
        self.mentors_data = []
        self.salary_mapping = {"roles": {}, "sectors": {}}
        self.pricing_config = {}
        self.assessment_config = {}
        self.market_skills = []
        self._trend_cache = {}

        # ── Phase 10: Modular Logic Initialisation (Broken to Parts) ──
        self.rule_engine = RuleEngine()
        self.analytics = Analytics()
        self.recommender = Recommender(self)
        self.action_plan_gen = ActionPlanGenerator()

        # Shortcuts for backward compatibility or internal use
        self.domain_clusters = self.rule_engine.DOMAIN_CLUSTERS
        self.edu_levels = self.rule_engine.EDU_LEVELS

        # ── Phase 8: High-Confidence Academic Mappings (Sri Lanka) ──
        self.production_academic_programs = [
            {"level": "Bachelor", "course_name": "BSc in Data Science / Analytics", "provider": "SLIIT / NSBM / Open University", "duration": "3-4 years", "domain": "IT", "focus": ["SQL", "Statistics", "BI", "Visualization"], "notes": "Full academic pathway for career switchers", "url": "https://www.sliit.lk/computing/programmes/bsc-hons-in-information-technology-specializing-in-data-science/"},
            {"level": "Diploma", "course_name": "Diploma in Data Analytics", "provider": "National ICT Academy", "duration": "6 months", "domain": "IT", "focus": ["Analytics", "SQL"], "notes": "Fast-track entry into Data Science", "url": "https://www.nibm.lk/programmes/advanced-descriptor-in-data-science/"},
            {"level": "Postgraduate", "course_name": "MSc in Data Science", "provider": "UoM / UoC / Coursera", "duration": "1.5-2 years", "domain": "IT", "focus": ["Mastery", "Research"], "notes": "High credibility for career pivot", "url": "https://uom.lk/courses/msc-data-science-ai"},
            {"level": "Professional", "course_name": "Google Data Analytics Certificate", "provider": "Coursera", "duration": "6 months", "domain": "IT", "focus": ["Portfolio", "Skills"], "notes": "Practical transition certificate", "url": "https://www.coursera.org/professional-certificates/google-data-analytics"},
            
            {"level": "Bachelor", "course_name": "BSc in Marketing / Business Admin", "provider": "NSBM / UoC / SLIIT", "duration": "3-4 years", "domain": "Marketing", "focus": ["Analytics", "Content"], "notes": "Foundational creative marketing degree", "url": "https://www.sliit.lk/business/programmes/bba-special-honours-degree-in-marketing-management/"},
            {"level": "Postgraduate", "course_name": "MSc in Digital Marketing / MBA", "provider": "SLIIT / UoC / UK (Online)", "duration": "1-2 years", "domain": "Marketing", "focus": ["Leadership", "Strategy"], "notes": "Upskilling for senior leadership", "url": "https://www.nsbm.ac.lk/postgraduate/msc-in-business-analytics/"},
            {"level": "Diploma", "course_name": "Digital Marketing Diploma", "provider": "SLIM (Sri Lanka Institute of Marketing)", "duration": "6 months", "domain": "Marketing", "focus": ["Campaigns", "Readiness"], "notes": "High industry recognition in Sri Lanka", "url": "https://slim.lk/diploma-in-digital-marketing/"},
            {"level": "Professional", "course_name": "Google Digital Marketing Certificate", "provider": "HubSpot / Coursera", "duration": "6 months", "domain": "Marketing", "focus": ["Simulations", "Ads"], "notes": "Practical campaign skills", "url": "https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce"}
        ]
        
        #  Heavy Model Loading
        try:
            self.model = SentenceTransformer("all-MiniLM-L6-v2")
        except Exception as e:
            if self.show_progress: print(f"CRITICAL: Failed to load Transformer model: {e}")
            raise
        
        #  Data Loading Logic
        try:
            if from_mongo:
                self.load_from_mongo()
            else:
                # Default local paths if none provided
                jobs_path = jobs_path or str(self.ml_root / "data/processed/all_jobs_master.csv")
                courses_path = courses_path or str(self.ml_root / "data/processed/all_courses_master.csv")
                esco_dir = esco_dir or str(self.ml_root / "data/raw/esco")
                self._load_from_local(jobs_path, courses_path, esco_dir)
        except Exception as e:
            if self.show_progress: 
                print(f"Warning: Primary data loading interrupted: {e}")

        #  Common Post-Load Setup
        # Use ML root for models if not specified
        models_dir = models_dir or str(self.ml_root / "models")
        self._initialize_common(models_dir, force_refresh, courses_path)
