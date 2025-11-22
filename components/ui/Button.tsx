
import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  as?: 'button' | 'a';
  href?: string;
  tabIndex?: number;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon,
  onClick,
  as = 'button',
  href,
  ...rest
}) => {
  const baseClasses = 'group relative font-poppins font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-trail-orange text-white hover:bg-trail-orange/90 hover:shadow-2xl hover:shadow-trail-orange/50',
    secondary: 'bg-mountain-slate text-white hover:bg-mountain-slate/90',
    outline: 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-mountain-slate',
  };

  const sizeClasses = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-4 text-lg',
    lg: 'px-10 py-5 text-xl',
  };

  const motionProps = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { type: "spring" as const, stiffness: 400, damping: 17 }
  };

  const commonProps = {
      className: `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`,
      ...rest
  };

  const content = (
    <>
      {children}
      {icon && (
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </>
  );

  if (as === 'a') {
    return (
      <motion.a href={href} onClick={onClick} {...commonProps} {...motionProps}>
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button onClick={onClick} {...commonProps} {...motionProps}>
      {content}
    </motion.button>
  );
};

export default Button;