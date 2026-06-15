import { NavLink } from 'react-router-dom';
import { Bus, PanelRightClose, PanelRightOpen, Search, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useUI } from '@/store';
import { navGroups } from '@/constants/nav';
import { Tooltip } from '@/components/ui';
import { ProfileMenu } from './ProfileMenu';

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, openPalette, mobileSidebarOpen, closeMobileSidebar } = useUI();

  return (
    <aside
      className={cn(
        'sidebar-chrome z-20 flex h-full shrink-0 flex-col text-white shadow-sidebar transition-[transform,width] duration-300',
        // Mobile (< lg): off-canvas drawer pinned to the inline-start edge (right in RTL).
        // Scoped to max-lg so desktop has NO transform and stays a static in-flow column.
        'max-lg:fixed max-lg:inset-y-0 max-lg:start-0 max-lg:z-50',
        mobileSidebarOpen ? 'max-lg:translate-x-0' : 'max-lg:rtl:translate-x-full max-lg:ltr:-translate-x-full',
        sidebarCollapsed ? 'w-[4.25rem]' : 'w-sidebar',
      )}
    >
      {/* Brand */}
      <div className={cn('flex h-14 items-center gap-2.5 px-3', sidebarCollapsed && 'justify-center')}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-600 shadow-soft">
          <Bus className="h-5 w-5 text-white" />
        </span>
        {!sidebarCollapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-md font-bold leading-tight">שיקום 360</p>
            <p className="truncate text-2xs text-brand-200">ניהול הסעות וסידור</p>
          </div>
        )}
        {/* Desktop collapse toggle (only when expanded) */}
        {!sidebarCollapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="כיווץ תפריט"
            className="hidden rounded-md p-1.5 text-brand-200 transition-colors hover:bg-white/10 hover:text-white lg:inline-flex"
          >
            <PanelRightClose className="h-4 w-4" />
          </button>
        )}
        {/* Mobile close */}
        <button
          type="button"
          onClick={closeMobileSidebar}
          aria-label="סגירת תפריט"
          className="rounded-md p-1.5 text-brand-200 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Collapsed: centered expand toggle (desktop only) */}
      {sidebarCollapsed && (
        <div className="hidden justify-center pb-1 lg:flex">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="הרחבת תפריט"
            className="rounded-md p-1.5 text-brand-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            <PanelRightOpen className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Quick search */}
      <div className="px-3 pb-2">
        <button
          type="button"
          onClick={openPalette}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 text-brand-200 transition-colors hover:bg-white/10',
            sidebarCollapsed ? 'h-9 justify-center' : 'h-9 px-2.5',
          )}
        >
          <Search className="h-4 w-4 shrink-0" />
          {!sidebarCollapsed && (
            <>
              <span className="flex-1 text-start text-sm">חיפוש מהיר…</span>
              <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-2xs text-white/80">⌘K</kbd>
            </>
          )}
        </button>
      </div>

      {/* Navigation — active item is a full-width lighter-violet band (matches colors.png). */}
      <nav className="flex-1 space-y-4 overflow-y-auto py-2 no-scrollbar">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && !sidebarCollapsed && (
              <p className="px-4 pb-1 pt-1 text-2xs font-semibold uppercase tracking-wide text-brand-300">{group.label}</p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const link = (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'glass-shine relative flex w-full items-center gap-2.5 py-2 text-sm transition-colors',
                        sidebarCollapsed ? 'justify-center px-3' : 'px-4',
                        isActive
                          ? 'bg-[#49377F] font-semibold text-white before:absolute before:inset-y-0 before:start-0 before:w-1 before:bg-primary-400'
                          : 'font-medium text-brand-100 hover:bg-[#49377F]/60 hover:text-white',
                      )
                    }
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0" />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                );
                return (
                  <li key={item.to}>
                    {sidebarCollapsed ? (
                      <Tooltip label={item.label} side="bottom" className="w-full">
                        {link}
                      </Tooltip>
                    ) : (
                      link
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-white/10 p-2.5">
        {sidebarCollapsed ? (
          <div className="flex justify-center">
            <ProfileMenu variant="avatar" showLabel={false} />
          </div>
        ) : (
          <ProfileMenu variant="card" />
        )}
      </div>
    </aside>
  );
}
