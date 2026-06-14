import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Portal } from './Portal';
import { IconButton } from './Button';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  size?: ModalSize;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  footer,
  children,
  className,
  bodyClassName,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6">
        <div className="fixed inset-0 animate-fade-in bg-slate-900/40 backdrop-blur-[1px]" onClick={onClose} />
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            'relative z-10 my-6 w-full animate-scale-in rounded-xl border border-slate-200 bg-white shadow-panel',
            sizeClasses[size],
            className,
          )}
        >
          {(title || description) && (
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-3.5">
              <div className="min-w-0">
                {title && <h2 className="text-lg font-semibold text-slate-800">{title}</h2>}
                {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
              </div>
              <IconButton label="סגירה" size="sm" variant="ghost" onClick={onClose} className="-me-1.5">
                <X className="h-4 w-4" />
              </IconButton>
            </div>
          )}
          <div className={cn('px-5 py-4', bodyClassName)}>{children}</div>
          {footer && (
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
}
