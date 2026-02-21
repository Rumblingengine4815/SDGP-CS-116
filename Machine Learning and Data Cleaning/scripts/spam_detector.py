import re
import torch
from sentence_transformers import SentenceTransformer, util
from pathlib import Path

class SpamDetector:
    def __init__(self, models_dir=None):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Blacklisted keywords
        self.blacklist = [
            r'whatsapp', r'viber', r'easy money', r'earn daily', 
            r'online part-time', r'work from home scams', r'no experience needed.*earn.*',
            r'daily.*pay', r'telegram', r'contact us on'
        ]
        
        # fake job examples
        self.scam_profiles = [
            "Earn 5000 LKR daily by working from home. Just simple typing job. Contact us on WhatsApp.",
            "Online part-time job for students. No experience needed. Earn money daily using your mobile phone.",
            "Work from home. Earn 3000-5000 per day. Easy work.Telegram or WhatsApp us.",
            "Investment opportunity with high returns. Earn money fast without any risk."
        ]
        self.scam_embs = self.model.encode(self.scam_profiles, convert_to_tensor=True)

    def is_spam(self, text, threshold=0.6):
        """
        Returns True if the text is likely spam based on keywords or semantic similarity on SSBERRT.
        """
        if not text or not isinstance(text, str):
            return False
            
        text_lower = text.lower()
        
        # 1. Keyword check
        for pattern in self.blacklist:
            if re.search(pattern, text_lower):
                return True, "keyword_match"
        
        # 2. Semantic similarity check
        text_emb = self.model.encode(text, convert_to_tensor=True)
        hits = util.semantic_search(text_emb, self.scam_embs, top_k=1)[0]
        
        if hits[0]['score'] > threshold:
            return True, f"semantic_match_score_{round(hits[0]['score'], 2)}"
            
        return False, "clean"

if __name__ == "__main__":
    detector = SpamDetector()
    
    test_cases = [
        "Software Engineer with 3 years experience in Python and Java. High salary potential.",
        "URGENT: Earn 5000 LKR daily by working at home. No experience needed. Contact us on WhatsApp: 071-XXX-XXXX",
        "Part-time online job for students. Simple work. Just use your phone and earn money. Join our Telegram group.",
        "Full stack developer required for a leading tech company in Colombo. Skills: React, Node.js, SQL."
    ]
    
    print("Testing Spam Detector...")
    print("-" * 50)
    for t in test_cases:
        is_spm, reason = detector.is_spam(t)
        status = "[SPAM]" if is_spm else "[CLEAN]"
        print(f"{status} | Reason: {reason} | Text: {t[:60]}...")
