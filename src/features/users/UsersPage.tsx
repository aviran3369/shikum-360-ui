import { useMemo, useState } from 'react';
import { Pencil, Plus, Users } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Avatar, Badge, Button, EmptyState, IconButton, SearchInput, Select, type SelectOption } from '@/components/ui';
import { DataTable, type Column, type SortState } from '@/components/table';
import { useAsync, useDebounce, useDisclosure } from '@/hooks';
import { getUsers } from '@/lib/mockApi';
import { UserRole } from '@/types/enums';
import { userRoleMeta, userStatusMeta } from '@/lib/statusMaps';
import { formatNumber, formatPhone, formatRelative } from '@/lib/format';
import { cycleSortState, sortRows } from '@/lib/sort';
import type { User } from '@/types';
import { UserEditorDrawer } from './UserEditorDrawer';

const roleOptions: SelectOption<UserRole | 'all'>[] = [
  { value: 'all', label: 'כל התפקידים' },
  ...(Object.values(UserRole).filter((v) => typeof v === 'number') as UserRole[]).map((r) => ({ value: r, label: userRoleMeta[r].label })),
];

export function UsersPage() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<UserRole | 'all'>('all');
  const [sort, setSort] = useState<SortState | null>(null);
  const [editing, setEditing] = useState<User | null>(null);
  const editor = useDisclosure();
  const debounced = useDebounce(search, 250);

  const { data, loading, error, refetch } = useAsync(() => getUsers({ search: debounced, pageSize: 100 }), [debounced]);

  const openCreate = () => {
    setEditing(null);
    editor.open();
  };
  const openEdit = (user: User) => {
    setEditing(user);
    editor.open();
  };

  const columns: Column<User>[] = useMemo(
    () => [
      {
        id: 'fullName',
        header: 'משתמש',
        cell: (u) => (
          <span className="flex items-center gap-2.5">
            <Avatar name={u.fullName} color={u.avatarColor} size="sm" />
            <span>
              <span className="block font-medium text-slate-700">{u.fullName}</span>
              <span className="block text-2xs text-slate-400" dir="ltr">{u.email}</span>
            </span>
          </span>
        ),
        sortable: true,
      },
      { id: 'phone', header: 'טלפון', cell: (u) => <span dir="ltr" className="tabular-nums text-slate-600">{formatPhone(u.phone)}</span> },
      { id: 'role', header: 'תפקיד', cell: (u) => <Badge tone={userRoleMeta[u.role].tone}>{userRoleMeta[u.role].label}</Badge>, sortable: true },
      { id: 'status', header: 'סטטוס', cell: (u) => <Badge tone={userStatusMeta[u.status].tone} dot>{userStatusMeta[u.status].label}</Badge>, sortable: true },
      { id: 'lastActiveAt', header: 'פעילות אחרונה', cell: (u) => <span className="text-slate-500">{u.lastActiveAt ? formatRelative(u.lastActiveAt) : 'טרם התחבר/ה'}</span> },
      {
        id: 'actions',
        header: '',
        align: 'end',
        width: 'w-12',
        cell: (u) => (
          <IconButton label="עריכה" size="xs" variant="ghost" onClick={() => openEdit(u)}>
            <Pencil className="h-3.5 w-3.5 text-slate-400" />
          </IconButton>
        ),
      },
    ],
    [],
  );

  const rows = useMemo(() => {
    let items = data?.items ?? [];
    if (role !== 'all') items = items.filter((u) => u.role === role);
    return sortRows(items, sort);
  }, [data, role, sort]);

  return (
    <div>
      <PageHeader title="ניהול משתמשים" subtitle="משתמשי המערכת, תפקידים והרשאות"
        actions={<Button icon={<Plus className="h-4 w-4" />} onClick={openCreate}>משתמש חדש</Button>}
      />

      <div className="space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-card">
          <div className="w-full sm:w-80">
            <SearchInput value={search} onChange={setSearch} placeholder="חיפוש לפי שם או אימייל…" />
          </div>
          <div className="w-full sm:w-52">
            <Select<UserRole | 'all'> value={role} options={roleOptions} onChange={setRole} />
          </div>
          <p className="text-sm text-slate-500 sm:ms-auto">{loading ? 'טוען…' : <>{formatNumber(rows.length)} משתמשים</>}</p>
        </div>

        {error ? (
          <div className="rounded-xl border border-slate-200 bg-white shadow-card">
            <EmptyState title="שגיאה בטעינת המשתמשים" description={error.message} action={<Button variant="outline" onClick={refetch}>נסה שוב</Button>} />
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(u) => u.id}
            loading={loading}
            sort={sort}
            onSortChange={(key) => setSort((p) => cycleSortState(p, key))}
            onRowClick={openEdit}
            stickyHeader
            emptyState={<EmptyState icon={<Users className="h-7 w-7" />} title="לא נמצאו משתמשים" />}
          />
        )}
      </div>

      <UserEditorDrawer open={editor.isOpen} onClose={editor.close} user={editing} />
    </div>
  );
}
