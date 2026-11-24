import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/layout/Shell";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FlowHCM Enterprise HRM & Payroll Platform",
  description: "Next.js HRM & Deterministic Payroll Platform based on FlowHCM capability benchmark",
};

export const viewport: Viewport = {
  themeColor: "#2449eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-slate-50 text-slate-900">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
