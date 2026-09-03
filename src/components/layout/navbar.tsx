"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { navLinks, socialLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { AsmLogoThemed } from "@/components/ui/asm-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [menuPathname, setMenuPathname] = useState(pathname);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { scrollY } = useScroll();

  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setMenuOpen(false);
    setOpenSubmenu(null);
  }

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    if (menuOpen) {
      setHidden(false);
      return;
    }
    if (latest > previous && latest > 240) setHidden(true);
    else setHidden(false);
  });

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenSubmenu(null);
      setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Small grace period so the pointer can travel from the trigger into the panel.
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenSubmenu(null), 160);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE }}
        className={cn(
          "fixed inset-x-0 top-0 z-[80] border-b bg-background/92 backdrop-blur-md transition-[border-color,box-shadow] duration-700",
          scrolled ? "border-foreground/10 shadow-[0_1px_30px_-18px_rgba(0,0,0,0.5)]" : "border-transparent"
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1680px] items-center justify-between px-5 transition-[height] duration-700 sm:px-8 md:px-12",
            scrolled ? "h-[68px] md:h-[76px]" : "h-[76px] md:h-[92px]"
          )}
        >
          <Link
            href="/"
            aria-label="ASM Photography — home"
            data-cursor="hidden"
            className="relative flex shrink-0 items-center"
          >
            <AsmLogoThemed
              variant="mark"
              height={52}
              priority
              className={cn(
                "w-auto transition-[height] duration-700",
                scrolled ? "h-[34px] md:h-[38px]" : "h-[38px] md:h-[44px] lg:h-[52px]"
              )}
            />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 md:flex lg:gap-12">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              if (!link.children) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    data-cursor="hidden"
                    aria-current={active ? "page" : undefined}
                    className="group relative label py-2 text-foreground/70 transition-colors duration-500 hover:text-foreground"
                  >
                    {link.label}
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-beige transition-transform duration-500",
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      )}
                    />
                  </Link>
                );
              }

              const open = openSubmenu === link.href;

              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenSubmenu(link.href);
                  }}
                  onMouseLeave={scheduleClose}
                  onFocus={() => setOpenSubmenu(link.href)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenSubmenu(null);
                  }}
                >
                  <Link
                    href={link.href}
                    data-cursor="hidden"
                    aria-expanded={open}
                    aria-current={active ? "page" : undefined}
                    className="group relative label flex items-center gap-2 py-2 text-foreground/70 transition-colors duration-500 hover:text-foreground"
                  >
                    {link.label}
                    <span
                      aria-hidden
                      className={cn(
                        "block h-px w-2.5 bg-current transition-transform duration-500",
                        open && "scale-x-150"
                      )}
                    />
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-beige transition-transform duration-500",
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      )}
                    />
                  </Link>

                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="absolute left-1/2 top-full w-[19rem] -translate-x-1/2 pt-5"
                      >
                        <div className="border border-foreground/10 bg-background/97 p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.6)] backdrop-blur-md">
                          {link.children.map((child, i) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              data-cursor="hidden"
                              className={cn(
                                "group block border-foreground/8 py-3 transition-colors duration-400",
                                i > 0 && "border-t"
                              )}
                            >
                              <span
                                className={cn(
                                  "block font-display leading-none text-foreground/85 transition-colors duration-400 group-hover:text-beige",
                                  // Weddings is the headline offering — it gets the size.
                                  i === 0 ? "text-[1.85rem]" : "text-[1.25rem]"
                                )}
                              >
                                {child.label}
                              </span>
                              {i === 0 && (
                                <span className="mt-1.5 block label text-foreground/40">
                                  The main body of work
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-5 sm:gap-7">
            <Link
              href="/contact"
              data-cursor="hidden"
              className="hidden label border border-foreground/25 px-5 py-3 text-foreground/80 transition-colors duration-500 hover:border-beige hover:text-beige lg:inline-block"
            >
              Inquire
            </Link>

            <ThemeToggle className="text-foreground/70 transition-colors hover:text-foreground" />

            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="relative flex h-8 w-8 flex-col items-center justify-center gap-[7px] md:hidden"
              data-cursor="hidden"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="h-px w-6 bg-foreground"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="h-px w-6 bg-foreground"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="h-px w-6 bg-foreground"
              />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.8, ease: EASE }}
            // Below the header (z-80): the header creates its own stacking
            // context, so the close button inside it cannot be raised above a
            // sibling overlay no matter what z-index it is given.
            className="fixed inset-0 z-[70] flex flex-col justify-between overflow-y-auto bg-background px-6 pb-10 pt-28 md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + i * 0.07, duration: 0.7, ease: EASE }}
                  className="border-b border-foreground/10"
                >
                  <Link
                    href={link.href}
                    className="block py-5 font-display text-[2.6rem] leading-none text-foreground"
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="flex flex-wrap gap-x-6 gap-y-2 pb-5">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="label text-foreground/50 transition-colors hover:text-beige"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="mt-12 flex flex-col items-center gap-8"
            >
              <Link
                href="/contact"
                className="label border border-foreground/25 px-8 py-4 text-foreground/85"
              >
                Inquire About Your Wedding
              </Link>
              <AsmLogoThemed variant="full" height={132} className="h-[110px] w-auto opacity-90" />
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.label === "Email" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="label text-foreground/45 hover:text-beige"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
