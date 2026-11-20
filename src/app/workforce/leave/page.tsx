"use client";

import React, { useState, useEffect } from "react";
import { CalendarCheck, Plus, CheckCircle2, XCircle, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { getDB } from "@/lib/storage/db";
import { LeaveBalanceLedger, LeaveRequest, LeavePolicy } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function LeaveManagementPage() {
  const [db] = useState(() => getDB());
  const [ledgers, setLedgers] = useState<LeaveBalanceLedger[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [policies, setPolicies] = useState<LeavePolicy[]>([]);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Form
  const [formEmpId, setFormEmpId] = useState("emp_001");
  const [formPolicyCode, setFormPolicyCode] = useState("AL");
  const [formStartDate, setFormStartDate] = useState("2026-11-26");
  const [formEndDate, setFormEndDate] = useState("2026-11-26");
  const [formUnits, setFormUnits] = useState(1);
  const [formReason, setFormReason] = useState("");

  const refresh = () => {
    setLedgers(db.getLeaveLedgers());
    setRequests(db.getLeaveRequests());
    setPolicies(db.getLeavePolicies());
  };

  useEffect(() => {
    refresh();
  }, []);

  const employees = db.getEmployeesJoined();

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      db.submitLeaveRequest(formEmpId, formPolicyCode, formStartDate, formEndDate, formUnits, formReason || "Personal Leave");
      setShowApplyModal(false);
      refresh();
      alert("Leave request submitted! Balance hold has been placed on the leave ledger.");
    } catch (err: any) {
      alert("Submission error: " + err.message);
    }
  };

  const handleDecision = (requestId: string, decision: "Approved" | "Rejected") => {
    try {
      db.reviewLeaveRequest(requestId, decision, "Line Manager", `Reviewed and ${decision.toLowerCase()} by manager`);
      refresh();
      alert(`Request has been ${decision.toLowerCase()}. Ledger updated.`);
    } catch (err: any) {
      alert("Action error: " + err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Leave Balance Ledger & Requests</h1>
          <p className="text-xs text-slate-500">
            Double-entry leave ledger • Accruals, pre-submission reservation holds, and unpaid leave feed to payroll cutoff
          </p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Balance Ledgers Grid */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Employee Balance Ledgers (Grants, Usage & Holds)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ledgers.map((l) => {
            const emp = employees.find((e) => e.id === l.employment_id);
            return (
              <div key={l.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{emp?.fullName || l.employment_id}</span>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                    {l.policy_code}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-center pt-1 border-t border-slate-100">
                  <div className="p-1 rounded bg-slate-50">
                    <span className="text-[9px] text-slate-400 uppercase block font-bold">Total</span>
                    <span className="font-bold text-slate-800">{l.total_entitlement}</span>
                  </div>
                  <div className="p-1 rounded bg-slate-50">
                    <span className="text-[9px] text-slate-400 uppercase block font-bold">Used</span>
                    <span className="font-bold text-slate-800">{l.used}</span>
                  </div>
                  <div className="p-1 rounded bg-amber-50">
                    <span className="text-[9px] text-amber-600 uppercase block font-bold">On Hold</span>
                    <span className="font-bold text-amber-800">{l.on_hold}</span>
                  </div>
                  <div className="p-1 rounded bg-emerald-50">
                    <span className="text-[9px] text-emerald-600 uppercase block font-bold">Available</span>
                    <span className="font-bold text-emerald-700">{l.available}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Leave Requests & Approval Queue</h2>
          <span className="text-xs text-slate-500 font-mono">Requests: {requests.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Dates</th>
                <th className="px-5 py-3">Units</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {requests.map((req) => {
                const emp = employees.find((e) => e.id === req.employment_id);
                return (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{emp?.fullName || req.employment_id}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-700 text-[10px]">
                        {req.policy_code}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium">{formatDate(req.start_date)}</td>
                    <td className="px-5 py-3.5 font-bold">{req.units} day(s)</td>
                    <td className="px-5 py-3.5 text-slate-600">{req.reason}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        req.status === "Approved" ? "bg-emerald-100 text-emerald-800" : (req.status === "Submitted" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800")
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      {req.status === "Submitted" && (
                        <>
                          <button
                            onClick={() => handleDecision(req.id, "Approved")}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDecision(req.id, "Rejected")}
                            className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[11px] transition"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-brand-400" /> Apply for Leave
              </h2>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleApplyLeave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Employee</label>
                <select
                  value={formEmpId}
                  onChange={(e) => setFormEmpId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.worker_code} - {e.fullName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Leave Policy</label>
                  <select
                    value={formPolicyCode}
                    onChange={(e) => setFormPolicyCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    {policies.map((p) => (
                      <option key={p.id} value={p.code}>{p.name} ({p.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Duration (Units)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formUnits}
                    onChange={(e) => setFormUnits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">End Date</label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Reason</label>
                <textarea
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  placeholder="State reason for absence..."
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                Notice: Submitting will reserve {formUnits} unit(s) on hold immediately.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
