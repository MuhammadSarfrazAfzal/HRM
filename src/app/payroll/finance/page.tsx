"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, CheckCircle2, AlertOctagon, Download, RefreshCw, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import { getDB } from "@/lib/storage/db";
import { BankPaymentBatch, JournalBatch } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function FinanceDisbursementPage() {
  const [db] = useState(() => getDB());
  const [bankBatches, setBankBatches] = useState<BankPaymentBatch[]>([]);
  const [journalBatches, setJournalBatches] = useState<JournalBatch[]>([]);

  const refresh = () => {
    setBankBatches(db.getBankBatches());
    setJournalBatches(db.getJournalBatches());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleReconcileItem = (batchId: string, itemId: string, state: "Settled" | "Rejected") => {
    try {
      db.reconcileBankItem(batchId, itemId, state, state === "Rejected" ? "Invalid account title match at destination bank" : undefined);
      refresh();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handlePostJournal = (batchId: string) => {
    try {
      db.postJournalBatch(batchId);
      refresh();
      alert("General Ledger double-entry balanced journal posted successfully!");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Finance Disbursement & General Ledger (GL)</h1>
        <p className="text-xs text-slate-500">
          FlowHCM Benchmark • 1LINK Bank advice adapters, payment failure retry isolation, and double-entry balanced GL posting
        </p>
      </div>

      {/* Bank Payment Batches Section */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Bank Disbursement Batches & Settlement Reconciliation
        </h2>

        {bankBatches.map((batch) => (
          <div key={batch.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{batch.reference}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    batch.state === "Reconciled" ? "bg-emerald-100 text-emerald-800" : (batch.state === "Partial_Failure" ? "bg-rose-100 text-rose-800" : "bg-blue-100 text-blue-800")
                  }`}>
                    {batch.state}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  Adapter: {batch.adapter} • File Hash: {batch.file_hash}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Batch Control Total</span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    {formatCurrency(batch.control_total)}
                  </span>
                </div>
                <button
                  onClick={() => alert(`Downloaded encrypted payment file: ${batch.reference}.txt\nControl Hash: ${batch.file_hash}`)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Bank File</span>
                </button>
              </div>
            </div>

            {/* Batch Line Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="px-4 py-2.5">Worker Code</th>
                    <th className="px-4 py-2.5">Employee Name</th>
                    <th className="px-4 py-2.5">Bank & Account</th>
                    <th className="px-4 py-2.5 text-right">Amount (PKR)</th>
                    <th className="px-4 py-2.5 text-center">Settlement Status</th>
                    <th className="px-4 py-2.5 text-right">Reconciliation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {batch.items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{item.worker_code}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{item.employee_name}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                        {item.bank_name} • {item.account_number}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.state === "Settled" ? "bg-emerald-100 text-emerald-800" : (item.state === "Rejected" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800")
                        }`}>
                          {item.state}
                        </span>
                        {item.failure_reason && (
                          <div className="text-[10px] text-rose-600 italic">{item.failure_reason}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right space-x-1.5">
                        {item.state !== "Settled" && (
                          <button
                            onClick={() => handleReconcileItem(batch.id, item.id, "Settled")}
                            className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                          >
                            Mark Settled
                          </button>
                        )}
                        {item.state !== "Rejected" && (
                          <button
                            onClick={() => handleReconcileItem(batch.id, item.id, "Rejected")}
                            className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px]"
                          >
                            Simulate Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Balanced GL Double-Entry Journal Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Balanced Double-Entry General Ledger (GL) Postings
        </h2>

        {journalBatches.map((jb) => (
          <div key={jb.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{jb.posting_reference}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    jb.state === "Posted" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
                  }`}>
                    {jb.state}
                  </span>
                  {jb.is_balanced && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      ✓ Debits Equal Credits
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">Posting Date: {formatDate(jb.posting_date)}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Balanced Journal</span>
                  <span className="text-base font-bold text-slate-900 font-mono">
                    {formatCurrency(jb.total_debit)}
                  </span>
                </div>
                {jb.state === "Draft" ? (
                  <button
                    onClick={() => handlePostJournal(jb.id)}
                    className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition shadow-sm"
                  >
                    Post Journal Entry
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Posted to GL
                  </span>
                )}
              </div>
            </div>

            {/* Journal Lines Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="px-4 py-2.5">Account Code</th>
                    <th className="px-4 py-2.5">Account Description</th>
                    <th className="px-4 py-2.5">Cost Center</th>
                    <th className="px-4 py-2.5 text-right">Debit (PKR)</th>
                    <th className="px-4 py-2.5 text-right">Credit (PKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                  {jb.lines.map((line) => (
                    <tr key={line.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-2.5 font-bold text-slate-900">{line.account_code}</td>
                      <td className="px-4 py-2.5 font-sans font-medium text-slate-800">{line.account_name}</td>
                      <td className="px-4 py-2.5 text-slate-500">{line.cost_center}</td>
                      <td className="px-4 py-2.5 text-right font-bold text-slate-900">
                        {line.debit > 0 ? formatCurrency(line.debit) : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-slate-900">
                        {line.credit > 0 ? formatCurrency(line.credit) : "—"}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold border-t border-slate-200">
                    <td colSpan={3} className="px-4 py-3 font-sans text-right">
                      Total Balanced Sum:
                    </td>
                    <td className="px-4 py-3 text-right text-slate-900">{formatCurrency(jb.total_debit)}</td>
                    <td className="px-4 py-3 text-right text-slate-900">{formatCurrency(jb.total_credit)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
