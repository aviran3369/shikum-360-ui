import { type ReactNode, useRef } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useDisclosure } from '@/hooks';
import { Popover } from './Popover';

export interface SelectOption<T extends string | number> {
  value: T;
  label: string;
  icon?: ReactNode;
}

export interface SelectProps<T extends string | number> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  startIcon?: ReactNode;
  sizeVariant?: 'sm' | 'md';
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
}

/** Custom styled select (button + portal popover) — matches the mockup chevron dropdowns. */
export function Select<T extends string | number>({
  value,
  options,
  onChange,
  placeholder = 'בחר…',
  startIcon,
  sizeVariant = 'sm',
  invalid,
  disabled,
  className,
}: SelectProps<T>) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const { isOpen, toggle, close } = useDisclosure();
  const selected = options.find((o) => o.value === value);
  const h = sizeVariant === 'md' ? 'h-9' : 'h-8';

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        disabled={disabled}
        onClick={toggle}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-md border bg-white px-3 text-sm transition-colors focus:outline-none focus:ring-2',
          h,
          invalid
            ? 'border-red-400 focus:ring-red-500/30'
            : 'border-slate-300 hover:border-slate-400 focus:border-primary-500 focus:ring-primary-500/25',
          disabled && 'cursor-not-allowed bg-slate-50',
          className,
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {startIcon && <span className="text-slate-400">{startIcon}</span>}
          {selected?.icon}
          <span className={cn('truncate', selected ? 'text-slate-800' : 'text-slate-400')}>
            {selected ? selected.label : placeholder}
          </span>
        </span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-slate-400 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <Popover anchorRef={anchorRef} open={isOpen} onClose={close} align="start" matchAnchorWidth>
        <ul className="max-h-64 overflow-auto py-1" role="listbox">
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <li key={String(opt.value)}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(opt.value);
                    close();
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 px-3 py-1.5 text-start text-sm transition-colors hover:bg-slate-50',
                    active && 'bg-primary-50 text-primary-700',
                  )}
                >
                  <span className="flex items-center gap-2">
                    {opt.icon}
                    {opt.label}
                  </span>
                  {active && <Check className="h-3.5 w-3.5 text-primary-600" />}
                </button>
              </li>
            );
          })}
        </ul>
      </Popover>
    </>
  );
}
