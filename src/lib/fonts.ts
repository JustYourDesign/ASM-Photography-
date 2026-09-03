import { Cormorant_Garamond, Montserrat, Parisienne } from "next/font/google";

/**
 * Editorial display face — used for every heading and large statement.
 * High-contrast serif, set tight and large, is what carries the "luxury wedding
 * magazine" register the rest of the design is built on.
 */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

/** UI / body face — small caps-style labels, navigation, and running copy. */
export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/** Handwritten accent. Used sparingly — a word or two, never a paragraph. */
export const parisienne = Parisienne({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});
