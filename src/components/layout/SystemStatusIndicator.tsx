import { useRef } from 'react';
import { cn } from '@/lib/cn';
import { SystemStatusLevel } from '@/types/enums';
import { systemStatusMeta, toneDotClasses } from '@/lib/statusMaps';
import { StatusDot, Popover } from '@/components/ui';
import { useDisclosure } from '@/hooks';

const components: { name: string; level: SystemStatusLevel; detail: string }[] = [
  { name: 'שרת API', level: SystemStatusLevel.Operational, detail: 'זמן תגובה 82ms' },
  { name: 'בסיס נתונים', level: SystemStatusLevel.Operational, detail: 'תקין' },
  { name: 'סנכרון בזמן אמת', level: SystemStatusLevel.Operational, detail: 'מחובר' },
  { name: 'מנוע דוחות', level: SystemStatusLevel.Degraded, detail: 'עומס גבוה — עיכוב בהפקה' },
  { name: 'שירות SMS', level: SystemStatusLevel.Operational, detail: 'תקין' },
];

export function SystemStatusIndicator() {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const { isOpen, toggle, close } = useDisclosure();
  const overall = components.reduce<SystemStatusLevel>((max, c) => Math.max(max, c.level), SystemStatusLevel.Operational);
  const meta = systemStatusMeta[overall];

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={toggle}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100"
      >
        <StatusDot tone={meta.tone} pulse={overall === SystemStatusLevel.Operational} />
        <span className="hidden lg:inline">{meta.label}</span>
      </button>

      <Popover anchorRef={anchorRef} open={isOpen} onClose={close} align="end" width={264}>
        <div className="border-b border-slate-100 px-3 py-2.5">
          <p className="text-sm font-semibold text-slate-800">סטטוס מערכת</p>
          <p className="text-xs text-slate-400">עודכן לפני דקה</p>
        </div>
        <ul className="py-1">
          {components.map((c) => (
            <li key={c.name} className="flex items-center justify-between gap-3 px-3 py-1.5">
              <div className="min-w-0">
                <p className="truncate text-sm text-slate-700">{c.name}</p>
                <p className="truncate text-2xs text-slate-400">{c.detail}</p>
              </div>
              <span className={cn('h-2 w-2 shrink-0 rounded-full', toneDotClasses[systemStatusMeta[c.level].tone])} />
            </li>
          ))}
        </ul>
      </Popover>
    </>
  );
}
