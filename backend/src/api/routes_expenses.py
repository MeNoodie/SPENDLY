from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional, List
from ..db.database import get_db
from ..db.models import ExpenseBill, User
from ..auth.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/expenses", tags=["Expenses & Bills"])

class ExpenseCreate(BaseModel):
    title: str = Field(..., example="Flat Rent")
    category: str = Field(..., example="Rent") # Rent, EMI, Rasan, Card Bill, Housekeeper, Utilities, Medical, Other
    amount: float = Field(..., gt=0, example=22000.0)
    due_date: str = Field(..., example="2026-11-05")
    is_recurring: bool = True
    payment_status: str = "unpaid" # unpaid, paid

class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[float] = None
    due_date: Optional[str] = None
    payment_status: Optional[str] = None # unpaid, paid
    included_in_timeline: Optional[bool] = None

@router.get("")
def list_expenses(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    expenses = db.query(ExpenseBill).filter(ExpenseBill.user_id == current_user.id).order_by(ExpenseBill.due_date.asc()).all()
    return {
        "status": "success",
        "count": len(expenses),
        "data": expenses
    }

@router.post("")
def add_expense(payload: ExpenseCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_bill = ExpenseBill(
        user_id=current_user.id,
        title=payload.title,
        category=payload.category,
        amount=payload.amount,
        due_date=payload.due_date,
        is_recurring=payload.is_recurring,
        payment_status=payload.payment_status,
        included_in_timeline=True
    )
    db.add(new_bill)
    db.commit()
    db.refresh(new_bill)
    return {
        "status": "success",
        "message": f"Added expense '{new_bill.title}' for ₹{new_bill.amount}",
        "data": new_bill
    }

@router.patch("/{expense_id}")
def update_expense(expense_id: str, payload: ExpenseUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    bill = db.query(ExpenseBill).filter(ExpenseBill.id == expense_id, ExpenseBill.user_id == current_user.id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Expense not found")

    if payload.title is not None:
        bill.title = payload.title
    if payload.category is not None:
        bill.category = payload.category
    if payload.amount is not None:
        bill.amount = payload.amount
    if payload.due_date is not None:
        bill.due_date = payload.due_date
    if payload.payment_status is not None:
        bill.payment_status = payload.payment_status
    if payload.included_in_timeline is not None:
        bill.included_in_timeline = payload.included_in_timeline

    db.commit()
    db.refresh(bill)
    return {
        "status": "success",
        "message": "Expense updated successfully",
        "data": bill
    }

@router.delete("/{expense_id}")
def delete_expense(expense_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    bill = db.query(ExpenseBill).filter(ExpenseBill.id == expense_id, ExpenseBill.user_id == current_user.id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(bill)
    db.commit()
    return {
        "status": "success",
        "message": "Expense deleted successfully"
    }
