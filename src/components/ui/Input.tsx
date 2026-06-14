import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export function Field({
  label,
  error,
  hint,
  required,
  htmlFor,
  className,
  children,
}: {
  label?: ReactNode;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label htmlFor={htmlFor} className="block text-xs font-medium text-slate-600">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  sizeVariant?: 'sm' | 'md';
}

const baseField =
  'w-full rounded-md border bg-white text-slate-800 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50';

function stateClasses(invalid?: boolean) {
  return invalid
    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/30'
    : 'border-slate-300 hover:border-slate-400 focus:border-primary-500 focus:ring-primary-500/25';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, startIcon, endIcon, sizeVariant = 'sm', className, ...props },
  ref,
) {
  const h = sizeVariant === 'md' ? 'h-9' : 'h-8';
  return (
    <div className="relative">
      {startIcon && (
        <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2.5 text-slate-400">
          {startIcon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          baseField,
          stateClasses(invalid),
          h,
          'text-sm',
          startIcon ? 'ps-8' : 'ps-3',
          endIcon ? 'pe-8' : 'pe-3',
          className,
        )}
        {...props}
      />
      {endIcon && (
        <span className="absolute inset-y-0 end-0 flex items-center pe-2.5 text-slate-400">{endIcon}</span>
      )}
    </div>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, rows = 3, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(baseField, stateClasses(invalid), 'px-3 py-2 text-sm leading-relaxed', className)}
      {...props}
    />
  );
});
