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
