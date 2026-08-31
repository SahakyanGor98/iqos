# Resilience & Security

Conventions for error boundaries and HTTP security headers. See also `seo-perf.md` (metadata, images, deployment), `architecture.md`, and `state.md`.

## 1. Error boundaries

The App Router renders these special files automatically. All three are **branded** (slate `#34303D`, soft-white `#fffdfb`, Russian copy) and give the user a way to recover or get home.

| File                   | Component kind              | Triggers                                                            | Content                                                                                                                                            |
| ---------------------- | --------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/not-found.tsx`    | Server                      | `notFound()` calls (e.g. product `[slug]` pages) + unmatched routes | Branded 404; links to Home (`/`) and catalog (`/products/iqos`).                                                                                   |
| `app/error.tsx`        | **Client** (`'use client'`) | Errors thrown while rendering a route segment                       | Message + **"Попробовать снова"** (`reset()`) + link home. Renders inside the root layout (chrome stays).                                          |
| `app/global-error.tsx` | **Client**                  | Errors thrown in the **root layout itself**                         | Replaces the whole document — renders its own `<html>/<body>` with **inline styles** (the layout's stylesheet isn't guaranteed) + a reload button. |

**Rules:**

- `error.tsx` and `global-error.tsx` **must** be Client Components and receive `{ error, reset }`. Log the error (`console.error`, or a monitoring hook) in a `useEffect`.
- `not-found.tsx` should stay a Server Component (no interactivity needed).
- Reuse the shared `Button` component for navigation/recovery where the app stylesheet is available (not in `global-error`, which is style-isolated).
- Add a **scoped** `error.tsx` (or `not-found.tsx`) inside a route-segment folder when that segment needs its own recovery UI; otherwise the root boundaries cover everything.
- Keep copy calm and actionable — never expose raw error details/stack to the user.

## 2. HTTP security headers

Configured once in `next.config.ts` via `async headers()` applied to all routes (`source: '/:path*'`). Applied at runtime by `next start`, so they ship with the normal VPS deploy flow (no extra steps).

| Header                      | Value                                 | Purpose                                                  |
| --------------------------- | ------------------------------------- | -------------------------------------------------------- |
| `X-DNS-Prefetch-Control`    | `on`                                  | Allow DNS prefetching for faster cross-origin loads.     |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | Force HTTPS. **Only effective over HTTPS.**              |
| `X-Frame-Options`           | `SAMEORIGIN`                          | Anti-clickjacking; the site is never embedded elsewhere. |
| `X-Content-Type-Options`    | `nosniff`                             | Stop MIME sniffing.                                      |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`     | Trim referrer sent cross-origin.                         |

**Rules / caveats:**

- **HSTS `preload` is intentionally omitted** — it's hard to reverse. Add it only once you're fully committed to HTTPS-forever on the domain and all subdomains.
- HSTS is a no-op on plain HTTP; ensure the VPS terminates TLS (behind its reverse proxy) for it to matter.
- Do **not** loosen `X-Frame-Options` unless a genuine embedding need appears (none today; Yandex Metrika only embeds outward).
- **Future hardening (not yet added):** `Permissions-Policy` and a `Content-Security-Policy`. CSP needs care here — it must allow Yandex Metrika, Supabase (images/API), the Next image optimizer, and the inline JSON-LD / theme scripts. Introduce CSP in `Report-Only` mode first.

## Image handling note

- Product images render via `next/image` directly against the Supabase storage URLs (allowlisted in `remotePatterns` — see `seo-perf.md`). The old `app/api/proxy` image-proxy route was removed in Phase 5 once it had no callers, so images no longer pass through an app-level proxy. If a future image host is added, allowlist it in `next.config.ts` `images.remotePatterns` rather than reintroducing a proxy.
