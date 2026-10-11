'use client';

import React from 'react';
import { Calendar, CheckCircle2, Clock, User, ArrowRight, ExternalLink } from 'lucide-react';

/**
 * Generates and downloads an iCalendar (.ics) file in the browser
 */
function downloadIcsFile(direction) {
  const deadlineStr = direction.deadline;
  if (!deadlineStr) return;

  // Format date: YYYY-MM-DD -> YYYYMMDD
  const cleanDate = deadlineStr.replace(/-/g, '');
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const title = `Legal Compliance: ${direction.action.slice(0, 60)}`;
  const description = `Court Direction Details:\nAction: ${direction.action}\nResponsible Party: ${direction.who || 'Designated Party'}\nDeadline: ${direction.deadline}\nSource Page: p. ${direction.page || 1}`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NyayaLens//Indian Judicial Review Gateway//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:nyayalens-${Date.now()}@ecourts.gov.in`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${cleanDate}`,
    `DTEND;VALUE=DATE:${cleanDate}`,
    `SUMMARY:${title.replace(/[\r\n]+/g, ' ')}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    'STATUS:CONFIRMED',
    'PRIORITY:1',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Court Direction Compliance Due Tomorrow',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `court-direction-${cleanDate}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function DirectionsPanel({
  directions = [],
  onDirectionClick,
  onOpenMobileViewer,
}) {
  if (!directions || directions.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-surface p-5 text-center space-y-2">
        <p className="text-[14px] text-muted font-sans">
          No explicit forward directions or calendar compliance deadlines detected in this order.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-surface overflow-hidden">
      {/* Panel Header */}
      <div className="p-4 sm:p-5 border-b border-border bg-page flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="text-[12px] font-semibold text-action uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-verified" strokeWidth={1.5} />
            <span>Compliance Checklist &bull; अनुपालन आदेश</span>
          </div>
          <h3 className="text-[16px] sm:text-[18px] font-serif font-semibold text-text">
            Court Directions &amp; Compliance Calendar
          </h3>
        </div>
        <div className="text-[12px] text-muted font-medium">
          {directions.length} active direction{directions.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Checklist items */}
      <div className="divide-y divide-border">
        {directions.map((dir, idx) => {
          const hasDeadline = Boolean(dir.deadline);
          const pageNum = dir.page || 1;
          const phraseToHighlight = dir.evidence || dir.action;

          return (
            <div
              key={idx}
              className="p-4 sm:p-5 hover:bg-page/50 transition-colors space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="w-6 h-6 rounded-full border border-border bg-page text-muted flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <p className="text-[14px] sm:text-[15px] font-medium text-text leading-relaxed break-words">
                      {dir.action}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-muted">
                      {dir.who && (
                        <div className="inline-flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-muted" strokeWidth={1.5} />
                          <span className="text-text font-medium">{dir.who}</span>
                        </div>
                      )}

                      {hasDeadline ? (
                        <div className="inline-flex items-center gap-1 text-needs-check font-semibold">
                          <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                          <span>Deadline: {dir.deadline}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-muted">
                          <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                          <span>No fixed calendar date</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Add to Calendar button if deadline exists */}
                {hasDeadline && (
                  <button
                    type="button"
                    onClick={() => downloadIcsFile(dir)}
                    className="min-h-[38px] px-3 rounded-control border border-border bg-surface hover:bg-page text-action hover:text-action-hover text-[12px] font-medium inline-flex items-center gap-1.5 flex-shrink-0 transition-colors"
                    title="Download iCalendar event (.ics)"
                  >
                    <Calendar className="w-3.5 h-3.5 text-action" strokeWidth={1.5} />
                    <span className="hidden sm:inline">Add to calendar</span>
                  </button>
                )}
              </div>

              {/* Source Verification Link */}
              <div className="flex items-center gap-3 pl-9 pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    onDirectionClick?.({
                      phrase: phraseToHighlight,
                      page: pageNum,
                      title: `Direction #${idx + 1}: ${dir.action.slice(0, 40)}...`,
                    });
                    onOpenMobileViewer?.({
                      phrase: phraseToHighlight,
                      page: pageNum,
                      title: `Direction #${idx + 1}: ${dir.action.slice(0, 40)}...`,
                    });
                  }}
                  className="text-[12px] font-medium text-action hover:text-action-hover underline inline-flex items-center gap-1"
                >
                  <span>View in judgment, p. {pageNum}</span>
                  <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                </button>

                {dir.verified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-verified font-medium">
                    <CheckCircle2 className="w-3 h-3 text-verified" strokeWidth={1.5} />
                    <span>Verified verbatim</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-needs-check">
                    Check source
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
