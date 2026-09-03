"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GalleryLightbox } from "@/components/gallery/lightbox";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { Chapter, GalleryImage } from "@/lib/data";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/**
 * A six-beat rhythm across a 12-column grid. Photographs keep their real
 * proportions — nothing is cropped to a uniform tile — and the column span is
 * chosen from the orientation so portraits never stretch across the page and
 * landscapes get the width they need.
 */
type Slot = { span: string; offsetY: string; sizes: string };

function slotFor(image: GalleryImage, i: number): Slot {
  const landscape = image.orientation === "landscape";
  const beat = i % 6;

  switch (beat) {
    case 0:
      return landscape
        ? { span: "md:col-span-12", offsetY: "", sizes: "(min-width: 768px) 88vw, 92vw" }
        : { span: "md:col-span-6", offsetY: "", sizes: "(min-width: 768px) 44vw, 92vw" };
    case 1:
      return {
        span: landscape ? "md:col-span-7 md:col-start-6" : "md:col-span-4 md:col-start-8",
        offsetY: "md:mt-20",
        sizes: "(min-width: 768px) 44vw, 92vw",
      };
    case 2:
      return {
        span: landscape ? "md:col-span-8 md:col-start-2" : "md:col-span-5 md:col-start-2",
        offsetY: "md:mt-6",
        sizes: "(min-width: 768px) 52vw, 92vw",
      };
    case 3:
      return {
        span: landscape ? "md:col-span-6 md:col-start-7" : "md:col-span-4 md:col-start-9",
        offsetY: "md:mt-28",
        sizes: "(min-width: 768px) 40vw, 92vw",
      };
    case 4:
      return {
        span: landscape ? "md:col-span-9 md:col-start-3" : "md:col-span-5 md:col-start-4",
        offsetY: "",
        sizes: "(min-width: 768px) 58vw, 92vw",
      };
    default:
      return {
        span: landscape ? "md:col-span-7" : "md:col-span-4 md:col-start-2",
        offsetY: "md:mt-14",
        sizes: "(min-width: 768px) 44vw, 92vw",
      };
  }
}

type EditorialGalleryProps = {
  /** Chaptered weddings. Falls back to `images` when a shoot has no chapters. */
  chapters?: Chapter[];
  images?: GalleryImage[];
};

export function EditorialGallery({ chapters, images }: EditorialGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const groups = useMemo<Chapter[]>(() => {
    if (chapters?.length) return chapters;
    return [{ key: "portraits", title: "", description: "", images: images ?? [] }];
  }, [chapters, images]);

  // Flat index so the lightbox can run the whole story end to end.
  const flat = useMemo(() => groups.flatMap((g) => g.images), [groups]);
  const offsets = useMemo(
    () =>
      groups.reduce<number[]>((acc, g, i) => {
        acc.push(i === 0 ? 0 : acc[i - 1] + groups[i - 1].images.length);
        return acc;
      }, []),
    [groups]
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-figure]").forEach((figure) => {
        gsap.fromTo(
          figure,
          { clipPath: "inset(12% 0% 12% 0%)", opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: { trigger: figure, start: "top 90%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-chapter-head]").forEach((head) => {
        gsap.fromTo(
          head.querySelectorAll("[data-chapter-line]"),
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.3,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: head, start: "top 82%", once: true },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion, groups]);

  return (
    <div ref={rootRef}>
      {groups.map((chapter, gi) => (
        <section key={chapter.key + gi} className="mb-16 md:mb-32">
          {chapter.title && (
            <header
              data-chapter-head
              className="mb-10 grid gap-6 md:mb-20 md:grid-cols-12 md:items-end"
            >
              <div className="md:col-span-7">
                <div className="overflow-hidden">
                  <p data-chapter-line className="label text-beige">
                    Chapter {String(gi + 1).padStart(2, "0")}
                  </p>
                </div>
                <div className="mt-4 overflow-hidden md:mt-6">
                  <h2
                    data-chapter-line
                    className="font-display text-[clamp(2.25rem,6.5vw,5.5rem)] font-light leading-[0.92] text-foreground"
                  >
                    {chapter.title}
                  </h2>
                </div>
              </div>
              <div className="overflow-hidden md:col-span-4 md:col-start-9 md:pb-3">
                <p
                  data-chapter-line
                  className="max-w-sm text-sm leading-[1.9] text-foreground/55"
                >
                  {chapter.description}
                </p>
              </div>
            </header>
          )}

          <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-12 md:gap-x-6 md:gap-y-10">
            {chapter.images.map((img, i) => {
              const slot = slotFor(img, i);
              const flatIndex = offsets[gi] + i;
              return (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setLightboxIndex(flatIndex)}
                  data-cursor="view"
                  aria-label={`Open ${img.title} full size`}
                  className={cn("group block w-full text-left", slot.span, slot.offsetY)}
                >
                  <div
                    data-figure
                    className="dark relative w-full overflow-hidden bg-scrim/5 will-change-[clip-path,opacity]"
                  >
                    <Image
                      src={img.image}
                      alt={img.title}
                      width={img.width}
                      height={img.height}
                      sizes={slot.sizes}
                      quality={80}
                      className="h-auto w-full transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-scrim/0 transition-colors duration-700 group-hover:bg-scrim/15"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <GalleryLightbox
        images={flat}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </div>
  );
}
