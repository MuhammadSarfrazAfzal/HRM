"use client";

import React, { useState } from "react";
import { Briefcase, UserPlus, CheckCircle2, ArrowRight } from "lucide-react";
import { getDB } from "@/lib/storage/db";
import { formatCurrency } from "@/lib/utils";

export default function RecruitmentATSPage() {
  const [db] = useState(() => getDB());
  const requisitions = db.getRequisitions();

  const candidates = [
    { id: "c1", name: "Hamza Tariq", role: "Senior Full-Stack Engineer", stage: "Interview", email: "hamza.tariq@gmail.com", rating: "4.8/5" },
    { id: "c2", name: "Ayesha Siddiqui", role: "Operations Shift Lead", stage: "Offer", email: "ayesha.s@outlook.com", offeredSalary: 125000 },
    { id: "c3", name: "Zubair Ahmed", role: "Senior Full-Stack Engineer", stage: "Screening", email: "zubair.ahmed@yahoo.com", rating: "4.2/5" },
  ];

  const handleConvertToOnboarding = (candidate: any) => {
    alert(`Candidate ${candidate.name} converted to an active Onboarding Case in Core HR with offered salary ${formatCurrency(candidate.offeredSalary || 120000)}.`);
  };

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Recruitment & Applicant Tracking (ATS)</h1>
        <p className="page-subtitle">
          FlowHCM Benchmark • Headcount requisitions, interview feedback, and 1-click offer to Onboarding conversion
        </p>
      </div>

      {/* Requisitions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {requisitions.map((req) => (
          <div key={req.id} className="card p-5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 text-sm">{req.title}</span>
              <span className="badge badge-success">
                {req.status}
              </span>
            </div>
            <p className="text-slate-500">{req.department} • Open Positions: {req.positions_count}</p>
            <div className="text-[11px] text-slate-600 tabular-nums">
              Budget: {formatCurrency(req.budget_min)} – {formatCurrency(req.budget_max)}
            </div>
          </div>
        ))}
      </div>

      {/* Candidates Pipeline Table */}
      <div className="card overflow-hidden">
        <div className="card-header">
          <h2 className="card-title">Candidate Pipeline</h2>
          <span className="card-meta">Active applicants: {candidates.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="px-5 py-3">Candidate Name</th>
                <th className="px-5 py-3">Applied Position</th>
                <th className="px-5 py-3">Pipeline Stage</th>
                <th className="px-5 py-3">Evaluation / Salary</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c.id}>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-900">{c.name}</span>
                    <div className="text-[11px] text-slate-400">{c.email}</div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{c.role}</td>
                  <td className="px-5 py-3.5">
                    <span className="badge badge-info">
                      {c.stage}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 tabular-nums">
                    {c.offeredSalary ? formatCurrency(c.offeredSalary) : c.rating}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {c.stage === "Offer" && (
                      <button
                        onClick={() => handleConvertToOnboarding(c)}
                        className="btn btn-success btn-xs"
                      >
                        Convert to Onboarding
                      </button>
                    )}
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
