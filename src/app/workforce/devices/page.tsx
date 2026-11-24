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
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Biometric Device Punch Ingestion</h1>
          <p className="page-subtitle">
            FlowHCM Benchmark • Raw device event capture, connector provenance, duplicate rejection & normalization
          </p>
        </div>
        <button
          onClick={handleSimulateSync}
          className="btn btn-dark"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>Poll Biometric Terminals</span>
        </button>
      </div>

      {/* Terminal Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 space-y-2 text-[13px]">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900">Karachi Main Gate Terminal</span>
            <span className="badge badge-success">Online</span>
          </div>
          <p className="text-slate-500 font-mono text-[11px]">ID: BIO_KHI_01 (ZKTeco ProCapture)</p>
          <div className="text-[11px] text-slate-400">Last Synced: Just now • Device Freshness: 100%</div>
        </div>

        <div className="card p-4 space-y-2 text-[13px]">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900">Floor 4 IT Wing Terminal</span>
            <span className="badge badge-success">Online</span>
          </div>
          <p className="text-slate-500 font-mono text-[11px]">ID: BIO_KHI_02 (Anviz FacePass)</p>
          <div className="text-[11px] text-slate-400">Last Synced: 2 mins ago • Device Freshness: 99%</div>
        </div>

        <div className="card p-4 space-y-2 text-[13px]">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900">Mobile GPS Channel</span>
            <span className="badge badge-info">Active</span>
          </div>
          <p className="text-slate-500 font-mono text-[11px]">Geofence Radius: 250m Clifton Site</p>
          <div className="text-[11px] text-slate-400">GPS Tolerance: ±15m fallback handling</div>
        </div>
      </div>

      {/* Raw Event Provenance Table */}
      <div className="card overflow-hidden">
        <div className="card-header">
          <h2 className="card-title">Raw Device Event Ingestion & Replay Stream</h2>
          <span className="card-meta">Stream size: {ingestionLogs.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
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
            <tbody>
              {ingestionLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition font-mono">
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{log.id}</td>
                  <td className="px-5 py-3.5">{log.timestamp}</td>
                  <td className="px-5 py-3.5 text-slate-600">{log.deviceId}</td>
                  <td className="px-5 py-3.5 font-semibold text-brand-600">{log.workerCode}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded font-sans font-semibold text-[11px] bg-slate-100 text-slate-800">
                      {log.eventType}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-sans">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      log.status === "Normalized" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-sans">
                    {log.duplicateDetected ? (
                      <span className="text-rose-600 font-semibold text-[11px]">⚠ Rejected Duplicate</span>
                    ) : (
                      <span className="text-emerald-600 font-medium text-[11px]">✓ Unique Key</span>
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
