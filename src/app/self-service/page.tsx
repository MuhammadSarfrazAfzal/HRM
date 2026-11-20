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
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Mobile-styled ESS Header Card */}
      <div className="bg-gradient-to-r from-slate-900 to-brand-950 text-white rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center font-bold text-lg text-brand-300">
              SR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold">Sam Rivera</h1>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-brand-500/30 text-brand-200 font-bold">
                  E00412
                </span>
              </div>
              <p className="text-xs text-slate-300">Operations Supervisor • Clifton Site, Karachi</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Active Staff
          </span>
        </div>

        {/* Quick Punch Bar with GPS */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-400" />
              <span>Shift: 09:00 – 17:00 (General Day)</span>
            </div>
            <p className="text-[11px] text-slate-300">Geofence: Clifton Tech Park (Within 250m)</p>
          </div>
          <button
            onClick={handleMobileClock}
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 text-xs font-black shadow-lg transition flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4" />
            <span>Clock In / Out (Mobile GPS)</span>
          </button>
        </div>

        {clockStatus && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs font-semibold text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{clockStatus}</span>
          </div>
        )}
      </div>

      {/* Leave Balances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {leaveLedgers.map((l) => (
          <div key={l.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">{l.policy_code} Balance</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Ledger</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{l.available}</span>
              <span className="text-xs text-slate-500">days available</span>
            </div>
            <p className="text-[11px] text-slate-400">{l.used} used • {l.on_hold} on hold</p>
          </div>
        ))}
      </div>

      {/* Latest Published Payslip Card */}
      {publishedResult && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">October 2026 Salary Statement</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Published
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Net Transferred: <strong>{formatCurrency(publishedResult.net_payable)}</strong> • Meezan Bank (PK36****5678)
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPayslipModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-brand-400" />
            <span>View & Download Payslip</span>
          </button>
        </div>
      )}

      {/* Attendance History */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">My Recent Attendance Records</h3>
          <span className="text-xs text-slate-400 font-mono">Shift: 09:00–17:00</span>
        </div>
        <div className="divide-y divide-slate-100 text-xs">
          {attendanceDays.map((d) => (
            <div key={d.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition">
              <div>
                <span className="font-bold text-slate-900">{formatDate(d.local_date)}</span>
                <p className="text-[11px] text-slate-500">In: {d.check_in || "—"} | Out: {d.check_out || "—"}</p>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-800">{d.worked_hours} hours worked</span>
                {d.overtime_hours > 0 && (
                  <span className="text-emerald-700 font-bold block text-[11px]">+{d.overtime_hours} hrs OT approved</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <PayslipModal
        result={publishedResult || null}
        onClose={() => setShowPayslipModal(false)}
      />
    </div>
  );
}
