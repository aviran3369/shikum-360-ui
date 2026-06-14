import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Portal } from './Portal';
import { IconButton } from './Button';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Physical edge to dock against. In this RTL app, content panels open from the left. */
  side?: 'left' | 'right';
  width?: string;
  footer?: ReactNode;
  children: ReactNode;
  headerActions?: ReactNode;
}

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  side = 'left',
  width = 'w-[22rem]',
  footer,
  children,
  headerActions,
}: DrawerProps) {
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
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 animate-fade-in bg-slate-900/40 backdrop-blur-[1px]" onClick={onClose} />
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            'absolute top-0 flex h-full flex-col border-slate-200 bg-white shadow-panel',
            width,
            side === 'left' ? 'left-0 animate-drawer-left border-e' : 'right-0 animate-drawer-right border-s',
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <div className="min-w-0">
              {title && <h2 className="truncate text-md font-semibold text-slate-800">{title}</h2>}
              {subtitle && <p className="truncate text-xs text-slate-500">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-1">
              {headerActions}
              <IconButton label="סגירה" size="sm" variant="ghost" onClick={onClose}>
                <X className="h-4 w-4" />
              </IconButton>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
          {footer && <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3">{footer}</div>}
        </div>
      </div>
    </Portal>
  );
}
