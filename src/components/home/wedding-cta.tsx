"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedButton } from "@/components/ui/animated-button";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Closing wedding call to action. The background photograph scales slowly across
 * the whole time the section is on screen — the movement should be felt, not seen.
 */
export function WeddingCTA() {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const image = imageRef.current;
    if (!root || !image || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        image,
        { scale: 1.02 },
        {
          scale: 1.16,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      className="dark relative isolate flex min-h-[85vh] items-center overflow-hidden bg-scrim py-28 text-white md:min-h-[92vh] md:py-40"
    >
      <div ref={imageRef} className="absolute inset-0 -z-10 will-change-transform">
        <Image
          src="/images/home/cta.jpg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          quality={82}
          className="object-cover object-center"
        />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-scrim/55" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-scrim/80 via-transparent to-scrim/40"
      />

      <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 md:px-12">
        <div className="max-w-4xl">
          <p className="label text-white/60">Enquiries open</p>

          <h2 className="mt-8 font-display text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.98] text-white">
            Your wedding deserves
            <br />
            more than photographs.
          </h2>

          <p className="mt-8 font-display text-[clamp(1.3rem,2.6vw,2.1rem)] font-light italic leading-[1.35] text-white/70">
            Let&rsquo;s create something{" "}
            <span className="font-cursive not-italic text-beige [font-size:1.15em]">timeless</span>.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <AnimatedButton href="/contact" variant="light">
              Inquire For Your Wedding
            </AnimatedButton>
            <a
              href="mailto:hello@asmphotography.co.za"
              data-cursor="hidden"
              className="label border-b border-white/30 pb-1.5 text-white/70 transition-colors duration-500 hover:border-white hover:text-white"
            >
              hello@asmphotography.co.za
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
