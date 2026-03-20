import pandas as pd
df = pd.read_csv(r'c:\Users\User\Desktop\Second Year Stuff\sdgp\PathFinder+\Adjusted_Scraper\project_root\Machine Learning and Data Cleaning\data\processed\jobs_df.csv')
print(f'Total Scraped Rows: {len(df)}')
print(f'Unique Job Titles: {df["Job Title"].nunique()}')
has_desc = df["Description"].notna().sum() if "Description" in df.columns else 0
print(f'Jobs with Descriptions: {has_desc}')