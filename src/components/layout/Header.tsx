"use client";

import React, { useState } from "react";
import { Building2, MapPin, UserCheck, ShieldCheck, RefreshCw, Database } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/storage/supabaseClient";

interface HeaderProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  onResetDB?: () => void;
}

export function Header({ currentRole, onRoleChange, onResetDB }: HeaderProps) {
  const [hasSupabase] = useState(isSupabaseConfigured());

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-30 px-6 flex items-center justify-between no-print">
      <div className="flex items-center gap-4">
        {/* Entity & Site Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200/80 text-xs font-medium text-slate-700">
          <Building2 className="w-3.5 h-3.5 text-brand-600" />
          <span className="font-semibold text-slate-900">Star Solutions PK</span>
          <span className="text-slate-300">|</span>
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-600">Karachi Head Office (Sindh)</span>
        </div>

        {/* Database Mode Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Database className="w-3 h-3 text-emerald-600" />
          <span>Local Storage DB active</span>
          {hasSupabase && <span className="bg-emerald-600 text-white text-[10px] px-1 rounded ml-1">Supabase Linked</span>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Role Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-500 hidden md:inline">Simulate Role:</label>
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="HR Administrator">HR Administrator</option>
            <option value="Payroll Operator">Payroll Operator (Maker)</option>
            <option value="Finance Director">Finance Approver (Checker)</option>
            <option value="Line Manager">Line Manager</option>
            <option value="Sam Rivera (Employee)">Employee (Sam Rivera)</option>
          </select>
        </div>

        {/* Quick Reset Database */}
        {onResetDB && (
          <button
            onClick={onResetDB}
            title="Reset to Benchmark Test Data"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-medium text-slate-600 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset Seed Data</span>
          </button>
        )}
      </div>
    </header>
  );
}

