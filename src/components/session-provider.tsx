'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { SessionUser } from '@/lib/auth';

type SessionState = {
  user: SessionUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const SessionContext = createContext<SessionState>({
  user: null,
  loading: true,
  refresh: async () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SessionContext.Provider value={{ user, loading, refresh }}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
