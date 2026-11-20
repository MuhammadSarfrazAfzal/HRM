"use client";

import React, { useState } from "react";
import { Cpu, CheckCircle2, RefreshCw, AlertTriangle, Play, Database, ShieldCheck } from "lucide-react";
import { getDB } from "@/lib/storage/db";

export default function DeviceIngestionPage() {
  const [db] = useState(() => getDB());
  const [ingestionLogs, setIngestionLogs] = useState<any[]>([
    { id: "LOG_01", timestamp: "2026-11-20T08:58:12Z", deviceId: "BIO_KHI_01", workerCode: "E00412", eventType: "IN", status: "Normalized", duplicateDetected: false },
    { id: "LOG_02", timestamp: "2026-11-20T09:01:45Z", deviceId: "BIO_KHI_02", workerCode: "E00420", eventType: "IN", status: "Normalized", duplicateDetected: false },
    { id: "LOG_03", timestamp: "2026-11-20T09:01:50Z", deviceId: "BIO_KHI_02", workerCode: "E00420", eventType: "IN", status: "Discarded", duplicateDetected: true },
  ]);

  const handleSimulateSync = () => {
    const newLog = {
      id: `LOG_${Date.now()}`,
      timestamp: new Date().toISOString(),
      deviceId: "BIO_KHI_01",
      workerCode: "E00412",
      eventType: "OUT",
      status: "Normalized",
      duplicateDetected: false,
    };
    setIngestionLogs([newLog, ...ingestionLogs]);
    alert("Simulated device sync: Received 1 raw punch event from ZKTeco Biometric Terminal BIO_KHI_01.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Biometric Device Punch Ingestion</h1>
          <p className="text-xs text-slate-500">
            FlowHCM Benchmark • Raw device event capture, connector provenance, duplicate rejection & normalization
          </p>
        </div>
        <button
          onClick={handleSimulateSync}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>Poll Biometric Terminals</span>
        </button>
      </div>

      {/* Terminal Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">Karachi Main Gate Terminal</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Online</span>
          </div>
          <p className="text-slate-500 font-mono text-[11px]">ID: BIO_KHI_01 (ZKTeco ProCapture)</p>
          <div className="text-[11px] text-slate-400">Last Synced: Just now • Device Freshness: 100%</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">Floor 4 IT Wing Terminal</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Online</span>
          </div>
          <p className="text-slate-500 font-mono text-[11px]">ID: BIO_KHI_02 (Anviz FacePass)</p>
          <div className="text-[11px] text-slate-400">Last Synced: 2 mins ago • Device Freshness: 99%</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">Mobile GPS Channel</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">Active</span>
          </div>
          <p className="text-slate-500 font-mono text-[11px]">Geofence Radius: 250m Clifton Site</p>
          <div className="text-[11px] text-slate-400">GPS Tolerance: ±15m fallback handling</div>
        </div>
      </div>

      {/* Raw Event Provenance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Raw Device Event Ingestion & Replay Stream</h2>
          <span className="text-xs text-slate-500 font-mono">Stream size: {ingestionLogs.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="px-5 py-3">Event ID</th>
                <th className="px-5 py-3">Timestamp (UTC)</th>
                <th className="px-5 py-3">Terminal ID</th>
                <th className="px-5 py-3">Worker Code</th>
                <th className="px-5 py-3">Event Type</th>
                <th className="px-5 py-3">Normalization Status</th>
                <th className="px-5 py-3">Deduplication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {ingestionLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition font-mono">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{log.id}</td>
                  <td className="px-5 py-3.5">{log.timestamp}</td>
                  <td className="px-5 py-3.5 text-slate-600">{log.deviceId}</td>
                  <td className="px-5 py-3.5 font-bold text-brand-600">{log.workerCode}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded font-sans font-bold text-[10px] bg-slate-100 text-slate-800">
                      {log.eventType}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-sans">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.status === "Normalized" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-sans">
                    {log.duplicateDetected ? (
                      <span className="text-rose-600 font-bold text-[10px]">⚠ Rejected Duplicate</span>
                    ) : (
                      <span className="text-emerald-600 font-medium text-[10px]">✓ Unique Key</span>
                    )}
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
