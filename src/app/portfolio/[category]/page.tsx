import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { PageHero } from "@/components/gallery/page-hero";
import { StaggerGroup } from "@/components/animations/fade-in";
import { ShootCard } from "@/components/portfolio/shoot-card";
import { WeddingCTA } from "@/components/home/wedding-cta";
import {
  portfolioCategories,
  legacyCategorySlugs,
  getCategory,
  categoryImageCount,
} from "@/lib/data";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return [
    ...portfolioCategories.map((category) => ({ category: category.slug })),
    ...Object.keys(legacyCategorySlugs).map((category) => ({ category })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) return {};
  return { title: category.title, description: category.description };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;

  // "editorial" folded into "fashion" — keep the old URL working.
  const canonical = legacyCategorySlugs[categorySlug];
  if (canonical) redirect(`/portfolio/${canonical}`);

  const category = getCategory(categorySlug);
  if (!category) notFound();

  const primary = category.emphasis === "primary";

  return (
    <div>
      <PageHero
        eyebrow="Portfolio"
        title={category.title}
        description={category.description}
        scale={primary ? "display" : "standard"}
        meta={[
          { label: "Stories", value: String(category.shoots.length) },
          { label: "Photographs", value: String(categoryImageCount(category)) },
        ]}
      />

      <section className="mx-auto max-w-[1680px] px-5 sm:px-8 md:px-12">
        <div className="dark relative aspect-[16/9] w-full overflow-hidden bg-scrim md:aspect-[21/9]">
          <Image
            src={category.sectionImage}
            alt=""
            aria-hidden
            fill
            priority
            sizes="(min-width: 1680px) 1656px, 100vw"
            quality={82}
            className="object-cover"
            style={{ objectPosition: category.sectionPosition ?? "center" }}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-scrim/85 via-scrim/25 to-transparent"
          />
          <p className="absolute bottom-5 left-5 label text-white/70 md:bottom-8 md:left-8">
            {category.tagline}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1680px] px-5 py-16 sm:px-8 md:px-12 md:py-28">
        {primary ? (
          <StaggerGroup
            className="grid grid-cols-12 gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-20"
            stagger={0.09}
          >
            {category.shoots.map((shoot, i) => {
              const slot = i % 3;
              return (
                <ShootCard
                  key={shoot.slug}
                  categorySlug={category.slug}
                  shoot={shoot}
                  variant="feature"
                  className={cn(
                    "col-span-12",
                    slot === 0 && "md:col-span-7",
                    slot === 1 && "md:col-span-5 md:mt-24",
                    slot === 2 && "md:col-span-8 md:col-start-4"
                  )}
                  aspect={slot === 1 ? "aspect-[4/5]" : "aspect-[3/2]"}
                  sizes="(min-width: 768px) 58vw, 92vw"
                />
              );
            })}
          </StaggerGroup>
        ) : (
          <StaggerGroup
            className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6"
            stagger={0.08}
          >
            {category.shoots.map((shoot) => (
              <ShootCard
                key={shoot.slug}
                categorySlug={category.slug}
                shoot={shoot}
                variant="compact"
                sizes="(min-width: 768px) 31vw, 46vw"
              />
            ))}
          </StaggerGroup>
        )}
      </section>

      <WeddingCTA />
    </div>
  );
}
