# שיקום 360 — Shikum 360

A pixel-perfect, high-density **fleet-management & transit-scheduling ERP** front-end skeleton, built in Hebrew (RTL) with React + TypeScript + Tailwind CSS. Fully navigable, strictly typed, and backed by an exhaustive mock-data layer that simulates real async APIs (loading / empty / error states everywhere).

## Tech stack
- **Vite + React 18 + TypeScript** (strict)
- **Tailwind CSS v3.4** — RTL via logical utilities (`ps/pe/ms/me/start/end`)
- **react-router-dom v6**, **lucide-react**, **clsx + tailwind-merge**
- Hand-rolled mock async layer (`mockApi` + `useAsync`) — no backend required

## Getting started
```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # tsc --noEmit && vite build
npm run typecheck    # tsc --noEmit
```
> Demo starts authenticated — open `/login` to see the auth flow. Any email/password works; use password `fail` to preview the error state.

## Theme
Colors were sampled directly from `./img/` (see `tailwind.config.js`):
- **brand** — deep indigo chrome from `colors.png` (`#231257` → `#301F63`)
- **primary** — royal-blue CTAs / links / active states (`#2563EB`)
- **surface** — lavender backgrounds; **accent** — periwinkle from `top-bg.jpg`
- Font: **Heebo**; dense type scale (13px base) for ERP information density
- Navy tokens are also defined — flip `--chrome-*` vars in `index.css` to switch the sidebar tone.

## Project structure
```
src/
  types/        enums (.NET-valued) + DTOs + API envelopes
  mock/         mockData.ts (≈100 trips, passengers, drivers, users, …)
  lib/          mockApi, format (he-IL), statusMaps, date, cn, sort
  hooks/        useAsync, useDebounce, useHotkey, useDisclosure, useClickOutside
  store/        Auth / UI / Notifications providers
  components/
    ui/         Button, Input, Select, Modal, Drawer, Calendar, Badge, … (23 atoms)
    table/      DataTable (sort + funnel filters + grouping + column settings + bulk)
    layout/     Sidebar, Topbar, CommandPalette, Notifications/Activity panels, …
  features/     auth, dashboard, scheduling (hero), referrals, users, reports, settings
```

## Features
- **Scheduling (hero)** — stats strip, collapsible/expanded filters, dual-month RTL date-range picker, tri-state sort, per-column funnel filters, group-by-days, column-settings (drag-reorder + presets), bulk actions, order-by-passenger modal, report export modal, new-trip drawer, and full loading/empty/error states.
- **Dashboard** — stat cards, status breakdown, activity feed, upcoming trips.
- **Referrals / Users / Reports / Financial** — rich list pages reusing the DataTable, with intake/editor drawers and validation.
- **Settings** — tabbed Profile / Preferences / Notifications / Security.

## Enterprise additions
Breadcrumbs · Command palette (⌘K) · Notifications center (panel + page) · Audit/activity feed · System-status indicator · Profile menu · 404.

## Status enums (.NET equivalents)
Numeric enums in `src/types/enums.ts` mirror the backend contract (e.g. `TripStatus.Scheduled = 2`), mapped to Hebrew labels + badge tones in `src/lib/statusMaps.ts`.
