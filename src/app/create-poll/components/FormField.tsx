'use client';

import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, required = false, error, children, className = '' }: FormFieldProps) {
  return (
    <div className={`form-control ${className}`}>
      <label className="label py-1">
        <span className="label-text font-semibold text-base">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </span>
      </label>
      {children}
      {error && (
        <label className="label">
          <span className="label-text-alt text-error font-medium">{error}</span>
        </label>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error = false, className = '', ...props }: InputProps) {
  return (
    <input
      className={`input input-bordered w-full text-base py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
        error 
          ? 'border-error bg-error/5 focus:ring-error/20 focus:border-error' 
          : 'border-base-300 bg-base-100 hover:border-base-content/20'
      } ${className}`}
      {...props}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error = false, className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`textarea textarea-bordered w-full text-base py-3 px-4 rounded-lg resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
        error 
          ? 'border-error bg-error/5 focus:ring-error/20 focus:border-error' 
          : 'border-base-300 bg-base-100 hover:border-base-content/20'
      } ${className}`}
      {...props}
    />
  );
}
