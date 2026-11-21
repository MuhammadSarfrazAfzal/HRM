"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { getDB } from "@/lib/storage/db";

export function Shell({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState("HR Administrator");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileNavOpen]);

  const handleResetDB = () => {
    if (confirm("Reset local storage database to official FlowHCM benchmark seed data?")) {
      getDB().resetToDefault();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile navigation drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-fade-in"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative flex h-full w-72 max-w-[85vw] animate-slide-in-left shadow-overlay">
            <Sidebar className="w-full" onNavigate={() => setMobileNavOpen(false)} />
            <button
              onClick={() => setMobileNavOpen(false)}
              className="absolute right-3 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex min-h-screen min-w-0 flex-col lg:pl-64">
        <Header
          currentRole={role}
          onRoleChange={setRole}
          onResetDB={handleResetDB}
          onOpenNav={() => setMobileNavOpen(true)}
        />
        <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
