'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Building2, BookOpen, Users, LogIn, LogOut, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth, ROLE_DETAILS } from '../context/AuthContext';
import Logo from './Logo';

export default function PortalHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-30 flex-shrink-0 bg-surface border-b border-border">
      {/* Top Government Ribbon */}
      <div className="bg-[#1B2433] text-white text-[11px] sm:text-[12px] py-1 px-4 sm:px-6 lg:px-8 border-b border-border/20">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-white/95">
              भारत सरकार | Government of India
            </span>
            <span className="hidden md:inline text-white/60">&bull;</span>
            <span className="hidden md:inline text-white/80">
              विधि एवं न्याय मंत्रालय | Ministry of Law &amp; Justice
            </span>
            <span className="hidden lg:inline text-white/60">&bull;</span>
            <span className="hidden lg:inline text-white/80">
              e-Courts Mission Mode Project
            </span>
          </div>

          <div className="flex items-center gap-3 text-white/80 flex-shrink-0">
            <span className="hidden sm:inline">National Judicial Review Gateway</span>
            <span className="inline-flex items-center gap-1 text-white/90 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-verified" strokeWidth={1.5} />
              <span>STQC Certified</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header (60px) */}
      <div className="max-w-[1200px] h-[60px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Real-World Official Logo */}
        <Logo size="md" href="/" />

        {/* Navigation & User Status */}
        <nav className="flex items-center gap-1.5 sm:gap-3">
          <Link
            href="/"
            className={`text-[13px] sm:text-[14px] font-medium px-2 min-h-[44px] flex items-center transition-colors ${
              pathname === '/' ? 'text-action font-semibold' : 'text-muted hover:text-text'
            }`}
          >
            Home
          </Link>

          <Link
            href="/about"
            className={`hidden sm:flex text-[13px] sm:text-[14px] font-medium px-2.5 min-h-[44px] items-center transition-colors ${
              pathname === '/about' ? 'text-action font-semibold' : 'text-muted hover:text-text'
            }`}
          >
            About
          </Link>

          <Link
            href="/features"
            className={`hidden md:flex text-[13px] sm:text-[14px] font-medium px-2.5 min-h-[44px] items-center transition-colors ${
              pathname === '/features' ? 'text-action font-semibold' : 'text-muted hover:text-text'
            }`}
          >
            Features
          </Link>

          <Link
            href="/library"
            className={`text-[13px] sm:text-[14px] font-medium px-2 min-h-[44px] flex items-center transition-colors ${
              pathname === '/library' ? 'text-action font-semibold' : 'text-muted hover:text-text'
            }`}
          >
            Library
          </Link>

          {/* If Logged In: Show active role workspace pill + Log Out */}
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-border">
              <Link
                href="/portal"
                className="inline-flex items-center gap-1.5 h-[36px] sm:h-[38px] px-2 sm:px-3 rounded-control border border-action bg-page text-[11px] sm:text-[12px] font-medium text-action hover:bg-surface transition-colors"
                title={`Active: ${user.name} (${ROLE_DETAILS[role]?.label})`}
              >
                {role === 'clerk' && <Building2 className="w-3.5 h-3.5 text-action" strokeWidth={1.5} />}
                {role === 'lawyer' && <BookOpen className="w-3.5 h-3.5 text-action" strokeWidth={1.5} />}
                {role === 'citizen' && <Users className="w-3.5 h-3.5 text-verified" strokeWidth={1.5} />}
                <span className="font-semibold hidden sm:inline">{ROLE_DETAILS[role]?.label}</span>
                <span className="font-semibold sm:hidden">{role === 'lawyer' ? 'Lawyer' : role === 'clerk' ? 'Clerk' : 'Citizen'}</span>
                <span className="hidden lg:inline text-muted">({user.name})</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="min-h-[36px] sm:min-h-[38px] px-2 sm:px-2.5 rounded-control border border-border bg-surface text-muted hover:text-error hover:border-error transition-colors text-[11px] sm:text-[12px] font-medium inline-flex items-center gap-1 cursor-pointer"
                title="Sign out of workspace"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          ) : (
            pathname !== '/login' && (
              <div className="pl-1">
                <Link
                  href="/login"
                  className="min-h-[40px] px-3.5 rounded-control bg-action hover:bg-action-hover text-white text-[13px] font-medium inline-flex items-center gap-1.5 transition-colors"
                >
                  <LogIn className="w-4 h-4" strokeWidth={1.5} />
                  <span>Portal Login / प्रवेश</span>
                </Link>
              </div>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
