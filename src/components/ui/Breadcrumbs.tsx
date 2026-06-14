import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface Crumb {
  label: string;
  href?: string;
}

/** RTL breadcrumb trail; the separator chevron points to the inline-end (left). */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="breadcrumb" className={cn('flex items-center gap-1.5 text-xs text-slate-500', className)}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={`${item.label}-${i}`}>
            {item.href && !last ? (
              <Link to={item.href} className="transition-colors hover:text-primary-700">
                {item.label}
              </Link>
            ) : (
              <span className={cn(last && 'font-medium text-slate-700')} aria-current={last ? 'page' : undefined}>
                {item.label}
              </span>
            )}
            {!last && <ChevronLeft className="h-3.5 w-3.5 text-slate-300" />}
          </Fragment>
        );
      })}
    </nav>
  );
}
