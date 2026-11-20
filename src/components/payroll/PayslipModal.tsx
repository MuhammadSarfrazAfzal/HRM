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
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 py-6 sm:py-10"
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 my-auto sm:my-4"
      >
        {/* Sticky Modal Top Controls Bar (Hidden in Print) */}
        <div className="sticky top-0 z-30 px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shadow-md no-print">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Official Payslip Preview</span>
            <span className="text-xs bg-brand-500 text-white px-2 py-0.5 rounded-full font-mono font-bold">
              {result.worker_code}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition border border-slate-700"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-brand-400" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-sm hover:scale-105"
              title="Close Payslip (Esc)"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div className="p-6 sm:p-10 space-y-6 bg-white text-slate-900 print:p-0">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-black text-sm">
                  S
                </div>
                <h1 className="text-lg font-bold text-slate-900">Star Solutions Pakistan (Pvt) Ltd</h1>
              </div>
              <p className="text-xs text-slate-500">Clifton Block 4, Karachi • NTN: 8934521-0</p>
            </div>
            <div className="text-right space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded">
                Salary Statement
              </span>
              <p className="text-sm font-bold text-slate-800">{periodName}</p>
              <p className="text-[11px] text-slate-400">Payment Date: 30 Oct 2026</p>
            </div>
          </div>

          {/* Employee Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Employee Code</span>
              <span className="font-bold text-slate-900 font-mono">{result.worker_code}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Full Name</span>
              <span className="font-bold text-slate-900">{result.employee_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Job Title</span>
              <span className="font-semibold text-slate-800">{result.job_title}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Department</span>
              <span className="font-semibold text-slate-800">{result.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Scheduled Workdays</span>
              <span className="font-semibold text-slate-800">{result.scheduled_workdays} days</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Payable Days</span>
              <span className="font-semibold text-slate-800">{result.payable_workdays} days</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Bank Name</span>
              <span className="font-semibold text-slate-800">{result.bank_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Bank Account</span>
              <span className="font-semibold text-slate-800 font-mono">{result.bank_account_masked}</span>
            </div>
          </div>

          {/* Earnings & Deductions Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings Column */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100/70 px-4 py-2.5 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                Earnings
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {result.trace_lines
                  .filter((l) => l.type === "Earning")
                  .map((line, idx) => (
                    <div key={idx} className="px-4 py-2.5 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">{line.component_name}</span>
                      <span className="font-bold text-slate-900 font-mono">{formatCurrency(line.amount)}</span>
                    </div>
                  ))}
              </div>
              <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-t border-slate-200 text-xs font-bold">
                <span>Total Gross Earnings</span>
                <span className="text-slate-900 font-mono text-sm">{formatCurrency(result.gross_earnings)}</span>
              </div>
            </div>

            {/* Deductions Column */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100/70 px-4 py-2.5 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                Deductions
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {result.trace_lines
                  .filter((l) => l.type === "Deduction")
                  .map((line, idx) => (
                    <div key={idx} className="px-4 py-2.5 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">{line.component_name}</span>
                      <span className="font-bold text-rose-600 font-mono">−{formatCurrency(line.amount)}</span>
                    </div>
                  ))}
              </div>
              <div className="bg-rose-50/50 px-4 py-3 flex items-center justify-between border-t border-slate-200 text-xs font-bold">
                <span className="text-rose-900">Total Deductions</span>
                <span className="text-rose-700 font-mono text-sm">−{formatCurrency(result.total_deductions)}</span>
              </div>
            </div>
          </div>

          {/* Net Payable Banner */}
          <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider">Net Amount Transferred</span>
              <p className="text-[11px] text-emerald-700">Automated Direct Bank Deposit into Meezan Bank</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-800 font-mono">
                {formatCurrency(result.net_payable)}
              </span>
            </div>
          </div>

          {/* Employer Contributions Note */}
          <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-4 flex items-center justify-between">
            <span>Employer Statutory Liabilities: EOBI ({formatCurrency(result.employer_eobi)}) • SESSI ({formatCurrency(result.employer_sessi)})</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> Approved & System Verified
            </span>
          </div>
        </div>

        {/* Modal Bottom Action Footer (Hidden in Print) */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between no-print">
          <p className="text-xs text-slate-500">
            Click outside or press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 font-mono text-[10px] text-slate-700 font-semibold">Esc</kbd> to close
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <X className="w-4 h-4 text-rose-400" />
              <span>Close Payslip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
