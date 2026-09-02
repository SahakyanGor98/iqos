# 24iqos

Russian-language e-commerce storefront for **IQOS** devices, **TEREA** sticks, water, and accessories — with an isolated, authenticated **admin dashboard** (CMS feature flags, orders, contact inbox, and product management). Built on the Next.js App Router with a Supabase Postgres backend.

## Project Overview

- **Storefront** (`app/(site)/`): catalog with staged filtering + model-line grouping, product comparison, a Trade-In calculator, guest checkout (Moscow delivery), and a contact form. Single-locale (`ru-RU`), ISR-cached catalog, transactional email via Resend.
- **Admin** (`app/admin/`): a cookie-authenticated back-office, fully isolated from the storefront chrome — a CMS feature-flag system (`site_settings`), an orders workflow with a status lifecycle, a contact-messages inbox, and full products CRUD across all catalog categories.
- **Data access is server-only.** RLS-protected tables are read/written through a service-role client behind the admin auth gate; public catalog reads use a cookie-free anon client to stay statically renderable.

## Tech Stack

| Concern            | Choice                                                                             |
| ------------------ | ---------------------------------------------------------------------------------- |
| Framework          | **Next.js 16.3** (App Router, RSC, Turbopack)                                      |
| UI runtime         | **React 19.2**                                                                     |
| Language           | **TypeScript 5** (`strict`)                                                        |
| Database / Auth    | **Supabase** (Postgres + `@supabase/ssr` cookie auth)                              |
| Styling            | **Tailwind CSS v4** (PostCSS, no `tailwind.config.js`) + `clsx` / `tailwind-merge` |
| Client state       | **Zustand 5** (`persist` → `localStorage`)                                         |
| Forms & validation | **React Hook Form 7** + **Zod 4** (`@hookform/resolvers`)                          |
| Email              | **Resend** (React email components)                                                |
| Icons / carousels  | `lucide-react`, `embla-carousel-react`                                             |
| Tooling            | ESLint 9, Prettier, Husky + lint-staged                                            |

The admin UI is built with **plain Tailwind + `cn()`** — no component library.

## Architecture & AI Context

- **Server Components by default.** Every `page.tsx` is an RSC; interactive pieces are `'use client'` islands that receive plain serializable props. `lib/api.ts` (and the settings/admin data layers) are `server-only` and can never be bundled to the browser.
- **Two route groups:** `app/(site)/` owns the marketing chrome (Navbar, footer, toasts, age gate); `app/admin/` owns a bare shell + login + a protected `(dashboard)/` SaaS shell. The root `app/layout.tsx` owns only `<html>/<body>`.
- **Atomic Zustand selectors.** Subscribe to the narrowest slice (`useCartStore((s) => s.items)`) — never destructure the whole store. Derived values are computed during render, not stored.
- **📖 Read `.ai/` before contributing.** Domain guidelines live in [`.ai/`](.ai/): `architecture.md` (routing, Server/Client boundary, data access, auth), `styling.md`, `state.md`, `features.md`, `stack.md`, `seo-perf.md`, `resilience-security.md`. Keep them updated in the same change as any feature/architecture shift (see `CLAUDE.md`).

## Local Development

**Prerequisites:** Node.js 20+ and npm, plus a Supabase project.

```bash
# 1. Install dependencies (also installs the Husky pre-commit hook)
npm install

# 2. Create your local env file (see variables below)
cp .env.example .env.local   # or create .env.local manually

# 3. Start the dev server
npm run dev
```

Open **http://localhost:3000** for the storefront and **http://localhost:3000/admin** for the dashboard.

### Environment variables (`.env.local`)

```bash
# Supabase — public, browser-safe
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>

# Supabase — server-only, bypasses RLS. NEVER expose to the client.
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Transactional email (Resend)
RESEND_API_KEY=<resend-api-key>
INTERNAL_EMAIL=<admin-notification-recipient>

# Analytics (optional)
NEXT_PUBLIC_YANDEX_METRIKA_ID=<metrika-id>
```

### Scripts

```bash
npm run dev      # Start the dev server
npm run build    # Production build
npm run start    # Serve the production build
npm run lint     # ESLint (--fix)
npm run format   # Prettier (--write)
npm run fix      # lint + format
```

## Database & CMS

The app requires a **Supabase** backend. The reference schema is [`supabase/schema.sql`](supabase/schema.sql); incremental changes live in [`supabase/migrations/`](supabase/migrations/).

**Run the migrations** in the **Supabase Dashboard → SQL Editor** (there is no CLI/DDL runner wired in). At minimum, apply:

```text
supabase/migrations/
├── 20260901_site_settings.sql     # CMS feature-flag table + RLS + seed  ← required for admin toggles
├── 20260902_page_flags.sql        # page on/off flags (compare, trade-in, about, contact)
└── 20260902_orders_status.sql     # orders.status lifecycle CHECK + index
```

- The **`site_settings`** migration is required to enable the admin **feature flags / UI toggles** at `/admin/settings` (banners and page access). Without it the storefront still runs on safe code-level defaults, but the toggles have nothing to control.
- **Admin access:** create a user in **Supabase → Authentication → Users**, then sign in at `/admin/login`. Admin routes are gated by `middleware.ts` + the `(dashboard)` layout.

## Deployment

Standard **`next build` + `next start`**, managed by **pm2** on a VPS (not Vercel). Deploy flow:

```bash
git pull
npm install
rm -rf .next
npm run build
pm2 restart iqos
```

Do **not** enable `output: 'standalone'` — it's incompatible with the `next start` / pm2 flow. Remote image hosts are allowlisted in `next.config.ts` (`images.remotePatterns`).
