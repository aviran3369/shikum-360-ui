import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

const sizes = { xs: 'h-3 w-3', sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-7 w-7' } as const;

export function Spinner({ size = 'sm', className }: { size?: keyof typeof sizes; className?: string }) {
  return <Loader2 className={cn('animate-spin text-current', sizes[size], className)} aria-hidden />;
}
