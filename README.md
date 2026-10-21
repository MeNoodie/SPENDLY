# Spendly 💳
> **AI-Powered Personal Finance & Pre-Purchase Decision Engine**
> Built for the Hackathon Demo & Prototype.

Spendly solves a fundamental personal finance dilemma: **"Can I afford this right now without breaking next month's essentials?"**

Instead of merely tracking where your money went in the past, Spendly is a forward-looking pre-purchase guardrail. It calculates your true **Safe to Spend Today** balance, tracks upcoming essential bills, and runs instant multi-scenario financial impact analyses before you swipe your card.

---

## 🌟 Core Features

- **Real-Time "Safe to Spend Today" Engine**:
  $$\text{Safe to Spend} = \text{Current Savings} - \text{Upcoming Essentials} - \text{Secure Reserve Buffer}$$
- **Interactive Bill & Expense Manager**:
  - Add manual recurring/one-off bills (Rent, EMI, Rasan/Groceries, Credit Cards, Housekeeper, Utilities, Medical, etc.).
  - Dark-mode date picker with quick date offsets (`Today`, `+7 Days`, `+15 Days`, `+1 Month`).
  - Toggle bill inclusion and mark bills as paid in real-time.
- **Dynamic Cash Flow & Timeline Forecast**:
  - Daily projected balance timeline showing impact of due bills and paycheck dates.
- **AI Decision Simulator**:
  - Run purchase simulations with verdict levels: **Safe**, **Caution**, or **High Risk**.
  - Calculates balance after purchase and evaluates impact on upcoming essential commitments.
- **Zero-State & User Authentication**:
  - User registration & login with JWT bearer tokens.
  - PBKDF2-HMAC-SHA256 password hashing.
  - Starts with clean zero data so each feature can be tested directly from the UI.

---

## 🗺️ End-to-End System Flowchart

```mermaid
flowchart TB
    U["👤 User"]

    subgraph UI["1. Frontend — React / Next.js"]
        AUTH["Sign Up / Login"]
        DASH["Dashboard"]
        DEC["New Decision"]
        CHAT["Just Ask — AI Chat"]
        PROFILE["Financial Profile & Expenses"]
        TIMELINE["Cashflow Timeline"]
        IMPORT["Upload CSV / JSON / PDF / Image"]
        HISTORY["Decision History"]
    end

    U --> AUTH
    AUTH --> DASH
    DASH --> DEC
    DASH --> PROFILE
    DASH --> TIMELINE
    DASH --> IMPORT
    DASH --> HISTORY
    DEC --> CHAT

    subgraph API["2. Backend — FastAPI / Python"]
        AUTHAPI["Authentication & User APIs"]
        TXAPI["Transactions & Import API"]
        PROFAPI["Profile, Bills & Recurring Income APIs"]
        DECAPI["Decision & Chat API"]
        HISTAPI["History API"]
    end

    AUTH --> AUTHAPI
    PROFILE --> PROFAPI
    TIMELINE --> PROFAPI
    IMPORT --> TXAPI
    DEC --> DECAPI
    CHAT --> DECAPI
    HISTORY --> HISTAPI

    subgraph INGEST["3. Transaction Ingestion Pipeline"]
        PARSE["Parse Files / OCR"]
        NORMAL["Normalize Dates, Amounts & Merchants"]
        DEDUP["Duplicate Detection"]
        CAT["Rule-Based Categorization"]
        CLASSIFY["Mesh LLM Fallback for Ambiguous Records"]
        REVIEW["User Reviews / Corrects Categories"]
    end

    TXAPI --> PARSE
    PARSE --> NORMAL --> DEDUP --> CAT
    CAT --> CLASSIFY
    CAT --> REVIEW
    CLASSIFY --> REVIEW

    subgraph DB["4. Database — SQLite MVP / PostgreSQL Production"]
        USERS[("Users & Financial Profiles")]
        TRANSACTIONS[("Transactions & Categories")]
        EVENTS[("Bills, Income & Timeline Events")]
        IMPORTS[("Import Jobs & Audit Records")]
        MESSAGES[("Chat Messages & Decision History")]
        SUMMARIES[("Monthly Spending Summaries")]
    end

    AUTHAPI <--> USERS
    PROFAPI <--> USERS
    PROFAPI <--> EVENTS
    TXAPI <--> TRANSACTIONS
    TXAPI <--> IMPORTS
    REVIEW --> TRANSACTIONS
    TRANSACTIONS --> SUMMARIES
    EVENTS --> SUMMARIES
    HISTAPI <--> MESSAGES
    DECAPI <--> MESSAGES

    subgraph ENGINE["5. Deterministic Financial Engine — Python"]
        STATE["Load Current Balance, Safety Reserve & Obligations"]
        HISTORYDATA["Analyze Monthly Spending & Category Trends"]
        BASELINE["Baseline Cashflow Forecast"]
        SCENARIO["Simulate Purchase / Goal Scenarios"]
        EMI["Calculate EMI, Interest, Fees & Total Cost"]
        SAFETY["Check Minimum Balance & Future Shortfalls"]
        COMPARE["Compare Full Payment vs EMI vs Wait"]
    end

    USERS --> STATE
    EVENTS --> STATE
    TRANSACTIONS --> HISTORYDATA
    SUMMARIES --> HISTORYDATA
    STATE --> BASELINE
    HISTORYDATA --> BASELINE
    DECAPI --> SCENARIO
    BASELINE --> SCENARIO
    SCENARIO --> EMI
    SCENARIO --> SAFETY
    EMI --> COMPARE
    SAFETY --> COMPARE

    subgraph AGENTS["6. AI Agent Orchestration — LangGraph"]
        COORD["Coordinator Agent"]
        ANALYST["Financial Analysis Agent"]
        FORECAST["Forecast & Scenario Agent"]
        ADVISOR["Decision Advisor Agent"]
        EXPLAIN["Explanation & Decision Audit"]
    end

    DECAPI --> COORD
    COORD --> ANALYST
    COORD --> FORECAST
    COORD --> ADVISOR
    STATE --> ANALYST
    HISTORYDATA --> ANALYST
    BASELINE --> FORECAST
    COMPARE --> ADVISOR
    ANALYST --> EXPLAIN
    FORECAST --> EXPLAIN
    ADVISOR --> EXPLAIN

    subgraph MESH["7. Mesh API — Required for FinPilot"]
        LLM["LLM Inference via Mesh API"]
    end

    ANALYST <--> LLM
    FORECAST <--> LLM
    ADVISOR <--> LLM
    CLASSIFY <--> LLM

    subgraph OUTPUT["8. Final User Experience"]
        RESULT["Personalized Financial Recommendation"]
        FULL["Pay in Full"]
        INSTALLMENT["Choose Suitable EMI"]
        WAIT["Wait / Save More"]
        REASONS["Reasons, Calculations & Risk Warnings"]
        SAVE["Save Decision & Supporting Evidence"]
    end

    EXPLAIN --> RESULT
    RESULT --> FULL
    RESULT --> INSTALLMENT
    RESULT --> WAIT
    RESULT --> REASONS
    REASONS --> SAVE
    SAVE --> MESSAGES
    RESULT --> DASH
    RESULT --> CHAT
    TRANSACTIONS --> TIMELINE
    EVENTS --> TIMELINE
    SUMMARIES --> DASH
```

---

## 🏗️ Architecture

```
SPENDLY/
├── backend/
│   └── src/
│       ├── api/               # FastAPI route controllers
│       │   ├── routes_dashboard.py
│       │   ├── routes_expenses.py
│       │   ├── routes_profile.py
│       │   └── routes_decisions.py
│       ├── auth/              # JWT Auth & Security
│       │   ├── jwt.py
│       │   ├── utils.py
│       │   ├── dependencies.py
│       │   └── routes.py
│       ├── db/                # SQLite & SQLAlchemy models
│       │   ├── database.py
│       │   ├── models.py
│       │   └── init_db.py
│       ├── engine/            # Financial math & timeline engine
│       │   └── calculator.py
│       └── main.py            # FastAPI application entry point
├── frontend/
│   ├── src/
│   │   ├── components/        # React components (Dashboard, Expenses, Timeline, etc.)
│   │   ├── api.js             # REST API client with JWT bearer tokens
│   │   ├── App.jsx            # Main app shell & view state
│   │   └── index.css          # Glassmorphism dark-mode design system
│   └── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
# Navigate to project root
cd SPENDLY

# Install Python dependencies
pip install fastapi uvicorn sqlalchemy pydantic pyjwt

# Run the backend API server (runs on port 8000)
python -m uvicorn backend.src.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be available at: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start Vite development server (runs on port 5173)
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Manual Testing & Zero-Data Mode

Spendly starts with **clean zero data**.
1. Open `http://localhost:5173`.
2. Click **Create an account** (or Login).
3. Set up your profile (Salary, Current Savings, Secure Minimum Reserve).
4. Add your upcoming bills (Rent, EMI, Rasan, etc.) with custom due dates.
5. Watch your **Safe to Spend Today** metric and Timeline update automatically!
