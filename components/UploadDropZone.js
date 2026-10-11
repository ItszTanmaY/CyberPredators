'use client';

import React, { useState, useRef } from 'react';
import { Upload, AlertTriangle, Building2, BookOpen, Users, Check } from 'lucide-react';
import { readPages, selectPages } from '../lib/pdf';
import { useAuth, ROLE_DETAILS } from '../context/AuthContext';
import { maskPagesForAnalysis } from '../lib/privacy';
import PrivacyMaskingBanner from './PrivacyMaskingBanner';

export default function UploadDropZone({
  onAnalysisSuccess,
  onSelectSample,
  sampleCases = [],
}) {
  const { role, switchRole } = useAuth();
  const currentRole = role || 'clerk';

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingStep, setLoadingStep] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [canRetry, setCanRetry] = useState(false);
  const [maskMinorsVictims, setMaskMinorsVictims] = useState(false);
  const [privacySummary, setPrivacySummary] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return false;

    // Check PDF type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('This file is not a PDF. Choose a PDF judgment.');
      setCanRetry(false);
      return false;
    }

    // Check size (30MB max)
    if (file.size > 30 * 1024 * 1024) {
      setErrorMessage('This file is over 30MB. Try a smaller PDF.');
      setCanRetry(false);
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      setErrorMessage(null);
      runAnalysis(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      setErrorMessage(null);
      runAnalysis(file);
    }
  };

  const runAnalysis = async (fileToProcess) => {
    const targetFile = fileToProcess || selectedFile;
    if (!targetFile) return;

    setErrorMessage(null);
    setCanRetry(false);

    try {
      // Step 1: Reading pages
      setLoadingStep('Reading pages');
      const { totalPages, pages } = await readPages(targetFile);

      // Check if text is extractable (scanned PDF check)
      const totalTextLength = pages.reduce((acc, p) => acc + (p.text?.trim().length || 0), 0);
      if (totalTextLength < 50) {
        setLoadingStep(null);
        setErrorMessage('This PDF has no readable text, so we cannot analyse it. Try a text version of the judgment.');
        return;
      }

      // Step 2: Selecting key pages & Finding parties and laws
      setLoadingStep('Finding parties and laws');
      const { selectedPages } = selectPages(pages, 12);

      // Privacy Safeguard: Mask Aadhaar, Phone, PAN, Email, and optional minor/victim identities in browser
      const { maskedPages, counts, totalMasked } = maskPagesForAnalysis(selectedPages, maskMinorsVictims);
      setPrivacySummary({ counts, totalMasked });

      // Step 3: Checking each answer against the text
      setLoadingStep('Checking each answer against the text');
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: targetFile.name,
          totalPages,
          pages: maskedPages, // Unmasked text is NEVER sent to server
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Analysis request failed');
      }

      const result = await res.json();
      setLoadingStep(null);
      onAnalysisSuccess?.({
        ...result,
        privacy: { counts, totalMasked, maskMinorsVictims },
      }, pages, targetFile.name);
    } catch (err) {
      console.error('[NyayaLens Analysis Error]:', err);
      setLoadingStep(null);
      setErrorMessage(err.message || 'The analysis did not finish. Try again, or open a saved sample.');
      setCanRetry(true);
    }
  };

  return (
    <div className="space-y-8">
      {/* Home Hero Introduction */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-action uppercase tracking-wider bg-page px-2 py-0.5 rounded border border-border">
            e-Courts Judicial Review Gateway
          </span>
          <span className="text-[12px] text-muted">
            National Portal
          </span>
        </div>
        <h1 className="text-[28px] sm:text-[34px] font-semibold text-text tracking-tight font-serif">
          Understand an Indian court judgment in seconds.
        </h1>
        <p className="text-[16px] text-muted max-w-[720px] leading-relaxed">
          Upload any High Court or Supreme Court judgment PDF to extract case type, parties, statutes cited, operative orders, and tailored intelligence for your role.
        </p>

        {/* Role Quick Selector on Home Screen */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-medium text-muted mr-1">Active perspective:</span>
          <button
            type="button"
            onClick={() => switchRole('clerk')}
            className={`min-h-[36px] px-3 rounded-control text-[12px] font-medium transition-colors border flex items-center gap-1.5 ${
              currentRole === 'clerk'
                ? 'border-action bg-surface text-action font-semibold'
                : 'border-border bg-page text-muted hover:text-text'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Court Clerk</span>
          </button>
          <button
            type="button"
            onClick={() => switchRole('lawyer')}
            className={`min-h-[36px] px-3 rounded-control text-[12px] font-medium transition-colors border flex items-center gap-1.5 ${
              currentRole === 'lawyer'
                ? 'border-action bg-surface text-action font-semibold'
                : 'border-border bg-page text-muted hover:text-text'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Advocate &amp; Student</span>
          </button>
          <button
            type="button"
            onClick={() => switchRole('citizen')}
            className={`min-h-[36px] px-3 rounded-control text-[12px] font-medium transition-colors border flex items-center gap-1.5 ${
              currentRole === 'citizen'
                ? 'border-verified bg-surface text-verified font-semibold'
                : 'border-border bg-page text-muted hover:text-text'
            }`}
          >
            <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Citizen &amp; Litigant</span>
          </button>
        </div>
      </div>

      {/* Privacy Masking Controls & Summary */}
      <PrivacyMaskingBanner
        counts={privacySummary?.counts}
        maskMinorsVictims={maskMinorsVictims}
        onToggleMinorsVictims={setMaskMinorsVictims}
        totalMasked={privacySummary?.totalMasked || 0}
      />

      {/* Large Drop Zone: White surface, 1px dashed border, 8px radius */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`bg-surface border border-dashed rounded-surface p-8 sm:p-12 text-center transition-colors relative ${
          isDragging ? 'border-action bg-[#F2F4F8]' : 'border-border'
        }`}
      >
        <div className="max-w-[460px] mx-auto flex flex-col items-center justify-center space-y-4">
          <Upload className="w-7 h-7 text-action" strokeWidth={1.5} />

          <div className="space-y-1">
            <p className="text-[17px] font-semibold text-text">
              Drop a PDF here, or choose a file
            </p>
            <p className="text-[13px] text-muted">
              Text PDFs, up to 30MB &bull; Automatic cause title &amp; BNS cross-mapping
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={!!loadingStep}
              onClick={() => fileInputRef.current?.click()}
              className="min-h-[44px] px-5 rounded-control border border-border bg-surface text-text hover:bg-page transition-colors text-[14px] font-medium inline-flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              Choose file
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Role-specific prompt highlight */}
          <div className="text-[12px] text-muted border-t border-border/50 pt-3 max-w-[380px]">
            {currentRole === 'clerk' && (
              <span>Bench Desk Mode: Will extract memo of parties, cause list docket, and defect notes.</span>
            )}
            {currentRole === 'lawyer' && (
              <span>Litigation Mode: Will extract ratio decidendi, IPC to BNS cross-mapping, and precedent citations.</span>
            )}
            {currentRole === 'citizen' && (
              <span>Citizen Mode: Will generate plain English and हिन्दी explanations with next action steps.</span>
            )}
          </div>

          {/* Loading States & Progress Bar */}
          {loadingStep && (
            <div className="w-full pt-4 space-y-2">
              <div className="w-full h-1 bg-border rounded-full overflow-hidden relative">
                <div className="h-full w-1/3 bg-action rounded-full progress-indeterminate" />
              </div>
              <p className="text-[13px] text-action font-medium">
                {loadingStep}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Error Message Notice */}
      {errorMessage && (
        <div className="p-4 rounded-surface border border-error bg-surface text-[14px] text-error flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-error mt-0.5" strokeWidth={1.5} />
            <span>{errorMessage}</span>
          </div>
          {canRetry && (
            <button
              type="button"
              onClick={() => runAnalysis()}
              className="min-h-[44px] px-4 rounded-control border border-error text-error bg-surface hover:bg-page text-[13px] font-medium flex items-center justify-center self-start sm:self-auto"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {/* Plain list of 3 sample judgments with rules between rows (not cards) */}
      <div className="space-y-3 pt-2">
        <h2 className="text-[15px] font-semibold text-muted">
          Or try a sample judgment
        </h2>

        <div className="bg-surface border border-border rounded-surface divide-y divide-border">
          {sampleCases.map((sample) => (
            <div
              key={sample.key}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-page transition-colors"
            >
              <div className="space-y-0.5">
                <div className="font-medium text-text text-[15px]">
                  {sample.title}
                </div>
                <div className="text-[13px] text-muted">
                  {sample.court} &bull; {sample.caseNumber} &bull; {sample.type}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectSample?.(sample.key)}
                className="min-h-[44px] px-4 rounded-control border border-border bg-surface hover:border-action text-action hover:text-action-hover text-[13px] font-medium inline-flex items-center justify-center self-start sm:self-auto transition-colors"
              >
                Analyse judgment
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
