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

## 3. Production configuration (Cloud4Box VPS)

- **Deployment model: `next build` + `next start`, managed by pm2.** The app is deployed on the VPS with the standard build/start flow, not `output: 'standalone'`. Deploy steps: `git pull` → `npm install` → `rm -rf .next` → `npm run build` → `pm2 restart iqos` (the `iqos` pm2 process runs `next start`).
- **Do not enable `output: 'standalone'`** unless the deployment moves to Docker/containers or otherwise wants a self-contained server. It is incompatible with `next start` (must run `node .next/standalone/server.js`) and does not copy `public/` or `.next/static` into the output — both changes would break the current pm2 flow.
- **`next/image` remote hosts** are allowlisted in `next.config.ts` `images.remotePatterns` — the Supabase public storage bucket (`sjqoinxhewxxbcczliyl.supabase.co`, `/storage/v1/object/public/**`, matching `NEXT_PUBLIC_SUPABASE_URL`), plus `iqos-iluma.com` and `images.unsplash.com`. Add a host here before rendering its images with `next/image`.
