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
- **Zero-lag switching:** variant images are pre-fetched with hidden `<img aria-hidden>` so color changes are instant.

## 9. Trade-In program (`/trade-in`)

- Files: [`app/trade-in/page.tsx`](../app/trade-in/page.tsx), [`app/actions/tradein.ts`](../app/actions/tradein.ts), [`lib/api.ts`](../lib/api.ts) (`getTradeInDevices`, `getTradeInTargets`), `components/trade-in/*`, `components/emails/TradeIn*`.
- **Data:** old devices come from the admin-managed `trade_in_devices` table; target devices are real `products` gadget rows grouped by line with a per-color price. No hardcoded device arrays.
- **Calculator** (`TradeInCalculator`, client): embla carousel of old devices + line/color picker; final price = product price − device discount, savings shown prominently.
- **Form** (`TradeInForm`): slide-over drawer collecting name, phone, optional email, optional Moscow street address, comment.
- **Server action** `submitTradeIn`: Zod-validates → inserts one `orders` row with `order_type = 'trade_in'`, a self-contained `items` snapshot, and structured `metadata.trade_in` (old/target device, color, slug, discount, delivery address) via the **service-role** client → sends internal + client emails via Resend (email failure is non-fatal).
- **Moscow-only:** city is fixed to Москва; only street address is user-entered.
- Wired from Navbar, Footer, and the homepage `TradeInPromoBanner`; `revalidate = 60`; listed in `sitemap.ts`.
