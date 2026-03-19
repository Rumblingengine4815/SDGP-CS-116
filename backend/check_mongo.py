from app.database import get_database

db = get_database()
job = db.jobs.find_one()
print('MongoDB Job Document Keys:', list(job.keys()) if job else 'No jobs found')
