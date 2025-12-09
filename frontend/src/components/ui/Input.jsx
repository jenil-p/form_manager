import React from 'react';

export const Input = ({ label, type = 'text', placeholder, value, onChange, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block text-sm font-medium mb-1 text-gray-700">{label}</label>}
      <input 
        type={type} 
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};