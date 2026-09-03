import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/gallery/page-hero";
import { FadeIn, StaggerGroup } from "@/components/animations/fade-in";
import { WeddingPackageCard, PricingCard } from "@/components/information/pricing-card";
import { Accordion } from "@/components/ui/accordion";
import { AnimatedButton } from "@/components/ui/animated-button";
import { WeddingCTA } from "@/components/home/wedding-cta";
import {
  weddingPackages,
  weddingIncludes,
  bookingSteps,
  weddingDelivery,
  weddingTravel,
  engagementSessions,
  albumOptions,
  secondaryServices,
  averageInvestmentNote,
  faqs,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Information",
  description:
    "Wedding coverage, packages, what's included, the booking process, delivery timelines, travel, engagement sessions and albums.",
};

const isPlaceholder = (value: string) => value.trim().toUpperCase().startsWith("TODO");

export default function InformationPage() {
  return (
    <div>
      <PageHero
        eyebrow="Information"
        title="Weddings"
        scale="display"
        description="Everything you need before you enquire: what a day of coverage includes, how booking works, and when your photographs arrive. Fashion, editorial and studio rates follow further down."
        meta={[
          { label: "Coverage", value: "Full day" },
          { label: "Based in", value: "South Africa" },
        ]}
      />

      {/* ── Packages ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1680px] px-5 pb-16 sm:px-8 md:px-12 md:pb-24">
        <div className="editorial-rule mb-10 text-foreground md:mb-14" />
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(1.9rem,4.4vw,3.25rem)] font-light leading-[1.02] text-foreground">
            Wedding packages
          </h2>
          <p className="label text-foreground/35">Placeholder pricing</p>
        </div>

        <StaggerGroup
          className="mt-12 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-3 md:gap-8"
          stagger={0.1}
        >
          {weddingPackages.map((pkg, i) => (
            <WeddingPackageCard key={pkg.id} pkg={pkg} featured={i === 1} />
          ))}
        </StaggerGroup>

        <FadeIn delay={0.15} className="mt-12">
          <p
            className={
              isPlaceholder(averageInvestmentNote)
                ? "text-sm italic text-beige/80"
                : "text-sm text-foreground/60"
            }
          >
            {averageInvestmentNote}
          </p>
        </FadeIn>
      </section>

      {/* ── What's included ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1680px] px-5 py-16 sm:px-8 md:px-12 md:py-24">
        <div className="editorial-rule mb-10 text-foreground md:mb-14" />
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <FadeIn className="md:col-span-5">
            <h2 className="font-display text-[clamp(1.9rem,4.4vw,3.25rem)] font-light leading-[1.02] text-foreground">
              What&rsquo;s included
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-[1.9] text-foreground/60">
              Every wedding booking includes the same foundation, whichever package
              you choose.
            </p>
          </FadeIn>

          <FadeIn delay={0.12} className="md:col-span-6 md:col-start-7">
            <ul className="grid gap-0 sm:grid-cols-2">
              {weddingIncludes.map((item) => (
                <li
                  key={item}
                  className="border-t border-foreground/10 py-5 pr-6 text-sm leading-[1.7] text-foreground/70"
                >
                  <span className={isPlaceholder(item) ? "italic text-beige/80" : undefined}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* ── Booking process ──────────────────────────────────────────────── */}
      <section className="bg-sand/40 py-16 md:py-28">
        <div className="mx-auto max-w-[1680px] px-5 sm:px-8 md:px-12">
          <h2 className="font-display text-[clamp(1.9rem,4.4vw,3.25rem)] font-light leading-[1.02] text-foreground">
            The booking process
          </h2>

          <StaggerGroup
            className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 md:mt-16 md:grid-cols-3"
            stagger={0.07}
          >
            {bookingSteps.map((step) => (
              <FadeIn key={step.n} className="border-t border-foreground/15 pt-6">
                <p className="label text-beige">{step.n}</p>
                <h3 className="mt-4 font-display text-2xl font-light text-foreground">
                  {step.title}
                </h3>
                <p
                  className={`mt-4 max-w-xs text-sm leading-[1.8] ${
                    isPlaceholder(step.body) ? "italic text-beige/80" : "text-foreground/60"
                  }`}
                >
                  {step.body}
                </p>
              </FadeIn>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ── Delivery + travel ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1680px] px-5 py-16 sm:px-8 md:px-12 md:py-24">
        <div className="grid gap-14 md:grid-cols-12 md:gap-8">
          <FadeIn className="md:col-span-6">
            <h2 className="font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-light leading-[1.05] text-foreground">
              Delivery
            </h2>
            <dl className="mt-8">
              {weddingDelivery.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-wrap items-baseline justify-between gap-4 border-t border-foreground/10 py-5"
                >
                  <dt className="label text-foreground/45">{row.label}</dt>
                  <dd
                    className={`text-sm ${
                      isPlaceholder(row.value) ? "italic text-beige/80" : "text-foreground/75"
                    }`}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>

          <FadeIn delay={0.12} className="md:col-span-5 md:col-start-8">
            <h2 className="font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-light leading-[1.05] text-foreground">
              {weddingTravel.title}
            </h2>
            <p
              className={`mt-8 border-t border-foreground/10 pt-5 text-sm leading-[1.9] ${
                isPlaceholder(weddingTravel.body) ? "italic text-beige/80" : "text-foreground/65"
              }`}
            >
              {weddingTravel.body}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Engagement sessions ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1680px] px-5 py-16 sm:px-8 md:px-12 md:py-24">
        <div className="editorial-rule mb-10 text-foreground md:mb-14" />
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <FadeIn className="md:col-span-4">
            <h2 className="font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-light leading-[1.05] text-foreground">
              {engagementSessions.title}
            </h2>
            <p
              className={`mt-6 text-sm leading-[1.9] ${
                isPlaceholder(engagementSessions.body)
                  ? "italic text-beige/80"
                  : "text-foreground/65"
              }`}
            >
              {engagementSessions.body}
            </p>
            <p
              className={`label mt-6 ${
                isPlaceholder(engagementSessions.startingAt)
                  ? "italic text-beige/80"
                  : "text-foreground/70"
              }`}
            >
              {engagementSessions.startingAt}
            </p>
          </FadeIn>

          <FadeIn delay={0.12} className="md:col-span-7 md:col-start-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {engagementSessions.images.map((src, i) => (
                <div
                  key={src}
                  className={`dark relative aspect-[3/4] overflow-hidden bg-scrim ${
                    i % 2 === 1 ? "md:mt-8" : ""
                  }`}
                >
                  <Image
                    src={src}
                    alt="Engagement session"
                    fill
                    sizes="(min-width: 768px) 17vw, 46vw"
                    quality={78}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Albums ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1680px] px-5 py-16 sm:px-8 md:px-12 md:py-24">
        <div className="editorial-rule mb-10 text-foreground md:mb-14" />
        <div className="grid gap-8 md:grid-cols-12">
          <FadeIn className="md:col-span-4">
            <h2 className="font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-light leading-[1.05] text-foreground">
              {albumOptions.title}
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="md:col-span-6 md:col-start-6">
            <p
              className={`text-sm leading-[1.9] ${
                isPlaceholder(albumOptions.body) ? "italic text-beige/80" : "text-foreground/65"
              }`}
            >
              {albumOptions.body}
            </p>
            <p
              className={`label mt-6 ${
                isPlaceholder(albumOptions.startingAt)
                  ? "italic text-beige/80"
                  : "text-foreground/70"
              }`}
            >
              {albumOptions.startingAt}
            </p>
            <div className="mt-10">
              <AnimatedButton href="/contact" variant="outline">
                Inquire About Your Wedding
              </AnimatedButton>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Secondary services ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1680px] px-5 py-16 sm:px-8 md:px-12 md:py-24">
        <div className="editorial-rule mb-10 text-foreground md:mb-14" />
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-light leading-[1.05] text-foreground">
            Fashion / Editorial &amp; Studio
          </h2>
          <p className="label text-foreground/35">Commissions by request</p>
        </div>

        <StaggerGroup
          className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 md:mt-14 md:max-w-4xl md:gap-8"
          stagger={0.09}
        >
          {secondaryServices.map((pkg) => (
            <PricingCard key={pkg.id} pkg={pkg} />
          ))}
        </StaggerGroup>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1680px] px-5 py-16 sm:px-8 md:px-12 md:py-24">
        <div className="editorial-rule mb-10 text-foreground md:mb-14" />
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <FadeIn className="md:col-span-4">
            <h2 className="font-display text-[clamp(1.9rem,4.4vw,3.25rem)] font-light leading-[1.02] text-foreground">
              Frequently
              <br />
              asked
            </h2>
          </FadeIn>
          <FadeIn delay={0.12} className="md:col-span-7 md:col-start-6">
            <Accordion items={faqs} />
          </FadeIn>
        </div>
      </section>

      <WeddingCTA />
    </div>
  );
}
