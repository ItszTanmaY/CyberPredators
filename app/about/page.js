'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Scale, Building2, BookOpen, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import BackButton from '../../components/BackButton';
import Logo from '../../components/Logo';

export default function AboutPage() {
  return (
    <div className="space-y-10 max-w-[900px] mx-auto py-2">
      {/* Back Button */}
      <BackButton href="/" label="Back to Home" />

      {/* Header Banner */}
      <div className="bg-surface border border-border rounded-surface p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <Logo size="lg" showText={false} href="/" />
          <div className="space-y-0.5">
            <div className="text-[12px] font-semibold text-action uppercase tracking-widest">
              National Judicial Review &amp; Document Organization Project
            </div>
            <h1 className="text-[26px] sm:text-[32px] font-serif font-semibold text-text">
              About NyayaLens
            </h1>
            <p className="text-[14px] text-muted">
              न्याय समीक्षा पोर्टल &bull; Institutional Overview &amp; Technological Framework
            </p>
          </div>
        </div>
      </div>

      {/* The Core Mission */}
      <div className="bg-surface border border-border rounded-surface p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="text-[12px] font-semibold text-action uppercase tracking-wider">
            Our Purpose &bull; उद्देश्य
          </div>
          <h2 className="text-[22px] font-serif font-semibold text-text">
            Eliminating the manual review bottleneck in Indian justice delivery
          </h2>
          <p className="text-[15px] text-muted leading-relaxed">
            Every morning across the Supreme Court of India, 25 High Courts, and over 3,000 District Courts, judges deliver hundreds of verdicts. These decisions are published in voluminous PDF documents filled with complex legal jargon, Latin terms (such as <em>coram</em>, <em>mandamus</em>, <em>quashing</em>, <em>suo motu</em>), and intricate sentence structures inherited from centuries of common law tradition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[14px]">
          <div className="p-4 rounded-control border border-border bg-page space-y-2">
            <div className="font-semibold text-text">The Challenge of Volume &amp; Speed</div>
            <p className="text-muted leading-relaxed">
              Court clerks must prepare cause lists under intense deadline pressure. Young advocates must review hundreds of precedent pages before morning hearings. Citizens must decipher orders affecting their personal liberty or property rights.
            </p>
          </div>

          <div className="p-4 rounded-control border border-border bg-page space-y-2">
            <div className="font-semibold text-text">The AI Hallucination Risk</div>
            <p className="text-muted leading-relaxed">
              Standard commercial AI models frequently hallucinate fake case citations and misinterpret legal outcomes. In the judicial domain, an inaccurate summary or fabricated statute citation can lead to grave injustice.
            </p>
          </div>
        </div>
      </div>

      {/* How NyayaLens Solves It */}
      <div className="bg-surface border border-border rounded-surface p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="text-[12px] font-semibold text-action uppercase tracking-wider">
            Technological Architecture &bull; तकनीकी विशेषताएँ
          </div>
          <h2 className="text-[22px] font-serif font-semibold text-text">
            Four Pillars of Absolute Judicial Integrity
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3.5 pb-4 border-b border-border/60">
            <div className="w-8 h-8 rounded-full border border-action bg-page text-action flex items-center justify-center font-bold text-[13px] flex-shrink-0 mt-0.5">
              1
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-text text-[15px]">Verbatim Hallucination Guard</h3>
              <p className="text-[14px] text-muted leading-relaxed">
                NyayaLens employs strict verbatim string alignment. Every extracted petitioner, respondent, judge name, and statute citation is verified against the original text. Facts that cannot be matched word-for-word are explicitly flagged with amber <em>Check source</em> chips.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 pb-4 border-b border-border/60">
            <div className="w-8 h-8 rounded-full border border-action bg-page text-action flex items-center justify-center font-bold text-[13px] flex-shrink-0 mt-0.5">
              2
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-text text-[15px]">The Yellow Highlighter Principle</h3>
              <p className="text-[14px] text-muted leading-relaxed">
                Trust requires transparency. Clicking any fact on the Case Sheet immediately navigates the reader to its exact page in the document and highlights the verbatim evidence phrase in yellow (<code>#FFE58A</code>).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 pb-4 border-b border-border/60">
            <div className="w-8 h-8 rounded-full border border-action bg-page text-action flex items-center justify-center font-bold text-[13px] flex-shrink-0 mt-0.5">
              3
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-text text-[15px]">Bharatiya Nyaya Sanhita (BNS 2023) Bridge</h3>
              <p className="text-[14px] text-muted leading-relaxed">
                Following India's transition to new criminal laws on 1 July 2024, NyayaLens automatically cross-references historical IPC and CrPC citations with their modern equivalents under the BNS 2023 and BNSS 2023.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full border border-action bg-page text-action flex items-center justify-center font-bold text-[13px] flex-shrink-0 mt-0.5">
              4
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-text text-[15px]">Strict Role-Based Confidentiality</h3>
              <p className="text-[14px] text-muted leading-relaxed">
                To prevent accidental misuse and ensure clean workflows, NyayaLens strictly isolates tools: clerks see registry cause lists; advocates see ratio decidendi and precedent analyses; citizens see plain English and सरल हिन्दी summaries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ready to Experience Section */}
      <div className="bg-surface border border-border rounded-surface p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-[18px] font-serif font-semibold text-text">
            Ready to review a judgment?
          </h2>
          <p className="text-[14px] text-muted">
            Access your designated workspace or explore sample judgments.
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
