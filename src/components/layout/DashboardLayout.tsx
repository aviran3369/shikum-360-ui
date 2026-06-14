import { Outlet } from 'react-router-dom';
import { useDisclosure, useHotkey } from '@/hooks';
import { useUI } from '@/store';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from './CommandPalette';
import { NotificationsPanel } from './NotificationsPanel';
import { ActivityFeedPanel } from './ActivityFeedPanel';

export function DashboardLayout() {
  const notifications = useDisclosure();
  const activity = useDisclosure();
  const { openPalette } = useUI();

  useHotkey('mod+k', (e) => {
    e.preventDefault();
    openPalette();
  });

  return (
    <div className="flex h-screen overflow-hidden bg-surface-page">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenNotifications={notifications.open} onOpenActivity={activity.open} />
        <main className="relative flex-1 overflow-y-auto">
          {/* Periwinkle decorative banner behind every page (400px, fades into the page bg). */}
          <div className="top-bg-banner pointer-events-none absolute inset-x-0 top-0 h-[400px]" aria-hidden />
          <div className="relative">
            <Outlet />
          </div>
        </main>
      </div>

      <CommandPalette />
      <NotificationsPanel open={notifications.isOpen} onClose={notifications.close} />
      <ActivityFeedPanel open={activity.isOpen} onClose={activity.close} />
    </div>
  );
}
