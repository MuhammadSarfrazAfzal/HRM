"use client";

import React, { useEffect } from "react";
import { X, Printer, Download, Building2, CheckCircle, ArrowLeft } from "lucide-react";
import { EmployeeResult } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PayslipModalProps {
  result: EmployeeResult | null;
  periodName?: string;
  onClose: () => void;
}

export function PayslipModal({ result, periodName = "October 2026 Monthly Payroll", onClose }: PayslipModalProps) {
  // Listen for Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!result) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-3 py-6 backdrop-blur-[2px] sm:p-6 sm:py-10"
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-overlay ring-1 ring-slate-900/5 animate-fade-in sm:my-4"
      >
        {/* Sticky Modal Top Controls Bar (Hidden in Print) */}
        <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-5 py-3 backdrop-blur no-print">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">Official Payslip Preview</span>
            <span className="badge badge-info font-mono">
              {result.worker_code}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="btn btn-secondary btn-sm"
              title="Print or Save as PDF"
            >
              <Printer />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm"
              title="Close Payslip (Esc)"
            >
              <X />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div className="p-6 sm:p-10 space-y-6 bg-white text-slate-900 print:p-0">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-semibold text-white">
                  S
                </div>
                <h1 className="text-lg font-semibold text-slate-900">Star Solutions Pakistan (Pvt) Ltd</h1>
              </div>
              <p className="text-xs text-slate-500">Clifton Block 4, Karachi • NTN: 8934521-0</p>
            </div>
            <div className="space-y-1 sm:text-right">
              <span className="badge badge-info uppercase tracking-wider">
                Salary Statement
              </span>
              <p className="text-sm font-semibold text-slate-800">{periodName}</p>
              <p className="text-xs text-slate-500">Payment Date: 30 Oct 2026</p>
            </div>
          </div>

          {/* Employee Details Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4 text-[13px] sm:grid-cols-4">
            <div>
              <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">Employee Code</span>
              <span className="font-semibold text-slate-900 font-mono">{result.worker_code}</span>
            </div>
            <div>
              <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">Full Name</span>
              <span className="font-semibold text-slate-900">{result.employee_name}</span>
            </div>
            <div>
              <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">Job Title</span>
              <span className="font-semibold text-slate-800">{result.job_title}</span>
            </div>
            <div>
              <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">Department</span>
              <span className="font-semibold text-slate-800">{result.department}</span>
            </div>
            <div>
              <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">Scheduled Workdays</span>
              <span className="font-semibold text-slate-800">{result.scheduled_workdays} days</span>
            </div>
            <div>
              <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">Payable Days</span>
              <span className="font-semibold text-slate-800">{result.payable_workdays} days</span>
            </div>
            <div>
              <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">Bank Name</span>
              <span className="font-semibold text-slate-800">{result.bank_name}</span>
            </div>
            <div>
              <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">Bank Account</span>
              <span className="font-semibold text-slate-800 font-mono">{result.bank_account_masked}</span>
            </div>
          </div>

          {/* Earnings & Deductions Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings Column */}
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Earnings
              </div>
              <div className="divide-y divide-slate-100 text-[13px]">
                {result.trace_lines
                  .filter((l) => l.type === "Earning")
                  .map((line, idx) => (
                    <div key={idx} className="px-4 py-2.5 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">{line.component_name}</span>
                      <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(line.amount)}</span>
                    </div>
                  ))}
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold">
                <span>Total Gross Earnings</span>
                <span className="text-slate-900 tabular-nums text-sm">{formatCurrency(result.gross_earnings)}</span>
              </div>
            </div>

            {/* Deductions Column */}
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Deductions
              </div>
              <div className="divide-y divide-slate-100 text-[13px]">
                {result.trace_lines
                  .filter((l) => l.type === "Deduction")
                  .map((line, idx) => (
                    <div key={idx} className="px-4 py-2.5 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">{line.component_name}</span>
                      <span className="font-semibold text-rose-600 tabular-nums">−{formatCurrency(line.amount)}</span>
                    </div>
                  ))}
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 bg-rose-50/50 px-4 py-3 text-[13px] font-semibold">
                <span className="text-rose-900">Total Deductions</span>
                <span className="text-rose-700 tabular-nums text-sm">−{formatCurrency(result.total_deductions)}</span>
              </div>
            </div>
          </div>

          {/* Net Payable Banner */}
          <div className="flex flex-col gap-2 rounded-lg border border-emerald-200 bg-emerald-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs uppercase font-semibold text-emerald-800 tracking-wider">Net Amount Transferred</span>
              <p className="text-xs text-emerald-700">Automated Direct Bank Deposit into Meezan Bank</p>
            </div>
            <div className="sm:text-right">
              <span className="text-2xl font-semibold text-emerald-800 tabular-nums">
                {formatCurrency(result.net_payable)}
              </span>
            </div>
          </div>

          {/* Employer Contributions Note */}
          <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>Employer Statutory Liabilities: EOBI ({formatCurrency(result.employer_eobi)}) • SESSI ({formatCurrency(result.employer_sessi)})</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> Approved & System Verified
            </span>
          </div>
        </div>

        {/* Modal Bottom Action Footer (Hidden in Print) */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 no-print sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Click outside or press <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-700 shadow-xs">Esc</kbd> to close
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="btn btn-secondary"
            >
              <Printer />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="btn btn-dark"
            >
              <X />
              <span>Close Payslip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

