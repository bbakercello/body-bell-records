// src/components/Footer.tsx
import { FC } from "react";
import Image from "next/image";

const Footer: FC = () => {
  return (
    <footer className="flex flex-col items-center p-4 bg-gray-900 text-gray-400">
      <div className="flex space-x-4 mb-2">
        <a
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Learn
        </a>
        <a
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Docs
        </a>
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Vercel
        </a>
      </div>
      <p className="text-sm">© 2024 MyApp. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
