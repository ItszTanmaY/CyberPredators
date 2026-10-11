'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  BookOpen,
  Users,
  ShieldCheck,
  Scale,
  FileCheck,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Lock,
  ChevronRight,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function HomePage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleRoleSelect = (roleKey) => {
    login(roleKey);
    router.push('/portal');
  };

  return (
    <div className="space-y-16 py-4">
      {/* 1. Official Hero Section */}
      <section className="text-center space-y-6 max-w-[840px] mx-auto pt-4">
        {/* Real-World Official Emblem Logo Display */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div
            className="rounded-full overflow-hidden border-2 border-border p-1 bg-surface flex items-center justify-center"
            style={{ width: '96px', height: '96px', maxWidth: '96px', maxHeight: '96px' }}
          >
            <img
              src="/logo.jpg"
              alt="NyayaLens Official Emblem - Indian Judicial Review Portal"
              width={88}
              height={88}
              className="rounded-full object-cover"
              style={{ width: '88px', height: '88px', objectFit: 'cover' }}
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-surface text-[12px] font-medium text-muted">
            <span className="w-2 h-2 rounded-full bg-verified" />
            <span>e-Courts Digital Mission Initiative &bull; Government of India</span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-[32px] sm:text-[44px] font-serif font-semibold text-text tracking-tight leading-tight">
            Instant clarity on Indian court judgments.
          </h1>
          <p className="text-[18px] sm:text-[20px] font-hindi text-muted leading-relaxed">
            भारतीय अदालती फैसलों की त्वरित, प्रामाणिक एवं पारदर्शी समीक्षा
          </p>
          <p className="text-[15px] sm:text-[16px] text-muted max-w-[700px] mx-auto leading-relaxed">
            NyayaLens reads multi-page Indian court orders, verifies key facts with verbatim yellow highlighter evidence, bridges old IPC/CrPC laws with modern BNS/BNSS codes, and provides dedicated workspaces for registry staff, advocates, and common citizens.
          </p>
        </div>

        {/* Quick Hero Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#workspaces"
            className="min-h-[44px] px-6 rounded-control bg-action hover:bg-action-hover text-white text-[14px] font-medium inline-flex items-center justify-center gap-2 transition-colors"
          >
            <span>Enter Workspace Gateway</span>
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </a>

          <Link
            href="/about"
            className="min-h-[44px] px-5 rounded-control border border-border bg-surface text-text hover:bg-page transition-colors text-[14px] font-medium inline-flex items-center justify-center"
          >
            About NyayaLens
          </Link>
        </div>
      </section>

      {/* 2. CENTRAL PORTAL GATEWAY SECTION: "Login as..." in the middle of website */}
      <section id="workspaces" className="space-y-6 pt-4 scroll-mt-24">
        <div className="text-center space-y-2">
          <div className="text-[12px] font-semibold text-action uppercase tracking-widest">
            Dedicated Role Portals &bull; कार्यक्षेत्र प्रवेश
          </div>
          <h2 className="text-[26px] sm:text-[32px] font-serif font-semibold text-text">
            Choose your official workspace to begin
          </h2>
          <p className="text-[15px] text-muted max-w-[620px] mx-auto">
            To prevent clutter and maintain strict confidentiality, NyayaLens isolates features by role. Sign in as your designated persona below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Court Clerk */}
          <div className="bg-surface border border-border rounded-surface p-6 flex flex-col justify-between space-y-5 hover:border-action transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-action uppercase tracking-wider bg-page px-2.5 py-1 rounded border border-border">
                  <Building2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Bench &amp; Registry</span>
                </span>
                <span className="text-[11px] text-muted">Desk 01</span>
              </div>

              <div>
                <h3 className="text-[20px] font-serif font-semibold text-text">
                  Court Clerk
                </h3>
                <div className="text-[13px] font-hindi text-muted">
                  न्यायालय लिपिक / खंडपीठ स्टाफ
                </div>
              </div>

              <p className="text-[14px] text-muted leading-relaxed">
                Automated daily cause list docketing, memo of parties audit, filing defect checklists, and BNS dual-regime transition flags.
              </p>

              <ul className="text-[13px] text-text space-y-1.5 pt-2 border-t border-border/60">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-action" />
                  <span>Cause list entry generator (copy ready)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-action" />
                  <span>Party memo defect validation</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-action" />
                  <span>Substantive vs Procedural law flags</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleRoleSelect('clerk')}
              className="w-full min-h-[44px] px-4 rounded-control bg-action hover:bg-action-hover text-white text-[14px] font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Login as Court Clerk</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Card 2: Advocate / Young Lawyer */}
          <div className="bg-surface border border-border rounded-surface p-6 flex flex-col justify-between space-y-5 hover:border-action transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-action uppercase tracking-wider bg-page px-2.5 py-1 rounded border border-border">
                  <BookOpen className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Litigation &amp; Research</span>
                </span>
                <span className="text-[11px] text-muted">Desk 02</span>
              </div>

              <div>
                <h3 className="text-[20px] font-serif font-semibold text-text">
                  Advocate &amp; Student
                </h3>
                <div className="text-[13px] font-hindi text-muted">
                  अधिवक्ता / विधि शोधार्थी
                </div>
              </div>

              <p className="text-[14px] text-muted leading-relaxed">
                Ratio decidendi extraction, IPC ↔ BNS statutory comparison matrix, precedent tracking (*Bhajan Lal*, *Antil*), and courtroom case briefs.
              </p>

              <ul className="text-[13px] text-text space-y-1.5 pt-2 border-t border-border/60">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-action" />
                  <span>Statutory transition comparison (IPC to BNS)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-action" />
                  <span>Judicial precedents &amp; ratio tracker</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-action" />
                  <span>Downloadable courtroom research brief</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleRoleSelect('lawyer')}
              className="w-full min-h-[44px] px-4 rounded-control bg-action hover:bg-action-hover text-white text-[14px] font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Login as Advocate</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Card 3: Citizen / Litigant */}
          <div className="bg-surface border border-border rounded-surface p-6 flex flex-col justify-between space-y-5 hover:border-verified transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-verified uppercase tracking-wider bg-page px-2.5 py-1 rounded border border-border">
                  <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Public Legal Access</span>
                </span>
                <span className="text-[11px] text-muted">Desk 03</span>
              </div>

              <div>
                <h3 className="text-[20px] font-serif font-semibold text-text">
                  Citizen &amp; Litigant
                </h3>
                <div className="text-[13px] font-hindi text-muted">
                  नागरिक / वादकारी
                </div>
              </div>

              <p className="text-[14px] text-muted leading-relaxed">
                Plain English and सरल हिन्दी order explanations, "What this decision means for you", action step checklist, and legal jargon decoder.
              </p>

              <ul className="text-[13px] text-text space-y-1.5 pt-2 border-t border-border/60">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-verified" />
                  <span>Zero-jargon English &amp; सरल हिन्दी switch</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-verified" />
                  <span>Next legal steps &amp; bond checklist</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-verified" />
                  <span>Interactive legal terminology glossary</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleRoleSelect('citizen')}
              className="w-full min-h-[44px] px-4 rounded-control bg-verified hover:bg-emerald-800 text-white text-[14px] font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Login as Citizen</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </section>

      {/* 3. The Problem & The Solution */}
      <section className="bg-surface border border-border rounded-surface p-6 sm:p-10 space-y-8">
        <div className="max-w-[700px] space-y-2">
          <div className="text-[12px] font-semibold text-action uppercase tracking-widest">
            The Indian Judicial Context
          </div>
          <h2 className="text-[24px] sm:text-[30px] font-serif font-semibold text-text">
            Why reviewing court documents is a massive bottleneck
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h3 className="text-[16px] font-semibold text-text flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-page border border-border text-[12px] flex items-center justify-center font-bold">1</span>
              <span>The Problem in Practice</span>
            </h3>
            <p className="text-[14px] text-muted leading-relaxed">
              Every day, courts across India produce thousands of pages of judgments written in dense, archaic legal English. Court clerks, junior advocates, and everyday citizens spend countless hours manually reading 30-to-100 page PDF files simply to identify the basic nature of the case, determine whether bail was granted, or trace which sections were invoked.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-[16px] font-semibold text-text flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-page border border-border text-[12px] flex items-center justify-center font-bold">2</span>
              <span>The NyayaLens Solution</span>
            </h3>
            <p className="text-[14px] text-muted leading-relaxed">
              NyayaLens provides instantaneous document comprehension. When an Indian judgment PDF is uploaded, the platform instantly identifies the case type, extracts parties and bench members, maps cited acts, and flags the final operative outcome—with every single fact backed by yellow highlighter evidence on its exact source page.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Core Technological Features */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-[12px] font-semibold text-action uppercase tracking-widest">
            Architecture Pillars
          </div>
          <h2 className="text-[24px] sm:text-[30px] font-serif font-semibold text-text">
            Built for integrity, accuracy, and legal compliance
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-control border border-border bg-surface space-y-2.5">
            <div className="w-9 h-9 rounded-control border border-border bg-page flex items-center justify-center text-action">
              <Scale className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-text text-[15px]">100% Verbatim Proof</h3>
            <p className="text-[13px] text-muted leading-relaxed">
              Zero hallucinations. Every extracted party, section, and outcome is verified against source page text using fuzzy alignment.
            </p>
          </div>

          <div className="p-5 rounded-control border border-border bg-surface space-y-2.5">
            <div className="w-9 h-9 rounded-control border border-border bg-page flex items-center justify-center text-action">
              <Sparkles className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-text text-[15px]">Yellow Highlighter</h3>
            <p className="text-[13px] text-muted leading-relaxed">
              Clicking any fact jumps directly to that page in the original judgment and highlights the exact sentence in bright yellow.
            </p>
          </div>

          <div className="p-5 rounded-control border border-border bg-surface space-y-2.5">
            <div className="w-9 h-9 rounded-control border border-border bg-page flex items-center justify-center text-action">
              <BookOpen className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-text text-[15px]">BNS 2023 Bridge</h3>
            <p className="text-[13px] text-muted leading-relaxed">
              Automatic translation between old colonial codes (IPC 1860, CrPC 1973) and new codes (Bharatiya Nyaya Sanhita 2023).
            </p>
          </div>

          <div className="p-5 rounded-control border border-border bg-surface space-y-2.5">
            <div className="w-9 h-9 rounded-control border border-border bg-page flex items-center justify-center text-action">
              <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-text text-[15px]">Role Segregation</h3>
            <p className="text-[13px] text-muted leading-relaxed">
              Strict access controls ensure that clerks, advocates, and citizens receive only the intelligence and tools relevant to their mandate.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Pre-Seeded Landmark Samples */}
      <section className="bg-surface border border-border rounded-surface p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border pb-4">
          <div>
            <h2 className="text-[20px] font-serif font-semibold text-text">
              Try a benchmark sample judgment
            </h2>
            <p className="text-[13px] text-muted">
              Pre-loaded multi-page Indian court proceedings ready for immediate review
            </p>
          </div>

          <Link
            href="/library"
            className="text-[13px] text-action hover:text-action-hover underline font-medium"
          >
            View all in Case Library &rarr;
          </Link>
        </div>

        <div className="divide-y divide-border">
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-medium text-text text-[15px]">
                Manish Sisodia v. Central Bureau of Investigation
              </div>
              <div className="text-[13px] text-muted">
                Supreme Court of India &bull; Criminal Appeal No. 1421 of 2024 &bull; 29 Pages &bull; Bail Granted
              </div>
            </div>
            <Link
              href="/portal?sample=case01_criminal_bail"
              className="min-h-[40px] px-4 rounded-control border border-border bg-surface hover:border-action text-action text-[13px] font-medium inline-flex items-center justify-center self-start sm:self-auto"
            >
              Analyze judgment
            </Link>
          </div>

          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-medium text-text text-[15px]">
                Ramesh Chand v. State of U.P.
              </div>
              <div className="text-[13px] text-muted">
                High Court of Judicature at Allahabad &bull; Application U/S 482 No. 8921 of 2023 &bull; 15 Pages &bull; Quashing Allowed
              </div>
            </div>
            <Link
              href="/portal?sample=case02_cheating_quashing"
              className="min-h-[40px] px-4 rounded-control border border-border bg-surface hover:border-action text-action text-[13px] font-medium inline-flex items-center justify-center self-start sm:self-auto"
            >
              Analyze judgment
            </Link>
          </div>

          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-medium text-text text-[15px]">
                Meera Sharma v. Union of India
              </div>
              <div className="text-[13px] text-muted">
                High Court of Delhi &bull; W.P.(C) 4125/2024 &bull; 14 Pages &bull; Disposed with Directions
              </div>
            </div>
            <Link
              href="/portal?sample=case03_writ_mandamus"
              className="min-h-[40px] px-4 rounded-control border border-border bg-surface hover:border-action text-action text-[13px] font-medium inline-flex items-center justify-center self-start sm:self-auto"
            >
              Analyze judgment
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Official Footer */}
      <footer className="border-t border-border pt-8 text-center sm:text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Logo size="sm" showText={true} />

          <div className="flex flex-wrap items-center justify-center gap-4 text-[13px] text-muted">
            <Link href="/" className="hover:text-action">Home</Link>
            <Link href="/about" className="hover:text-action">About</Link>
            <Link href="/features" className="hover:text-action">Features</Link>
            <Link href="/library" className="hover:text-action">Library</Link>
            <Link href="/login" className="hover:text-action">Portal Login</Link>
          </div>
        </div>

        <div className="text-[12px] text-muted space-y-1 border-t border-border/50 pt-4">
          <p>
            An official initiative aligned with the National e-Courts Mission Mode Project and the Digital India Framework.
          </p>
          <p>
            Automated summary and review intelligence are generated to assist legal research and registry workflows. Not formal legal advice. Check original court records.
          </p>
          <p className="text-[11px] text-muted/80">
            e-Courts Helpdesk Toll-Free: 1800-11-4000 &bull; Ministry of Law and Justice, Government of India.
          </p>
        </div>
      </footer>
    </div>
  );
}
