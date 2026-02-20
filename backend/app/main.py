from fastapi import FastAPI

app = FastAPI(
    title="SDGP Career & Course Recommendation API",
    version="0.1.0"
)

@app.get("/health")
def health_check():
    """
    Health check endpoint to verify backend is running.
    """
    return {
        "status": "ok",
        "message": "Backend is running successfully"
    }
