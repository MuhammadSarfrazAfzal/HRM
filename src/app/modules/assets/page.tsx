"use client";

import React, { useState } from "react";
import { Layers, Laptop, Monitor, CheckCircle2 } from "lucide-react";
import { getDB } from "@/lib/storage/db";
import { formatDate } from "@/lib/utils";

export default function AssetsPage() {
  const [db] = useState(() => getDB());
  const assets = db.getAssets();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Employee Assets & Custody Tracking</h1>
        <p className="text-xs text-slate-500">
          FlowHCM Benchmark • Hardware & asset inventory, tag assignment, condition records, and offboarding clearance checks
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Assigned Corporate Assets</h2>
          <span className="text-xs font-mono text-slate-500 font-bold">{assets.length} Assets Logged</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="px-5 py-3">Tag Code</th>
                <th className="px-5 py-3">Asset Description</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Assigned Custodian</th>
                <th className="px-5 py-3">Issue Date</th>
                <th className="px-5 py-3">Condition</th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {assets.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900">{a.asset_tag}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">{a.name}</td>
                  <td className="px-5 py-3.5 text-slate-600">{a.category}</td>
                  <td className="px-5 py-3.5 font-semibold text-brand-600">{a.custodian_name}</td>
                  <td className="px-5 py-3.5 font-medium">{formatDate(a.issued_date)}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-100 text-slate-700">
                      {a.condition}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
