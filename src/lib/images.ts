import manifest from "./image-manifest.json";

type Meta = { w: number; h: number };

const meta = manifest as Record<string, Meta>;

/** Intrinsic dimensions of a processed image, or null if it isn't in the manifest. */
export function imageMeta(src: string): Meta | null {
  return meta[src] ?? null;
}

/** Width / height. Falls back to 1 (square) for unknown images. */
export function aspectRatio(src: string): number {
  const m = meta[src];
  return m ? m.w / m.h : 1;
}

export type Orientation = "landscape" | "portrait" | "square";

/**
 * Layout bucket for an image. The editorial galleries size items by orientation
 * rather than forcing every photograph into the same crop.
 */
export function orientation(src: string): Orientation {
  const ratio = aspectRatio(src);
  if (ratio > 1.15) return "landscape";
  if (ratio < 0.87) return "portrait";
  return "square";
}
