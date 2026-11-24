# FlowHCM Enterprise HRM & Payroll Platform

A full-stack, enterprise-grade Next.js HRM & Deterministic Payroll platform built directly to the **HRM and Payroll Build Specification v1.0** (benchmark based on FlowHCM capabilities).

---

## 🌟 Architecture & Core Features

### 1. Core HR & Workforce Lifecycle (P0)
- **Centralized Employee Directory (`/people`)**: Effective-dated assignments, worker codes (e.g. `E00412`), job history, and masked bank credentials.
- **Onboarding Lifecycle (`/people/onboarding`)**: Checklists categorized by HR, IT, and Finance with automatic validation of payroll-mandatory prerequisites before advancing from `Draft` &rarr; `Ready` &rarr; `Active`.
- **Separation & Full and Final Settlement (`/people/separation`)**: Sindh Standing Order 16 compliance with asset clearance, unavailed leave encashment (AL), notice pay, gratuity / PF, and loan recovery.

### 2. Time, Roster & Biometric Punch Engine (P0)
- **Attendance & Shifts (`/workforce`)**: Fixed Day (09:00–17:00), Evening, and Overnight shift pairing (22:00–06:00), grace periods, and overtime calculations.
- **Biometric Device Ingestion (`/workforce/devices`)**: Raw punch normalization stream, provenance metadata, and duplicate rejection.
- **Leave Balance Ledger (`/workforce/leave`)**: Double-entry balance ledger with real-time pre-submission **reservation holds** (`on_hold`), approval workflows, and unpaid leave feed to payroll cutoff.

### 3. Deterministic 5-Stage Payroll Pipeline (`/payroll`)
Strictly adheres to the specification's state machine:
1. **PAY-01 Draft**: Period parameter check, employee eligibility, and cutoff validation.
2. **PAY-02 Inputs Locked**: Materializes source inputs and computes immutable SHA-256 snapshot hash.
3. **PAY-03 Calculating & Review**: High-precision decimal arithmetic; generates explainable line-by-line formula traces.
4. **PAY-04 Pending Approval & Approved**: Enforces **Maker-Checker** segregation of duties (Maker cannot approve their own run).
5. **PAY-05 Closed**: Reconciled to Finance and archived.

#### 🎯 Worked Benchmark Fixture (Sam Rivera - E00412)
- Contractual monthly base: PKR 100,000.00
- Workdays: 19 payable / 20 scheduled (1 unpaid absence day deducted via proration: `100,000 * 19/20 = 95,000.00 PKR`)
- Approved overtime: 4 hours @ PKR 2,000.00/hr = `8,000.00 PKR`
- **Gross Earnings**: `103,000.00 PKR`
- Deductions: Fixture Withholding (`8,000.00 PKR`) + Salary Advance Installment (`1,000.00 PKR`) = `9,000.00 PKR`
- **Net Payable**: `94,000.00 PKR` (Exact match with document specification)

### 4. Jurisdiction & Statutory Compliance (`/payroll/compliance`)
- **FBR Section 149 (Income Tax Ordinance 2001)**: Progressive Tax Year 2027 withholding slabs (Finance Act 2026).
- **EOBI (Old-Age Benefits Act 1976)**: 1% employee contribution and 5% employer liability on statutory wage base (PKR 32,000).
- **SESSI (Sindh Social Security)**: 5% employer liability on wages under the statutory ceiling (PKR 37,000).
- **Minimum Wage Guard**: Sindh minimum wage floor check (PKR 37,000/month).
- **Statutory Exports**: FBR Section 164 salary certificates and Section 165 IRIS 2.0 format data.

### 5. Finance, Payments & Accounting (`/payroll/finance`)
- **1LINK Bank Advice Adapter**: Exports batch disbursement files with control hashes.
- **Settlement Reconciliation**: Confirmed rejection handling; only confirmed rejected/unpaid items can be retried in a new batch.
- **Balanced GL Double-Entry Journal**: Verifies balanced debits and credits by entity and cost center before posting.

### 6. Self-Service Portals (ESS / MSS)
- **Employee Self-Service (`/self-service`)**: Clock in/out with mobile GPS geofencing verification (Clifton 250m radius), leave balance projections, and official salary statements (PDF/Print ready).
- **Manager Self-Service (`/self-service/manager`)**: Team approval inbox, coverage validation (e.g. 7 of 9 present), and roster calendars.

### 7. Expanded HCM Modules (P1 & P2)
- **Recruitment & ATS (`/modules/recruitment`)**: Requisitions, candidate pipeline, 1-click hire-to-onboarding conversion.
- **Performance (`/modules/performance`)**: KPI appraisal templates, 360 review forms, and calibration.
- **Expense & Travel (`/modules/expenses`)**: Receipt attachments and routing to AP or Payroll.
- **Asset Management (`/modules/assets`)**: Hardware inventory, custody tracking, offboarding returns.
- **HR Letters (`/modules/letters`)**: Versioned templates and salary certificates with PDF export.
- **Help Desk (`/modules/helpdesk`)**: Internal support tickets with category-based routing and SLA tracking.

---

## 🗄️ Database Architecture & Supabase Integration

The platform features a **hybrid database architecture**:
- **Current Mode**: Local Storage Database (`LocalStorageDB` repository) with full relational integrity, foreign key references, and pre-seeded benchmark test data.
- **Supabase Cloud Sync Ready**: Pre-configured with Supabase client (`@supabase/supabase-js`). The full PostgreSQL schema DDL is available directly in `/settings` to run in any Supabase project.

---

## 🚀 Running the Project

```bash
# Install dependencies (already completed)
npm install

# Start development server
npm run dev

# Or build and start production server
npm run build
npm start
```
The application will be accessible at `http://localhost:3000`.

The Inter font is self-hosted via `next/font/google`, so it is downloaded from Google Fonts when the app is compiled: `npm run build` needs network access (and fails without it), while `npm run dev` falls back to the system font stack. Browsers never contact Google at runtime.

