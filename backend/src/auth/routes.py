from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field
from ..db.database import get_db
from ..db.models import User, FinancialProfile
from .utils import hash_password, verify_password
from .jwt import create_access_token
from .dependencies import get_current_user

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, example="Piyush")
    email: str = Field(..., example="test@gmail.com")
    password: str = Field(..., min_length=4, example="test123")

class LoginRequest(BaseModel):
    email: str = Field(..., example="test@gmail.com")
    password: str = Field(..., example="test123")

@router.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    email_clean = payload.email.strip().lower()
    existing_user = db.query(User).filter(User.email == email_clean).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists"
        )

    # 1. Create User
    new_user = User(
        name=payload.name.strip(),
        email=email_clean,
        hashed_password=hash_password(payload.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 2. Initialize User Financial Profile with ZERO data
    profile = FinancialProfile(
        user_id=new_user.id,
        salary=0.0,
        salary_day=1,
        current_savings=0.0,
        secure_savings=0.0
    )
    db.add(profile)
    db.commit()

    # 3. Generate JWT
    token = create_access_token(data={"sub": new_user.id, "email": new_user.email})

    return {
        "status": "success",
        "message": "User registered successfully",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email
        }
    }

@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    email_clean = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(data={"sub": user.id, "email": user.email})

    return {
        "status": "success",
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == current_user.id).first()
    return {
        "status": "success",
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "created_at": current_user.created_at.isoformat() if current_user.created_at else None
        },
        "profile": {
            "salary": profile.salary if profile else 0.0,
            "salary_day": profile.salary_day if profile else 1,
            "current_savings": profile.current_savings if profile else 0.0,
            "secure_savings": profile.secure_savings if profile else 0.0
        }
    }
