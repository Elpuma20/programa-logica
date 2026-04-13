import React from 'react';

const Input = ({ label, id, className = '', ...props }) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <input 
        id={inputId}
        className={`input-field ${className}`} 
        {...props} 
      />
    </div>
  );
};

export default Input;
