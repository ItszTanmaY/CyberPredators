'use client';

import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MobileBottomSheet({
  isOpen,
  onClose,
  pages = [],
  currentPage = 1,
  onSelectPage,
  targetPhrase = '',
  factTitle = 'Evidence in judgment',
}) {
  const markRef = useRef(null);
  const sheetRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Scroll to mark element when opened or page changed
  useEffect(() => {
    if (isOpen && markRef.current) {
      markRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isOpen, currentPage, targetPhrase]);

  if (!isOpen) return null;

  const activePageObj = pages.find(p => p.page === currentPage) || pages[0] || { page: currentPage, text: '' };
  const rawText = activePageObj.text || '';
  const totalPagesCount = pages.length > 0 ? Math.max(...pages.map(p => p.page)) : 1;

  const renderTextWithHighlight = () => {
    if (!targetPhrase || typeof targetPhrase !== 'string' || targetPhrase.trim().length < 3) {
      return <span>{rawText}</span>;
    }

    const trimmedPhrase = targetPhrase.trim();
    const index = rawText.toLowerCase().indexOf(trimmedPhrase.toLowerCase());
    if (index === -1) {
      return <span>{rawText}</span>;
    }

    const before = rawText.slice(0, index);
    const highlighted = rawText.slice(index, index + trimmedPhrase.length);
    const after = rawText.slice(index + trimmedPhrase.length);

    return (
      <>
        <span>{before}</span>
        <mark ref={markRef} className="evidence">
          {highlighted}
        </mark>
        <span>{after}</span>
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 lg:hidden">
      {/* Backdrop tap to close */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* The Bottom Sheet: full width, 85% height, only permitted shadow */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Judgment source page"
        className="relative z-10 w-full h-[85vh] bg-surface rounded-t-[12px] border-t border-border flex flex-col overflow-hidden mobile-bottom-sheet"
      >
        {/* Header bar: Fact title, page navigation, close button */}
        <div className="h-[56px] px-4 border-b border-border flex items-center justify-between flex-shrink-0 bg-surface">
          <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
            <span className="text-[14px] font-semibold text-text truncate">
              {factTitle}
            </span>
            <span className="text-[12px] text-muted whitespace-nowrap flex-shrink-0">
              (p. {currentPage}/{totalPagesCount})
            </span>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onSelectPage?.(Math.max(1, currentPage - 1))}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-muted hover:text-text disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPagesCount}
              onClick={() => onSelectPage?.(Math.min(totalPagesCount, currentPage + 1))}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-muted hover:text-text disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-muted hover:text-text"
              aria-label="Close judgment page"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Reader text body: 16px padding on phones, Literata 17px, line height 1.75 */}
        <div className="flex-1 overflow-y-auto p-4 text-[17px] leading-[1.75] font-serif text-text whitespace-pre-wrap select-text">
          {rawText ? (
            renderTextWithHighlight()
          ) : (
            <p className="text-muted text-[15px] font-sans">
              Page text not available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
