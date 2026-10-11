'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ href, label = 'Back', className = '' }) {
  const router = useRouter();

  if (href) {
    return (
      <Link
        href={href}
        className={`min-h-[44px] px-3 rounded-control border border-border bg-surface text-text hover:bg-page transition-colors text-[13px] font-medium inline-flex items-center gap-1.5 self-start ${className}`}
      >
        <ArrowLeft className="w-4 h-4 text-muted" strokeWidth={1.5} />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={`min-h-[44px] px-3 rounded-control border border-border bg-surface text-text hover:bg-page transition-colors text-[13px] font-medium inline-flex items-center gap-1.5 self-start cursor-pointer ${className}`}
      aria-label={label}
    >
      <ArrowLeft className="w-4 h-4 text-muted" strokeWidth={1.5} />
      <span>{label}</span>
    </button>
  );
}
