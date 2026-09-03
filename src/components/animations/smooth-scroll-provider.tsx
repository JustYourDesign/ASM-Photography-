"use client";

import { createContext, useContext, useEffect, useRef, type RefObject } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

/** Returns a ref to the shared Lenis instance — read `.current` at call time (e.g. inside an event handler). */
export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    /*
     * Every scroll-reveal on the site is a ScrollTrigger, and their start/end
     * positions are measured once. Images finishing later changes the document
     * height and leaves those measurements stale — which can strand a reveal in
     * its hidden "from" state. Re-measure whenever the page height settles.
     */
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    const scheduleRefresh = () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    };

    window.addEventListener("load", scheduleRefresh);
    const observer = new ResizeObserver(scheduleRefresh);
    observer.observe(document.body);

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      window.removeEventListener("load", scheduleRefresh);
      observer.disconnect();
      lenis.destroy();
      lenisRef.current = null;
      gsap.ticker.remove(onTick);
    };
  }, []);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}
