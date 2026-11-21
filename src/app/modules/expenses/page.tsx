"use client";

import React, { useState } from "react";
import { DollarSign, Upload, CheckCircle2, FileText, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function ExpensesTravelPage() {
  const [claims] = useState([
    { id: "EXP_01", employee: "Sam Rivera", category: "Client Entertainment", amount: 14500, currency: "PKR", channel: "Payroll Reimbursement", status: "Approved", ref: "REF-EXP-01" },
    { id: "EXP_02", employee: "Toni Shah", category: "Travel & Fuel", amount: 22000, currency: "PKR", channel: "Accounts Payable", status: "Reimbursed", ref: "REF-EXP-02" },
  ]);

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Expense & Travel Claims</h1>
        <p className="page-subtitle">
          FlowHCM Benchmark • Policy spend limits, receipt capture, travel authorizations, and routing to Accounts Payable or Payroll
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="card-header">
          <h2 className="card-title">Submitted Employee Claims</h2>
          <span className="card-meta">{claims.length} Claims</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="px-5 py-3">Claim ID</th>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Disbursement Channel</th>
                <th className="px-5 py-3 text-right">Amount (PKR)</th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c) => (
                <tr key={c.id}>
                  <td className="px-5 py-3.5 font-mono font-semibold text-slate-900">{c.id}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{c.employee}</td>
                  <td className="px-5 py-3.5 font-medium">{c.category}</td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">{c.channel}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums font-semibold text-slate-900">
                    {formatCurrency(c.amount)}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="badge badge-success">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
