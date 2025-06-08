'use client';

import { useAuth } from '@/hooks/use-auth';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function AdminButton() {
  const { user, isLoading } = useAuth();

  // Don't show anything while loading or if user is not an admin
  if (isLoading || !user?.isAdmin) {
    return null;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="mr-4"
    >
      <Link 
        href="/admin" 
        className="text-sm font-medium text-sky-800 hover:text-[#e0ad6e]"
      >
        Admin
      </Link>
    </motion.div>
  );
} 