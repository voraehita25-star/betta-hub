import type { Article } from "@/lib/content";
import { SITE_NAME, SITE_AUTHOR, getSiteUrl, imageDims } from "@/lib/site";

// สร้าง structured data (schema.org) ให้ Google/AI เข้าใจหน้าเว็บ
// ยึดความซื่อสัตย์: author เป็น Person ตามที่ลงชื่อจริง, ไม่ปลอม Organization/logo (ขัดหน้า privacy ที่ระบุว่าไม่ใช่องค์กร)
// และไม่ใส่ aggregateRating/review/HowTo ปลอม

// หัวข้อที่ผู้เขียนเชี่ยวชาญ — เสริมสัญญาณ E-E-A-T (ใช้ใน author ของบทความ + ProfilePage ของ /about)
const KNOWS_ABOUT = [
  "การเลี้ยงปลากัด",
  "การจัดตู้ปลากัด",
  "เครื่องกรองตู้ปลา",
  "อาหารปลากัด",
  "การดูแลคุณภาพน้ำ",
];

/** Person ผู้เขียน — โยงไป /about ให้ search/AI ยืนยันตัวตนผู้เขียนได้ (ไม่มี sameAs เพราะยังไม่มีโปรไฟล์สาธารณะจริง) */
function authorPerson(base: string, name: string) {
  return { "@type": "Person", name, url: `${base}/about`, knowsAbout: KNOWS_ABOUT };
}

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
    author: authorPerson(base, article.author),
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

/** ProfilePage ของหน้า /about — โยงตัวตนผู้เขียน (Person + knowsAbout) ให้ search/AI ยืนยัน E-E-A-T */
export function aboutJsonLd() {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${base}/about`,
    url: `${base}/about`,
    inLanguage: "th-TH",
    isPartOf: { "@type": "WebSite", "@id": `${base}/#website` },
    mainEntity: {
      "@type": "Person",
      name: SITE_AUTHOR,
      url: `${base}/about`,
      description:
        "ผู้ดูแลและผู้เขียน BettaHub — ผู้เลี้ยงปลากัดที่แบ่งปันคู่มือและรีวิวอุปกรณ์จากประสบการณ์จริง ดูแลเว็บในฐานะงานอดิเรกของบุคคลคนเดียว ไม่ใช่องค์กร",
      knowsAbout: KNOWS_ABOUT,
    },
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
