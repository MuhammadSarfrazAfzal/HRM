"use client";

import React, { useState, useEffect } from "react";
import { CalendarCheck, Plus, CheckCircle2, XCircle, Clock, ShieldCheck, AlertCircle, X } from "lucide-react";
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
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave Balance Ledger & Requests</h1>
          <p className="page-subtitle">
            Double-entry leave ledger • Accruals, pre-submission reservation holds, and unpaid leave feed to payroll cutoff
          </p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Balance Ledgers Grid */}
      <div>
        <h2 className="section-title mb-3">
          Employee Balance Ledgers (Grants, Usage & Holds)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ledgers.map((l) => {
            const emp = employees.find((e) => e.id === l.employment_id);
            return (
              <div key={l.id} className="card p-4 space-y-2 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{emp?.fullName || l.employment_id}</span>
                  <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                    {l.policy_code}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-center pt-1 border-t border-slate-100">
                  <div className="p-1 rounded bg-slate-50">
                    <span className="stat-label">Total</span>
                    <span className="font-semibold text-slate-800">{l.total_entitlement}</span>
                  </div>
                  <div className="p-1 rounded bg-slate-50">
                    <span className="stat-label">Used</span>
                    <span className="font-semibold text-slate-800">{l.used}</span>
                  </div>
                  <div className="p-1 rounded bg-amber-50">
                    <span className="stat-label text-amber-700">On Hold</span>
                    <span className="font-semibold text-amber-800">{l.on_hold}</span>
                  </div>
                  <div className="p-1 rounded bg-emerald-50">
                    <span className="stat-label text-emerald-700">Available</span>
                    <span className="font-semibold text-emerald-700">{l.available}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="card overflow-hidden">
        <div className="card-header">
          <h2 className="card-title">Leave Requests & Approval Queue</h2>
          <span className="card-meta">Requests: {requests.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
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
            <tbody>
              {requests.map((req) => {
                const emp = employees.find((e) => e.id === req.employment_id);
                return (
                  <tr key={req.id}>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{emp?.fullName || req.employment_id}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded font-mono font-semibold bg-slate-100 text-slate-700 text-[11px]">
                        {req.policy_code}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium">{formatDate(req.start_date)}</td>
                    <td className="px-5 py-3.5 font-semibold">{req.units} day(s)</td>
                    <td className="px-5 py-3.5 text-slate-600">{req.reason}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${
                        req.status === "Approved" ? "bg-emerald-100 text-emerald-800" : (req.status === "Submitted" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800")
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2 whitespace-nowrap">
                      {req.status === "Submitted" && (
                        <>
                          <button
                            onClick={() => handleDecision(req.id, "Approved")}
                            className="btn btn-success btn-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDecision(req.id, "Rejected")}
                            className="btn btn-secondary btn-xs"
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
        <div className="modal-backdrop">
          <div className="modal-panel max-w-md">
            <div className="modal-header">
              <h2 className="modal-title">
                <CalendarCheck className="w-4 h-4 text-brand-600" /> Apply for Leave
              </h2>
              <button onClick={() => setShowApplyModal(false)} className="modal-close" aria-label="Close"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleApplyLeave} className="modal-body">
              <div>
                <label className="label">Employee</label>
                <select
                  value={formEmpId}
                  onChange={(e) => setFormEmpId(e.target.value)}
                  className="select"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.worker_code} - {e.fullName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="label">Leave Policy</label>
                  <select
                    value={formPolicyCode}
                    onChange={(e) => setFormPolicyCode(e.target.value)}
                    className="select font-semibold"
                  >
                    {policies.map((p) => (
                      <option key={p.id} value={p.code}>{p.name} ({p.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Duration (Units)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formUnits}
                    onChange={(e) => setFormUnits(Number(e.target.value))}
                    className="input font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="label">Start Date</label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">End Date</label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Reason</label>
                <textarea
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  className="textarea"
                  placeholder="State reason for absence..."
                />
              </div>

              <div className="stat-tile border-amber-200 bg-amber-50/60 p-3 text-[11px] text-amber-900">
                Notice: Submitting will reserve {formUnits} unit(s) on hold immediately.
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
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
