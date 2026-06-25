import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { articles } from "@/lib/content";
import { formatThaiDate } from "@/lib/site";
import { breadcrumbJsonLd, blogItemListJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumb } from "@/components/breadcrumb";

export const metadata: Metadata = {
  title: "บทความทั้งหมด",
  description:
    "รวมคู่มือและรีวิวเรื่องการเลี้ยงปลากัดทั้งหมดของ BettaHub — จัดตู้ เลือกเครื่องกรอง ให้อาหาร และรู้จักสายพันธุ์ปลากัด อ่านฟรีครบทุกบทความ",
  alternates: {
    canonical: "/articles",
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default function ArticlesIndex() {
  const live = articles
    .filter((a) => a.available)
    .sort((a, b) => (b.updated ?? b.date).localeCompare(a.updated ?? a.date));

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "หน้าแรก", path: "/" },
          { name: "บทความ", path: "/articles" },
        ])}
      />
      <JsonLd data={blogItemListJsonLd(live.map((a) => ({ title: a.title, slug: a.slug })))} />

      <Breadcrumb current="บทความ" />
      <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        บทความทั้งหมด
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        คู่มือและรีวิวเรื่องการเลี้ยงปลากัด — ตั้งแต่จัดตู้ เลือกเครื่องกรอง การให้อาหาร
        ไปจนถึงการรู้จักสายพันธุ์ อ่านฟรีครบทุกบทความ
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {live.map((a) => (
          <Link key={a.slug} href={`/articles/${a.slug}`} className="group flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
              <Image
                src={a.image}
                alt={a.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <span className="mt-5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-betta">
              {a.category}
            </span>
            <h2 className="mt-2 font-heading text-xl font-semibold leading-snug transition-colors group-hover:text-primary">
              {a.title}
            </h2>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {a.excerpt}
            </p>
            <span className="mt-3 text-xs text-muted-foreground">
              อ่าน {a.readMin} นาที · {formatThaiDate(a.updated ?? a.date)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
