"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { DistortionImage } from "@/components/webgl/distortion-image";
import { FadeIn } from "@/components/animations/fade-in";
import { RevealText } from "@/components/animations/reveal-text";
import { weddingShoots } from "@/lib/data";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const FEATURED = weddingShoots.slice(0, 4);

export function FeaturedWeddings() {
  return (
    <section className="mx-auto max-w-[1680px] px-5 py-20 sm:px-8 md:px-12 md:py-32">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
        <h2 className="font-display text-[clamp(2rem,5vw,4.25rem)] font-light leading-[1.02] text-foreground">
          <RevealText text="Featured weddings" />
        </h2>
        <FadeIn delay={0.2}>
          <Link
            href="/portfolio/weddings"
            data-cursor="hidden"
            className="label border-b border-foreground/25 pb-1.5 text-foreground/60 transition-colors duration-500 hover:border-beige hover:text-beige"
          >
            All wedding stories
          </Link>
        </FadeIn>
      </div>

      <div className="flex flex-col gap-16 md:gap-28">
        {FEATURED.map((shoot, i) => (
          <FadeIn
            key={shoot.slug}
            y={48}
            className={cn(
              // Alternating indent keeps the sequence from reading as a list.
              i % 2 === 1 ? "md:ml-[14%]" : "md:mr-[14%]"
            )}
          >
            <motion.article initial="rest" whileHover="hover" animate="rest">
              <Link
                href={`/portfolio/weddings/${shoot.slug}`}
                data-cursor="view"
                className="group block"
              >
                <motion.div
                  variants={{ rest: { scale: 1 }, hover: { scale: 1.015 } }}
                  transition={{ duration: 1.2, ease: EASE }}
                  className="dark relative aspect-[16/10] w-full overflow-hidden bg-scrim md:aspect-[2/1]"
                >
                  <motion.div
                    variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
                    transition={{ duration: 1.4, ease: EASE }}
                    className="absolute inset-0"
                  >
                    <DistortionImage
                      src={shoot.cover}
                      alt={`${shoot.title} — ${shoot.location}`}
                      sizes="(min-width: 768px) 86vw, 100vw"
                      intensity={0.9}
                      quality={80}
                      objectPosition={shoot.coverPosition}
                    />
                  </motion.div>
                </motion.div>

                <div className="mt-5 flex items-start justify-between gap-6 md:mt-7">
                  <div className="min-w-0">
                    <motion.h3
                      variants={{ rest: { x: 0 }, hover: { x: 14 } }}
                      transition={{ duration: 0.9, ease: EASE }}
                      className="font-display text-[clamp(1.6rem,3.4vw,2.9rem)] font-light leading-[1.05] text-foreground"
                    >
                      {shoot.title}
                    </motion.h3>
                    <motion.p
                      variants={{ rest: { x: 0 }, hover: { x: 14 } }}
                      transition={{ duration: 0.9, delay: 0.04, ease: EASE }}
                      className="label mt-3 text-foreground/45"
                    >
                      {shoot.location}
                      <span className="mx-2.5 text-foreground/25">/</span>
                      {shoot.year}
                    </motion.p>
                  </div>

                  <motion.span
                    aria-hidden
                    variants={{
                      rest: { opacity: 0, x: -12 },
                      hover: { opacity: 1, x: 0 },
                    }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="mt-2 shrink-0 text-foreground"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-6 w-6 md:h-8 md:w-8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="square" />
                    </svg>
                  </motion.span>
                </div>
              </Link>
            </motion.article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
