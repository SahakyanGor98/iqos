# IQOS Web Application - Developer & AI Context

This file serves as a reference for AI coding assistants and developers. Please read this file at the start of any session to immediately understand the project architecture, tech stack, and history of custom features.

---

## 🚀 Project Overview & Tech Stack

This is a premium e-commerce/catalog application for IQOS products built with:
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Vanilla CSS (in `globals.css`)
- **Database / Backend**: Supabase
- **Validation**: Zod (for client and server validation)
- **State Management**: React Context (e.g., global loading)

---

## 📁 Key Directory Structure

```text
├── app/
│   ├── actions/        # Next.js Server Actions (e.g., checkout, contact)
│   ├── globals.css     # Global styles & animations
│   └── layout.tsx      # Global root layout wrapping the app
├── components/         # Reusable UI & Feature components (e.g., ProductFilters, CheckoutForm)
├── context/            # React context providers (e.g., LoadingContext)
├── public/             # Static assets (images, icons)
├── supabase/           # Supabase config/database files
└── store/              # State store (Zustand or Redux if applicable)
```

---

## 🛠️ History of Custom Features & Implementations

Here is a summary of the major features we have built and worked on together:

### 1. Global Pulse Loader Screen
- **Files**: 
  - [GlobalLoader.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/GlobalLoader.tsx)
  - [LoadingContext.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/context/LoadingContext.tsx)
  - [layout.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/app/layout.tsx)
  - [globals.css](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/app/globals.css)
- **Details**:
  - Implements a premium "frosted glass" fullscreen loading screen (`backdrop-blur-md`, `bg-white/80`).
  - Uses the centered `/icon3.png` logo with a CSS pulsing animation.
  - Fades out after an automatic hydration delay of `800ms` when initial mounting is complete.
- **Usage**:
  ```tsx
  import { useLoading } from '@/context/LoadingContext';
  const { setIsLoading } = useLoading();
  // Show:
  setIsLoading(true);
  // Hide:
  setIsLoading(false);
  ```

### 2. Russian Phone Number Validation
- **Files**:
  - Form components: [CheckoutForm.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/CheckoutForm.tsx) and [ContactForm.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/ContactForm.tsx)
  - Server actions: [checkout.ts](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/app/actions/checkout.ts) and [contact.ts](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/app/actions/contact.ts)
- **Regex**:
  `const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;`
- **Details**:
  - Strictly validates Russian phone number input on both client-side (via Zod error messages in Russian) and server-side (enforced inside backend actions).
  - Supports formats: `+79991234567`, `89991234567`, `+7 (999) 123-45-67`, etc.

### 3. Staged Product Filtration & Sticky Footer
- **Files**:
  - [ProductFilters.tsx](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/components/ProductFilters.tsx)
  - [globals.css](file:///c:/Users/Gor/Desktop/Gor/sayt/iqos/app/globals.css)
- **Details**:
  - Converts active filter inputs (checkboxes, price sliders, toggles) to follow a **staged workflow** via `stagedParams` local state, preventing constant URL updates and page reloads during selection.
  - Adds a premium sticky footer with two buttons: **Apply** and **Reset All**.
  - On desktop, the sidebar stays sticky to the viewport (`top-24`) with an internal scroll container (`max-h-[calc(100vh-120px)]`) styled with a sleek scrollbar (`.custom-scrollbar`).
  - On mobile, the drawer automatically closes upon hitting the "Apply" button.

### 4. Hero Slider Custom Slide
- **Files**:
  - `HeroSlider.tsx`
  - `public/heroTerea.webp`
- **Details**:
  - Added a 2nd slide specifically highlighting the new **TEREA collection**, linking to `/products/terea`.
  - The slide transitions automatically every 5 seconds.
