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
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Recruitment & Applicant Tracking (ATS)</h1>
        <p className="text-xs text-slate-500">
          FlowHCM Benchmark • Headcount requisitions, interview feedback, and 1-click offer to Onboarding conversion
        </p>
      </div>

      {/* Requisitions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {requisitions.map((req) => (
          <div key={req.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">{req.title}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {req.status}
              </span>
            </div>
            <p className="text-slate-500">{req.department} • Open Positions: {req.positions_count}</p>
            <div className="text-[11px] text-slate-600 font-mono">
              Budget: {formatCurrency(req.budget_min)} – {formatCurrency(req.budget_max)}
            </div>
          </div>
        ))}
      </div>

      {/* Candidates Pipeline Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Candidate Pipeline</h2>
          <span className="text-xs text-slate-500 font-mono">Active applicants: {candidates.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="px-5 py-3">Candidate Name</th>
                <th className="px-5 py-3">Applied Position</th>
                <th className="px-5 py-3">Pipeline Stage</th>
                <th className="px-5 py-3">Evaluation / Salary</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {candidates.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-slate-900">{c.name}</span>
                    <div className="text-[11px] text-slate-400">{c.email}</div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{c.role}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-brand-50 text-brand-700 border border-brand-200">
                      {c.stage}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono">
                    {c.offeredSalary ? formatCurrency(c.offeredSalary) : c.rating}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {c.stage === "Offer" && (
                      <button
                        onClick={() => handleConvertToOnboarding(c)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition"
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
