import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/layout/Shell";

export const metadata: Metadata = {
  title: "FlowHCM Enterprise HRM & Payroll Platform",
  description: "Next.js HRM & Deterministic Payroll Platform based on FlowHCM capability benchmark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
