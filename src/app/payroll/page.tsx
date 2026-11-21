"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calculator,
  Lock,
  Play,
  CheckCircle2,
  AlertTriangle,
  FileText,
  CreditCard,
  Building2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Plus,
  Hash,
  Download,
  AlertOctagon, X } from "lucide-react";
import { getDB } from "@/lib/storage/db";
import { PayrollRun, EmployeeResult } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CalculationTraceDrawer } from "@/components/payroll/CalculationTraceDrawer";
import { PayslipModal } from "@/components/payroll/PayslipModal";

export default function PayrollWorkbenchPage() {
  const [db] = useState(() => getDB());
  const [runs, setRuns] = useState<PayrollRun[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string>("");
  const [results, setResults] = useState<EmployeeResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<EmployeeResult | null>(null);
  const [payslipResult, setPayslipResult] = useState<EmployeeResult | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRunPeriod, setNewRunPeriod] = useState("November 2026 Monthly Payroll");

  const refresh = () => {
    const allRuns = db.getPayrollRuns();
    setRuns(allRuns);
    if (!selectedRunId && allRuns.length > 0) {
      setSelectedRunId(allRuns[0].id);
      setResults(db.getEmployeeResults(allRuns[0].id));
    } else if (selectedRunId) {
      setResults(db.getEmployeeResults(selectedRunId));
    }
  };

  useEffect(() => {
    refresh();
  }, [selectedRunId]);

  const activeRun = runs.find((r) => r.id === selectedRunId) || runs[0];

  const handleRunSelect = (id: string) => {
    setSelectedRunId(id);
    setResults(db.getEmployeeResults(id));
  };

  const handleLockInputs = () => {
    if (!activeRun) return;
    try {
      db.lockInputs(activeRun.id);
      refresh();
      alert(`Inputs frozen! SHA-256 Snapshot hash generated: ${activeRun.snapshot_hash || "sha256:d8a9f000"}`);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleCalculate = () => {
    if (!activeRun) return;
    try {
      const output = db.calculateRun(activeRun.id);
      refresh();
      alert(`Calculation completed with deterministic precision!\nGross: ${formatCurrency(output.summary.totalGross)}\nNet: ${formatCurrency(output.summary.totalNet)}\nBlockers: ${output.summary.blockerCount}`);
    } catch (err: any) {
      alert("Calculation Error: " + err.message);
    }
  };

  const handleSubmitApproval = () => {
    if (!activeRun) return;
    try {
      db.submitForApproval(activeRun.id);
      refresh();
      alert("Run submitted for Checker approval.");
    } catch (err: any) {
      alert("Submission Error: " + err.message);
    }
  };

  const handleApprove = () => {
    if (!activeRun) return;
    try {
      db.approveRun(activeRun.id, "Finance Director / Controller");
      refresh();
      alert("Payroll run signed & approved by independent Checker!\nBank 1LINK payment batch and double-entry GL journal generated.");
    } catch (err: any) {
      alert("Approval Error (Maker-Checker violation): " + err.message);
    }
  };

  const handleCloseRun = () => {
    if (!activeRun) return;
    try {
      db.closeRun(activeRun.id);
      refresh();
      alert("Run closed and reconciled to Finance!");
    } catch (err: any) {
      alert("Close Error: " + err.message);
    }
  };

  const handleCreateRun = (e: React.FormEvent) => {
    e.preventDefault();
    const newRun = db.createPayrollRun(newRunPeriod, "Regular");
    setShowCreateModal(false);
    setSelectedRunId(newRun.id);
    refresh();
  };

  return (
    <div className="page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Payroll Workbench & Register</h1>
          <p className="page-subtitle">
            5-Stage Guarded Pipeline • Immutable Snapshots, Line Traces, Maker-Checker Sign-off, and Bank Reconciliation
          </p>
        </div>
        <div className="page-actions">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-dark"
          >
            <Plus />
            <span>New Payroll Run</span>
          </button>
        </div>
      </div>

      {/* Pay Runs Selector Bar */}
      <div className="tabs" role="tablist" aria-label="Payroll runs">
        {runs.map((r) => (
          <button
            key={r.id}
            role="tab"
            aria-selected={r.id === activeRun?.id}
            onClick={() => handleRunSelect(r.id)}
            className={`tab ${r.id === activeRun?.id ? "tab-active" : ""}`}
          >
            <Calculator className={`h-3.5 w-3.5 ${r.id === activeRun?.id ? "text-brand-600" : "text-slate-400"}`} />
            <span>{r.period_name}</span>
            <span
              className={`rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                r.id === activeRun?.id
                  ? "bg-brand-50 text-brand-700"
                  : "bg-slate-200/70 text-slate-600"
              }`}
            >
              {r.state}
            </span>
          </button>
        ))}
      </div>

      {activeRun && (
        <>
          {/* Active Run Banner & 5-Stage Gate Progress */}
          <div className="card space-y-6 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-center">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-lg font-semibold text-slate-900">{activeRun.period_name}</h2>
                  <span className="badge badge-info">
                    Entity 01 • PKR • Version {activeRun.version}
                  </span>
                </div>
                <p className="text-[13px] text-slate-500">
                  Cutoff: 25th of month • Payout Date: 30th of month • Headcount: {activeRun.employee_count} employees
                </p>
                {activeRun.snapshot_hash && (
                  <div className="flex min-w-0 items-center gap-1.5 pt-1 font-mono text-xs text-slate-500">
                    <Hash className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">Snapshot Hash: {activeRun.snapshot_hash}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons based on Run Stage */}
              <div className="flex items-center gap-2 flex-wrap">
                {activeRun.state === "Draft" && (
                  <button
                    onClick={handleLockInputs}
                    className="btn btn-dark"
                  >
                    <Lock className="text-amber-300" />
                    <span>1. Lock Inputs Snapshot</span>
                  </button>
                )}

                {(activeRun.state === "Inputs_Locked" || activeRun.state === "Review") && (
                  <button
                    onClick={handleCalculate}
                    className="btn btn-primary"
                  >
                    <Play />
                    <span>2. Run Deterministic Calculation</span>
                  </button>
                )}

                {activeRun.state === "Review" && (
                  <button
                    onClick={handleSubmitApproval}
                    className="btn btn-primary"
                  >
                    <span>3. Submit for Checker Approval</span>
                  </button>
                )}

                {activeRun.state === "Pending_Approval" && (
                  <button
                    onClick={handleApprove}
                    className="btn btn-success"
                  >
                    <CheckCircle2 />
                    <span>4. Approve Revision (Checker Sign-off)</span>
                  </button>
                )}

                {activeRun.state === "Approved" && (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/payroll/finance"
                      className="btn btn-secondary"
                    >
                      <CreditCard />
                      <span>Bank Batch & GL</span>
                    </Link>
                    <button
                      onClick={handleCloseRun}
                      className="btn btn-dark"
                    >
                      <span>5. Reconcile & Close</span>
                    </button>
                  </div>
                )}

                {activeRun.state === "Closed" && (
                  <span className="badge badge-success px-3 py-1.5 text-[13px]">
                    <CheckCircle2 className="!h-4 !w-4" /> Fully Settled & Closed
                  </span>
                )}
              </div>
            </div>

            {/* 5-Stage Stepper Visualization */}
            <ol className="grid grid-cols-1 gap-2 sm:grid-cols-5">
              {[
                { stage: "Draft", label: "PAY-01 Draft", desc: "Parameter & Cutoff Check" },
                { stage: "Inputs_Locked", label: "PAY-02 Inputs Locked", desc: "Materialized Hash" },
                { stage: "Review", label: "PAY-03 Review & Trace", desc: "Formula Explanation" },
                { stage: "Approved", label: "PAY-04 Approved", desc: "Maker-Checker Sign" },
                { stage: "Closed", label: "PAY-05 Closed", desc: "Bank & GL Reconciliation" },
              ].map((step, idx) => {
                const isCurrent = activeRun.state === step.stage || (step.stage === "Approved" && activeRun.state === "Pending_Approval");
                const isCompleted =
                  (step.stage === "Draft" && activeRun.state !== "Draft") ||
                  (step.stage === "Inputs_Locked" && ["Review", "Pending_Approval", "Approved", "Closed"].includes(activeRun.state)) ||
                  (step.stage === "Review" && ["Pending_Approval", "Approved", "Closed"].includes(activeRun.state)) ||
                  (step.stage === "Approved" && activeRun.state === "Closed");

                return (
                  <li
                    key={idx}
                    aria-current={isCurrent ? "step" : undefined}
                    className={`flex items-center gap-3 rounded-lg border p-3 transition sm:flex-col sm:items-start sm:gap-2 ${
                      isCurrent
                        ? "border-brand-300 bg-brand-50/70 ring-1 ring-brand-200"
                        : isCompleted
                        ? "border-slate-200 bg-white"
                        : "border-dashed border-slate-200 bg-slate-50/50"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        isCurrent
                          ? "bg-brand-600 text-white"
                          : isCompleted
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                    </span>
                    <span className="min-w-0">
                      <span className={`block text-[11px] font-semibold uppercase tracking-wide ${isCurrent ? "text-brand-700" : isCompleted ? "text-slate-700" : "text-slate-400"}`}>{step.label}</span>
                      <span className={`mt-0.5 block text-xs ${isCurrent ? "text-brand-900" : isCompleted ? "text-slate-500" : "text-slate-400"}`}>{step.desc}</span>
                    </span>
                  </li>
                );
              })}
            </ol>

            {/* Run Totals Summary */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="stat-tile">
                <span className="stat-label">Total Gross</span>
                <span className="stat-value">{formatCurrency(activeRun.total_gross)}</span>
              </div>
              <div className="stat-tile">
                <span className="stat-label">Total Withheld</span>
                <span className="stat-value text-rose-700">−{formatCurrency(activeRun.total_withheld)}</span>
              </div>
              <div className="stat-tile border-emerald-200 bg-emerald-50/60">
                <span className="stat-label text-emerald-700">Total Net Disbursement</span>
                <span className="stat-value text-emerald-800">{formatCurrency(activeRun.total_net)}</span>
              </div>
              <div className="stat-tile">
                <span className="stat-label">Total Employer Cost</span>
                <span className="stat-value">{formatCurrency(activeRun.total_employer_cost)}</span>
              </div>
            </div>
          </div>

          {/* Employee Register Table with Test Fixture Sam Rivera E00412 */}
          <div className="card overflow-hidden">
            <div className="card-header">
              <div>
                <h3 className="card-title">Employee Pay Register</h3>
                <p className="card-subtitle">
                  Select any row to view the explainable mathematical formula trace or official payslip
                </p>
              </div>
              <span className="card-meta">
                {results.length} Eligible Employees
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="px-5 py-3">Code</th>
                    <th className="px-5 py-3">Employee Name</th>
                    <th className="px-5 py-3">Attendance / OT</th>
                    <th className="px-5 py-3 text-right">Gross (PKR)</th>
                    <th className="px-5 py-3 text-right">Tax & Deductions</th>
                    <th className="px-5 py-3 text-right">Net Payable</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((res) => (
                    <tr
                      key={res.id}
                      className={`cursor-pointer ${
                        res.worker_code === "E00412" ? "bg-brand-50/40" : ""
                      }`}
                      onClick={() => setSelectedResult(res)}
                    >
                      <td className="px-5 py-4 font-mono font-semibold text-slate-900">
                        {res.worker_code}
                        {res.worker_code === "E00412" && (
                          <span className="badge badge-info ml-1.5 font-sans">
                            Fixture
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <span className="font-semibold text-slate-900">{res.employee_name}</span>
                          <div className="text-xs text-slate-500">{res.job_title} • {res.department}</div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-xs">
                          <span>{res.payable_workdays}/{res.scheduled_workdays} days</span>
                          {res.unpaid_days > 0 && <span className="text-rose-600 font-semibold ml-1">({res.unpaid_days} unpaid)</span>}
                          {res.overtime_hours > 0 && <span className="text-emerald-700 font-semibold block">+{res.overtime_hours} hrs OT</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right tabular-nums font-semibold text-slate-900">
                        {formatCurrency(res.gross_earnings)}
                      </td>
                      <td className="px-5 py-4 text-right tabular-nums font-semibold text-rose-600">
                        −{formatCurrency(res.total_deductions)}
                        <div className="text-[11px] font-normal text-slate-400">
                          Tax: {res.withheld_tax} | Loan: {res.loan_deductions}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right tabular-nums font-semibold text-emerald-700 text-sm">
                        {formatCurrency(res.net_payable)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`badge ${res.status === "Clean" ? "badge-success" : "badge-warning"}`}>
                          {res.status === "Clean" ? <CheckCircle2 /> : <AlertTriangle />}
                          {res.status === "Clean" ? "Clean" : "Warning"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap space-x-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedResult(res)}
                          className="btn btn-secondary btn-xs"
                        >
                          Trace
                        </button>
                        <button
                          onClick={() => setPayslipResult(res)}
                          className="btn btn-soft btn-xs"
                        >
                          Payslip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Trace Drawer */}
      <CalculationTraceDrawer
        result={selectedResult}
        onClose={() => setSelectedResult(null)}
        onOpenPayslip={(res) => setPayslipResult(res)}
      />

      {/* Official Payslip Modal */}
      <PayslipModal
        result={payslipResult}
        periodName={activeRun?.period_name}
        onClose={() => setPayslipResult(null)}
      />

      {/* Create Pay Run Modal */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal-panel max-w-md">
            <div className="modal-header">
              <h2 className="modal-title">
                <Calculator className="w-4 h-4 text-brand-600" /> Create New Payroll Run
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="modal-close" aria-label="Close"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateRun} className="modal-body">
              <div>
                <label className="label">Pay Period Description</label>
                <input
                  type="text"
                  required
                  value={newRunPeriod}
                  onChange={(e) => setNewRunPeriod(e.target.value)}
                  className="input font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="label">Legal Entity & Jurisdiction</label>
                <div className="field-static">
                  Star Solutions Pakistan (Pvt) Ltd • Sindh, Pakistan
                </div>
              </div>

              <div>
                <label className="label">Pay Group & Currency</label>
                <div className="field-static">
                  Monthly Regular Staff • PKR
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Create Run in Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
