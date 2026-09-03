import type { Metadata } from "next";
import { PageHero } from "@/components/gallery/page-hero";
import { CategoryCarousel } from "@/components/portfolio/category-carousel";
import { CategorySection } from "@/components/portfolio/category-section";
import { WeddingCTA } from "@/components/home/wedding-cta";
import { portfolioCategories, categoryImageCount } from "@/lib/data";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Wedding photography first, with fashion / editorial and studio commissions alongside it.",
};

const weddings = portfolioCategories[0];

export default function PortfolioPage() {
  return (
    <div>
      <PageHero
        eyebrow="Weddings · Fashion / Editorial · Studio"
        title="Portfolio"
        description="Weddings are the work this studio is built around — full days, photographed start to finish. Fashion, editorial and studio commissions sit alongside them."
        meta={[
          { label: "Wedding stories", value: String(weddings.shoots.length) },
          { label: "Wedding photographs", value: String(categoryImageCount(weddings)) },
        ]}
      />

      <section className="mx-auto max-w-[1680px] px-5 pb-16 sm:px-8 md:px-12 md:pb-24">
        <CategoryCarousel categories={portfolioCategories} />
      </section>

      {portfolioCategories.map((category) => (
        <CategorySection key={category.slug} category={category} />
      ))}

      <WeddingCTA />
    </div>
  );
}
