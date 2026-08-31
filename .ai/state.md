# State Management Conventions

Rules for client state, effects, and loading UI. These are enforced conventions, not suggestions — new code must follow them and existing violations should be migrated when touched. See also `styling.md` (UI) and `architecture.md` (server/data).

Client state lives in **Zustand** (`store/cartStore.ts`, `store/compareStore.ts`, persisted to `localStorage`). There is no global data-fetching state — server data is fetched server-side (see `architecture.md`).

## 1. Always use atomic Zustand selectors

Subscribe to the **narrowest slice** you use. A bare `useStore()` (or destructuring the whole store) subscribes the component to **every** state change, so unrelated updates trigger re-renders. This matters most for components rendered many times (e.g. `AddToCartButton` inside every product card).

```tsx
// ❌ Banned — whole-store subscription: re-renders on any change (items, promo, discount…)
const { items, addToCart } = useCartStore();

// ✅ Required — atomic selectors: re-render only when that slice changes
const items = useCartStore((s) => s.items);
const addToCart = useCartStore((s) => s.addToCart);
```

- Action functions are stable references — selecting them individually never causes extra renders.
- Don't select a slice you only read inside a callback; read it on demand there instead.
- Inside store actions, prefer the **functional** `set((state) => …)` form for updates derived from current state (avoids stale reads and keeps actions consistent).

## 2. Banned: derived-state-from-props via `useEffect`

Never mirror a prop into state and then "sync" it with an effect. It adds a render, invites stale/rogue resets, and is the anti-pattern in `side-effects.md`.

```tsx
// ❌ Banned
const [selected, setSelected] = useState(product);
useEffect(() => {
  setSelected(product);
}, [product]);

// ✅ Reset via `key` — the parent remounts the component when identity changes
<ProductCard key={product.id} product={product} />;

// ✅ Or compute derived values during render (no state at all)
const active = selected ?? product;
```

More generally: **if a value can be computed from props/state, compute it during render** (or `useMemo` if expensive) — do not store it in state and do not use an effect to keep it in sync.

## 3. Global loading UI: use `loading.tsx`, never React Context

Next.js App Router renders `app/**/loading.tsx` automatically via Suspense during navigation and server data fetching. That is the mechanism for route-level loading UI.

- **Do not** build a `LoadingProvider`/`LoadingContext` + timer to fake a global spinner. (Removed in Phase 3A — a context that ran an app-wide `setTimeout` for a loader that wasn't even mounted.)
- The shared loader visual lives in `components/GlobalLoader.tsx` as a **pure presentational** component (no context, no `isLoading` prop) and is rendered from `app/loading.tsx`. Next controls its mount/unmount.
- Add a scoped `loading.tsx` in a route segment folder when that segment needs its own fallback.

## Established patterns (keep)

- **Hydration gate for persisted stores:** persisted Zustand state differs between server (empty) and client (rehydrated from `localStorage`), so a component reading it must avoid a hydration mismatch. The codebase uses a local `mounted` flag (`useState(false)` + set `true` in a mount effect) and renders a neutral fallback until mounted — see `Navbar`, `CartDrawer`, `AddToCartButton`, `CompareButton`, `CompareFloatingBar`, and the compare page. This mount-effect is the one intentional, accepted `setState`-in-effect; do not use effects to set other derived state.
- **Cross-component signals without polling:** to react to a one-off client event (e.g. age verification completing), dispatch a `window` event and listen for it — never poll `localStorage` on a recurring `setTimeout`.
