import { articles } from "@/lib/content";
import { getSiteUrl, SITE_NAME } from "@/lib/site";

// RSS 2.0 feed — prerender เป็น static (route handler ไม่ cache เองใน Next 16)
export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(
    /[<>&'"]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!,
  );

export function GET(): Response {
  const base = getSiteUrl();
  const items = articles
    .filter((a) => a.available)
    .sort((a, b) => (b.updated ?? b.date).localeCompare(a.updated ?? a.date))
    .map((a) => {
      const url = `${base}/articles/${a.slug}`;
      return `<item><title>${esc(a.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(a.updated ?? a.date).toUTCString()}</pubDate><description>${esc(a.excerpt)}</description></item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${esc(SITE_NAME)}</title><link>${base}/</link><atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/><description>คู่มือและรีวิวเรื่องปลากัด ตู้ปลา และอุปกรณ์</description><language>th-TH</language>${items}</channel></rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
