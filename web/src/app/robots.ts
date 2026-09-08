import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://community-platform-620876318042.asia-south1.run.app";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
