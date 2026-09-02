# Styling

UI conventions inferred from `app/globals.css`, `lib/utils.ts`, and `components/`.

## Approach: Tailwind CSS v4, utility-first

- **Tailwind v4** with the PostCSS pipeline. Configured entirely through `app/globals.css` (`@import 'tailwindcss'`) and `postcss.config.mjs` (`@tailwindcss/postcss`). **There is no `tailwind.config.js`** — do not add one unless intentionally moving config into JS.
- Styling is **utility-first, inline in JSX**. There are no CSS Modules (`.pcss`/`.module.css`) in this project; component styles are Tailwind classes on elements.
- Custom global CSS lives only in `app/globals.css`: theme tokens, a few component classes, keyframes/animations, and the `.badge` helper.

## Theme tokens (CSS variables)

Defined on `:root` in `globals.css` and used via arbitrary-value classes and raw CSS:

| Token                  | Value     | Meaning            |
| ---------------------- | --------- | ------------------ |
| `--background`         | `#fffdfb` | Soft white page bg |
| `--foreground`         | `#34303d` | Slate text         |
| `--primary`            | `#34303d` | Brand slate        |
| `--accent`             | `#f5f3f1` | Off-white / cream  |
| `--border` / `--input` | `#e5e7eb` | Borders            |
| `--ring`               | `#34303d` | Focus ring         |

The brand slate **`#34303D`** and page background **`#fffdfb`** recur as Tailwind arbitrary values (`bg-[#34303D]`, `bg-[#fffdfb]`, `text-[#34303d]`). Prefer these exact hexes for brand surfaces to stay consistent.

## Class composition: `cn()`

Merge classes with the `cn` helper in `lib/utils.ts` — `twMerge(clsx(...))`. Use it whenever combining conditional or caller-supplied classes so Tailwind conflicts resolve correctly:

```ts
import { cn } from '@/lib/utils';
className={cn(baseClass, variantStyles[variant], className)}
```

- `clsx` handles conditional/array class inputs; `tailwind-merge` dedupes conflicting utilities (e.g. two `px-*`). Don't hand-concatenate class strings when a caller can also pass `className`.

## Component structure

- Shared components live flat in `components/`, feature-grouped subfolders for larger features (`components/trade-in/`, `components/about/`, `components/emails/`), and are re-exported from `components/index.ts` — import via `@/components`.
- Components are **PascalCase `.tsx` files**; Client Components start with `'use client'` (see `architecture.md` for the boundary).
- **Variant pattern (see `components/Button.tsx`):** enums in a sibling `*Types.ts` (`ButtonTypes.ts`) map to lookup objects of class strings (`variantStyles`, `sizeStyles`, `shadowStyles`), composed with `cn()`. Follow this pattern for new multi-variant components rather than ad-hoc conditionals. `Button` is a polymorphic `forwardRef` that renders `<Link>` when `href` is set, else `<button>`.
- Reusable class recipes exist as component classes in `globals.css` (`.container-custom`, `.btn-primary`, `.btn-secondary`, `.btn-light`) via `@layer components` + `@apply`. Note the `.btn-*` classes duplicate `Button.tsx`'s styles — prefer the `<Button>` component for interactive buttons; use the utility classes only for static/markup cases.

## Admin panel UI — plain Tailwind, no component library

The `/admin` surfaces use the **same utility-first Tailwind + `cn()`** as the rest of the site — **not** a component library. shadcn/ui and Mantine were both evaluated and rejected: this project runs Tailwind v4 with **no `tailwind.config.js`**, and dropping a kit in for a few controls wasn't worth the integration/token surgery.

- Build admin screens from plain elements: cards are `rounded-2xl border border-neutral-200 bg-white p-6`, labels/headings use the brand slate `#34303d` and `text-neutral-500` helper text (see `app/admin/login/LoginForm.tsx` for the established look).
- Reuse the brand `<Button>` (`components/Button.tsx`) for actions.
- Hand-roll small primitives rather than adding deps — e.g. the settings toggle is a `<button role="switch" aria-checked>` with a translating thumb (`app/admin/(dashboard)/settings/SettingToggle.tsx`), ~15 lines, brand slate when on.

## Conventions & idioms

- **Design language:** rounded-full buttons, uppercase tracked labels (`uppercase tracking-[0.1em]`), bold/black headings (`font-black uppercase tracking-tighter`), subtle hover scale (`hover:scale-[1.02]`, `active:scale-[0.96]`), 300ms transitions, and always-styled focus rings (`focus-visible:ring-2 focus-visible:ring-offset-2`).
- **Icons:** `lucide-react`. Import the specific icons you use.
- **Fonts:** system sans (`font-sans` / Arial stack) for body; a local display face `--font-christ` (`assets/christ.100.ttf`, loaded in `layout.tsx`) applied to the "IQOS" wordmark via `formatDeviceTitle` in `lib/utils.ts`.
- **Formatting helpers** live in `lib/utils.ts`: `formatPrice` (RU rubles, non-breaking `₽`), `fixCasing`, `formatDeviceTitle`, and `getDeviceColorSwatch` / `DEVICE_COLOR_SWATCH_MAP` (maps color names — RU + EN — to swatch backgrounds). Reuse these instead of re-implementing price/title/color rendering.
- **Animations:** `animate-fade-in` (keyframes in `globals.css`); the global loader (`components/GlobalLoader.tsx`, a lucide `LoaderCircle`) spins via Tailwind's built-in `animate-spin`. Per project rule, put the animation on a wrapper `<div>` (GPU) rather than the SVG element itself.
- **Responsive:** mobile-first; the layout uses `md:` breakpoints heavily and `100dvh`/internal scroll for the app shell.
