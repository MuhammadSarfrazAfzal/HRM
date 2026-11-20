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
  AlertOctagon,
} from "lucide-react";
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Payroll Workbench & Register</h1>
          <p className="text-xs text-slate-500">
            5-Stage Guarded Pipeline • Immutable Snapshots, Line Traces, Maker-Checker Sign-off, and Bank Reconciliation
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Payroll Run</span>
          </button>
        </div>
      </div>

      {/* Pay Runs Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {runs.map((r) => (
          <button
            key={r.id}
            onClick={() => handleRunSelect(r.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border flex-shrink-0 ${
              r.id === activeRun?.id
                ? "bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-600/20"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{r.period_name}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded uppercase ${
                r.id === activeRun?.id
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-600"
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
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold text-slate-900">{activeRun.period_name}</h2>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-bold border border-brand-200">
                    Entity 01 • PKR • Version {activeRun.version}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Cutoff: 25th of month • Payout Date: 30th of month • Headcount: {activeRun.employee_count} employees
                </p>
                {activeRun.snapshot_hash && (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 pt-1">
                    <Hash className="w-3.5 h-3.5 text-brand-500" />
                    <span>Snapshot Hash: {activeRun.snapshot_hash}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons based on Run Stage */}
              <div className="flex items-center gap-2 flex-wrap">
                {activeRun.state === "Draft" && (
                  <button
                    onClick={handleLockInputs}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>1. Lock Inputs Snapshot</span>
                  </button>
                )}

                {(activeRun.state === "Inputs_Locked" || activeRun.state === "Review") && (
                  <button
                    onClick={handleCalculate}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm shadow-brand-500/20 transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>2. Run Deterministic Calculation</span>
                  </button>
                )}

                {activeRun.state === "Review" && (
                  <button
                    onClick={handleSubmitApproval}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-sm transition"
                  >
                    <span>3. Submit for Checker Approval</span>
                  </button>
                )}

                {activeRun.state === "Pending_Approval" && (
                  <button
                    onClick={handleApprove}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>4. Approve Revision (Checker Sign-off)</span>
                  </button>
                )}

                {activeRun.state === "Approved" && (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/payroll/finance"
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Bank Batch & GL</span>
                    </Link>
                    <button
                      onClick={handleCloseRun}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
                    >
                      <span>5. Reconcile & Close</span>
                    </button>
                  </div>
                )}

                {activeRun.state === "Closed" && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Fully Settled & Closed
                  </span>
                )}
              </div>
            </div>

            {/* 5-Stage Stepper Visualization */}
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
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
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border transition ${
                      isCurrent
                        ? "bg-brand-50 border-brand-300 text-brand-900 font-bold"
                        : isCompleted
                        ? "bg-slate-50 border-slate-200 text-slate-800"
                        : "bg-white border-slate-100 text-slate-400"
                    }`}
                  >
                    <span className="text-[10px] block uppercase font-mono tracking-wider">{step.label}</span>
                    <span className="text-[11px] block mt-0.5">{step.desc}</span>
                  </div>
                );
              })}
            </div>

            {/* Run Totals Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Gross</span>
                <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">{formatCurrency(activeRun.total_gross)}</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-[10px] uppercase font-bold text-rose-600 block">Total Withheld</span>
                <span className="text-base font-bold text-rose-700 font-mono mt-0.5 block">−{formatCurrency(activeRun.total_withheld)}</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-600 block">Total Net Disbursement</span>
                <span className="text-lg font-black text-emerald-800 font-mono mt-0.5 block">{formatCurrency(activeRun.total_net)}</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-[10px] uppercase font-bold text-blue-600 block">Total Employer Cost</span>
                <span className="text-base font-bold text-blue-800 font-mono mt-0.5 block">{formatCurrency(activeRun.total_employer_cost)}</span>
              </div>
            </div>
          </div>

          {/* Employee Register Table with Test Fixture Sam Rivera E00412 */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Employee Pay Register</h3>
                <p className="text-[11px] text-slate-500">
                  Select any row to view the explainable mathematical formula trace or official payslip
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500 font-bold">
                {results.length} Eligible Employees
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
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
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {results.map((res) => (
                    <tr
                      key={res.id}
                      className={`hover:bg-slate-50/80 transition cursor-pointer ${
                        res.worker_code === "E00412" ? "bg-brand-50/30" : ""
                      }`}
                      onClick={() => setSelectedResult(res)}
                    >
                      <td className="px-5 py-4 font-mono font-bold text-slate-900">
                        {res.worker_code}
                        {res.worker_code === "E00412" && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-brand-500 text-white font-sans font-bold">
                            Fixture
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <span className="font-bold text-slate-900">{res.employee_name}</span>
                          <div className="text-[11px] text-slate-400">{res.job_title} • {res.department}</div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-[11px]">
                          <span>{res.payable_workdays}/{res.scheduled_workdays} days</span>
                          {res.unpaid_days > 0 && <span className="text-rose-600 font-semibold ml-1">({res.unpaid_days} unpaid)</span>}
                          {res.overtime_hours > 0 && <span className="text-emerald-700 font-semibold block">+{res.overtime_hours} hrs OT</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(res.gross_earnings)}
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-rose-600">
                        −{formatCurrency(res.total_deductions)}
                        <div className="text-[10px] text-slate-400 font-normal">
                          Tax: {res.withheld_tax} | Loan: {res.loan_deductions}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-black text-emerald-800 text-sm">
                        {formatCurrency(res.net_payable)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          res.status === "Clean" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {res.status === "Clean" ? "✓ Clean" : "⚠ Warning"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedResult(res)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                        >
                          Trace
                        </button>
                        <button
                          onClick={() => setPayslipResult(res)}
                          className="px-2.5 py-1 rounded bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs border border-brand-200 transition"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <Calculator className="w-4 h-4 text-brand-400" /> Create New Payroll Run
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateRun} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Pay Period Description</label>
                <input
                  type="text"
                  required
                  value={newRunPeriod}
                  onChange={(e) => setNewRunPeriod(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Legal Entity & Jurisdiction</label>
                <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                  Star Solutions Pakistan (Pvt) Ltd • Sindh, Pakistan
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Pay Group & Currency</label>
                <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                  Monthly Regular Staff • PKR
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold"
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
