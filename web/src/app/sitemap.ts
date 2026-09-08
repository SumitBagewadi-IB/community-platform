import type { MetadataRoute } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { categories } from "@/lib/data";

const BASE = "https://community-platform-620876318042.asia-south1.run.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "hourly", priority: 1 },
    { url: `${BASE}/categories`, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/guidelines`, changeFrequency: "monthly", priority: 0.3 },
    ...categories.map((c) => ({
      url: `${BASE}/c/${c.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
  ];

  try {
    const snap = await getDocs(collection(db, "topics"));
    const topicRoutes: MetadataRoute.Sitemap = snap.docs.map((d) => ({
      url: `${BASE}/topic/${d.id}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
    return [...staticRoutes, ...topicRoutes];
  } catch {
    // Firestore unreachable at build/request time — ship the static routes
    // rather than failing the whole sitemap.
    return staticRoutes;
  }
}
