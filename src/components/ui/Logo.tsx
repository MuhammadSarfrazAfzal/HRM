import React, { useId } from "react";
import { cn } from "@/lib/utils";

/** FlowHCM brand mark. Mirrors src/app/icon.svg so the favicon and in-app logo match. */
export function LogoMark({ className }: { className?: string }) {
  // Unique per instance: a hidden copy (e.g. the desktop sidebar on phones) must not own the gradient.
  const gradientId = `flowhcm-mark-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("h-8 w-8 shrink-0", className)}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3a68f6" />
          <stop offset="1" stopColor="#1c37d8" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${gradientId})`} />
      <path d="M11 23V9h10M11 16h7" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22.5" cy="21.5" r="2.25" fill="#a5c4ff" />
    </svg>
  );
}
