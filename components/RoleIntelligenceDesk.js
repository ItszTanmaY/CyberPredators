'use client';

import React from 'react';
import { Building2, BookOpen, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ClerkWorkspace from './ClerkWorkspace';
import LawyerWorkspace from './LawyerWorkspace';
import CitizenWorkspace from './CitizenWorkspace';

export default function RoleIntelligenceDesk({ record, documentPages = [] }) {
  const { role, switchRole } = useAuth();
  const currentRole = role || 'clerk';

  if (!record) return null;

  return (
    <div className="space-y-4">
      {/* Role Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface border border-border rounded-surface p-2 sm:p-2.5">
        <div className="flex items-center gap-2 pl-2">
          <span className="text-[12px] font-semibold text-muted uppercase tracking-wide">
            Role Workspace:
          </span>
        </div>

        <div className="inline-flex rounded-control border border-border p-1 bg-page flex-wrap sm:flex-nowrap gap-1">
          <button
            type="button"
            onClick={() => switchRole('clerk')}
            className={`min-h-[38px] px-3.5 rounded-[5px] text-[13px] font-medium transition-colors flex items-center gap-2 flex-1 sm:flex-initial justify-center ${
              currentRole === 'clerk'
                ? 'bg-surface text-action border border-border shadow-xs'
                : 'text-muted hover:text-text'
            }`}
          >
            <Building2 className="w-4 h-4 text-action" strokeWidth={1.5} />
            <span>Court Clerk (लिपिक)</span>
          </button>

          <button
            type="button"
            onClick={() => switchRole('lawyer')}
            className={`min-h-[38px] px-3.5 rounded-[5px] text-[13px] font-medium transition-colors flex items-center gap-2 flex-1 sm:flex-initial justify-center ${
              currentRole === 'lawyer'
                ? 'bg-surface text-action border border-border shadow-xs'
                : 'text-muted hover:text-text'
            }`}
          >
            <BookOpen className="w-4 h-4 text-action" strokeWidth={1.5} />
            <span>Advocate &amp; Student (अधिवक्ता)</span>
          </button>

          <button
            type="button"
            onClick={() => switchRole('citizen')}
            className={`min-h-[38px] px-3.5 rounded-[5px] text-[13px] font-medium transition-colors flex items-center gap-2 flex-1 sm:flex-initial justify-center ${
              currentRole === 'citizen'
                ? 'bg-surface text-verified border border-border shadow-xs'
                : 'text-muted hover:text-text'
            }`}
          >
            <Users className="w-4 h-4 text-verified" strokeWidth={1.5} />
            <span>Citizen (नागरिक)</span>
          </button>
        </div>
      </div>

      {/* Render the Active Role Module */}
      {currentRole === 'clerk' && (
        <ClerkWorkspace record={record} documentPages={documentPages} />
      )}
      {currentRole === 'lawyer' && (
        <LawyerWorkspace record={record} documentPages={documentPages} />
      )}
      {currentRole === 'citizen' && (
        <CitizenWorkspace record={record} documentPages={documentPages} />
      )}
    </div>
  );
}
