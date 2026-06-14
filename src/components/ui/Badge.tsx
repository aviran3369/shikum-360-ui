import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { type BadgeTone, badgeToneClasses, toneDotClasses } from '@/lib/statusMaps';

export interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

/** Compact pill used for statuses, sources, roles — colors map to enum metadata. */
export function Badge({ tone = 'slate', children, dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        badgeToneClasses[tone],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', toneDotClasses[tone])} />}
      {children}
    </span>
  );
}

/** Standalone status dot (e.g. system health, availability). */
export function StatusDot({ tone, pulse = false, className }: { tone: BadgeTone; pulse?: boolean; className?: string }) {
  return (
    <span className={cn('relative inline-flex h-2 w-2', className)}>
      {pulse && (
        <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', toneDotClasses[tone])} />
      )}
      <span className={cn('relative inline-flex h-2 w-2 rounded-full', toneDotClasses[tone])} />
    </span>
  );
}

/** Numeric count badge (notifications, selection counts). */
export function CountBadge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <span
      className={cn(
        'inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-600 px-1 text-2xs font-semibold text-white',
        className,
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
