import type { MetadataRoute } from "next";
import { SITE } from "@/shared/config/site";

export default function robots(): MetadataRoute.Robots {
  const isPreview = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production";

  return {
    rules: isPreview
      ? {
          userAgent: "*",
          disallow: "/"
        }
      : {
          userAgent: "*",
          allow: "/"
        },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url
  };
}
