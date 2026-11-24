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
import { LogoMark } from "@/components/ui/Logo";

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

interface SidebarProps {
  /** Called after a nav link is chosen; the mobile drawer uses it to close itself. */
  onNavigate?: () => void;
  className?: string;
}

export function Sidebar({ onNavigate, className }: SidebarProps) {
  const pathname = usePathname();
  // Highlight only the most specific match so /people/onboarding doesn't also light up /people.
  const activeHref = navGroups
    .flatMap((group) => group.items.map((item) => item.href))
    .filter((href) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-slate-200 bg-white no-print select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 px-5">
        <LogoMark className="h-8 w-8" />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900">FlowHCM Enterprise</div>
          <p className="truncate text-xs text-slate-500">Payroll & HR Benchmark</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav aria-label="Primary" className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navGroups.map((group) => (
          <div key={group.title}>
            <div className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = item.href === activeHref;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    {isActive && (
                      <span aria-hidden="true" className="absolute inset-y-1.5 -left-3 w-1 rounded-r-full bg-brand-600" />
                    )}
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isActive ? "text-brand-600" : "text-slate-400 group-hover:text-slate-600"
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          isActive
                            ? "bg-brand-100 text-brand-700"
                            : "bg-slate-100 text-slate-500"
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
      </nav>

      {/* Footer Benchmark Version */}
      <div className="shrink-0 border-t border-slate-200 p-3">
        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">Spec v1.0</span> (Nov 2026)
          </div>
          <span className="flex items-center gap-1.5 font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Ready
          </span>
        </div>
      </div>
    </aside>
  );
}
