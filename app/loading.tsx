import { GlobalLoader } from '@/components';

// Root loading UI: Next.js renders this via Suspense during navigation and
// server data fetching, then unmounts it when the segment is ready.
export default function Loading() {
  return <GlobalLoader />;
}
