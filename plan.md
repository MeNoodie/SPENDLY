# Spendly — Master Execution Plan (Real API & Interactive Dashboard)

> **Excalidraw Blueprint Ref:** `idea.excalidraw`  
> **Core Formula:**  
> $$\mathbf{Safe\ to\ Spend\ Today} = \mathbf{Current\ Savings} - \mathbf{Upcoming\ Essentials} - \mathbf{Secure\ Savings\ (Minimum\ Safety\ Bal)}$$

---

## 🎯 1. Immediate Goal (Real Working MVP — No Dummy Static Data)

Hum koi static dummy UI nahi bana rahe. Hum **100% Real Working Backend API + Real React Dashboard** build kar rahe hain jo seedha SQLite database se linked hoga.

Jab user:
1. **Profile** me `Salary`, `Secure Savings` (Minimum Safety Reserve), aur `Current Savings` update karega,
2. **Add Expenses** section me jaakar manually bills add karega (**Category:** Rent, EMI, Rasan, Card Bill, Housekeeper, etc., **Amount**, **Date**),
3. Toh backend **Total Upcoming Essentials** ko real-time calculate karega aur Dashboard pe **"Safe to Spend Today"** aur **"Current Picture"** instantly update ho jayega!

---

## 📐 2. Screen & Wireframe Breakdown (Directly from `idea.excalidraw`)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ SPENDLY APP LAYOUT                                                                          │
├───────────────────┬─────────────────────────────────────────────────────────────────────────┤
│ SIDEBAR           │ TOP BAR: "Good Morning, Piyush!" | Quick Stats                          │
│                   ├─────────────────────────────────────────────────────────────────────────┤
│ [📊 Dashboard]    │ [1. HERO CARD: Safe to Spend Today]                                     │
│ [➕ Add Expenses]  │    Safe to Spend = ₹17,000 (Current ₹85k - Essentials ₹43k - Min ₹25k)  │
│ [📅 Timeline]     │                                                                         │
│ [💡 New Decision]  │ [2. CURRENT PICTURE WIDGET]                                             │
│    - Build Manual │    • Current Balance / Savings: ₹85,000                                 │
│    - Just Ask     │    • Upcoming Essentials (Auto-calculated): ₹43,000                     │
│ [📜 Decision Hist]│    • Preferred Minimum Bal (Secure Savings): ₹25,000                    │
│ [⚙️ Profile / Bal]│                                                                         │
│                   ├─────────────────────────────────────────────────────────────────────────┤
│                   │ [3. NEXT FEW WEEKS (Timeline Strip)]                                    │
│                   │    • 01 Nov: Salary (Credit)                                            │
│                   │    • 05 Nov: Rent (₹22,000)                                             │
│                   │    • 10 Nov: Card Bill (₹18,000)                                        │
│                   │    • 12 Nov: Housekeeper (₹3,000)                                       │
│                   │    • Remaining Balance projection indicator                             │
│                   ├─────────────────────────────────────────────────────────────────────────┤
│                   │ [4. RECENT DECISIONS]                                                   │
│                   │    • MacBook Air M3 (₹1,89,900) → 12 Month Installments (Approved)      │
│                   │    • Family Trip (₹1,40,000) → Wait until Sep 15 (Below safety limit)   │
└───────────────────┴─────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ 3. Execution Phases

### 🚀 PHASE 1: Real API & Interactive Dashboard (TODAY'S LIVE SYSTEM)

#### 1. Real Backend (FastAPI + SQLite)
- **Database Tables (`backend/src/db/`):**
  1. `financial_profiles`:
     - `user_id`, `salary`, `current_savings` (Total available savings), `secure_savings` (Locked minimum safety balance).
  2. `expenses_bills`:
     - `id`, `user_id`, `title`, `category` (`Rent`, `EMI`, `Rasan/Grocery`, `Card Bill`, `Housekeeper`, `Utilities`, `Medical`, `Other`).
     - `amount`, `due_date`, `payment_status` (`unpaid`, `paid`), `is_recurring`, `included_in_timeline`.
  3. `decision_history`:
     - `id`, `user_id`, `query_text`, `item_name`, `amount`, `verdict` (`PAY_IN_FULL`, `EMI`, `WAIT`), `reasoning`, `created_at`.

- **Real REST API Endpoints (`backend/src/api/`):**
  - `GET /api/v1/dashboard`:
    - Auto-aggregates:
      $$\text{upcoming\_essentials} = \sum_{\text{unpaid \& included}} \text{amount}$$
      $$\text{safe\_to\_spend} = \text{current\_savings} - \text{upcoming\_essentials} - \text{secure\_savings}$$
    - Returns: Current Picture stats, Next Few Weeks timeline items, and Recent decisions.
  - `GET /api/v1/profile` & `PUT /api/v1/profile`: Update Salary, Secure Savings, Current Savings.
  - `GET /api/v1/expenses`: List all user expenses.
  - `POST /api/v1/expenses`: Add manual bill (Category, Amount, Date, Title).
  - `PATCH /api/v1/expenses/{id}`: Update payment status (`paid`/`unpaid`) or toggle `included_in_timeline`.
  - `DELETE /api/v1/expenses/{id}`: Remove an expense.

#### 2. Real Frontend (React + Vite + Modern Vanilla CSS/Tailwind)
- **Sidebar Navigation:**
  - `Dashboard`
  - `Add Expenses` (Clean form to input Category: Rent, EMI, Rasan, etc., Amount, Due Date + List of active bills)
  - `Financial Timeline` (Full chronological view with Yes/No forecast toggle)
  - `New Decision` (Build Manually + Just Ask)
  - `Profile / Settings` (Form to configure Salary, Secure Savings, Current Savings)
- **Dashboard Widgets:**
  - **Hero Card:** "Safe to spend Today" with dynamic color badge (Green = Healthy, Yellow = Tight, Red = Negative/Safety breach).
  - **Current Picture:** 3 interactive stat rows (Current Bal, Upcoming Essentials, Secure Savings).
  - **Next Few Weeks:** Visual horizontal/vertical timeline strip showing upcoming commitments with payment badges.
  - **Recent Decisions:** Cards showing previous purchase simulations.
- **Instant Reactive Sync:** Adding an expense or updating savings immediately updates the dashboard figures via live API calls.

---

### 📊 PHASE 2: Historical Spending Engine & Duplicate-Proof Ingestion (Hackathon Core)
- **3-Tier Storage:**
  - Overall monthly spending history (complete vs incomplete months).
  - Category-wise spending history (Grocery, Rent, Medical, Shopping, Utilities).
  - Spending trends & seasonal spikes.
- **Deduplication Engine:**
  - SHA256 transaction fingerprinting (`user_id + date + amount + merchant + source_id`).
  - Batch import reports (imported, skipped duplicates, invalid rows).
- **12-Month Rolling Spending Baseline with Confidence Scores.**

---

### 🧠 PHASE 3: LangGraph Agent & Mesh API Decision Engine
- Mesh API integration for all LLM calls.
- Agent tools:
  - `get_financial_picture`
  - `get_upcoming_essentials`
  - `simulate_purchase_scenarios` (Pay in full vs 3/6/12 mo EMI vs Wait)
- Natural language chat in "Just Ask".

---

### 🔮 PHASE 4: Multi-Modal Ingestion & Speech UI
- UPI screenshot & PDF invoice OCR parsing.
- User category correction feedback loop.
- Voice/Speech-to-text integration.

---

## 📋 4. Today's Build Order (Immediate Code Execution)

1. **Backend Service (`backend/`):**
   - SQLite DB schema initialization (`database.py`, `models.py`).
   - Core Calculation Engine (`engine.py` for Safe-to-Spend & Upcoming Essentials aggregation).
   - FastAPI routers (`routes_dashboard.py`, `routes_expenses.py`, `routes_profile.py`).
   - Default seed data for user `user_1` so it is instantly usable.
2. **Frontend App (`frontend/`):**
   - Vite React app setup.
   - Design System (dark mode, glassmorphism, responsive cards).
   - Sidebar navigation.
   - Dashboard page with Real API connection.
   - Add Expenses page (manual bill entry for rent, emi, rasan, etc.).
   - Profile settings modal/page.
