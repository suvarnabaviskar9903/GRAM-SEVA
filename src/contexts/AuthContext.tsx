import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_PROFILES } from '../data/seedData';
import type { Profile, UserRole } from '../types';

interface RegisterInput {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  villageName: string;
  wardNumber: number;
}

interface AuthContextValue {
  user: Profile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { ok: boolean; user?: Profile; error?: string };
  loginAsRole: (role: UserRole) => Profile;
  registerCitizen: (data: RegisterInput) => { ok: boolean; user?: Profile; error?: string };
  updateCurrentUser: (patch: Partial<Profile>) => void;
  logout: () => void;
}

const SESSION_KEY = 'gram_seva_session_user_id';
const PROFILES_KEY = 'gram_seva_profiles_v1';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadStoredProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_PROFILES;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(() => {
    try {
      const savedId = localStorage.getItem(SESSION_KEY);
      if (!savedId) return null;
      const profiles = loadStoredProfiles();
      return profiles.find((p) => p.id === savedId) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(SESSION_KEY, user.id);
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // ignore
    }
  }, [user]);

  const login = (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password.trim()) {
      return { ok: false, error: 'Email and password are required.' };
    }
    const profiles = loadStoredProfiles();
    const matched = profiles.find((p) => p.email.toLowerCase() === normalizedEmail);
    if (!matched) {
      return { ok: false, error: 'Invalid credentials' };
    }
    if (!matched.isActive) {
      return { ok: false, error: 'Account is inactive. Contact Gram Panchayat Admin.' };
    }
    setUser(matched);
    return { ok: true, user: matched };
  };

  const loginAsRole = (role: UserRole): Profile => {
    const profiles = loadStoredProfiles();
    const matched =
      profiles.find((p) => p.role === role && p.isActive) ||
      INITIAL_PROFILES.find((p) => p.role === role)!;
    setUser(matched);
    return matched;
  };

  const registerCitizen = (data: RegisterInput) => {
    const profiles = loadStoredProfiles();
    const exists = profiles.some(
      (p) => p.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (exists) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    // Public registration strictly creates Citizen accounts only
    const newProfile: Profile = {
      id: `usr-citizen-${Date.now()}`,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      mobile: data.mobile.trim(),
      role: 'citizen',
      villageName: data.villageName.trim() || 'Shrirampur',
      wardNumber: Number(data.wardNumber) || 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    const nextProfiles = [...profiles, newProfile];
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(nextProfiles));
    } catch {
      // ignore
    }
    setUser(newProfile);
    return { ok: true, user: newProfile };
  };

  const updateCurrentUser = (patch: Partial<Profile>) => {
    if (!user) return;
    const updated: Profile = { ...user, ...patch, role: user.role };
    setUser(updated);
    const profiles = loadStoredProfiles();
    const nextProfiles = profiles.map((p) => (p.id === user.id ? updated : p));
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(nextProfiles));
    } catch {
      // ignore
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        loginAsRole,
        registerCitizen,
        updateCurrentUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
