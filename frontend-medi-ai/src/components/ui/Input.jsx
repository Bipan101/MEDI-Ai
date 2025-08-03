import React from 'react';
import { cn } from '../../utils/cn';

export const Input = ({
  className,
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseStyles = 'block px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const normalStyles = 'border-gray-300 focus:ring-primary-500 focus:border-primary-500';
  const errorStyles = 'border-red-300 focus:ring-red-500 focus:border-red-500';
  
  return (
    <div className={cn('space-y-2', fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-sm">{leftIcon}</span>
          </div>
        )}
        
        <input
          id={inputId}
          className={cn(
            baseStyles,
            error ? errorStyles : normalStyles,
            leftIcon && 'pl-12',
            rightIcon && 'pr-12',
            fullWidth && 'w-full',
            className
          )}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className="text-gray-500 text-sm">{rightIcon}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};