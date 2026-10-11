'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, UserCheck, BookOpen, Users, ArrowRight, RefreshCw, Lock, Building2 } from 'lucide-react';
import { useAuth, ROLE_DETAILS } from '../../context/AuthContext';
import BackButton from '../../components/BackButton';
import Logo from '../../components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState('quick'); // 'quick' | 'portal'
  const [selectedRole, setSelectedRole] = useState('clerk');
  const [identifier, setIdentifier] = useState('DEL-HC-CLK-4109');
  const [password, setPassword] = useState('••••••••••••');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('7K9P2');
  const [captchaError, setCaptchaError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
    setCaptchaError(false);
  };

  const handleQuickLogin = (roleKey) => {
    setIsLoading(true);
    setTimeout(() => {
      login(roleKey);
      router.push('/portal');
    }, 200);
  };

  const handlePortalSubmit = (e) => {
    e.preventDefault();
    if (captchaInput.toUpperCase() !== captchaCode) {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);
    setIsLoading(true);
    setTimeout(() => {
      login(selectedRole, {
        idNumber: identifier,
        name: selectedRole === 'clerk' ? 'Bench Officer' : selectedRole === 'lawyer' ? 'Adv. ' + identifier : 'Verified Citizen',
      });
      router.push('/portal');
    }, 300);
  };

  return (
    <div className="space-y-6 max-w-[960px] mx-auto py-2">
      {/* Back to Home Button */}
      <BackButton href="/" label="Back to Home" />

      {/* Official Government / Ministry Notice Header */}
      <div className="bg-surface border border-border rounded-surface p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-control border border-border bg-page flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-action" strokeWidth={1.5} />
          </div>
          <div className="space-y-0.5">
            <div className="text-[12px] font-semibold text-muted uppercase tracking-wider">
              भारत सरकार &bull; विधि एवं न्याय मंत्रालय | Government of India
            </div>
            <div className="text-[16px] font-serif font-semibold text-text">
              e-Courts Judicial Document Review &amp; Intelligence Gateway
            </div>
            <div className="text-[13px] text-muted">
              National Judicial Data Grid (NJDG) Standard Architecture &bull; ISO 27001 Certified Access
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 h-[28px] px-2.5 rounded-chip border border-verified text-verified bg-surface text-[12px] font-medium">
            <ShieldCheck className="w-4 h-4 text-verified" strokeWidth={1.5} />
            <span>Official Portal</span>
          </span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="bg-surface border border-border rounded-surface overflow-hidden">
        {/* Navigation Tabs between Quick Role Access & Official Portal SSO */}
        <div className="border-b border-border bg-page flex items-center">
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`min-h-[48px] px-5 text-[14px] font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'quick'
                ? 'border-action text-action bg-surface'
                : 'border-transparent text-muted hover:text-text'
            }`}
          >
            <UserCheck className="w-4 h-4" strokeWidth={1.5} />
            <span>Role-Based Direct Access (त्वरित भूमिका प्रवेश)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('portal')}
            className={`min-h-[48px] px-5 text-[14px] font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'portal'
                ? 'border-action text-action bg-surface'
                : 'border-transparent text-muted hover:text-text'
            }`}
          >
            <Lock className="w-4 h-4" strokeWidth={1.5} />
            <span>e-Courts Bar &amp; Registry Sign-In (आधिकारिक पोर्टल)</span>
          </button>
        </div>

        {/* Tab 1: Quick Role Selection Cards */}
        {activeTab === 'quick' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-[20px] font-serif font-semibold text-text">
                Select your functional workspace
              </h2>
              <p className="text-[14px] text-muted">
                Each workspace provides dedicated toolsets designed specifically for registry staff, advocates, and common citizens.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Court Clerk Card */}
              <div className="border border-border rounded-control p-5 bg-surface hover:border-action transition-colors flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-action uppercase tracking-wide bg-page px-2 py-0.5 rounded border border-border">
                      Bench &amp; Registry
                    </span>
                    <Building2 className="w-4 h-4 text-muted" strokeWidth={1.5} />
                  </div>

                  <div>
                    <h3 className="text-[17px] font-semibold text-text">
                      Court Clerk
                    </h3>
                    <div className="text-[13px] font-hindi text-muted">
                      न्यायालय लिपिक / खंडपीठ स्टाफ
                    </div>
                  </div>

                  <p className="text-[13px] text-muted leading-relaxed">
                    Automated cause list entries, party memo defect audits, filing category tagging, and BNS transition alerts.
                  </p>

                  <div className="text-[12px] text-muted border-t border-border/60 pt-2 space-y-0.5">
                    <div><strong>Default Officer:</strong> Rajesh Verma</div>
                    <div><strong>Court:</strong> High Court of Delhi</div>
                    <div><strong>ID:</strong> DEL-HC-CLK-4109</div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickLogin('clerk')}
                  className="w-full min-h-[44px] px-4 rounded-control bg-action hover:bg-action-hover text-white text-[13px] font-medium inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Enter Clerk Workspace</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>

              {/* 2. Advocate / Young Lawyer Card */}
              <div className="border border-border rounded-control p-5 bg-surface hover:border-action transition-colors flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-action uppercase tracking-wide bg-page px-2 py-0.5 rounded border border-border">
                      Litigation &amp; Research
                    </span>
                    <BookOpen className="w-4 h-4 text-muted" strokeWidth={1.5} />
                  </div>

                  <div>
                    <h3 className="text-[17px] font-semibold text-text">
                      Lawyer &amp; Student
                    </h3>
                    <div className="text-[13px] font-hindi text-muted">
                      अधिवक्ता / विधि शोधार्थी
                    </div>
                  </div>

                  <p className="text-[13px] text-muted leading-relaxed">
                    Ratio decidendi extraction, IPC ↔ BNS cross-mapping, precedent tracking (Bhajan Lal, Antil), and brief generator.
                  </p>

                  <div className="text-[12px] text-muted border-t border-border/60 pt-2 space-y-0.5">
                    <div><strong>Default Counsel:</strong> Adv. Ananya Iyer</div>
                    <div><strong>Bar Council:</strong> Delhi (D/1482/2021)</div>
                    <div><strong>Practice:</strong> Appellate Criminal / Writ</div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickLogin('lawyer')}
                  className="w-full min-h-[44px] px-4 rounded-control bg-action hover:bg-action-hover text-white text-[13px] font-medium inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Enter Advocate Workspace</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>

              {/* 3. Citizen / Litigant Card */}
              <div className="border border-border rounded-control p-5 bg-surface hover:border-action transition-colors flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-verified uppercase tracking-wide bg-page px-2 py-0.5 rounded border border-border">
                      Public Access Portal
                    </span>
                    <Users className="w-4 h-4 text-muted" strokeWidth={1.5} />
                  </div>

                  <div>
                    <h3 className="text-[17px] font-semibold text-text">
                      Everyday Citizen
                    </h3>
                    <div className="text-[13px] font-hindi text-muted">
                      नागरिक / वादकारी
                    </div>
                  </div>

                  <p className="text-[13px] text-muted leading-relaxed">
                    Plain English &amp; सरल हिन्दी explanations, "What this means for you", bail bond checklist, and legal jargon dictionary.
                  </p>

                  <div className="text-[12px] text-muted border-t border-border/60 pt-2 space-y-0.5">
                    <div><strong>Default Litigant:</strong> Sunita Devi</div>
                    <div><strong>Verification:</strong> Aadhaar VID Verified</div>
                    <div><strong>Assistance:</strong> Bilingual Legal Support</div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickLogin('citizen')}
                  className="w-full min-h-[44px] px-4 rounded-control bg-action hover:bg-action-hover text-white text-[13px] font-medium inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Enter Citizen Portal</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Standard Official Portal Login Form */}
        {activeTab === 'portal' && (
          <form onSubmit={handlePortalSubmit} className="p-6 sm:p-8 space-y-6 max-w-[560px] mx-auto">
            <div className="space-y-1">
              <h2 className="text-[20px] font-serif font-semibold text-text">
                e-Courts Single Sign-On (SSO)
              </h2>
              <p className="text-[14px] text-muted">
                Sign in with your Bar Council registration, registry employee credentials, or citizen mobile number.
              </p>
            </div>

            {/* Role Radio Picker */}
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-text block">
                Select access category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'clerk', label: 'Court Clerk' },
                  { key: 'lawyer', label: 'Advocate' },
                  { key: 'citizen', label: 'Citizen' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setSelectedRole(item.key);
                      if (item.key === 'clerk') setIdentifier('DEL-HC-CLK-4109');
                      else if (item.key === 'lawyer') setIdentifier('D/1482/2021');
                      else setIdentifier('9876543210');
                    }}
                    className={`min-h-[44px] px-3 rounded-control text-[13px] font-medium border text-center transition-colors ${
                      selectedRole === item.key
                        ? 'border-action bg-surface text-action'
                        : 'border-border bg-page text-muted hover:text-text'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Identifier Input */}
            <div className="space-y-1.5">
              <label htmlFor="identifier-input" className="text-[13px] font-semibold text-text block">
                {selectedRole === 'clerk'
                  ? 'Registry Employee ID'
                  : selectedRole === 'lawyer'
                  ? 'Bar Council Enrolment No.'
                  : 'Mobile Number or Aadhaar VID'}
              </label>
              <input
                id="identifier-input"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-control border border-border bg-surface text-text text-[14px] focus:outline-none focus:ring-2 focus:ring-action"
              />
            </div>

            {/* Password / Pin */}
            <div className="space-y-1.5">
              <label htmlFor="password-input" className="text-[13px] font-semibold text-text block">
                Password or Digital Token PIN
              </label>
              <input
                id="password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-control border border-border bg-surface text-text text-[14px] focus:outline-none focus:ring-2 focus:ring-action"
              />
            </div>

            {/* Captcha Verification */}
            <div className="space-y-1.5">
              <label htmlFor="captcha-input" className="text-[13px] font-semibold text-text block">
                Security verification code (Captcha)
              </label>
              <div className="flex items-center gap-3">
                <div className="h-[44px] px-4 rounded-control border border-border bg-page text-action font-mono text-[18px] font-bold tracking-widest flex items-center select-none line-through">
                  {captchaCode}
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="min-h-[44px] min-w-[44px] rounded-control border border-border bg-surface text-muted hover:text-text flex items-center justify-center"
                  aria-label="Refresh captcha"
                  title="Generate new code"
                >
                  <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <input
                  id="captcha-input"
                  type="text"
                  placeholder="Enter code"
                  required
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="flex-1 min-h-[44px] px-3.5 rounded-control border border-border bg-surface text-text text-[14px] uppercase focus:outline-none focus:ring-2 focus:ring-action"
                />
              </div>
              {captchaError && (
                <p className="text-[12px] text-error font-medium pt-1">
                  Security code does not match. Please enter the characters shown.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[44px] px-5 rounded-control bg-action hover:bg-action-hover text-white text-[14px] font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
              <span>Verify &amp; Enter Portal</span>
            </button>

            {/* Legal Notice */}
            <p className="text-[12px] text-muted text-center pt-2 leading-relaxed">
              Authorized access only under Section 43 of Information Technology Act, 2000. All activities are cryptographically audited.
            </p>
          </form>
        )}
      </div>

      {/* Official Footer Notice */}
      <div className="text-center text-[13px] text-muted space-y-1 pt-2">
        <div>
          An e-Courts Digital Mission Initiative &bull; Government of India
        </div>
        <div>
          Need technical assistance? e-Courts Helpdesk Toll-Free: 1800-11-4000
        </div>
      </div>
    </div>
  );
}
