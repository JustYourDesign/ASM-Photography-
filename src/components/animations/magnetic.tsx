"use client";

import { useRef } from "react";
import gsap from "gsap";
import type { ReactNode } from "react";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

export function Magnetic({ children, className, strength = 0.4 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);

  const ensureQuickSetters = () => {
    if (!ref.current) return;
    if (!quickX.current) {
      quickX.current = gsap.quickTo(ref.current, "x", {
        duration: 0.6,
        ease: "power3.out",
      });
    }
    if (!quickY.current) {
      quickY.current = gsap.quickTo(ref.current, "y", {
        duration: 0.6,
        ease: "power3.out",
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    ensureQuickSetters();
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    quickX.current?.(relX * strength);
    quickY.current?.(relY * strength);
  };

  const handleMouseLeave = () => {
    ensureQuickSetters();
    quickX.current?.(0);
    quickY.current?.(0);
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
