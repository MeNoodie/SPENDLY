from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..db.models import FinancialProfile, ExpenseBill, DecisionHistory, User
from ..engine.calculator import calculate_dashboard_metrics
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])

@router.get("")
def get_dashboard_data(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == current_user.id).first()
    if not profile:
        profile = FinancialProfile(
            user_id=current_user.id,
            salary=0.0,
            current_savings=0.0,
            secure_savings=0.0
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    bills = db.query(ExpenseBill).filter(ExpenseBill.user_id == current_user.id).all()
    metrics = calculate_dashboard_metrics(profile, bills)
    metrics["user_name"] = current_user.name
    metrics["user_id"] = current_user.user_code or current_user.id
    metrics["user_code"] = current_user.user_code or "userSP01"

    decisions = db.query(DecisionHistory).filter(DecisionHistory.user_id == current_user.id).order_by(DecisionHistory.created_at.desc()).limit(6).all()
    
    return {
        "status": "success",
        "data": {
            **metrics,
            "recent_decisions": [
                {
                    "id": d.id,
                    "item_name": d.item_name,
                    "amount": d.amount,
                    "verdict": d.verdict,
                    "verdict_label": d.verdict_label,
                    "status_note": d.status_note,
                    "reasoning": d.reasoning,
                    "created_at": d.created_at.isoformat() if d.created_at else ""
                }
                for d in decisions
            ]
        }
    }
