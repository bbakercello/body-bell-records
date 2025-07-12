'use client';

import { useState, useEffect } from 'react';

interface User {
  email: string;
  name?: string;
  picture?: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

// Cache user info for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;
let userCache: { user: User; timestamp: number } | null = null;

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check cache first
      if (userCache && Date.now() - userCache.timestamp < CACHE_DURATION) {
        setState({ user: userCache.user, isLoading: false, error: null });
        return;
      }

      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const user = await response.json();
        // Check if user's email is in the admin list
        const adminResponse = await fetch('/api/auth/is-admin');
        if (adminResponse.ok) {
          const { isAdmin } = await adminResponse.json();
          user.isAdmin = isAdmin;
        }
        // Update cache
        userCache = { user, timestamp: Date.now() };
        setState({ user, isLoading: false, error: null });
      } else {
        setState({ user: null, isLoading: false, error: null });
        userCache = null;
      }
    } catch (error) {
      setState({ user: null, isLoading: false, error: error as Error });
      userCache = null;
    }
  };

  const login = () => {
    window.location.href = '/api/auth/auth0?action=login';
  };

  const logout = () => {
    userCache = null;
    window.location.href = '/api/auth/auth0?action=logout';
  };

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
  };
} 