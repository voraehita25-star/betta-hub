import type { Article } from "@/lib/content";
import { SITE_NAME, getSiteUrl } from "@/lib/site";

// สร้าง structured data (schema.org) ให้ Google/AI เข้าใจหน้าเว็บ
// ยึดความซื่อสัตย์: author เป็น Person ตามที่ลงชื่อจริง, ไม่ปลอม Organization/logo (ขัดหน้า privacy ที่ระบุว่าไม่ใช่องค์กร)
// และไม่ใส่ aggregateRating/review ปลอม

/** BlogPosting ของหน้าบทความ — image เป็น absolute URL ตาม schema.org */
export function articleJsonLd(article: Article) {
  const base = getSiteUrl();
  const url = `${base}/articles/${article.slug}`;
  const published = `${article.date}T00:00:00.000Z`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: {
      "@type": "ImageObject",
      url: `${base}${article.image}`,
    },
    datePublished: published,
    dateModified: published,
    inLanguage: "th-TH",
    author: { "@type": "Person", name: article.author },
    publisher: { "@type": "Person", name: article.author },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
}

/** WebSite ของหน้าแรก */
export function websiteJsonLd() {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${base}/`,
    inLanguage: "th-TH",
  };
}

/** FAQPage — emit เฉพาะคำถาม/คำตอบที่แสดงบนหน้าจริงเท่านั้น (กฎ Google + ความซื่อสัตย์) */
export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}
