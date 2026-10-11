'use client';

import React from 'react';
import { ShieldCheck, EyeOff, Lock, Check } from 'lucide-react';

export default function PrivacyMaskingBanner({
  counts = { aadhaar: 0, phone: 0, pan: 0, email: 0, sensitive: 0 },
  maskMinorsVictims = false,
  onToggleMinorsVictims,
  totalMasked = 0,
}) {
  return (
    <div className="bg-surface border border-border rounded-surface p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-verified/10 text-verified flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-verified" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-text flex items-center gap-2">
              <span>Client-Side Privacy Guard</span>
              <span className="text-[11px] text-verified font-medium px-2 py-0.5 rounded-full border border-verified/30 bg-page">
                Active in Browser
              </span>
            </div>
            <p className="text-[12px] text-muted">
              PIDs and personal identifiers are masked locally before transmission to AI.
            </p>
          </div>
        </div>

        {/* Optional Toggle for Minors & Victims (Section 228A IPC / POCSO) */}
        <label className="inline-flex items-center gap-2 text-[12px] font-medium text-text cursor-pointer select-none bg-page px-3 py-1.5 rounded-control border border-border hover:border-action transition-colors">
          <input
            type="checkbox"
            checked={maskMinorsVictims}
            onChange={(e) => onToggleMinorsVictims?.(e.target.checked)}
            className="w-4 h-4 rounded border-border text-action focus:ring-action"
          />
          <span>Mask names of minors &amp; victims (POCSO / S. 228A)</span>
        </label>
      </div>

      {/* Hidden before analysis counts badge display */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/60 text-[12px]">
        <span className="font-semibold text-muted text-[11px] uppercase tracking-wider">
          Hidden before analysis:
        </span>

        {totalMasked === 0 ? (
          <span className="text-muted text-[12px] italic">
            None detected in sample excerpt (Clean document)
          </span>
        ) : (
          <>
            {counts.aadhaar > 0 && (
              <span className="px-2 py-0.5 rounded bg-page border border-border text-text font-medium">
                Aadhaar: <span className="font-bold text-action">{counts.aadhaar}</span>
              </span>
            )}
            {counts.phone > 0 && (
              <span className="px-2 py-0.5 rounded bg-page border border-border text-text font-medium">
                Phone: <span className="font-bold text-action">{counts.phone}</span>
              </span>
            )}
            {counts.pan > 0 && (
              <span className="px-2 py-0.5 rounded bg-page border border-border text-text font-medium">
                PAN: <span className="font-bold text-action">{counts.pan}</span>
              </span>
            )}
            {counts.email > 0 && (
              <span className="px-2 py-0.5 rounded bg-page border border-border text-text font-medium">
                Email: <span className="font-bold text-action">{counts.email}</span>
              </span>
            )}
            {counts.sensitive > 0 && (
              <span className="px-2 py-0.5 rounded bg-page border border-border text-text font-medium">
                Protected Persons: <span className="font-bold text-action">{counts.sensitive}</span>
              </span>
            )}
            <span className="text-muted text-[11px] ml-auto">
              Total {totalMasked} identifier{totalMasked > 1 ? 's' : ''} sanitized
            </span>
          </>
        )}
      </div>
    </div>
  );
}
