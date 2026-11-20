"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Clock,
  CalendarCheck,
  Calculator,
  Building2,
  FileText,
  CreditCard,
  UserPlus,
  UserMinus,
  Settings,
  ShieldAlert,
  Smartphone,
  HardHat,
  Briefcase,
  Layers,
  Award,
  DollarSign,
  HelpCircle,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavGroup {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    title: "CORE HR",
    items: [
      { label: "Dashboard", href: "/", icon: Building2 },
      { label: "People Directory", href: "/people", icon: Users },
      { label: "Onboarding Cases", href: "/people/onboarding", icon: UserPlus },
      { label: "Separation & F&F", href: "/people/separation", icon: UserMinus },
    ],
  },
  {
    title: "WORKFORCE & TIME",
    items: [
      { label: "Attendance & Shifts", href: "/workforce", icon: Clock },
      { label: "Leave Ledger & Requests", href: "/workforce/leave", icon: CalendarCheck },
      { label: "Device Punch Ingestion", href: "/workforce/devices", icon: Cpu },
    ],
  },
  {
    title: "PAYROLL & FINANCE",
    items: [
      { label: "Payroll Workbench", href: "/payroll", icon: Calculator, badge: "P0" },
      { label: "Pay Rules & Formulas", href: "/payroll/setup", icon: Settings },
      { label: "Pakistan Statutory", href: "/payroll/compliance", icon: ShieldAlert, badge: "FBR" },
      { label: "Banking & GL Postings", href: "/payroll/finance", icon: CreditCard },
    ],
  },
  {
    title: "SELF SERVICE (ESS/MSS)",
    items: [
      { label: "Employee Portal", href: "/self-service", icon: Smartphone },
      { label: "Manager Team Inbox", href: "/self-service/manager", icon: HardHat },
    ],
  },
  {
    title: "EXPANDED HCM",
    items: [
      { label: "Recruitment (ATS)", href: "/modules/recruitment", icon: Briefcase },
      { label: "Performance & Review", href: "/modules/performance", icon: Award },
      { label: "Expense & Travel Claims", href: "/modules/expenses", icon: DollarSign },
      { label: "Asset Inventory", href: "/modules/assets", icon: Layers },
      { label: "HR Letters & Forms", href: "/modules/letters", icon: FileText },
      { label: "Internal Help Desk", href: "/modules/helpdesk", icon: HelpCircle },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Settings & Supabase Sync", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-200 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 h-screen sticky top-0 no-print select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800 bg-slate-950/40">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white font-black text-lg">
          H
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-tight">FlowHCM Enterprise</h1>
          <p className="text-[11px] font-medium text-slate-400">Payroll & HR Benchmark</p>
        </div>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1.5">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition group",
                      isActive
                        ? "bg-brand-600 text-white shadow-sm shadow-brand-600/30"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          "w-4 h-4 transition",
                          isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          "text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-800 text-slate-300"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Benchmark Version */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between bg-slate-950/20">
        <div>
          <span className="font-semibold text-slate-300">Spec v1.0</span> (Nov 2026)
        </div>
        <span className="text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Ready
        </span>
      </div>
    </aside>
  );
}
