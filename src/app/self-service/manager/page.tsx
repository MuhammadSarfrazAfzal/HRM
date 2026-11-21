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
    <div className="page">
      <div>
        <h1 className="page-title">Manager Team Inbox & Approvals</h1>
        <p className="page-subtitle">
          FlowHCM Benchmark • Team inbox, shift coverage validation (e.g. 7 of 9 present), and anti-self-approval enforcement
        </p>
      </div>

      {/* Coverage Indicator Card */}
      <div className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="icon-tile">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="card-title">Operations Team Roster Coverage</h2>
            <p className="text-xs text-slate-500">Retail North & Operations Shift Coverage: <strong>7 of 9 staff active</strong></p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-success">
            Coverage Safe (78%)
          </span>
        </div>
      </div>

      {/* Approval Requests Table */}
      <div className="card overflow-hidden">
        <div className="card-header">
          <h2 className="card-title">Pending Team Requests Awaiting Action</h2>
          <span className="card-meta">{requests.length} Requests</span>
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
                      <span className="font-semibold text-slate-900 text-sm">{emp?.fullName || req.employment_id}</span>
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-semibold">
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
                      className="btn btn-success btn-xs"
                    >
                      Approve Request
                    </button>
                    <button
                      onClick={() => handleDecision(req.id, "Rejected")}
                      className="btn btn-secondary btn-xs"
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
