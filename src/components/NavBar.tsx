// src/components/NavBar.tsx
import { FC } from "react";
import Link from "next/link";

const NavBar: FC = () => {
  return (
    <nav className="flex justify-between items-center w-full p-4 bg-gray-800 text-white">
      <Link href="/" className="text-lg font-semibold">
        MyApp
      </Link>
      <div className="flex space-x-4">
        <Link href="/about" className="hover:underline">
          About
        </Link>
        <Link href="/contact" className="hover:underline">
          Contact
        </Link>
        <Link href="/services" className="hover:underline">
          Services
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
