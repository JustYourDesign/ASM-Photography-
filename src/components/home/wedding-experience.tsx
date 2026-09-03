"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { weddingExperience } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/**
 * "The wedding photography experience" — five chapters read as one scroll.
 *
 * Desktop pins a single image column and cross-fades through it while the text
 * blocks pass; each block also shifts horizontally so the typography never sits
 * in quite the same place twice. Mobile drops the pin and stacks image + text.
 */
export function WeddingExperience() {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      blockRefs.current.forEach((block, i) => {
        if (!block) return;

        if (!reducedMotion) {
          gsap.fromTo(
            block.querySelectorAll("[data-reveal]"),
            { yPercent: 60, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 1.2,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: { trigger: block, start: "top 82%", once: true },
            }
          );
        }

        ScrollTrigger.create({
          trigger: block,
          start: "top 62%",
          end: "bottom 62%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    imageRefs.current.forEach((el, i) => {
      if (!el) return;
      const on = i === active;
      if (reducedMotion) {
        gsap.set(el, { autoAlpha: on ? 1 : 0, scale: 1 });
        return;
      }
      gsap.to(el, {
        autoAlpha: on ? 1 : 0,
        scale: on ? 1 : 1.06,
        duration: 1.3,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    });
  }, [active, reducedMotion]);

  return (
    <section ref={rootRef} className="relative py-20 md:py-32">
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 md:px-12">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-24">
          <h2 className="font-display text-[clamp(2rem,5vw,4.25rem)] font-light leading-[1.02] text-foreground">
            The wedding
            <br />
            photography experience
          </h2>
          <p className="label text-foreground/40">
            {String(active + 1).padStart(2, "0")} / {String(weddingExperience.length).padStart(2, "0")}
          </p>
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-16 lg:gap-24">
          {/* Pinned image column (desktop) */}
          <div className="hidden md:block">
            {/* Height-constrained rather than aspect-driven so the pinned frame
                always fits the viewport, whatever the column width. */}
            <div className="dark sticky top-[16vh] h-[68vh] max-h-[720px] min-h-[420px] w-full overflow-hidden bg-scrim">
              {weddingExperience.map((item, i) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  className="absolute inset-0 will-change-transform"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="45vw"
                    quality={80}
                    className="object-cover"
                  />
                </div>
              ))}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-scrim/60 to-transparent"
              />
              <p className="absolute bottom-6 left-6 label text-white/70">
                {weddingExperience[active].title}
              </p>
            </div>
          </div>

          {/* Text blocks */}
          <div>
            {weddingExperience.map((item, i) => (
              <div
                key={item.id}
                ref={(el) => {
                  blockRefs.current[i] = el;
                }}
                className={cn(
                  "flex flex-col justify-center border-b border-foreground/10 py-12 last:border-b-0 md:min-h-[72vh] md:py-0",
                  // Typography drifts across the column rather than sitting in a rail.
                  i % 3 === 1 && "md:pl-10 lg:pl-16",
                  i % 3 === 2 && "md:pl-5 lg:pl-8"
                )}
              >
                {/* Mobile image */}
                <div className="dark relative mb-8 aspect-[4/5] w-full overflow-hidden bg-scrim md:hidden">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="100vw"
                    quality={78}
                    className="object-cover"
                  />
                </div>

                <div className="overflow-hidden">
                  <p data-reveal className="label text-beige">
                    {item.index} — {item.title}
                  </p>
                </div>
                <div className="mt-5 overflow-hidden md:mt-7">
                  <h3
                    data-reveal
                    className="font-display text-[clamp(2rem,4.4vw,3.5rem)] font-light leading-[1.05] text-foreground"
                  >
                    {item.title}
                  </h3>
                </div>
                <div className="mt-5 max-w-md overflow-hidden md:mt-8">
                  <p
                    data-reveal
                    className="text-[0.95rem] leading-[1.9] text-foreground/60 md:text-base"
                  >
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
