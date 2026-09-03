# ASM Photography

A wedding-first photography site. Weddings are the commercial and visual centre:
they own the hero, the whole first half of the homepage, the largest block on the
portfolio page, and the top of the pricing structure. Fashion / Editorial and
Studio appear afterwards, deliberately smaller.

## Running it

```bash
npm install
npm run dev
```

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript
- **Tailwind v4** — tokens in `src/app/globals.css`
- **GSAP + ScrollTrigger** — hero carousel, scroll storytelling, reveals
- **Lenis** — smooth scrolling, driven off the GSAP ticker
- **Framer Motion** — component-level state transitions (nav, cards)
- **Three.js** — hover distortion on wedding and editorial imagery

## Structure

```
src/
  app/                      Routes. /portfolio/[category]/[shoot] is the gallery.
  components/
    home/                   Homepage sections, in scroll order
    portfolio/              Category carousel, category sections, shoot cards
    gallery/                Editorial chaptered gallery, lightbox, page hero
    webgl/                  Three.js hover layer
    animations/             Shared reveal / cursor / smooth-scroll primitives
    layout/                 Navbar, footer
  hooks/                    Media-query hooks (reduced motion, coarse pointer)
  lib/
    data.ts                 All site content and image wiring
    image-manifest.json     Generated — real pixel dimensions per image
scripts/process-images.mjs  Generates public/images from incoming-images
```

## Before launch

Everything that needs real information is marked. Search the codebase for
`TODO` and `PLACEHOLDER`:

- **`src/lib/data.ts`** — wedding packages, what's included, booking steps,
  delivery timelines, travel, engagement sessions, albums, FAQ answers, and the
  couple names / locations / years on each wedding story.
- **`src/app/contact/page.tsx`** — phone number and base city.
- **`src/components/contact/contact-form.tsx`** — the EmailJS call is stubbed;
  wire up the Service ID, Template ID and Public Key.
- **`src/lib/data.ts` → `socialLinks`** — real Instagram / Facebook / LinkedIn URLs.
- **`src/app/layout.tsx` and `src/app/sitemap.ts`** — the production domain.

Placeholder copy renders in italic beige on the live site, so anything left
unreplaced is obvious in the browser rather than hiding in the source.

## Images

Generated from `incoming-images/` — see `public/images/README.md`. That file also
explains the focal-point system that keeps faces inside the wide crops.

## Brand

The supplied ASM logo is used as-is, in two lockups cut from the original
artwork (`public/brand/`): the circular mark in the header, where the full
lockup would shrink the "photography" wordmark below legibility, and the
complete lockup in the footer, mobile menu and intro loader. Both ship in the
supplied black, white and brand-orange colourways; the header and footer swap
automatically with the site theme.
