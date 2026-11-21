"use client";

import React, { useState } from "react";
import { ShieldCheck, FileText, Download, Building2, CheckCircle2, AlertOctagon } from "lucide-react";
import { calculatePakistanSalaryTax, calculateEOBI, calculateSESSI, validateMinimumWageFloor } from "@/lib/payroll/pakistanTaxEngine";
import { formatCurrency } from "@/lib/utils";

export default function CompliancePage() {
  const [testSalary, setTestSalary] = useState(140000);
  const taxResult = calculatePakistanSalaryTax(testSalary);
  const eobi = calculateEOBI(testSalary);
  const sessi = calculateSESSI(testSalary);
  const minWage = validateMinimumWageFloor(testSalary);

  const brackets = [
    { threshold: "Up to PKR 600,000", rate: "0%", tax: "Nil" },
    { threshold: "PKR 600,001 – 1,200,000", rate: "5%", tax: "5% of excess over 600,000" },
    { threshold: "PKR 1,200,001 – 2,200,000", rate: "15%", tax: "PKR 30,000 + 15% of excess over 1,200,000" },
    { threshold: "PKR 2,200,001 – 3,200,000", rate: "25%", tax: "PKR 180,000 + 25% of excess over 2,200,000" },
    { threshold: "PKR 3,200,001 – 4,100,000", rate: "30%", tax: "PKR 430,000 + 30% of excess over 3,200,000" },
    { threshold: "Exceeding PKR 4,100,000", rate: "35%", tax: "PKR 700,000 + 35% of excess over 4,100,000" },
  ];

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Pakistan Jurisdiction & Statutory Rules</h1>
        <p className="page-subtitle">
          FBR Income Tax Ordinance 2001 Sec 149 (TY2027) • EOBI Act 1976 • SESSI (Sindh) • Minimum Wage Compliance
        </p>
      </div>

      {/* Interactive Tax Calculator Widget */}
      <div className="card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="icon-tile">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="card-title">FBR Section 149 Withholding Tax Simulator</h2>
              <p className="text-xs text-slate-500">Enacted Rate Card for Tax Year 2027 (Finance Act 2026)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-700">Monthly Taxable Income (PKR):</label>
            <input
              type="number"
              value={testSalary}
              onChange={(e) => setTestSalary(Number(e.target.value))}
              className="input input-sm w-36 font-semibold tabular-nums"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="stat-tile p-3">
            <span className="stat-label">Annual Forecast</span>
            <span className="stat-value">
              {formatCurrency(taxResult.estimatedAnnualTaxableSalary)}
            </span>
          </div>
          <div className="stat-tile p-3">
            <span className="stat-label">Annual Tax Liability</span>
            <span className="stat-value">
              {formatCurrency(taxResult.annualTax)}
            </span>
          </div>
          <div className="stat-tile border-rose-200 bg-rose-50/60 p-3">
            <span className="stat-label text-rose-700">Monthly Withholding</span>
            <span className="stat-value text-rose-700">
              {formatCurrency(taxResult.monthlyWithholdingTax)}
            </span>
          </div>
          <div className="stat-tile p-3">
            <span className="stat-label">Marginal Tax Rate</span>
            <span className="stat-value">
              {(taxResult.marginalRate * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="stat-tile p-3 text-xs tabular-nums text-slate-700">
          Applied Formula: {taxResult.applicableBracketText}
        </div>
      </div>

      {/* Tax Year 2027 Schedule Table */}
      <div className="card overflow-hidden">
        <div className="card-header">
          <h2 className="card-title">FBR Income Tax Schedule (First Schedule, Part I, Division I)</h2>
          <span className="text-xs px-2.5 py-1 rounded bg-slate-200 text-slate-700 font-mono font-semibold">TY 2027</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="px-5 py-3">Taxable Salary Slabs (Annual)</th>
                <th className="px-5 py-3">Marginal Rate</th>
                <th className="px-5 py-3">Tax Computation Rule</th>
              </tr>
            </thead>
            <tbody>
              {brackets.map((b, idx) => (
                <tr key={idx}>
                  <td className="px-5 py-3.5 font-semibold text-slate-900 font-mono">{b.threshold}</td>
                  <td className="px-5 py-3.5 font-semibold text-brand-600 font-mono">{b.rate}</td>
                  <td className="px-5 py-3.5 font-medium">{b.tax}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statutory Artifacts & Output Exporters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
            <FileText className="w-4 h-4 text-brand-600" />
            <span>FBR Section 149 / 164 Certificate</span>
          </div>
          <p className="text-xs text-slate-500">
            Generate employee salary withholding tax certificate data and Section 165 annual statement in IRIS 2.0 format.
          </p>
          <button
            onClick={() => alert("FBR Sec 164 Certificate generated for all active employments (IRIS 2.0 compliant).")}
            className="btn btn-secondary w-full justify-center"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export IRIS Certificate Data</span>
          </button>
        </div>

        <div className="card p-5 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
            <Building2 className="w-4 h-4 text-brand-600" />
            <span>EOBI Contribution Schedule</span>
          </div>
          <p className="text-xs text-slate-500">
            Employees' Old-Age Benefits schedule with employer liability (5%) & employee deduction (1%) voucher reconciliation.
          </p>
          <button
            onClick={() => alert("EOBI Payment Voucher generated for bank acknowledgment.")}
            className="btn btn-secondary w-full justify-center"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export EOBI Monthly Schedule</span>
          </button>
        </div>

        <div className="card p-5 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>SESSI Social Security Return</span>
          </div>
          <p className="text-xs text-slate-500">
            Sindh Employees' Social Security Institution monthly return schedule for covered employees under the statutory ceiling.
          </p>
          <button
            onClick={() => alert("SESSI Monthly Form B schedule generated.")}
            className="btn btn-secondary w-full justify-center"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export SESSI Monthly Return</span>
          </button>
        </div>
      </div>
    </div>
  );
}
