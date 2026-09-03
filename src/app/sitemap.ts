import type { MetadataRoute } from "next";
import { portfolioCategories } from "@/lib/data";

const BASE = "https://asmphotography.co.za";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/portfolio", "/information", "/contact"].map((path) => ({
    url: `${BASE}${path}`,
    // Weddings-first: the home and portfolio pages are the conversion path.
    priority: path === "" ? 1 : 0.9,
    changeFrequency: "monthly" as const,
  }));

  const categoryRoutes = portfolioCategories.map((category) => ({
    url: `${BASE}/portfolio/${category.slug}`,
    priority: category.emphasis === "primary" ? 0.9 : 0.6,
    changeFrequency: "monthly" as const,
  }));

  const shootRoutes = portfolioCategories.flatMap((category) =>
    category.shoots.map((shoot) => ({
      url: `${BASE}/portfolio/${category.slug}/${shoot.slug}`,
      priority: category.emphasis === "primary" ? 0.8 : 0.5,
      changeFrequency: "yearly" as const,
    }))
  );

  return [...staticRoutes, ...categoryRoutes, ...shootRoutes];
}
