import { HeroCarousel } from "@/components/home/hero-carousel";
import { WeddingStatement } from "@/components/home/wedding-statement";
import { WeddingFeature } from "@/components/home/wedding-feature";
import { WeddingExperience } from "@/components/home/wedding-experience";
import { FeaturedWeddings } from "@/components/home/featured-weddings";
import { FashionPreview } from "@/components/home/fashion-preview";
import { StudioPreview } from "@/components/home/studio-preview";
import { WeddingCTA } from "@/components/home/wedding-cta";

/**
 * Homepage order is deliberate: weddings occupy everything above the fold and
 * the whole first half of the scroll. Fashion and studio appear only once the
 * wedding story has been told in full.
 */
export default function Home() {
  return (
    <>
      <HeroCarousel />
      <WeddingStatement />
      <WeddingFeature />
      <WeddingExperience />
      <FeaturedWeddings />
      <FashionPreview />
      <StudioPreview />
      <WeddingCTA />
    </>
  );
}
