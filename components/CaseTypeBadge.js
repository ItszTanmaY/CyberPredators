import React from 'react';
import { Scale, Shield, FileText, HeartHandshake, Briefcase, Calculator, Layers } from 'lucide-react';

const CATEGORY_STYLES = {
  'Criminal': {
    bg: 'bg-rose-950/60',
    border: 'border-rose-600/50',
    text: 'text-rose-300',
    pill: 'bg-rose-500/20 text-rose-300',
    icon: Shield
  },
  'Civil': {
    bg: 'bg-blue-950/60',
    border: 'border-blue-600/50',
    text: 'text-blue-300',
    pill: 'bg-blue-500/20 text-blue-300',
    icon: Scale
  },
  'Constitutional/Writ': {
    bg: 'bg-purple-950/60',
    border: 'border-purple-600/50',
    text: 'text-purple-300',
    pill: 'bg-purple-500/20 text-purple-300',
    icon: FileText
  },
  'Family': {
    bg: 'bg-pink-950/60',
    border: 'border-pink-600/50',
    text: 'text-pink-300',
    pill: 'bg-pink-500/20 text-pink-300',
    icon: HeartHandshake
  },
  'Commercial': {
    bg: 'bg-emerald-950/60',
    border: 'border-emerald-600/50',
    text: 'text-emerald-300',
    pill: 'bg-emerald-500/20 text-emerald-300',
    icon: Briefcase
  },
  'Service': {
    bg: 'bg-indigo-950/60',
    border: 'border-indigo-600/50',
    text: 'text-indigo-300',
    pill: 'bg-indigo-500/20 text-indigo-300',
    icon: Briefcase
  },
  'Tax': {
    bg: 'bg-amber-950/60',
    border: 'border-amber-600/50',
    text: 'text-amber-300',
    pill: 'bg-amber-500/20 text-amber-300',
    icon: Calculator
  },
  'Other': {
    bg: 'bg-slate-900',
    border: 'border-slate-700',
    text: 'text-slate-300',
    pill: 'bg-slate-800 text-slate-300',
    icon: Layers
  }
};

export default function CaseTypeBadge({ caseType, court, caseNumber, decisionDate }) {
  const category = caseType?.category || 'Other';
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES['Other'];
  const IconComponent = style.icon;

  return (
    <div className={`p-6 rounded-2xl border ${style.bg} ${style.border} backdrop-blur shadow-xl space-y-4`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 ${style.pill}`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-bold ${style.text}`}>{category}</span>
              {caseType?.sub_type && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                  {caseType.sub_type}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {court || 'Indian Court Judgment'} {caseNumber ? `• ${caseNumber}` : ''}
            </p>
          </div>
        </div>

        {decisionDate && (
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block">Date of Judgment</span>
            <span className="text-sm font-semibold text-slate-200">{decisionDate}</span>
          </div>
        )}
      </div>

      {caseType?.reasoning && (
        <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
          <strong className="text-slate-400 font-medium">Categorization Rationale: </strong>
          {caseType.reasoning}
        </div>
      )}
    </div>
  );
}
