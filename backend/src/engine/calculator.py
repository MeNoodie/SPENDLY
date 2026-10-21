from typing import List, Dict, Any
from datetime import datetime
from ..db.models import FinancialProfile, ExpenseBill

def calculate_dashboard_metrics(profile: FinancialProfile, bills: List[ExpenseBill]) -> Dict[str, Any]:
    """
    Core Excalidraw formula:
    safe to spend = current - upcoming essential - minimum
    """
    current_savings = float(profile.current_savings) if profile else 0.0
    secure_savings = float(profile.secure_savings) if profile else 0.0
    salary = float(profile.salary) if profile else 0.0

    # Calculate upcoming essentials from active, unpaid, included bills
    upcoming_essentials = sum(
        float(b.amount) for b in bills 
        if b.payment_status == "unpaid" and b.included_in_timeline
    )

    paid_bills_total = sum(
        float(b.amount) for b in bills 
        if b.payment_status == "paid"
    )

    safe_to_spend_today = current_savings - upcoming_essentials - secure_savings

    # Build timeline events for the "Next few weeks" widget
    # We sort bills by due_date ascending
    sorted_bills = sorted(bills, key=lambda b: b.due_date)

    running_balance = current_savings
    timeline_items = []

    # Insert salary event if relevant or construct timeline
    for b in sorted_bills:
        if b.included_in_timeline:
            if b.payment_status == "unpaid":
                running_balance -= float(b.amount)

            timeline_items.append({
                "id": b.id,
                "title": b.title,
                "category": b.category,
                "amount": float(b.amount),
                "due_date": b.due_date,
                "payment_status": b.payment_status,
                "included_in_timeline": b.included_in_timeline,
                "projected_balance_after": round(running_balance, 2)
            })

    user_name = "User"
    if profile:
        if getattr(profile, "user", None) and getattr(profile.user, "name", None):
            user_name = profile.user.name
        elif getattr(profile, "name", None):
            user_name = profile.name

    return {
        "user_name": user_name,
        "safe_to_spend_today": round(safe_to_spend_today, 2),
        "current_picture": {
            "current_savings": round(current_savings, 2),
            "upcoming_essentials": round(upcoming_essentials, 2),
            "secure_savings": round(secure_savings, 2),
            "salary": round(salary, 2),
            "paid_bills_total": round(paid_bills_total, 2)
        },
        "next_few_weeks": timeline_items
    }
