// Complete TypeScript definitions for HRM & Payroll System
// Aligned with HRM and Payroll Build Specification v1.0

export type EntityId = string;
export type EmploymentId = string;
export type PersonId = string;

export interface LegalEntity {
  id: string;
  tenant_id: string;
  name: string;
  code: string;
  country: string;
  base_currency: string;
  registration_number: string;
  ntn_number: string;
}

export interface Site {
  id: string;
  entity_id: string;
  name: string;
  timezone: string;
  jurisdiction: string; // e.g. "Sindh, Pakistan" or "Punjab, Pakistan"
  address: string;
  latitude?: number;
  longitude?: number;
  geofence_radius_meters?: number;
}

export interface OrgUnit {
  id: string;
  entity_id: string;
  name: string;
  code: string;
  parent_id?: string;
  head_employment_id?: string;
}

export interface PayGroup {
  id: string;
  entity_id: string;
  name: string;
  currency: string;
  frequency: 'monthly' | 'biweekly' | 'weekly';
  calendar_id: string;
  cutoff_day: number; // e.g. 25th of month
  payment_day: number; // e.g. 30th of month
}

export interface Person {
  id: string;
  tenant_id: string;
  first_name: string;
  last_name: string;
  national_id: string; // e.g. CNIC
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
}

export type EmploymentStatus = 'Draft' | 'Ready' | 'Active' | 'Separation scheduled' | 'Separated';

export interface Employment {
  id: string;
  entity_id: string;
  person_id: string;
  worker_code: string; // e.g. "E00412"
  worker_type: 'Full-time' | 'Contractor' | 'Part-time' | 'Intern';
  hire_date: string;
  confirmation_date?: string;
  end_date?: string;
  status: EmploymentStatus;
  notice_period_days: number;
}

export interface AssignmentVersion {
  id: string;
  employment_id: string;
  org_unit_id: string;
  site_id: string;
  manager_employment_id?: string;
  job_title: string;
  grade_id: string;
  pay_group_id: string;
  shift_id: string;
  valid_from: string;
  valid_to: string; // "9999-12-31" for active
  reason?: string;
}

export interface PayoutInstruction {
  id: string;
  employment_id: string;
  bank_name: string;
  account_number: string; // masked in UI: "PK36MEZN****5678"
  account_title: string;
  iban: string;
  branch_code: string;
  verification_state: 'Unverified' | 'Pending' | 'Verified' | 'Rejected';
  valid_from: string;
  valid_to: string;
}

export interface OnboardingCase {
  id: string;
  employment_id: string;
  candidate_name: string;
  job_title: string;
  department: string;
  start_date: string;
  status: 'Draft' | 'Ready' | 'Active';
  tasks: {
    id: string;
    title: string;
    category: 'HR' | 'IT' | 'Finance' | 'Employee';
    assigned_role: string;
    due_date: string;
    completed: boolean;
    mandatory_for_payroll: boolean;
  }[];
}

export interface SeparationCase {
  id: string;
  employment_id: string;
  worker_code: string;
  employee_name: string;
  separation_type: 'Resignation' | 'Termination' | 'Contract End' | 'Retirement';
  resignation_date: string;
  last_working_day: string;
  status: 'Scheduled' | 'Clearance' | 'Settled' | 'Archived';
  clearance_checklist: {
    id: string;
    department: 'IT Assets' | 'Finance/Loans' | 'HR' | 'Line Manager';
    item: string;
    cleared: boolean;
    remarks?: string;
  }[];
  settlement_dues?: {
    prorated_salary: number;
    unavailed_leave_encashment: number;
    notice_pay: number;
    gratuity_or_pf: number;
    loan_recovery: number;
    net_settlement: number;
  };
}

// Workforce: Shifts & Attendance
export interface ShiftTemplate {
  id: string;
  name: string;
  start_time: string; // "09:00"
  end_time: string;   // "17:00" or next day e.g. "06:00"
  is_overnight: boolean;
  grace_period_mins: number; // e.g. 15 mins
  half_day_threshold_mins: number; // 240 mins
  unpaid_break_mins: number; // 60 mins
  color: string;
}

export interface PunchEvent {
  id: string;
  connector_id: string;
  external_id: string;
  employment_id: string;
  occurred_at: string; // ISO UTC
  received_at: string;
  source: 'Biometric' | 'Mobile' | 'Web' | 'Manual';
  latitude?: number;
  longitude?: number;
  geofence_status?: 'In_Bounds' | 'Out_Of_Bounds' | 'GPS_Unavailable';
}

export interface WorkDay {
  id: string;
  employment_id: string;
  local_date: string; // YYYY-MM-DD
  shift_id: string;
  check_in?: string;
  check_out?: string;
  status: 'Present' | 'Late' | 'Half_Day' | 'Absent' | 'On_Leave' | 'Rest_Day' | 'Holiday';
  late_minutes: number;
  early_departure_minutes: number;
  worked_hours: number;
  regular_payable_hours: number;
  overtime_hours: number;
  overtime_status: 'None' | 'Pending' | 'Approved' | 'Rejected';
  exceptions: string[]; // ["Missing out-punch", "Overnight shift paired"]
}

// Leave Ledger & Requests
export interface LeavePolicy {
  id: string;
  code: string; // e.g. "AL" (Annual), "SL" (Sick), "CL" (Casual), "UL" (Unpaid)
  name: string;
  annual_entitlement_days: number;
  is_paid: boolean;
  accrual_frequency: 'Annual_Grant' | 'Monthly_Accrual';
  max_carry_forward_days: number;
  allow_encashment: boolean;
}

export interface LeaveBalanceLedger {
  id: string;
  employment_id: string;
  policy_id: string;
  policy_code: string;
  total_entitlement: number;
  accrued: number;
  used: number;
  on_hold: number; // Pending approval
  available: number;
}

export interface LeaveRequest {
  id: string;
  employment_id: string;
  policy_id: string;
  policy_code: string;
  start_date: string;
  end_date: string;
  units: number; // Days or half-days (e.g. 1.0 or 0.5)
  reason: string;
  attachment_url?: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Withdrawn' | 'Cancellation_Requested' | 'Cancelled';
  submitted_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
}

// Payroll Engine
export type RunType = 'Regular' | 'Off-cycle' | 'Final';
export type RunState = 'Draft' | 'Inputs_Locked' | 'Calculating' | 'Review' | 'Pending_Approval' | 'Approved' | 'Closed';

export interface PayPeriod {
  id: string;
  pay_group_id: string;
  name: string; // "October 2026"
  start_on: string;
  end_on: string;
  cut_off_at: string;
  pay_on: string;
  workdays_count: number;
}

export interface InputSnapshot {
  id: string;
  run_id: string;
  revision_no: number;
  hash: string; // sha256 hash
  created_at: string;
  employee_count: number;
  total_base_compensation: number;
  total_overtime_hours: number;
  total_unpaid_days: number;
  payload: Record<string, any>;
}

export interface CompensationLine {
  id: string;
  component_code: string;
  component_name: string;
  type: 'Earning' | 'Deduction' | 'Employer_Contribution';
  amount: number;
  is_taxable: boolean;
}

export interface EmployeeCompensation {
  id: string;
  employment_id: string;
  currency: string;
  base_salary: number; // e.g. 100,000 PKR
  lines: CompensationLine[];
  valid_from: string;
  valid_to: string;
}

export interface Loan {
  id: string;
  employment_id: string;
  loan_type: 'Salary Advance' | 'Personal Loan' | 'Emergency Aid';
  principal: number;
  installment_amount: number;
  remaining_balance: number;
  status: 'Active' | 'Paid_Off' | 'Suspended';
}

export interface CalculationTraceLine {
  component_code: string;
  component_name: string;
  type: 'Earning' | 'Deduction' | 'Employer_Contribution';
  formula_expression: string;
  rate?: number;
  quantity?: number;
  amount: number;
  source_ref: string;
  reason?: string;
}

export interface EmployeeResult {
  id: string;
  revision_id: string;
  employment_id: string;
  worker_code: string;
  employee_name: string;
  job_title: string;
  department: string;
  bank_name: string;
  bank_account_masked: string;
  contractual_base: number;
  payable_workdays: number;
  scheduled_workdays: number;
  unpaid_days: number;
  overtime_hours: number;
  overtime_rate: number;
  gross_earnings: number;
  withheld_tax: number;
  eobi_employee: number;
  sessi_employee: number;
  loan_deductions: number;
  total_deductions: number;
  employer_eobi: number;
  employer_sessi: number;
  net_payable: number;
  currency: string;
  status: 'Clean' | 'Warning' | 'Blocked';
  blocker_reasons: string[];
  trace_lines: CalculationTraceLine[];
}

export interface PayrollRun {
  id: string;
  period_id: string;
  period_name: string;
  entity_id: string;
  pay_group_id: string;
  run_type: RunType;
  state: RunState;
  currency: string;
  version: number;
  approved_revision_id?: string;
  employee_count: number;
  total_gross: number;
  total_withheld: number;
  total_net: number;
  total_employer_cost: number;
  maker_id: string;
  approver_id?: string;
  approval_timestamp?: string;
  rejection_reason?: string;
  snapshot_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface BankPaymentBatch {
  id: string;
  run_id: string;
  reference: string; // e.g. "BATCH-PKR-202610-01"
  adapter: 'Standard_1LINK' | 'HBL_Direct' | 'Meezan_Corporate' | 'Generic_CSV';
  control_total: number;
  total_count: number;
  file_hash: string;
  state: 'Prepared' | 'Exported' | 'Submitted' | 'Reconciled' | 'Partial_Failure';
  created_at: string;
  items: {
    id: string;
    employee_result_id: string;
    worker_code: string;
    employee_name: string;
    account_number: string;
    bank_name: string;
    amount: number;
    state: 'Prepared' | 'Settled' | 'Rejected';
    failure_reason?: string;
  }[];
}

export interface JournalBatch {
  id: string;
  run_id: string;
  posting_reference: string;
  posting_date: string;
  total_debit: number;
  total_credit: number;
  is_balanced: boolean;
  state: 'Draft' | 'Posted';
  lines: {
    id: string;
    account_code: string;
    account_name: string;
    cost_center: string;
    debit: number;
    credit: number;
  }[];
}

// Expanded Modules: Recruitment, Performance, Expenses, Assets, Letters, Helpdesk
export interface JobRequisition {
  id: string;
  title: string;
  department: string;
  positions_count: number;
  budget_min: number;
  budget_max: number;
  status: 'Draft' | 'Approved' | 'Open' | 'Closed';
}

export interface Candidate {
  id: string;
  requisition_id: string;
  full_name: string;
  email: string;
  phone: string;
  stage: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
  offered_salary?: number;
  created_at: string;
}

export interface PerformanceReview {
  id: string;
  employment_id: string;
  employee_name: string;
  cycle_name: string; // "Annual Review 2026"
  goals: { id: string; title: string; weight: number; self_rating: number; manager_rating: number }[];
  overall_score: number;
  status: 'Self_Review' | 'Manager_Review' | 'Calibrated' | 'Completed';
  recommended_increment_pct?: number;
}

export interface ExpenseClaim {
  id: string;
  employment_id: string;
  employee_name: string;
  category: 'Travel' | 'Client Entertainment' | 'Fuel' | 'Office Supplies';
  original_amount: number;
  currency: string;
  settlement_amount_pkr: number;
  receipt_url?: string;
  reimbursement_channel: 'Payroll' | 'Accounts_Payable';
  status: 'Submitted' | 'Approved' | 'Reimbursed' | 'Rejected';
}

export interface EmployeeAsset {
  id: string;
  asset_tag: string;
  name: string;
  category: 'Laptop' | 'Monitor' | 'Mobile Phone' | 'Access Card';
  custodian_employment_id: string;
  custodian_name: string;
  issued_date: string;
  condition: 'New' | 'Good' | 'Damaged';
  status: 'In_Use' | 'Returned' | 'Clearance_Pending';
}

export interface HrLetterTemplate {
  id: string;
  code: string;
  name: string; // e.g. "Employment Verification Letter", "Salary Certificate"
  body_template: string;
  version: number;
}

export interface HelpDeskTicket {
  id: string;
  employment_id: string;
  employee_name: string;
  category: 'Payroll Inquiry' | 'IT Support' | 'HR Policy' | 'Medical Insurance';
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In_Progress' | 'Resolved' | 'Closed';
  created_at: string;
}

export interface PieceWorkBatch {
  id: string;
  worker_code: string;
  worker_name: string;
  unit_description: string;
  rate_per_unit: number;
  units_produced: number;
  total_amount: number;
  date_logged: string;
  status: 'Pending' | 'Verified' | 'Approved_To_Payroll';
}
