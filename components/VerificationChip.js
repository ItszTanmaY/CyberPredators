import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

export default function VerificationChip({ verified, page, onClick }) {
  if (verified === true) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-600/50 hover:bg-emerald-900 transition-colors cursor-pointer"
        title="Verified in source text"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Verified{page ? ` (p. ${page})` : ''}</span>
      </button>
    );
  }

  if (verified === false) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/70 text-amber-300 border border-amber-600/60 hover:bg-amber-900 transition-colors cursor-pointer"
        title="Exact phrase not verified in sent text - please inspect original document"
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        <span>Check Source</span>
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs text-slate-400 bg-slate-800 border border-slate-700">
      <HelpCircle className="w-3 h-3 text-slate-500" />
      <span>Unchecked</span>
    </span>
  );
}
