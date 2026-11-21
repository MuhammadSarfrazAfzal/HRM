"use client";

import React from "react";
import { Settings, ShieldCheck, Calculator, FileText, CheckCircle2 } from "lucide-react";

export default function PayrollSetupPage() {
  const components = [
    { code: "BASIC_SALARY", name: "Contractual Basic Compensation", type: "Earning", taxTreatment: "Fully Taxable", proration: "Calendar or Payable Workdays", rounding: "Nearest minor unit (0.01)" },
    { code: "OVERTIME_PAY", name: "Approved Overtime Hours", type: "Earning", taxTreatment: "Taxable as Normal Income", proration: "Applied Hourly Rate * Hours", rounding: "Nearest minor unit (0.01)" },
    { code: "TAX_WHT", name: "Federal Income Tax Withholding", type: "Deduction", taxTreatment: "FBR Sec 149 TY2027 Progressive Brackets", proration: "Annualized forecast / 12", rounding: "Nearest rupee" },
    { code: "EOBI_EE", name: "Employees' Old-Age Benefits (Employee)", type: "Deduction", taxTreatment: "Statutory 1% on minimum wage base", proration: "Fixed statutory monthly", rounding: "Exact (PKR 320)" },
    { code: "EOBI_ER", name: "Employees' Old-Age Benefits (Employer)", type: "Employer_Cost", taxTreatment: "Statutory 5% on minimum wage base", proration: "Fixed statutory monthly", rounding: "Exact (PKR 1,600)" },
    { code: "SESSI_ER", name: "Sindh Social Security (Employer)", type: "Employer_Cost", taxTreatment: "5% on gross below statutory ceiling (37k)", proration: "Monthly threshold check", rounding: "Nearest minor unit" },
    { code: "LOAN_RECOVERY", name: "Employee Loan & Advance Installment", type: "Deduction", taxTreatment: "Post-tax recovery capped at balance", proration: "Fixed installment schedule", rounding: "Exact amount" },
  ];

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Pay Components & Rule Versioning</h1>
        <p className="page-subtitle">
          FlowHCM Benchmark • Component taxonomy, formula grammars, taxability flags, proration basis & GL mapping
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="card-header">
          <h2 className="card-title">Configured Pay Component Versions</h2>
          <span className="text-xs px-2.5 py-1 rounded bg-brand-50 text-brand-700 font-semibold">Rule Pack: PK-2026-V1</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Component Name</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Tax Treatment</th>
                <th className="px-5 py-3">Proration Basis</th>
                <th className="px-5 py-3">Rounding</th>
              </tr>
            </thead>
            <tbody>
              {components.map((c) => (
                <tr key={c.code}>
                  <td className="px-5 py-3.5 font-mono font-semibold text-slate-900">{c.code}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{c.name}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      c.type === "Earning" ? "bg-emerald-100 text-emerald-800" : (c.type === "Deduction" ? "bg-rose-100 text-rose-800" : "bg-blue-100 text-blue-800")
                    }`}>
                      {c.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{c.taxTreatment}</td>
                  <td className="px-5 py-3.5 text-slate-600">{c.proration}</td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">{c.rounding}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
