import os
import sys

# Ensure backend package can be imported
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.src.db.database import engine, Base, SessionLocal
from backend.src.db.models import User, FinancialProfile, ExpenseBill, DecisionHistory
from backend.src.auth.utils import hash_password

def seed_test_user():
    print("[*] Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        email = "test@gmail.com"
        raw_password = "test123"
        name = "Test User (Piyush)"

        print(f"[*] Checking for existing user: {email}")
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            user = User(
                name=name,
                email=email,
                hashed_password=hash_password(raw_password)
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"[+] Created user: {email} (ID: {user.id})")
        else:
            user.name = name
            user.hashed_password = hash_password(raw_password)
            db.commit()
            print(f"[+] Updated existing user password to: {raw_password}")

        # Set or Update Financial Profile
        profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user.id).first()
        if not profile:
            profile = FinancialProfile(
                user_id=user.id,
                salary=95000.0,
                salary_day=1,
                current_savings=85000.0,
                secure_savings=25000.0
            )
            db.add(profile)
        else:
            profile.salary = 95000.0
            profile.salary_day = 1
            profile.current_savings = 85000.0
            profile.secure_savings = 25000.0
        
        db.commit()
        print("[+] Configured financial profile (Salary: 95k, Savings: 85k, Reserve: 25k)")

        # Clear existing bills for this user to avoid duplicates
        db.query(ExpenseBill).filter(ExpenseBill.user_id == user.id).delete()

        sample_bills = [
            ExpenseBill(
                user_id=user.id,
                title="Flat Rent",
                category="Rent",
                amount=22000.0,
                due_date="2026-11-05",
                payment_status="unpaid",
                included_in_timeline=True
            ),
            ExpenseBill(
                user_id=user.id,
                title="HDFC Credit Card Bill",
                category="Card Bill",
                amount=18000.0,
                due_date="2026-11-10",
                payment_status="unpaid",
                included_in_timeline=True
            ),
            ExpenseBill(
                user_id=user.id,
                title="Housekeeper & Maid",
                category="Housekeeper",
                amount=3000.0,
                due_date="2026-11-12",
                payment_status="unpaid",
                included_in_timeline=True
            ),
            ExpenseBill(
                user_id=user.id,
                title="Monthly Rasan & Groceries",
                category="Rasan",
                amount=6000.0,
                due_date="2026-11-15",
                payment_status="unpaid",
                included_in_timeline=True
            )
        ]
        db.add_all(sample_bills)

        # Clear existing decisions for this user
        db.query(DecisionHistory).filter(DecisionHistory.user_id == user.id).delete()

        sample_decisions = [
            DecisionHistory(
                user_id=user.id,
                item_name="MacBook Air M3",
                amount=189900.0,
                verdict="EMI",
                verdict_label="12 month installments",
                status_note="Approved with conditions",
                reasoning="Full payment violates minimum safety balance of Rs 25,000. Recommended 12-month installment of Rs 15,825/mo within monthly surplus."
            ),
            DecisionHistory(
                user_id=user.id,
                item_name="Family Trip to Kerala",
                amount=140000.0,
                verdict="WAIT",
                verdict_label="Wait until Sep 15",
                status_note="Below safety limit",
                reasoning="Upcoming credit card and rent obligations leave insufficient liquidity. Deferring to next salary window."
            ),
            DecisionHistory(
                user_id=user.id,
                item_name="Mutual Fund Lump Sum",
                amount=25000.0,
                verdict="PAY_IN_FULL",
                verdict_label="Pay in Full Approved",
                status_note="Safe to invest",
                reasoning="Sufficient cash buffer remaining after essential obligations."
            )
        ]
        db.add_all(sample_decisions)
        db.commit()

        print("\n==========================================")
        print("[+] TEST DATA SEEDED SUCCESSFULLY!")
        print("==========================================")
        print(f"Login Email:    {email}")
        print(f"Login Password: {raw_password}")
        print(f"Total Savings:  Rs 85,000")
        print(f"Safety Buffer:  Rs 25,000")
        print(f"Upcoming Bills: Rs 49,000 (Rent, Card Bill, Maid, Rasan)")
        print(f"Safe to Spend:  Rs 11,000")
        print("==========================================\n")

    finally:
        db.close()

if __name__ == "__main__":
    seed_test_user()
