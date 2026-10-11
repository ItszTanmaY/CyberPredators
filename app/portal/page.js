'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Download, Building2, BookOpen, Users, LogOut, ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import { useAuth, ROLE_DETAILS } from '../../context/AuthContext';
import UploadDropZone from '../../components/UploadDropZone';
import CaseSheet from '../../components/CaseSheet';
import Reader from '../../components/Reader';
import MobileBottomSheet from '../../components/MobileBottomSheet';
import ClerkWorkspace from '../../components/ClerkWorkspace';
import LawyerWorkspace from '../../components/LawyerWorkspace';
import CitizenWorkspace from '../../components/CitizenWorkspace';
import DirectionsPanel from '../../components/DirectionsPanel';
import CaseBriefTab from '../../components/CaseBriefTab';
import BackButton from '../../components/BackButton';

const SAMPLE_JUDGMENTS = [
  {
    key: 'case01_criminal_bail',
    title: 'Manish Sisodia v. Central Bureau of Investigation',
    court: 'Supreme Court of India',
    caseNumber: 'Criminal Appeal No. 1421 of 2024',
    type: 'Criminal (Bail application)',
  },
  {
    key: 'case02_cheating_quashing',
    title: 'Ramesh Chand v. State of U.P.',
    court: 'High Court of Judicature at Allahabad',
    caseNumber: 'Application U/S 482 No. 8921 of 2023',
    type: 'Criminal (Quashing petition)',
  },
  {
    key: 'case03_writ_mandamus',
    title: 'Meera Sharma v. Union of India',
    court: 'High Court of Delhi',
    caseNumber: 'W.P.(C) 4125/2024',
    type: 'Constitutional/Writ (Mandamus)',
  },
];

export default function PortalPage() {
  const router = useRouter();
  const { user, role, isLoaded, login, logout } = useAuth();

  const [analysisResult, setAnalysisResult] = useState(null);
  const [documentPages, setDocumentPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightPhrase, setHighlightPhrase] = useState('');
  const [currentFactTitle, setCurrentFactTitle] = useState('Source in judgment');
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Restore sample case or active case from session
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const querySample = params.get('sample');
      if (querySample) {
        handleSelectSample(querySample);
        return;
      }

      const active = sessionStorage.getItem('nyayalens_active_case');
      if (active) {
        sessionStorage.removeItem('nyayalens_active_case');
        const parsed = JSON.parse(active);
        setAnalysisResult(parsed);
        setCurrentPage(parsed?.outcome?.page || 1);
        setHighlightPhrase(parsed?.outcome?.evidence || '');
      }
    } catch (err) {
      console.warn('Session restore error:', err);
    }
  }, []);

  // Save analyzed cases to library in localStorage
  useEffect(() => {
    if (analysisResult) {
      try {
        const stored = JSON.parse(localStorage.getItem('nyayalens_library') || '[]');
        const existingIdx = stored.findIndex(item => item.file === analysisResult.file);
        const itemToSave = {
          file: analysisResult.file || 'Judgment.pdf',
          case_type: analysisResult.case_type?.category || 'Other',
          court: analysisResult.court || 'Indian Court',
          outcome: analysisResult.outcome?.result || 'Disposed of',
          decision_date: analysisResult.decision_date || new Date().toISOString().split('T')[0],
          record: analysisResult,
          savedAt: new Date().toISOString(),
        };

        if (existingIdx >= 0) {
          stored[existingIdx] = itemToSave;
        } else {
          stored.unshift(itemToSave);
        }
        localStorage.setItem('nyayalens_library', JSON.stringify(stored));
      } catch (err) {
        console.warn('Could not save to library localStorage:', err);
      }
    }
  }, [analysisResult]);

  const handleAnalysisSuccess = (result, pages, fileName) => {
    setAnalysisResult(result);
    setDocumentPages(pages || []);
    const outcomePage = result?.outcome?.page || 1;
    setCurrentPage(outcomePage);
    setHighlightPhrase(result?.outcome?.evidence || '');
    setCurrentFactTitle(result?.outcome?.result ? `Outcome: ${result.outcome.result}` : 'Operative order');
  };

  const handleSelectSample = async (sampleKey) => {
    try {
      const res = await fetch(`/api/sample?key=${sampleKey}`);
      if (!res.ok) throw new Error('Failed to load sample');
      const data = await res.json();
      setAnalysisResult(data.record);
      setDocumentPages(data.pages || []);
      const initialPage = data.record?.outcome?.page || 1;
      setCurrentPage(initialPage);
      setHighlightPhrase(data.record?.outcome?.evidence || '');
      setCurrentFactTitle(data.record?.outcome?.result ? `Outcome: ${data.record.outcome.result}` : 'Operative order');
    } catch (err) {
      console.error('Error loading sample judgment:', err);
    }
  };

  const handleFactClick = ({ phrase, page, title }) => {
    if (page) setCurrentPage(page);
    setHighlightPhrase(phrase || '');
    setCurrentFactTitle(title || 'Evidence phrase');
  };

  const handleOpenMobileViewer = ({ phrase, page, title }) => {
    if (page) setCurrentPage(page);
    setHighlightPhrase(phrase || '');
    setCurrentFactTitle(title || 'Evidence in judgment');
    setMobileSheetOpen(true);
  };

  const handleDownloadJson = () => {
    if (!analysisResult) return;
    const blob = new Blob([JSON.stringify(analysisResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${analysisResult.file || 'judgment'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const analysedPageNumbers = useMemo(() => {
    if (!analysisResult) return documentPages.map(p => p.page);
    const set = new Set();
    if (analysisResult.meta?.pagesSent) {
      analysisResult.meta.pagesSent.forEach(p => set.add(p));
    }
    if (analysisResult.outcome?.page) set.add(analysisResult.outcome.page);
    if (analysisResult.statutes) {
      analysisResult.statutes.forEach(s => {
        if (s.page) set.add(s.page);
      });
    }
    set.add(1);
    return Array.from(set).sort((a, b) => a - b);
  }, [analysisResult, documentPages]);

  // If not logged in, prompt user to select their role to enter portal
  if (isLoaded && !user) {
    return (
      <div className="space-y-6 max-w-[800px] mx-auto py-6">
        <BackButton href="/" label="Back to Public Site" />

        <div className="bg-surface border border-border rounded-surface p-6 sm:p-8 space-y-6">
          <div className="space-y-2 text-center max-w-[560px] mx-auto">
            <div className="w-12 h-12 rounded-full border border-border bg-page mx-auto flex items-center justify-center">
              <Lock className="w-5 h-5 text-action" strokeWidth={1.5} />
            </div>
            <h1 className="text-[22px] font-serif font-semibold text-text">
              Authorized Portal Gateway
            </h1>
            <p className="text-[14px] text-muted">
              NyayaLens provides role-segregated workspaces. Please select your official role below to authenticate and enter your dedicated environment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <button
              type="button"
              onClick={() => login('clerk')}
              className="p-5 rounded-control border border-border bg-surface hover:border-action transition-colors text-left space-y-3 cursor-pointer"
            >
              <Building2 className="w-5 h-5 text-action" strokeWidth={1.5} />
              <div>
                <div className="font-semibold text-text text-[15px]">Court Clerk</div>
                <div className="text-[12px] font-hindi text-muted">न्यायालय लिपिक</div>
              </div>
              <p className="text-[12px] text-muted">
                Intake audit, cause list docket generation, and BNS transition tags.
              </p>
              <span className="text-[13px] font-medium text-action block pt-1">
                Enter as Clerk &rarr;
              </span>
            </button>

            <button
              type="button"
              onClick={() => login('lawyer')}
              className="p-5 rounded-control border border-border bg-surface hover:border-action transition-colors text-left space-y-3 cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-action" strokeWidth={1.5} />
              <div>
                <div className="font-semibold text-text text-[15px]">Advocate &amp; Student</div>
                <div className="text-[12px] font-hindi text-muted">अधिवक्ता / विधि शोधार्थी</div>
              </div>
              <p className="text-[12px] text-muted">
                Ratio decidendi extraction, IPC to BNS mapping, and case brief drafting.
              </p>
              <span className="text-[13px] font-medium text-action block pt-1">
                Enter as Advocate &rarr;
              </span>
            </button>

            <button
              type="button"
              onClick={() => login('citizen')}
              className="p-5 rounded-control border border-border bg-surface hover:border-verified transition-colors text-left space-y-3 cursor-pointer"
            >
              <Users className="w-5 h-5 text-verified" strokeWidth={1.5} />
              <div>
                <div className="font-semibold text-text text-[15px]">Citizen &amp; Litigant</div>
                <div className="text-[12px] font-hindi text-muted">नागरिक / वादकारी</div>
              </div>
              <p className="text-[12px] text-muted">
                Plain English and Hindi explanations, action checklist, and jargon decoder.
              </p>
              <span className="text-[13px] font-medium text-verified block pt-1">
                Enter as Citizen &rarr;
              </span>
            </button>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-[13px] text-muted hover:text-action underline"
            >
              Or sign in with Bar Council / e-Courts SSO credentials
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const roleInfo = ROLE_DETAILS[role] || ROLE_DETAILS.clerk;

  return (
    <div className="space-y-6">
      {/* Top Portal Navigation & User Identification Banner */}
      <div className="bg-surface border border-border rounded-surface p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <BackButton href="/" label="Back to Website" />

          <div className="h-6 w-[1px] bg-border hidden sm:block flex-shrink-0" />

          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-control border border-border bg-page flex items-center justify-center flex-shrink-0">
              {role === 'clerk' && <Building2 className="w-4 h-4 text-action" strokeWidth={1.5} />}
              {role === 'lawyer' && <BookOpen className="w-4 h-4 text-action" strokeWidth={1.5} />}
              {role === 'citizen' && <Users className="w-4 h-4 text-verified" strokeWidth={1.5} />}
            </div>

            <div className="space-y-0.5 min-w-0">
              <div className="text-[12px] sm:text-[13px] font-semibold text-text truncate">
                {roleInfo.label}: <span className="font-normal text-muted">{user?.name}</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-muted truncate max-w-[280px] sm:max-w-[400px]">
                {roleInfo.designation} &bull; {user?.idNumber}
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Switcher / Sign Out */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-verified bg-page px-2 py-1 rounded border border-border">
            <ShieldCheck className="w-3.5 h-3.5 text-verified" strokeWidth={1.5} />
            <span>Role Restricted Mode</span>
          </span>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="min-h-[38px] px-3 rounded-control border border-border bg-surface text-muted hover:text-error hover:border-error text-[12px] font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Switch Role</span>
          </button>
        </div>
      </div>

      {/* Main Review Body */}
      {!analysisResult ? (
        <UploadDropZone
          onAnalysisSuccess={handleAnalysisSuccess}
          onSelectSample={handleSelectSample}
          sampleCases={SAMPLE_JUDGMENTS}
        />
      ) : (
        <div className="space-y-6">
          {/* Title Row on Top: case title and Court | Case number */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-4 border-b border-border">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 pb-1">
                <button
                  type="button"
                  onClick={() => {
                    setAnalysisResult(null);
                    setDocumentPages([]);
                    setHighlightPhrase('');
                  }}
                  className="text-[13px] text-action hover:text-action-hover underline inline-flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Choose another judgment</span>
                </button>
              </div>

              <h1 className="text-[22px] sm:text-[26px] font-semibold text-text font-serif leading-tight break-words">
                {analysisResult.parties?.petitioner?.[0]
                  ? `${analysisResult.parties.petitioner[0]} v. ${analysisResult.parties.respondent?.[0] || 'State'}`
                  : analysisResult.file || 'Court judgment'}
              </h1>
              <p className="text-[14px] text-muted break-words">
                {analysisResult.court || 'Court record'}
                {analysisResult.case_number ? ` | ${analysisResult.case_number}` : ''}
              </p>
            </div>

            {/* Header Actions: Download JSON, Choose another file */}
            <div className="flex items-center gap-2.5 pt-1 sm:pt-0 flex-shrink-0">
              <button
                type="button"
                onClick={handleDownloadJson}
                className="min-h-[44px] px-3.5 rounded-control border border-border bg-surface text-text hover:bg-page transition-colors text-[13px] font-medium inline-flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-muted" strokeWidth={1.5} />
                <span>Download JSON</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAnalysisResult(null);
                  setDocumentPages([]);
                  setHighlightPhrase('');
                }}
                className="min-h-[44px] px-3.5 rounded-control border border-border bg-surface text-text hover:bg-page transition-colors text-[13px] font-medium inline-flex items-center"
              >
                Choose another file
              </button>
            </div>
          </div>

          {/* Results Main Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Desktop / Tablet Reader: 58% on left */}
            <div className="hidden sm:block lg:col-span-7 w-full order-2 lg:order-1 h-[680px] lg:h-[780px]">
              <Reader
                pages={documentPages}
                currentPage={currentPage}
                onSelectPage={setCurrentPage}
                analysedPages={analysedPageNumbers}
                targetPhrase={highlightPhrase}
                totalDocumentPages={analysisResult.meta?.totalPages}
                legalTerms={analysisResult.legal_terms || []}
              />
            </div>

            {/* Case Sheet: 42% on right */}
            <div className="w-full lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-[72px] space-y-6">
              <CaseSheet
                record={analysisResult}
                onFactClick={handleFactClick}
                onOpenMobileViewer={handleOpenMobileViewer}
              />

              {/* 5-Stage IRAC Case Brief Tab under Case Sheet */}
              <CaseBriefTab
                brief={analysisResult.brief}
                caseTitle={analysisResult.parties?.petitioner?.[0]
                  ? `${analysisResult.parties.petitioner[0]} v. ${analysisResult.parties.respondent?.[0] || 'State'}`
                  : analysisResult.file}
                court={analysisResult.court}
                caseNumber={analysisResult.case_number}
                onNavigatePage={handleFactClick}
                onOpenMobileViewer={handleOpenMobileViewer}
              />
            </div>
          </div>

          {/* Directions & Compliance Calendar Panel */}
          {analysisResult.directions && analysisResult.directions.length > 0 && (
            <div className="pt-2">
              <DirectionsPanel
                directions={analysisResult.directions}
                onDirectionClick={handleFactClick}
                onOpenMobileViewer={handleOpenMobileViewer}
              />
            </div>
          )}

          {/* STRICT ROLE-BASED ACCESS: Renders ONLY the workspace for this logged-in role! */}
          <div className="pt-2">
            {role === 'clerk' && (
              <ClerkWorkspace record={analysisResult} documentPages={documentPages} />
            )}
            {role === 'lawyer' && (
              <LawyerWorkspace record={analysisResult} documentPages={documentPages} />
            )}
            {role === 'citizen' && (
              <CitizenWorkspace record={analysisResult} documentPages={documentPages} />
            )}
          </div>

          {/* Mobile Bottom Sheet for Reader on phones under 640px */}
          <MobileBottomSheet
            isOpen={mobileSheetOpen}
            onClose={() => setMobileSheetOpen(false)}
            pages={documentPages}
            currentPage={currentPage}
            onSelectPage={setCurrentPage}
            targetPhrase={highlightPhrase}
            factTitle={currentFactTitle}
          />

          {/* Disclaimer Footer */}
          <div className="pt-6 border-t border-border text-center sm:text-left">
            <p className="text-[13px] text-muted">
              Automated summary to support review. Not legal advice. Check the original judgment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
