// src/components/Footer.tsx
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  return (
    <div className="bg-neutral-300 h-16 justify-items-center rounded-lg">
      <ul className="flex justify-around pt-4 text-md">
        <li>
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
            <Link href="https://www.instagram.com/bodybellrecords/" className="flex justify-center">
              Instagram
            </Link>
          </motion.div>
        </li>
        <li>
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
            <Link href="/info">
              Learn More
            </Link>
          </motion.div>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
