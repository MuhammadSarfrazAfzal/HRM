"use client";

import React, { useState, useEffect } from "react";
import { Smartphone, Clock, CalendarCheck, FileText, CheckCircle2, MapPin, AlertTriangle, Download } from "lucide-react";
import { getDB } from "@/lib/storage/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PayslipModal } from "@/components/payroll/PayslipModal";

export default function EmployeePortalPage() {
  const [db] = useState(() => getDB());
  const [clockStatus, setClockStatus] = useState<string | null>(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);

  // Focus employee: Sam Rivera (E00412)
  const employee = db.getEmployeesJoined().find((e) => e.worker_code === "E00412");
  const attendanceDays = db.getAttendanceDays().filter((d) => d.employment_id === "emp_001");
  const leaveLedgers = db.getLeaveLedgers("emp_001");
  const publishedResult = db.getEmployeeResults("pr_2026_10").find((r) => r.worker_code === "E00412");

  const handleMobileClock = () => {
    try {
      const res = db.clockInOrOut("emp_001", "Mobile", 24.8185, 67.0312);
      setClockStatus(`Clock-${res.punchType} confirmed at ${res.time} (GPS Verified In-Bounds)`);
      setTimeout(() => setClockStatus(null), 5000);
    } catch (err: any) {
      alert("Clock error: " + err.message);
    }
  };

  return (
    <div className="page mx-auto max-w-4xl">
      {/* Mobile-styled ESS Header Card */}
      <div className="relative space-y-5 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-5 text-white shadow-card sm:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(58,104,246,0.35),transparent_55%)]"
        />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-base font-semibold text-white ring-4 ring-white/10">
              SR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">Sam Rivera</h1>
                <span className="badge bg-white/10 font-mono text-slate-100 ring-white/20">
                  E00412
                </span>
              </div>
              <p className="text-[13px] text-slate-300">Operations Supervisor • Clifton Site, Karachi</p>
            </div>
          </div>
          <span className="badge bg-emerald-400/10 text-emerald-300 ring-emerald-400/30">
            <span className="badge-dot" />
            Active Staff
          </span>
        </div>

        {/* Quick Punch Bar with GPS */}
        <div className="relative flex flex-col justify-between gap-3 rounded-lg border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-100">
              <MapPin className="h-4 w-4 text-brand-300" />
              <span>Shift: 09:00 – 17:00 (General Day)</span>
            </div>
            <p className="text-xs text-slate-400">Geofence: Clifton Tech Park (Within 250m)</p>
          </div>
          <button
            onClick={handleMobileClock}
            className="btn bg-white text-slate-900 shadow-xs hover:bg-slate-100"
          >
            <Clock />
            <span>Clock In / Out (Mobile GPS)</span>
          </button>
        </div>

        {clockStatus && (
          <div className="relative flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-[13px] font-medium text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{clockStatus}</span>
          </div>
        )}
      </div>

      {/* Leave Balances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {leaveLedgers.map((l) => (
          <div key={l.id} className="card space-y-1.5 p-5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-slate-600">{l.policy_code} Balance</span>
              <span className="tag">Ledger</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold tabular-nums tracking-tight text-slate-900">{l.available}</span>
              <span className="text-xs text-slate-500">days available</span>
            </div>
            <p className="text-xs text-slate-500">{l.used} used • {l.on_hold} on hold</p>
          </div>
        ))}
      </div>

      {/* Latest Published Payslip Card */}
      {publishedResult && (
        <div className="card flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="icon-tile bg-emerald-50 text-emerald-600 ring-emerald-100">
              <FileText />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="card-title">October 2026 Salary Statement</h3>
                <span className="badge badge-success">
                  Published
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Net Transferred: <strong className="font-semibold text-slate-900">{formatCurrency(publishedResult.net_payable)}</strong> • Meezan Bank (PK36****5678)
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPayslipModal(true)}
            className="btn btn-primary"
          >
            <Download />
            <span>View & Download Payslip</span>
          </button>
        </div>
      )}

      {/* Attendance History */}
      <div className="card overflow-hidden">
        <div className="card-header">
          <h3 className="card-title">My Recent Attendance Records</h3>
          <span className="card-meta">Shift: 09:00–17:00</span>
        </div>
        <div className="divide-y divide-slate-100 text-[13px]">
          {attendanceDays.map((d) => (
            <div key={d.id} className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50/70">
              <div>
                <span className="font-semibold text-slate-900">{formatDate(d.local_date)}</span>
                <p className="text-xs text-slate-500">In: {d.check_in || "—"} | Out: {d.check_out || "—"}</p>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-800">{d.worked_hours} hours worked</span>
                {d.overtime_hours > 0 && (
                  <span className="text-emerald-700 font-medium block text-xs">+{d.overtime_hours} hrs OT approved</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <PayslipModal
        result={showPayslipModal ? publishedResult || null : null}
        onClose={() => setShowPayslipModal(false)}
      />
    </div>
  );
}
