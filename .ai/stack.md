# Tech Stack

Inferred from `package.json`, `tsconfig.json`, `next.config.ts`, and the source tree. Keep this file in sync when dependencies change.

## Core framework

| Concern    | Choice                      | Version  |
| ---------- | --------------------------- | -------- |
| Framework  | Next.js (App Router)        | `16.3.3` |
| Runtime UI | React / React DOM           | `19.2.3` |
| Language   | TypeScript (`strict: true`) | `^5`     |
| Node types | `@types/node`               | `^20`    |

- **App Router only** — all routes live under `app/`. There is no `pages/` directory.
- Path alias `@/*` → project root (see `tsconfig.json`), e.g. `@/lib/api`, `@/components`.
- `target: ES2017`, `moduleResolution: bundler`, `jsx: react-jsx`, `incremental` builds.

## Data & backend

| Concern             | Choice                        | Version   |
| ------------------- | ----------------------------- | --------- |
| Database / storage  | Supabase (Postgres + Storage) | —         |
| Supabase SDK        | `@supabase/supabase-js`       | `^2.89.0` |
| Supabase SSR helper | `@supabase/ssr`               | `^0.12.5` |
| Server-only guard   | `server-only`                 | `^0.0.1`  |
| Transactional email | Resend                        | `^6.6.0`  |
| Validation          | Zod                           | `^4.3.4`  |

- Supabase clients live in `lib/supabase/`: `public.ts` (anon, `server-only`, cookie-free reads), `admin.ts` (service-role, `server-only` writes), plus `server.ts` / `client.ts` (cookie-based, reserved for future auth — Phase B). See `architecture.md`.
- Emails are React components in `components/emails/`, rendered with `react-dom/server`'s `renderToStaticMarkup` inside server actions and sent via Resend.

## UI & styling

| Concern         | Choice                     | Version             |
| --------------- | -------------------------- | ------------------- |
| CSS framework   | Tailwind CSS (v4, PostCSS) | `^4`                |
| Tailwind plugin | `@tailwindcss/postcss`     | `^4`                |
| Class merging   | `clsx` + `tailwind-merge`  | `^2.1.1` / `^3.5.0` |
| Icons           | `lucide-react`             | `^0.577.0`          |
| Carousels       | `embla-carousel-react`     | `^8.6.0`            |

- Tailwind v4 is configured via `@import 'tailwindcss'` in `app/globals.css` and `postcss.config.mjs` — there is **no** `tailwind.config.js`. Theme tokens live as CSS variables in `globals.css`. See `styling.md`.

## Forms & state

| Concern       | Choice                        | Version   |
| ------------- | ----------------------------- | --------- |
| Forms         | `react-hook-form`             | `^7.69.0` |
| RHF resolvers | `@hookform/resolvers` (+ Zod) | `^5.2.2`  |
| Client state  | `zustand` (+ `persist`)       | `^5.0.9`  |

- Client-side stores: `store/cartStore.ts` (cart + promo codes) and `store/compareStore.ts`, both persisted to `localStorage`.

## Tooling

- **Lint:** ESLint 9 (`eslint-config-next`, `eslint-config-prettier`, `eslint-plugin-prettier`) — `eslint.config.mjs` (flat config).
- **Format:** Prettier `3.5.2` — `.prettierrc.json`; ignore rules in `.prettierignore` (skips lockfile, build output, `.agents/`).
- **Git hooks:** `husky` (`^9`) + `lint-staged` (`^17`) run on staged files pre-commit — `eslint --fix` then `prettier --write` on `*.{ts,tsx,js,jsx}` (Prettier only for other types). A staged file with an ESLint **error** aborts the commit; warnings are allowed. `prepare: husky` installs the hook on `npm install`; `.husky/pre-commit` runs `npx lint-staged` (config in `package.json`).
- **Scripts:** `dev`, `build`, `start`, `lint` (`--fix`), `format`, `fix` (lint + format), `prepare` (husky).
- **DB scripts:** `scripts/migrate.cjs`, `scripts/seed-accessories.cjs`, plus raw SQL in `scripts/` and `supabase/`.

## Build & deployment targets

- Standard Next.js build (`next build` → `next start`). No custom `output` mode in `next.config.ts`.
- **Remote image hosts** are allowlisted in `next.config.ts` (`next/image` `remotePatterns`): the Supabase Storage bucket (`sjqoinxhewxxbcczliyl.supabase.co`), `iqos-iluma.com`, and `images.unsplash.com`. Add a host here before rendering its images.
- **ISR:** listing and detail pages set `export const revalidate = 60`; detail pages pre-render via `generateStaticParams`.
- **Locale:** single-locale Russian site (`<html lang="ru">`, `ru_RU` OpenGraph, `Intl.NumberFormat('ru-RU')` for prices).

## Environment variables

Defined in `.env` / `.env.local` (values not committed):

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public, browser-safe.
- `SUPABASE_SERVICE_ROLE_KEY` — **server-only**, bypasses RLS. Never expose to the client.
- `RESEND_API_KEY`, `INTERNAL_EMAIL` — server-only (email sending / admin notifications).
- `NEXT_PUBLIC_YANDEX_METRIKA_ID` — analytics (see `components/YandexMetrika.tsx`).
