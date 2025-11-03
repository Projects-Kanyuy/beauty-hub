// src/components/Button.js
import React from 'react';

const Button = ({ children, variant = 'primary', type = 'button', onClick, className = '' }) => {
  // Base styles shared by all buttons
  const baseStyles = "px-6 py-3 rounded-lg font-heading font-semibold text-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105";

  // Styles specific to each variant
  const variantStyles = {
    primary: "bg-primary text-secondary hover:bg-primary-dark focus:ring-primary",
   secondary: "bg-transparent text-primary-purple border-2 border-primary-purple hover:bg-primary-purple hover:text-white focus:ring-primary-purple",
    // NEW GRADIENT VARIANT
    gradient: "text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:ring-pink-500",
     danger: "bg-transparent text-red-600 border-2 border-red-300 hover:bg-red-600 hover:text-white focus:ring-red-500",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      // Combine base styles, variant styles, and any extra classes passed in via props
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;