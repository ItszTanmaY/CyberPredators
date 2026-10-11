import React, { useState } from 'react';
import { BookOpen, Languages, Calendar, Sparkles } from 'lucide-react';

export default function ExecutiveSummary({ summary, summaryHi, keyDates = [] }) {
  const [showHindi, setShowHindi] = useState(false);

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-semibold text-white">Plain-Language Executive Summary</h3>
          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            For Litigants &amp; Citizens
          </span>
        </div>

        {summaryHi && (
          <button
            type="button"
            onClick={() => setShowHindi(!showHindi)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              showHindi
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{showHindi ? 'Show English' : 'हिंदी में देखें (Hindi)'}</span>
          </button>
        )}
      </div>

      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80 text-sm leading-relaxed text-slate-200 font-normal">
        {showHindi ? (
          <p className="font-hindi text-amber-100/90 leading-loose">
            {summaryHi || 'हिंदी अनुवाद उपलब्ध नहीं है।'}
          </p>
        ) : (
          <p>{summary || 'No summary generated.'}</p>
        )}
      </div>

      {/* Key Dates Timeline */}
      {keyDates && keyDates.length > 0 && (
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>Case Procedural Timeline</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {keyDates.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30 border border-slate-700/50 text-xs">
                <span className="font-mono text-amber-400 font-semibold">{item.date}</span>
                <span className="text-slate-300 truncate">{item.event}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
