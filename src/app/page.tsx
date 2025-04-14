import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Menu() {
  return (
    <div className="menuContainer flex flex-col justify-center items-center h-screen">
      <h1 className="mb-4 header-text">High Frequency Language Training</h1>
      <p className="text-centre long-text mb-8">
        The most direct way to start learning a new language.
      </p>
      <div className="w-[300px] flex justify-between">
        <Link
          href="/vocabulary/"
          className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
        >
          Vocabulary
        </Link>
        <Link
          href="/statistics/"
          className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
        >
          Statistics
        </Link>
      </div>
    </div>
  );
}
