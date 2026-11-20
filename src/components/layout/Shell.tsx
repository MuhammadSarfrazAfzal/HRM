"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { getDB } from "@/lib/storage/db";

export function Shell({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState("HR Administrator");

  const handleResetDB = () => {
    if (confirm("Reset local storage database to official FlowHCM benchmark seed data?")) {
      getDB().resetToDefault();
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentRole={role}
          onRoleChange={setRole}
          onResetDB={handleResetDB}
        />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
