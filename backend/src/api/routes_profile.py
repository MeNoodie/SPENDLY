from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional
from ..db.database import get_db
from ..db.models import FinancialProfile, User
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/profile", tags=["Profile & Financial Settings"])

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    salary: Optional[float] = Field(None, ge=0)
    salary_day: Optional[int] = Field(None, ge=1, le=31)
    current_savings: Optional[float] = Field(None, ge=0)
    secure_savings: Optional[float] = Field(None, ge=0)

@router.get("")
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == current_user.id).first()
    if not profile:
        profile = FinancialProfile(
            user_id=current_user.id,
            user_code=current_user.user_code,
            salary=0.0,
            salary_day=1,
            current_savings=0.0,
            secure_savings=0.0
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    elif not profile.user_code and current_user.user_code:
        profile.user_code = current_user.user_code
        db.commit()
        
    return {
        "status": "success",
        "data": {
            "id": current_user.id,
            "user_id": current_user.user_code or current_user.id,
            "user_code": current_user.user_code or "userSP01",
            "name": current_user.name,
            "email": current_user.email,
            "salary": profile.salary,
            "salary_day": profile.salary_day,
            "current_savings": profile.current_savings,
            "secure_savings": profile.secure_savings,
            "updated_at": profile.updated_at.isoformat() if profile.updated_at else None
        }
    }

@router.put("")
def update_profile(payload: ProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == current_user.id).first()
    if not profile:
        profile = FinancialProfile(user_id=current_user.id, user_code=current_user.user_code)
        db.add(profile)

    if payload.name is not None and payload.name.strip():
        current_user.name = payload.name.strip()
    if payload.salary is not None:
        profile.salary = payload.salary
    if payload.salary_day is not None:
        profile.salary_day = payload.salary_day
    if payload.current_savings is not None:
        profile.current_savings = payload.current_savings
    if payload.secure_savings is not None:
        profile.secure_savings = payload.secure_savings
    if not profile.user_code and current_user.user_code:
        profile.user_code = current_user.user_code

    db.commit()
    db.refresh(profile)
    return {
        "status": "success",
        "message": "Financial profile updated successfully",
        "data": {
            "id": current_user.id,
            "user_id": current_user.user_code or current_user.id,
            "user_code": current_user.user_code or "userSP01",
            "name": current_user.name,
            "email": current_user.email,
            "salary": profile.salary,
            "salary_day": profile.salary_day,
            "current_savings": profile.current_savings,
            "secure_savings": profile.secure_savings
        }
    }

@router.post("/credit-salary")
def credit_salary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == current_user.id).first()
    if not profile or profile.salary <= 0:
        raise HTTPException(status_code=400, detail="Please set a valid monthly salary in your profile first")

    # Add salary to current savings
    profile.current_savings = float(profile.current_savings or 0.0) + float(profile.salary)
    db.commit()
    db.refresh(profile)

    return {
        "status": "success",
        "message": f"Monthly salary of ₹{profile.salary:,.0f} has been credited to your balance!",
        "data": {
            "current_savings": profile.current_savings,
            "salary": profile.salary,
            "secure_savings": profile.secure_savings
        }
    }
