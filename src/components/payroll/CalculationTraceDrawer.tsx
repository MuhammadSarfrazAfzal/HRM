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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{result.employee_name}</h2>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-slate-200 text-slate-700">
                  {result.worker_code}
                </span>
              </div>
              <p className="text-xs text-slate-500">{result.job_title} • {result.department}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alert Banner */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            {result.status === "Clean" ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Clean Line Trace
              </span>
            ) : result.status === "Warning" ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" /> Attendance Variance Warning
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-100/80 px-2.5 py-1 rounded-full">
                <AlertOctagon className="w-3.5 h-3.5" /> Hard Blocker Detected
              </span>
            )}
          </div>
          <span className="text-xs font-mono text-slate-500">Revision: {result.revision_id}</span>
        </div>

        {/* Trace Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* High-level Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Gross Earnings</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">{formatCurrency(result.gross_earnings)}</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
              <span className="text-[11px] font-semibold text-rose-600 block uppercase">Withheld / Deductions</span>
              <span className="text-sm font-bold text-rose-700 mt-0.5 block">−{formatCurrency(result.total_deductions)}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[11px] font-semibold text-emerald-600 block uppercase">Net Payable</span>
              <span className="text-base font-extrabold text-emerald-700 mt-0.5 block">{formatCurrency(result.net_payable)}</span>
            </div>
          </div>

          {/* Blockers display if any */}
          {result.blocker_reasons.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
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
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-brand-600" /> Attendance & Proration Parameters
            </h3>
            <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
              <div>Scheduled Workdays: <span className="font-semibold text-slate-900">{result.scheduled_workdays} days</span></div>
              <div>Payable Workdays: <span className="font-semibold text-slate-900">{result.payable_workdays} days</span></div>
              <div>Unpaid Absence / Leave: <span className="font-semibold text-rose-600">{result.unpaid_days} day(s)</span></div>
              <div>Approved Overtime: <span className="font-semibold text-emerald-700">{result.overtime_hours} hrs</span></div>
            </div>
          </div>

          {/* Line by Line Formula Trace */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Explainable Formula Line Items
            </h3>
            <div className="space-y-3">
              {result.trace_lines.map((line, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{line.component_name}</span>
                    <span
                      className={`text-xs font-bold font-mono ${
                        line.type === "Earning"
                          ? "text-slate-900"
                          : line.type === "Deduction"
                          ? "text-rose-600"
                          : "text-blue-600"
                      }`}
                    >
                      {line.type === "Deduction" ? "−" : "+"}
                      {formatCurrency(line.amount)}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono bg-slate-100 text-slate-700 p-2 rounded-lg break-all">
                    Formula: {line.formula_expression}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Source: {line.source_ref}</span>
                    {line.reason && <span className="text-slate-500 italic">{line.reason}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employer Liabilities */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2 text-xs">
            <h3 className="font-bold text-blue-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" /> Employer Liabilities (Statutory Cost)
            </h3>
            <div className="grid grid-cols-2 gap-2 text-blue-800 pt-1">
              <div>Employer EOBI (5%): <span className="font-semibold">{formatCurrency(result.employer_eobi)}</span></div>
              <div>Employer SESSI: <span className="font-semibold">{formatCurrency(result.employer_sessi)}</span></div>
            </div>
          </div>

          {/* Bank Payout Credentials */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <span className="font-bold text-slate-800">Bank Payout Destination</span>
            <p className="text-slate-600">{result.bank_name} • Account: <span className="font-mono font-semibold">{result.bank_account_masked}</span></p>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-200 transition"
          >
            Close Trace
          </button>
          {onOpenPayslip && (
            <button
              onClick={() => onOpenPayslip(result)}
              className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition"
            >
              Preview Official Payslip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
