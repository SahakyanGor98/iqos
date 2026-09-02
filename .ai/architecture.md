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

- **Route groups:** the public storefront lives in `app/(site)/` (its layout owns the Navbar/footer/toasts chrome); the authenticated back-office lives in `app/admin/` (bare wrapper + `login/` + a protected `(dashboard)/` group with its own SaaS shell). See features.md §§11–15.
- **Server Actions** live in `app/actions/`: storefront (`checkout.ts`, `tradein.ts`, `contact.ts`) and admin (`auth.ts`, `settings.ts`, `messages.ts`, `orders.ts`, `products-admin.ts`), each marked `'use server'`.
- Root layout `app/layout.tsx` owns only `<html>/<body>` (global metadata, JSON-LD, fonts, the `h-[100dvh]` flex-column shell); each route group's layout fills it. The storefront chrome lives in `app/(site)/layout.tsx`, not the root.

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

- `products` — catalog (`gadget` | `sticks` | `water` | `accessories`; the CHECK allows all four and the admin panel manages every category — see features.md §14). `attributes`/`badges` are JSONB; filtering uses `attributes->>key`. RLS on, **public SELECT**; admin writes via the service role.
- `orders` — one row per purchase or trade-in (`order_type`), with a self-contained `items` JSONB snapshot + `metadata`. `status` follows a fixed lifecycle (`pending` → `confirmed` → `shipped` → `completed`, + `cancelled`) enforced by `orders_status_check`. **RLS on, no anon policies** — admin reads/writes via the service role behind the `/admin` auth gate.
- `order_items` — FK line items for purchases. Same lock-down as `orders` (its FK blocks hard-deleting a referenced product).
- `contact_messages` — RLS on, anon INSERT allowed, no anon SELECT. `status` is `new` | `read` (admin inbox); admin reads/writes via the service role.
- `trade_in_devices` — admin-managed calculator list. RLS on, **public SELECT**.
- `site_settings` — CMS feature flags (key-value, jsonb value, `group_name`). RLS on, **public SELECT**, **authenticated UPDATE** only. See features.md §10.

### Auth (current)

- **Storefront visitors are anonymous** — no account, no session cookie. Cart and compare state live client-side in `localStorage` via Zustand (`store/cartStore.ts`, `store/compareStore.ts`); guest checkout / trade-in write through service-role server actions.
- **The `/admin` panel is authenticated** (Supabase email + password) — this is Phase B, now live for the admin surface. `proxy.ts` (the Next 16 proxy/middleware convention; the request-bound Supabase logic lives in `lib/supabase/middleware.ts`) refreshes the session on every request and gates `/admin`; `lib/supabase/server.ts` (cookie-bound) reads the session in `app/admin/(dashboard)/layout.tsx` and the login action (`app/actions/auth.ts`); cookies are `httpOnly`/`secure`/`sameSite=lax` via `@supabase/ssr`. Admin screens read the RLS-locked tables (`orders`, `contact_messages`, plus `products` for consistency) through the **service-role** client _behind_ that auth gate, with an explicit `getUser()` re-check in each write action. `site_settings` is the exception: its UPDATE runs under the admin JWT and is enforced by RLS. See features.md §§10–15.

---

## Target Architecture

Direction for evolving data access and (future) authentication. Migrated in two phases. **Phase A is complete** — it is the current implementation described above. **Phase B (cookie-based auth) is now live for the `/admin` panel** — see the Auth section above; per-user storefront accounts remain out of scope (guest checkout stays).

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

### Phase B — Secure, cookie-based auth _(implemented for the `/admin` panel)_

Now live for the admin surface (login, `proxy.ts` session refresh, cookie-bound reads in the `(dashboard)` layout). The points below describe the pattern in use. Note the admin deliberately reads/writes the RLS-locked tables via the **service role behind the auth gate** rather than per-user RLS — there is a single admin role, not per-user data, so RLS-per-user (below) applies only if/when storefront accounts are introduced (still not planned; guest checkout remains).

- Use `lib/supabase/server.ts` + `lib/supabase/client.ts` for session management via cookies instead of `localStorage`, refreshed per request in `proxy.ts` (via the `lib/supabase/middleware.ts` helper).
- **Cookies must be `httpOnly`, `secure`, `sameSite=lax`** so tokens are never readable by JS (the `@supabase/ssr` helpers set these by default).
- **Authorize with RLS, not the service role.** Once users exist, authed reads/writes run under the user's JWT so RLS enforces per-user access. Reserve `admin.ts` for genuinely privileged server-only tasks.
- Gate protected routes/actions by checking the session server-side; redirect unauthenticated users before rendering.
- Guest checkout can remain, but should migrate to per-user RLS policies once orders are tied to accounts, retiring the "no anon read + service-role write" workaround for authenticated flows.
