from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# --------- Root Test ---------
@app.get("/")
def home():
    return {"message": "Mentor Backend Running 🚀"}


# --------- Register Model ---------
class RegisterUser(BaseModel):
    name: str
    email: str


# --------- Register Endpoint ---------
@app.post("/register")
def register(user: RegisterUser):
    return {
        "message": "User Registered Successfully",
        "name": user.name,
        "email": user.email
    }


# --------- Mentor Suggestion Test ---------
@app.get("/mentors")
def get_mentors():
    fake_mentors = [
        {"id": 1, "name": "Mentor Alex", "skill": "Python"},
        {"id": 2, "name": "Mentor Sarah", "skill": "Java"},
        {"id": 3, "name": "Mentor Max", "skill": "Web Development"}
    ]
    return fake_mentors


# --------- Booking Model ---------
class Booking(BaseModel):
    mentor_id: int
    date: str


# --------- Booking Endpoint ---------
@app.post("/book")
def book_session(booking: Booking):
    return {
        "message": "Booking Successful",
        "mentor_id": booking.mentor_id,
        "date": booking.date
    }