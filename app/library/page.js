'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import BackButton from '../../components/BackButton';

export default function LibraryPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('nyayalens_library') || '[]');
      if (stored && stored.length > 0) {
        setItems(stored);
      } else {
        // Default sample records
        const sampleRecords = [
          {
            file: 'case01_criminal_bail.pdf',
            case_type: 'Criminal',
            court: 'Supreme Court of India',
            outcome: 'Bail granted',
            decision_date: '2024-08-09',
            sampleKey: 'case01_criminal_bail',
          },
          {
            file: 'case02_cheating_quashing.pdf',
            case_type: 'Criminal',
            court: 'High Court of Judicature at Allahabad',
            outcome: 'Allowed',
            decision_date: '2023-11-15',
            sampleKey: 'case02_cheating_quashing',
          },
          {
            file: 'case03_writ_mandamus.pdf',
            case_type: 'Constitutional/Writ',
            court: 'High Court of Delhi',
            outcome: 'Disposed of',
            decision_date: '2024-03-22',
            sampleKey: 'case03_writ_mandamus',
          },
        ];
        setItems(sampleRecords);
      }
    } catch {
      setItems([]);
    }
  }, []);

  const types = ['All', 'Criminal', 'Constitutional/Writ'];

  const filteredItems = selectedType === 'All'
    ? items
    : items.filter(item => item.case_type?.toLowerCase().includes(selectedType.toLowerCase()));

  const handleOpenCase = (item) => {
    if (item.sampleKey) {
      router.push(`/portal?sample=${item.sampleKey}`);
      return;
    }
    if (item.record) {
      sessionStorage.setItem('nyayalens_active_case', JSON.stringify(item.record));
      router.push('/portal');
    }
  };

  return (
    <div className="space-y-6">
      <BackButton href="/" label="Back to Home" />

      {/* Title & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-semibold text-text font-serif tracking-tight">
            Case library
          </h1>
          <p className="text-[14px] text-muted">
            All judgments analysed on this device
          </p>
        </div>

        {/* Filter Row */}
        {items.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[13px] text-muted mr-1">Type:</span>
            {types.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`min-h-[36px] px-3 rounded-control text-[13px] font-medium transition-colors border ${
                  selectedType === type
                    ? 'border-action bg-surface text-action'
                    : 'border-border bg-surface text-muted hover:text-text'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-surface border border-border rounded-surface space-y-3">
          <p className="text-[15px] text-muted">
            No judgments yet. Upload one to see it here.
          </p>
          <div>
            <Link
              href="/"
              className="min-h-[44px] px-4 rounded-control border border-border bg-surface hover:border-action text-action text-[13px] font-medium inline-flex items-center justify-center transition-colors"
            >
              Upload a judgment
            </Link>
          </div>
        </div>
      ) : (
        /* Results Table / Stacked Mobile Blocks */
        <div>
          {/* Desktop Table: 640px and up */}
          <div className="hidden sm:block bg-surface border border-border rounded-surface overflow-hidden">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-page border-b border-border text-[13px] font-medium text-muted">
                <tr>
                  <th className="py-3 px-4 font-medium">Case</th>
                  <th className="py-3 px-4 font-medium">Type</th>
                  <th className="py-3 px-4 font-medium">Court</th>
                  <th className="py-3 px-4 font-medium">Outcome</th>
                  <th className="py-3 px-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item, idx) => (
                  <tr
                    key={idx}
                    onClick={() => handleOpenCase(item)}
                    className="hover:bg-page transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-medium text-action underline decoration-border hover:decoration-action">
                      {item.file}
                    </td>
                    <td className="py-3.5 px-4 text-text">
                      {item.case_type}
                    </td>
                    <td className="py-3.5 px-4 text-muted">
                      {item.court}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-text">
                      {item.outcome}
                    </td>
                    <td className="py-3.5 px-4 text-muted whitespace-nowrap">
                      {item.decision_date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Blocks: Under 640px - Never a horizontally scrolling table */}
          <div className="sm:hidden space-y-3">
            {filteredItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleOpenCase(item)}
                className="p-4 bg-surface border border-border rounded-surface space-y-2 cursor-pointer hover:border-action transition-colors"
              >
                <div className="font-semibold text-action text-[15px]">
                  {item.file}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[13px]">
                  <div>
                    <span className="text-muted block text-[12px]">Type</span>
                    <span className="text-text font-medium">{item.case_type}</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[12px]">Outcome</span>
                    <span className="text-text font-medium">{item.outcome}</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[12px]">Court</span>
                    <span className="text-muted truncate block">{item.court}</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[12px]">Date</span>
                    <span className="text-muted block">{item.decision_date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
