"use client";

import React from "react";
import { Award, CheckCircle2, TrendingUp, Star } from "lucide-react";

export default function PerformanceReviewsPage() {
  const reviews = [
    { employee: "Sam Rivera", role: "Operations Supervisor", cycle: "FY26 Mid-Year Review", selfScore: "4.5", managerScore: "4.7", status: "Calibrated", increment: "8.5%" },
    { employee: "Toni Shah", role: "Senior Financial Analyst", cycle: "FY26 Mid-Year Review", selfScore: "4.8", managerScore: "4.9", status: "Completed", increment: "10.0%" },
    { employee: "Bilal Khan", role: "Lead Software Architect", cycle: "FY26 Mid-Year Review", selfScore: "4.9", managerScore: "4.8", status: "Completed", increment: "12.0%" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Performance Appraisals & 360 Reviews</h1>
        <p className="text-xs text-slate-500">
          FlowHCM Benchmark • Weighted KPI goals, self & manager appraisal forms, calibration, and direct link to compensation
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Appraisal Review Cycles</h2>
          <span className="text-xs font-mono text-slate-500 font-bold">Cycle: FY26 Mid-Year</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Job Title</th>
                <th className="px-5 py-3">Self Rating</th>
                <th className="px-5 py-3">Manager Rating</th>
                <th className="px-5 py-3">Calibration Status</th>
                <th className="px-5 py-3 text-right">Recommended Increment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {reviews.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{r.employee}</td>
                  <td className="px-5 py-3.5 font-medium">{r.role}</td>
                  <td className="px-5 py-3.5 font-mono text-slate-700">{r.selfScore} / 5.0</td>
                  <td className="px-5 py-3.5 font-mono font-bold text-brand-600">{r.managerScore} / 5.0</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-emerald-700">
                    +{r.increment}
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
