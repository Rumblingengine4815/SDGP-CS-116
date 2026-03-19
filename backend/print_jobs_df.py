from app.main import engine
import json
with open('jobs_df_schema.json', 'w') as f:
    json.dump({'cols': list(engine.jobs_df.columns)}, f)
