'use client';

import { createContext, type ReactNode, useContext } from 'react';

/**
 * Read-only page feature flags made available to Client Components below the
 * (site) layout. The layout reads them server-side (getSiteSettingsMap) and
 * passes them in, so deep client widgets (e.g. the per-card compare button) can
 * respect a flag without prop-drilling through grids/cards. The value is set
 * once per render and only changes when the server re-renders after a toggle —
 * so there is no re-render churn (this is not the banned loading-context
 * pattern; see .ai/state.md).
 */
export type ClientPageFlags = {
  accessories: boolean;
  compare: boolean;
  tradein: boolean;
  about: boolean;
  contact: boolean;
};

const DEFAULT_FLAGS: ClientPageFlags = {
  accessories: true,
  compare: true,
  tradein: true,
  about: true,
  contact: true,
};

const FeatureFlagsContext = createContext<ClientPageFlags>(DEFAULT_FLAGS);

export function FeatureFlagsProvider({
  flags,
  children,
}: {
  flags: ClientPageFlags;
  children: ReactNode;
}) {
  return <FeatureFlagsContext.Provider value={flags}>{children}</FeatureFlagsContext.Provider>;
}

export function usePageFlags(): ClientPageFlags {
  return useContext(FeatureFlagsContext);
}
