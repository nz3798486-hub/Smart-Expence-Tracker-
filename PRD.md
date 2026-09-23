# Product Requirements Document (PRD): Smart Expense Tracker

## 1. Product Overview
- **Product Name**: Smart Expense Tracker
- **Target Audience**: Individuals, freelancers, and household managers wanting a mobile-first, comprehensive personal finance command center.
- **Value Proposition**: All-in-one financial tracking integrating income, expenses, category budgets with visual limits, savings funds, credit, debit, loans, and loan repayments with real-time automatic classification and responsive analytics.

## 2. Core Financial Data Model & Equations
### 2.1 Balance Calculation
- **Net Available Balance Formula**:
  $$\text{Available Balance} = (\text{Total Income} + \text{Loans Received}) - (\text{Total Expenses} + \text{Loan Repayments} + \text{Savings Deposits})$$
- **Total Income**: Sum of all transactions where `type === 'income'`.
- **Total Expenses**: Sum of all transactions where `type === 'expense'`.
- **Total Savings**: Sum of all transactions where `type === 'savings'`.
- **Credit Activity**: Sum of all `credit` transactions (tracks credit card / borrowed line spend).
- **Debit Activity**: Sum of all `debit` transactions (direct card / cash account debits).
- **Outstanding Loan Balance**:
  $$\text{Outstanding Loans} = \sum \text{Loans Received} - \sum \text{Loan Repayments}$$

### 2.2 Category & Budget Tracking
- Budget allocated per category per monthly cycle.
- Consumed amount: Sum of expenses in that category for the selected period.
- Remaining amount: `Budget - Consumed`.
- Health Status:
  - **Healthy**: $< 80\%$ of budget spent (Emerald/Neutral).
  - **Approaching Limit**: $80\% - 100\%$ spent (Amber warning).
  - **Exceeded**: $> 100\%$ spent (Rose/Red alert).

## 3. Transaction Types & Schema
Each transaction record stores:
- `id`: Unique identifier (string).
- `amount`: Positive numeric value ($> 0$).
- `type`: `'expense' | 'income' | 'credit' | 'debit' | 'savings' | 'loan' | 'loan_repayment'`.
- `category`: Category identifier (e.g., `'food'`, `'health'`, `'transportation'`, `'education'`, `'electricity'`, `'utilities'`, `'shopping'`, `'housing'`, `'entertainment'`, `'other'`).
- `description`: Text string describing the transaction.
- `date`: ISO Date string (`YYYY-MM-DD`).
- `time`: Time string (`HH:MM`).
- `currency`: Currency code (e.g. `'USD'`, `'EUR'`, `'GBP'`, `'JPY'`, `'INR'`, `'CAD'`, `'AUD'`, `'AED'`, `'SGD'`).
- `createdAt`: Unix timestamp for deterministic sorting.

## 4. Automatic Category Classification (Smart Engine)
- Substring and word token matcher with 60+ keywords across key categories:
  - **Food**: groceries, supermarket, restaurant, starbucks, dinner, lunch, breakfast, bakery, cafe, pizza, doordash, uber eats, mcdonalds.
  - **Health**: doctor, pharmacy, medicine, dentist, clinic, prescription, hospital, health insurance, workout, gym, therapy, vitamins.
  - **Transportation**: uber, lyft, taxi, bus, metro, subway, gas, fuel, parking, toll, transit, flight, train, petrol.
  - **Education**: course, tuition, udemy, book, school, college, training, cert, bootcamp, tutorial, supplies.
  - **Electricity**: power, electric, hydro, energy, edison, electricity bill.
  - **Utility Bills**: water bill, gas bill, internet, wifi, broadband, cell phone, verizon, at&t, sewer, trash, trash collection.
  - **Shopping**: amazon, clothes, apparel, shoes, zara, nike, electronics, apple, target, walmart, cosmetics, mall.
  - **Housing**: rent, mortgage, hoa, maintenance, repair, lease, furniture, condo, property tax.
  - **Entertainment**: netflix, spotify, cinema, movie, gaming, steam, concert, disney, hulu, pub, bar, party, event.
  - **Other**: fallback for non-matches.
- Manual override: Single tap category picker in the modal with instant visual update.

## 5. User Interface & Mobile-First Architecture
### 5.1 Mobile Bottom Navigation (Ergonomic Thumb-Zone)
1. **Dashboard**: High-level KPI cards, quick balance overview, monthly budget consumption ring, recent transactions feed.
2. **Transactions**: Complete transaction ledger, real-time search, filters (type, category, date range), inline edit & delete.
3. **Budget**: Visual budget bars for each spending category, add/edit category budgets, over-budget alerts.
4. **Analytics**: Spending by category donut chart, Income vs Expense bar comparison, 7-day spending trends, credit vs debit breakdown, savings velocity.
5. **Loans & Savings / More**:
   - Outstanding loans list & instant repayment trigger.
   - Savings goals & progress tracker.
   - Currency switcher (9 major currencies with custom symbols).
   - Data backup, export to CSV/JSON, sample data seed, and local storage persistence.

### 5.2 Floating Quick Add Action
- Accessible from any screen: Prominent bottom action button opening a bottom sheet/modal with real-time smart categorization, date & time defaults to now, and instant validation.

## 6. Visual Design Principles (Anti-Slop Compliance)
- **Zero-Pill Static Metadata**: Clean unboxed typographic layout with subtle dots (`·`) and separators.
- **60-30-10 Palette**: Warm slate/zinc neutral backdrop (60%), clean white elevated cards with crisp hairline borders (30%), energetic emerald & indigo accents for actions and gains, refined amber/rose for alerts (10%).
- **Tabular Figures**: `font-mono tabular-nums` for all financial numbers and percentages to guarantee vertical alignment.
- **Touch Targets**: Minimum $44\text{px} \times 44\text{px}$ on all interactive buttons and inputs.
- **Desktop/Tablet Adaptability**: Fluid max-width container ($1180\text{px}$) with responsive multi-column layouts on larger screens while maintaining thumb-first mobile ergonomics.
