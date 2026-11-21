"use client";

import React, { useState } from "react";
import { Building2, MapPin, RefreshCw, Database, Menu, UserCircle2 } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/storage/supabaseClient";
import { LogoMark } from "@/components/ui/Logo";

interface HeaderProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  onResetDB?: () => void;
  onOpenNav?: () => void;
}

export function Header({ currentRole, onRoleChange, onResetDB, onOpenNav }: HeaderProps) {
  const [hasSupabase] = useState(isSupabaseConfigured());

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur no-print sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        {onOpenNav && (
          <button
            onClick={onOpenNav}
            className="btn-icon -ml-1.5 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <LogoMark className="h-7 w-7 lg:hidden" />

        {/* Entity & Site Badge */}
        <div className="hidden min-w-0 items-center gap-2 text-[13px] md:flex">
          <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="truncate font-semibold text-slate-900">Star Solutions PK</span>
          <span className="text-slate-300">/</span>
          <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="truncate text-slate-600">Karachi Head Office (Sindh)</span>
        </div>

        {/* Database Mode Badge */}
        <div className="badge badge-success hidden xl:inline-flex">
          <Database />
          <span>Local Storage DB active</span>
          {hasSupabase && <span className="ml-1 rounded bg-emerald-600 px-1 text-[10px] text-white">Supabase Linked</span>}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {/* Role Switcher */}
        <label htmlFor="role-switcher" className="hidden text-[13px] text-slate-500 md:inline">
          Simulate role
        </label>
        <div className="relative">
          <UserCircle2 className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            id="role-switcher"
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="select input-sm w-[150px] pl-8 font-medium sm:w-auto"
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
            aria-label="Reset seed data"
            className="btn btn-secondary btn-sm px-2.5 sm:px-3"
          >
            <RefreshCw className="text-slate-500" />
            <span className="hidden sm:inline">Reset Seed Data</span>
          </button>
        )}
      </div>
    </header>
  );
}
