# SEO, Performance & Production Readiness

Conventions for metadata, code-splitting, and deployment. See also `architecture.md` (server/data), `state.md` (client state), `styling.md` (UI).

## 1. Metadata — Next.js Metadata API only

All `<head>` tags come from the **Next.js Metadata API** — never hand-rolled `<head>` tags or a third-party head manager.

- **Base config** lives in `app/layout.tsx`: `metadataBase`, `title.template` (`%s | IQOS & TEREA`), default title/description, `openGraph`, `twitter`, `icons`, canonical. Page metadata merges over this.
- **Static routes:** `export const metadata: Metadata = { … }`.
- **Dynamic routes** (`[slug]`): `export async function generateMetadata({ params })` that fetches real data via `lib/supabase/public.ts` (through `lib/api.ts`) and sets `title`, `description`, `alternates.canonical`, and `openGraph.images`. This stays ISR-safe because the public client is cookie-free (see `architecture.md`).
- **A Client Component page cannot export `metadata`.** If a route must be client-driven (e.g. `/compare`), split it: a **Server Component `page.tsx`** exports the metadata and renders a `'use client'` child, passing any needed `searchParams` down as props.

## 2. Performance — `next/dynamic` to protect LCP

Use `next/dynamic` **strictly** for Client Components that are **below the fold** or **triggered by interaction** (modals, drawers, bottom-of-page sliders). The goal is to keep the initial/critical JS small so the Largest Contentful Paint region renders fast.

- **`{ ssr: false }` only works inside a Client Component** (Next 16). A Server Component may use `dynamic(..., { ssr: true })` (code-splits the chunk but keeps SSR) — never `ssr: false`.
- **Above-the-fold content MUST use standard imports** — dynamic-importing it would delay the LCP. In this codebase that means **`HeroSlider`** (homepage hero) and **`ProductImageCarousel`** (product-detail gallery, the LCP image) stay standard imports. Do not wrap them.
- Import the dynamic target from its **specific file path**, not the `@/components` barrel, so the chunk is actually split:
  ```tsx
  const CartDrawer = dynamic(() => import('@/components/CartDrawer').then((m) => m.CartDrawer), {
    ssr: false,
  });
  ```
- Prefer splitting heavy dependencies behind interaction. Example: `CheckoutForm` (pulls in `react-hook-form` + `zod`) is dynamically imported inside `CartDrawer` so those libs load only when the user starts checkout.

### Current dynamic-import map

| Component              | Where                        | Fold / trigger     | Import                 |
| ---------------------- | ---------------------------- | ------------------ | ---------------------- |
| `HeroSlider`           | homepage                     | above fold (LCP)   | **standard**           |
| `ProductImageCarousel` | product detail               | above fold (LCP)   | **standard**           |
| `CompareAddModal`      | `/compare` (client)          | click (modal)      | `dynamic`, `ssr:false` |
| `CartDrawer`           | `Navbar` (client)            | click (drawer)     | `dynamic`, `ssr:false` |
| `CheckoutForm`         | `CartDrawer` (client)        | click (checkout)   | `dynamic`, `ssr:false` |
| `TradeInForm`          | `TradeInCalculator` (client) | click (slide-over) | `dynamic`, `ssr:false` |
| `TradeInCalculator`    | `/trade-in` (server page)    | below fold         | `dynamic`, `ssr:true`  |

## 3. Production configuration & deployment (Cloud4Box VPS)

**Deployment model: `next build` + `next start` under pm2** (process name `iqos`, running from `/var/www/iqos`). The VPS is small (**1.8 GB RAM**) and `next build` is memory-heavy — it OOM-kills on the box — so the **primary deploy builds in CI and ships the finished artifact; the VPS only runs `next start`, never compiles.**

### Primary: CI build + artifact deploy (GitHub Actions)

- Workflow: [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml), **manually triggered** (Actions tab → _Deploy to production_ → Run workflow). Auto-deploy on push is intentionally off because we commit straight to `main`; add a `push` trigger to enable full CD.
- Runner steps: `npm ci` → `npm run build` (with the `NEXT_PUBLIC_*` secrets) → `rsync` the build output to the VPS → on the VPS run `npm ci --omit=dev && pm2 reload iqos`. Shipped paths: `.next/` (minus `cache`), `public/`, `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`. `--delete` is scoped to `.next/` and `public/` only, so the server's `.env`, `node_modules`, and `.git` are never touched.
- **Required GitHub Secrets:**

  | Secret                          | Purpose                                                       |
  | ------------------------------- | ------------------------------------------------------------- |
  | `NEXT_PUBLIC_SUPABASE_URL`      | build-time — inlined into client bundle + ISR fetch           |
  | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | build-time — inlined into client bundle + ISR fetch           |
  | `NEXT_PUBLIC_YANDEX_METRIKA_ID` | build-time — inlined into client bundle                       |
  | `DEPLOY_HOST`                   | VPS host/IP                                                   |
  | `DEPLOY_USER`                   | SSH user (e.g. `root`)                                        |
  | `DEPLOY_PATH`                   | app dir on the VPS (e.g. `/var/www/iqos`)                     |
  | `DEPLOY_SSH_KEY`                | private SSH key; its public half in the VPS `authorized_keys` |

- **Server-only secrets stay on the VPS `.env`** and are loaded by Next at runtime — never add them to CI: `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `INTERNAL_EMAIL`.
- **VPS prerequisites:** `rsync` installed; `node`/`npm`/`pm2` reachable from a login shell (the reload step runs `bash -lc`, so ensure your profile puts them on `PATH` — if you see `pm2: command not found`, that's the cause); the `iqos` pm2 process already exists; `.env` present in `DEPLOY_PATH`.
- Keep the runner's Node major in sync with the VPS via [`.nvmrc`](../.nvmrc) (currently `24`).

### Fallback: manual build on the VPS

Works but slow — use only if CI is unavailable, and **it must not OOM**:

- The box needs **≥ ~2 GB swap** (peak build RSS ~1.2 GB _on top of_ the running app). One-time: `fallocate -l 4G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile` (persist in `/etc/fstab`).
- **Stop the app first to free its RAM:** `pm2 stop iqos` → build → `pm2 start iqos`.
- Steps: `git pull` → `npm ci` → `npm run build` → `pm2 restart iqos`. **Do _not_ `rm -rf .next`** — it deletes `.next/cache` and forces a cold, slower, more memory-hungry rebuild every time. To clear stale output while keeping the cache: `find .next -mindepth 1 -maxdepth 1 ! -name cache -exec rm -rf {} +`.

### Other notes

- **Do not enable `output: 'standalone'`** unless the deployment moves to Docker/containers or otherwise wants a self-contained server. It is incompatible with `next start` (must run `node .next/standalone/server.js`) and does not copy `public/` or `.next/static` into the output — both changes would break the current pm2 flow.
- **`next/image` remote hosts** are allowlisted in `next.config.ts` `images.remotePatterns` — the Supabase public storage bucket (`sjqoinxhewxxbcczliyl.supabase.co`, `/storage/v1/object/public/**`, matching `NEXT_PUBLIC_SUPABASE_URL`), plus `iqos-iluma.com` and `images.unsplash.com`. Add a host here before rendering its images with `next/image`.
