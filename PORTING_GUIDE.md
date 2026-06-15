# Porting Guide — Apply the Shikum 360 design to another app

> **You are an AI coding agent working in a *different* project (the "target app"). A reference design lives in this folder (`shikum-360-design`). Your job: re-skin the target app to match this design.**
>
> Read [`DESIGN_CONTEXT.md`](./DESIGN_CONTEXT.md) first for the full system, then follow the steps below. Always prefer reading the **real source files** referenced here over guessing.

---

## 0. Orient yourself (do this first)
Read, in order:
1. `DESIGN_CONTEXT.md` — the design language, tokens, and CSS techniques.
2. `tailwind.config.js` — exact color/font/scale/shadow/radius tokens.
3. `src/index.css` — global CSS: glass effects, chrome, banner, skeleton, focus, scrollbars, RTL.
4. `src/components/ui/Button.tsx` — the canonical liquid-glass implementation.
5. `src/lib/statusMaps.ts` + `src/lib/cn.ts` — tones/enums + the `cn()` helper.
6. Skim `src/components/ui/`, `src/components/table/`, `src/components/layout/`.

Then inspect the **target app**: framework (React/Vue/Svelte/Angular/plain), styling system (Tailwind? CSS modules? styled-components?), whether it's RTL, its router, and its existing component/page inventory. **Pick a track** below based on the target's styling system.

---

## 1. Decision: which track?

- **Track A — target uses React + Tailwind (any v3):** copy files directly (fastest, highest fidelity). Go to §2A.
- **Track B — target uses a different framework/styling:** translate the tokens + global CSS, then re-create the components using the documented classes/markup. Go to §2B.

In both tracks, the **tokens and CSS techniques in `DESIGN_CONTEXT.md` are the contract** — match those values exactly.

---

## 2A. Track A — React + Tailwind (copy & adapt)

1. **Tokens.** Merge this repo's `tailwind.config.js` `theme.extend` (colors `brand/primary/surface/accent/navy/rowtint`, `fontFamily`, `boxShadow`, `borderRadius`, `spacing`, `keyframes`, `animation`) and the **`fontSize`** override (13px base) into the target's `tailwind.config`. Ensure `content` globs cover the target's files.
2. **Global CSS.** Copy the three `@layer` blocks from `src/index.css` (base resets + `.tabular-nums` + focus ring + scrollbars; components `.chrome-gradient` / `.sidebar-chrome` / `.top-bg-banner` / `.glass-edge` / `.glass-shine` / `.skeleton`; utilities `.no-scrollbar` + drawer keyframes) into the target's global stylesheet. Keep the `:root { --chrome-* }` vars.
3. **Helper + deps.** Copy `src/lib/cn.ts`. Ensure deps: `clsx`, `tailwind-merge`, `lucide-react` (icons). `cn()` is **required** — the components rely on tailwind-merge to resolve the long conditional class strings.
4. **Fonts.** Add the Heebo `<link>` (from `index.html`) to the target's HTML `<head>`. (If the target is LTR/English-only, you may keep Heebo or substitute Inter — but match weights 300–800.)
5. **Assets.** Copy `public/top-bg.jpg`, `public/sidebar-bottom-bg.png`, `public/favicon.svg` into the target's public dir (the CSS references `/top-bg.jpg` and `/sidebar-bottom-bg.png`). If the target deploys under a sub-path, adjust those URLs.
6. **Primitives.** Copy `src/components/ui/`, `src/components/table/`, and the bits they import: `src/lib/{statusMaps,format,date,sort}.ts`, `src/hooks/`. These are dependency-light and framework-generic React.
7. **Shell (optional but recommended).** Copy `src/components/layout/` + `src/store/` + `src/constants/nav.ts`, then point `Sidebar`/`Topbar` nav at the target app's routes. Wrap the target's authenticated routes in `DashboardLayout`.
8. **RTL.** Set `<html dir="rtl" lang="he">` if the target is Hebrew; otherwise `dir="ltr"` — the logical utilities work both ways.
9. **Re-skin screens.** See §3.

---

## 2B. Track B — different framework / styling

1. **Translate tokens** into the target's system. Either keep Tailwind, or expose them as **CSS custom properties** and map. Minimum set to define (exact hex from `DESIGN_CONTEXT.md` §2):
   - `--brand-900 #231257`, `--brand-800 #301F63`, `--brand-700 #3F2D6B`, `--brand-400 #8B79B7`, `--brand-100 #E8E3F5`
   - `--primary-700 #6A28D4`, `--primary-600 #7C3AED`, `--primary-500 #8C53E8`, `--primary-200 #DCCEFB`, `--primary-100 #EDE6FD`, `--primary-50 #F6F2FE`, `--primary-800 #5821A8`
   - `--surface-page #F6EEFF`, `--surface-muted #ECEAFF`, `--surface-card #FFFFFF`
   - `--accent #C8CBEC` (+ light `#E1E2F4` / dark `#ADB0E3`)
   - active band `#49377F`, zebra `#F6F0FF`, neutrals = slate scale.
2. **Type:** Heebo; base font-size **13px**; the dense scale from §3 of the context; tabular-nums for data.
3. **Copy the raw CSS techniques** from `src/index.css` (they are framework-agnostic): `.glass-edge`, `.glass-shine` (+ `@keyframes glass-shine-sweep`), `.chrome-gradient`, `.sidebar-chrome`, `.top-bg-banner`, `.skeleton` (+ shimmer), focus ring, scrollbars, drawer keyframes. These work in any framework — just attach the class names to your elements.
4. **Re-create components** using `DESIGN_CONTEXT.md` §7 as the spec and the React files as the visual reference. The critical ones to get right (in priority order): **Button (glass)**, **Card**, **Input/Field/Select**, **Badge**, **DataTable** (purple header + zebra + grid + 3-line filter icon), **Sidebar/Topbar shell**, **Modal/Drawer/Popover**.
5. **Glass button recipe** (translate the Tailwind classes to your CSS): translucent fill (`primary-700 @ 80%`), `backdrop-filter: blur(24px) saturate(1.8)`, the `.glass-edge` ring, the `.glass-shine` hover sweep, `box-shadow` with a soft violet outer glow + inset top highlight, `text-shadow` on white labels, `border-radius: 8px`, `transition: all .15s`, `active { transform: scale(.98) }`. Hover brightens the fill (`primary-600 @ 85%`).
6. **RTL** as in §6 of the context. Use logical properties (`padding-inline-start`, `inset-inline-end`, `margin-inline`, `text-align: start`) — the CSS equivalents of Tailwind's `ps/pe/ms/me/start/end`.
7. **Re-skin screens.** See §3.

---

## 3. Re-skinning the target app's screens (both tracks)

Map the target's existing UI onto these patterns:

| Target element | Use this design pattern |
|---|---|
| Any page | `PageHeader` (title 2xl bold + subtitle + actions) over the page; content in `p-5 space-y-4`; periwinkle banner behind via `DashboardLayout`. |
| Primary action button | `Button variant="primary"` (violet glass). |
| Secondary/toolbar buttons | `Button variant="outline"` (frosted). Icon-only → `IconButton variant="ghost"`. |
| Tables/grids | `DataTable` — purple header, zebra rows, grid borders, sort, funnel filters, selection. Put the toolbar (counts/actions) + table **in one white card** (`DataTable bare`). |
| Forms | `Field` + `Input`/`Select`/`Textarea`/`Checkbox`/`Toggle`; 2-col grids; dense. |
| Status/labels | `Badge tone=…` via the enum→tone maps; mirror your domain enums in a `statusMaps`-style file. |
| Modals/dialogs | `Modal`; side panels/details → `Drawer`; menus/dropdowns → `Popover` (+ custom `Select`). |
| Empty/loading/error | `EmptyState`, `Skeleton`/`SkeletonText`, and the `useAsync` 4-state pattern. |
| App chrome | `DashboardLayout` + `Sidebar` (right, indigo, glass hover) + `Topbar` (⌘K, notifications, status, profile). **Responsive:** sidebar is a static column from `lg` up, and an **off-canvas drawer below `lg`** toggled by a **hamburger** in the Topbar (with backdrop + auto-close on navigation). |
| Nav items | full-width band active (`#49377F`), hover `#49377F/60` + `glass-shine`. |

**Keep the target's data, routes, and business logic** — only swap presentation. Don't import this repo's domain data (trips/passengers/etc.); recreate equivalents for the target's domain if needed.

---

## 4. Acceptance checklist

- [ ] Tokens present: violet `primary` (#7C3AED family), indigo `brand`, lavender `surface`, periwinkle `accent`; **no raw blue** for brand/primary.
- [ ] Heebo font loaded; base 13px; tabular-nums on numeric data.
- [ ] Buttons are **liquid glass**: translucent + `backdrop-blur/saturate` + `.glass-edge` ring + **shine sweep on hover** + `active:scale`.
- [ ] Sidebar: right-aligned, `sidebar-chrome` texture, active band `#49377F`, hover `#49377F/60` + shine; user card menu opens **upward**.
- [ ] **Responsive sidebar**: hidden by default on mobile (< lg), opens as an off-canvas drawer via a **hamburger** in the Topbar; backdrop tap + navigation close it; always visible as a static column on desktop (lg+).
- [ ] Page background lavender; 400px periwinkle banner behind page headers.
- [ ] DataTable: purple header, zebra, grid borders, 3-line filter icon, sort, selection; toolbar+table in one card.
- [ ] Cards/inputs/badges/modals/drawers match the documented density and radii.
- [ ] RTL correct (or LTR mirrored cleanly) using logical utilities.
- [ ] Every data view shows skeleton → data → empty → error.
- [ ] Build/typecheck pass; visually compare against this repo (`npm run dev` here).

---

## 5. Gotchas (learned the hard way)
- **`cn()` (tailwind-merge) is mandatory** for Track A — the conditional class strings conflict-resolve through it.
- **Tailwind config changes don't hot-reload** — restart the dev server after editing `tailwind.config`.
- **Glass needs a colorful/dark backdrop** to look transparent; over flat white it reads as a tint. The **hover shine** works on any background.
- **`backdrop-filter`** needs a modern browser; provide a solid-color fallback if you must support old ones.
- **`.glass-edge` uses `::before`, `.glass-shine` uses `::after`** — don't add `.glass-edge` to an element that already uses `::before` for something else (e.g. the active nav bar uses `::before`, so nav items get `.glass-shine` only).
- **Don't copy** `vite.config` `base`, router `basename`, or the `index.html` SPA-redirect script — those are deployment-specific, not design.
- Keep **status colors** (green/amber/red/cyan) for *meaning only*; everything brand/interactive is violet.
- **Responsive sidebar — scope to `max-lg:`, not `lg:` overrides.** Make the off-canvas drawer behavior (`fixed`/`inset-y-0`/`start-0`/`z-50` + the `translate-x` slide) apply only **below** the breakpoint via `max-lg:`. Don't pin/translate on all sizes and try to undo it with `lg:translate-x-0` — in RTL, `[dir=rtl] .rtl:translate-x-full` (specificity 0,2,0) beats the responsive `.lg:translate-x-0` (0,1,0; media queries add no specificity), so the desktop sidebar stays hidden. With `max-lg:`, desktop simply has no transform (static, visible) and each mobile state uses exactly one translate class.
- **Stabilize context action callbacks** (`useCallback`). The mobile drawer auto-closes on route change via `useEffect(() => closeMobileSidebar(), [pathname, closeMobileSidebar])`. If `closeMobileSidebar` is re-created every provider render (inline arrow in the `useMemo` value), then *opening* the drawer changes `mobileSidebarOpen` → re-creates the value → changes `closeMobileSidebar`'s identity → the effect re-fires → the drawer slams shut immediately ("hamburger does nothing"). Wrap the store's actions in `useCallback` so their identity is stable.
- **Collapsed rail profile is icon-only.** The bottom user button uses `ProfileMenu variant="avatar" showLabel={false}` in the collapsed (`w-[4.25rem]`) desktop rail — centered avatar, dark hover (`hover:bg-white/10`), no name/role/chevron, and its menu opens **upward + into the viewport** (`placement="top"`, `align="start"`). The full card (`variant="card"`) is for the expanded sidebar; the labelled avatar (`showLabel` default, opens downward) is for the Topbar. Center the logo and move the expand toggle to its own centered row when collapsed.
- **Icon-rail centering + tooltip wrappers.** If you wrap collapsed nav links in a `Tooltip`, make sure the wrapper isn't `inline-flex` (shrink-to-content) — that leaves the link narrower than the `<li>`, so `justify-center` has nothing to center and the icon sticks to the start edge (right in RTL). Give both the tooltip wrapper and the link `w-full`.
