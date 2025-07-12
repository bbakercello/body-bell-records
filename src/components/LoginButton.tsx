'use client';

import { useAuth } from '@/hooks/use-auth';
import { motion } from 'framer-motion';

export function LoginButton() {
  const { user, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-sm font-medium text-sky-800">...</span>
      </motion.div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-sm font-medium text-sky-800">{user.email}</span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={() => logout()}
            className="text-sm font-medium text-sky-800 hover:text-[#c72310]"
          >
            Logout
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <button
        onClick={() => login()}
        className="text-sm font-medium text-sky-800 hover:text-[#e0ad6e]"
      >
        Login
      </button>
    </motion.div>
  );
} 