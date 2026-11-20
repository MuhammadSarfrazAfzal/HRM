"use client";

import React, { useState, useEffect } from "react";
import { UserMinus, CheckCircle2, AlertOctagon, FileText, DollarSign, ShieldAlert } from "lucide-react";
import { getDB } from "@/lib/storage/db";
import { SeparationCase } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function SeparationPage() {
  const [db] = useState(() => getDB());
  const [cases, setCases] = useState<SeparationCase[]>([]);

  useEffect(() => {
    setCases(db.getSeparationCases());
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Separation & Full and Final Settlement (F&F)</h1>
        <p className="text-xs text-slate-500">
          Sindh Standing Orders Act 2015 (Standing Order 16) • Clearances, leave encashment, gratuity/PF & loan recovery
        </p>
      </div>

      <div className="space-y-6">
        {cases.map((sc) => (
          <div key={sc.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <UserMinus className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">{sc.employee_name}</h2>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                      {sc.worker_code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-amber-100 text-amber-800">
                      {sc.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Type: {sc.separation_type} • Resigned: {formatDate(sc.resignation_date)} • Last Working Day: <strong>{formatDate(sc.last_working_day)}</strong>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 block uppercase font-bold">Calculated F&F Net Dues</span>
                <span className="text-xl font-black text-emerald-700 font-mono">
                  {formatCurrency(sc.settlement_dues?.net_settlement || 0)}
                </span>
              </div>
            </div>

            {/* Clearances Grid */}
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Departmental Asset & Financial Clearance Checklist
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sc.clearance_checklist.map((c) => (
                  <div
                    key={c.id}
                    className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                      c.cleared ? "bg-emerald-50/60 border-emerald-200 text-slate-800" : "bg-amber-50 border-amber-200 text-amber-900"
                    }`}
                  >
                    {c.cleared ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertOctagon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold block">{c.department}</span>
                      <p className="text-slate-600 text-[11px]">{c.item}</p>
                      {c.remarks && <p className="text-[10px] text-amber-700 italic mt-0.5">{c.remarks}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dues Breakdown */}
            {sc.settlement_dues && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-brand-600" /> Traceable Final Settlement Calculation Lines
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Prorated Final Pay</span>
                    <span className="font-bold text-slate-900 font-mono text-sm">{formatCurrency(sc.settlement_dues.prorated_salary)}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Leave Encashment (AL)</span>
                    <span className="font-bold text-slate-900 font-mono text-sm">{formatCurrency(sc.settlement_dues.unavailed_leave_encashment)}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Gratuity / PF Accrual</span>
                    <span className="font-bold text-slate-900 font-mono text-sm">{formatCurrency(sc.settlement_dues.gratuity_or_pf)}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                    <span className="text-[10px] text-rose-600 uppercase block font-bold">Loan / Dues Recovery</span>
                    <span className="font-bold text-rose-700 font-mono text-sm">−{formatCurrency(sc.settlement_dues.loan_recovery)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
