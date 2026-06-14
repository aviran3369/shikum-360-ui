import { type ComponentType, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CornerDownLeft, FilePlus2, LogOut, Plus, Search } from 'lucide-react';
import { Portal } from '@/components/ui';
import { navGroups } from '@/constants/nav';
import { useAuth, useUI } from '@/store';
import { cn } from '@/lib/cn';

interface Command {
  id: string;
  label: string;
  hint: string;
  icon: ComponentType<{ className?: string }>;
  run: () => void;
}

export function CommandPalette() {
  const { paletteOpen, closePalette } = useUI();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const commands = useMemo<Command[]>(() => {
    const navCommands = navGroups.flatMap((g) =>
      g.items.map((item) => ({
        id: `nav:${item.to}`,
        label: item.label,
        hint: 'מעבר לעמוד',
        icon: item.icon,
        run: () => navigate(item.to),
      })),
    );
    return [
      ...navCommands,
      { id: 'act:new-trip', label: 'יצירת נסיעה חדשה', hint: 'פעולה', icon: Plus, run: () => navigate('/scheduling?new=1') },
      { id: 'act:new-referral', label: 'פתיחת הפנייה חדשה', hint: 'פעולה', icon: FilePlus2, run: () => navigate('/referrals?new=1') },
      { id: 'act:logout', label: 'התנתקות מהמערכת', hint: 'חשבון', icon: LogOut, run: () => { logout(); navigate('/login'); } },
    ];
  }, [navigate, logout]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    if (paletteOpen) {
      setQuery('');
      setActive(0);
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [paletteOpen]);

  useEffect(() => setActive(0), [query]);

  if (!paletteOpen) return null;

  const run = (cmd: Command) => {
    closePalette();
    cmd.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[active]) run(filtered[active]);
    } else if (e.key === 'Escape') {
      closePalette();
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[12vh]">
        <div className="fixed inset-0 animate-fade-in bg-slate-900/40 backdrop-blur-[1px]" onClick={closePalette} />
        <div className="relative z-10 w-full max-w-xl animate-scale-in overflow-hidden rounded-xl border border-slate-200 bg-white shadow-panel">
          <div className="flex items-center gap-2.5 border-b border-slate-100 px-4">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="חיפוש עמודים ופעולות…"
              className="h-12 flex-1 bg-transparent text-md text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-2xs text-slate-400">esc</kbd>
          </div>

          <ul className="max-h-80 overflow-auto p-2">
            {filtered.length === 0 ? (
              <li className="py-10 text-center text-sm text-slate-400">לא נמצאו תוצאות עבור "{query}"</li>
            ) : (
              filtered.map((cmd, i) => (
                <li key={cmd.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => run(cmd)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-start transition-colors',
                      i === active ? 'bg-primary-50 text-primary-700' : 'text-slate-700 hover:bg-slate-50',
                    )}
                  >
                    <cmd.icon className={cn('h-4 w-4', i === active ? 'text-primary-600' : 'text-slate-400')} />
                    <span className="flex-1 text-sm font-medium">{cmd.label}</span>
                    <span className="text-2xs text-slate-400">{cmd.hint}</span>
                    {i === active && <CornerDownLeft className="h-3.5 w-3.5 text-primary-400" />}
                  </button>
                </li>
              ))
            )}
          </ul>

          <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/60 px-4 py-2 text-2xs text-slate-400">
            <span className="flex items-center gap-1"><kbd className="rounded border border-slate-200 bg-white px-1">↑</kbd><kbd className="rounded border border-slate-200 bg-white px-1">↓</kbd> ניווט</span>
            <span className="flex items-center gap-1"><kbd className="rounded border border-slate-200 bg-white px-1">↵</kbd> בחירה</span>
          </div>
        </div>
      </div>
    </Portal>
  );
}
