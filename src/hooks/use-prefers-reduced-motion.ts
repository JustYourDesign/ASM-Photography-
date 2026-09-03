"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

/** True when the viewer has asked their OS for reduced motion. */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
