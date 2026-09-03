"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import type { PortfolioCategory } from "@/lib/data";
import { categoryImageCount } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Category carousel where the selected discipline physically takes more space.
 * Weddings opens active, and the panels grow/shrink with GSAP rather than a CSS
 * transition so the easing matches the rest of the site.
 */
export function CategoryCarousel({ categories }: { categories: PortfolioCategory[] }) {
  const [active, setActive] = useState(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    panelRefs.current.forEach((panel, i) => {
      if (!panel) return;
      const grow = i === active ? 3.2 : 1;
      if (reducedMotion) {
        gsap.set(panel, { flexGrow: grow });
        return;
      }
      gsap.to(panel, {
        flexGrow: grow,
        duration: 1.15,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    });
  }, [active, reducedMotion]);

  return (
    <div>
      <div className="flex flex-col gap-3 md:h-[68vh] md:min-h-[460px] md:max-h-[720px] md:flex-row md:gap-4">
        {categories.map((cat, i) => {
          const isActive = i === active;
          return (
            <div
              key={cat.slug}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              style={{ flexGrow: i === 0 ? 3.2 : 1, flexBasis: 0 }}
              className="dark relative min-w-0 overflow-hidden bg-scrim"
            >
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                aria-label={`Show ${cat.title}`}
                className={cn(
                  "absolute inset-0 z-20 h-full w-full",
                  isActive && "pointer-events-none"
                )}
                data-cursor="hidden"
              />

              <div
                className={cn(
                  // Mobile stacks with capped heights; desktop fills the flex row.
                  "relative w-full overflow-hidden transition-[height] duration-700 md:h-full md:max-h-none",
                  isActive ? "h-[62vw] max-h-[520px]" : "h-[26vw] max-h-[180px]"
                )}
              >
                <Image
                  src={cat.cardImage}
                  alt={cat.title}
                  fill
                  sizes="(min-width: 768px) 60vw, 100vw"
                  quality={80}
                  className={cn(
                    "object-cover transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isActive ? "scale-100 grayscale-0" : "scale-105 grayscale"
                  )}
                />
                <div
                  aria-hidden
                  className={cn(
                    "absolute inset-0 transition-colors duration-1000",
                    isActive
                      ? "bg-gradient-to-t from-scrim/92 from-10% via-scrim/45 via-45% to-transparent"
                      : "bg-scrim/55"
                  )}
                />

                <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 md:p-8">
                  <p
                    className={cn(
                      "label transition-opacity duration-700",
                      isActive ? "text-white/70 opacity-100" : "opacity-0"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")} / {String(categories.length).padStart(2, "0")}
                    <span className="mx-2.5 text-white/30">·</span>
                    {categoryImageCount(cat)} photographs
                  </p>

                  <h3
                    className={cn(
                      "mt-3 font-display font-light leading-[0.95] text-white transition-all duration-1000",
                      isActive
                        ? "text-[clamp(2rem,5.5vw,4.75rem)]"
                        : "text-[clamp(1.1rem,2vw,1.6rem)] text-white/70"
                    )}
                  >
                    {cat.title}
                  </h3>

                  <div
                    className={cn(
                      "grid transition-all duration-1000",
                      isActive
                        ? "mt-4 grid-rows-[1fr] opacity-100"
                        : "mt-0 grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-md text-sm leading-[1.8] text-white/60">
                        {cat.description}
                      </p>
                      <Link
                        href={`/portfolio/${cat.slug}`}
                        data-cursor="view"
                        className="relative z-30 mt-6 inline-block label border-b border-white/40 pb-1.5 text-white/85 transition-colors duration-500 hover:border-white hover:text-white"
                      >
                        Open {cat.shortTitle}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
        {categories.map((cat, i) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "label border-b pb-1.5 transition-colors duration-500",
              i === active
                ? "border-beige text-beige"
                : "border-transparent text-foreground/40 hover:text-foreground/70"
            )}
          >
            {cat.title}
          </button>
        ))}
      </div>
    </div>
  );
}
