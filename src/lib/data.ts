import { imageMeta, orientation } from "@/lib/images";

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                */
/* -------------------------------------------------------------------------- */

export type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Portfolio",
    href: "/portfolio",
    children: [
      { label: "Weddings", href: "/portfolio/weddings" },
      { label: "Fashion / Editorial", href: "/portfolio/fashion" },
      { label: "Studio", href: "/portfolio/studio" },
    ],
  },
  { label: "Information", href: "/information" },
  { label: "Contact", href: "/contact" },
];

export const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Email", href: "mailto:hello@asmphotography.co.za" },
];

/* -------------------------------------------------------------------------- */
/*  Portfolio model                                                           */
/* -------------------------------------------------------------------------- */

export type CategorySlug = "weddings" | "fashion" | "studio";

/** Slugs that used to exist and still receive traffic, mapped to their new home. */
export const legacyCategorySlugs: Record<string, CategorySlug> = {
  editorial: "fashion",
};

/** Narrative chapters a wedding gallery is grouped into. */
export type ChapterKey =
  | "details"
  | "arrival"
  | "ceremony"
  | "portraits"
  | "celebration"
  | "evening";

export const chapterMeta: Record<ChapterKey, { title: string; description: string }> = {
  details: {
    title: "The Details",
    description: "The rings, the dress, the small objects that carry the whole day.",
  },
  arrival: {
    title: "The Arrival",
    description: "Quiet rooms, last looks, and the hour before everything begins.",
  },
  ceremony: {
    title: "The Ceremony",
    description: "Vows, hands, and the moment the day turns.",
  },
  portraits: {
    title: "The Portraits",
    description: "Time set aside for the two of you, and nothing else.",
  },
  celebration: {
    title: "The Celebration",
    description: "Confetti, family, and the joy that follows you out of the aisle.",
  },
  evening: {
    title: "The Evening",
    description: "Candlelight, first dances, and the last of the light.",
  },
};

export const chapterOrder: ChapterKey[] = [
  "details",
  "arrival",
  "ceremony",
  "portraits",
  "celebration",
  "evening",
];

export type GalleryImage = {
  id: string;
  image: string;
  orientation: "landscape" | "portrait" | "square";
  title: string;
  /** Intrinsic size, so galleries can show photographs whole instead of cropping. */
  width: number;
  height: number;
};

/** Fallback keeps layout sane if an image hasn't been processed yet. */
function sizeOf(image: string) {
  const meta = imageMeta(image);
  return { width: meta?.w ?? 1600, height: meta?.h ?? 1067 };
}

export type Chapter = {
  key: ChapterKey;
  title: string;
  description: string;
  images: GalleryImage[];
};

export type Shoot = {
  slug: string;
  title: string;
  description: string;
  /** PLACEHOLDER — replace with the real venue/city. */
  location?: string;
  /** PLACEHOLDER — replace with the real wedding year. */
  year?: string;
  cover: string;
  /**
   * CSS object-position for `cover`. Covers are cropped to wide letterbox boxes
   * (2:1 and wider), so without a focal point the crop lands wherever the subject
   * happens not to be. Tuned per photograph to keep faces in frame.
   */
  coverPosition: string;
  chapters: Chapter[];
  images: GalleryImage[];
};

export type PortfolioCategory = {
  slug: CategorySlug;
  title: string;
  /** Short label used in tight UI (nav, counters, carousel spines). */
  shortTitle: string;
  description: string;
  /** One-line positioning statement shown under the category title. */
  tagline: string;
  cardImage: string;
  sectionImage: string;
  sectionPosition?: string;
  /** Weddings carry more visual weight than the secondary disciplines. */
  emphasis: "primary" | "secondary";
  shoots: Shoot[];
};

function makeImages(prefix: string, chapter: string, count: number, label: string): GalleryImage[] {
  return Array.from({ length: count }, (_, i) => {
    const image = `/images/${prefix}/${chapter}-${String(i + 1).padStart(2, "0")}.jpg`;
    return {
      id: `${prefix}-${chapter}-${i + 1}`,
      image,
      orientation: orientation(image),
      title: `${label} ${String(i + 1).padStart(2, "0")}`,
      ...sizeOf(image),
    };
  });
}

/** A wedding story: chapter counts must match what scripts/process-images.mjs emits. */
function weddingStory(
  slug: string,
  meta: {
    title: string;
    description: string;
    location: string;
    year: string;
    coverPosition: string;
  },
  counts: Partial<Record<ChapterKey, number>>
): Shoot {
  const prefix = `weddings/${slug}`;
  const chapters: Chapter[] = chapterOrder
    .filter((key) => (counts[key] ?? 0) > 0)
    .map((key) => ({
      key,
      title: chapterMeta[key].title,
      description: chapterMeta[key].description,
      images: makeImages(prefix, key, counts[key] as number, chapterMeta[key].title),
    }));

  return {
    slug,
    ...meta,
    cover: `/images/${prefix}/cover.jpg`,
    chapters,
    images: chapters.flatMap((c) => c.images),
  };
}

/** A secondary (fashion / studio) shoot: a flat numbered sequence, no chapters. */
function flatShoot(
  prefix: string,
  slug: string,
  meta: { title: string; description: string; coverPosition?: string },
  count: number
): Shoot {
  const images = Array.from({ length: count }, (_, i) => {
    const image = `/images/${prefix}/${slug}/${String(i + 1).padStart(2, "0")}.jpg`;
    return {
      id: `${slug}-${i + 1}`,
      image,
      orientation: orientation(image),
      title: `${meta.title} ${String(i + 1).padStart(2, "0")}`,
      ...sizeOf(image),
    };
  });

  return {
    slug,
    ...meta,
    cover: images[0].image,
    coverPosition: meta.coverPosition ?? "center 40%",
    chapters: [],
    images,
  };
}

/*
 * PLACEHOLDER DATA — couple names, locations and years below are stand-ins so the
 * layouts read correctly. Swap them for real client details before launch.
 */
export const weddingShoots: Shoot[] = [
  weddingStory(
    "sambo",
    {
      title: "The Sambo Wedding",
      description:
        "A glass chapel above the escarpment, a mountain the whole day was built around.",
      location: "Drakensberg, KwaZulu-Natal",
      year: "2024",
      coverPosition: "center 34%",
    },
    { details: 4, arrival: 5, ceremony: 10, portraits: 7, celebration: 6, evening: 3 }
  ),
  weddingStory(
    "magaliesberg",
    {
      title: "The Magaliesberg Wedding",
      description: "A long bushveld day that ran from first light through to the last dance.",
      location: "Magaliesberg, North West",
      year: "2024",
      coverPosition: "center 50%",
    },
    { details: 5, arrival: 14, ceremony: 8, portraits: 5, celebration: 12, evening: 7 }
  ),
  weddingStory(
    "caro",
    {
      title: "The Caro Wedding",
      description: "A courtyard estate, deep reds, and a celebration that refused to sit still.",
      location: "Pretoria, Gauteng",
      year: "2023",
      coverPosition: "center 38%",
    },
    { details: 2, arrival: 7, ceremony: 4, portraits: 10, celebration: 5, evening: 5 }
  ),
  weddingStory(
    "sewela-bongani",
    {
      title: "Sewela & Bongani",
      description: "Two ceremonies, two wardrobes, and a village that danced through both.",
      location: "Limpopo",
      year: "2023",
      coverPosition: "center 30%",
    },
    { details: 4, arrival: 3, ceremony: 4, portraits: 7, celebration: 5, evening: 4 }
  ),
  weddingStory(
    "thando",
    {
      title: "The Thando Wedding",
      description: "Emerald, open grassland, and a traditional celebration in full voice.",
      location: "Drakensberg, KwaZulu-Natal",
      year: "2023",
      coverPosition: "center 55%",
    },
    { arrival: 2, ceremony: 4, portraits: 10, celebration: 7, evening: 7 }
  ),
  weddingStory(
    "debra",
    {
      title: "The Debra Wedding",
      description: "A street procession in fuchsia, brass, and unbroken noise.",
      location: "Durban, KwaZulu-Natal",
      year: "2023",
      coverPosition: "center 30%",
    },
    { arrival: 1, portraits: 5, celebration: 9 }
  ),
];

export const portfolioCategories: PortfolioCategory[] = [
  {
    slug: "weddings",
    title: "Weddings",
    shortTitle: "Weddings",
    tagline: "Timeless photographs for unforgettable moments.",
    description:
      "Full-day wedding coverage, photographed the way it actually happened — unhurried, warm, and made to be kept.",
    cardImage: "/images/categories/weddings.jpg",
    sectionImage: "/images/portfolio/section-weddings.jpg",
    sectionPosition: "center 42%",
    emphasis: "primary",
    shoots: weddingShoots,
  },
  {
    slug: "fashion",
    title: "Fashion / Editorial",
    shortTitle: "Fashion",
    tagline: "Narrative, styling, and light with an edge.",
    description:
      "Campaign, lookbook, and magazine-style commissions built around a strong point of view.",
    cardImage: "/images/categories/fashion.jpg",
    sectionImage: "/images/portfolio/section-fashion.jpg",
    sectionPosition: "center 40%",
    emphasis: "secondary",
    shoots: [
      flatShoot(
        "fashion",
        "the-car-story",
        {
          title: "The Car Story",
          description: "A vintage convertible and golden-hour light.",
        },
        5
      ),
      flatShoot(
        "fashion",
        "field-editorial",
        {
          title: "Field Editorial",
          description: "Avant-garde silhouettes against open sky.",
        },
        5
      ),
      flatShoot(
        "fashion",
        "tailored",
        { title: "Tailored", description: "Suiting and structure in an industrial setting." },
        5
      ),
      flatShoot(
        "fashion",
        "volume-i",
        {
          title: "Volume I — Noir",
          description: "The opening chapter of a continuing black and white study.",
        },
        6
      ),
      flatShoot(
        "fashion",
        "volume-ii",
        { title: "Volume II — Movement", description: "Motion, gesture, and shadow in the same series." },
        6
      ),
    ],
  },
  {
    slug: "studio",
    title: "Studio",
    shortTitle: "Studio",
    tagline: "Controlled environments. Uncontrolled creativity.",
    description: "Portraits, branding, and character studies built entirely in-studio.",
    cardImage: "/images/categories/studio.jpg",
    sectionImage: "/images/portfolio/section-studio.jpg",
    sectionPosition: "center 28%",
    emphasis: "secondary",
    shoots: [
      flatShoot(
        "studio",
        "studio-colour",
        { title: "Studio Colour", description: "Bold backdrops and considered wardrobe styling." },
        5
      ),
      flatShoot(
        "studio",
        "studio-noir",
        { title: "Studio Noir", description: "Monochrome character studies built entirely in-studio." },
        6
      ),
      flatShoot(
        "studio",
        "bold-studio",
        { title: "Bold Studio", description: "High-contrast portraiture against a warm backdrop." },
        5
      ),
      flatShoot(
        "studio",
        "character-studio",
        { title: "Character Studio", description: "Personality-driven portrait sessions." },
        4
      ),
    ],
  },
];

export function getCategory(slug: string) {
  const resolved = legacyCategorySlugs[slug] ?? slug;
  return portfolioCategories.find((c) => c.slug === resolved);
}

export function getShoot(categorySlug: string, shootSlug: string) {
  const category = getCategory(categorySlug);
  const shoot = category?.shoots.find((s) => s.slug === shootSlug);
  return category && shoot ? { category, shoot } : undefined;
}

export function categoryImageCount(category: PortfolioCategory) {
  return category.shoots.reduce((sum, shoot) => sum + shoot.images.length, 0);
}

export const weddingsCategory = portfolioCategories[0];

/* -------------------------------------------------------------------------- */
/*  Homepage — hero carousel                                                  */
/* -------------------------------------------------------------------------- */

export type HeroSlide = {
  id: string;
  image: string;
  alt: string;
  /** Small uppercase label shown bottom-left over the photograph. */
  label: string;
  caption: string;
  /**
   * CSS object-position, measured against where the subject actually sits.
   *
   * Both axes matter because the two breakpoints crop on opposite axes: desktop
   * is a wide, shallow letterbox (~2.8:1) cut from 3:2 photographs, so barely
   * half the frame height survives and only Y applies; mobile is taller than the
   * source, so it crops the sides and only X applies. One value covers both.
   */
  focus: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "hs-01",
    image: "/images/hero/hero-01.jpg",
    alt: "Bride and groom together on an open mountainside",
    label: "Weddings",
    caption: "Bride & Groom",
    // Couple stand low in frame — hold them, lose sky.
    focus: "66% 64%",
  },
  {
    id: "hs-02",
    image: "/images/hero/hero-02.jpg",
    alt: "A couple sharing their first kiss at the end of the ceremony",
    label: "Weddings",
    caption: "The Ceremony",
    // Heads sit near the top edge of the original frame.
    focus: "56% 12%",
  },
  {
    id: "hs-03",
    image: "/images/hero/hero-03.jpg",
    alt: "Black and white portrait of a bride on a mountain ridge",
    label: "Weddings",
    caption: "Bride Portrait",
    focus: "55% 76%",
  },
  {
    id: "hs-04",
    image: "/images/hero/hero-04.jpg",
    alt: "A wedding reception at dusk, seen down the length of the venue",
    label: "Weddings",
    caption: "The Reception",
    focus: "50% 52%",
  },
  {
    id: "hs-05",
    image: "/images/hero/hero-05.jpg",
    alt: "A newly married couple walking together through trees",
    label: "Weddings",
    caption: "Couple Editorial Portrait",
    focus: "45% 45%",
  },
  {
    id: "hs-06",
    image: "/images/hero/hero-06.jpg",
    alt: "Bridal shoes, perfume and jewellery laid out before the day begins",
    label: "Weddings",
    caption: "Wedding Details",
    focus: "55% 55%",
  },
];

/* -------------------------------------------------------------------------- */
/*  Homepage — wedding photography experience (scroll storytelling)           */
/* -------------------------------------------------------------------------- */

export type ExperienceSection = {
  id: string;
  index: string;
  title: string;
  body: string;
  image: string;
  alt: string;
};

export const weddingExperience: ExperienceSection[] = [
  {
    id: "ex-01",
    index: "01",
    title: "The Experience",
    body: "We plan the day around the photographs, not the other way around. By the time the morning arrives you already know where I'll be, and I already know what matters to you.",
    image: "/images/home/experience-01.jpg",
    alt: "A couple leaving their ceremony through a shower of confetti",
  },
  {
    id: "ex-02",
    index: "02",
    title: "The Moments",
    body: "The held breath before the vows. The laugh nobody planned. I photograph the day as it happens and step in only when a moment needs a little more room.",
    image: "/images/home/experience-02.jpg",
    alt: "A couple sharing a quiet moment beneath the bride's veil",
  },
  {
    id: "ex-03",
    index: "03",
    title: "The Details",
    body: "The rings, the handwriting on the vows, the shoes still in their box at seven in the morning. Small things, photographed with the same care as the big ones.",
    image: "/images/home/experience-03.jpg",
    alt: "Wedding day details laid out before the ceremony",
  },
  {
    id: "ex-04",
    index: "04",
    title: "The People",
    body: "Your family are not a formality. They are the reason the room feels the way it does, and they are photographed like it.",
    image: "/images/home/experience-04.jpg",
    alt: "Wedding guests and family celebrating together",
  },
  {
    id: "ex-05",
    index: "05",
    title: "The Story",
    body: "What you receive is not a folder of photographs. It is the day, in order, from the first quiet hour to the last of the light.",
    image: "/images/home/experience-05.jpg",
    alt: "A wedding venue at dusk, lit from within",
  },
];

/* -------------------------------------------------------------------------- */
/*  Homepage — secondary discipline previews                                  */
/* -------------------------------------------------------------------------- */

export const fashionPreview = {
  eyebrow: "Also by ASM",
  title: "Fashion / Editorial",
  statement: "Beyond the aisle.",
  body: "Campaign and editorial commissions — styled, art-directed, and built around a single strong idea.",
  href: "/portfolio/fashion",
  // `position` is a focal point for the crop — see HeroSlide.focus.
  images: [
    {
      src: "/images/home/fashion-01.jpg",
      alt: "Editorial fashion story shot around a vintage car",
      position: "center 45%",
    },
    {
      src: "/images/home/fashion-02.jpg",
      alt: "Avant-garde fashion silhouette against open sky",
      position: "center 25%",
    },
    {
      src: "/images/home/fashion-03.jpg",
      alt: "Black and white editorial portrait in motion",
      position: "center 40%",
    },
    {
      src: "/images/home/fashion-04.jpg",
      alt: "Editorial fashion portrait in tall grass",
      position: "center 40%",
    },
  ],
};

export const studioPreview = {
  eyebrow: "Also by ASM",
  title: "Studio",
  statement: "Controlled environments.\nUncontrolled creativity.",
  body: "Portraits, branding, and character studies made entirely under studio light.",
  href: "/portfolio/studio",
  images: [
    {
      src: "/images/home/studio-01.jpg",
      alt: "Studio portrait against a warm backdrop",
      // Subject stands high in frame; a centred crop clips the head.
      position: "center 8%",
    },
    {
      src: "/images/home/studio-02.jpg",
      alt: "Black and white studio character study",
      position: "center 35%",
    },
    {
      src: "/images/home/studio-03.jpg",
      alt: "Colour studio portrait with styled wardrobe",
      position: "center 30%",
    },
    {
      src: "/images/home/studio-04.jpg",
      alt: "High-contrast monochrome studio portrait",
      position: "center 35%",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  /information — wedding-first service structure                            */
/* -------------------------------------------------------------------------- */

/**
 * PLACEHOLDER PRICING — every figure below is a stand-in. Replace the `TODO`
 * strings with ASM's real packages before launch; nothing here is invented policy.
 */
export type WeddingPackage = {
  id: string;
  name: string;
  coverage: string;
  startingAt: string;
  includes: string[];
};

export const weddingPackages: WeddingPackage[] = [
  {
    id: "wp-01",
    name: "The Ceremony",
    coverage: "TODO — e.g. 6 hours of coverage",
    startingAt: "TODO — starting price",
    includes: [
      "TODO — single photographer",
      "TODO — preparation through to first dance",
      "TODO — number of edited images",
      "TODO — private online gallery",
    ],
  },
  {
    id: "wp-02",
    name: "The Full Day",
    coverage: "TODO — e.g. 10 hours of coverage",
    startingAt: "TODO — starting price",
    includes: [
      "TODO — photographer and second shooter",
      "TODO — getting-ready through to the last dance",
      "TODO — number of edited images",
      "TODO — engagement session included",
      "TODO — private online gallery",
    ],
  },
  {
    id: "wp-03",
    name: "The Weekend",
    coverage: "TODO — e.g. two days of coverage",
    startingAt: "TODO — starting price",
    includes: [
      "TODO — traditional and white ceremony coverage",
      "TODO — photographer and second shooter",
      "TODO — number of edited images",
      "TODO — fine-art album included",
      "TODO — travel within N km included",
    ],
  },
];

export const weddingIncludes: string[] = [
  "TODO — pre-wedding consultation and timeline planning",
  "TODO — venue and light scouting before the day",
  "TODO — full colour grading and retouching on every delivered frame",
  "TODO — private, downloadable online gallery",
  "TODO — print release for personal use",
  "TODO — sneak peek gallery within N days",
];

export type BookingStep = { n: string; title: string; body: string };

export const bookingSteps: BookingStep[] = [
  {
    n: "01",
    title: "Enquire",
    body: "Send through your date, venue, and a little about the day you're planning.",
  },
  {
    n: "02",
    title: "Meet",
    body: "TODO — describe the consultation (in person / video call) and roughly how long it takes.",
  },
  {
    n: "03",
    title: "Reserve",
    body: "TODO — deposit amount and signed agreement required to hold the date.",
  },
  {
    n: "04",
    title: "Plan",
    body: "TODO — timeline questionnaire and final planning call, N weeks before the day.",
  },
  {
    n: "05",
    title: "The Day",
    body: "TODO — what to expect on the day itself.",
  },
  {
    n: "06",
    title: "Deliver",
    body: "TODO — sneak peeks, full gallery timeline, and album design window.",
  },
];

export const weddingDelivery: { label: string; value: string }[] = [
  { label: "Sneak peeks", value: "TODO — within N days" },
  { label: "Full gallery", value: "TODO — within N weeks" },
  { label: "Album proof", value: "TODO — within N weeks of selection" },
  { label: "Gallery availability", value: "TODO — online for N months" },
];

export const weddingTravel = {
  title: "Travel",
  body: "TODO — travel included within N km of ASM's base, and how travel, flights and accommodation are quoted beyond that. Destination weddings welcome.",
};

export const engagementSessions = {
  title: "Engagement Sessions",
  body: "TODO — session length, location guidance, number of edited images, and whether it is included in a package or booked separately.",
  startingAt: "TODO — starting price",
  images: [
    "/images/engagements/01.jpg",
    "/images/engagements/06.jpg",
    "/images/engagements/03.jpg",
    "/images/engagements/07.jpg",
  ],
};

export const albumOptions = {
  title: "Albums",
  body: "TODO — album sizes, cover materials, spread counts, and the design/approval process.",
  startingAt: "TODO — starting price",
};

/** Secondary services — deliberately lighter than the wedding structure above. */
export type PricingPackage = {
  id: string;
  title: string;
  tagline: string;
  startingAt: string;
  features: string[];
  href: string;
};

export const secondaryServices: PricingPackage[] = [
  {
    id: "pp-fashion",
    title: "Fashion / Editorial",
    tagline: "Campaign, lookbook, and magazine-style commissions.",
    startingAt: "TODO — starting price",
    features: [
      "TODO — scope (half day / full day)",
      "TODO — usage and licensing terms",
      "TODO — number of final images",
      "TODO — gallery delivery timeline",
    ],
    href: "/portfolio/fashion",
  },
  {
    id: "pp-studio",
    title: "Studio Sessions",
    tagline: "Portraits, branding, and character studies built entirely in-studio.",
    startingAt: "TODO — starting price",
    features: [
      "TODO — session length",
      "TODO — number of edited images",
      "TODO — outfit and backdrop changes included",
      "TODO — gallery delivery timeline",
    ],
    href: "/portfolio/studio",
  },
];

export const averageInvestmentNote =
  'TODO — e.g. "Couples typically invest around R X for full-day wedding coverage."';

export type Faq = { id: string; question: string; answer: string };

export const faqs: Faq[] = [
  {
    id: "faq-01",
    question: "How far in advance should we book our wedding?",
    answer: "TODO — typical lead time, and how many weddings are taken per season.",
  },
  {
    id: "faq-02",
    question: "Do you travel for weddings?",
    answer: "TODO — base location, travel radius included, and how destination weddings are quoted.",
  },
  {
    id: "faq-03",
    question: "Do you photograph traditional ceremonies as well?",
    answer: "TODO — coverage across traditional and white ceremonies, and how multi-day days are priced.",
  },
  {
    id: "faq-04",
    question: "When will we see our photographs?",
    answer: "TODO — sneak peek and full gallery delivery timelines.",
  },
  {
    id: "faq-05",
    question: "What is your approach on the day?",
    answer: "TODO — shooting style (documentary, lightly directed, hands-off) and how much direction to expect.",
  },
  {
    id: "faq-06",
    question: "Do you offer payment plans?",
    answer: "TODO — deposit, instalment schedule, and final balance due date.",
  },
];
