import React from 'react';
import { BookOpen, ExternalLink, ArrowRightLeft } from 'lucide-react';
import VerificationChip from './VerificationChip';

export default function StatuteList({ statutes = [], onInspectSource }) {
  if (!statutes || statutes.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-500 text-sm italic">
        No specific statutory sections extracted from provided pages.
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-semibold text-white">Laws &amp; Statutory Provisions Debated</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {statutes.length} {statutes.length === 1 ? 'Act' : 'Acts'} Cited
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statutes.map((st, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/80 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-bold text-slate-100">{st.act}</span>
                <VerificationChip 
                  verified={st.verified} 
                  page={st.page}
                  onClick={() => onInspectSource?.({ 
                    phrase: st.evidence || `${st.act} ${st.sections?.join(' ')}`, 
                    page: st.page,
                    title: `Statute: ${st.act}` 
                  })}
                />
              </div>

              {/* Sections Badges */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(st.sections || []).map((sec, sIdx) => (
                  <span key={sIdx} className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
                    Section {sec}
                  </span>
                ))}
              </div>

              {/* IPC / CrPC to BNS / BNSS Mapping Note */}
              {st.sectionMappings && st.sectionMappings.some(m => m.newCodeNote) && (
                <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-700/40 text-xs text-emerald-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>New Criminal Code Equivalent (July 2024+):</span>
                  </div>
                  {st.sectionMappings.filter(m => m.newCodeNote).map((m, mIdx) => (
                    <p key={mIdx} className="text-[11px] text-emerald-200/90 pl-5">
                      &bull; {m.newCodeNote}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {st.evidence && (
              <button
                type="button"
                onClick={() => onInspectSource?.({ phrase: st.evidence, page: st.page, title: `Statute Citation: ${st.act}` })}
                className="text-[11px] text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 text-left italic border-t border-slate-700/40 pt-2"
              >
                <ExternalLink className="w-3 h-3 flex-shrink-0 text-slate-500" />
                <span className="truncate">&ldquo;{st.evidence}&rdquo;</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
