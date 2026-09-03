"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DistortionImage } from "@/components/webgl/distortion-image";
import { fashionPreview } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/**
 * The secondary discipline. Set on a dark ground with broken, offset typography
 * and a scroll-driven horizontal drift, so it reads as a different register from
 * the wedding work above without competing with it for size.
 */
export function FashionPreview() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        track,
        { x: () => window.innerWidth * 0.12 },
        {
          x: () => -window.innerWidth * 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>("[data-fashion-word]").forEach((word, i) => {
        gsap.fromTo(
          word,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.4,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: root, start: "top 72%", once: true },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      className="dark relative overflow-hidden bg-scrim py-20 text-white md:py-32"
    >
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 md:px-12">
        <p className="label text-white/40">{fashionPreview.eyebrow}</p>

        {/* Experimental, broken lockup */}
        <h2 className="mt-7 font-display font-light leading-[0.82] text-white md:mt-10">
          <span className="block overflow-hidden">
            <span
              data-fashion-word
              className="block text-[clamp(2.75rem,12vw,10rem)]"
            >
              Fashion
            </span>
          </span>
          <span className="block overflow-hidden pl-[8%] md:pl-[22%]">
            <span
              data-fashion-word
              className="block text-[clamp(2rem,8vw,7rem)] italic text-white/45"
            >
              / Editorial
            </span>
          </span>
        </h2>
      </div>

      {/* Horizontal drift */}
      <div className="relative mt-14 md:mt-20">
        <div
          ref={trackRef}
          className="flex w-full gap-4 px-5 will-change-transform sm:px-8 md:gap-8 md:px-12"
        >
          {fashionPreview.images.map((img, i) => (
            <div
              key={img.src}
              className={cn(
                "relative shrink-0 overflow-hidden bg-white/5",
                "h-[38vw] w-[58vw] md:h-[24vw] md:w-[30vw]",
                // Staggered baselines — an editorial spread, not a filmstrip.
                i % 2 === 1 && "mt-10 md:mt-20",
                i === 2 && "md:h-[30vw]"
              )}
            >
              <DistortionImage
                src={img.src}
                alt={img.alt}
                sizes="(min-width: 768px) 30vw, 58vw"
                intensity={1.6}
                quality={78}
                objectPosition={img.position}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1680px] flex-wrap items-end justify-between gap-8 px-5 sm:px-8 md:mt-20 md:px-12">
        <p className="max-w-md text-[0.95rem] leading-[1.9] text-white/55">
          {fashionPreview.body}
        </p>
        <Link
          href={fashionPreview.href}
          data-cursor="hidden"
          className="label border-b border-white/30 pb-1.5 text-white/70 transition-colors duration-500 hover:border-white hover:text-white"
        >
          View Fashion / Editorial
        </Link>
      </div>
    </section>
  );
}
