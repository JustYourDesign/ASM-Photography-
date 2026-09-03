import type { Metadata } from "next";
import { cormorant, montserrat, parisienne } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScrollProvider } from "@/components/animations/smooth-scroll-provider";
import { CursorFollower } from "@/components/animations/cursor-follower";
import { ScrollProgress } from "@/components/animations/scroll-progress";
import { Loader } from "@/components/animations/loader";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const description =
  "Premium wedding photography by ASM Photography — full-day coverage across South Africa, photographed as one continuous story. Fashion, editorial and studio commissions by request.";

export const metadata: Metadata = {
  metadataBase: new URL("https://asmphotography.co.za"),
  title: {
    default: "ASM Photography — Wedding Photography",
    template: "%s — ASM Photography",
  },
  description,
  openGraph: {
    title: "ASM Photography — Wedding Photography",
    description,
    url: "https://asmphotography.co.za",
    siteName: "ASM Photography",
    type: "website",
    images: ["/images/og/og-cover.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ASM Photography — Wedding Photography",
    description: "Timeless photographs for unforgettable moments.",
    images: ["/images/og/og-cover.jpg"],
  },
  icons: {
    icon: [{ url: "/brand/asm-mark-black.png", type: "image/png" }],
    apple: [{ url: "/brand/asm-mark-black.png" }],
  },
};

/**
 * Minimal, honest structured data: only facts the site actually states. Add
 * address, telephone, priceRange and sameAs once the real details replace the
 * placeholders in src/lib/data.ts and the contact page.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "ASM Photography",
  description,
  url: "https://asmphotography.co.za",
  image: "https://asmphotography.co.za/images/og/og-cover.jpg",
  logo: "https://asmphotography.co.za/brand/asm-lockup-black.png",
  email: "hello@asmphotography.co.za",
  areaServed: "ZA",
  knowsAbout: ["Wedding photography", "Editorial photography", "Studio portraiture"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} ${parisienne.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Loader />
          <CursorFollower />
          <ScrollProgress />
          <SmoothScrollProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
