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
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Expense & Travel Claims</h1>
        <p className="text-xs text-slate-500">
          FlowHCM Benchmark • Policy spend limits, receipt capture, travel authorizations, and routing to Accounts Payable or Payroll
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Submitted Employee Claims</h2>
          <span className="text-xs font-mono text-slate-500 font-bold">{claims.length} Claims</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="px-5 py-3">Claim ID</th>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Disbursement Channel</th>
                <th className="px-5 py-3 text-right">Amount (PKR)</th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {claims.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900">{c.id}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">{c.employee}</td>
                  <td className="px-5 py-3.5 font-medium">{c.category}</td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">{c.channel}</td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-900">
                    {formatCurrency(c.amount)}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
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
