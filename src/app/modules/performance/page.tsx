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
    <div className="page">
      <div>
        <h1 className="page-title">Performance Appraisals & 360 Reviews</h1>
        <p className="page-subtitle">
          FlowHCM Benchmark • Weighted KPI goals, self & manager appraisal forms, calibration, and direct link to compensation
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="card-header">
          <h2 className="card-title">Appraisal Review Cycles</h2>
          <span className="card-meta">Cycle: FY26 Mid-Year</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Job Title</th>
                <th className="px-5 py-3">Self Rating</th>
                <th className="px-5 py-3">Manager Rating</th>
                <th className="px-5 py-3">Calibration Status</th>
                <th className="px-5 py-3 text-right">Recommended Increment</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r, idx) => (
                <tr key={idx}>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{r.employee}</td>
                  <td className="px-5 py-3.5 font-medium">{r.role}</td>
                  <td className="px-5 py-3.5 font-mono text-slate-700">{r.selfScore} / 5.0</td>
                  <td className="px-5 py-3.5 font-mono font-semibold text-brand-600">{r.managerScore} / 5.0</td>
                  <td className="px-5 py-3.5">
                    <span className="badge badge-success">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-semibold text-emerald-700">
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
