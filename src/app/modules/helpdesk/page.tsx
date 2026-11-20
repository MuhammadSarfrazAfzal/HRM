"use client";

import React, { useState } from "react";
import { HelpCircle, Plus, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";
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
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Internal Employee Help Desk</h1>
          <p className="text-xs text-slate-500">
            FlowHCM Benchmark • Scoped HR, IT, and Payroll service queues, response tracking, and SLA resolution deadlines
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Support Tickets Queue</h2>
          <span className="text-xs font-mono text-slate-500 font-bold">{tickets.length} Tickets</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="px-5 py-3">Ticket ID</th>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Subject & Description</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900">{t.id}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">{t.employee_name}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded font-medium text-[10px] bg-slate-100 text-slate-700">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-slate-900 block">{t.subject}</span>
                    <p className="text-[11px] text-slate-500 truncate max-w-xs">{t.description}</p>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-amber-700">{t.priority}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-400" /> Create Support Ticket
              </h2>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateTicket} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Payroll Inquiry">Payroll Inquiry</option>
                  <option value="IT Support">IT Support</option>
                  <option value="HR Policy">HR Policy</option>
                  <option value="Medical Insurance">Medical Insurance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  placeholder="Summary of request..."
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  placeholder="Provide details..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold"
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
