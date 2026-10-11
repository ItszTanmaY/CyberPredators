'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Share2, Check } from 'lucide-react';
import StatusChip from './StatusChip';

export default function CaseSheet({
  record,
  onFactClick,
  onOpenMobileViewer,
}) {
  const [summaryLang, setSummaryLang] = useState('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Stop speech if component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!record) return null;

  const {
    case_type,
    parties,
    verified_parties,
    statutes = [],
    outcome,
    summary,
    summary_hi,
  } = record;

  const petitioners = verified_parties?.petitioner || (parties?.petitioner || []).map(p => ({ name: p, verified: null }));
  const respondents = verified_parties?.respondent || (parties?.respondent || []).map(r => ({ name: r, verified: null }));
  const judges = verified_parties?.judges || (parties?.judges || []).map(j => ({ name: j, verified: null }));

  return (
    <div className="bg-surface border border-border rounded-surface flex flex-col divide-y divide-border text-[14px] overflow-hidden w-full max-w-full">
      {/* 1. Case type */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-4 sm:p-5">
        <div className="w-full sm:w-[110px] md:w-[125px] flex-shrink-0 text-[12px] sm:text-[13px] font-semibold text-muted tracking-wide pt-0.5">
          Case type
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="text-[15px] sm:text-[16px] font-semibold text-text break-words">
            {case_type?.category || 'Not specified'}
            {case_type?.sub_type && (
              <span className="font-normal text-muted ml-2 text-[13px] sm:text-[14px]">
                — {case_type.sub_type}
              </span>
            )}
          </div>
          {case_type?.reasoning && (
            <p className="text-[13px] text-muted leading-relaxed break-words pt-0.5">
              {case_type.reasoning}
            </p>
          )}
        </div>
      </div>

      {/* 2. Parties */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-4 sm:p-5">
        <div className="w-full sm:w-[110px] md:w-[125px] flex-shrink-0 text-[12px] sm:text-[13px] font-semibold text-muted tracking-wide pt-0.5">
          Parties
        </div>
        <div className="flex-1 min-w-0 space-y-4">
          {/* Petitioner or appellant */}
          <div className="space-y-2">
            <span className="text-[12px] font-medium text-muted block">
              Petitioner or appellant
            </span>
            {petitioners.length > 0 ? (
              <div className="space-y-3">
                {petitioners.map((p, idx) => (
                  <div key={idx} className="space-y-1.5 border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => onFactClick?.({ phrase: p.name, page: 1, title: `Petitioner: ${p.name}` })}
                      className="text-left font-medium text-action hover:text-action-hover underline decoration-border hover:decoration-action cursor-pointer block break-words max-w-full text-[14px] leading-snug"
                    >
                      {p.name}
                    </button>

                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <StatusChip
                        verified={p.verified}
                        page={1}
                        onClick={() => onFactClick?.({ phrase: p.name, page: 1, title: `Petitioner: ${p.name}` })}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          onFactClick?.({ phrase: p.name, page: 1, title: `Petitioner: ${p.name}` });
                          onOpenMobileViewer?.({ phrase: p.name, page: 1, title: `Petitioner: ${p.name}` });
                        }}
                        className="text-[12px] text-action hover:text-action-hover hover:underline min-h-[32px] sm:min-h-0 flex items-center"
                      >
                        View in judgment (p. 1)
                      </button>
                    </div>

                    {p.verified === false && (
                      <p className="text-[12px] text-needs-check leading-normal pt-0.5">
                        We could not find this exact wording in the pages we read.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-muted text-[13px]">Not stated</span>
            )}
          </div>

          {/* Respondent */}
          <div className="space-y-2 pt-1 border-t border-border/60">
            <span className="text-[12px] font-medium text-muted block">
              Respondent
            </span>
            {respondents.length > 0 ? (
              <div className="space-y-3">
                {respondents.map((r, idx) => (
                  <div key={idx} className="space-y-1.5 border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => onFactClick?.({ phrase: r.name, page: 1, title: `Respondent: ${r.name}` })}
                      className="text-left font-medium text-action hover:text-action-hover underline decoration-border hover:decoration-action cursor-pointer block break-words max-w-full text-[14px] leading-snug"
                    >
                      {r.name}
                    </button>

                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <StatusChip
                        verified={r.verified}
                        page={1}
                        onClick={() => onFactClick?.({ phrase: r.name, page: 1, title: `Respondent: ${r.name}` })}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          onFactClick?.({ phrase: r.name, page: 1, title: `Respondent: ${r.name}` });
                          onOpenMobileViewer?.({ phrase: r.name, page: 1, title: `Respondent: ${r.name}` });
                        }}
                        className="text-[12px] text-action hover:text-action-hover hover:underline min-h-[32px] sm:min-h-0 flex items-center"
                      >
                        View in judgment (p. 1)
                      </button>
                    </div>

                    {r.verified === false && (
                      <p className="text-[12px] text-needs-check leading-normal pt-0.5">
                        We could not find this exact wording in the pages we read.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-muted text-[13px]">Not stated</span>
            )}
          </div>

          {/* Bench / Judges */}
          {judges.length > 0 && (
            <div className="space-y-2 pt-1 border-t border-border/60">
              <span className="text-[12px] font-medium text-muted block">
                Bench / Coram
              </span>
              <div className="space-y-3">
                {judges.map((j, idx) => (
                  <div key={idx} className="space-y-1.5 border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => onFactClick?.({ phrase: j.name, page: 1, title: `Bench: ${j.name}` })}
                      className="text-left font-medium text-action hover:text-action-hover underline decoration-border hover:decoration-action cursor-pointer block break-words max-w-full text-[14px] leading-snug"
                    >
                      {j.name}
                    </button>

                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <StatusChip
                        verified={j.verified}
                        page={1}
                        onClick={() => onFactClick?.({ phrase: j.name, page: 1, title: `Bench: ${j.name}` })}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          onFactClick?.({ phrase: j.name, page: 1, title: `Bench: ${j.name}` });
                          onOpenMobileViewer?.({ phrase: j.name, page: 1, title: `Bench: ${j.name}` });
                        }}
                        className="text-[12px] text-action hover:text-action-hover hover:underline min-h-[32px] sm:min-h-0 flex items-center"
                      >
                        View in judgment (p. 1)
                      </button>
                    </div>

                    {j.verified === false && (
                      <p className="text-[12px] text-needs-check leading-normal pt-0.5">
                        We could not find this exact wording in the pages we read.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Acts cited */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-4 sm:p-5">
        <div className="w-full sm:w-[110px] md:w-[125px] flex-shrink-0 text-[12px] sm:text-[13px] font-semibold text-muted tracking-wide pt-0.5">
          Acts cited
        </div>
        <div className="flex-1 min-w-0 space-y-3">
          {statutes.length > 0 ? (
            <div className="space-y-3">
              {statutes.map((st, idx) => {
                const phraseToHighlight = st.evidence || `${st.act} ${st.sections?.join(' ')}`;
                const pageNum = st.page || 1;

                return (
                  <div key={idx} className="space-y-1.5 border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
                    <div>
                      <button
                        type="button"
                        onClick={() => onFactClick?.({ phrase: phraseToHighlight, page: pageNum, title: st.act })}
                        className="text-left font-medium text-action hover:text-action-hover underline decoration-border hover:decoration-action cursor-pointer block break-words max-w-full text-[14px]"
                      >
                        {st.act}
                      </button>
                      {st.sections && st.sections.length > 0 && (
                        <div className="text-[13px] text-text font-medium mt-0.5">
                          Section {st.sections.join(', ')}
                        </div>
                      )}
                    </div>

                    {/* Modern BNS / BNSS note */}
                    {st.sectionMappings && st.sectionMappings.some(m => m.newCodeNote) && (
                      <div className="text-[12px] text-muted space-y-0.5 pt-0.5">
                        {st.sectionMappings.filter(m => m.newCodeNote).map((m, mIdx) => (
                          <div key={mIdx} className="leading-snug">
                            Note: {m.newCodeNote}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <StatusChip
                        verified={st.verified}
                        page={pageNum}
                        onClick={() => onFactClick?.({ phrase: phraseToHighlight, page: pageNum, title: st.act })}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          onFactClick?.({ phrase: phraseToHighlight, page: pageNum, title: st.act });
                          onOpenMobileViewer?.({ phrase: phraseToHighlight, page: pageNum, title: st.act });
                        }}
                        className="text-[12px] text-action hover:text-action-hover hover:underline min-h-[32px] sm:min-h-0 flex items-center"
                      >
                        View in judgment (p. {pageNum})
                      </button>
                    </div>

                    {st.verified === false && (
                      <p className="text-[12px] text-needs-check leading-normal pt-0.5">
                        We could not find this exact wording in the pages we read.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="text-muted text-[13px]">No specific acts cited</span>
          )}
        </div>
      </div>

      {/* 4. Outcome */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-4 sm:p-5">
        <div className="w-full sm:w-[110px] md:w-[125px] flex-shrink-0 text-[12px] sm:text-[13px] font-semibold text-muted tracking-wide pt-0.5">
          Outcome
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          {outcome ? (
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => onFactClick?.({
                  phrase: outcome.evidence || outcome.detail,
                  page: outcome.page || 1,
                  title: `Outcome: ${outcome.result}`
                })}
                className="text-left font-semibold text-action hover:text-action-hover underline decoration-border hover:decoration-action cursor-pointer text-[16px] sm:text-[17px] block break-words max-w-full"
              >
                {outcome.result}
              </button>

              {outcome.detail && (
                <p className="text-text text-[14px] leading-relaxed break-words">
                  {outcome.detail}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <StatusChip
                  verified={outcome.verified}
                  page={outcome.page}
                  onClick={() => onFactClick?.({
                    phrase: outcome.evidence || outcome.detail,
                    page: outcome.page || 1,
                    title: `Outcome: ${outcome.result}`
                  })}
                />
                <button
                  type="button"
                  onClick={() => {
                    onFactClick?.({
                      phrase: outcome.evidence || outcome.detail,
                      page: outcome.page || 1,
                      title: `Outcome: ${outcome.result}`
                    });
                    onOpenMobileViewer?.({
                      phrase: outcome.evidence || outcome.detail,
                      page: outcome.page || 1,
                      title: `Outcome: ${outcome.result}`
                    });
                  }}
                  className="text-[12px] text-action hover:text-action-hover hover:underline min-h-[32px] sm:min-h-0 flex items-center"
                >
                  View in judgment (p. {outcome.page || 1})
                </button>
              </div>

              {outcome.verified === false && (
                <p className="text-[12px] text-needs-check leading-normal pt-0.5">
                  We could not find this exact wording in the pages we read.
                </p>
              )}
            </div>
          ) : (
            <span className="text-muted text-[13px]">Not stated</span>
          )}
        </div>
      </div>

      {/* 5. Summary */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-4 sm:p-5">
        <div className="w-full sm:w-[110px] md:w-[125px] flex-shrink-0 text-[12px] sm:text-[13px] font-semibold text-muted tracking-wide pt-0.5">
          Summary
        </div>
        <div className="flex-1 min-w-0 space-y-3">
          {/* Two-option English / हिन्दी switch */}
          {summary_hi && (
            <div className="inline-flex rounded-control border border-border p-0.5 bg-page">
              <button
                type="button"
                onClick={() => setSummaryLang('en')}
                className={`min-h-[28px] px-2.5 rounded-[4px] text-[12px] font-medium transition-colors ${
                  summaryLang === 'en'
                    ? 'bg-surface text-text border border-border'
                    : 'text-muted hover:text-text'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setSummaryLang('hi')}
                className={`min-h-[28px] px-2.5 rounded-[4px] text-[12px] font-medium transition-colors ${
                  summaryLang === 'hi'
                    ? 'bg-surface text-text border border-border'
                    : 'text-muted hover:text-text'
                }`}
              >
                हिन्दी
              </button>
            </div>
          )}

          {/* Speech Synthesis and WhatsApp Share Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
                if (isSpeaking) {
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                  return;
                }
                const textToRead = summaryLang === 'hi' && summary_hi ? summary_hi : summary;
                if (!textToRead) return;

                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(textToRead);
                utterance.lang = summaryLang === 'hi' ? 'hi-IN' : 'en-IN';
                utterance.rate = 0.95;
                utterance.onend = () => setIsSpeaking(false);
                utterance.onerror = () => setIsSpeaking(false);
                setIsSpeaking(true);
                window.speechSynthesis.speak(utterance);
              }}
              className={`min-h-[36px] px-3 rounded-control border text-[12px] font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                isSpeaking
                  ? 'border-error bg-error/10 text-error'
                  : 'border-border bg-surface text-text hover:bg-page hover:text-action'
              }`}
              title={isSpeaking ? 'Stop speech' : 'Read summary aloud in browser'}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-error" strokeWidth={1.5} />
                  <span>Stop reading</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-action" strokeWidth={1.5} />
                  <span>Read aloud ({summaryLang === 'hi' ? 'हिन्दी' : 'English'})</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                const caseCategory = case_type?.category || 'Court Case';
                const outcomeText = outcome?.result ? `Outcome: ${outcome.result}` : 'Order issued';
                const shareSummary = summary ? summary.split('. ').slice(0, 3).join('. ') : '';
                const text = `*NyayaLens Court Judgment Summary*\n📌 *Case Type:* ${caseCategory}\n⚖️ *${outcomeText}*\n\n📝 *Summary:*\n${shareSummary}\n\n_Review complete court orders verbatim at NyayaLens Portal._`;
                const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              className="min-h-[36px] px-3 rounded-control border border-border bg-surface text-text hover:bg-page hover:text-action text-[12px] font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Share 3-sentence summary on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5 text-action" strokeWidth={1.5} />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
