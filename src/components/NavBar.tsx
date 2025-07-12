// src/components/NavBar.tsx
import { FC } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LoginButton } from './LoginButton';
import { AdminButton } from './AdminButton';

const NavBar: FC = () => {
  return (
    <nav className="relative flex justify-center items-center w-full p-6 bg-stone-200 text-[#212121] shadow-md">
      <div className="flex space-x-20">
        {/* MUSIC Link */}
        <motion.div
          whileHover={{ scale: 1.1, color: "#244747" }} // Slightly more saturated 'sky'
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/music" className="text-5xl font-extrabold text-sky-800 hover:text-[#e0ad6e]">
            MUSIC
          </Link>
        </motion.div>

        {/* STORE Link */}
        <motion.div
          whileHover={{ scale: 1.1, color: "#244747" }} // Slightly more saturated 'sky'
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/store" className="text-5xl font-extrabold text-sky-800 hover:text-[#c72310]">
            STORE
          </Link>
        </motion.div>
      </div>

      <div className="absolute right-6 flex items-center">
        <AdminButton />
        <LoginButton />
      </div>
    </nav>
  );
};

export default NavBar;
