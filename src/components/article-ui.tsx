import Image from "next/image";
import Link from "next/link";
import { useId } from "react";
import { formatThaiDate } from "@/lib/site";
import { articles, getAdjacentArticles, type Article } from "@/lib/content";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import { affiliateHref } from "@/lib/affiliate";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { ProductGallery, type ProductImage } from "@/components/product-gallery";
import { ReportLink } from "@/components/report-link";
import { TocNav } from "@/components/toc-nav";
import { Reveal } from "@/components/reveal";

// ปล่อยเฉพาะลิงก์ https:// — guard เดียวกับ registry แต่ครอบ prop href/links ที่ส่งตรง (กัน javascript:/data:/mixed-content)
const safeHref = (u: string | undefined): string | undefined =>
  u && u.startsWith("https://") ? u : undefined;

/** ส่วนหัวบทความ: breadcrumb + หมวด + ชื่อเรื่อง + บรรทัดผู้เขียน/วันที่/เวลาอ่าน + รูปปก */
export function ArticleHeader({ article }: { article: Article }) {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "หน้าแรก", path: "/" },
          { name: article.title, path: `/articles/${article.slug}` },
        ])}
      />
      <header className="mx-auto max-w-3xl px-5 pt-14 sm:px-8">
        <Breadcrumb current={article.category} />
        <span className="mt-6 inline-block text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-betta">
          {article.category}
        </span>
        <h1 className="mt-3 font-heading text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl">
          {article.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>โดย {article.author}</span>
          <span className="text-border" aria-hidden>·</span>
          <time dateTime={article.date}>{formatThaiDate(article.date)}</time>
          <span className="text-border" aria-hidden>·</span>
          <span>อ่าน {article.readMin} นาที</span>
        </div>
      </header>

      <div className="mx-auto mt-8 max-w-5xl px-5 sm:px-8">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 960px"
            className="object-cover"
          />
        </div>
      </div>
    </>
  );
}

/** กล่องสารบัญ "ในบทความนี้" — แต่ละหัวข้อลิงก์ไปยัง id ของ <h2> ในหน้า (deep-link/แชร์เฉพาะส่วนได้) */
export function TableOfContents({ items }: { items: { label: string; id: string }[] }) {
  return (
    <div className="my-8 rounded-xl border border-border bg-muted/50 px-6 py-5">
      <strong className="font-heading text-base">ในบทความนี้</strong>
      {/* scrollspy ไฮไลต์หัวข้อที่กำลังอ่าน (degrade เป็นลิงก์ข้ามปกติเมื่อไม่มี JS) */}
      <TocNav items={items} />
    </div>
  );
}

/**
 * คำถามที่พบบ่อย — ใช้ <details> เนทีฟ (เข้าถึงได้ฟรี ไม่ต้องใช้ JS) + ปล่อย FAQPage JSON-LD
 * จาก items ชุดเดียวกัน เพื่อให้ structured data ตรงกับสิ่งที่แสดงบนหน้าจริงเสมอ
 */
export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="faq-heading" className="mt-14">
      <h2 id="faq-heading" className="font-heading text-2xl font-semibold tracking-tight">
        คำถามที่พบบ่อย
      </h2>
      <div className="mt-5 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card/50">
        {items.map((it) => (
          <details key={it.q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-heading text-base font-medium text-foreground [&::-webkit-details-marker]:hidden">
              {it.q}
              <span
                aria-hidden
                className="shrink-0 text-xl leading-none text-betta transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{it.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqJsonLd(items)} />
    </section>
  );
}

/** กล่องเน้นข้อความ — tone "tip" (ฟ้า/teal) หรือ "warn" (โทนเตือน) */
export function Callout({
  tone = "tip",
  title,
  children,
}: {
  tone?: "tip" | "warn";
  title: string;
  children: React.ReactNode;
}) {
  const styles =
    tone === "warn"
      ? "border-destructive/40 bg-destructive/10"
      : "border-betta/30 bg-betta/5";
  const titleColor = tone === "warn" ? "text-destructive" : "text-betta";
  return (
    <div className={`my-6 rounded-xl border px-6 py-4 ${styles}`}>
      <strong className={titleColor}>{title}:</strong> {children}
    </div>
  );
}

/**
 * กล่องแนะนำอุปกรณ์ — ออกแบบให้ "ซื่อสัตย์": ไม่มีรูปสินค้าปลอม ไม่มีดาว/ราคาปลอม
 * price = ช่วงราคาตลาดจริง (ทางเลือก), href = ลิงก์พันธมิตรจริง (ถ้ายังไม่มีจะขึ้นว่ากำลังคัดรุ่น)
 */
export function GearPick({
  label = "ของแนะนำ",
  name,
  price,
  why,
  points,
  href,
  affiliateKey,
  image,
  imageAlt,
  images,
  links,
}: {
  label?: string;
  name: string;
  price?: string;
  why: string;
  points?: string[];
  href?: string;
  /** อ้างลิงก์จาก src/lib/affiliate.ts; ถ้ายังไม่ตั้งลิงก์ GearPick จะขึ้น "กำลังคัดรุ่น" ให้เอง */
  affiliateKey?: string;
  /** รูปสินค้าจริงรูปเดียว (ทางเลือก) — แสดงเป็นทัมบ์เนลด้านซ้ายของการ์ด */
  image?: string;
  imageAlt?: string;
  /** หลายรูป (ทางเลือก) — แสดงเป็นแกลเลอรี interactive สลับดูได้; มาก่อน image ถ้ามีทั้งคู่ */
  images?: ProductImage[];
  /** หลายปุ่มลิงก์ (ทางเลือก) เช่น กรอง + ปั๊มลม — ปุ่มแรกเป็นปุ่มหลัก ที่เหลือเป็นปุ่มรอง */
  links?: { label: string; key?: string; href?: string }[];
}) {
  const headingId = useId();
  // ลำดับความสำคัญ: href ที่ส่งตรง > ลิงก์จาก registry ตาม affiliateKey (กรองให้เหลือเฉพาะ https://)
  const resolvedHref = safeHref(href ?? (affiliateKey ? affiliateHref(affiliateKey) : undefined));
  // รวมรูปให้อยู่รูปแบบเดียว (หลายรูป หรือรูปเดี่ยว) เพื่อให้ผ่าน ProductGallery ทั้งหมด → ได้ lightbox เหมือนกัน
  const galleryImages: ProductImage[] | null =
    images && images.length > 0
      ? images
      : image
        ? [{ src: image, alt: imageAlt ?? name }]
        : null;
  // รายการปุ่มลิงก์: ใช้ links ถ้าส่งมา ไม่งั้นใช้ลิงก์เดี่ยวจาก href/affiliateKey
  const ctas = (
    links && links.length > 0
      ? links.map((l) => ({ label: l.label, href: safeHref(l.href ?? (l.key ? affiliateHref(l.key) : undefined)) }))
      : resolvedHref
        ? [{ label: "ดูตัวอย่างรุ่นแนะนำ", href: resolvedHref }]
        : []
  ).filter((c): c is { label: string; href: string } => !!c.href);
  return (
    <Reveal className="my-9">
    <aside
      aria-labelledby={headingId}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <div className={galleryImages ? "flex flex-col gap-5 sm:flex-row sm:items-start" : undefined}>
        {galleryImages && (
          <div className="mx-auto w-32 shrink-0 sm:mx-0">
            <ProductGallery images={galleryImages} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <span className="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
          <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h3 id={headingId} className="font-heading text-lg font-semibold">{name}</h3>
            {price && <span className="text-sm text-muted-foreground">{price}</span>}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{why}</p>
          {points && points.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {points.map((p) => (
                <div key={p} className="flex gap-2 text-sm text-foreground/85">
                  <span aria-hidden className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-betta" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {ctas.length > 0 ? (
              <>
                {ctas.map((c, i) => (
                  <a
                    key={c.href}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className={
                      i === 0
                        ? "inline-flex items-center gap-2 rounded-full bg-betta px-5 py-2.5 text-sm font-medium text-betta-foreground no-underline transition-transform hover:-translate-y-0.5"
                        : "inline-flex items-center gap-2 rounded-full border border-betta/50 px-5 py-2.5 text-sm font-medium text-betta no-underline transition-transform hover:-translate-y-0.5 hover:border-betta"
                    }
                  >
                    {c.label} →
                  </a>
                ))}
                <Link
                  href="/privacy#affiliate"
                  className="text-xs text-muted-foreground underline-offset-2 hover:text-betta hover:underline"
                >
                  * ลิงก์พันธมิตร
                </Link>
                <ReportLink productName={name} />
              </>
            ) : (
              <span className="text-xs text-muted-foreground">
                * เรากำลังคัดรุ่นที่แนะนำ จะอัปเดตลิงก์ให้เร็วๆ นี้
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
    </Reveal>
  );
}

/**
 * ท้ายบทความ: การ์ดบทความก่อนหน้า/ถัดไป (เรียงตามวันที่) + ลิงก์กลับหน้าแรก
 * ส่ง currentSlug เพื่อให้คำนวณบทความข้างเคียง; ถ้าไม่ส่งจะแสดงแค่ลิงก์กลับหน้าแรก
 */
export function ArticleFooterNav({ currentSlug }: { currentSlug?: string }) {
  const { prev, next } = currentSlug ? getAdjacentArticles(currentSlug) : {};
  return (
    <div className="mt-12 border-t border-border pt-8">
      {(prev || next) && (
        <nav aria-label="บทความอื่นในคู่มือ" className="mb-8 grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/articles/${prev.slug}`}
              className="group flex flex-col gap-1 rounded-xl border border-border bg-card/50 p-4 transition-colors hover:border-betta/50"
            >
              <span className="text-xs text-muted-foreground">
                <span aria-hidden>←</span> ก่อนหน้า
              </span>
              <span className="font-heading text-sm font-semibold leading-snug transition-colors group-hover:text-betta">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next ? (
            <Link
              href={`/articles/${next.slug}`}
              className="group flex flex-col gap-1 rounded-xl border border-border bg-card/50 p-4 text-right transition-colors hover:border-betta/50"
            >
              <span className="text-xs text-muted-foreground">
                ถัดไป <span aria-hidden>→</span>
              </span>
              <span className="font-heading text-sm font-semibold leading-snug transition-colors group-hover:text-betta">
                {next.title}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
        </nav>
      )}
      {currentSlug && (
        <nav aria-label="คู่มืออื่นๆ" className="mb-8">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            คู่มืออื่นๆ
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {articles
              .filter((a) => a.available && a.slug !== currentSlug)
              .map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/articles/${a.slug}`}
                    className="text-sm text-foreground/80 underline-offset-2 hover:text-betta hover:underline"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      )}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-betta"
      >
        <span aria-hidden>←</span> กลับหน้าแรก
      </Link>
    </div>
  );
}
