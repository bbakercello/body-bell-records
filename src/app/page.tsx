// src/app/page.tsx
"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import NavBar from "../components/NavBar";
import Logo from "../components/Logo";

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => {
    const delay = 1 + i * 0.5;
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
        opacity: { delay, duration: 0.01 },
      },
    };
  },
};

const Home: React.FC = () => {
  const title = "BODY BELL RECORDS";

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow bg-stone-300 p-8 flex flex-col items-center">
        {/* Logo */}
        <Logo />

        {/* Enhanced Title Section */}
        <div className="relative mt-4 flex space-x-1"> {/* Added space between letters */}
          {title.split("").map((letter, index) => (
            <motion.span
              key={index}
              className="text-5xl font-extrabold text-sky-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              style={{
                display: "inline-block",
                transform: `rotate(${-2 + index * 0.3}deg) translateY(${index % 2 === 0 ? -3 : 0}px)`,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Optional underline below logo */}
        <motion.svg
          width="600"
          height="10"
          viewBox="0 0 600 10"
          initial="hidden"
          animate="visible"
          className="mt-4"
        >
          <motion.line
            x1="100"
            y1="0"
            x2="500"
            y2="0"
            stroke="#148cfc"
            variants={draw}
            custom={2}
          />
        </motion.svg>
      </main>
    </div>
  );
};

export default Home;
