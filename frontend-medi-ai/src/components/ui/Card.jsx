import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({
  className,
  variant = 'default',
  padding = 'md',
  clickable = false,
  children,
  ...props
}) => {
  const baseStyles = 'bg-white rounded-xl border transition-colors';
  
  const variants = {
    default: 'shadow-soft border-gray-100',
    medical: 'shadow-medical border-primary-100',
    elevated: 'shadow-lg border-gray-200',
    outlined: 'shadow-sm border-gray-300',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const clickableStyles = clickable ? 'cursor-pointer hover:shadow-lg hover:border-primary-200' : '';

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        clickableStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  className,
  title,
  subtitle,
  action,
  children,
  ...props
}) => {
  return (
    <div className={cn('flex items-start justify-between mb-4', className)} {...props}>
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {action && (
        <div className="flex-shrink-0 ml-4">
          {action}
        </div>
      )}
    </div>
  );
};

export const CardContent = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('text-gray-600', className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-100', className)} {...props}>
      {children}
    </div>
  );
};