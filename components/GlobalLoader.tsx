import { LoaderCircle } from 'lucide-react';

/**
 * Pure presentational loader. Rendered by app/loading.tsx, so Next.js controls
 * its mount/unmount via Suspense during navigation and server data fetching —
 * it has no `isLoading` prop and no context (see .ai/state.md §3).
 *
 * The spinner animation lives on the wrapping <div>, not the <svg>, so the
 * browser can hardware-accelerate it (see the animate-svg-wrapper rule).
 */
export const GlobalLoader = () => {
  return (
    <div
      className='fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-md pointer-events-none'
      role='status'
      aria-label='Загрузка'
    >
      <div className='animate-spin'>
        <LoaderCircle className='w-12 h-12 md:w-16 md:h-16 text-white' strokeWidth={2.5} />
      </div>
    </div>
  );
};
