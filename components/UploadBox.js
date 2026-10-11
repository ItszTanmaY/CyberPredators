'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { readPages, selectPages } from '../lib/pdf';

export default function UploadBox({ onAnalysisComplete, onSelectSample }) {
  const [isDragging, setIsDragging] = useState(false);
  const [loadingStep, setLoadingStep] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const processFile = async (file) => {
    if (!file) return;
    setErrorMessage(null);

    try {
      // Step 1: Read pages in browser
      setLoadingStep('Reading judgment pages with PDF engine...');
      const { totalPages, pages } = await readPages(file);

      // Step 2: Select high-value pages
      setLoadingStep(`Selecting key operative & cause title pages (out of ${totalPages} pages)...`);
      const { selectedPages } = selectPages(pages, 12);

      // Step 3: Send to /api/analyze
      setLoadingStep('Analyzing legal context, parties & statutes with AI...');
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          totalPages,
          pages: selectedPages
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned HTTP ${res.status}`);
      }

      const result = await res.json();
      setLoadingStep(null);
      onAnalysisComplete(result, selectedPages);
    } catch (err) {
      console.error('[UploadBox Error]:', err);
      setLoadingStep(null);
      setErrorMessage(err.message || 'Failed to process document.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files?.[0]) processFile(files[0]);
  };

  return (
    <div className="space-y-4">
      {/* Main Drag-and-Drop Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all relative overflow-hidden backdrop-blur ${
          isDragging
            ? 'border-amber-400 bg-amber-500/10'
            : 'border-slate-700 hover:border-amber-500/50 bg-slate-900/60'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shadow-xl shadow-slate-950/40">
            {loadingStep ? (
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">
              {loadingStep ? 'Reviewing Court Document' : 'Upload Court Judgment / Order (PDF)'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              {loadingStep || 'Drag & drop any Indian Supreme Court, High Court, or District Court judgment (up to 100+ pages)'}
            </p>
          </div>

          {!loadingStep && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>Select PDF File</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) processFile(e.target.files[0]);
                }}
              />
            </div>
          )}

          {loadingStep && (
            <div className="w-full max-w-xs bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-400 h-1.5 rounded-full animate-pulse w-3/4"></div>
            </div>
          )}
        </div>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-700/60 text-xs sm:text-sm text-rose-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-xs underline hover:text-white flex-shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Quick Sample Selector for Live Demo & Evaluators */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Quick Demo Judgments:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSelectSample?.('case01_criminal_bail')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/50 text-slate-300 border border-slate-700 text-xs font-medium transition-all flex items-center gap-1.5"
          >
            <span>Bail: Sisodia v. CBI</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
          </button>

          <button
            type="button"
            onClick={() => onSelectSample?.('case02_cheating_quashing')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/50 text-slate-300 border border-slate-700 text-xs font-medium transition-all flex items-center gap-1.5"
          >
            <span>Quashing: 420 IPC Dispute</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
