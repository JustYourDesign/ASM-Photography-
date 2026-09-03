"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { staggerItem } from "@/components/animations/fade-in";
import type { PricingPackage, WeddingPackage } from "@/lib/data";
import { cn } from "@/lib/utils";

const isPlaceholder = (value: string) => value.trim().toUpperCase().startsWith("TODO");

/** Placeholder copy renders in italic beige so unreplaced fields are obvious. */
function Value({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn(isPlaceholder(children) && "italic text-beige/80", className)}>
      {children}
    </span>
  );
}

/** The three wedding packages — the most prominent pricing block on the site. */
export function WeddingPackageCard({
  pkg,
  featured,
}: {
  pkg: WeddingPackage;
  featured?: boolean;
}) {
  return (
    <motion.div
      variants={staggerItem}
      className={cn(
        "flex flex-col border-t pt-8",
        featured ? "border-beige" : "border-foreground/15"
      )}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-[clamp(1.65rem,3vw,2.4rem)] font-light leading-none text-foreground">
          {pkg.name}
        </h3>
        {featured && <span className="label text-beige">Most booked</span>}
      </div>

      <p className="label mt-5 text-foreground/45">
        <Value>{pkg.coverage}</Value>
      </p>

      <p className="mt-7 font-display text-2xl font-light text-foreground/85">
        <Value>{pkg.startingAt}</Value>
      </p>

      <ul className="mt-8 flex flex-1 flex-col gap-4 border-t border-foreground/10 pt-8">
        {pkg.includes.map((item) => (
          <li key={item} className="flex gap-4 text-sm leading-[1.7] text-foreground/70">
            <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-beige" />
            <Value>{item}</Value>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/** Secondary services — smaller, quieter, below the wedding block. */
export function PricingCard({ pkg }: { pkg: PricingPackage }) {
  return (
    <motion.div
      variants={staggerItem}
      className="flex flex-col border-t border-foreground/15 pt-7"
    >
      <h3 className="font-display text-2xl font-light text-foreground">{pkg.title}</h3>
      <p className="mt-3 text-sm leading-[1.7] text-foreground/55">{pkg.tagline}</p>

      <p className="label mt-6 text-foreground/70">
        <Value>{pkg.startingAt}</Value>
      </p>

      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm leading-[1.7] text-foreground/65">
            <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-foreground/25" />
            <Value>{feature}</Value>
          </li>
        ))}
      </ul>

      <Link
        href={pkg.href}
        data-cursor="hidden"
        className="mt-8 inline-block self-start label border-b border-foreground/25 pb-1.5 text-foreground/60 transition-colors duration-500 hover:border-beige hover:text-beige"
      >
        See the work
      </Link>
    </motion.div>
  );
}
