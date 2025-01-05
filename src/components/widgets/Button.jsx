'use client';
import React from 'react';

const Button = ({ children, onClick, value }) => {
  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      onClick={() => onClick(value)}
    >
      {children}
    </button>
  );
};

export default Button;
