import React from 'react';

export const Button = ({ children, variant = 'primary', onClick, className = '', ...props }) => {
  return (
    <button 
      className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-outline'} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};