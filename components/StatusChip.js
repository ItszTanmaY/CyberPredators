'use client';

import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';

export default function StatusChip({ verified, page, onClick, ariaLabel }) {
  if (verified === true) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel || `Found in text on page ${page || 'unknown'}`}
        className="inline-flex items-center gap-1.5 h-[24px] px-2 rounded-chip border border-verified text-verified bg-surface text-[12px] font-medium leading-none hover:bg-page transition-colors cursor-pointer flex-shrink-0"
      >
        <Check className="w-4 h-4 text-verified" strokeWidth={1.5} />
        <span>Found in text</span>
      </button>
    );
  }

  if (verified === false) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel || 'Check source wording in original document'}
        className="inline-flex items-center gap-1.5 h-[24px] px-2 rounded-chip border border-needs-check text-needs-check bg-surface text-[12px] font-medium leading-none hover:bg-page transition-colors cursor-pointer flex-shrink-0"
      >
        <AlertTriangle className="w-4 h-4 text-needs-check" strokeWidth={1.5} />
        <span>Check source</span>
      </button>
    );
  }

  return null;
}
