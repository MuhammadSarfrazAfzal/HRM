"use client";

import React, { useState } from "react";
import { HelpCircle, Plus, CheckCircle2, AlertCircle, MessageSquare, X } from "lucide-react";
import { getDB } from "@/lib/storage/db";
import { formatDate } from "@/lib/utils";

export default function HelpDeskPage() {
  const [db] = useState(() => getDB());
  const [tickets, setTickets] = useState(() => db.getTickets());
  const [showNewModal, setShowNewModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<any>("Payroll Inquiry");
  const [description, setDescription] = useState("");

  const refresh = () => {
    setTickets(db.getTickets());
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    db.addTicket({
      employment_id: "emp_001",
      employee_name: "Sam Rivera",
      category,
      subject,
      description,
      priority: "Medium",
      status: "Open",
    });
    setShowNewModal(false);
    setSubject("");
    setDescription("");
    refresh();
    alert("Ticket created and routed to assigned support queue.");
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Internal Employee Help Desk</h1>
          <p className="page-subtitle">
            FlowHCM Benchmark • Scoped HR, IT, and Payroll service queues, response tracking, and SLA resolution deadlines
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="card-header">
          <h2 className="card-title">Support Tickets Queue</h2>
          <span className="card-meta">{tickets.length} Tickets</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="px-5 py-3">Ticket ID</th>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Subject & Description</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td className="px-5 py-3.5 font-mono font-semibold text-slate-900">{t.id}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{t.employee_name}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded font-medium text-[11px] bg-slate-100 text-slate-700">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-900 block">{t.subject}</span>
                    <p className="text-[11px] text-slate-500 truncate max-w-xs">{t.description}</p>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-amber-700">{t.priority}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      t.status === "Resolved" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                    }`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNewModal && (
        <div className="modal-backdrop">
          <div className="modal-panel max-w-md">
            <div className="modal-header">
              <h2 className="modal-title">
                <HelpCircle className="w-4 h-4 text-brand-600" /> Create Support Ticket
              </h2>
              <button onClick={() => setShowNewModal(false)} className="modal-close" aria-label="Close"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateTicket} className="modal-body">
              <div>
                <label className="label">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="select"
                >
                  <option value="Payroll Inquiry">Payroll Inquiry</option>
                  <option value="IT Support">IT Support</option>
                  <option value="HR Policy">HR Policy</option>
                  <option value="Medical Insurance">Medical Insurance</option>
                </select>
              </div>

              <div>
                <label className="label">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="input"
                  placeholder="Summary of request..."
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="textarea"
                  placeholder="Provide details..."
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
