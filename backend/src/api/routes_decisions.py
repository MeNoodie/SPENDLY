from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional
from ..db.database import get_db
from ..db.models import FinancialProfile, ExpenseBill, DecisionHistory, User
from ..engine.calculator import calculate_dashboard_metrics
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/decisions", tags=["Financial Decisions"])

class DecisionEvaluationRequest(BaseModel):
    item_name: str = Field(..., example="MacBook Air M3")
    amount: float = Field(..., gt=0, example=118900.0)
    emi_months: Optional[int] = Field(12, example=12)

@router.post("/evaluate")
def evaluate_decision(payload: DecisionEvaluationRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == current_user.id).first()
    bills = db.query(ExpenseBill).filter(ExpenseBill.user_id == current_user.id).all()
    metrics = calculate_dashboard_metrics(profile, bills)

    current_savings = metrics["current_picture"]["current_savings"]
    secure_savings = metrics["current_picture"]["secure_savings"]
    upcoming_essentials = metrics["current_picture"]["upcoming_essentials"]
    safe_to_spend = metrics["safe_to_spend_today"]

    # 1. Evaluate Pay in Full:
    remaining_after_full = current_savings - upcoming_essentials - payload.amount
    can_pay_in_full = remaining_after_full >= secure_savings and current_savings > 0

    # 2. Evaluate EMI:
    emi_amount = round(payload.amount / payload.emi_months, 2)
    monthly_surplus = profile.salary - upcoming_essentials if profile else 0
    can_afford_emi = emi_amount <= (monthly_surplus * 0.4) and (current_savings - upcoming_essentials) >= secure_savings

    # Determine Verdict
    if can_pay_in_full:
        verdict = "PAY_IN_FULL"
        verdict_label = "Pay in Full Approved"
        status_note = "Safe to purchase"
        reasoning = f"Your current savings of ₹{current_savings:,.0f} safely covers this purchase while keeping your ₹{secure_savings:,.0f} safety reserve intact."
    elif can_afford_emi:
        verdict = "EMI"
        verdict_label = f"{payload.emi_months} month installments"
        status_note = f"₹{emi_amount:,.0f}/mo"
        reasoning = f"Full payment would breach your ₹{secure_savings:,.0f} safety reserve. An installment of ₹{emi_amount:,.0f}/mo fits your monthly cashflow comfortably."
    else:
        verdict = "WAIT"
        verdict_label = "Wait until next salary cycle"
        status_note = "Below safety limit"
        shortfall = max(0, secure_savings - remaining_after_full)
        reasoning = f"This purchase breaches your minimum safety buffer by ₹{shortfall:,.0f}. We recommend waiting until your next salary credit on the 1st."

    # Save to Decision History
    history_entry = DecisionHistory(
        user_id=current_user.id,
        item_name=payload.item_name,
        amount=payload.amount,
        verdict=verdict,
        verdict_label=verdict_label,
        status_note=status_note,
        reasoning=reasoning
    )
    db.add(history_entry)
    db.commit()
    db.refresh(history_entry)

    return {
        "status": "success",
        "data": {
            "decision_id": history_entry.id,
            "item_name": payload.item_name,
            "amount": payload.amount,
            "verdict": verdict,
            "verdict_label": verdict_label,
            "status_note": status_note,
            "reasoning": reasoning,
            "metrics_snapshot": {
                "safe_to_spend_today": safe_to_spend,
                "current_savings": current_savings,
                "upcoming_essentials": upcoming_essentials,
                "secure_savings": secure_savings
            }
        }
    }

@router.get("/history")
def get_decision_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    history = db.query(DecisionHistory).filter(DecisionHistory.user_id == current_user.id).order_by(DecisionHistory.created_at.desc()).all()
    return {
        "status": "success",
        "count": len(history),
        "data": history
    }
