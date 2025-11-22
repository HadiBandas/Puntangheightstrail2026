
import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false }) => {
  const hoverProps = hoverable ? { whileHover: { y: -8, scale: 1.02 } } : {};

  return (
    <motion.div
      className={`bg-white p-8 rounded-2xl shadow-lg ${className}`}
      {...hoverProps}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default Card;
