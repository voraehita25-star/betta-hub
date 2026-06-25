import type { Article } from "@/lib/content";
import { SITE_NAME, SITE_AUTHOR, getSiteUrl, imageDims } from "@/lib/site";

// สร้าง structured data (schema.org) ให้ Google/AI เข้าใจหน้าเว็บ
// ยึดความซื่อสัตย์: author เป็น Person ตามที่ลงชื่อจริง, ไม่ปลอม Organization/logo (ขัดหน้า privacy ที่ระบุว่าไม่ใช่องค์กร)
// และไม่ใส่ aggregateRating/review/HowTo ปลอม

/** ImageObject แบบ absolute URL + ใส่ width/height ถ้ารู้ขนาดจริง (Google แนะนำให้มี) */
function imageObject(path: string, base: string) {
  const d = imageDims(path);
  return {
    "@type": "ImageObject",
    url: `${base}${path}`,
    ...(d ? { width: d.w, height: d.h } : {}),
  };
}

/** BlogPosting ของหน้าบทความ */
export function articleJsonLd(article: Article) {
  const base = getSiteUrl();
  const url = `${base}/articles/${article.slug}`;
  const published = `${article.date}T00:00:00.000Z`;
  const modified = article.updated ? `${article.updated}T00:00:00.000Z` : published;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    // array ของ ImageObject ตามที่ Google แนะนำ (ใส่ขนาดจริงเพื่อผ่าน validation)
    image: [imageObject(article.image, base)],
    datePublished: published,
    dateModified: modified,
    articleSection: article.category,
    timeRequired: `PT${article.readMin}M`,
    inLanguage: "th-TH",
    author: { "@type": "Person", name: article.author },
    publisher: { "@type": "Person", name: article.author },
    // เชื่อมเข้ากับ WebSite entity เดียวของเว็บ
    isPartOf: { "@type": "WebSite", "@id": `${base}/#website` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
}

/** WebSite ของหน้าแรก (มี @id ให้ entity อื่นอ้างถึงได้) */
export function websiteJsonLd() {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    name: SITE_NAME,
    url: `${base}/`,
    inLanguage: "th-TH",
    publisher: { "@type": "Person", name: SITE_AUTHOR },
  };
}

/** BreadcrumbList — สะท้อน breadcrumb ที่แสดงจริงบนหน้า (Home → หน้านั้น) → rich result + เข้าใจโครงสร้างเว็บ */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${base}${it.path}`,
    })),
  };
}

/** ItemList ของบทความบนหน้าแรก — เสริมความเข้าใจว่าหน้าแรกคือศูนย์รวมคอนเทนต์ (semantic; ไม่ใช่ carousel rich result) */
export function blogItemListJsonLd(items: { title: string; slug: string }[]) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${base}/articles/${a.slug}`,
      name: a.title,
    })),
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
