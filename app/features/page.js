'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  BookOpen,
  Users,
  Search,
  CheckCircle2,
  FileCheck,
  Scale,
  ArrowRight,
  ShieldCheck,
  BookmarkCheck
} from 'lucide-react';
import BackButton from '../../components/BackButton';
import Logo from '../../components/Logo';

export default function FeaturesPage() {
  return (
    <div className="space-y-10 max-w-[900px] mx-auto py-2">
      {/* Back Navigation */}
      <BackButton href="/" label="Back to Home" />

      {/* Header Banner */}
      <div className="bg-surface border border-border rounded-surface p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <Logo size="lg" showText={false} href="/" />
          <div className="space-y-0.5">
            <div className="text-[12px] font-semibold text-action uppercase tracking-widest">
              Capabilities &bull; विशेषताएँ एवं सेवाएँ
            </div>
            <h1 className="text-[26px] sm:text-[32px] font-serif font-semibold text-text">
              NyayaLens Feature Matrix
            </h1>
            <p className="text-[14px] text-muted">
              Role-tailored intelligence designed for every stakeholder in the Indian legal system.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Court Clerk Features */}
      <div className="bg-surface border border-border rounded-surface p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 pb-2 border-b border-border">
          <Building2 className="w-6 h-6 text-action" strokeWidth={1.5} />
          <div>
            <h2 className="text-[20px] font-serif font-semibold text-text">
              1. Court &amp; Bench Clerk Features
            </h2>
            <div className="text-[12px] font-hindi text-muted">न्यायालय लिपिक एवं खंडपीठ सेवाएँ</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
          <div className="p-4 rounded-control border border-border bg-page space-y-2">
            <div className="font-semibold text-text">Cause List Docket Generator</div>
            <p className="text-muted leading-relaxed text-[13px]">
              Automatically structures judgment data into standard e-Courts cause list entries with Item No., Case No., Parties, Coram, and Operative Orders for instant registry filing.
            </p>
          </div>

          <div className="p-4 rounded-control border border-border bg-page space-y-2">
            <div className="font-semibold text-text">Party Memo Defect Auditing</div>
            <p className="text-muted leading-relaxed text-[13px]">
              Verifies memo of parties against the cause title on page 1, flagging missing respondents, spelling discrepancies, or unverified intervenors.
            </p>
          </div>

          <div className="p-4 rounded-control border border-border bg-page space-y-2">
            <div className="font-semibold text-text">BNS &amp; BNSS Transition Flags</div>
            <p className="text-muted leading-relaxed text-[13px]">
              Automatically checks the date of offence vs 1 July 2024 to flag whether substantive law remains IPC 1860 while procedural trial steps follow BNSS 2023.
            </p>
          </div>

          <div className="p-4 rounded-control border border-border bg-page space-y-2">
            <div className="font-semibold text-text">Caveat &amp; Delay Verification</div>
            <p className="text-muted leading-relaxed text-[13px]">
              Checks the record for caveats, statutory filing timeframes, and limitation delay applications.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Advocate & Student Features */}
      <div className="bg-surface border border-border rounded-surface p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 pb-2 border-b border-border">
          <BookOpen className="w-6 h-6 text-action" strokeWidth={1.5} />
          <div>
            <h2 className="text-[20px] font-serif font-semibold text-text">
              2. Advocate &amp; Law Student Features
            </h2>
            <div className="text-[12px] font-hindi text-muted">अधिवक्ता एवं विधि शोधार्थी सेवाएँ</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
          <div className="p-4 rounded-control border border-border bg-page space-y-2">
            <div className="font-semibold text-text">Ratio Decidendi Extraction</div>
            <p className="text-muted leading-relaxed text-[13px]">
              Isolates the core judicial reasoning and binding legal principle laid down by the court, distinguishing it from obiter dicta.
            </p>
          </div>

          <div className="p-4 rounded-control border border-border bg-page space-y-2">
            <div className="font-semibold text-text">Statutory Transition Matrix</div>
            <p className="text-muted leading-relaxed text-[13px]">
              Side-by-side comparison table matching cited sections (IPC 420, CrPC 439) with their corresponding new provisions under BNS 2023 and BNSS 2023.
            </p>
          </div>

          <div className="p-4 rounded-control border border-border bg-page space-y-2">
            <div className="font-semibold text-text">Precedent Tracker &amp; Citations</div>
            <p className="text-muted leading-relaxed text-[13px]">
              Extracts landmark authorities cited by counsel (e.g., <em>Bhajan Lal</em>, <em>Satender Kumar Antil</em>, <em>Najeeb</em>) with how the Bench applied or distinguished them.
            </p>
          </div>

          <div className="p-4 rounded-control border border-border bg-page space-y-2">
            <div className="font-semibold text-text">Courtroom Case Brief Generator</div>
            <p className="text-muted leading-relaxed text-[13px]">
              One-click compilation of facts, legal questions, and final ratio into a standard Indian advocate case brief ready for morning hearings.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Citizen & Litigant Features */}
      <div className="bg-surface border border-border rounded-surface p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 pb-2 border-b border-border">
          <Users className="w-6 h-6 text-verified" strokeWidth={1.5} />
          <div>
            <h2 className="text-[20px] font-serif font-semibold text-text">
              3. Citizen &amp; Litigant Public Access
            </h2>
            <div className="text-[12px] font-hindi text-muted">नागरिक एवं वादकारी जन सेवाएँ</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
          <div className="p-4 rounded-control border border-border bg-page space-y-2">
            <div className="font-semibold text-text">Plain English &amp; सरल हिन्दी Summary</div>
            <p className="text-muted leading-relaxed text-[13px]">
              Translates dense orders into 3 straightforward bullet points explaining what happened without confusing legal jargon.
            </p>
          </div>

          <div className="p-4 rounded-control border border-border bg-page space-y-2">
            <div className="font-semibold text-text">Litigant Next Steps Checklist</div>
            <p className="text-muted leading-relaxed text-[13px]">
              Clear step-by-step guidance on what to do next: obtaining certified copies, preparing personal bonds, finding sureties, or depositing passports.
            </p>
          </div>

          <div className="p-4 rounded-control border border-border bg-page space-y-2">
            <div className="font-semibold text-text">Legal Jargon Decoder (शब्दावली)</div>
            <p className="text-muted leading-relaxed text-[13px]">
              Everyday explanations of legal terms like <em>Bail</em>, <em>Surety</em>, <em>Mandamus</em>, <em>Article 21</em>, and <em>Operative Order</em>.
            </p>
          </div>

          <div className="p-4 rounded-control border border-border bg-page space-y-2">
            <div className="font-semibold text-text">Print &amp; Share Ready Sheets</div>
            <p className="text-muted leading-relaxed text-[13px]">
              Clean, printer-friendly summary layout suitable for sharing with family, advocates, or local legal aid clinics.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-surface border border-border rounded-surface p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-[18px] font-serif font-semibold text-text">
            Start using NyayaLens
          </h2>
          <p className="text-[14px] text-muted">
            Choose your designated role to enter the secure portal.
          </p>
        </div>

        <Link
          href="/portal"
          className="min-h-[44px] px-5 rounded-control bg-action hover:bg-action-hover text-white text-[14px] font-medium inline-flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
        >
          <span>Open Portal Gateway</span>
          <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}
