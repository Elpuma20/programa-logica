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
      <div style={{ position: 'relative' }}>
        <input 
          id={inputId}
          className={`input-field ${className}`} 
          style={{ paddingRight: props.type === 'password' || props.type === 'text' ? '3rem' : '' }}
          {...props} 
        />
        {props.rightElement && (
          <div style={{ 
            position: 'absolute', 
            right: '0.75rem', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            display: 'flex', 
            alignItems: 'center',
            zIndex: 10
          }}>
            {props.rightElement}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
