import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export type Category = {
  index: string;
  name: string;
  desc: string;
  image: string;
  href: string;
};

export type Article = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  /** ข้อความบรรยายรูปปก ให้ตรงกับภาพจริง */
  imageAlt: string;
  readMin: number;
  date: string;
  /** วันที่แก้ไขล่าสุด (YYYY-MM-DD) — ใส่เมื่อแก้เนื้อหาบทความเดิม เพื่อให้ dateModified ใน JSON-LD สดจริง; ไม่ใส่ = ใช้ date */
  updated?: string;
  author: string;
  /** true = มีหน้าบทความจริงให้คลิกอ่าน */
  available: boolean;
};

export type GalleryItem = {
  src: string;
  alt: string;
};

export const categories: Category[] = [
  {
    index: "01",
    name: "ปลากัด",
    desc: "สายพันธุ์ การเลือกตัว นิสัย และพื้นฐานการเลี้ยง",
    image: "/images/betta-red.jpg",
    href: "/articles/betta-types",
  },
  {
    index: "02",
    name: "ตู้ปลา",
    desc: "ขนาดที่เหมาะ การจัดตู้ และของแต่งสวยๆ",
    image: "/images/tank.jpg",
    href: "/articles/setup-betta-tank",
  },
  {
    index: "03",
    name: "เครื่องกรอง & น้ำ",
    desc: "ระบบกรอง การปรับสภาพน้ำ ให้ปลาอยู่สบาย",
    image: "/images/aquarium.jpg",
    href: "/articles/best-betta-filters",
  },
  {
    index: "04",
    name: "อาหาร & การดูแล",
    desc: "ให้อาหารถูกวิธี ป้องกันโรค และดูแลรายวัน",
    image: "/images/care.jpg",
    href: "/articles/feeding-betta",
  },
];

export const articles: Article[] = [
  {
    slug: "setup-betta-tank",
    category: "คู่มือมือใหม่",
    title: "จัดตู้ปลากัดฉบับสมบูรณ์ สำหรับมือใหม่ 2026",
    excerpt:
      "ตั้งแต่เลือกขนาดตู้ จัดระบบน้ำ ไปจนถึงของที่ต้องมี — ครบในบทความเดียว ทำตามได้ทันทีแม้ไม่เคยเลี้ยงมาก่อน",
    image: "/images/tank.jpg",
    imageAlt: "ปลากัดสีม่วงครีบยาวในตู้กระจกทรงสี่เหลี่ยมปูกรวดสีอ่อน",
    readMin: 8,
    date: "2026-06-18",
    author: "ผู้ดูแล BettaHub",
    available: true,
  },
  {
    slug: "betta-types",
    category: "รู้จักปลากัด",
    title: "รู้จักสายพันธุ์ปลากัด และวิธีเลือกตัวที่สุขภาพดี",
    excerpt:
      "สายพันธุ์ปลากัดยอดนิยมแบ่งตามครีบ/หางและสีสัน ตัวผู้ต่างจากตัวเมียอย่างไร พร้อมเช็กลิสต์เลือกตัวที่แข็งแรงตั้งแต่ที่ร้าน",
    image: "/images/betta-red.jpg",
    imageAlt: "ปลากัดสีแดงอมส้มครีบยาว พื้นหลังสีดำ",
    readMin: 7,
    date: "2026-06-20",
    author: "ผู้ดูแล BettaHub",
    available: true,
  },
  {
    slug: "best-betta-filters",
    category: "รีวิวอุปกรณ์",
    title: "เครื่องกรองสำหรับตู้ปลากัด เลือกแบบไหนดี ฉบับเข้าใจง่าย",
    excerpt:
      "ปลากัดไม่ชอบน้ำแรง การเลือกเครื่องกรองจึงต่างจากปลาทั่วไป รวมประเภทกรองที่เหมาะ วิธีลดแรงน้ำ และเกณฑ์เลือกให้คุ้มราคา",
    image: "/images/aquarium.jpg",
    imageAlt: "ปลากัดสีแดงเข้มว่ายในตู้กระจกทรงสูงน้ำใส",
    readMin: 7,
    date: "2026-06-12",
    author: "ผู้ดูแล BettaHub",
    available: true,
  },
  {
    slug: "feeding-betta",
    category: "การดูแล",
    title: "ให้อาหารปลากัดยังไงให้สุขภาพดี ไม่ทำน้ำเสีย",
    excerpt:
      "ปริมาณ ความถี่ และชนิดอาหารที่เหมาะกับปลากัด พร้อมวิธีป้องกันท้องอืด ท้องผูก และน้ำขุ่นจากการให้อาหารเกิน",
    image: "/images/care.jpg",
    imageAlt: "ปลากัดสีแดง-ฟ้าสุขภาพดีในตู้ที่มีต้นไม้น้ำและกรวดสีน้ำเงิน",
    readMin: 6,
    date: "2026-06-05",
    author: "ผู้ดูแล BettaHub",
    available: true,
  },
];

// ภายในโมดูลเท่านั้น — หน้าเพจใช้ getArticleOrThrow/getAdjacentArticles (ไม่เผยตัวที่คืน undefined ออกไป)
function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

/**
 * เหมือน getArticle แต่ throw ข้อความที่ระบุ slug แทนการคืน undefined
 * ใช้ที่ top-level ของหน้าบทความ เพื่อให้ build พังพร้อมบริบทชัด (ไม่ใช่ TypeError ลึกลับจาก `!`)
 */
export function getArticleOrThrow(slug: string): Article {
  const article = getArticle(slug);
  if (!article) throw new Error(`Unknown article slug: ${slug}`);
  return article;
}

/**
 * สร้าง metadata ของหน้าบทความให้ DRY — เติม OG scaffold + canonical ครั้งเดียว
 * คง description (เนื้อหา <meta>) กับ ogDescription แยกกัน เพื่อรักษา OG สั้นที่บางหน้าตั้งใจไว้
 */
export function buildArticleMetadata(
  slug: string,
  description: string,
  ogDescription: string = description,
): Metadata {
  const article = getArticleOrThrow(slug);
  return {
    title: article.title,
    description,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: "article",
      locale: "th_TH",
      siteName: SITE_NAME,
      title: article.title,
      description: ogDescription,
      publishedTime: `${article.date}T00:00:00.000Z`,
      authors: [article.author],
      images: [article.image],
    },
    // ตั้ง twitter ต่อหน้าด้วย — Next 16 merge metadata แบบ shallow: ถ้าลูกไม่ตั้ง twitter
    // จะ "สืบทอด" twitter ของ root (การ์ดหน้าแรก) ทั้งก้อน ทำให้แชร์บทความบน X ขึ้นการ์ดหน้าแรก
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: ogDescription,
      images: [article.image],
    },
  };
}

/**
 * บทความก่อนหน้า/ถัดไป เรียงตามวันที่ (เก่า→ใหม่) เฉพาะบทความที่เปิดอ่านได้
 * หมายเหตุ: เรียงตามวันที่ล้วน ไม่ใช่ตามหมวด (category ของแต่ละบทความไม่ซ้ำกัน จับคู่ตามหมวดจะได้ 0)
 */
export function getAdjacentArticles(slug: string): { prev?: Article; next?: Article } {
  const ordered = articles.filter((a) => a.available).sort((a, b) => a.date.localeCompare(b.date));
  const i = ordered.findIndex((a) => a.slug === slug);
  if (i === -1) return {};
  return {
    prev: i > 0 ? ordered[i - 1] : undefined,
    next: i < ordered.length - 1 ? ordered[i + 1] : undefined,
  };
}

export const gallery: GalleryItem[] = [
  { src: "/images/betta-red.jpg", alt: "ปลากัดสีแดงอมส้มครีบยาว พื้นหลังสีดำ" },
  { src: "/images/betta-blue.jpg", alt: "ปลากัดสีน้ำเงินครีบพลิ้ว พื้นหลังสีดำ" },
  { src: "/images/betta-white.jpg", alt: "ปลากัดสีขาวครีบสง่างาม พื้นหลังสีดำ" },
  { src: "/images/filter.jpg", alt: "ปลากัดครีบยาวสีแดง-น้ำเงินว่ายในตู้น้ำโทนมืด" },
];
