import React from 'react';
import { User, Users, Gavel } from 'lucide-react';
import VerificationChip from './VerificationChip';

export default function PartyCards({ parties, verifiedParties, onInspectSource }) {
  const petitioners = verifiedParties?.petitioner || (parties?.petitioner || []).map(p => ({ name: p, verified: null }));
  const respondents = verifiedParties?.respondent || (parties?.respondent || []).map(r => ({ name: r, verified: null }));
  const judges = verifiedParties?.judges || (parties?.judges || []).map(j => ({ name: j, verified: null }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Petitioner Card */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm">
          <User className="w-4 h-4" />
          <span>Petitioner / Appellant</span>
        </div>
        <div className="space-y-2">
          {petitioners.length > 0 ? (
            petitioners.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-800/50 border border-slate-700/60 text-xs">
                <span className="font-medium text-slate-200 truncate">{p.name}</span>
                <VerificationChip 
                  verified={p.verified} 
                  onClick={() => onInspectSource?.({ phrase: p.name, title: `Petitioner: ${p.name}` })}
                />
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">Not specified in excerpt</p>
          )}
        </div>
      </div>

      {/* Respondent Card */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2.5 text-blue-400 font-semibold text-sm">
          <Users className="w-4 h-4" />
          <span>Respondent / Opposite Party</span>
        </div>
        <div className="space-y-2">
          {respondents.length > 0 ? (
            respondents.map((r, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-800/50 border border-slate-700/60 text-xs">
                <span className="font-medium text-slate-200 truncate">{r.name}</span>
                <VerificationChip 
                  verified={r.verified} 
                  onClick={() => onInspectSource?.({ phrase: r.name, title: `Respondent: ${r.name}` })}
                />
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">Not specified in excerpt</p>
          )}
        </div>
      </div>

      {/* Judges Card */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2.5 text-purple-400 font-semibold text-sm">
          <Gavel className="w-4 h-4" />
          <span>Coram / Hon'ble Bench</span>
        </div>
        <div className="space-y-2">
          {judges.length > 0 ? (
            judges.map((j, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-800/50 border border-slate-700/60 text-xs">
                <span className="font-medium text-slate-200 truncate">{j.name}</span>
                <VerificationChip 
                  verified={j.verified} 
                  onClick={() => onInspectSource?.({ phrase: j.name, title: `Judge: ${j.name}` })}
                />
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">Coram details not found</p>
          )}
        </div>
      </div>
    </div>
  );
}
