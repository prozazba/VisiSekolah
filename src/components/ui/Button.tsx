import React from 'react';
import styles from '../../styles/Button.module.scss';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

export const Button = ({ 
  variant = 'primary', 
  size = 'medium', 
  className, 
  children, 
  ...props 
}: ButtonProps) => {
  return (
    <button 
      className={cn(
        styles.button, 
        styles[variant], 
        styles[size === 'medium' ? '' : size], 
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
