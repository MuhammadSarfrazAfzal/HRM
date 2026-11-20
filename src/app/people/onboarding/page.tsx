"use client";

import React, { useState, useEffect } from "react";
import { UserPlus, CheckCircle, Clock, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import { getDB } from "@/lib/storage/db";
import { OnboardingCase } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function OnboardingPage() {
  const [db] = useState(() => getDB());
  const [cases, setCases] = useState<OnboardingCase[]>([]);

  const refresh = () => {
    setCases(db.getOnboardingCases());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleToggleTask = (caseId: string, taskId: string) => {
    db.toggleOnboardingTask(caseId, taskId);
    refresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Onboarding Lifecycle & Checklists</h1>
        <p className="text-xs text-slate-500">
          FlowHCM Benchmark • Draft &rarr; Ready &rarr; Active transition with mandatory payroll readiness verification
        </p>
      </div>

      <div className="space-y-4">
        {cases.map((c) => {
          const mandatoryDone = c.tasks.filter((t) => t.mandatory_for_payroll).every((t) => t.completed);
          const totalDone = c.tasks.filter((t) => t.completed).length;

          return (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900">{c.candidate_name}</h2>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        c.status === "Active" ? "bg-emerald-100 text-emerald-800" : (c.status === "Ready" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800")
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{c.job_title} • {c.department} • Start: {formatDate(c.start_date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-800">
                      {totalDone} of {c.tasks.length} Completed
                    </span>
                    <div className="text-[10px] text-slate-400">
                      {mandatoryDone ? "✓ Ready for Payroll" : "⚠ Missing Payroll Mandatory Tasks"}
                    </div>
                  </div>
                  <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-600 h-full transition-all"
                      style={{ width: `${(totalDone / c.tasks.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Task Items */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assigned Checklist Tasks
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {c.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(c.id, task.id)}
                      className={`p-3.5 rounded-xl border text-xs cursor-pointer transition flex items-start gap-3 ${
                        task.completed
                          ? "bg-emerald-50/50 border-emerald-200 text-slate-700"
                          : "bg-slate-50 border-slate-200 hover:border-brand-400 text-slate-800"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {}} // handled by div
                        className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                      <div className="space-y-0.5">
                        <span className={`font-semibold block ${task.completed ? "line-through text-slate-400" : "text-slate-900"}`}>
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span className="px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-600 font-medium">
                            {task.category}
                          </span>
                          <span>Due: {task.due_date}</span>
                          {task.mandatory_for_payroll && (
                            <span className="text-rose-600 font-bold">• Payroll Mandatory</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
