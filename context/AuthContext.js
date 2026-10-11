'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  user: null,
  role: null, // 'clerk' | 'lawyer' | 'citizen' | null
  isLoaded: false,
  login: () => {},
  logout: () => {},
});

export const ROLE_DETAILS = {
  clerk: {
    key: 'clerk',
    label: 'Court Clerk',
    hindiLabel: 'न्यायालय लिपिक / खंडपीठ स्टाफ',
    badge: 'Bench & Registry Desk',
    defaultName: 'Rajesh Verma',
    designation: 'Bench Clerk, Court No. 4',
    idNumber: 'DEL-HC-CLK-4109',
    court: 'High Court of Delhi',
    focus: 'Cause list generation, party memo audit, filing defect checks, and BNS transition flags.',
    welcomeMessage: 'Authorized Registry Officer Access &bull; High Court of Delhi',
  },
  lawyer: {
    key: 'lawyer',
    label: 'Advocate / Law Student',
    hindiLabel: 'अधिवक्ता / विधि शोधार्थी',
    badge: 'Litigation & Research Desk',
    defaultName: 'Adv. Ananya Iyer',
    designation: 'Advocate on Record / Legal Researcher',
    idNumber: 'D/1482/2021 (Bar Council of Delhi)',
    court: 'Supreme Court & High Court of Delhi',
    focus: 'Ratio decidendi extraction, IPC ↔ BNS cross-mapping, precedent tracking, and case brief drafting.',
    welcomeMessage: 'Enrolled Advocate & Researcher Workspace &bull; Bar Council of India',
  },
  citizen: {
    key: 'citizen',
    label: 'Citizen / Litigant',
    hindiLabel: 'नागरिक / पक्षकार',
    badge: 'Public Legal Access Portal',
    defaultName: 'Sunita Devi',
    designation: 'Litigant / Common Citizen',
    idNumber: 'Aadhaar Verified (VID: XXXX-8912)',
    court: 'Public Access',
    focus: 'Plain English & सरल हिन्दी order explanations, next action steps, and legal jargon translations.',
    welcomeMessage: 'National Public Legal Literacy Gateway &bull; Citizen Access',
  },
};

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Restore stored session from localStorage or ?as_role query param on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const queryRole = params.get('as_role');
        if (queryRole && ROLE_DETAILS[queryRole]) {
          const roleInfo = ROLE_DETAILS[queryRole];
          const authData = {
            name: roleInfo.defaultName,
            designation: roleInfo.designation,
            idNumber: roleInfo.idNumber,
            court: roleInfo.court,
            role: queryRole,
            isAuthenticated: true,
            lastLogin: new Date().toISOString(),
          };
          setRole(queryRole);
          setUser(authData);
          localStorage.setItem('nyayalens_auth', JSON.stringify(authData));
          setIsLoaded(true);
          return;
        }
      }

      const stored = localStorage.getItem('nyayalens_auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.role && ROLE_DETAILS[parsed.role]) {
          setRole(parsed.role);
          setUser(parsed);
        }
      }
    } catch (e) {
      console.warn('Auth restoration error:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const login = (newRole, customData = {}) => {
    const roleInfo = ROLE_DETAILS[newRole] || ROLE_DETAILS.clerk;
    const authData = {
      name: customData.name || roleInfo.defaultName,
      designation: customData.designation || roleInfo.designation,
      idNumber: customData.idNumber || roleInfo.idNumber,
      court: customData.court || roleInfo.court,
      role: newRole,
      isAuthenticated: true,
      lastLogin: new Date().toISOString(),
    };
    setRole(newRole);
    setUser(authData);
    try {
      localStorage.setItem('nyayalens_auth', JSON.stringify(authData));
    } catch (e) {
      console.warn('Auth save error:', e);
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    try {
      localStorage.removeItem('nyayalens_auth');
    } catch (e) {
      console.warn('Auth clear error:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoaded, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
