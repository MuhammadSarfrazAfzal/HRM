"use client";

import React, { useState } from "react";
import { Layers, Laptop, Monitor, CheckCircle2 } from "lucide-react";
import { getDB } from "@/lib/storage/db";
import { formatDate } from "@/lib/utils";

export default function AssetsPage() {
  const [db] = useState(() => getDB());
  const assets = db.getAssets();

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Employee Assets & Custody Tracking</h1>
        <p className="page-subtitle">
          FlowHCM Benchmark • Hardware & asset inventory, tag assignment, condition records, and offboarding clearance checks
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="card-header">
          <h2 className="card-title">Assigned Corporate Assets</h2>
          <span className="card-meta">{assets.length} Assets Logged</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
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
            <tbody>
              {assets.map((a) => (
                <tr key={a.id}>
                  <td className="px-5 py-3.5 font-mono font-semibold text-slate-900">{a.asset_tag}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{a.name}</td>
                  <td className="px-5 py-3.5 text-slate-600">{a.category}</td>
                  <td className="px-5 py-3.5 font-semibold text-brand-600">{a.custodian_name}</td>
                  <td className="px-5 py-3.5 font-medium">{formatDate(a.issued_date)}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-slate-100 text-slate-700">
                      {a.condition}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="badge badge-success">
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
