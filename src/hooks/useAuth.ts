'use client';

import { useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  picture?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Authentication check failed'));
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  return { user, loading, error };
} 