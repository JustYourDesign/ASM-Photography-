import { RevealText } from "@/components/animations/reveal-text";
import { FadeIn } from "@/components/animations/fade-in";

/**
 * The first thing under the hero. One sentence, set as large as the page allows,
 * whose only job is to say "this is a wedding photographer" before anyone reads
 * a paragraph.
 */
export function WeddingStatement() {
  return (
    <section className="mx-auto max-w-[1680px] px-5 pb-16 pt-16 sm:px-8 md:px-12 md:pb-24 md:pt-28">
      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        <FadeIn className="md:col-span-3">
          <p className="label text-beige">Wedding Photography</p>
          <div className="editorial-rule mt-5 max-w-[8rem] text-foreground" />
        </FadeIn>

        <div className="md:col-span-9">
          <h2 className="font-display text-[clamp(2.5rem,7.2vw,6.5rem)] font-light leading-[0.98] text-foreground">
            <RevealText text="Your story," />
            <span className="block">
              <span className="font-cursive text-beige [font-size:0.86em] [line-height:1.15]">
                <RevealText text="beautifully" delay={0.18} />
              </span>{" "}
              <RevealText text="remembered." delay={0.3} />
            </span>
          </h2>

          <FadeIn delay={0.35} className="mt-9 max-w-xl md:mt-12">
            <p className="text-[0.95rem] leading-[1.85] text-foreground/65 md:text-base">
              ASM Photography is a wedding photography studio working across South
              Africa and beyond. Days are photographed the way they happen — the quiet
              hour before, the vows, the noise afterwards — and returned to you as one
              continuous story rather than a folder of pictures.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
