"use client";

import React, { useState, useEffect } from "react";
import { Clock, Calendar, CheckCircle2, AlertTriangle, ShieldCheck, Play, ArrowRight, UserCheck } from "lucide-react";
import { getDB } from "@/lib/storage/db";
import { ShiftTemplate, WorkDay } from "@/lib/types";

export default function WorkforceAttendancePage() {
  const [db] = useState(() => getDB());
  const [shifts, setShifts] = useState<ShiftTemplate[]>([]);
  const [days, setDays] = useState<WorkDay[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState("emp_001");
  const [punchFeedback, setPunchFeedback] = useState<string | null>(null);

  const refresh = () => {
    setShifts(db.getShifts());
    setDays(db.getAttendanceDays());
  };

  useEffect(() => {
    refresh();
  }, []);

  const employees = db.getEmployeesJoined();

  const handleSimulatePunch = (source: "Web" | "Mobile" | "Biometric") => {
    try {
      const res = db.clockInOrOut(selectedEmpId, source, 24.8185, 67.0312);
      refresh();
      setPunchFeedback(`Success: Clock-${res.punchType} recorded at ${res.time} via ${source}`);
      setTimeout(() => setPunchFeedback(null), 4000);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Time & Attendance Management</h1>
        <p className="page-subtitle">
          FlowHCM Benchmark • Shift rosters, biometric punch pairing, overnight shifts, tolerances & overtime approval
        </p>
      </div>

      {/* Simulator Action Widget */}
      <div className="card p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="icon-tile">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="card-title">Attendance Clock Simulator</h2>
            <p className="text-xs text-slate-500">Simulate punches from biometric terminal, web, or mobile app</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
            className="select input-sm w-auto font-medium"
          >
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.worker_code} - {e.fullName}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleSimulatePunch("Biometric")}
            className="btn btn-dark btn-xs"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>Simulate Biometric Punch</span>
          </button>

          <button
            onClick={() => handleSimulatePunch("Web")}
            className="btn btn-primary btn-xs"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Web Punch</span>
          </button>
        </div>
      </div>

      {punchFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{punchFeedback}</span>
        </div>
      )}

      {/* Shifts Configuration Grid */}
      <div>
        <h2 className="section-title mb-3">
          Configured Shift Templates (Overnight Shift Pairing Enabled)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {shifts.map((shift) => (
            <div key={shift.id} className="card p-4 space-y-2 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{shift.name}</span>
                {shift.is_overnight && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                    Overnight Pairing
                  </span>
                )}
              </div>
              <div className="text-slate-600 font-mono text-sm font-semibold">
                {shift.start_time} &rarr; {shift.end_time}
              </div>
              <div className="text-[11px] text-slate-400 space-y-0.5">
                <div>Grace Period: {shift.grace_period_mins} mins</div>
                <div>Unpaid Break: {shift.unpaid_break_mins} mins</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance & Exceptions Table */}
      <div className="card overflow-hidden">
        <div className="card-header">
          <h2 className="card-title">Recorded Workdays & Attendance Log</h2>
          <span className="card-meta">Total records: {days.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Shift</th>
                <th className="px-5 py-3">Check-In</th>
                <th className="px-5 py-3">Check-Out</th>
                <th className="px-5 py-3">Worked Hrs</th>
                <th className="px-5 py-3">Overtime</th>
                <th className="px-5 py-3">Exceptions / Notes</th>
              </tr>
            </thead>
            <tbody>
              {days.map((d) => {
                const emp = employees.find((e) => e.id === d.employment_id);
                return (
                  <tr key={d.id}>
                    <td className="px-5 py-3.5 font-mono font-medium">{d.local_date}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{emp?.fullName || d.employment_id}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                        General Day
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-semibold text-slate-900">{d.check_in || "—"}</td>
                    <td className="px-5 py-3.5 font-mono font-semibold text-slate-900">{d.check_out || "—"}</td>
                    <td className="px-5 py-3.5 font-semibold">{d.worked_hours} hrs</td>
                    <td className="px-5 py-3.5">
                      {d.overtime_hours > 0 ? (
                        <span className="text-emerald-700 font-semibold font-mono">
                          +{d.overtime_hours} hrs ({d.overtime_status})
                        </span>
                      ) : (
                        <span className="text-slate-400">0.0</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {d.exceptions.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {d.exceptions.map((ex, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">
                              {ex}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-emerald-600 font-medium text-[11px]">✓ Normal</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
