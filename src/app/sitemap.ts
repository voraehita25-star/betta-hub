import type { MetadataRoute } from "next";
import { articles } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const live = articles.filter((a) => a.available);
  // lastmod ของหน้ารวม/หน้าแรก = วันที่บทความล่าสุดถูกแก้ (updated ?? date) — แม่นยำจริง ไม่ใช่ build time
  const latest = live.reduce(
    (acc, a) => ((a.updated ?? a.date) > acc ? (a.updated ?? a.date) : acc),
    "1970-01-01",
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date(latest),
      changeFrequency: "weekly",
      priority: 1,
      images: [`${base}/images/hero.jpg`],
    },
    { url: `${base}/articles`, lastModified: new Date(latest), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date("2026-06-26"), changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/tools/water-change`, lastModified: new Date("2026-06-18"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: new Date("2026-06-22"), changeFrequency: "yearly", priority: 0.3 },
  ];

  // บทความ: lastmod = updated ?? date (ตรงกับ JSON-LD dateModified) + รูปปกเข้า Google Images
  const articleRoutes: MetadataRoute.Sitemap = live.map((a) => ({
    url: `${base}/articles/${a.slug}`,
    lastModified: new Date(a.updated ?? a.date),
    changeFrequency: "monthly",
    priority: 0.8,
    images: [`${base}${a.image}`],
  }));

  return [...staticRoutes, ...articleRoutes];
}
