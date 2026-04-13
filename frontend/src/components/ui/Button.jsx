import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  icon: Icon, 
  ...props 
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  
  return (
    <button 
      className={`${baseClass} ${variantClass} ${className}`} 
      {...props}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export default Button;
