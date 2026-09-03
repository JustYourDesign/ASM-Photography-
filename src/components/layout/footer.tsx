import Link from "next/link";
import { Mail } from "lucide-react";
import { InstagramIcon, FacebookIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { AsmLogoThemed } from "@/components/ui/asm-logo";
import { navLinks, socialLinks, portfolioCategories } from "@/lib/data";

const icons = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  LinkedIn: LinkedInIcon,
  Email: Mail,
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-foreground/10 bg-background">
      <div className="mx-auto max-w-[1680px] px-5 py-16 sm:px-8 md:px-12 md:py-24">
        <div className="grid gap-14 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            {/* Full supplied lockup — used here because there is room for the wordmark. */}
            <Link href="/" aria-label="ASM Photography — home" className="inline-block">
              <AsmLogoThemed variant="full" height={150} className="h-[126px] w-auto md:h-[150px]" />
            </Link>
            <p className="mt-8 max-w-xs text-sm leading-[1.85] text-foreground/55">
              Wedding photography, photographed as one continuous story. Fashion,
              editorial and studio commissions by request.
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-2 md:col-start-6">
            <p className="label text-foreground/35">Navigate</p>
            <ul className="mt-6 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-display text-xl text-foreground/75 transition-colors duration-500 hover:text-beige"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3 md:col-start-8">
            <p className="label text-foreground/35">Portfolio</p>
            <ul className="mt-6 space-y-3">
              {portfolioCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/portfolio/${cat.slug}`}
                    className="font-display text-xl text-foreground/75 transition-colors duration-500 hover:text-beige"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 md:col-start-11">
            <p className="label text-foreground/35">Follow</p>
            <div className="mt-6 flex items-center gap-5">
              {socialLinks.map((s) => {
                const Icon = icons[s.label as keyof typeof icons];
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
            </div>
            <Link
              href="/contact"
              className="mt-8 inline-block label border-b border-foreground/25 pb-1.5 text-foreground/60 transition-colors duration-500 hover:border-beige hover:text-beige"
            >
              Start an enquiry
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-foreground/10 pt-8 sm:flex-row sm:items-center">
          <p className="label text-foreground/35">
            © {year} ASM Photography. All rights reserved.
          </p>
          <p className="label text-foreground/25">Weddings · Fashion / Editorial · Studio</p>
        </div>
      </div>
    </footer>
  );
}
