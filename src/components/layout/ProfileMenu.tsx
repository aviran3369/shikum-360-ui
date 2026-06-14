import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LifeBuoy, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { Avatar, Popover } from '@/components/ui';
import { useAuth } from '@/store';
import { userRoleMeta } from '@/lib/statusMaps';
import { useDisclosure } from '@/hooks';
import { cn } from '@/lib/cn';

export function ProfileMenu({ variant = 'avatar' }: { variant?: 'avatar' | 'card' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const { isOpen, toggle, close } = useDisclosure();
  const role = userRoleMeta[user.role].label;

  const go = (to: string) => {
    close();
    navigate(to);
  };

  return (
    <>
      {variant === 'card' ? (
        <button
          ref={anchorRef}
          type="button"
          onClick={toggle}
          className="glass-shine flex w-full items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-start transition-colors hover:bg-white/10"
        >
          <Avatar name={user.fullName} color={user.avatarColor} size="sm" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-white">{user.fullName}</span>
            <span className="block truncate text-xs text-brand-200">{role}</span>
          </span>
          <ChevronDown className={cn('h-4 w-4 text-brand-200 transition-transform', isOpen && 'rotate-180')} />
        </button>
      ) : (
        <button
          ref={anchorRef}
          type="button"
          onClick={toggle}
          aria-label="תפריט משתמש"
          className="flex items-center gap-2 rounded-lg p-0.5 pe-2 transition-colors hover:bg-slate-100"
        >
          <Avatar name={user.fullName} color={user.avatarColor} size="sm" />
          <span className="hidden text-start sm:block">
            <span className="block text-xs font-semibold leading-tight text-slate-700">{user.fullName}</span>
            <span className="block text-2xs leading-tight text-slate-400">{role}</span>
          </span>
          <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
        </button>
      )}

      <Popover
        anchorRef={anchorRef}
        open={isOpen}
        onClose={close}
        align={variant === 'card' ? 'center' : 'end'}
        placement={variant === 'card' ? 'top' : 'bottom'}
        width={236}
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-3">
          <Avatar name={user.fullName} color={user.avatarColor} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">{user.fullName}</p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
        <div className="py-1">
          {[
            { label: 'הפרופיל שלי', icon: UserIcon, to: '/settings' },
            { label: 'הגדרות', icon: Settings, to: '/settings' },
            { label: 'עזרה ותמיכה', icon: LifeBuoy, to: '/settings' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => go(item.to)}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-start text-sm text-slate-600 transition-colors hover:bg-slate-50"
            >
              <item.icon className="h-4 w-4 text-slate-400" />
              {item.label}
            </button>
          ))}
        </div>
        <div className="border-t border-slate-100 py-1">
          <button
            type="button"
            onClick={() => {
              close();
              logout();
              navigate('/login');
            }}
            className="flex w-full items-center gap-2.5 px-3 py-1.5 text-start text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            התנתקות
          </button>
        </div>
      </Popover>
    </>
  );
}
