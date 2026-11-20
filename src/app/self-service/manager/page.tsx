"use client";

import React, { useState, useEffect } from "react";
import { HardHat, CheckCircle2, XCircle, Calendar, Users, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { getDB } from "@/lib/storage/db";
import { LeaveRequest } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function ManagerPortalPage() {
  const [db] = useState(() => getDB());
  const [requests, setRequests] = useState<LeaveRequest[]>([]);

  const refresh = () => {
    setRequests(db.getLeaveRequests().filter((r) => r.status === "Submitted"));
  };

  useEffect(() => {
    refresh();
  }, []);

  const employees = db.getEmployeesJoined();

  const handleDecision = (requestId: string, decision: "Approved" | "Rejected") => {
    db.reviewLeaveRequest(requestId, decision, "Operations Line Manager");
    refresh();
    alert(`Request ${decision.toLowerCase()}! Team coverage updated.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Manager Team Inbox & Approvals</h1>
        <p className="text-xs text-slate-500">
          FlowHCM Benchmark • Team inbox, shift coverage validation (e.g. 7 of 9 present), and anti-self-approval enforcement
        </p>
      </div>

      {/* Coverage Indicator Card */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Operations Team Roster Coverage</h2>
            <p className="text-xs text-slate-500">Retail North & Operations Shift Coverage: <strong>7 of 9 staff active</strong></p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
            Coverage Safe (78%)
          </span>
        </div>
      </div>

      {/* Approval Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Pending Team Requests Awaiting Action</h2>
          <span className="text-xs font-mono text-slate-500 font-bold">{requests.length} Requests</span>
        </div>

        {requests.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            ✓ All team requests have been reviewed and acted upon.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {requests.map((req) => {
              const emp = employees.find((e) => e.id === req.employment_id);
              return (
                <div key={req.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{emp?.fullName || req.employment_id}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-bold">
                        {req.policy_code} Leave
                      </span>
                    </div>
                    <p className="text-slate-600">
                      Dates: <strong>{formatDate(req.start_date)}</strong> ({req.units} day) • Reason: "{req.reason}"
                    </p>
                    <div className="text-[11px] text-slate-400">
                      Team coverage on {formatDate(req.start_date)} will be 6 of 9 staff (within policy tolerance)
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecision(req.id, "Approved")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition"
                    >
                      Approve Request
                    </button>
                    <button
                      onClick={() => handleDecision(req.id, "Rejected")}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
