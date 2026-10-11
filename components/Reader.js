'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, X, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

export default function Reader({
  pages = [],
  currentPage = 1,
  onSelectPage,
  analysedPages = [],
  targetPhrase = '',
  totalDocumentPages = null,
  legalTerms = [],
}) {
  const markRef = useRef(null);
  const containerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [jumpPageInput, setJumpPageInput] = useState(currentPage.toString());
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'evidence'
  const [copied, setCopied] = useState(false);
  const [activePopover, setActivePopover] = useState(null); // { term, meaning, x, y }

  const totalPagesCount = totalDocumentPages || (pages.length > 0 ? Math.max(...pages.map(p => p.page)) : 1);

  // Sync jump input when currentPage changes externally
  useEffect(() => {
    setJumpPageInput(currentPage.toString());
  }, [currentPage]);

  // Find active page content
  const activePageObj = pages.find(p => p.page === currentPage) || { page: currentPage, text: '' };
  const rawText = activePageObj.text || '';

  // Scroll to highlighted evidence mark element when target phrase or page changes
  useEffect(() => {
    if (markRef.current) {
      markRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentPage, targetPhrase]);

  // Handle direct page jump submission
  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const parsed = parseInt(jumpPageInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPagesCount) {
      onSelectPage?.(parsed);
    } else {
      setJumpPageInput(currentPage.toString());
    }
  };

  // Copy current page text
  const handleCopyText = async () => {
    if (!rawText) return;
    try {
      await navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

  // Search analysis across entire document
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length < 2) return null;
    const query = searchQuery.trim().toLowerCase();
    
    const pageMatches = [];
    let totalCount = 0;

    pages.forEach(p => {
      const pText = (p.text || '').toLowerCase();
      let count = 0;
      let pos = 0;
      while ((pos = pText.indexOf(query, pos)) !== -1) {
        count++;
        pos += query.length;
      }
      if (count > 0) {
        pageMatches.push({ page: p.page, count });
        totalCount += count;
      }
    });

    return { totalCount, pageMatches };
  }, [searchQuery, pages]);

  // List of page numbers to show in picker strip
  const visiblePageNumbers = useMemo(() => {
    // Generate full list of 1..totalPagesCount
    const allNums = Array.from({ length: totalPagesCount }, (_, i) => i + 1);
    if (filterMode === 'evidence') {
      const evidenceSet = new Set(analysedPages);
      const filtered = allNums.filter(n => evidenceSet.has(n));
      return filtered.length > 0 ? filtered : allNums;
    }
    return allNums;
  }, [totalPagesCount, filterMode, analysedPages]);

  // Find next page with search hit
  const handleNextSearchPage = () => {
    if (!searchResults || searchResults.pageMatches.length === 0) return;
    const nextMatch = searchResults.pageMatches.find(m => m.page > currentPage) || searchResults.pageMatches[0];
    if (nextMatch) onSelectPage?.(nextMatch.page);
  };

  const handlePrevSearchPage = () => {
    if (!searchResults || searchResults.pageMatches.length === 0) return;
    const reversed = [...searchResults.pageMatches].reverse();
    const prevMatch = reversed.find(m => m.page < currentPage) || reversed[0];
    if (prevMatch) onSelectPage?.(prevMatch.page);
  };

  // Helper to wrap legal terms with dotted underline & hover popover
  const wrapLegalTerms = (textSegment, keyPrefix = 'seg') => {
    if (!textSegment || !legalTerms || legalTerms.length === 0) {
      return textSegment;
    }

    // Build regex of terms sorted by descending length
    const validTerms = legalTerms
      .filter(lt => lt.term && lt.term.trim().length >= 3)
      .sort((a, b) => b.term.length - a.term.length);

    if (validTerms.length === 0) return textSegment;

    const pattern = new RegExp(
      `\\b(${validTerms.map(t => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
      'gi'
    );

    const parts = textSegment.split(pattern);
    if (parts.length <= 1) return textSegment;

    return parts.map((part, pIdx) => {
      const matchObj = validTerms.find(vt => vt.term.toLowerCase() === part.toLowerCase());
      if (matchObj) {
        return (
          <span
            key={`${keyPrefix}-term-${pIdx}`}
            className="border-b border-dotted border-action/80 text-action/90 cursor-help relative group inline"
            onClick={(e) => {
              e.stopPropagation();
              setActivePopover(prev => prev?.term === matchObj.term ? null : matchObj);
            }}
            onMouseEnter={() => setActivePopover(matchObj)}
            onMouseLeave={() => setActivePopover(null)}
            title={`${matchObj.term}: ${matchObj.meaning}`}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Render text with both evidence highlighter and search query highlighter
  const renderTextContent = () => {
    if (!rawText) {
      return (
        <div className="py-8 text-center space-y-2">
          <p className="text-muted text-[15px] font-sans">
            Page {currentPage} text was not extracted.
          </p>
          <p className="text-[13px] text-muted font-sans">
            Use the page switcher or search to navigate to extracted pages.
          </p>
        </div>
      );
    }

    // 1. Evidence phrase takes priority for mark element
    const trimmedEvidence = targetPhrase?.trim();
    let hasEvidence = false;
    let matchStart = -1;
    let matchEnd = -1;

    if (trimmedEvidence && trimmedEvidence.length >= 3) {
      // Try exact substring first
      const exactIdx = rawText.toLowerCase().indexOf(trimmedEvidence.toLowerCase());
      if (exactIdx !== -1) {
        hasEvidence = true;
        matchStart = exactIdx;
        matchEnd = exactIdx + trimmedEvidence.length;
      } else {
        // Try whitespace-flexible regex (handles \n vs space)
        const words = trimmedEvidence.split(/\s+/).filter(Boolean);
        if (words.length > 0) {
          const escapedWords = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
          const flexPattern = new RegExp(escapedWords.join('[\\s\\r\\n]+'), 'i');
          const regexMatch = flexPattern.exec(rawText);
          if (regexMatch) {
            hasEvidence = true;
            matchStart = regexMatch.index;
            matchEnd = regexMatch.index + regexMatch[0].length;
          } else if (words.length > 3) {
            // Fallback: match first 4-5 words
            const subWords = words.slice(0, 5).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            const subPattern = new RegExp(subWords.join('[\\s\\r\\n]+'), 'i');
            const subMatch = subPattern.exec(rawText);
            if (subMatch) {
              hasEvidence = true;
              matchStart = subMatch.index;
              matchEnd = subMatch.index + subMatch[0].length;
            }
          }
        }
      }
    }

    if (hasEvidence && matchStart !== -1) {
      const before = rawText.slice(0, matchStart);
      const matched = rawText.slice(matchStart, matchEnd);
      const after = rawText.slice(matchEnd);

      return (
        <>
          <span>{wrapLegalTerms(before, 'b')}</span>
          <mark ref={markRef} className="evidence" title="Verbatim source evidence">
            {matched}
          </mark>
          <span>{wrapLegalTerms(after, 'a')}</span>
        </>
      );
    }

    // 2. If search query is active and no evidence phrase, highlight search matches
    if (searchQuery && searchQuery.trim().length >= 2) {
      const query = searchQuery.trim();
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const parts = rawText.split(new RegExp(`(${escaped})`, 'gi'));

      return (
        <>
          {parts.map((part, i) => {
            if (part.toLowerCase() === query.toLowerCase()) {
              return (
                <mark key={i} className="evidence">
                  {part}
                </mark>
              );
            }
            return <span key={i}>{wrapLegalTerms(part, `srch-${i}`)}</span>;
          })}
        </>
      );
    }

    return <span>{wrapLegalTerms(rawText, 'full')}</span>;
  };

  const wordCount = useMemo(() => {
    return rawText ? rawText.trim().split(/\s+/).filter(Boolean).length : 0;
  }, [rawText]);

  return (
    <div className="bg-surface border border-border rounded-surface flex flex-col h-full overflow-hidden">
      {/* Top Bar: Stepper, Jump Input, and Page Filter */}
      <div className="p-3 sm:p-4 border-b border-border flex flex-col gap-3 bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Stepper & Direct Jump Form */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onSelectPage?.(Math.max(1, currentPage - 1))}
              className="min-h-[44px] min-w-[44px] px-2.5 rounded-control border border-border bg-surface text-text hover:bg-page disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors text-[14px]"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4 text-muted" strokeWidth={1.5} />
              <span className="hidden sm:inline ml-1 text-text">Previous</span>
            </button>

            {/* Direct Page Input Form */}
            <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5">
              <span className="text-[13px] text-muted whitespace-nowrap">Page</span>
              <input
                type="number"
                min="1"
                max={totalPagesCount}
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                onBlur={handleJumpSubmit}
                aria-label="Page number"
                className="w-14 h-[44px] text-center rounded-control border border-border bg-page text-text font-medium text-[14px] focus:outline-none focus:ring-2 focus:ring-action"
              />
              <span className="text-[13px] text-muted whitespace-nowrap">of {totalPagesCount}</span>
            </form>

            <button
              type="button"
              disabled={currentPage >= totalPagesCount}
              onClick={() => onSelectPage?.(Math.min(totalPagesCount, currentPage + 1))}
              className="min-h-[44px] min-w-[44px] px-2.5 rounded-control border border-border bg-surface text-text hover:bg-page disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors text-[14px]"
              aria-label="Next page"
            >
              <span className="hidden sm:inline mr-1 text-text">Next</span>
              <ChevronRight className="w-4 h-4 text-muted" strokeWidth={1.5} />
            </button>
          </div>

          {/* Quick Actions: Copy text & Filter Toggle */}
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-control border border-border p-0.5 bg-page text-[12px]">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`min-h-[32px] px-2.5 rounded-[4px] font-medium transition-colors ${
                  filterMode === 'all'
                    ? 'bg-surface text-text border border-border'
                    : 'text-muted hover:text-text'
                }`}
              >
                All ({totalPagesCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('evidence')}
                className={`min-h-[32px] px-2.5 rounded-[4px] font-medium transition-colors ${
                  filterMode === 'evidence'
                    ? 'bg-surface text-text border border-border'
                    : 'text-muted hover:text-text'
                }`}
                title="Only pages with verified facts"
              >
                Evidence ({analysedPages.length})
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyText}
              disabled={!rawText}
              className="min-h-[44px] px-3 rounded-control border border-border bg-surface text-text hover:bg-page transition-colors text-[12px] font-medium inline-flex items-center gap-1.5 disabled:opacity-40"
              title="Copy current page text"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-verified" strokeWidth={1.5} />
                  <span className="text-verified">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-muted" strokeWidth={1.5} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-time In-Judgment Search Bar */}
        <div className="flex items-center gap-2 pt-1 border-t border-border/50">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Find in judgment (e.g. bail, Article 21, FIR)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[40px] pl-9 pr-8 text-[13px] rounded-control border border-border bg-page text-text focus:outline-none focus:ring-2 focus:ring-action"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-muted hover:text-text"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            )}
          </div>

          {searchResults && (
            <div className="flex items-center gap-1.5 text-[12px] text-muted whitespace-nowrap">
              <span>
                {searchResults.totalCount} {searchResults.totalCount === 1 ? 'match' : 'matches'}
              </span>
              <button
                type="button"
                onClick={handlePrevSearchPage}
                disabled={searchResults.totalCount === 0}
                className="w-8 h-8 rounded border border-border flex items-center justify-center hover:bg-page disabled:opacity-30"
                title="Previous match page"
              >
                <ChevronUp className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={handleNextSearchPage}
                disabled={searchResults.totalCount === 0}
                className="w-8 h-8 rounded border border-border flex items-center justify-center hover:bg-page disabled:opacity-30"
                title="Next match page"
              >
                <ChevronDown className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Page Strip */}
        <div className="overflow-x-auto page-picker-scroll py-1 flex items-center gap-1.5">
          {visiblePageNumbers.map((pNum) => {
            const isEvidence = analysedPages.includes(pNum);
            const isCurrent = pNum === currentPage;
            const hasSearchMatch = searchResults?.pageMatches.some(m => m.page === pNum);

            return (
              <button
                key={pNum}
                type="button"
                onClick={() => onSelectPage?.(pNum)}
                className={`min-h-[36px] min-w-[36px] h-[36px] px-2 rounded-control text-[12px] font-medium transition-colors flex items-center justify-center flex-shrink-0 relative ${
                  isCurrent
                    ? 'bg-action text-white'
                    : hasSearchMatch
                    ? 'border-2 border-action bg-page text-action font-semibold'
                    : isEvidence
                    ? 'border border-action/40 bg-page text-text hover:border-action font-semibold'
                    : 'border border-border bg-surface text-muted hover:text-text'
                }`}
                aria-label={`Jump to page ${pNum}`}
                title={`Page ${pNum}${isEvidence ? ' (Contains verified evidence)' : ''}${hasSearchMatch ? ' (Contains search match)' : ''}`}
              >
                <span>{pNum}</span>
                {isEvidence && !isCurrent && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-action" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reader Document Body: Literata 17px, line height 1.75, max 70ch, 24px padding (16px on phones) */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 text-[17px] leading-[1.75] font-serif text-text max-w-reader whitespace-pre-wrap select-text relative"
      >
        {renderTextContent()}
      </div>

      {/* Floating Popover for Legal Terms (Hover/Tap) */}
      {activePopover && (
        <div className="bg-surface border border-action/40 shadow-sm p-3 mx-4 my-2 rounded-control flex items-start justify-between gap-3 text-[13px] animate-fadeIn">
          <div className="space-y-0.5">
            <div className="font-semibold text-action font-serif">
              Legal term: <em>{activePopover.term}</em>
            </div>
            <div className="text-text font-sans leading-snug">
              {activePopover.meaning}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActivePopover(null)}
            className="text-muted hover:text-text p-1 text-[12px]"
            aria-label="Close term definition"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Reader Status Bar */}
      <div className="px-4 py-2 border-t border-border bg-page/60 text-[12px] text-muted flex items-center justify-between">
        <span>
          Page {currentPage} of {totalPagesCount}
        </span>
        <span>
          {wordCount > 0 ? `${wordCount} words` : 'Empty page'}
        </span>
      </div>
    </div>
  );
}
