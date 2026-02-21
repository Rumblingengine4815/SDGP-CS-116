from pymongo import MongoClient, ASCENDING, TEXT

MONGO_URI = "mongodb+srv://pathfinderpluslk:oWTRMFoT7n2AVlds@pathfinderplus.pekgg4w.mongodb.net/?appName=PathFinderPlus"
DATABASE_NAME = "pathfinder_plus"

def create_indexes():
    """Create MongoDB indexes for performance"""
    try:
        client = MongoClient(MONGO_URI)
        db = client[DATABASE_NAME]
        
        print(f"Connected to MongoDB: {DATABASE_NAME}")
        
        # Jobs indexes
        print("\nCreating Jobs indexes...")
        db.jobs.create_index([("title", TEXT), ("description", TEXT)])
        db.jobs.create_index([("extracted_skills", ASCENDING)])
        db.jobs.create_index([("company", ASCENDING)])
        db.jobs.create_index([("posted_date", ASCENDING)])
        print("Jobs indexes created")
        
        # Courses indexes
        print("\nCreating Courses indexes...")
        db.courses.create_index([("course_title", TEXT), ("description", TEXT)])
        db.courses.create_index([("provider", ASCENDING)])
        db.courses.create_index([("category", ASCENDING)])
        db.courses.create_index([("fee", ASCENDING)])
        print("Courses indexes created")
        
        # Mentors indexes
        print("\nCreating Mentors indexes...")
        db.mentors.create_index([("sector", ASCENDING)])
        db.mentors.create_index([("expertise", ASCENDING)])
        db.mentors.create_index([("name", TEXT)])
        print("Mentors indexes created")
        
        print("\nAll indexes created successfully!")
        
    except Exception as e:
        print(f"Error creating indexes: {e}")

if __name__ == "__main__":
    create_indexes()
