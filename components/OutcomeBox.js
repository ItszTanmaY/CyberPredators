import React from 'react';
import { Gavel, CheckCircle2, XCircle, AlertCircle, FileSearch } from 'lucide-react';
import VerificationChip from './VerificationChip';

const OUTCOME_STYLES = {
  'Allowed': { bg: 'bg-emerald-950/60', border: 'border-emerald-600/60', text: 'text-emerald-300', icon: CheckCircle2 },
  'Bail granted': { bg: 'bg-emerald-950/60', border: 'border-emerald-600/60', text: 'text-emerald-300', icon: CheckCircle2 },
  'Acquitted': { bg: 'bg-emerald-950/60', border: 'border-emerald-600/60', text: 'text-emerald-300', icon: CheckCircle2 },
  'Dismissed': { bg: 'bg-rose-950/60', border: 'border-rose-600/60', text: 'text-rose-300', icon: XCircle },
  'Bail rejected': { bg: 'bg-rose-950/60', border: 'border-rose-600/60', text: 'text-rose-300', icon: XCircle },
  'Convicted': { bg: 'bg-rose-950/60', border: 'border-rose-600/60', text: 'text-rose-300', icon: XCircle },
  'Partly allowed': { bg: 'bg-amber-950/60', border: 'border-amber-600/60', text: 'text-amber-300', icon: AlertCircle },
  'Remanded': { bg: 'bg-amber-950/60', border: 'border-amber-600/60', text: 'text-amber-300', icon: AlertCircle },
  'Disposed of': { bg: 'bg-blue-950/60', border: 'border-blue-600/60', text: 'text-blue-300', icon: Gavel },
  'Other': { bg: 'bg-slate-900', border: 'border-slate-700', text: 'text-slate-300', icon: Gavel }
};

export default function OutcomeBox({ outcome, onInspectSource }) {
  if (!outcome) return null;

  const style = OUTCOME_STYLES[outcome.result] || OUTCOME_STYLES['Other'];
  const Icon = style.icon;

  return (
    <div className={`p-6 rounded-2xl border ${style.bg} ${style.border} backdrop-blur space-y-4 shadow-xl`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-center text-amber-400">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Final Operative Court Order</span>
            <h3 className={`text-2xl font-black ${style.text}`}>{outcome.result}</h3>
          </div>
        </div>

        <VerificationChip 
          verified={outcome.verified} 
          page={outcome.page}
          onClick={() => onInspectSource?.({ 
            phrase: outcome.evidence || outcome.detail, 
            page: outcome.page,
            title: `Final Operative Order: ${outcome.result}` 
          })}
        />
      </div>

      {outcome.detail && (
        <p className="text-slate-200 text-sm sm:text-base leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          {outcome.detail}
        </p>
      )}

      {outcome.evidence && (
        <div className="flex items-center justify-between gap-2 pt-1 text-xs text-slate-400">
          <div className="truncate italic">
            &ldquo;{outcome.evidence}&rdquo;
          </div>
          <button
            type="button"
            onClick={() => onInspectSource?.({ phrase: outcome.evidence, page: outcome.page, title: 'Operative Order Evidence' })}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors cursor-pointer text-xs font-medium"
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>View in Judgment {outcome.page ? `(p. ${outcome.page})` : ''}</span>
          </button>
        </div>
      )}
    </div>
  );
}
