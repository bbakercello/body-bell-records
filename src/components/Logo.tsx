// src/components/Logo.tsx
import React from 'react';

const Logo: React.FC = () => {
  return (
    <span className="p-5 flex justify-center">
      <img
        className="w-1/3 md:w-80 rounded-full drop-shadow-lg mt-6"
        src="https://i.imgur.com/hdOhoXL.jpg"
        alt="Logo"
      />
    </span>
  );
};

export default Logo;
