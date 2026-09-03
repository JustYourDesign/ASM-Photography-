import Link from "next/link";
import { FadeIn } from "@/components/animations/fade-in";
import { RevealFigure } from "@/components/animations/reveal-figure";
import { studioPreview } from "@/lib/data";

/** The quietest section on the page: four frames, a rule, and a line of text. */
export function StudioPreview() {
  return (
    <section className="mx-auto max-w-[1680px] px-5 py-20 sm:px-8 md:px-12 md:py-32">
      <div className="editorial-rule text-foreground" />

      <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:gap-8">
        <FadeIn className="md:col-span-4">
          <p className="label text-foreground/40">{studioPreview.eyebrow}</p>
          <h2 className="mt-6 font-display text-[clamp(2.25rem,5vw,4rem)] font-light leading-[1] text-foreground">
            {studioPreview.title}
          </h2>
        </FadeIn>

        <FadeIn delay={0.12} className="flex flex-col justify-between gap-8 md:col-span-5 md:col-start-6">
          <p className="whitespace-pre-line font-display text-[clamp(1.25rem,2.2vw,1.75rem)] font-light italic leading-[1.4] text-foreground/70">
            {studioPreview.statement}
          </p>
          <p className="max-w-sm text-[0.95rem] leading-[1.9] text-foreground/60">
            {studioPreview.body}
          </p>
        </FadeIn>

        <FadeIn delay={0.2} className="flex items-end md:col-span-2 md:col-start-11">
          <Link
            href={studioPreview.href}
            data-cursor="hidden"
            className="label border-b border-foreground/25 pb-1.5 text-foreground/60 transition-colors duration-500 hover:border-beige hover:text-beige"
          >
            View Studio
          </Link>
        </FadeIn>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 md:mt-20 md:grid-cols-4 md:gap-6">
        {studioPreview.images.map((img, i) => (
          <RevealFigure
            key={img.src}
            src={img.src}
            alt={img.alt}
            objectPosition={img.position}
            aspect="aspect-[4/5]"
            sizes="(min-width: 768px) 24vw, 46vw"
            parallax={i % 2 === 0 ? 5 : 8}
            delay={i * 0.06}
            className={i % 2 === 1 ? "md:mt-10" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
