import type { MetadataRoute } from "next";
import { calculators } from "@/lib/calculators";
import { guides } from "@/lib/guides";

const staticPages = ["", "about", "contact", "privacy-policy", "terms-and-conditions", "disclaimer", "cookie-policy", "business-calculators", "ecommerce-calculators", "financial-calculators", "guides"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://fincelio.com";
  return [
    ...staticPages.map((slug) => ({ url: slug ? `${base}/${slug}/` : `${base}/`, changeFrequency: "monthly" as const, priority: slug ? 0.6 : 1 })),
    ...calculators.map((calculator) => ({ url: `${base}/${calculator.slug}/`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...guides.map((guide) => ({ url: `${base}/guides/${guide.slug}/`, changeFrequency: "monthly" as const, priority: 0.7 }))
  ];
}
