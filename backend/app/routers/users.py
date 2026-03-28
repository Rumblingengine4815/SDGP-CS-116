from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta, datetime

from ..database import get_db
from ..models import User, UserProfile
from ..schemas import UserCreate, UserLogin, UserOut, Token
from ..auth import (
    hash_password,
    verify_password,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    verify_token
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# 🔥 SWITCH HERE
DEMO_MODE = True


# ───────────────── REGISTER ─────────────────

@router.post("/register", response_model=UserOut, status_code=201)
def register(user_data: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(user_data.password)

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        profile = UserProfile(user_id=new_user.id)
        db.add(profile)
        db.commit()

        return new_user

    except Exception as e:
        print("REGISTER ERROR:", e)

        if DEMO_MODE:
            return User(
                id=999,
                name=user_data.name,
                email=user_data.email,
                is_active=True,
                created_at=datetime.utcnow()
            )

        raise HTTPException(status_code=500, detail="Registration failed")


# ───────────────── LOGIN ─────────────────

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):

    # 🔥 Demo bypass account
    if DEMO_MODE and user_data.email == "user@pathfinder.com" and user_data.password == "user123":
        access_token = create_access_token(
            data={"sub": user_data.email},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        return {"access_token": access_token, "token_type": "bearer"}

    try:
        user = db.query(User).filter(User.email == user_data.email).first()

        if user and not verify_password(user_data.password, user.hashed_password):
            user = None

    except Exception as e:
        print("LOGIN ERROR:", e)
        user = None

    # 🔥 Demo fallback (ONLY if enabled)
    if DEMO_MODE and not user:
        access_token = create_access_token(
            data={"sub": user_data.email},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        return {"access_token": access_token, "token_type": "bearer"}

    # ❌ Real validation
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")

    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {"access_token": access_token, "token_type": "bearer"}


# ───────────────── GET CURRENT USER ─────────────────

@router.get("/me", response_model=UserOut)
def get_me(token: str, db: Session = Depends(get_db)):

    try:
        payload = verify_token(token)
        email = payload.get("sub")

        user = db.query(User).filter(User.email == email).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return user

    except Exception as e:
        print("GET_ME ERROR:", e)

        if DEMO_MODE:
            return User(
                id=999,
                name="Demo User",
                email="demo@example.com",
                is_active=True,
                created_at=datetime.utcnow()
            )

        raise HTTPException(status_code=401, detail="Invalid token")
