import Link from "next/link";
import { StaggerGroup } from "@/components/animations/fade-in";
import { ShootCard } from "@/components/portfolio/shoot-card";
import type { PortfolioCategory } from "@/lib/data";
import { categoryImageCount } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * A discipline block on /portfolio. Weddings render at `primary` emphasis — a
 * display-size heading and large, asymmetric cards. Fashion and studio render at
 * `secondary`: same components, deliberately less room.
 */
export function CategorySection({ category }: { category: PortfolioCategory }) {
  const primary = category.emphasis === "primary";

  return (
    <section
      id={category.slug}
      className={cn(
        "mx-auto max-w-[1680px] px-5 sm:px-8 md:px-12",
        primary ? "py-20 md:py-32" : "py-14 md:py-20"
      )}
    >
      <div className="editorial-rule mb-10 text-foreground md:mb-14" />

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label text-beige">
            {primary ? "The main body of work" : "Also by ASM"}
          </p>
          <h2
            className={cn(
              "mt-5 font-display font-light leading-[0.9] text-foreground",
              primary
                ? "text-[clamp(3rem,10vw,8.5rem)]"
                : "text-[clamp(1.9rem,4.4vw,3.25rem)]"
            )}
          >
            {category.title}
          </h2>
          <p
            className={cn(
              "mt-5 max-w-xl font-display font-light italic leading-[1.4] text-foreground/70",
              primary ? "text-[clamp(1.15rem,2.2vw,1.75rem)]" : "text-base md:text-lg"
            )}
          >
            {category.tagline}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3">
          <p className="label text-foreground/35">
            {category.shoots.length} stories
            <span className="mx-2.5 text-foreground/20">·</span>
            {categoryImageCount(category)} photographs
          </p>
          <Link
            href={`/portfolio/${category.slug}`}
            data-cursor="hidden"
            className="label border-b border-foreground/25 pb-1.5 text-foreground/60 transition-colors duration-500 hover:border-beige hover:text-beige"
          >
            View all {category.shortTitle}
          </Link>
        </div>
      </div>

      {primary ? (
        <StaggerGroup
          className="mt-14 grid grid-cols-12 gap-x-4 gap-y-12 md:mt-20 md:gap-x-6 md:gap-y-20"
          stagger={0.1}
        >
          {category.shoots.map((shoot, i) => {
            // A repeating 3-story rhythm: tall / wide / offset.
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
          className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-14 md:grid-cols-4 md:gap-x-6"
          stagger={0.07}
        >
          {category.shoots.slice(0, 4).map((shoot) => (
            <ShootCard
              key={shoot.slug}
              categorySlug={category.slug}
              shoot={shoot}
              variant="compact"
              webgl={false}
              sizes="(min-width: 768px) 23vw, 46vw"
            />
          ))}
        </StaggerGroup>
      )}
    </section>
  );
}
