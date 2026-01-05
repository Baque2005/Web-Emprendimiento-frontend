import React from 'react';

export const Input = ({ label, placeholder, type = 'text', value, onChange, className = '' }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
    />
  </div>
);
