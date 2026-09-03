"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { DistortionImage } from "@/components/webgl/distortion-image";
import { staggerItem } from "@/components/animations/fade-in";
import type { Shoot } from "@/lib/data";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type ShootCardProps = {
  categorySlug: string;
  shoot: Shoot;
  /** `feature` is the wedding treatment; `compact` is used for fashion / studio. */
  variant?: "feature" | "compact";
  aspect?: string;
  sizes?: string;
  className?: string;
  /** WebGL hover distortion. Off for the small secondary cards. */
  webgl?: boolean;
};

export function ShootCard({
  categorySlug,
  shoot,
  variant = "compact",
  aspect,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw",
  className,
  webgl,
}: ShootCardProps) {
  const isFeature = variant === "feature";
  const useWebgl = webgl ?? isFeature;
  const aspectClass = aspect ?? (isFeature ? "aspect-[4/5]" : "aspect-[3/4]");

  return (
    <motion.article variants={staggerItem} className={className}>
      <motion.div initial="rest" whileHover="hover" animate="rest">
        <Link
          href={`/portfolio/${categorySlug}/${shoot.slug}`}
          data-cursor="view"
          className="group block"
        >
          <div className={cn("dark relative w-full overflow-hidden bg-scrim", aspectClass)}>
            <motion.div
              variants={{ rest: { scale: 1 }, hover: { scale: 1.055 } }}
              transition={{ duration: 1.3, ease: EASE }}
              className="absolute inset-0"
            >
              {useWebgl ? (
                <DistortionImage
                  src={shoot.cover}
                  alt={shoot.title}
                  sizes={sizes}
                  intensity={0.85}
                  quality={80}
                  objectPosition={shoot.coverPosition}
                />
              ) : (
                <Image
                  src={shoot.cover}
                  alt={shoot.title}
                  fill
                  sizes={sizes}
                  quality={78}
                  className="object-cover"
                  style={{ objectPosition: shoot.coverPosition }}
                />
              )}
            </motion.div>

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-scrim/55 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />

            <span className="absolute right-4 top-4 label text-white/0 transition-colors duration-700 group-hover:text-white/70">
              {shoot.images.length} photographs
            </span>
          </div>

          <div className="mt-4 flex items-start justify-between gap-4 md:mt-5">
            <div className="min-w-0">
              <motion.h3
                variants={{ rest: { x: 0 }, hover: { x: 10 } }}
                transition={{ duration: 0.85, ease: EASE }}
                className={cn(
                  "font-display font-light leading-[1.08] text-foreground",
                  isFeature ? "text-[clamp(1.4rem,2.4vw,2.1rem)]" : "text-xl"
                )}
              >
                {shoot.title}
              </motion.h3>
              <motion.p
                variants={{ rest: { x: 0 }, hover: { x: 10 } }}
                transition={{ duration: 0.85, delay: 0.04, ease: EASE }}
                className="label mt-2.5 truncate text-foreground/45"
              >
                {shoot.location ? (
                  <>
                    {shoot.location}
                    <span className="mx-2 text-foreground/25">/</span>
                    {shoot.year}
                  </>
                ) : (
                  // No location on fashion/studio shoots — a truncated sentence
                  // reads as a bug, so show the count instead.
                  `${shoot.images.length} photographs`
                )}
              </motion.p>
            </div>

            <motion.span
              aria-hidden
              variants={{ rest: { opacity: 0, x: -8 }, hover: { opacity: 1, x: 0 } }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-1 shrink-0 text-foreground"
            >
              <svg
                viewBox="0 0 24 24"
                className={cn(isFeature ? "h-6 w-6" : "h-4 w-4")}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="square" />
              </svg>
            </motion.span>
          </div>
        </Link>
      </motion.div>
    </motion.article>
  );
}
