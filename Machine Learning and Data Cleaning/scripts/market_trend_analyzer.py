
import pandas as pd
import numpy as np
from pathlib import Path
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.feature_extraction.text import TfidfVectorizer
import torch
import json
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("TrendAnalyzer")

class MarketTrendAnalyzer:
    def __init__(self, jobs_master_path, model_name="all-MiniLM-L6-v2"):
        self.jobs_df = pd.read_csv(jobs_master_path)
        self.model = SentenceTransformer(model_name)
        self.embeddings = None
        self.clusters = None
        
    def analyze_trends(self, n_clusters=15):
        """Perform K-Means clustering on job titles/descriptions to find market segments"""
        logger.info(f"Analyzing trends across {len(self.jobs_df)} jobs...")
        
        # 1. Prepare text data (Focus on IT and Business as requested)
        # We'll use title + a snippet of description if available
        self.jobs_df['combined_text'] = self.jobs_df['title'].fillna('') + " " + self.jobs_df['description'].fillna('').str[:200]
        
        # 2. Generate Embeddings (Deep Learning)
        logger.info("Generating semantic embeddings for clustering...")
        self.embeddings = self.model.encode(self.jobs_df['combined_text'].tolist(), show_progress_bar=True)
        
        # 3. K-Means Clustering (Machine Learning)
        logger.info(f"Running K-Means clustering with k={n_clusters}...")
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        self.jobs_df['cluster'] = kmeans.fit_predict(self.embeddings)
        
        # 4. Extract Top Keywords per Cluster (NLP)
        trend_summary = []
        for i in range(n_clusters):
            cluster_data = self.jobs_df[self.jobs_df['cluster'] == i]
            
            # Simple keyword extraction using TF-IDF for the cluster
            vectorizer = TfidfVectorizer(stop_words='english', max_features=10)
            tfidf_matrix = vectorizer.fit_transform(cluster_data['combined_text'].fillna(''))
            keywords = vectorizer.get_feature_names_out()
            
            # Get the most common job titles in this cluster
            common_titles = cluster_data['title'].value_counts().head(3).index.tolist()
            
            trend_summary.append({
                "cluster_id": i,
                "size": len(cluster_data),
                "top_titles": common_titles,
                "key_skills": keywords.tolist(),
                "market_share": round((len(cluster_data) / len(self.jobs_df)) * 100, 2)
            })
            
        return trend_summary

    def get_hot_skills(self, top_k=20):
        """Identifies skills with high demand across the dataset"""
        # Split extracted_skills column which we populated during cleaning
        all_skills = []
        if 'extracted_skills' in self.jobs_df.columns:
            for skills in self.jobs_df['extracted_skills'].dropna():
                all_skills.extend([s.strip().lower() for s in str(skills).split(",") if s.strip()])
        
        skill_counts = pd.Series(all_skills).value_counts()
        return skill_counts.head(top_k).to_dict()

if __name__ == "__main__":
    current_dir = Path(__file__).parent
    master_path = current_dir / "../data/processed/all_jobs_master.csv"
    
    if master_path.exists():
        analyzer = MarketTrendAnalyzer(master_path)
        trends = analyzer.analyze_trends(n_clusters=10)
        
        print("\n" + "="*50)
        print("SRI LANKAN MARKET TREND REPORT (ML-POWERED)")
        print("="*50)
        
        for t in trends:
            print(f"\nCluster #{t['cluster_id']} ({t['market_share']}% of Market)")
            print(f"Typical Roles: {', '.join(t['top_titles'])}")
            print(f"Primary Skills: {', '.join(t['key_skills'])}")
            
        print("\n" + "="*50)
        print("TOP 10 HOT SKILLS")
        hot_skills = analyzer.get_hot_skills(10)
        for skill, count in hot_skills.items():
            print(f"- {skill.upper()}: found in {count} jobs")
    else:
        print(f"Error: Master file not found at {master_path}")
