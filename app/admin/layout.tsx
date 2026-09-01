/**
 * Bare admin wrapper — a neutral full-height canvas with NO visible chrome. The
 * dashboard route group provides its own SaaS shell (sidebar + header) in
 * (dashboard)/layout.tsx, and the login page self-centers its card. Keeping this
 * a chrome-less flex column lets both fill the app-shell <body> without stacking
 * two headers. The auth gate lives one level deeper in (dashboard)/layout.tsx so
 * the login page stays reachable.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className='flex min-h-0 flex-1 flex-col bg-gray-50'>{children}</div>;
}
