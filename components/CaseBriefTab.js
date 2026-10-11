'use client';

import React from 'react';
import { BookOpen, FileText, Download, CheckCircle2, ExternalLink } from 'lucide-react';

/**
 * Downloads a structured Case Brief as a formatted markdown/text file
 */
function downloadBriefFile(brief, caseTitle, court, caseNumber) {
  if (!brief) return;

  const content = [
    `================================================================================`,
    `                      NYAYALENS OFFICIAL CASE BRIEF`,
    `================================================================================`,
    `Case Title:   ${caseTitle || 'Indian Court Judgment'}`,
    `Court:        ${court || 'Indian Court'}`,
    `Case Number:  ${caseNumber || 'N/A'}`,
    `Generated:    ${new Date().toLocaleDateString('en-IN')}`,
    `Standard:     Law Student & Advocate Precedent Brief (5-Part IRAC Structure)`,
    `================================================================================`,
    ``,
    `1. FACTUAL MATRIX (FACTS)`,
    `--------------------------------------------------------------------------------`,
    brief.facts || 'Not stated in record.',
    ``,
    `2. LEGAL QUESTIONS & ISSUES FRAMED`,
    `--------------------------------------------------------------------------------`,
    Array.isArray(brief.issues)
      ? brief.issues.map((iss, i) => `(${i + 1}) ${iss}`).join('\n')
      : brief.issues || 'Not framed.',
    ``,
    `3. ARGUMENTS OF COUNSEL`,
    `--------------------------------------------------------------------------------`,
    brief.arguments || 'Not summarized.',
    ``,
    `4. RATIO DECIDENDI & JUDICIAL REASONING`,
    `--------------------------------------------------------------------------------`,
    brief.reasoning || 'Not extracted.',
    ``,
    `5. OPERATIVE DECISION & DISPOSITION`,
    `--------------------------------------------------------------------------------`,
    brief.decision || 'Not extracted.',
    ``,
    `================================================================================`,
    `Prepared by NyayaLens Judicial Intelligence & Verification Engine`,
    `Verbatim Evidence Checked Against Original Judgment PDF.`,
    `================================================================================`,
  ].join('\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `case-brief-${(caseTitle || 'judgment').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function CaseBriefTab({
  brief,
  caseTitle,
  court,
  caseNumber,
  onNavigatePage,
  onOpenMobileViewer,
}) {
  if (!brief || Object.keys(brief).length === 0) {
    return (
      <div className="bg-surface border border-border rounded-surface p-5 text-center space-y-2">
        <p className="text-[14px] text-muted font-sans">
          Structured 5-part case brief will appear once the judgment analysis completes.
        </p>
      </div>
    );
  }

  const sections = [
    {
      title: '1. Material Facts',
      hindi: 'सारभूत तथ्य',
      content: brief.facts,
      isList: false,
    },
    {
      title: '2. Legal Issues Framed',
      hindi: 'विचारणीय कानूनी प्रश्न',
      content: brief.issues,
      isList: true,
    },
    {
      title: '3. Arguments of Counsel',
      hindi: 'पक्षकारों की दलीलें',
      content: brief.arguments,
      isList: false,
    },
    {
      title: '4. Ratio Decidendi & Reasoning',
      hindi: 'निर्णय का कानूनी आधार एवं विवेक',
      content: brief.reasoning,
      isList: false,
    },
    {
      title: '5. Operative Decision',
      hindi: 'अंतिम फैसला एवं आदेश',
      content: brief.decision,
      isList: false,
    },
  ];

  return (
    <div className="bg-surface border border-border rounded-surface overflow-hidden space-y-0">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-border bg-page flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-[12px] font-semibold text-action uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-action" strokeWidth={1.5} />
            <span>Academic &amp; Advocate Case Brief &bull; विधि केस ब्रीफ</span>
          </div>
          <h3 className="text-[16px] sm:text-[18px] font-serif font-semibold text-text">
            5-Stage Judicial Analysis (IRAC Methodology)
          </h3>
        </div>

        <button
          type="button"
          onClick={() => downloadBriefFile(brief, caseTitle, court, caseNumber)}
          className="min-h-[38px] px-3.5 rounded-control border border-border bg-surface hover:bg-page text-text hover:text-action text-[12px] font-medium inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          title="Download formatted brief for law student & advocate study notes"
        >
          <Download className="w-3.5 h-3.5 text-action" strokeWidth={1.5} />
          <span>Download Student Notes (.txt)</span>
        </button>
      </div>

      {/* 5-Stage IRAC Content Sections */}
      <div className="divide-y divide-border">
        {sections.map((sec, idx) => {
          if (!sec.content || (Array.isArray(sec.content) && sec.content.length === 0)) {
            return null;
          }

          return (
            <div key={idx} className="p-4 sm:p-5 space-y-2 hover:bg-page/40 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-serif font-semibold text-text">
                    {sec.title}
                  </span>
                  <span className="text-[12px] font-hindi text-muted">
                    ({sec.hindi})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const phrase = typeof sec.content === 'string' ? sec.content.slice(0, 50) : '';
                    onNavigatePage?.({ phrase, page: idx === 0 ? 1 : idx === 4 ? 29 : null, title: sec.title });
                    onOpenMobileViewer?.({ phrase, page: idx === 0 ? 1 : idx === 4 ? 29 : null, title: sec.title });
                  }}
                  className="text-[11px] text-action hover:text-action-hover underline inline-flex items-center gap-1"
                >
                  <span>View in judgment</span>
                  <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                </button>
              </div>

              {sec.isList && Array.isArray(sec.content) ? (
                <ul className="space-y-1.5 pl-4 list-disc text-[13px] sm:text-[14px] text-text leading-relaxed">
                  {sec.content.map((item, itemIdx) => (
                    <li key={itemIdx}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-[13px] sm:text-[14px] text-text leading-relaxed font-sans">
                  {sec.content}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
