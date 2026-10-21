import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_code = Column(String, unique=True, index=True, nullable=True) # e.g. "userSP01"
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    profile = relationship("FinancialProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    bills = relationship("ExpenseBill", back_populates="user", cascade="all, delete-orphan")
    decisions = relationship("DecisionHistory", back_populates="user", cascade="all, delete-orphan")

class FinancialProfile(Base):
    __tablename__ = "financial_profiles"

    user_id = Column(String, ForeignKey("users.id"), primary_key=True)
    user_code = Column(String, index=True, nullable=True) # e.g. "userSP01"
    salary = Column(Float, default=0.0)
    salary_day = Column(Integer, default=1)
    current_savings = Column(Float, default=0.0) # Total available savings
    secure_savings = Column(Float, default=0.0)  # Preferred minimum safety balance
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")

class ExpenseBill(Base):
    __tablename__ = "expenses_bills"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False) # Rent, EMI, Rasan, Card Bill, Housekeeper, Utilities, Medical, Other
    amount = Column(Float, nullable=False)
    due_date = Column(String, nullable=False) # Format YYYY-MM-DD
    payment_status = Column(String, default="unpaid") # unpaid, paid
    is_recurring = Column(Boolean, default=True)
    recurrence_frequency = Column(String, default="monthly")
    included_in_timeline = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="bills")

class DecisionHistory(Base):
    __tablename__ = "decision_history"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    item_name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    verdict = Column(String, nullable=False) # PAY_IN_FULL, EMI, WAIT
    verdict_label = Column(String, nullable=False) # e.g. "12 month installments", "Wait until Sep 15"
    status_note = Column(String, default="") # e.g. "Below safety limit"
    reasoning = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="decisions")
