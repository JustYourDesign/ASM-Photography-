"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useIsCoarsePointer } from "@/hooks/use-is-coarse-pointer";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type Variant = "default" | "view" | "hidden";

const RING = { default: 40, view: 76, hidden: 0 } as const;

/**
 * Desktop-only custom cursor. Hover state is resolved by delegation on the
 * document, so it keeps working across client-side navigation and for elements
 * mounted after this component (galleries, carousels, menus).
 */
export function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const isCoarse = useIsCoarsePointer();
  const reducedMotion = usePrefersReducedMotion();
  const [variant, setVariant] = useState<Variant>("default");

  const enabled = !isCoarse && !reducedMotion;

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const ringX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3.out" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });

    const move = (e: MouseEvent) => {
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);

      const target = e.target as HTMLElement | null;
      const match = target?.closest?.("[data-cursor]") as HTMLElement | null;
      const next = (match?.dataset.cursor as Variant | undefined) ?? "default";
      setVariant((current) => (current === next ? current : next));
    };

    const leave = () => setVariant("hidden");

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const size = RING[variant];

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden rounded-full border border-white/70 mix-blend-difference transition-[width,height,margin] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:block"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
        }}
      >
        {variant === "view" && (
          <span className="flex h-full w-full items-center justify-center text-[9px] uppercase tracking-[0.25em] text-white">
            View
          </span>
        )}
      </div>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-[2px] -mt-[2px] hidden h-1 w-1 rounded-full bg-beige md:block"
      />
    </>
  );
}
