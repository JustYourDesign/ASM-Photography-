import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { EditorialGallery } from "@/components/gallery/editorial-gallery";
import { FadeIn } from "@/components/animations/fade-in";
import { RevealText } from "@/components/animations/reveal-text";
import { WeddingCTA } from "@/components/home/wedding-cta";
import { portfolioCategories, legacyCategorySlugs, getShoot } from "@/lib/data";

export function generateStaticParams() {
  return portfolioCategories.flatMap((category) =>
    category.shoots.map((shoot) => ({ category: category.slug, shoot: shoot.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; shoot: string }>;
}): Promise<Metadata> {
  const { category: categorySlug, shoot: shootSlug } = await params;
  const result = getShoot(categorySlug, shootSlug);
  if (!result) return {};
  const { category, shoot } = result;
  return {
    title: `${shoot.title} — ${category.title}`,
    description: shoot.description,
    openGraph: { images: [shoot.cover] },
  };
}

export default async function ShootPage({
  params,
}: {
  params: Promise<{ category: string; shoot: string }>;
}) {
  const { category: categorySlug, shoot: shootSlug } = await params;

  const canonical = legacyCategorySlugs[categorySlug];
  if (canonical) redirect(`/portfolio/${canonical}/${shootSlug}`);

  const result = getShoot(categorySlug, shootSlug);
  if (!result) notFound();
  const { category, shoot } = result;

  const siblings = category.shoots.filter((s) => s.slug !== shoot.slug).slice(0, 3);
  const nextShoot =
    category.shoots[
      (category.shoots.findIndex((s) => s.slug === shoot.slug) + 1) % category.shoots.length
    ];

  return (
    <div>
      {/* Title block */}
      <section className="mx-auto max-w-[1680px] px-5 pb-10 pt-[132px] sm:px-8 md:px-12 md:pb-16 md:pt-[188px]">
        <Link
          href={`/portfolio/${category.slug}`}
          data-cursor="hidden"
          className="label text-beige transition-colors duration-500 hover:text-foreground"
        >
          ← {category.title}
        </Link>

        <h1 className="mt-8 font-display text-[clamp(2.5rem,9vw,7.5rem)] font-light leading-[0.9] text-foreground md:mt-12">
          <RevealText text={shoot.title} />
        </h1>

        <FadeIn delay={0.4}>
          <div className="mt-9 grid gap-8 md:mt-14 md:grid-cols-12">
            <p className="max-w-xl text-[0.95rem] leading-[1.9] text-foreground/60 md:col-span-6 md:text-base">
              {shoot.description}
            </p>
            <dl className="flex flex-wrap gap-x-10 gap-y-5 md:col-span-5 md:col-start-8 md:justify-end">
              {shoot.location && (
                <div>
                  <dt className="label text-foreground/35">Location</dt>
                  <dd className="mt-2 font-display text-xl text-foreground/80">
                    {shoot.location}
                  </dd>
                </div>
              )}
              {shoot.year && (
                <div>
                  <dt className="label text-foreground/35">Year</dt>
                  <dd className="mt-2 font-display text-xl text-foreground/80">{shoot.year}</dd>
                </div>
              )}
              <div>
                <dt className="label text-foreground/35">Photographs</dt>
                <dd className="mt-2 font-display text-xl text-foreground/80">
                  {shoot.images.length}
                </dd>
              </div>
            </dl>
          </div>
        </FadeIn>
      </section>

      {/* Opening frame */}
      <section className="mx-auto max-w-[1680px] px-5 sm:px-8 md:px-12">
        <div className="dark relative aspect-[4/3] w-full overflow-hidden bg-scrim md:aspect-[2/1]">
          <Image
            src={shoot.cover}
            alt={shoot.title}
            fill
            priority
            sizes="(min-width: 1680px) 1656px, 100vw"
            quality={84}
            className="object-cover"
            style={{ objectPosition: shoot.coverPosition }}
          />
        </div>
      </section>

      {/* The story */}
      <section className="mx-auto max-w-[1680px] px-5 py-16 sm:px-8 md:px-12 md:py-28">
        <EditorialGallery
          chapters={shoot.chapters.length ? shoot.chapters : undefined}
          images={shoot.images}
        />
      </section>

      {/* Continue */}
      {siblings.length > 0 && (
        <section className="mx-auto max-w-[1680px] px-5 pb-20 sm:px-8 md:px-12 md:pb-32">
          <div className="editorial-rule mb-10 text-foreground md:mb-14" />
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-light leading-[1.05] text-foreground">
              Continue with {nextShoot.title}
            </h2>
            <Link
              href={`/portfolio/${category.slug}/${nextShoot.slug}`}
              data-cursor="hidden"
              className="label border-b border-foreground/25 pb-1.5 text-foreground/60 transition-colors duration-500 hover:border-beige hover:text-beige"
            >
              Next story
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:mt-14 md:grid-cols-3 md:gap-6">
            {siblings.map((s) => (
              <Link
                key={s.slug}
                href={`/portfolio/${category.slug}/${s.slug}`}
                data-cursor="view"
                className="group block"
              >
                <div className="dark relative aspect-[4/3] w-full overflow-hidden bg-scrim">
                  <Image
                    src={s.cover}
                    alt={s.title}
                    fill
                    sizes="(min-width: 768px) 31vw, 46vw"
                    quality={78}
                    className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    style={{ objectPosition: s.coverPosition }}
                  />
                </div>
                <p className="mt-4 font-display text-lg text-foreground/85 md:text-xl">
                  {s.title}
                </p>
                {s.location && (
                  <p className="label mt-2 text-foreground/40">
                    {s.location}
                    <span className="mx-2 text-foreground/25">/</span>
                    {s.year}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <WeddingCTA />
    </div>
  );
}
