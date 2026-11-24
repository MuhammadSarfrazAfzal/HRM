"use client";

import React from "react";
import { X, CheckCircle2, AlertTriangle, AlertOctagon, Calculator, Info, ShieldCheck } from "lucide-react";
import { EmployeeResult } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface CalculationTraceDrawerProps {
  result: EmployeeResult | null;
  onClose: () => void;
  onOpenPayslip?: (result: EmployeeResult) => void;
}

export function CalculationTraceDrawer({ result, onClose, onOpenPayslip }: CalculationTraceDrawerProps) {
  if (!result) return null;

  return (
    <div className="fixed inset-0 z-50 !mt-0 flex justify-end overflow-hidden bg-slate-900/50 backdrop-blur-[2px]">
      <div className="flex h-full w-full max-w-xl flex-col bg-white shadow-overlay animate-slide-in-right">
        {/* Drawer Header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="icon-tile">
              <Calculator />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-slate-900">{result.employee_name}</h2>
                <span className="tag">
                  {result.worker_code}
                </span>
              </div>
              <p className="text-[13px] text-slate-500">{result.job_title} • {result.department}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="modal-close"
            aria-label="Close trace"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status Alert Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/60 px-5 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            {result.status === "Clean" ? (
              <span className="badge badge-success">
                <CheckCircle2 className="w-3.5 h-3.5" /> Clean Line Trace
              </span>
            ) : result.status === "Warning" ? (
              <span className="badge badge-warning">
                <AlertTriangle className="w-3.5 h-3.5" /> Attendance Variance Warning
              </span>
            ) : (
              <span className="badge badge-danger">
                <AlertOctagon className="w-3.5 h-3.5" /> Hard Blocker Detected
              </span>
            )}
          </div>
          <span className="text-xs font-mono text-slate-500">Revision: {result.revision_id}</span>
        </div>

        {/* Trace Content */}
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
          {/* High-level Summary Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="stat-tile p-3">
              <span className="stat-label">Gross Earnings</span>
              <span className="stat-value text-base">{formatCurrency(result.gross_earnings)}</span>
            </div>
            <div className="stat-tile p-3">
              <span className="stat-label">Withheld / Deductions</span>
              <span className="stat-value text-base text-rose-700">−{formatCurrency(result.total_deductions)}</span>
            </div>
            <div className="stat-tile border-emerald-200 bg-emerald-50/60 p-3">
              <span className="stat-label text-emerald-700">Net Payable</span>
              <span className="stat-value text-base text-emerald-800">{formatCurrency(result.net_payable)}</span>
            </div>
          </div>

          {/* Blockers display if any */}
          {result.blocker_reasons.length > 0 && (
            <div className="space-y-1 rounded-lg border border-rose-200 bg-rose-50/70 p-4 text-[13px] text-rose-800">
              <div className="font-semibold flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" /> Blocking Errors:
              </div>
              <ul className="list-disc pl-5 space-y-0.5">
                {result.blocker_reasons.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Attendance & Proration Context */}
          <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/60 p-4 text-[13px]">
            <h3 className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Info className="h-4 w-4 text-brand-600" /> Attendance & Proration Parameters
            </h3>
            <div className="grid grid-cols-1 gap-2 pt-1 text-slate-600 sm:grid-cols-2">
              <div>Scheduled Workdays: <span className="font-semibold text-slate-900">{result.scheduled_workdays} days</span></div>
              <div>Payable Workdays: <span className="font-semibold text-slate-900">{result.payable_workdays} days</span></div>
              <div>Unpaid Absence / Leave: <span className="font-semibold text-rose-600">{result.unpaid_days} day(s)</span></div>
              <div>Approved Overtime: <span className="font-semibold text-emerald-700">{result.overtime_hours} hrs</span></div>
            </div>
          </div>

          {/* Line by Line Formula Trace */}
          <div>
            <h3 className="section-title mb-3">
              Explainable Formula Line Items
            </h3>
            <div className="space-y-3">
              {result.trace_lines.map((line, idx) => (
                <div key={idx} className="space-y-2 rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] font-semibold text-slate-800">{line.component_name}</span>
                    <span
                      className={`whitespace-nowrap text-[13px] font-semibold tabular-nums ${
                        line.type === "Earning"
                          ? "text-slate-900"
                          : line.type === "Deduction"
                          ? "text-rose-600"
                          : "text-brand-700"
                      }`}
                    >
                      {line.type === "Deduction" ? "−" : "+"}
                      {formatCurrency(line.amount)}
                    </span>
                  </div>
                  <div className="break-all rounded-md bg-slate-50 p-2 font-mono text-xs text-slate-700 ring-1 ring-inset ring-slate-200">
                    Formula: {line.formula_expression}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] text-slate-400">
                    <span>Source: {line.source_ref}</span>
                    {line.reason && <span className="text-slate-500 italic">{line.reason}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employer Liabilities */}
          <div className="space-y-2 rounded-lg border border-brand-200 bg-brand-50/50 p-4 text-[13px]">
            <h3 className="flex items-center gap-1.5 font-semibold text-brand-900">
              <ShieldCheck className="h-4 w-4 text-brand-600" /> Employer Liabilities (Statutory Cost)
            </h3>
            <div className="grid grid-cols-1 gap-2 pt-1 text-brand-900/80 sm:grid-cols-2">
              <div>Employer EOBI (5%): <span className="font-semibold">{formatCurrency(result.employer_eobi)}</span></div>
              <div>Employer SESSI: <span className="font-semibold">{formatCurrency(result.employer_sessi)}</span></div>
            </div>
          </div>

          {/* Bank Payout Credentials */}
          <div className="space-y-1 rounded-lg border border-slate-200 bg-slate-50/60 p-4 text-[13px]">
            <span className="font-semibold text-slate-800">Bank Payout Destination</span>
            <p className="text-slate-600">{result.bank_name} • Account: <span className="font-mono font-semibold">{result.bank_account_masked}</span></p>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="flex items-center justify-between gap-2 border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Close Trace
          </button>
          {onOpenPayslip && (
            <button
              onClick={() => onOpenPayslip(result)}
              className="btn btn-primary"
            >
              Preview Official Payslip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
