# Spendly — Project Overview and MVP Requirements

## 1. Project Overview

Spendly is a friendly, AI-powered personal finance management application that helps users manage their money, track upcoming payments, and make better financial decisions.

The application allows users to maintain their financial profile, manage income and expenses, view upcoming financial obligations, and consult an AI financial assistant before making a purchase or other financial decision.

The current MVP will focus on the following core modules.

## 2. Authentication

Users should be able to sign up and log in to Spendly.

After successful login, users should be redirected to their dashboard. Each user's financial information, transactions, expenses, timeline events, and decision history must be associated with their account.

## 3. Dashboard

The dashboard should provide a clear overview of the user's current financial situation.

It should display:

- **Current Savings/Balance:** The amount the user has manually entered as their current savings or available balance.
- **Minimum Safety Balance:** The minimum amount the user prefers to keep reserved for financial security.
- **Upcoming Bills:** The total amount of unpaid bills and obligations due during the current month.
- **Upcoming Payment Timeline:** A chronological view of upcoming payments, including their dates, descriptions, and amounts.
- **Recent AI Chats:** The user's most recent conversations and financial decisions made with the Spendly assistant.

### Payment Status Management

Each bill or payment should have a payment status. When the user marks a bill as paid, its status must be updated in the database.

Paid bills must be excluded from the total upcoming unpaid bills for the current month. The dashboard should recalculate the total automatically using the updated database records.

## 4. Transaction Import and Categorization

Users should be able to upload financial transaction data in the following formats:

- CSV files
- JSON files
- PDF documents
- Images, such as transaction screenshots or bills

The backend should extract the relevant transaction information, validate it, normalize it into a standard format, categorize it, and save the records in the database.

Each transaction should contain relevant details such as the transaction date, amount, description or merchant, transaction type, and assigned category.

Transactions should be categorized into appropriate categories, including:

- Grocery
- Medical
- Rent
- Shopping
- Bakery
- Restaurant
- Travel and Tourism
- Transport
- Utilities and Bills
- EMI and Loan Payments
- Entertainment
- Education
- Subscriptions
- Income
- Transfers
- Other

Categorization should depend on the actual transaction details, using merchant matching, classification rules, and AI assistance when necessary. Users should also be able to correct an incorrect category.

The system should prevent duplicate imports and validate extracted information before saving it.

## 5. New Decision

The sidebar should include a **New Decision** section with two options.

### A. Build Manually

Users should be able to complete a form describing the purchase, goal, or financial decision they want to evaluate.

The form should collect the relevant information, such as:

- Purchase or goal description
- Expected amount
- Planned purchase date or deadline
- Purchase priority
- Preferred payment method
- Available full-payment or installment options, where applicable

The system should use the submitted information and the user's existing financial data to evaluate the decision.

The AI financial assistant should compare suitable scenarios and provide a recommendation from these three main outcomes:

1. **Pay in Full:** Recommend a full payment when the projected financial situation supports it.
2. **Pay Through EMI:** Recommend a suitable installment plan, including the suggested upfront payment, installment amount, tenure, and applicable cost assumptions.
3. **Wait:** Recommend delaying the purchase when proceeding could compromise the user's financial safety or other obligations.

The recommendation must be based on actual financial calculations and projected cash flow, rather than the language model's judgment alone.

### B. Just Ask

Users should also be able to communicate directly with the AI financial assistant without completing a structured form.

For example, users could ask:

- Can I afford to buy a laptop this month?
- Should I buy a car now or wait?
- Can I afford an upcoming trip?
- Will an EMI affect my savings goals?
- How much money can I safely spend?

The assistant should load the relevant financial state from the database using dedicated tools. This may include the user's current balance, minimum safety balance, income, expenses, upcoming bills, recurring obligations, and relevant historical transactions.

The assistant should then use this information to analyze the question, simulate financial scenarios where necessary, and provide a specific recommendation with a clear explanation.

## 6. Decision History

The sidebar should include a **Decision History** section.

Users should be able to revisit their previous AI conversations and financial decisions.

The system should persist:

- User questions and relevant decision inputs
- AI responses and recommendations
- Compared payment scenarios
- Supporting financial calculations or forecast results
- Reasons and evidence behind each recommendation
- Decision timestamps and relevant status information

The history page should make it easy for users to review what they asked, what Spendly recommended, and why the recommendation was made.

Recent conversations from this history should also be displayed on the dashboard.

## 7. Expenses and Financial Profile

The sidebar should include an **Expenses** or **Financial Profile** section where users can enter and update their financial information manually.

### Financial Profile

Users should be able to manage:

- Starting savings or current available balance
- Preferred minimum safety balance
- Monthly income
- Essential expenses
- Existing financial obligations

These values should be saved in the database and used to calculate the dashboard summary and support financial decisions.

### Monthly Expenses and Recurring Obligations

Users should be able to add their income, expenses, bills, and recurring payments, including:

- Salary and other income
- House rent
- Credit card bills
- EMIs and loan repayments
- Grocery and household expenses
- Housekeeper payments
- Travel expenses
- Utilities and other bills

Each entry should support the relevant information, such as its description, amount, category, due date, recurrence frequency, and payment status.

Users should be able to create, view, update, and delete these entries.

Recurring items should generate the appropriate dated financial events without creating duplicate obligations. The same financial event must not be counted more than once in calculations.

## 8. Financial Timeline

Spendly should maintain a chronological timeline of the user's financial events.

The timeline should include relevant items such as:

- Upcoming rent payments
- Salary and other expected income
- Credit card bills
- EMIs
- Housekeeper payments
- Other recurring expenses
- Planned purchases and other future financial commitments

Each event should have a date, description, amount, event type, and relevant status.

### Timeline Inclusion Option

Users should have a **Yes/No option** to control whether an eligible event is included in their timeline and financial forecast.

- **Yes:** Include the event in the relevant timeline or forecast.
- **No:** Exclude the event from the relevant view or calculation while retaining its database record.

Removing an event from the timeline should not automatically delete its underlying financial record. Actual transactions and planned future events must remain distinguishable.

The timeline API should return events in chronological order and support filtering by date range, month, category, or status.

## 9. Dashboard Calculations and Financial State

Dashboard values should be calculated from the user's saved financial data, not maintained as unrelated, manually updated totals.

The dashboard backend should calculate:

- Current available balance based on the defined balance model
- Minimum safety balance
- Total unpaid bills due during the selected month
- Upcoming income and expenses
- Month-wise spending and income summaries
- Remaining projected balance after relevant obligations
- Relevant upcoming financial events

When a user marks a bill as paid, adds a new expense, changes an event's inclusion status, or updates their financial profile, the relevant dashboard calculations should reflect the change.

The backend must handle dates and payment statuses consistently to prevent incorrect totals and double-counting.

## 10. AI Financial Agent and Decision Calculations

Spendly's financial assistant should use database-backed tools to retrieve the information needed for each financial question.

The decision workflow should combine:

1. Loading relevant financial data
2. Understanding the user's request
3. Retrieving income, expenses, bills, and financial obligations
4. Calculating the baseline financial forecast
5. Simulating the proposed purchase or decision
6. Comparing full payment, EMI, partial payment, and waiting scenarios where applicable
7. Checking whether the projected balance remains above the user's required safety limit
8. Producing a recommendation with its reasoning and supporting evidence
9. Saving the result in decision history

Financial calculations, such as projected balances, EMI amounts, payment schedules, and minimum-balance checks, should be handled by deterministic backend logic. The AI agent should use these calculated results to help select and explain an appropriate course of action.

For the FinPilot challenge, **all LLM and AI model calls must go through the Mesh API**. Direct model calls outside Mesh are not permitted for that submission.

## 11. Backend APIs and Database

The backend should expose APIs to support:

- Authentication and user financial profiles
- Transaction uploads and import-status tracking
- Transaction listing, categorization, and correction
- Monthly expense and recurring-obligation management
- Timeline creation, listing, and inclusion-status updates
- Payment-status updates
- Dashboard financial summaries
- AI assistant conversations
- Decision history retrieval

SQLite can be used for the MVP. The database should maintain consistent relationships between users, transactions, categories, financial profiles, expenses, timeline events, and AI conversations.

The backend should also implement input validation, error handling, logging, duplicate detection, and automated tests.

## 12. Current MVP Scope

The initial version of Spendly will focus on:

- User signup and login
- Dashboard with current savings, safety balance, and unpaid upcoming bills
- Transaction upload and categorization
- Manual financial profile and expense management
- Recurring income and obligation tracking
- Chronological financial timeline with inclusion controls
- Payment status updates
- Manual financial decision forms
- Direct AI chat through Just Ask
- Database-backed financial tools
- Full payment, EMI, and wait recommendations
- Persistent decision history

Advanced bank integrations, live transaction synchronization, complex predictive machine learning models, and other nonessential capabilities can be considered later.

## Final Goal

Spendly should provide a single place where users can manage their financial information, track upcoming obligations, understand their current financial position, and evaluate important spending decisions before committing their money.

**Core principle: The database provides the financial facts, the calculation engine evaluates the numbers, and the AI assistant turns the results into clear, explainable recommendations.**