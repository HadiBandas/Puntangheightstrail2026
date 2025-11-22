
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ children, className = '', icon }) => {
  return (
    <div className={`flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-sm font-medium ${className}`}>
      {icon}
      <span>{children}</span>
    </div>
  );
};

export default Badge;
