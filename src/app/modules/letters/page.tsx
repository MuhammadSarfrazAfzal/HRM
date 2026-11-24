"use client";

import React, { useState } from "react";
import { FileText, Download, Printer, ShieldCheck } from "lucide-react";
import { getDB } from "@/lib/storage/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function HrLettersPage() {
  const [db] = useState(() => getDB());
  const employees = db.getEmployeesJoined();
  const [selectedEmpId, setSelectedEmpId] = useState("emp_001");
  const [letterType, setLetterType] = useState("Salary Certificate");

  const emp = employees.find((e) => e.id === selectedEmpId) || employees[0];

  return (
    <div className="page">
      <div>
        <h1 className="page-title">HR Letters & Standard Forms</h1>
        <p className="page-subtitle">
          FlowHCM Benchmark • Versioned templates, authorized field merge tokens, preview, and tamper-evident PDF output
        </p>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div>
            <label className="stat-label mb-0.5">Select Employee</label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="select input-sm w-full sm:w-auto font-medium"
            >
              {employees.map((e) => (
                <option key={e.id} value={e.id}>{e.worker_code} - {e.fullName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="stat-label mb-0.5">Template</label>
            <select
              value={letterType}
              onChange={(e) => setLetterType(e.target.value)}
              className="select input-sm w-full sm:w-auto font-medium"
            >
              <option value="Salary Certificate">Salary Certificate</option>
              <option value="Employment Verification">Employment Verification Letter</option>
              <option value="Experience Letter">Experience & Service Letter</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="btn btn-dark"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Export PDF Letter</span>
        </button>
      </div>

      {/* Rendered Letter Preview Paper */}
      <div className="card shadow-lg p-8 sm:p-12 max-w-2xl mx-auto space-y-6 text-slate-900 text-xs">
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-base font-semibold">Star Solutions Pakistan (Pvt) Ltd</h2>
            <p className="text-[11px] text-slate-500">Clifton Block 4, Karachi, Pakistan</p>
          </div>
          <span className="font-mono text-[11px] text-slate-400">Date: {formatDate(new Date().toISOString())}</span>
        </div>

        <div className="text-center py-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider underline">
            TO WHOM IT MAY CONCERN
          </h3>
          <p className="text-xs font-semibold text-brand-700 mt-1">{letterType}</p>
        </div>

        <div className="space-y-4 text-justify leading-relaxed text-slate-700">
          <p>
            This is to certify that <strong>{emp?.fullName}</strong> (National CNIC: <span className="font-mono font-semibold">{emp?.person.national_id}</span>, Employee Code: <span className="font-mono font-semibold">{emp?.worker_code}</span>) is a confirmed, full-time employee of <strong>Star Solutions Pakistan (Pvt) Ltd</strong> since <strong>{formatDate(emp?.hire_date)}</strong>.
          </p>

          <p>
            Mr./Ms. {emp?.person.last_name} currently holds the position of <strong>{emp?.assignment.job_title}</strong> in our <strong>{emp?.orgUnit?.name}</strong> Department.
          </p>

          {letterType === "Salary Certificate" && (
            <p>
              As per our official payroll records, their gross monthly contractual compensation is <strong>PKR 100,000.00</strong> (Pak Rupees One Hundred Thousand Only). All statutory deductions and federal taxes are withheld as per the provisions of Section 149 of the Income Tax Ordinance 2001.
            </p>
          )}

          <p>
            This certificate is issued upon the specific request of the employee without any legal liability on the part of this organization.
          </p>
        </div>

        <div className="pt-8 border-t border-slate-100 flex items-end justify-between">
          <div className="space-y-1">
            <div className="w-32 border-b border-slate-400"></div>
            <p className="font-semibold text-slate-900">Head of Human Resources</p>
            <p className="text-[11px] text-slate-500">Star Solutions Pakistan (Pvt) Ltd</p>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Ref: SSP/HR/{emp?.worker_code}/2026</span>
        </div>
      </div>
    </div>
  );
}
