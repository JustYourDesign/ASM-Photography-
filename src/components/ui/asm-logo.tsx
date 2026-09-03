import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The supplied ASM Photography logo.
 *
 * Two lockups are shipped, both cut from the same original artwork in
 * `scripts/` — nothing here is redrawn or re-typeset:
 *
 *  - `mark`   the circular ASM seal on its own (square). Used wherever the
 *             lockup would have to shrink below the point where "photography"
 *             stays legible — i.e. the header.
 *  - `full`   the complete lockup, seal over wordmark. Used at large sizes only
 *             (mobile menu, footer, intro loader).
 *
 * `tone` picks the supplied colourway rather than filtering the asset, so the
 * logo stays crisp and on-brand in both site themes.
 */
type AsmLogoProps = {
  variant?: "mark" | "full";
  tone?: "white" | "black" | "ember";
  /** Rendered height in px at the largest breakpoint; drives `sizes`. */
  height: number;
  className?: string;
  priority?: boolean;
};

const RATIO = { mark: 1, full: 752 / 883 } as const;

export function AsmLogo({
  variant = "mark",
  tone = "white",
  height,
  className,
  priority,
}: AsmLogoProps) {
  const width = Math.round(height * RATIO[variant]);

  return (
    <Image
      src={`/brand/asm-${variant === "mark" ? "mark" : "lockup"}-${tone}.png`}
      alt="ASM Photography"
      width={width}
      height={height}
      priority={priority}
      sizes={`${width}px`}
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}

/**
 * Theme-aware wrapper: renders both colourways and lets CSS pick, so the logo
 * swaps instantly with the theme toggle without a client-side theme read.
 */
export function AsmLogoThemed({
  variant = "mark",
  height,
  className,
  priority,
}: Omit<AsmLogoProps, "tone">) {
  return (
    <>
      <AsmLogo
        variant={variant}
        tone="black"
        height={height}
        priority={priority}
        className={cn("dark:hidden", className)}
      />
      <AsmLogo
        variant={variant}
        tone="white"
        height={height}
        priority={priority}
        className={cn("hidden dark:block", className)}
      />
    </>
  );
}
