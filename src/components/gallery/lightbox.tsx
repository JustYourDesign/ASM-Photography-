"use client";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { GalleryImage } from "@/lib/data";

type GalleryLightboxProps = {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
};

export function GalleryLightbox({ images, index, onClose }: GalleryLightboxProps) {
  return (
    <Lightbox
      open={index !== null}
      close={onClose}
      index={index ?? 0}
      slides={images.map((img) => ({
        src: img.image,
        alt: img.title,
        width: img.width,
        height: img.height,
      }))}
      styles={{
        container: { backgroundColor: "rgba(11, 11, 11, 0.97)" },
        button: { filter: "none" },
      }}
      // Slow enough to match the rest of the site, quick enough to stay usable.
      animation={{ fade: 400, swipe: 500 }}
      controller={{ closeOnBackdropClick: true }}
    />
  );
}
