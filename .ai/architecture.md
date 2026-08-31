# Architecture

How routing, the Server/Client boundary, and data access work today — plus the intended target state.

## Routing structure (App Router)

All routes are under `app/`. Pages are **React Server Components by default** — including `app/compare/page.tsx`, which exports `metadata` and delegates its interactive UI to a Client child (`app/compare/CompareContent.tsx`).

| Route                                      | File                                              | Notes                                                                                           |
| ------------------------------------------ | ------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `/`                                        | `app/page.tsx`                                    | Landing (hero, sections, FAQ, CTA).                                                             |
| `/products/{iqos,terea,water,accessories}` | `app/products/<cat>/page.tsx`                     | Catalog listings; read `searchParams` for filters/sort/pagination.                              |
| `/products/<cat>/[slug]`                   | `app/products/<cat>/[slug]/page.tsx`              | Product detail; `generateStaticParams` + `generateMetadata`.                                    |
| `/trade-in`                                | `app/trade-in/page.tsx`                           | Trade-in calculator + form.                                                                     |
| `/compare`                                 | `app/compare/page.tsx`                            | Server page rendering a Client child (`CompareContent.tsx`); backed by `store/compareStore.ts`. |
| `/contact`, `/about/iqos`                  | `app/contact/page.tsx`, `app/about/iqos/page.tsx` | Static-ish content pages.                                                                       |
| `robots`, `sitemap`                        | `app/robots.ts`, `app/sitemap.ts`                 | Metadata routes.                                                                                |

- **Server Actions** live in `app/actions/` (`checkout.ts`, `tradein.ts`, `contact.ts`), each marked `'use server'`.
- Root layout `app/layout.tsx` sets global metadata, JSON-LD, fonts (`next/font/local`), analytics, and the persistent chrome (Navbar, footer disclaimer, toasts, age gate). The `<body>` is `h-[100dvh]` with an internally-scrolling `<main>`.

## Server vs. Client component boundary

- **Server (default):** every `page.tsx` (including `/compare`, which renders a Client child), all `generateMetadata`/`generateStaticParams`, and the data layer in `lib/`.
- **Client (`'use client'`):** ~35 components under `components/` (plus `app/compare/CompareContent.tsx`). These are interactive/stateful: forms (`CheckoutForm`, `ContactForm`, `TradeInForm`), stores-consumers (`CartDrawer`, `AddToCartButton`, `CompareButton`, `ProductGrid`), carousels/sliders, toasts, and the age-verification gate.
- **Pattern:** Server pages fetch data through `lib/api.ts`, compute/group it (e.g. `lib/grouping.ts`), and pass plain serializable props into Client components. Client components own interaction and local state only.

## Data fetching & database access

Supabase clients live in `lib/supabase/` (built on `@supabase/ssr` + the `server-only` package), split by trust level and rendering needs — full table under "Supabase client layout" below. In brief:

- **Reads** go through `lib/api.ts` (marked `server-only`), which uses the cookie-free anon client `lib/supabase/public.ts`. Cookie-free keeps catalog pages ISR/SSG-safe; `server-only` means `lib/api.ts` can never be bundled into a Client Component.
- **Writes** run in `'use server'` actions using the service-role client `lib/supabase/admin.ts` (also `server-only`, **bypasses RLS**): `checkout.ts` and `tradein.ts` write `orders`/`order_items`; `contact.ts` writes `contact_messages`. All three use this one trusted server path.
- **Client Components never import `lib/api.ts`.** When they need catalog data they call a Server Action in `app/actions/products.ts` (e.g. the compare page's share-link hydration and the compare add-modal).

Read functions in `lib/api.ts`: `getProducts`, `getProductBySlug`, `getProductsBySlugs`, `getAllSlugs`, `getIqosLineupProducts`, `getTradeInDevices`, `getTradeInTargets`. Accessories fall back to a local JSON asset (`assets/accessories.json`) when the DB query is empty/errors.

Writes flow through Server Actions: validate with Zod → insert via `supabaseAdmin` → render an email component and send via Resend (best-effort; email failures are caught and logged, the order still succeeds).

### Database (Supabase / Postgres)

Reference schema: `supabase/schema.sql`; changes in `supabase/migrations/`.

- `products` — catalog (`gadget` | `sticks` | `water`; `accessories` handled separately). `attributes`/`badges` are JSONB; filtering uses `attributes->>key`. RLS on, **public SELECT**.
- `orders` — one row per purchase or trade-in (`order_type`), with a self-contained `items` JSONB snapshot + `metadata`. **RLS on, no anon policies** — writes only via service role, no anon read.
- `order_items` — FK line items for purchases. Same lock-down as `orders`.
- `contact_messages` — RLS on, anon INSERT allowed, no anon SELECT.
- `trade_in_devices` — admin-managed calculator list. RLS on, **public SELECT**.

### Auth (current)

There are **no user accounts** — every visitor is an anonymous guest. There is no session, no login, and no auth cookie. Cart and compare state live client-side in `localStorage` via Zustand (`store/cartStore.ts`, `store/compareStore.ts`).

---

## Target Architecture

Direction for evolving data access and (future) authentication. Migrated in two phases. **Phase A is complete** — it is the current implementation described above. **Phase B is auth-gated and not started** (begin only when user accounts / an admin surface are actually introduced — there is no point standing up cookie/middleware machinery for a session that doesn't exist yet).

### Supabase client layout (`lib/supabase/`)

Adopt `@supabase/ssr` + `server-only` and split clients by trust level and rendering needs:

| File                     | Client                                                    | Key             | Cookies?                    | Used by                                         |
| ------------------------ | --------------------------------------------------------- | --------------- | --------------------------- | ----------------------------------------------- |
| `lib/supabase/public.ts` | anon (`createClient`), `server-only`                      | anon            | **no** — stays ISR/SSG-safe | `lib/api.ts` public reads                       |
| `lib/supabase/server.ts` | `createServerClient`, cookie-bound (async `next/headers`) | anon (user JWT) | yes                         | authed server reads / actions (**Phase B**)     |
| `lib/supabase/admin.ts`  | service-role (`createClient`), `server-only`              | service role    | no                          | privileged writes (checkout, trade-in, contact) |
| `lib/supabase/client.ts` | `createBrowserClient`                                     | anon            | yes                         | interactive client auth (**Phase B**)           |

> **Why `public.ts` is separate from `server.ts`:** public catalog reads must remain statically renderable. The cookie-bound `server.ts` client reads `cookies()` from `next/headers`, which opts a route into dynamic rendering and would break `generateStaticParams` / `revalidate`. Public, unauthenticated reads therefore use a non-cookie, `server-only` anon client so ISR is preserved.

### Phase A — Strictly server-side data fetching _(done)_

- **All Supabase reads execute on the server** — Server Components, Server Actions, Route Handlers. No Supabase client is bundled into or invoked from a Client Component.
- **`lib/api.ts` is `server-only`** (imports `server-only`) and reads through `lib/supabase/public.ts`. An accidental client import now fails the build.
- **`lib/supabase/admin.ts` is `server-only`** so the service-role key can never be bundled to the browser.
- **Client components fetch via Server Actions, not `lib/api` directly.** The two former client-side reads now go through `app/actions/products.ts`:
  - `app/compare/page.tsx` → `fetchCompareProductsBySlugs` (share-link hydration).
  - `components/CompareAddModal.tsx` → `fetchCompareCandidates`.
- **Writes go through the trusted server path.** `contact.ts` now uses `supabaseAdmin` like `checkout.ts` / `tradein.ts` (consistent server-side writes) instead of the anon client.
- **ISR preserved:** catalog pages keep `revalidate = 60` and `generateStaticParams`. Use `revalidatePath`/`revalidateTag` after mutations that change catalog/order state.
- Keep serialized props minimal at the Server→Client boundary (pass the fields a component uses, not whole rows).

### Phase B — Secure, cookie-based auth _(planned; do when accounts arrive)_

- Use `lib/supabase/server.ts` + `lib/supabase/client.ts` for session management via cookies instead of `localStorage`, refreshed per request in `middleware.ts`.
- **Cookies must be `httpOnly`, `secure`, `sameSite=lax`** so tokens are never readable by JS (the `@supabase/ssr` helpers set these by default).
- **Authorize with RLS, not the service role.** Once users exist, authed reads/writes run under the user's JWT so RLS enforces per-user access. Reserve `admin.ts` for genuinely privileged server-only tasks.
- Gate protected routes/actions by checking the session server-side; redirect unauthenticated users before rendering.
- Guest checkout can remain, but should migrate to per-user RLS policies once orders are tied to accounts, retiring the "no anon read + service-role write" workaround for authenticated flows.
