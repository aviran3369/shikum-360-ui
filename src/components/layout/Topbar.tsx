import { useLocation } from 'react-router-dom';
import { Bell, History, Menu, Search } from 'lucide-react';
import { Breadcrumbs, CountBadge, IconButton } from '@/components/ui';
import { metaForPath } from '@/constants/nav';
import { useNotifications, useUI } from '@/store';
import { SystemStatusIndicator } from './SystemStatusIndicator';
import { ProfileMenu } from './ProfileMenu';

export interface TopbarProps {
  onOpenNotifications: () => void;
  onOpenActivity: () => void;
}

export function Topbar({ onOpenNotifications, onOpenActivity }: TopbarProps) {
  const { pathname } = useLocation();
  const meta = metaForPath(pathname);
  const { unreadCount } = useNotifications();
  const { openPalette, toggleMobileSidebar } = useUI();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur">
      <IconButton label="תפריט" variant="ghost" onClick={toggleMobileSidebar} className="-ms-1.5 lg:hidden">
        <Menu className="h-5 w-5 text-slate-600" />
      </IconButton>
      <Breadcrumbs items={meta.crumbs} />

      <div className="ms-auto flex items-center gap-0.5">
        <button
          type="button"
          onClick={openPalette}
          className="me-1 hidden h-8 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-400 transition-colors hover:bg-slate-100 md:flex"
        >
          <Search className="h-3.5 w-3.5" />
          <span>חיפוש מהיר</span>
          <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 text-2xs text-slate-400">⌘K</kbd>
        </button>

        <SystemStatusIndicator />

        <IconButton label="יומן פעילות" variant="ghost" onClick={onOpenActivity}>
          <History className="h-[18px] w-[18px] text-slate-500" />
        </IconButton>

        <span className="relative inline-flex">
          <IconButton label="התראות" variant="ghost" onClick={onOpenNotifications}>
            <Bell className="h-[18px] w-[18px] text-slate-500" />
          </IconButton>
          {unreadCount > 0 && <CountBadge count={unreadCount} className="pointer-events-none absolute -end-0.5 -top-0.5" />}
        </span>

        <span className="mx-1 h-6 w-px bg-slate-200" />
        <ProfileMenu variant="avatar" />
      </div>
    </header>
  );
}
