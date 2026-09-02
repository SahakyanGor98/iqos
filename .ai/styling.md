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

## Typography System

The **`/about/iqos` page and its `components/about/*` are the canonical reference** for typography across the public marketing site — match these exact class combinations on every public page and shared component. Each role steps up **one Tailwind size at the `md:` breakpoint** (mobile-first); only the page **H1** takes a further `lg:` step.

Brand text color is **`text-[#34303d]`**; muted body uses an alpha (`/90`, `/85`, `/80`, `/70`), and neutral greys (`text-neutral-500` / `-400`) for footnotes. Headings use `text-balance`; multi-line body uses `text-pretty`.

| Role                                             | Size (mobile → desktop)            | Weight               | Case        | Tracking            | Leading           | Default color                          |
| ------------------------------------------------ | ---------------------------------- | -------------------- | ----------- | ------------------- | ----------------- | -------------------------------------- |
| **H1** — page title (one per page)               | `text-3xl md:text-5xl lg:text-6xl` | `font-black`         | `uppercase` | `tracking-tight`    | `leading-[1.1]`   | `text-[#34303d]`                       |
| **H2** — section heading                         | `text-2xl md:text-4xl`             | `font-black`         | `uppercase` | `tracking-tight`    | —                 | `text-[#34303d]`                       |
| **H3** — sub-section heading                     | `text-xl md:text-2xl`              | `font-black`         | `uppercase` | `tracking-tight`    | —                 | `text-[#34303d]`                       |
| **H4** — card title                              | `text-base md:text-lg`             | `font-bold`          | —           | —                   | —                 | `text-[#34303d]`                       |
| **Lead / large body** — section intro, hero lead | `text-base md:text-lg`             | (`font-medium` opt.) | —           | —                   | `leading-relaxed` | `text-[#34303d]/90`                    |
| **Body** — card & table text                     | `text-sm md:text-base`             | —                    | —           | —                   | `leading-relaxed` | contextual (`/85`, `text-neutral-600`) |
| **Small** — footnotes, disclaimers               | `text-xs md:text-sm`               | —                    | —           | —                   | `leading-relaxed` | `text-neutral-500` / `-400`            |
| **Eyebrow / overline** — kicker above a heading  | `text-xs md:text-sm`               | `font-bold`          | `uppercase` | `tracking-[0.25em]` | —                 | `text-[#34303d]/70`                    |
| **Pill / badge label**                           | `text-xs`                          | `font-extrabold`     | `uppercase` | `tracking-wider`    | —                 | contextual                             |

**Canonical strings (copy verbatim; add `text-balance` to headings, `text-pretty` to multi-line body):**

```
H1:      text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#34303d] leading-[1.1] text-balance
H2:      text-2xl md:text-4xl font-black uppercase tracking-tight text-[#34303d] text-balance
H3:      text-xl md:text-2xl font-black uppercase tracking-tight text-[#34303d]
H4:      text-base md:text-lg font-bold text-[#34303d]
Lead:    text-base md:text-lg leading-relaxed text-pretty text-[#34303d]/90
Body:    text-sm md:text-base leading-relaxed
Small:   text-xs md:text-sm leading-relaxed text-neutral-500
Eyebrow: text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-[#34303d]/70
```

**Rules & exceptions**

- **Spacing is separate from type.** Keep existing margin utilities (`mb-3`, `mb-4 md:mb-6`, `mt-4`, …) when applying a role — this scale defines size/weight/case/tracking/leading only, never margins/padding/alignment/layout.
- **Proper nouns / device names** (e.g. lineup card titles) keep the H2/H3 size + `font-black tracking-tight` but **omit `uppercase`** — `fixCasing` / `formatDeviceTitle` already control their casing.
- **Constrained containers** (e.g. a glass card) may drop one desktop step (H2 → `md:text-3xl`); prefer the full scale unless space forces it.
- **Do not restyle non-prose scales:** buttons (`Button.tsx`), prices (`formatPrice`), nav links, form labels/inputs, and data-table cell sizing keep their own utilities.
- **Out of scope:** the `/admin` dashboard (functional CRUD UI — see the Admin section above) and `components/emails/*` (inline-styled emails) are **not** governed by this system.
