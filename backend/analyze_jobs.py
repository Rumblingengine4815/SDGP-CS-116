import pandas as pd
try:
    df = pd.read_csv(r'c:\Users\User\Desktop\Second Year Stuff\sdgp\PathFinder+\Adjusted_Scraper\project_root\Machine Learning and Data Cleaning\data\processed\jobs_df.csv')
    print('Total Jobs:', len(df))
    print('Unique Titles:', df['Job Title'].nunique())
    print('\n--- Top 20 Most Frequent Roles ---')
    print(df['Job Title'].value_counts().head(20).to_string())
    print('\n--- Random Diverse Titles ---')
    print(df['Job Title'].drop_duplicates().sample(min(20, df['Job Title'].nunique()), random_state=42).tolist())
except Exception as e:
    print('Error:', e)