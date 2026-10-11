'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, FileText, CheckCircle2, Copy } from 'lucide-react';

export default function SourceViewer({ isOpen, onClose, pages = [], initialPage = 1, targetPhrase = '', title = 'Source Evidence' }) {
  const [currentPage, setCurrentPage] = useState(initialPage || 1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialPage) {
      setCurrentPage(initialPage);
    }
  }, [initialPage, isOpen]);

  if (!isOpen) return null;

  const totalPages = pages.length;
  const activePageObj = pages.find(p => p.page === currentPage) || pages[0] || { page: currentPage, text: '' };
  const rawText = activePageObj.text || '';

  // Highlight targetPhrase inside rawText
  const renderHighlightedContent = () => {
    if (!targetPhrase || targetPhrase.length < 3) {
      return <span>{rawText}</span>;
    }

    // Escape regex characters
    const escaped = targetPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = rawText.split(regex);

    if (parts.length <= 1) {
      // Fallback: try token highlight if exact phrase broken by line wrap
      return <span>{rawText}</span>;
    }

    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === targetPhrase.toLowerCase() ? (
            <mark
              key={i}
              className="bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-semibold shadow-sm animate-pulse"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-[#0f172a] border border-slate-700 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{title}</h3>
              <p className="text-xs text-slate-400">
                Viewing Page <span className="text-amber-400 font-semibold">{currentPage}</span> of {totalPages || 1}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
              title="Copy page text"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Evidence Banner */}
        {targetPhrase && (
          <div className="px-6 py-2.5 bg-amber-950/40 border-b border-amber-800/40 text-xs text-amber-300 flex items-center gap-2">
            <span className="font-semibold flex-shrink-0">Target Evidence:</span>
            <span className="truncate italic">&ldquo;{targetPhrase}&rdquo;</span>
          </div>
        )}

        {/* Page Content Viewer */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#0b101b] whitespace-pre-wrap select-text">
          {rawText ? (
            renderHighlightedContent()
          ) : (
            <p className="text-slate-500 italic">No text content available for this page excerpt.</p>
          )}
        </div>

        {/* Modal Footer with Page Navigation */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev Page</span>
            </button>
            <button
              type="button"
              disabled={currentPage >= (pages[pages.length - 1]?.page || 1)}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 flex items-center gap-1 transition-colors"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-slate-400">
            Source Ground Truth &bull; Verbatim Judgment Transcript
          </span>
        </div>
      </div>
    </div>
  );
}
