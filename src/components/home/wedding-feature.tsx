import { RevealText } from "@/components/animations/reveal-text";
import { FadeIn } from "@/components/animations/fade-in";
import { RevealFigure } from "@/components/animations/reveal-figure";
import { AnimatedButton } from "@/components/ui/animated-button";

/**
 * The wedding feature composition. Deliberately not a grid of equal cards: the
 * images are placed at four different sizes and vertical offsets so the section
 * reads as an art-directed spread.
 */
export function WeddingFeature() {
  return (
    <section className="relative overflow-hidden bg-sand/40 py-20 md:py-32">
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 md:px-12">
        <div className="grid gap-8 md:grid-cols-12">
          <FadeIn className="md:col-span-7">
            <h2 className="font-display text-[clamp(3rem,10vw,9rem)] font-light leading-[0.86] text-foreground">
              <RevealText text="Weddings" />
            </h2>
          </FadeIn>
          <FadeIn delay={0.15} className="flex flex-col justify-end md:col-span-5 md:pb-3">
            <p className="font-display text-[clamp(1.25rem,2.4vw,1.9rem)] font-light italic leading-[1.35] text-foreground/75">
              Timeless photographs for unforgettable moments.
            </p>
            <div className="editorial-rule mt-6 text-foreground" />
          </FadeIn>
        </div>

        {/* Art-directed composition: one wide opening frame, then three staggered
            columns pulled up underneath it. Widths and top offsets are explicit
            so nothing collides and nothing leaves a dead field of paper. */}
        <div className="mt-14 md:mt-24">
          <div className="md:mx-auto md:w-[76%]">
            <RevealFigure
              src="/images/home/feature-01.jpg"
              alt="A groom lifting his bride's veil at the end of the ceremony"
              aspect="aspect-[3/2]"
              sizes="(min-width: 768px) 68vw, 100vw"
              parallax={5}
              caption="The Ceremony — Drakensberg"
              captionClassName="md:text-right"
            />
          </div>

          <div className="mt-10 grid grid-cols-12 gap-x-4 gap-y-10 md:-mt-24 md:flex md:items-start md:gap-6">
            <div className="col-span-7 md:w-[24%]">
              <RevealFigure
                src="/images/home/feature-03.jpg"
                alt="Wedding rings resting in their box"
                aspect="aspect-[4/3]"
                sizes="(min-width: 768px) 24vw, 58vw"
                parallax={9}
                delay={0.1}
              />
              <FadeIn delay={0.2} className="mt-8 hidden md:block">
                <p className="text-sm leading-[1.85] text-foreground/65">
                  Every wedding is photographed as a single body of work — details,
                  ceremony, portraits and the long evening after — edited together so
                  the day still reads in order years from now.
                </p>
                <div className="mt-8">
                  <AnimatedButton href="/portfolio/weddings" variant="outline">
                    View Wedding Portfolio
                  </AnimatedButton>
                </div>
              </FadeIn>
            </div>

            <div className="col-span-8 col-start-5 md:w-[26%] md:pt-52">
              <RevealFigure
                src="/images/home/feature-04.jpg"
                alt="Black and white portrait of a bride walking a country path"
                aspect="aspect-[2/3]"
                sizes="(min-width: 768px) 26vw, 66vw"
                parallax={10}
                delay={0.15}
              />
            </div>

            <div className="col-span-10 col-start-3 md:ml-auto md:w-[34%] md:pt-24">
              <RevealFigure
                src="/images/home/feature-02.jpg"
                alt="A couple photographed beneath the bride's veil"
                aspect="aspect-[4/5]"
                sizes="(min-width: 768px) 34vw, 82vw"
                parallax={7}
                delay={0.05}
                caption="Couple Portrait"
              />
            </div>
          </div>

          <FadeIn delay={0.2} className="mt-12 md:hidden">
            <p className="text-[0.95rem] leading-[1.85] text-foreground/65">
              Every wedding is photographed as a single body of work — details,
              ceremony, portraits and the long evening after — edited together so the
              day still reads in order years from now.
            </p>
            <div className="mt-8">
              <AnimatedButton href="/portfolio/weddings" variant="outline">
                View Wedding Portfolio
              </AnimatedButton>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
