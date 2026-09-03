import type { Metadata } from "next";
import Image from "next/image";
import { Mail } from "lucide-react";
import { InstagramIcon, FacebookIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { RevealText } from "@/components/animations/reveal-text";
import { FadeIn } from "@/components/animations/fade-in";
import { ContactForm } from "@/components/contact/contact-form";
import { socialLinks } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Enquire about wedding photography with ASM Photography. Fashion, editorial and studio commissions welcome.",
};

/** PLACEHOLDER — replace with ASM's real contact details before launch. */
const contactDetails = [
  { label: "Email", value: "hello@asmphotography.co.za", href: "mailto:hello@asmphotography.co.za" },
  { label: "Phone", value: "TODO — phone number", href: "tel:" },
  { label: "Based in", value: "TODO — city, South Africa", href: undefined },
];

const socialIcons = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  LinkedIn: LinkedInIcon,
  Email: Mail,
};

const isPlaceholder = (value: string) => value.trim().toUpperCase().startsWith("TODO");

export default function ContactPage() {
  return (
    <div>
      <section className="mx-auto max-w-[1680px] px-5 pb-14 pt-[132px] sm:px-8 md:px-12 md:pb-20 md:pt-[188px]">
        <p className="label text-beige">Contact</p>
        <h1 className="mt-7 font-display text-[clamp(2.75rem,9vw,7.5rem)] font-light leading-[0.9] text-foreground md:mt-10">
          <RevealText text="Let’s capture" />
          <span className="block">
            <RevealText text="your" delay={0.2} />{" "}
            <span className="font-cursive text-beige [font-size:0.9em]">
              <RevealText text="story" delay={0.32} />
            </span>
          </span>
        </h1>
      </section>

      <div className="mx-auto grid max-w-[1680px] grid-cols-1 gap-14 px-5 pb-20 sm:px-8 md:grid-cols-12 md:gap-8 md:px-12 md:pb-32">
        <div className="md:col-span-4">
          <FadeIn>
            <p className="max-w-sm text-[0.95rem] leading-[1.9] text-foreground/65">
              Wedding dates are limited each season, so the earlier you reach out the
              better. Tell me your date, your venue, and a little about the day you&rsquo;re
              planning — I&rsquo;ll come back with availability and the full pricing guide.
            </p>
          </FadeIn>

          <FadeIn delay={0.12} className="mt-12">
            <dl>
              {contactDetails.map((detail) => (
                <div key={detail.label} className="border-t border-foreground/10 py-5">
                  <dt className="label text-foreground/35">{detail.label}</dt>
                  <dd className="mt-2.5">
                    {detail.href && !isPlaceholder(detail.value) ? (
                      <a
                        href={detail.href}
                        className="font-display text-xl text-foreground/85 transition-colors duration-500 hover:text-beige"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      <span
                        className={
                          isPlaceholder(detail.value)
                            ? "font-display text-xl italic text-beige/80"
                            : "font-display text-xl text-foreground/85"
                        }
                      >
                        {detail.value}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-10 flex gap-5">
            {socialLinks.map((s) => {
              const Icon = socialIcons[s.label as keyof typeof socialIcons];
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.label === "Email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  data-cursor="hidden"
                  className="text-foreground/50 transition-colors duration-500 hover:text-beige"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              );
            })}
          </FadeIn>

          <FadeIn delay={0.28} className="mt-14 hidden md:block">
            <div className="dark relative aspect-[4/5] w-full overflow-hidden bg-scrim">
              <Image
                src="/images/weddings/sambo/portraits-03.jpg"
                alt="A couple photographed on their wedding day"
                fill
                sizes="30vw"
                quality={80}
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.15} className="md:col-span-7 md:col-start-6">
          <ContactForm />
        </FadeIn>
      </div>
    </div>
  );
}
