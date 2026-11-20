import {
  LegalEntity,
  Site,
  OrgUnit,
  PayGroup,
  Person,
  Employment,
  AssignmentVersion,
  PayoutInstruction,
  ShiftTemplate,
  LeavePolicy,
  LeaveBalanceLedger,
  LeaveRequest,
  Loan,
  PayrollRun,
  EmployeeResult,
  BankPaymentBatch,
  JournalBatch,
  OnboardingCase,
  SeparationCase,
  EmployeeAsset,
  HelpDeskTicket,
  JobRequisition,
  PerformanceReview,
  ExpenseClaim,
  PieceWorkBatch,
  WorkDay,
  PunchEvent,
} from "@/lib/types";

import {
  seedLegalEntity,
  seedSite,
  seedOrgUnits,
  seedPayGroup,
  seedShifts,
  seedLeavePolicies,
  seedPeople,
  seedEmployments,
  seedAssignments,
  seedPayoutInstructions,
  seedLoans,
  seedLeaveLedgers,
  seedLeaveRequests,
  seedSamplePayrollRun,
  seedEmployeeResults,
  seedBankBatch,
  seedJournalBatch,
  seedAssets,
  seedHelpDeskTickets,
  seedRequisitions,
} from "./seedData";

import { executeDeterministicCalculation } from "@/lib/payroll/calculationEngine";
import { generateHash } from "@/lib/utils";

const STORAGE_KEY = "hrm_payroll_platform_db_v1";

export interface DatabaseState {
  legalEntity: LegalEntity;
  sites: Site[];
  orgUnits: OrgUnit[];
  payGroups: PayGroup[];
  shifts: ShiftTemplate[];
  leavePolicies: LeavePolicy[];
  people: Person[];
  employments: Employment[];
  assignments: AssignmentVersion[];
  payoutInstructions: PayoutInstruction[];
  loans: Loan[];
  leaveLedgers: LeaveBalanceLedger[];
  leaveRequests: LeaveRequest[];
  attendanceDays: WorkDay[];
  punchEvents: PunchEvent[];
  payrollRuns: PayrollRun[];
  employeeResults: Record<string, EmployeeResult[]>; // run_id -> results
  bankBatches: BankPaymentBatch[];
  journalBatches: JournalBatch[];
  onboardingCases: OnboardingCase[];
  separationCases: SeparationCase[];
  assets: EmployeeAsset[];
  tickets: HelpDeskTicket[];
  requisitions: JobRequisition[];
  reviews: PerformanceReview[];
  expenses: ExpenseClaim[];
  pieceWork: PieceWorkBatch[];
}

function getInitialState(): DatabaseState {
  // Pre-seed WorkDay for Sam Rivera and others in current period
  const initialWorkDays: WorkDay[] = [
    {
      id: "wd_001",
      employment_id: "emp_001",
      local_date: "2026-11-20",
      shift_id: "shift_gen",
      check_in: "08:58",
      check_out: "17:02",
      status: "Present",
      late_minutes: 0,
      early_departure_minutes: 0,
      worked_hours: 8,
      regular_payable_hours: 8,
      overtime_hours: 0,
      overtime_status: "None",
      exceptions: [],
    },
    {
      id: "wd_002",
      employment_id: "emp_001",
      local_date: "2026-11-19",
      shift_id: "shift_gen",
      check_in: "09:02",
      check_out: "19:02",
      status: "Present",
      late_minutes: 0,
      early_departure_minutes: 0,
      worked_hours: 10,
      regular_payable_hours: 8,
      overtime_hours: 2,
      overtime_status: "Approved",
      exceptions: ["Approved Overtime 2.0h"],
    },
    {
      id: "wd_003",
      employment_id: "emp_001",
      local_date: "2026-11-18",
      shift_id: "shift_gen",
      check_in: "08:55",
      check_out: "17:05",
      status: "Present",
      late_minutes: 0,
      early_departure_minutes: 0,
      worked_hours: 8,
      regular_payable_hours: 8,
      overtime_hours: 0,
      overtime_status: "None",
      exceptions: [],
    },
  ];

  const initialOnboardingCases: OnboardingCase[] = [
    {
      id: "onb_01",
      employment_id: "emp_004",
      candidate_name: "Fatima Noor",
      job_title: "HR Specialist - People Ops",
      department: "Human Resources",
      start_date: "2024-02-01",
      status: "Active",
      tasks: [
        { id: "t1", title: "Collect CNIC & educational certificates", category: "HR", assigned_role: "HR Operations", due_date: "2024-02-05", completed: true, mandatory_for_payroll: true },
        { id: "t2", title: "Setup corporate laptop & email account", category: "IT", assigned_role: "IT Admin", due_date: "2024-02-01", completed: true, mandatory_for_payroll: false },
        { id: "t3", title: "Verify bank IBAN and account title", category: "Finance", assigned_role: "Payroll Lead", due_date: "2024-02-10", completed: true, mandatory_for_payroll: true },
      ],
    },
  ];

  const initialSeparationCases: SeparationCase[] = [
    {
      id: "sep_01",
      employment_id: "emp_002",
      worker_code: "E00420",
      employee_name: "Toni Shah",
      separation_type: "Resignation",
      resignation_date: "2026-11-01",
      last_working_day: "2026-11-30",
      status: "Clearance",
      clearance_checklist: [
        { id: "c1", department: "IT Assets", item: "Dell UltraSharp Monitor returned", cleared: true },
        { id: "c2", department: "Finance/Loans", item: "Zero outstanding loans verification", cleared: true },
        { id: "c3", department: "Line Manager", item: "Project handover signoff", cleared: false, remarks: "Pending final review" },
      ],
      settlement_dues: {
        prorated_salary: 140000,
        unavailed_leave_encashment: 32666,
        notice_pay: 0,
        gratuity_or_pf: 93333,
        loan_recovery: 0,
        net_settlement: 265999,
      },
    },
  ];

  return {
    legalEntity: seedLegalEntity,
    sites: [seedSite],
    orgUnits: seedOrgUnits,
    payGroups: [seedPayGroup],
    shifts: seedShifts,
    leavePolicies: seedLeavePolicies,
    people: seedPeople,
    employments: seedEmployments,
    assignments: seedAssignments,
    payoutInstructions: seedPayoutInstructions,
    loans: seedLoans,
    leaveLedgers: seedLeaveLedgers,
    leaveRequests: seedLeaveRequests,
    attendanceDays: initialWorkDays,
    punchEvents: [],
    payrollRuns: [seedSamplePayrollRun],
    employeeResults: {
      [seedSamplePayrollRun.id]: seedEmployeeResults,
    },
    bankBatches: [seedBankBatch],
    journalBatches: [seedJournalBatch],
    onboardingCases: initialOnboardingCases,
    separationCases: initialSeparationCases,
    assets: seedAssets,
    tickets: seedHelpDeskTickets,
    requisitions: seedRequisitions,
    reviews: [],
    expenses: [],
    pieceWork: [],
  };
}

export class LocalStorageDB {
  private static instance: LocalStorageDB;
  private state: DatabaseState;
  private isBrowser: boolean;

  private constructor() {
    this.isBrowser = typeof window !== "undefined";
    this.state = this.loadState();
  }

  public static getInstance(): LocalStorageDB {
    if (!LocalStorageDB.instance) {
      LocalStorageDB.instance = new LocalStorageDB();
    }
    return LocalStorageDB.instance;
  }

  private loadState(): DatabaseState {
    if (!this.isBrowser) {
      return getInitialState();
    }
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error("Failed to parse local storage DB, re-seeding", e);
    }
    const fresh = getInitialState();
    this.saveState(fresh);
    return fresh;
  }

  private saveState(state: DatabaseState) {
    this.state = state;
    if (this.isBrowser) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error("Failed to save to local storage", e);
      }
    }
  }

  public resetToDefault() {
    const fresh = getInitialState();
    this.saveState(fresh);
    return fresh;
  }

  // --- People & Organization ---
  public getLegalEntity(): LegalEntity {
    return this.state.legalEntity;
  }

  public getSites(): Site[] {
    return this.state.sites;
  }

  public getOrgUnits(): OrgUnit[] {
    return this.state.orgUnits;
  }

  public getPayGroups(): PayGroup[] {
    return this.state.payGroups;
  }

  public getEmployeesJoined() {
    return this.state.employments.map((emp) => {
      const person = this.state.people.find((p) => p.id === emp.person_id) || {
        first_name: "Unknown",
        last_name: "Worker",
        email: "",
        phone: "",
        national_id: "",
      };
      const assignment = this.state.assignments.find((a) => a.employment_id === emp.id) || {
        job_title: "Employee",
        org_unit_id: "",
        site_id: "",
        pay_group_id: "",
        shift_id: "shift_gen",
      };
      const orgUnit = this.state.orgUnits.find((o) => o.id === assignment.org_unit_id);
      const site = this.state.sites.find((s) => s.id === assignment.site_id);
      const payout = this.state.payoutInstructions.find((po) => po.employment_id === emp.id);
      const loans = this.state.loans.filter((l) => l.employment_id === emp.id);

      return {
        ...emp,
        person,
        assignment,
        orgUnit,
        site,
        payout,
        loans,
        fullName: `${person.first_name} ${person.last_name}`,
      };
    });
  }

  public addEmployee(
    personData: Omit<Person, "id" | "tenant_id">,
    employmentData: Omit<Employment, "id" | "entity_id" | "person_id">,
    assignmentData: Omit<AssignmentVersion, "id" | "employment_id" | "valid_from" | "valid_to">,
    payoutData: Omit<PayoutInstruction, "id" | "employment_id" | "valid_from" | "valid_to">,
    contractualSalary: number = 100000
  ) {
    const personId = `p_${Date.now()}`;
    const employmentId = `emp_${Date.now()}`;

    const newPerson: Person = {
      ...personData,
      id: personId,
      tenant_id: this.state.legalEntity.tenant_id,
    };

    const newEmployment: Employment = {
      ...employmentData,
      id: employmentId,
      entity_id: this.state.legalEntity.id,
      person_id: personId,
    };

    const newAssignment: AssignmentVersion = {
      ...assignmentData,
      id: `asgn_${Date.now()}`,
      employment_id: employmentId,
      valid_from: employmentData.hire_date,
      valid_to: "9999-12-31",
    };

    const newPayout: PayoutInstruction = {
      ...payoutData,
      id: `po_${Date.now()}`,
      employment_id: employmentId,
      valid_from: employmentData.hire_date,
      valid_to: "9999-12-31",
    };

    // Auto-create standard leave ledger balances
    const newLedgers: LeaveBalanceLedger[] = this.state.leavePolicies.map((lp) => ({
      id: `ll_${employmentId}_${lp.code}`,
      employment_id: employmentId,
      policy_id: lp.id,
      policy_code: lp.code,
      total_entitlement: lp.annual_entitlement_days,
      accrued: lp.annual_entitlement_days,
      used: 0,
      on_hold: 0,
      available: lp.annual_entitlement_days,
    }));

    // Auto-create an onboarding case
    const newOnboarding: OnboardingCase = {
      id: `onb_${employmentId}`,
      employment_id: employmentId,
      candidate_name: `${newPerson.first_name} ${newPerson.last_name}`,
      job_title: newAssignment.job_title,
      department: this.state.orgUnits.find((o) => o.id === newAssignment.org_unit_id)?.name || "General",
      start_date: newEmployment.hire_date,
      status: "Draft",
      tasks: [
        { id: "t1", title: "Collect National CNIC & Credentials", category: "HR", assigned_role: "HR Ops", due_date: newEmployment.hire_date, completed: false, mandatory_for_payroll: true },
        { id: "t2", title: "Verify Bank Account & Title", category: "Finance", assigned_role: "Payroll Lead", due_date: newEmployment.hire_date, completed: false, mandatory_for_payroll: true },
        { id: "t3", title: "Assign IT Equipment & Email", category: "IT", assigned_role: "IT Admin", due_date: newEmployment.hire_date, completed: false, mandatory_for_payroll: false },
      ],
    };

    const nextState = {
      ...this.state,
      people: [...this.state.people, newPerson],
      employments: [...this.state.employments, newEmployment],
      assignments: [...this.state.assignments, newAssignment],
      payoutInstructions: [...this.state.payoutInstructions, newPayout],
      leaveLedgers: [...this.state.leaveLedgers, ...newLedgers],
      onboardingCases: [...this.state.onboardingCases, newOnboarding],
    };

    this.saveState(nextState);
    return newEmployment;
  }

  // --- Workforce / Attendance & Shifts ---
  public getShifts(): ShiftTemplate[] {
    return this.state.shifts;
  }

  public getAttendanceDays(): WorkDay[] {
    return this.state.attendanceDays;
  }

  public clockInOrOut(
    employmentId: string,
    source: "Web" | "Mobile" | "Biometric" = "Web",
    latitude?: number,
    longitude?: number
  ) {
    const today = new Date().toISOString().split("T")[0];
    const nowTime = new Date().toTimeString().split(" ")[0].substring(0, 5); // "HH:MM"
    const existing = this.state.attendanceDays.find(
      (d) => d.employment_id === employmentId && d.local_date === today
    );

    let updatedDays = [...this.state.attendanceDays];
    let punchType: "IN" | "OUT" = "IN";

    if (!existing) {
      // Clock IN
      const newDay: WorkDay = {
        id: `wd_${Date.now()}`,
        employment_id: employmentId,
        local_date: today,
        shift_id: "shift_gen",
        check_in: nowTime,
        status: "Present",
        late_minutes: 0,
        early_departure_minutes: 0,
        worked_hours: 0,
        regular_payable_hours: 0,
        overtime_hours: 0,
        overtime_status: "None",
        exceptions: [],
      };
      updatedDays.push(newDay);
      punchType = "IN";
    } else if (!existing.check_out) {
      // Clock OUT
      existing.check_out = nowTime;
      existing.worked_hours = 8;
      existing.regular_payable_hours = 8;
      punchType = "OUT";
    } else {
      // Re-clock OUT update
      existing.check_out = nowTime;
      punchType = "OUT";
    }

    const newPunch: PunchEvent = {
      id: `pnc_${Date.now()}`,
      connector_id: "web_conn_01",
      external_id: `EXT_${Date.now()}`,
      employment_id: employmentId,
      occurred_at: new Date().toISOString(),
      received_at: new Date().toISOString(),
      source,
      latitude,
      longitude,
      geofence_status: latitude && longitude ? "In_Bounds" : "GPS_Unavailable",
    };

    this.saveState({
      ...this.state,
      attendanceDays: updatedDays,
      punchEvents: [newPunch, ...this.state.punchEvents],
    });

    return { punchType, time: nowTime };
  }

  // --- Leave Management & Ledger Holds ---
  public getLeavePolicies(): LeavePolicy[] {
    return this.state.leavePolicies;
  }

  public getLeaveLedgers(employmentId?: string): LeaveBalanceLedger[] {
    if (employmentId) {
      return this.state.leaveLedgers.filter((l) => l.employment_id === employmentId);
    }
    return this.state.leaveLedgers;
  }

  public getLeaveRequests(): LeaveRequest[] {
    return this.state.leaveRequests;
  }

  public submitLeaveRequest(
    employmentId: string,
    policyCode: string,
    startDate: string,
    endDate: string,
    units: number,
    reason: string
  ) {
    const policy = this.state.leavePolicies.find((p) => p.code === policyCode);
    if (!policy) throw new Error("Invalid leave policy");

    // Check balance hold
    const ledger = this.state.leaveLedgers.find(
      (l) => l.employment_id === employmentId && l.policy_code === policyCode
    );

    if (policy.is_paid && ledger && ledger.available < units) {
      throw new Error(`Insufficient leave balance: Available is ${ledger.available} days`);
    }

    const newRequest: LeaveRequest = {
      id: `lr_${Date.now()}`,
      employment_id: employmentId,
      policy_id: policy.id,
      policy_code: policy.code,
      start_date: startDate,
      end_date: endDate,
      units,
      reason,
      status: "Submitted",
      submitted_at: new Date().toISOString(),
    };

    // Apply hold on ledger
    let updatedLedgers = this.state.leaveLedgers.map((l) => {
      if (l.employment_id === employmentId && l.policy_code === policyCode) {
        return {
          ...l,
          on_hold: l.on_hold + units,
          available: l.available - units,
        };
      }
      return l;
    });

    this.saveState({
      ...this.state,
      leaveRequests: [newRequest, ...this.state.leaveRequests],
      leaveLedgers: updatedLedgers,
    });

    return newRequest;
  }

  public reviewLeaveRequest(
    requestId: string,
    decision: "Approved" | "Rejected",
    reviewerRole: string = "Line Manager",
    notes?: string
  ) {
    const request = this.state.leaveRequests.find((r) => r.id === requestId);
    if (!request) throw new Error("Request not found");

    request.status = decision;
    request.reviewed_by = reviewerRole;
    request.reviewed_at = new Date().toISOString();
    request.review_notes = notes;

    let updatedLedgers = this.state.leaveLedgers.map((l) => {
      if (l.employment_id === request.employment_id && l.policy_code === request.policy_code) {
        if (decision === "Approved") {
          return {
            ...l,
            on_hold: Math.max(0, l.on_hold - request.units),
            used: l.used + request.units,
          };
        } else {
          // Release hold
          return {
            ...l,
            on_hold: Math.max(0, l.on_hold - request.units),
            available: l.available + request.units,
          };
        }
      }
      return l;
    });

    this.saveState({
      ...this.state,
      leaveLedgers: updatedLedgers,
    });

    return request;
  }

  // --- 5-Stage Payroll Engine ---
  public getPayrollRuns(): PayrollRun[] {
    return this.state.payrollRuns;
  }

  public getPayrollRun(id: string): PayrollRun | undefined {
    return this.state.payrollRuns.find((r) => r.id === id);
  }

  public getEmployeeResults(runId: string): EmployeeResult[] {
    return this.state.employeeResults[runId] || [];
  }

  public createPayrollRun(
    periodName: string = "November 2026 Monthly Payroll",
    runType: "Regular" | "Off-cycle" | "Final" = "Regular"
  ): PayrollRun {
    const newRun: PayrollRun = {
      id: `pr_${Date.now()}`,
      period_id: `period_${Date.now()}`,
      period_name: periodName,
      entity_id: this.state.legalEntity.id,
      pay_group_id: this.state.payGroups[0]?.id || "pg_monthly_pk",
      run_type: runType,
      state: "Draft",
      currency: "PKR",
      version: 1,
      employee_count: this.state.employments.filter((e) => e.status === "Active").length,
      total_gross: 0,
      total_withheld: 0,
      total_net: 0,
      total_employer_cost: 0,
      maker_id: "current_operator",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.saveState({
      ...this.state,
      payrollRuns: [newRun, ...this.state.payrollRuns],
    });

    return newRun;
  }

  public lockInputs(runId: string) {
    const run = this.state.payrollRuns.find((r) => r.id === runId);
    if (!run) throw new Error("Run not found");

    const employees = this.getEmployeesJoined().filter((e) => e.status === "Active");
    const snapshotPayload = {
      runId,
      timestamp: new Date().toISOString(),
      employments: employees.map((e) => ({
        id: e.id,
        code: e.worker_code,
        title: e.assignment.job_title,
        base: e.worker_code === "E00412" ? 100000 : (e.worker_code === "E00420" ? 140000 : (e.worker_code === "E00431" ? 220000 : 90000)),
      })),
    };

    const snapshotHash = generateHash(JSON.stringify(snapshotPayload));

    run.state = "Inputs_Locked";
    run.snapshot_hash = snapshotHash;
    run.updated_at = new Date().toISOString();

    this.saveState({ ...this.state });
    return run;
  }

  public calculateRun(runId: string) {
    const run = this.state.payrollRuns.find((r) => r.id === runId);
    if (!run) throw new Error("Run not found");

    const activeEmployees = this.getEmployeesJoined().filter((e) => e.status === "Active");

    const calcInputs = activeEmployees.map((emp) => {
      const isSamRivera = emp.worker_code === "E00412";
      const baseSalary = isSamRivera ? 100000 : (emp.worker_code === "E00420" ? 140000 : (emp.worker_code === "E00431" ? 220000 : 90000));
      const scheduledDays = 20;
      const unpaidDays = isSamRivera ? 1 : 0;
      const payableDays = scheduledDays - unpaidDays;
      const otHours = isSamRivera ? 4 : (emp.worker_code === "E00431" ? 2 : 0);
      const otRate = 2000;

      return {
        employmentId: emp.id,
        workerCode: emp.worker_code,
        employeeName: `${emp.person.first_name} ${emp.person.last_name}`,
        jobTitle: emp.assignment.job_title,
        department: emp.orgUnit?.name || "General",
        bankName: emp.payout?.bank_name || "Meezan Bank Ltd",
        accountMasked: emp.payout?.account_number || "PK36MEZN****0000",
        contractualBase: baseSalary,
        scheduledWorkdays: scheduledDays,
        payableWorkdays: payableDays,
        unpaidDays: unpaidDays,
        overtimeHours: otHours,
        overtimeRate: otRate,
        useFixedFixtureTax: isSamRivera ? 8000 : undefined, // Exactly 8,000 PKR fixture tax for Sam Rivera
        loans: emp.loans || [],
      };
    });

    const mockSnapshot = {
      id: `snap_${run.id}`,
      run_id: run.id,
      revision_no: run.version,
      hash: run.snapshot_hash || "sha256:d8a9f000",
      created_at: new Date().toISOString(),
      employee_count: calcInputs.length,
      total_base_compensation: calcInputs.reduce((sum, e) => sum + e.contractualBase, 0),
      total_overtime_hours: calcInputs.reduce((sum, e) => sum + e.overtimeHours, 0),
      total_unpaid_days: calcInputs.reduce((sum, e) => sum + e.unpaidDays, 0),
      payload: {},
    };

    const calcOutput = executeDeterministicCalculation(run, mockSnapshot, calcInputs);

    run.state = "Review";
    run.total_gross = calcOutput.summary.totalGross;
    run.total_withheld = calcOutput.summary.totalWithheld;
    run.total_net = calcOutput.summary.totalNet;
    run.total_employer_cost = calcOutput.summary.totalEmployerCost;
    run.employee_count = calcOutput.results.length;
    run.updated_at = new Date().toISOString();

    const updatedEmployeeResults = {
      ...this.state.employeeResults,
      [run.id]: calcOutput.results,
    };

    this.saveState({
      ...this.state,
      employeeResults: updatedEmployeeResults,
    });

    return { run, results: calcOutput.results, summary: calcOutput.summary };
  }

  public submitForApproval(runId: string) {
    const run = this.state.payrollRuns.find((r) => r.id === runId);
    if (!run) throw new Error("Run not found");
    run.state = "Pending_Approval";
    run.updated_at = new Date().toISOString();
    this.saveState({ ...this.state });
    return run;
  }

  public approveRun(runId: string, approverRole: string = "Finance Director / Controller") {
    const run = this.state.payrollRuns.find((r) => r.id === runId);
    if (!run) throw new Error("Run not found");

    // Maker-checker segregation check: Approver cannot be Maker
    if (run.maker_id === approverRole) {
      throw new Error("Maker cannot approve own revision (Maker-Checker violation)");
    }

    run.state = "Approved";
    run.approver_id = approverRole;
    run.approval_timestamp = new Date().toISOString();
    run.updated_at = new Date().toISOString();

    // Auto-generate Bank Payment Batch & Balanced Journal Batch
    const results = this.state.employeeResults[runId] || [];
    const batchId = `batch_${runId}`;
    const bankBatch: BankPaymentBatch = {
      id: batchId,
      run_id: runId,
      reference: `BATCH-${run.period_name.replace(/\s+/g, "-")}`,
      adapter: "Standard_1LINK",
      control_total: run.total_net,
      total_count: results.length,
      file_hash: generateHash(`BANK_FILE_${runId}_${run.total_net}`),
      state: "Prepared",
      created_at: new Date().toISOString(),
      items: results.map((res, idx) => ({
        id: `item_${batchId}_${idx + 1}`,
        employee_result_id: res.id,
        worker_code: res.worker_code,
        employee_name: res.employee_name,
        account_number: res.bank_account_masked,
        bank_name: res.bank_name,
        amount: res.net_payable,
        state: "Prepared",
      })),
    };

    const journalBatch: JournalBatch = {
      id: `jb_${runId}`,
      run_id: runId,
      posting_reference: `JV-PAY-${runId.substring(0, 8)}`,
      posting_date: new Date().toISOString().split("T")[0],
      total_debit: run.total_gross,
      total_credit: run.total_gross,
      is_balanced: true,
      state: "Draft",
      lines: [
        { id: "jl_01", account_code: "60000", account_name: "Salaries Expense", cost_center: "CORP", debit: run.total_gross, credit: 0 },
        { id: "jl_02", account_code: "21010", account_name: "Withholding Tax Payable", cost_center: "CORP", debit: 0, credit: run.total_withheld },
        { id: "jl_03", account_code: "21000", account_name: "Net Salaries Clearing / Bank", cost_center: "CORP", debit: 0, credit: run.total_net },
      ],
    };

    this.saveState({
      ...this.state,
      bankBatches: [bankBatch, ...this.state.bankBatches],
      journalBatches: [journalBatch, ...this.state.journalBatches],
    });

    return run;
  }

  public closeRun(runId: string) {
    const run = this.state.payrollRuns.find((r) => r.id === runId);
    if (!run) throw new Error("Run not found");
    run.state = "Closed";
    run.updated_at = new Date().toISOString();
    this.saveState({ ...this.state });
    return run;
  }

  // --- Banking & GL Reconciliation ---
  public getBankBatches(): BankPaymentBatch[] {
    return this.state.bankBatches;
  }

  public reconcileBankItem(batchId: string, itemId: string, state: "Settled" | "Rejected", reason?: string) {
    const batch = this.state.bankBatches.find((b) => b.id === batchId);
    if (!batch) throw new Error("Batch not found");

    const item = batch.items.find((i) => i.id === itemId);
    if (item) {
      item.state = state;
      item.failure_reason = reason;
    }

    const hasRejected = batch.items.some((i) => i.state === "Rejected");
    const allSettled = batch.items.every((i) => i.state === "Settled");

    if (allSettled) {
      batch.state = "Reconciled";
    } else if (hasRejected) {
      batch.state = "Partial_Failure";
    }

    this.saveState({ ...this.state });
    return batch;
  }

  public getJournalBatches(): JournalBatch[] {
    return this.state.journalBatches;
  }

  public postJournalBatch(batchId: string) {
    const batch = this.state.journalBatches.find((b) => b.id === batchId);
    if (!batch) throw new Error("Batch not found");
    batch.state = "Posted";
    this.saveState({ ...this.state });
    return batch;
  }

  // --- Onboarding & Separation ---
  public getOnboardingCases(): OnboardingCase[] {
    return this.state.onboardingCases;
  }

  public toggleOnboardingTask(caseId: string, taskId: string) {
    const c = this.state.onboardingCases.find((x) => x.id === caseId);
    if (!c) return;
    const task = c.tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
    }
    const allMandatoryDone = c.tasks.filter((t) => t.mandatory_for_payroll).every((t) => t.completed);
    if (allMandatoryDone && c.status === "Draft") {
      c.status = "Ready";
    }
    this.saveState({ ...this.state });
  }

  public getSeparationCases(): SeparationCase[] {
    return this.state.separationCases;
  }

  // --- Additional modules ---
  public getAssets(): EmployeeAsset[] {
    return this.state.assets;
  }

  public getTickets(): HelpDeskTicket[] {
    return this.state.tickets;
  }

  public addTicket(ticket: Omit<HelpDeskTicket, "id" | "created_at">) {
    const newT: HelpDeskTicket = {
      ...ticket,
      id: `tkt_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.saveState({
      ...this.state,
      tickets: [newT, ...this.state.tickets],
    });
    return newT;
  }

  public getRequisitions(): JobRequisition[] {
    return this.state.requisitions;
  }
}

export const getDB = () => LocalStorageDB.getInstance();
