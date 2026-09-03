"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * True on touch devices. Assumes coarse until proven otherwise so the desktop-only
 * embellishments (custom cursor, mouse parallax, WebGL hover) never flash on mobile.
 */
export function useIsCoarsePointer() {
  return useMediaQuery("(pointer: coarse)", true);
}
