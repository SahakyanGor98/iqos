import type { NextConfig } from 'next';

// Content-Security-Policy. Shipped as `Content-Security-Policy-Report-Only`
// first (non-blocking — violations are reported, nothing is blocked) so we can
// verify the allowlist against real traffic before enforcing.
//
// `script-src`/`style-src` use `'unsafe-inline'` deliberately: this site is
// ISR/statically rendered, and a nonce-based strict policy would force every
// route to dynamic rendering (killing ISR). Inline scripts in play: Next's
// hydration/bootstrap and the Yandex Metrika loader (components/YandexMetrika).
// External hosts: Supabase (storage images + API), Yandex Metrika, and the
// next/image remote hosts. Keep this in sync with next.config images + Metrika.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://mc.yandex.ru https://yastatic.net",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co https://iqos-iluma.com https://images.unsplash.com https://mc.yandex.ru https://mc.yandex.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co https://mc.yandex.ru https://mc.yandex.com",
  "frame-src 'self' https://mc.yandex.ru",
  'upgrade-insecure-requests',
].join('; ');

// Disable powerful features the site never uses.
const permissionsPolicy =
  'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()';

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  // HSTS only takes effect over HTTPS. `preload` intentionally omitted (hard to reverse).
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: permissionsPolicy },
  // Report-only for now — flip the key to 'Content-Security-Policy' to enforce
  // once the console/report stream is clean.
  { key: 'Content-Security-Policy-Report-Only', value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  // Don't let `next build` auto-generate/append to the project's CLAUDE.md.
  agentRules: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sjqoinxhewxxbcczliyl.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'iqos-iluma.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
