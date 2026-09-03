import { RevealText } from "@/components/animations/reveal-text";
import { FadeIn } from "@/components/animations/fade-in";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  meta?: { label: string; value: string }[];
  /** `display` is reserved for the wedding pages. */
  scale?: "display" | "standard";
  className?: string;
};

/** Shared type-only page opener. No image — the galleries below carry the weight. */
export function PageHero({
  eyebrow,
  title,
  description,
  meta,
  scale = "standard",
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "mx-auto max-w-[1680px] px-5 pb-12 pt-[132px] sm:px-8 md:px-12 md:pb-20 md:pt-[188px]",
        className
      )}
    >
      <p className="label text-beige">{eyebrow}</p>

      <h1
        className={cn(
          "mt-7 font-display font-light leading-[0.88] text-foreground md:mt-10",
          scale === "display"
            ? "text-[clamp(3.25rem,13vw,12rem)]"
            : "text-[clamp(2.75rem,9vw,7.5rem)]"
        )}
      >
        <RevealText text={title} />
      </h1>

      {(description || meta) && (
        <FadeIn delay={0.4}>
          <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12">
            {description && (
              <p className="max-w-2xl text-[0.95rem] leading-[1.9] text-foreground/60 md:col-span-7 md:text-base">
                {description}
              </p>
            )}
            {meta && (
              <dl className="flex flex-wrap gap-x-10 gap-y-5 md:col-span-4 md:col-start-9 md:justify-end">
                {meta.map((m) => (
                  <div key={m.label}>
                    <dt className="label text-foreground/35">{m.label}</dt>
                    <dd className="mt-2 font-display text-xl text-foreground/80">{m.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </FadeIn>
      )}
    </section>
  );
}
