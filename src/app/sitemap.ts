import type { MetadataRoute } from "next";
import { SITE } from "@/shared/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      changeFrequency: "monthly",
      priority: 1
    },
    {
      url: `${SITE.url}/cases/silver3`,
      changeFrequency: "monthly",
      priority: 0.8
    }
  ];
}
