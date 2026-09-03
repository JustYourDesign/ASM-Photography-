"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type RevealFigureProps = {
  src: string;
  alt: string;
  sizes: string;
  /** Tailwind aspect class, e.g. "aspect-[4/5]". */
  aspect?: string;
  className?: string;
  /** Vertical drift as a % of the image box, applied across the scroll range. */
  parallax?: number;
  caption?: string;
  captionClassName?: string;
  priority?: boolean;
  quality?: number;
  delay?: number;
  /** CSS object-position focal point for the crop. */
  objectPosition?: string;
};

/**
 * The house image treatment: a slow clip-path reveal on entry plus a small
 * scroll-linked drift. Both are skipped entirely under reduced motion.
 */
export function RevealFigure({
  src,
  alt,
  sizes,
  aspect = "aspect-[4/5]",
  className,
  parallax = 6,
  caption,
  captionClassName,
  priority,
  quality = 80,
  delay = 0,
  objectPosition,
}: RevealFigureProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const frame = frameRef.current;
    const inner = innerRef.current;
    if (!frame || !inner || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        frame,
        { clipPath: "inset(14% 0% 14% 0%)", opacity: 0 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 1.5,
          delay,
          ease: "power2.out",
          scrollTrigger: { trigger: frame, start: "top 88%", once: true },
        }
      );

      gsap.fromTo(
        inner,
        { yPercent: -parallax, scale: 1.12 },
        {
          yPercent: parallax,
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }, frame);

    return () => ctx.revert();
  }, [delay, parallax, reducedMotion]);

  return (
    <figure className={cn("relative", className)}>
      <div
        ref={frameRef}
        className={cn("dark relative w-full overflow-hidden bg-scrim/5", aspect)}
      >
        <div ref={innerRef} className="absolute inset-0 will-change-transform">
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            quality={quality}
            className="object-cover"
            style={objectPosition ? { objectPosition } : undefined}
          />
        </div>
      </div>
      {caption && (
        <figcaption className={cn("label mt-4 text-foreground/40", captionClassName)}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
