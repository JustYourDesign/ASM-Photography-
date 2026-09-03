"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to a media query. Returns `serverValue` during SSR and the first
 * client render so hydration stays stable, then the real match.
 */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue
  );
}
