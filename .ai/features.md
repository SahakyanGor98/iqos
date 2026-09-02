# Custom Features & Implementation Notes

Feature-level "why/how" knowledge that isn't obvious from the code alone. For stack, routing, data access, and styling conventions see [`stack.md`](stack.md), [`architecture.md`](architecture.md), and [`styling.md`](styling.md).

---

## 1. Polymorphic Button & haptics

- Files: [`components/Button.tsx`](../components/Button.tsx), [`components/ButtonTypes.ts`](../components/ButtonTypes.ts), [`components/HapticLink.tsx`](../components/HapticLink.tsx).
- One `forwardRef` component renders a Next.js `<Link>` when `href` is set, else a `<button>`.
- Variant/size/shadow enums live in the non-`'use client'` `ButtonTypes.ts` so they can be imported from Server Components without pulling in client code.
- Haptic feedback via the Vibration API: `triggerHaptic()` in `lib/utils.ts` calls `navigator.vibrate` (guarded for SSR/unsupported browsers); `Button` defaults `hapticPattern` to `10`.

## 2. Brand casing & title formatting (`lib/utils.ts`)

- `fixCasing(title, uppercase?)` — keeps a lowercase "i" in "IQOS ILUMA i" (preserves the dot).
- `formatDeviceTitle(title, iqosColor?, remainingColor?)` — wraps "IQOS" in the `--font-christ` script face with optional colors; returns a React fragment.
- `formatPrice(price)` — RU thousands separators + non-breaking space before `₽` (e.g. `12 990 ₽`).
- `getDeviceColorSwatch()` / `DEVICE_COLOR_SWATCH_MAP` — see feature 8.

## 3. Reusable content components

- [`components/FaqAccordion.tsx`](../components/FaqAccordion.tsx) — object-props pattern (`items`, `initialVisibleCount`, `enableExpandButton`, `title`, `subtitle`); multiline answers via `whitespace-pre-line`; smooth collapse with `grid-rows-[0fr] opacity-0`.
- [`components/TextSeparator.tsx`](../components/TextSeparator.tsx) — section divider used throughout the landing page.

## 4. About IQOS page (`/about/iqos`) — 7-act storytelling flow

- Files: [`app/about/iqos/page.tsx`](../app/about/iqos/page.tsx), [`lib/content/iqos-about.ts`](../lib/content/iqos-about.ts), and `components/about/` (`AboutComparisonTable`, `AboutTechHighlights`, `AboutFactsGrid`, `AboutSections`, `IqosLineupSection`).
- Narrative order: Hero → why IQOS (no combustion >600°C) → what the aerosol is (heat-not-burn ~300–350°C) → `AboutComparisonTable` (vs cigarettes / vs e-cigs) → `AboutTechHighlights` (temperature gauge, SMARTCORE induction, TEREA anatomy, benefits, flavor categories, compatibility) → history timeline 2008–2024 → lineup + facts grid + FAQ + CTA.
- Image placement idiom: `relative aspect-[4/3] overflow-hidden -mx-4 md:mx-0 rounded-none md:rounded-2xl bg-neutral-100` — edge-to-edge on mobile, rounded side-by-side on desktop.

## 5. Content datasets (`lib/content/`)

- [`faq.ts`](../lib/content/faq.ts) — `LANDING_FAQ` (ordering, delivery, payment, TEREA compatibility) and `ABOUT_FAQ` (SMARTCORE, HEETS incompatibility, ILUMA models, cleaning).
- [`iqos-about.ts`](../lib/content/iqos-about.ts) — `CIGARETTE_VS_IQOS_TABLE`, `ECIG_VS_IQOS`, `SMARTCORE_BENEFITS`, `TEREA_CATEGORIES`, `IQOS_KEY_FACTS`, `IQOS_DEVICE_LINEUP`.
- [`trade-in.ts`](../lib/content/trade-in.ts) — trade-in page copy.
- Keep hardcoded marketing copy in these datasets, not inline in components.

## 6. Russian phone validation

- Client forms ([`CheckoutForm.tsx`](../components/CheckoutForm.tsx), [`ContactForm.tsx`](../components/ContactForm.tsx), [`trade-in/TradeInForm.tsx`](../components/trade-in/TradeInForm.tsx)) and their server actions share this regex:
  ```
  /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
  ```
- Validation is enforced **both** client-side (react-hook-form + Zod) and again server-side in the action.

## 7. Staged product filtration

- Files: [`components/ProductFilters.tsx`](../components/ProductFilters.tsx), [`app/products/<cat>/page.tsx`](../app/products/iqos/page.tsx).
- Filters edit a local **draft** state and only commit to the URL `searchParams` on **Apply** (`Применить`), avoiding a server round-trip on every checkbox. **Reset All** (`Сбросить всё`) clears draft + URL. Uses `useTransition` (`isPending` → "Загрузка…").
- Server pages read the committed `searchParams` and pass results down; filter section config (price range / color / line / inStock) is defined per catalog page.

## 8. Device color swatches & model-line grouping

- Files: [`lib/grouping.ts`](../lib/grouping.ts), [`components/ProductGrid.tsx`](../components/ProductGrid.tsx), [`components/ProductCard.tsx`](../components/ProductCard.tsx), [`lib/utils.ts`](../lib/utils.ts), [`app/products/iqos/[slug]/page.tsx`](../app/products/iqos/[slug]/page.tsx).
- **Grouping:** `getGroupedCards` in `lib/grouping.ts` collapses device rows sharing `attributes.line` (`i`, `i-one`, `i prime`, …) into one catalog card.
- **Default color per line:** `MODEL_DEFAULT_COLORS` in `lib/grouping.ts` picks the initial swatch (`i` → breeze blue, `i-one` → digital violet, `i prime` → aspen green). Note the trade-in flow keeps its own parallel `TRADE_IN_DEFAULT_COLORS` in `lib/api.ts`.
- **Interactive swatch:** `ProductCard` renders swatches under the title; clicking one swaps image/title/price/stock/slug/cart payload without triggering the card link (`stopPropagation` + `preventDefault`). Hidden when a line has ≤1 variant (e.g. Seletti editions).
- **Swatch colors:** `DEVICE_COLOR_SWATCH_MAP` in `lib/utils.ts` maps multilingual (RU + EN) color keywords → hex/gradient backgrounds; matched first-wins.
- **Faster switching:** variant images are pre-fetched with a hidden `<img aria-hidden>` (a direct Supabase URL) to warm the browser cache for color switching. Note: the visible product images use `next/image` (see `seo-perf.md`), so this raw-`<img>` preload is a best-effort cache warm rather than a guaranteed instant swap.

## 9. Trade-In program (`/trade-in`)

- Files: [`app/trade-in/page.tsx`](../app/trade-in/page.tsx), [`app/actions/tradein.ts`](../app/actions/tradein.ts), [`lib/api.ts`](../lib/api.ts) (`getTradeInDevices`, `getTradeInTargets`), `components/trade-in/*`, `components/emails/TradeIn*`.
- **Data:** old devices come from the admin-managed `trade_in_devices` table; target devices are real `products` gadget rows grouped by line with a per-color price. No hardcoded device arrays.
- **Calculator** (`TradeInCalculator`, client): embla carousel of old devices + line/color picker; final price = product price − device discount, savings shown prominently.
- **Form** (`TradeInForm`): slide-over drawer collecting name, phone, optional email, optional Moscow street address, comment.
- **Server action** `submitTradeIn`: Zod-validates → inserts one `orders` row with `order_type = 'trade_in'`, a self-contained `items` snapshot, and structured `metadata.trade_in` (old/target device, color, slug, discount, delivery address) via the **service-role** client → sends internal + client emails via Resend (email failure is non-fatal).
- **Moscow-only:** city is fixed to Москва; only street address is user-entered.
- Wired from Navbar, Footer, and the homepage `TradeInPromoBanner`; `revalidate = 60`; listed in `sitemap.ts`.

## 10. CMS feature flags (`site_settings`)

- Files: [`lib/settings.ts`](../lib/settings.ts) (reads), [`app/actions/settings.ts`](../app/actions/settings.ts) (admin write), [`components/FeatureFlagsProvider.tsx`](../components/FeatureFlagsProvider.tsx) (client context), admin UI in `app/admin/(dashboard)/settings/`. Table: `site_settings` (see `supabase/migrations/2026090*_*.sql`).
- **Model:** one key-value row per flag (`value` jsonb boolean, `group_name` for UI grouping — `banners` / `pages`). RLS: **public SELECT** (storefront reads), **authenticated UPDATE** only (admin toggles run under the admin JWT). Seeded via migration; the admin never invents keys.
- **Reads are ISR-safe:** `getSiteSettingsMap()` / `isFeatureEnabled(key)` use the cookie-free `supabasePublic` client wrapped in React `cache()`. Defaults live in `DEFAULT_SITE_SETTINGS` — banners/promo + the (disabled) accessories page default **OFF**; the live secondary pages (compare/tradein/about/contact) default **ON** (fail-open) so nothing 404s before the seed migration runs.
- **Current flags:** banners (`banner_water`, `banner_floating_promo`, `promo_homepage`) and page gates (`page_accessories`, `page_compare`, `page_tradein`, `page_about`, `page_contact`).
- **Page gating pattern:** the route Server Component calls `notFound()` when its flag is off; the `(site)` layout hides the matching Navbar/Footer links (via a single `pages` object) and the homepage banners; `sitemap.ts` omits disabled routes. For deep **client** widgets that must react to a flag (the per-card compare button), the layout feeds flags into `FeatureFlagsProvider` and the widget reads `usePageFlags()` — no prop-drilling.
- **Applying a toggle:** `updateSiteSetting` writes under the admin JWT, then `revalidatePath('/', 'layout')` (+ sitemap) so ISR storefront pages re-read on the next request.

## 11. Admin panel — shell & auth

- Route group: `app/admin/` with a bare wrapper (`app/admin/layout.tsx`, a chrome-less `bg-gray-50` canvas), a public `login/` (outside the protected group so it stays reachable), and the protected `(dashboard)/` group. `app/admin/(dashboard)/layout.tsx` is a Server Component that gates on `getUser()` (defense-in-depth on top of `proxy.ts`) and renders the SaaS shell.
- **Shell:** `AdminSidebar` (client, fixed `w-64`, active link via `usePathname`) + `AdminHeader` (client, route-derived title + sign out) around a scrolling `<main>`, sized to fit the app-shell `100dvh` body so only content scrolls. Nav is driven by one source of truth: `app/admin/(dashboard)/nav-config.tsx`.
- **UI convention:** plain Tailwind + `cn()` + the brand `<Button>` — **no component library** (shadcn/Mantine were evaluated and removed; see `styling.md`). Cards are `rounded-2xl border border-gray-200 bg-white`.
- **Auth:** Supabase email+password (`app/actions/auth.ts` `signIn`/`signOut`). All dashboard pages export `robots: { index: false }`. See `architecture.md` → Auth for the session/cookie/service-role model.
- **Trust model:** admin screens read the RLS-locked tables via the **service-role** client (server-only) behind the auth gate; each mutation re-checks `getUser()` and validates input with Zod before writing.

## 12. Admin — Messages inbox (`/admin/messages`)

- Files: [`lib/messages.ts`](../lib/messages.ts) (service-role read), [`app/actions/messages.ts`](../app/actions/messages.ts) (`updateMessageStatus`), `app/admin/(dashboard)/messages/`.
- Lists `contact_messages` newest-first, split into **Новые / Прочитанные** tabs (`?status=`), with `mailto:`/`tel:` links. `MessageStatusButton` optimistically toggles `status` between `new`/`read` (service-role write behind an auth re-check — `contact_messages` has no authenticated UPDATE policy), then revalidates the inbox + the dashboard "new messages" count.

## 13. Admin — Orders management (`/admin/orders`)

- Files: [`lib/admin-orders.ts`](../lib/admin-orders.ts) (reads), [`app/actions/orders.ts`](../app/actions/orders.ts) (`updateOrderStatus`), status config in [`lib/orders.ts`](../lib/orders.ts), UI in `app/admin/(dashboard)/orders/`.
- **Status lifecycle:** `pending → confirmed → shipped → completed`, + `cancelled` — canonical `ORDER_STATUSES`/`ORDER_STATUS_META` in `lib/orders.ts` (client-safe), validated in the action and enforced by the `orders_status_check` DB constraint (`supabase/migrations/20260902_orders_status.sql`).
- **List:** status filter chips with counts, type + status badges. **Detail** (`[id]`): customer block, then either a purchase line-items table (subtotal/discount/total from the `items` snapshot) or the trade-in breakdown from `metadata.trade_in`, plus a one-click `OrderStatusControl`. Reads/writes via the service role (orders is RLS-locked).

## 14. Admin — Products CRUD (`/admin/products`)

- Files: [`lib/product-form.ts`](../lib/product-form.ts) (client-safe config + Zod schema), [`lib/admin-products.ts`](../lib/admin-products.ts) (reads), [`app/actions/products-admin.ts`](../app/actions/products-admin.ts) (create/update/delete), UI in `app/admin/(dashboard)/products/`.
- Manages **all four categories including accessories** (56 rows live in `products`; `assets/accessories.json` is only a fallback). List has a category filter + title/slug search; a shared create/edit `ProductForm` handles core fields, **URL-list images** (with preview — there is no upload; images are Storage URLs), badge checkboxes (preserving unknown badge keys like `bestseller`), and a **JSON `attributes` editor** (attributes vary by category).
- **Delete** is a two-step guarded action: hard-deletes unless the product is referenced by `order_items` (FK `23503`), in which case it explains and suggests marking out of stock; duplicate slug surfaces `23505`. Every mutation revalidates the admin views **and** the affected public catalog pages (mapping `gadget→iqos`, `sticks→terea`, `accessories→accessories`) + sitemap.

## 15. Admin — Dashboard (`/admin`)

- Files: [`lib/admin-stats.ts`](../lib/admin-stats.ts), `app/admin/(dashboard)/page.tsx`.
- Four **actionable** stat cards (concurrent service-role counts): new orders (`status='pending'`), total orders, active products (`in_stock=true`), new messages (`status='new'`) — each links into its filtered section. A failed count renders `—` (never a misleading `0`).
