# IQOS Web Application - Developer & AI Context

This file serves as a reference for AI coding assistants and developers. Please read this file at the start of any session to immediately understand the project architecture, tech stack, and history of custom features.

---

## 🚀 Project Overview & Tech Stack

This is a premium e-commerce/catalog application for IQOS products built with:

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Vanilla CSS (in `globals.css`)
- **Database / Backend**: Supabase
- **State Management**: Zustand (`store/cartStore.ts`) & React Context (`LoadingContext.tsx`)
- **Typography**: Arial / Helvetica sans-serif with custom Christ font (`--font-christ` for cursive "IQOS" script logo styling)

---

## 📁 Key Directory Structure

```text
├── app/
│   ├── about/iqos/     # About IQOS page & components
│   ├── actions/        # Next.js Server Actions (e.g., checkout, contact)
│   ├── products/       # Product catalog & dynamic detail pages ([slug])
│   ├── globals.css     # Global styles & design system tokens
│   └── layout.tsx      # Global root layout wrapping the app
├── components/         # Reusable UI & Feature components
│   ├── about/          # About page subcomponents (Comparison tables, Tech highlights, Lineup, Facts grid)
│   ├── Button.tsx      # Unified polymorphic button component
│   ├── ButtonTypes.ts  # Non-client button enums (ButtonVariant, ButtonSize, ButtonShadow)
│   ├── FaqAccordion.tsx# Reusable collapsible FAQ accordion component
│   └── TextSeparator.tsx# Reusable section divider component
├── context/            # React context providers (e.g., LoadingContext)
├── lib/
│   ├── api.ts          # Supabase API data fetching queries
│   ├── constants.ts    # Route constants and app configuration
│   ├── content/        # Content datasets (iqos-about.ts, faq.ts)
│   └── utils.ts        # Formatting helpers (formatDeviceTitle, fixCasing, formatPrice)
├── public/             # Static assets (images, icons)
├── store/              # State store (Zustand cartStore)
└── types/              # TypeScript definitions (product.ts)
```

---

## 🗄️ Database Schema (Supabase)

Canonical reference: [`supabase/schema.sql`](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/supabase/schema.sql). Typed row shapes: [`types/supabase.ts`](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/types/supabase.ts). Last reconciled against the live DB on **2026-08-31**.

| Table | Purpose | Key columns |
| --- | --- | --- |
| `products` | Catalog items | `slug`, `title`, `image text[]`, `price`, `category` (`gadget`\|`sticks`\|`water`), `in_stock`, `badges`/`attributes` (jsonb), `brand` |
| `orders` | One row per checkout order **and** trade-in request | `user_name`, `user_email`, `user_phone`, `user_message`, `total_amount`, `status` (`pending`) |
| `order_items` | Line items for a purchase order | `order_id`→`orders.id`, `product_id`→`products.id`, `quantity`, `price_at_time` |
| `contact_messages` | Contact form submissions | `name`, `email`, `phone`, `message`, `status` (`new`) |

**Notes & known gaps:**

- Writes happen from **server actions** using the **anon** key (`lib/supabase.ts`), so an INSERT path is reachable for `anon`. Confirm `anon` cannot `SELECT` `orders`/`order_items`/`contact_messages` before exposing an admin panel.
- `orders` currently has **no line-item snapshot** and no `order_type`/`discount` columns — order contents live only in `order_items` (purchases) and are lost for anything without catalog product IDs (e.g. trade-in). See "Trade-In → Orders" plan below.
- The `products.category` value `accessories` exists in the live DB but is owned by a separate feature branch; not modelled on this branch.
- The Supabase **DB password** is not in `.env.local` yet (only `host`/`port`/`database`/`user`), so DDL migrations must currently be applied via the Supabase dashboard SQL editor or MCP.

---

## 🛠️ History of Custom Features & Implementations

### 1. Unified Polymorphic Button Component & Haptics

- **Files**:
  - [Button.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/Button.tsx)
  - [ButtonTypes.ts](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/ButtonTypes.ts)
  - [HapticLink.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/HapticLink.tsx)
- **Details**:
  - Polymorphic button system supporting both HTML `<button>` and Next.js `<Link>` elements.
  - Enums defined in `ButtonTypes.ts` to prevent client/server boundary issues: `ButtonVariant` (`PRIMARY`, `SECONDARY`, `SECONDARY_WHITE`, `LIGHT`), `ButtonSize`, and `ButtonShadow`.
  - Integrated HTML5 Vibration API (`navigator.vibrate(12)`) on click/touch for haptic feedback.

---

### 2. Brand Casing & Title Formatting Utilities

- **Files**:
  - [utils.ts](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/lib/utils.ts)
- **Functions**:
  - `fixCasing(text, preserveILUMAi)`: Enforces a lowercase "i" in all occurrences of "IQOS ILUMA i" to preserve the dot above the "i".
  - `formatDeviceTitle(text, options)`: Wraps "IQOS" in the Christ script font with customizable colors (`iqosColor`, `remainingColor`).
  - `formatPrice(price)`: Formats prices cleanly using thousands separators with non-breaking spaces (e.g., `12 990 ₽`).

---

### 3. Reusable Component Architecture

- **Files**:
  - [FaqAccordion.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/FaqAccordion.tsx)
  - [TextSeparator.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/TextSeparator.tsx)
- **Details**:
  - `FaqAccordion`: Reusable accordion component taking an object argument props pattern (`items`, `initialVisibleCount`, `enableExpandButton`, `title`, `subtitle`). Supports multiline list answers via `whitespace-pre-line` and smooth `0px` collapse transitions (`grid-rows-[0fr] opacity-0`).
  - `TextSeparator`: Standalone section divider component exported from `@/components`.

---

### 4. About IQOS Page (`/about/iqos`) & 7-Act Storytelling Flow

- **Files**:
  - [page.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/app/about/iqos/page.tsx)
  - [iqos-about.ts](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/lib/content/iqos-about.ts)
  - [AboutComparisonTable.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/about/AboutComparisonTable.tsx)
  - [AboutTechHighlights.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/about/AboutTechHighlights.tsx)
  - [AboutFactsGrid.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/about/AboutFactsGrid.tsx)
  - [AboutSections.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/about/AboutSections.tsx)
- **7-Act Narrative Flow**:
  1. **Hero**: Main title _"Что такое IQOS?"_ & intro.
  2. **Act 1 Narrative**: _"Почему появился IQOS?"_ (Eliminating combustion at >600°C).
  3. **Act 2 Narrative**: _"Что представляет собой аэрозоль IQOS?"_ (Heat-not-burn ~300–350°C, aerosol vs smoke).
  4. **Act 3**: `AboutComparisonTable` (_IQOS vs Cigarettes_ & _IQOS vs E-cigarettes_).
  5. **Act 4**: `AboutTechHighlights` (_Temperature gauge_, _SMARTCORE INDUCTION SYSTEM™_, _TEREA stick anatomy image_, _4 benefits_, _flavor categories_, _compatibility rules_).
  6. **Act 5 Narrative**: _"История развития IQOS"_ (Timeline 2008–2024 R&D & Evolution).
  7. **Act 6 & 7**: `IqosLineupSection`, `AboutFactsGrid` (_8 Key Facts Summary & Adult Smoker Positioning_), `FaqAccordion`, and `CTA`.
- **Image Placement Pattern**:
  - Images in `AboutDefaultSection` and `AboutTechHighlights` use `relative aspect-[4/3] overflow-hidden -mx-4 md:mx-0 rounded-none md:rounded-2xl bg-neutral-100` so on mobile they break out edge-to-edge (`-mx-4`), and on desktop they sit side-by-side with text (`md:rounded-2xl`).

---

### 5. Content Datasets & FAQ

- **Files**:
  - [faq.ts](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/lib/content/faq.ts): Stores `LANDING_FAQ` (Ordering, Delivery, Payment, TEREA compatibility) and `ABOUT_FAQ` (SMARTCORE induction, HEETS incompatibility, ILUMA models, zero cleaning).
  - [iqos-about.ts](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/lib/content/iqos-about.ts): Stores `CIGARETTE_VS_IQOS_TABLE`, `ECIG_VS_IQOS`, `SMARTCORE_BENEFITS`, `TEREA_CATEGORIES`, `IQOS_KEY_FACTS`, `IQOS_DEVICE_LINEUP`.

---

### 6. Russian Phone Number Validation & Forms

- **Files**:
  - Form components: [CheckoutForm.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/CheckoutForm.tsx) and [ContactForm.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/ContactForm.tsx)
  - Server actions: [checkout.ts](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/app/actions/checkout.ts) and [contact.ts](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/app/actions/contact.ts)
- **Regex**:
  `const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;`

---

### 7. Staged Product Filtration

- **Files**:
  - [ProductFilters.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/ProductFilters.tsx)
  - [globals.css](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/app/globals.css)
- **Details**:
  - Staged workflow via `stagedParams` local state, preventing constant URL reloads during filter selection.
  - Sticky footer with **Apply** and **Reset All** buttons.

---

### 8. IQOS Device Color Swatches & Model Line Grouping

- **Files**:
  - [ProductCard.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/ProductCard.tsx)
  - [ProductGrid.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/ProductGrid.tsx)
  - [utils.ts](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/lib/utils.ts)
  - [page.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/app/products/iqos/[slug]/page.tsx)
- **Details**:
  - **Model Line Grouping**: `ProductGrid` groups device variants sharing the same `attributes.line` (e.g., `i`, `i-one`, `i prime`) into a single model card in the catalog.
  - **Preferred Model Default Colors**: `MODEL_DEFAULT_COLORS` in `ProductGrid` explicitly controls the default selected color for each device line (`i` -> Breeze Blue, `i-one` -> Digital Violet, `i prime` -> Aspen Green).
  - **Interactive Swatch Controller**: `ProductCard` renders circular swatches directly below the device title. Clicking a swatch dynamically updates image, title, color label, price, stock status, slug link, and cart payload without triggering parent card link navigation (`e.stopPropagation()` and `e.preventDefault()`).
  - **Single-Version Hiding**: Swatches are hidden when `colorVariants.length <= 1` (e.g., Seletti editions).
  - **Declarative Swatch Config**: `DEVICE_COLOR_SWATCH_MAP` in `lib/utils.ts` maps multilingual color keywords to HEX/gradient swatch backgrounds.
  - **Instant Image Preloading**: Background hidden image preloading (`<img className="hidden" aria-hidden="true" />`) pre-fetches variant images on render so color switching has 0ms lag.

---

### 9. Trade-In Program (`/trade-in`)

- **Files**:
  - [app/trade-in/page.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/app/trade-in/page.tsx)
  - [app/actions/tradein.ts](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/app/actions/tradein.ts)
  - [lib/content/trade-in.ts](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/lib/content/trade-in.ts)
  - [components/trade-in/](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/trade-in/) (`TradeInHero`, `TradeInCalculator`, `TradeInForm`, `TradeInSteps`, `TradeInBenefits`)
  - [components/TradeInPromoBanner.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/TradeInPromoBanner.tsx)
  - [components/emails/TradeInNotification.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/emails/TradeInNotification.tsx)
- **Details**:
  - **Online Calculator**: `TradeInCalculator` lets the user pick an old device (`OLD_DEVICES`) and a target `IQOS ILUMA` (`TARGET_DEVICES`); discount and final price update live. Discount is a flat per-device amount via `getDeviceDiscount` (`baseDiscount ?? DEFAULT_TRADE_IN_DISCOUNT`) — device condition does **not** affect pricing.
  - **Slide-Over Form**: "Оформить обмен" opens `TradeInForm` as a right-hand drawer (matching `CartDrawer`/`CheckoutForm`), locking body scroll. Collects name, phone, optional email, optional Moscow street address, and comment.
  - **Server Action**: `submitTradeIn` validates with Zod, persists the lead to the Supabase `contact_messages` table (returns an error to the user if the insert fails), then sends an internal Resend notification (`TradeInNotification`) to `INTERNAL_EMAIL`. Email failure is non-fatal since the lead is already saved.
  - **Moscow-Only**: City is hardcoded to Москва in the form and message body; only the street address is user-entered.
  - **Marketing Copy**: Max-discount messaging ("до 2 500 ₽") is kept in sync with the highest `baseDiscount` in `OLD_DEVICES`.
  - **Wiring**: Linked from `Navbar`, `Footer`, and a homepage `TradeInPromoBanner`; route is `ROUTES.tradeIn` (`/trade-in`) and included in `sitemap.ts`.
