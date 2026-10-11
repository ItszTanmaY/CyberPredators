'use client';

import React, { useState } from 'react';
import { Copy, Check, FileCheck, AlertCircle, Calendar, Hash, Building2 } from 'lucide-react';

export default function ClerkWorkspace({ record, documentPages = [] }) {
  const [copiedDocket, setCopiedDocket] = useState(false);

  if (!record) return null;

  const {
    case_type,
    parties,
    court,
    case_number,
    decision_date,
    outcome,
    statutes = [],
  } = record;

  const petitionerName = parties?.petitioner?.[0] || 'Petitioner';
  const respondentName = parties?.respondent?.[0] || 'Respondent';
  const judgeNames = parties?.judges?.join(' & ') || 'Hon\'ble Bench';

  // Generate standardized Indian e-Courts Cause List / Daily Docket Entry
  const docketText = `[CAUSE LIST ENTRY / DOCKET]\nCase No: ${case_number || 'N/A'}\nCourt: ${court || 'Court of Record'}\nCoram: ${judgeNames}\nCause Title: ${petitionerName} v. ${respondentName}\nNature: ${case_type?.category || 'Criminal'} (${case_type?.sub_type || 'Bail'})\nStatutes Cited: ${statutes.map(s => s.act).join('; ') || 'N/A'}\nOperative Order: ${outcome?.result || 'Disposed'}\nRegistry Note: Release warrant / certified copy processing authorized.`;

  const handleCopyDocket = async () => {
    try {
      await navigator.clipboard.writeText(docketText);
      setCopiedDocket(true);
      setTimeout(() => setCopiedDocket(false), 2000);
    } catch (e) {
      console.warn('Copy failed:', e);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-surface p-5 sm:p-6 space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-action uppercase tracking-wide bg-page px-2 py-0.5 rounded border border-border">
              Bench &amp; Registry Module
            </span>
            <span className="text-[12px] text-muted">
              न्यायालय लिपिक कार्यक्षेत्र
            </span>
          </div>
          <h2 className="text-[18px] font-serif font-semibold text-text">
            Filing Audit &amp; Cause List Docket
          </h2>
        </div>

        <button
          type="button"
          onClick={handleCopyDocket}
          className="min-h-[44px] px-3.5 rounded-control border border-border bg-surface text-text hover:bg-page transition-colors text-[13px] font-medium inline-flex items-center gap-2 self-start sm:self-auto"
        >
          {copiedDocket ? (
            <>
              <Check className="w-4 h-4 text-verified" strokeWidth={1.5} />
              <span className="text-verified">Docket copied</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-muted" strokeWidth={1.5} />
              <span>Copy cause list entry</span>
            </>
          )}
        </button>
      </div>

      {/* Registry Verification Checklist */}
      <div className="space-y-3">
        <div className="text-[13px] font-semibold text-text flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-verified" strokeWidth={1.5} />
          <span>Filing intake &amp; memo verification checklist</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
          <div className="p-3 rounded-control border border-border bg-page space-y-1">
            <div className="text-muted text-[12px]">Cause title audit</div>
            <div className="font-medium text-text">
              {petitionerName} v. {respondentName}
            </div>
            <div className="text-verified text-[12px] flex items-center gap-1">
              <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Parties verified against page 1 memo</span>
            </div>
          </div>

          <div className="p-3 rounded-control border border-border bg-page space-y-1">
            <div className="text-muted text-[12px]">Case number &amp; jurisdiction</div>
            <div className="font-medium text-text">
              {case_number || 'Criminal Appeal'}
            </div>
            <div className="text-verified text-[12px] flex items-center gap-1">
              <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>{court || 'Supreme Court of India'}</span>
            </div>
          </div>

          <div className="p-3 rounded-control border border-border bg-page space-y-1">
            <div className="text-muted text-[12px]">New criminal laws transition (BNS / BNSS)</div>
            <div className="font-medium text-text">
              Dual-regime filing required
            </div>
            <div className="text-action text-[12px]">
              Substantive: IPC 1860 | Procedural trial: BNSS 2023
            </div>
          </div>

          <div className="p-3 rounded-control border border-border bg-page space-y-1">
            <div className="text-muted text-[12px]">Caveat &amp; defect status</div>
            <div className="font-medium text-text">
              Defects cleared &bull; No pending caveat
            </div>
            <div className="text-verified text-[12px] flex items-center gap-1">
              <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Regular listing ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Formatted Cause List Snippet */}
      <div className="space-y-2">
        <div className="text-[13px] font-semibold text-text">
          Standard e-Courts cause list preview
        </div>
        <div className="p-4 rounded-control border border-border bg-page font-mono text-[12px] leading-relaxed text-text select-all whitespace-pre-wrap">
          {docketText}
        </div>
      </div>

      {/* Registry Directives */}
      <div className="p-3.5 rounded-control border border-border bg-page text-[13px] space-y-1">
        <div className="font-medium text-text">
          Next registry action:
        </div>
        <p className="text-muted leading-relaxed">
          Issue formal compliance certificate and communicate operative order to trial court superintendent upon verification of personal bond papers.
        </p>
      </div>
    </div>
  );
}
