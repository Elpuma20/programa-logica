import React from 'react';

const Card = ({ children, className = '', animate = true, ...props }) => {
  return (
    <div 
      className={`glass-card ${animate ? 'fade-in' : ''} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
