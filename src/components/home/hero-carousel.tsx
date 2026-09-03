"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { heroSlides } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useIsCoarsePointer } from "@/hooks/use-is-coarse-pointer";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6200;
const TRANSITION_S = 1.5;
/** Mouse parallax is deliberately almost imperceptible: depth, not movement. */
const PARALLAX_PX = 12;
const DRAG_THRESHOLD = 64;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const zoomRefs = useRef<(HTMLDivElement | null)[]>([]);
  const parallaxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLSpanElement>(null);

  const indexRef = useRef(0);
  const transition = useRef<gsap.core.Timeline | null>(null);
  const progressTween = useRef<gsap.core.Tween | null>(null);

  const reducedMotion = usePrefersReducedMotion();
  const isCoarse = useIsCoarsePointer();

  const total = heroSlides.length;

  /* ---------------------------------------------------------------- slides */

  const goTo = useCallback(
    (next: number, direction: 1 | -1) => {
      const from = indexRef.current;
      const to = ((next % total) + total) % total;
      if (to === from) return;

      // A new move supersedes one in flight: snap the previous transition to its
      // end state rather than dropping the input. (Also means a transition that
      // stalled — a backgrounded tab suspends rAF — can never wedge the carousel.)
      if (transition.current) {
        transition.current.progress(1).kill();
        transition.current = null;
      }

      const outgoing = slideRefs.current[from];
      const incoming = slideRefs.current[to];
      const outgoingZoom = zoomRefs.current[from];
      const incomingZoom = zoomRefs.current[to];
      if (!outgoing || !incoming || !outgoingZoom || !incomingZoom) return;

      indexRef.current = to;
      setIndex(to);

      if (reducedMotion) {
        gsap.set(outgoing, { autoAlpha: 0, zIndex: 1, clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(incoming, { autoAlpha: 1, zIndex: 2, clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set([outgoingZoom, incomingZoom], { scale: 1, xPercent: 0 });
        return;
      }

      // A page turning in a magazine: the frame opens from one edge while the
      // photograph inside settles back to rest.
      const openFrom =
        direction === 1 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";

      const settle = () => {
        transition.current = null;
        gsap.set(outgoing, { autoAlpha: 0, zIndex: 1, clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(outgoingZoom, { scale: 1, xPercent: 0, x: 0 });
        gsap.set(incoming, { autoAlpha: 1, zIndex: 2, clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(incomingZoom, { scale: 1, xPercent: 0, x: 0 });
      };

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut", duration: TRANSITION_S },
        onComplete: settle,
        onInterrupt: settle,
      });
      transition.current = tl;

      tl.set(incoming, { zIndex: 2, autoAlpha: 1, clipPath: openFrom })
        .set(outgoing, { zIndex: 1 })
        .set(incomingZoom, { scale: 1.05, xPercent: direction * 3 })
        .to(incoming, { clipPath: "inset(0% 0% 0% 0%)" }, 0)
        .to(incomingZoom, { scale: 1, xPercent: 0 }, 0)
        .to(outgoingZoom, { scale: 1.03, xPercent: direction * -2 }, 0)
        .to(outgoing, { autoAlpha: 0, duration: TRANSITION_S * 0.8 }, 0.1);
    },
    [reducedMotion, total]
  );

  const next = useCallback(() => goTo(indexRef.current + 1, 1), [goTo]);
  const prev = useCallback(() => goTo(indexRef.current - 1, -1), [goTo]);

  useEffect(
    () => () => {
      transition.current?.kill();
      progressTween.current?.kill();
    },
    []
  );

  /* ----------------------------------------------------------- first paint */

  useEffect(() => {
    slideRefs.current.forEach((slide, i) => {
      if (!slide) return;
      gsap.set(slide, {
        autoAlpha: i === 0 ? 1 : 0,
        zIndex: i === 0 ? 2 : 1,
        clipPath: "inset(0% 0% 0% 0%)",
      });
    });
    zoomRefs.current.forEach((zoom) => zoom && gsap.set(zoom, { scale: 1, xPercent: 0 }));
  }, []);

  /* ------------------------------------------------- autoplay + progress */

  useEffect(() => {
    if (reducedMotion) return;
    const bar = progressRef.current;
    if (!bar) return;

    progressTween.current?.kill();
    gsap.set(bar, { scaleX: 0 });

    if (paused) return;

    progressTween.current = gsap.to(bar, {
      scaleX: 1,
      duration: AUTOPLAY_MS / 1000,
      ease: "none",
      onComplete: next,
    });

    return () => {
      progressTween.current?.kill();
    };
  }, [index, paused, next, reducedMotion]);

  // Reduced motion still advances, just without the animated progress line.
  useEffect(() => {
    if (!reducedMotion || paused) return;
    const timer = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [index, paused, next, reducedMotion]);

  /* --------------------------------------------------------- mouse depth */

  useEffect(() => {
    if (isCoarse || reducedMotion) return;
    const root = rootRef.current;
    if (!root) return;

    const setters = parallaxRefs.current.map((el) =>
      el
        ? {
            x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3.out" }),
            y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power3.out" }),
          }
        : null
    );

    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      const active = setters[indexRef.current];
      active?.x(-relX * PARALLAX_PX * 2);
      active?.y(-relY * PARALLAX_PX);
    };
    const onLeave = () => {
      setters.forEach((s) => {
        s?.x(0);
        s?.y(0);
      });
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [isCoarse, reducedMotion]);

  /* --------------------------------------------------------------- drag */

  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const dragging = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragStart.current = { x: e.clientX, y: e.clientY };
    dragging.current = false;
    setPaused(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const start = dragStart.current;
    if (!start || transition.current) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;

    // Let a vertical swipe scroll the page instead of scrubbing the carousel.
    if (!dragging.current && Math.abs(dy) > Math.abs(dx)) {
      dragStart.current = null;
      setPaused(false);
      return;
    }
    if (Math.abs(dx) > 6) dragging.current = true;

    const zoom = zoomRefs.current[indexRef.current];
    if (zoom) gsap.to(zoom, { x: dx * 0.18, duration: 0.5, ease: "power3.out", overwrite: true });
  };

  const endDrag = (e: React.PointerEvent) => {
    const start = dragStart.current;
    dragStart.current = null;
    setPaused(false);

    const zoom = zoomRefs.current[indexRef.current];
    if (zoom) gsap.to(zoom, { x: 0, duration: 0.9, ease: "power3.out" });

    if (!start) return;
    const dx = e.clientX - start.x;
    if (dx <= -DRAG_THRESHOLD) next();
    else if (dx >= DRAG_THRESHOLD) prev();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  const active = heroSlides[index];

  return (
    <section
      aria-label="Featured wedding photography"
      className="px-4 pb-8 pt-[92px] sm:px-6 md:px-10 md:pb-12 md:pt-[112px] lg:px-12"
    >
      <div className="mx-auto max-w-[1680px]">
        <div
          ref={rootRef}
          role="group"
          aria-roledescription="carousel"
          aria-label="Wedding photography"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className={cn(
            "drag-surface dark group relative w-full cursor-grab touch-pan-y overflow-hidden bg-scrim outline-none active:cursor-grabbing",
            "h-[56vh] min-h-[360px] max-h-[560px]",
            "md:h-[52vh] md:min-h-[400px] md:max-h-[650px]",
            "focus-visible:ring-2 focus-visible:ring-beige focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          )}
        >
          {heroSlides.map((slide, i) => (
            <div
              key={slide.id}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              aria-hidden={i !== index}
              className="absolute inset-0 will-change-[clip-path,opacity]"
            >
              <div
                ref={(el) => {
                  zoomRefs.current[i] = el;
                }}
                className="absolute inset-0 will-change-transform"
              >
                <div
                  ref={(el) => {
                    parallaxRefs.current[i] = el;
                  }}
                  className="absolute inset-[-2%] will-change-transform"
                >
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority={i === 0}
                    fetchPriority={i === 0 ? "high" : "auto"}
                    quality={82}
                    sizes="(min-width: 1680px) 1656px, 100vw"
                    className="select-none object-cover"
                    // Per-slide focal point: the crop is deep enough that a
                    // centred one would clip faces on most of these frames.
                    style={{ objectPosition: slide.focus }}
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Legibility scrims — kept to the extreme edges so the photograph stays whole. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-scrim/70 via-scrim/15 to-transparent"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 p-5 sm:p-7 md:p-9">
            <div className="min-w-0">
              <p className="label text-white/95">{active.label}</p>
              <p className="mt-2 truncate font-display text-lg leading-none text-white/80 sm:text-xl">
                {active.caption}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-5">
              <div className="pointer-events-auto hidden items-center gap-2 sm:flex">
                <CarouselArrow direction="prev" onClick={prev} />
                <CarouselArrow direction="next" onClick={next} />
              </div>
              <p className="label tabular-nums text-white/95" aria-live="polite">
                <span className="text-white">{String(index + 1).padStart(2, "0")}</span>
                <span className="mx-1.5 text-white/40">/</span>
                <span className="text-white/60">{String(total).padStart(2, "0")}</span>
              </p>
            </div>
          </div>

          {/* Progress indicator */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 z-20 h-px bg-white/20">
            <span
              ref={progressRef}
              className="block h-full origin-left scale-x-0 bg-white"
            />
          </div>
        </div>

        {/* Slide selectors + scroll cue */}
        <div className="mt-4 flex items-center justify-between gap-6 md:mt-5">
          <div className="flex items-center gap-2.5">
            {heroSlides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show slide ${i + 1}: ${slide.caption}`}
                aria-current={i === index}
                onClick={() => goTo(i, i > index ? 1 : -1)}
                className="group py-2"
                data-cursor="hidden"
              >
                <span
                  className={cn(
                    "block h-px transition-all duration-700",
                    i === index
                      ? "w-9 bg-beige"
                      : "w-4 bg-foreground/25 group-hover:w-6 group-hover:bg-foreground/50"
                  )}
                />
              </button>
            ))}
          </div>

          <p className="hidden label text-foreground/35 sm:block">Scroll to explore</p>
        </div>
      </div>
    </section>
  );
}

function CarouselArrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
      data-cursor="hidden"
      className="flex h-10 w-10 items-center justify-center border border-white/30 text-white/80 transition-colors duration-500 hover:border-white hover:bg-white hover:text-scrim"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={cn("h-3.5 w-3.5", direction === "prev" && "rotate-180")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="square" />
      </svg>
    </button>
  );
}
