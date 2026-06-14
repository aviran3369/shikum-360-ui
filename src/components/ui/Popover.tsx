import { type CSSProperties, type ReactNode, type RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { Portal } from './Portal';

export interface PopoverProps {
  anchorRef: RefObject<HTMLElement>;
  open: boolean;
  onClose: () => void;
  /** Inline alignment relative to the anchor (RTL-aware: start = right). */
  align?: 'start' | 'end' | 'center';
  /** Vertical side to open toward. 'top' anchors the panel above the trigger. */
  placement?: 'top' | 'bottom';
  width?: number;
  matchAnchorWidth?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Floating panel rendered in a portal with fixed positioning, so it never clips
 * inside scrolling tables. Closes on outside click (ignoring the anchor) and Escape.
 */
export function Popover({
  anchorRef,
  open,
  onClose,
  align = 'start',
  placement = 'bottom',
  width,
  matchAnchorWidth = false,
  className,
  children,
}: PopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({ visibility: 'hidden' });

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    const update = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const r = anchor.getBoundingClientRect();
      const w = matchAnchorWidth ? r.width : (width ?? Math.max(r.width, 220));
      const isRtl = document.documentElement.dir === 'rtl';
      let left: number;
      if (align === 'center') left = r.left + r.width / 2 - w / 2;
      else if (align === 'start') left = isRtl ? r.right - w : r.left;
      else left = isRtl ? r.left : r.right - w;
      left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
      if (placement === 'top') {
        // Anchor the panel's bottom just above the trigger so it grows upward.
        const bottom = Math.max(8, window.innerHeight - r.top + 6);
        setStyle({ position: 'fixed', bottom, left, width: w, zIndex: 60 });
      } else {
        const top = Math.min(r.bottom + 6, window.innerHeight - 16);
        setStyle({ position: 'fixed', top, left, width: w, zIndex: 60 });
      }
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchorRef, align, placement, width, matchAnchorWidth]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;
  return (
    <Portal>
      <div
        ref={panelRef}
        style={style}
        role="dialog"
        className={cn(
          'rounded-lg border border-slate-200 bg-white text-slate-700 shadow-popover',
          placement === 'top' ? 'animate-fade-in' : 'animate-slide-down',
          className,
        )}
      >
        {children}
      </div>
    </Portal>
  );
}
