import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  sizeVariant?: 'sm' | 'md';
  className?: string;
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { value, onChange, placeholder = 'חיפוש…', sizeVariant = 'sm', className, onClear },
  ref,
) {
  const h = sizeVariant === 'md' ? 'h-9' : 'h-8';
  return (
    <div className={cn('relative', className)}>
      <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2.5 text-slate-400">
        <Search className="h-4 w-4" />
      </span>
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-md border border-slate-300 bg-white ps-8 pe-8 text-sm text-slate-800 placeholder:text-slate-400 transition-colors hover:border-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25',
          h,
          '[&::-webkit-search-cancel-button]:appearance-none',
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          aria-label="ניקוי חיפוש"
          className="absolute inset-y-0 end-0 flex items-center pe-2.5 text-slate-400 transition-colors hover:text-slate-600"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
});
