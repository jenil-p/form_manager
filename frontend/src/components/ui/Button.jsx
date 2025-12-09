import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', disabled, ...props }) => {
  return (
    <button 
      className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-outline'} ${className}`}
      disabled={disabled}
      style={disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
      {...props}
    >
      {children}
    </button>
  );
};