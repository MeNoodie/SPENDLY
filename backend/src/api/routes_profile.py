from fastapi import APIRouter, Depends
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
            salary=0.0,
            salary_day=1,
            current_savings=0.0,
            secure_savings=0.0
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
        
    return {
        "status": "success",
        "data": {
            "user_id": current_user.id,
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
        profile = FinancialProfile(user_id=current_user.id)
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

    db.commit()
    db.refresh(profile)
    return {
        "status": "success",
        "message": "Financial profile updated successfully",
        "data": {
            "user_id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "salary": profile.salary,
            "salary_day": profile.salary_day,
            "current_savings": profile.current_savings,
            "secure_savings": profile.secure_savings
        }
    }
