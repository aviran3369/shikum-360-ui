# Shikum 360 — Design System Context

> **Purpose of this file.** This is the authoritative description of the *visual design language* used in this app (`shikum-360-design`). Another Claude Code session, pointed at this folder, should read this file **together with the real source files it references** (`tailwind.config.js`, `src/index.css`, `src/components/**`, `src/lib/statusMaps.ts`) and reproduce the same look & feel in a different web app.
>
> For the **step-by-step porting procedure**, see [`PORTING_GUIDE.md`](./PORTING_GUIDE.md).

---

## 1. What this design is

A **high-density, enterprise/ERP** UI for a Hebrew **RTL** SaaS (fleet/transit scheduling). The aesthetic is:

- **Deep-indigo "chrome"** (sidebar/brand) + **violet/purple primary** actions + **lavender surfaces** + **periwinkle decorative banners**.
- **High information density** — compact tables/forms, small type (13px base), tight padding. Avoid consumer-style whitespace.
- **Apple "liquid glass"** interactive elements — translucent, frosted (`backdrop-blur`), with a reflective light edge and a **specular shine sweep on hover**.
- **RTL-first** — sidebar on the right, logical CSS utilities, Hebrew (Heebo) font.

Stack of the source app: **React 18 + TypeScript (strict) + Tailwind CSS v3.4 + react-router-dom v6 + lucide-react + clsx + tailwind-merge**. No backend — an async **mock-data layer** drives realistic loading/empty/error states.

### Design principles
1. **Density over whitespace** — 13px base, ~32–40px control heights, table rows ~py-2.5.
2. **Indigo chrome, violet actions, semantic status colors** — never use raw blue for brand/primary; use the `primary` (violet) token. Keep green/amber/red/cyan only for *status meaning*.
3. **RTL is the default**, not an afterthought. Use logical utilities (`ps/pe/ms/me/start/end`, `text-start/end`, `border-s/e`, `rounded-s/e`).
4. **Glass for interactive surfaces** (buttons, nav items, the user card). Frosted, translucent, with the reflective edge + hover shine.
5. **Every data view handles 4 states**: skeleton (loading) → data → empty → error.

---

## 2. Color tokens (source: `tailwind.config.js`)

All colors are Tailwind `theme.extend.colors`. **Reuse these exact hex values.**

### Brand — deep indigo (chrome: sidebar, dark surfaces)
| Token | Hex | Use |
|---|---|---|
| brand-50 | `#F4F2FB` | faint indigo tint |
| brand-100 | `#E8E3F5` | badge bg (indigo tone) |
| brand-400 | `#8B79B7` | sidebar hover/upper accents |
| brand-700 | `#3F2D6B` | chrome gradient stop |
| brand-800 | `#301F63` | sidebar top / secondary button |
| brand-900 | `#231257` | **sidebar base / brand anchor** |
| brand-950 | `#190B40` | deepest |

### Primary — violet/purple (CTAs, links, active, selected, focus)
| Token | Hex | Use |
|---|---|---|
| primary-50 | `#F6F2FE` | selected row / badge bg |
| primary-100 | `#EDE6FD` | hover tints |
| primary-200 | `#DCCEFB` | subtle button fill / ring |
| primary-400 | `#A47BF0` | active nav accent bar |
| primary-500 | `#8C53E8` | dots, focus ring |
| primary-600 | `#7C3AED` | **main interactive violet** (links, badges) |
| primary-700 | `#6A28D4` | primary button fill |
| primary-800 | `#5821A8` | active/pressed |
| primary-900 | `#4A1E88` | deep |
| primary-950 | `#2E1065` | deepest |

> **The single most important rule:** "primary" is **violet `#7C3AED`**, not blue. Everything that used to be a blue button/badge/link/toggle/checkbox/CountBadge routes through `primary-*`.

### Surfaces — lavender
| Token | Hex | Use |
|---|---|---|
| surface-page | `#F6EEFF` | page background |
| surface-header | `#EDEBFF` | header band |
| surface-muted | `#ECEAFF` | **table header bg**, filter cards, group rows |
| surface-card | `#FFFFFF` | cards/panels |

### Accent — periwinkle (decorative banner, from `top-bg.jpg`)
`accent.light #E1E2F4` · `accent.DEFAULT #C8CBEC` · `accent.dark #ADB0E3`

### Other
- **navy** (`600 #2A3A60 … 900 #101A34`) — an *alternate* chrome tone; switchable via CSS vars (see §5). Not used by default.
- **rowtint** `#DEE7F5` — legacy selected-row tint.
- **Neutrals**: use Tailwind's built-in **slate** scale for text/borders/dividers (`text-slate-700` body, `text-slate-500` muted, `border-slate-200` borders).
- **Zebra table stripe**: `#F6F0FF` (used as `bg-[#F6F0FF]` on odd rows).
- **Active sidebar band**: `#49377F` (used as `bg-[#49377F]`; hover `bg-[#49377F]/60`).
- **Sidebar text-legibility overlay**: `rgba(28,14,74,…)`.

### Status badge tones (source: `src/lib/statusMaps.ts`)
A `BadgeTone` union maps to class triplets. Reuse verbatim:
```ts
export const badgeToneClasses: Record<BadgeTone, string> = {
  slate:  'bg-slate-100 text-slate-600 ring-slate-200',
  blue:   'bg-primary-50 text-primary-700 ring-primary-200', // "blue" tone is actually violet now
  indigo: 'bg-brand-100 text-brand-700 ring-brand-200',
  violet: 'bg-violet-100 text-violet-700 ring-violet-200',
  cyan:   'bg-cyan-50 text-cyan-700 ring-cyan-200',
  green:  'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber:  'bg-amber-50 text-amber-700 ring-amber-200',
  red:    'bg-red-50 text-red-700 ring-red-200',
  rose:   'bg-rose-50 text-rose-700 ring-rose-200',
};
```
`toneDotClasses` is the solid-dot equivalent (`bg-slate-400`, `bg-primary-500`, `bg-emerald-500`, …). Enum→`{label, tone}` records (`tripStatusMeta`, `orderSourceMeta`, `userRoleMeta`, etc.) live in the same file and are the model for mapping **.NET-style numeric enums → Hebrew label + tone**.

---

## 3. Typography

- **Font:** **Heebo** (Hebrew + Latin), loaded via Google Fonts in `index.html`:
  `https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800&display=swap`
  `fontFamily.sans = ['Heebo','system-ui','Segoe UI','Arial','sans-serif']`.
- **Dense type scale** (overrides Tailwind defaults — note **base = 13px**):
  `2xs 10 · xs 11 · sm 12 · base 13 · md 14 · lg 16 · xl 18 · 2xl 22 · 3xl 28 · 4xl 34` (px; each with a tight line-height — see `tailwind.config.js`).
- **Tabular numbers** for data: `.tabular-nums` utility (defined in `index.css`) on serial numbers, dates, amounts, counts.
- Body default: `text-[13px] text-slate-700`.

---

## 4. Spacing, radius, shadows, motion

- **Border radius:** `md 8px · lg 10px · xl 14px · 2xl 18px`. Buttons use `rounded-md` (8px); cards `rounded-xl` (14px).
- **Shadows** (`boxShadow`): `card`, `soft`, `panel`, `popover`, `sidebar` — soft, low-opacity, cool-gray. Cards use `shadow-card`; modals/drawers `shadow-panel`; popovers `shadow-popover`; sidebar `shadow-sidebar`.
- **Custom spacing:** `sidebar = 15.5rem`, `sidebar-collapsed = 4.25rem`, plus `4.5, 13, 15, 18, 62`.
- **Keyframes/animations:** `fade-in`, `scale-in` (modals), `slide-down` (popovers/dropdowns), `slide-in-start`, `shimmer` (skeletons), plus CSS-defined `glass-shine-sweep`, `drawer-in-left/right`. Durations are quick (0.14–0.24s).

---

## 5. Signature CSS techniques (source: `src/index.css`)

These are the non-obvious, **copy-this-verbatim** pieces that define the look. All live in `src/index.css`.

### 5a. Liquid-glass buttons (the headline effect)
Three ingredients combine on every non-`ghost` button (see `src/components/ui/Button.tsx`):

1. **Frosted material** on the element base:
   `backdrop-blur-2xl backdrop-saturate-[1.8]` (≈ iOS `blur(20px) saturate(180%)`) + `transition-all duration-150 active:scale-[0.98]`.
2. **Translucent tinted fill + inset highlights + colored shadow + text-shadow**, per variant. Example (primary):
   ```
   bg-primary-700/80 text-white
   [text-shadow:0_1px_3px_rgba(28,10,60,0.6)]
   shadow-[0_16px_36px_-14px_rgba(124,58,237,0.5),inset_0_1px_1px_rgba(255,255,255,0.55),inset_0_-10px_18px_-14px_rgba(255,255,255,0.28)]
   hover:bg-primary-600/85 active:bg-primary-800/88
   ```
   (Full per-variant map is in `Button.tsx` → `variantClasses`.)
3. **Reflective edge ring** `.glass-edge` + **hover shine sweep** `.glass-shine` (applied via `variant !== 'ghost' && 'glass-edge glass-shine'`):
   ```css
   /* 1px gradient-border "light ring": bright top-left & bottom-right, faint middle */
   .glass-edge { position: relative; }
   .glass-edge::before {
     content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
     background: linear-gradient(135deg,
       rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 40%,
       rgba(255,255,255,0.03) 64%, rgba(255,255,255,0.30) 100%);
     -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
     -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
   }
   /* diagonal specular streak that glides across on hover */
   .glass-shine { position: relative; overflow: hidden; }
   .glass-shine::after {
     content: ''; position: absolute; inset-block: 0; left: 0; width: 55%;
     background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%);
     transform: translateX(-200%) skewX(-15deg); pointer-events: none; will-change: transform;
   }
   .glass-shine:hover::after { animation: glass-shine-sweep 0.9s ease-out; }
   @keyframes glass-shine-sweep {
     from { transform: translateX(-200%) skewX(-15deg); }
     to   { transform: translateX(320%)  skewX(-15deg); }
   }
   ```
   **Notes:** `.glass-shine` uses `::after` and `.glass-edge` uses `::before`, so they coexist; both can sit next to an element's own `::before` indicator (e.g. the active nav bar) as long as that element only uses one pseudo. Glass needs a **colorful/dark backdrop to read as transparent** — over flat white it looks like a tint; the *hover shine works on any background*.

### 5b. Chrome (sidebar) — gradient + full-height texture
```css
:root { --chrome-900: theme('colors.brand.900'); --chrome-800: theme('colors.brand.800'); --chrome-700: theme('colors.brand.700'); }
/* swap these three vars to the navy.* values to switch the chrome tone app-wide */

.chrome-gradient { background-image: linear-gradient(180deg, var(--chrome-800), var(--chrome-900) 62%, var(--chrome-900)); }

/* sidebar: cube texture (public/sidebar-bottom-bg.png) under a dark indigo overlay for legibility */
.sidebar-chrome {
  background-color: var(--chrome-900);
  background-image:
    linear-gradient(180deg, rgba(28,14,74,0.82) 0%, rgba(28,14,74,0.6) 50%, rgba(28,14,74,0.5) 100%),
    url('/sidebar-bottom-bg.png');
  background-repeat: no-repeat, no-repeat; background-position: center, center; background-size: cover, cover;
}
```

### 5c. Decorative periwinkle banner (behind every page header)
```css
/* 400px tall, fades into the page bg; rendered as an absolutely-positioned div at the top of <main> */
.top-bg-banner {
  background-image:
    linear-gradient(180deg, rgba(246,238,255,0) 42%, rgba(246,238,255,0.82) 76%, #f6eeff 100%),
    url('/top-bg.jpg');
  background-repeat: no-repeat, no-repeat; background-size: cover, cover; background-position: center top, center top;
}
```
Usage (in `DashboardLayout`): `<main class="relative …"><div class="top-bg-banner pointer-events-none absolute inset-x-0 top-0 h-[400px]" aria-hidden /><div class="relative"><Outlet/></div></main>`.

### 5d. Skeleton shimmer, focus ring, scrollbars, drawer slides
- `.skeleton` — gray block with a moving white gradient (`shimmer`), RTL-reversed.
- Global focus ring: `:where(button,a,input,select,textarea,[tabindex]):focus-visible { ring-2 ring-primary-500/60 ring-offset-1 }`.
- Slim custom scrollbars; `.no-scrollbar` utility.
- `.animate-drawer-left` / `.animate-drawer-right` — **physical-edge** drawer slide-ins (dir-agnostic; pin with `left-0`/`right-0`).

### Required public assets
- `public/top-bg.jpg` — periwinkle geometric banner (hero background).
- `public/sidebar-bottom-bg.png` — indigo isometric-cube texture (sidebar background).
- `public/favicon.svg`.
Copy these (or supply equivalents) — the CSS references `/top-bg.jpg` and `/sidebar-bottom-bg.png`.

---

## 6. RTL approach

- `index.html`: `<html lang="he" dir="rtl">`.
- Use **logical utilities** everywhere: `ps-/pe-` (padding), `ms-/me-` (margin), `start-/end-` (inset), `text-start/text-end`, `border-s/border-e`, `rounded-s/rounded-e`. No RTL plugin needed (Tailwind 3.3+).
- Flex rows auto-reverse under `dir=rtl` — the sidebar is the **first** flex child and lands on the **right**.
- For things that must be physically fixed (drawer edges, transforms, the shine sweep), use **physical** classes (`left-0`, `translateX`) so they don't double-flip.
- Breadcrumb/pagination chevrons point per reading direction (separator = `ChevronLeft`).
- If porting to an **LTR** app: keep the logical utilities (they work in both), set `dir="ltr"`, and the layout mirrors automatically.

---

## 7. Component inventory

> Read the actual files for full APIs. Paths are relative to `src/`.

### Atoms — `components/ui/` (barrel: `components/ui/index.ts`)
| Component | Notes |
|---|---|
| `Button`, `IconButton` | **Liquid-glass** (see §5a). Variants: `primary`(violet) `secondary`(indigo) `outline`(frosted white) `ghost`(plain) `subtle`(light violet) `danger`(red). Sizes `xs/sm/md`. Props: `loading`, `icon`, `iconEnd`, `fullWidth`. |
| `Input`, `Field`, `Textarea` | `Field` = label + error/hint wrapper. `Input` supports `startIcon/endIcon/invalid`, `sizeVariant sm|md`. h-8/h-9, rounded-md, violet focus ring. |
| `Select<T>` | Custom (button + `Popover`), check on selected, `startIcon`, options `{value,label,icon?}`. |
| `SearchInput` | Magnifier + clear, type=search. |
| `Checkbox`, `Radio` | Custom box, violet when checked, indeterminate support. |
| `Toggle` | iOS switch, violet when on, RTL-aware knob travel. |
| `SegmentedControl<T>` | Pill segments (e.g. בסיסי/הכל/כספים). |
| `Badge`, `StatusDot`, `CountBadge` | `Badge tone={BadgeTone} dot`. `CountBadge` = violet pill (notifications). |
| `Avatar` | Initials, color-driven, ring. |
| `Chip` | Removable filter pill. |
| `Card`, `CardHeader`, `CardBody` | `rounded-xl border-slate-200 shadow-card`. |
| `Tabs` | Underline tabs with optional count. |
| `Pagination` | RTL-aware prev/next + "page x / y". |
| `Spinner`, `Skeleton`, `SkeletonText` | Loaders. |
| `EmptyState` | Centered icon + title + desc + action (the "אין תוצאות" pattern). |
| `Breadcrumbs` | RTL trail. |
| `Modal` | Portal, backdrop blur, `scale-in`, header/footer slots, sizes `sm/md/lg/xl`, scroll-lock + Esc. |
| `Drawer` | Side panel, physical `left|right` edge, slide-in, scroll-lock + Esc. |
| `Popover` | Portal, fixed positioning (no clipping), `align start|end|center`, **`placement top|bottom`**, outside-click + Esc. |
| `Portal` | `createPortal` to body. |
| `Tooltip` | CSS hover bubble (physical centering for RTL safety). |
| `Calendar` → `RangeCalendar`, `DateRangePicker` | Dual-month RTL range picker, Hebrew weekday headers, violet selection. **Responsive:** `DateRangePicker` shows the dual-month popover on `lg+` and falls back to two separate native **from/to** date inputs below `lg` (the 2-month grid doesn't fit phones). |

### Data table — `components/table/`
- `DataTable<T>` — generic, high-density (`px-3 py-2.5 text-[13px]`), **purple header** (`bg-surface-muted`), **zebra rows** (`#F6F0FF` odd), full **grid borders** (`border-e/border-b border-slate-200`), tri-state sort, per-column **funnel filter** (`ColumnFilterMenu`, 3-line `ListFilter` icon), row selection, **drag-to-reorder columns** (`onReorderColumn`), grouping (`groupBy` + `renderGroupHeader`), skeleton/empty states, `bare` mode (no card chrome so a parent can wrap toolbar+table in one card).
- `useTableState<T>` — sort (tri-state), selection, column filters, **column visibility/order + `localStorage` persistence** (`storageKey`), `reorderColumn`.
- `ColumnSettingsModal` — presets (basic/all/finance), search, recommended-only, drag-reorder, reset.
- `BulkActionBar` — selection toolbar (count pill + actions).
- `types.ts` — `Column<T>` (id, header, cell, sortable, filterable, align, width, preset, recommended, formatFilterOption), `SortState`.

### App shell & enterprise extras — `components/layout/`
- `DashboardLayout` — RTL flex: `Sidebar` (right) + `main` (with the 400px `top-bg-banner` behind `<Outlet/>`); hosts `CommandPalette` (⌘K), `NotificationsPanel`, `ActivityFeedPanel`. On **mobile (< lg)** it renders a tap-to-close **backdrop** and auto-closes the drawer on route change.
- `AuthLayout` — split: form side + brand panel (`chrome-gradient top-bg-banner`).
- `Sidebar` — `sidebar-chrome` texture; grouped nav (`NavLink`); **active item** = full-width `bg-[#49377F]` band + `primary-400` start-edge bar; **hover** = `bg-[#49377F]/60` + `glass-shine`; quick-search trigger (⌘K); bottom user card (`ProfileMenu variant="card"`). **Responsive:** off-canvas **drawer below `lg`** (scoped with `max-lg:` — `max-lg:fixed`, pinned to the inline-start edge / right in RTL, slides via `max-lg:translate-x-*`), **static in-flow from `lg` up** (no transform on desktop). The header shows a **collapse toggle on desktop** (`lg:inline-flex`) and an **X close on mobile** (`lg:hidden`). See §10.
- `Topbar` — **hamburger** (`Menu`, `lg:hidden`) that toggles the mobile sidebar + breadcrumbs + ⌘K trigger + `SystemStatusIndicator` + notifications bell (`CountBadge`) + activity + `ProfileMenu variant="avatar"`.
- `PageHeader` — transparent (banner shows behind); title + subtitle + actions + children (stats strip slot).
- `ProfileMenu` — user trigger + `Popover`; **card variant opens upward (`placement="top"`)**, avatar variant downward; has `glass-shine`.
- `CommandPalette` — ⌘K modal, fuzzy command list, arrow-key nav.
- `NotificationsPanel`, `ActivityFeedPanel` — `Drawer`s (audit feed = timeline).
- `SystemStatusIndicator` — status dot + popover.
- `constants/nav.ts` — nav model + `routeMeta` (per-route title/subtitle/breadcrumbs).

### Supporting layers (visual-relevant)
- `lib/cn.ts` — `cn()` = clsx + tailwind-merge (required for the long conditional class strings).
- `lib/statusMaps.ts` — tones + enum→meta (see §2).
- `lib/format.ts` — `he-IL` date/time/number/currency(₪)/relative/phone formatting.
- `lib/date.ts`, `lib/sort.ts` — calendar + client-sort helpers.
- `hooks/` — `useAsync` (data/loading/error/empty + refetch), `useDebounce`, `useHotkey` (⌘/Ctrl+K), `useDisclosure`, `useClickOutside`.
- `store/` — `AuthProvider`, `UIProvider` (sidebar collapse, **mobile sidebar drawer** `mobileSidebarOpen`/`toggleMobileSidebar`/`closeMobileSidebar`, command palette), `NotificationsProvider`.
- `lib/mockApi.ts` + `mock/mockData.ts` + `types/{enums,dto}.ts` — async mock layer with latency + error/empty simulation; the model for wiring real data into the same loading/empty/error visuals.

---

## 8. Density & layout rules (apply consistently)

- **Tables:** header `px-3 py-2.5 text-[12px] font-semibold text-slate-600` on `bg-surface-muted`; cells `px-3 py-2.5 text-[13px]`; zebra `#F6F0FF`; 1px slate-200 grid; row hover `bg-primary-50/60`; selected `bg-primary-50`.
- **Forms:** label `text-xs font-medium text-slate-600`; inputs h-8 (sm) / h-9 (md), `rounded-md`, `border-slate-300`, violet focus.
- **Cards:** `rounded-xl border border-slate-200 bg-white shadow-card`; header `border-b border-slate-100 px-4 py-3`.
- **Page scaffold:** `PageHeader` (title 2xl bold, subtitle slate-500) → content `p-5 space-y-3/4`. Toolbar + table belong **inside one white card** (use `DataTable bare`).
- **Buttons:** default `size="sm"`; primary for the page's main CTA; outline for secondary toolbar actions; ghost `IconButton` for icon-only.

---

## 9. What is NOT part of the design (ignore when porting)

- App-specific routing/deploy config: `vite.config.js` `base`, `<BrowserRouter basename>`, the SPA-redirect script in `index.html` — these are GitHub-Pages deployment details, not design.
- Domain data (trips, referrals, passengers) and the specific feature pages — those are *content*; reuse the **components/patterns**, not the business data.

---

## 10. Responsive / mobile

Breakpoint: **`lg` (1024px)** separates "desktop" from "mobile/tablet".

- **Desktop (`lg+`)**: the `Sidebar` is a **static, in-flow column** (right side in RTL), with the desktop **collapse** toggle (icon-only rail at `w-[4.25rem]`, full at `w-sidebar`). No hamburger, no backdrop.
- **Mobile (`< lg`)**: the `Sidebar` is an **off-canvas drawer** — pinned with `max-lg:fixed max-lg:inset-y-0 max-lg:start-0 max-lg:z-50`, hidden via `translate-x` and revealed when `mobileSidebarOpen` is true. A **hamburger** (`Menu` icon, `lg:hidden`) in the `Topbar` toggles it; a `lg:hidden` **backdrop** (`fixed inset-0 z-40 bg-slate-900/40`) closes it on tap; it also **auto-closes on route change** (effect on `pathname` in `DashboardLayout`). The drawer header shows an **X close** (`lg:hidden`).
- State lives in `UIProvider`: `mobileSidebarOpen`, `toggleMobileSidebar`, `closeMobileSidebar` — all actions are memoized with `useCallback` so the close-on-route-change effect doesn't re-fire (and slam the drawer shut) every time the provider re-renders.
- **Collapsed desktop rail** (`w-[4.25rem]`): the brand logo is centered and the expand toggle moves to its own centered row; the bottom user button renders **icon-only** via `ProfileMenu variant="avatar" showLabel={false}` (centered avatar, `hover:bg-white/10`, no name/chevron).
- **Scope the drawer to `max-lg:` (important gotcha).** Apply positioning + slide *only* below `lg` so the desktop sidebar has **no transform at all** and stays a static in-flow column. Exact classes: open = `max-lg:translate-x-0`; closed = `max-lg:rtl:translate-x-full max-lg:ltr:-translate-x-full` (RTL-aware; slides off the inline-start edge — right in RTL, left in LTR). **Do NOT** try to "force it back" on desktop with `lg:translate-x-0`: the selector `[dir=rtl] .rtl:translate-x-full` (specificity 0,2,0) out-ranks the responsive `.lg:translate-x-0` (0,1,0, media queries add no specificity), so the sidebar would stay hidden on desktop. Using `max-lg:` avoids the fight entirely.
- **Date range picker** swaps UI by breakpoint: the dual-month `DateRangePicker` popover is `hidden lg:block`, and a `lg:hidden` pair of native `<input type="date">` (from/to, with `min`/`max` to keep the range valid) renders on mobile — both bound to the same `value`/`onChange`. Pattern to reuse: when a rich desktop control can't fit a phone, render a simpler native control behind a `lg:hidden` / `hidden lg:block` swap rather than trying to shrink the desktop one.
- Other responsive habits in this app: stat-card grids `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`; the Topbar quick-search pill is `hidden md:flex`; tables scroll horizontally (`overflow-x-auto`) on narrow screens.

See [`PORTING_GUIDE.md`](./PORTING_GUIDE.md) for exactly what to copy and how to apply it to another app.
