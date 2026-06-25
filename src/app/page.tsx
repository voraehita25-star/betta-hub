import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { articles, categories, gallery } from "@/lib/content";
import { Hero3D } from "@/components/hero-3d";
import { TiltCard } from "@/components/tilt-card";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { websiteJsonLd, blogItemListJsonLd } from "@/lib/jsonld";
import { formatThaiDate } from "@/lib/site";

// ต้องมีบทความอย่างน้อย 1 ตัว — fail build แต่เนิ่น ๆ ถ้าใครลบหมด
// (ห่อใน function เพื่อให้ TS narrow ผลลัพธ์ข้าม function body ของ Home — module-level narrow ไม่ส่งต่อ)
function getFeatured() {
  const f = articles[0];
  if (!f) throw new Error("BettaHub: ต้องมีบทความอย่างน้อย 1 ตัวใน articles");
  return f;
}
const featured = getFeatured();

// "อ่านล่าสุด" — เรียงใหม่→เก่าจริงตามวันที่ ไม่ผูกกับลำดับใน array (กันลำดับเพี้ยนเงียบๆ เมื่อแก้ข้อมูล)
const latest = articles
  .filter((a) => a.slug !== featured.slug)
  .sort((a, b) => b.date.localeCompare(a.date));

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default function Home() {
  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd
        data={blogItemListJsonLd(
          articles.filter((a) => a.available).map((a) => ({ title: a.title, slug: a.slug })),
        )}
      />
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="dot-mask pointer-events-none absolute inset-0 z-0 opacity-[0.5]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] opacity-90">
          <Hero3D />
        </div>
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-24">
          <div className="relative">
            <span className="eyebrow">
              <span className="h-px w-6 bg-betta" /> คู่มือ &amp; รีวิว · ปลากัด
            </span>
            <h1 className="mt-6 font-heading text-[2.7rem] font-semibold leading-[1.08] tracking-tight sm:text-6xl">
              เลี้ยง<span className="text-betta">ปลากัด</span>
              <br />
              ให้สวยและแข็งแรง
              <br />
              อย่างมืออาชีพ
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              คู่มือจัดตู้ เลือกเครื่องกรอง การดูแลน้ำ และรีวิวอุปกรณ์ของจริง
              — เขียนให้มือใหม่อ่านเข้าใจง่าย ทำตามได้ทันที
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                href="/articles/setup-betta-tank"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary"
              >
                อ่านคู่มือเริ่มต้น <span aria-hidden>→</span>
              </Link>
              <Link
                href="#articles"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:text-betta hover:underline"
              >
                ดูรีวิวอุปกรณ์
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4 sm:gap-8">
              <Stat num={String(articles.filter((a) => a.available).length)} label="คู่มือเชิงลึก" />
              <div className="hidden h-10 w-px bg-border sm:block" />
              <Stat num="ใช้จริง" label="รีวิวจากการเลี้ยงเอง" />
              <div className="hidden h-10 w-px bg-border sm:block" />
              <Stat num="ฟรี" label="อ่านได้ทั้งหมด" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-3 -top-3 hidden h-full w-full rounded-[1.6rem] bg-primary/10 md:block" />
            <TiltCard className="z-10 rounded-[1.4rem]" intensity={12}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] shadow-2xl shadow-foreground/20 ring-1 ring-foreground/10">
              <Image
                src="/images/hero.jpg"
                alt="ปลากัดครีบยาวสีแดงสด สายพันธุ์ฮาล์ฟมูน พื้นหลังสีดำ"
                fill
                // ภาพนี้เป็น LCP บนเดสก์ท็อป แต่อยู่ใต้ fold บนมือถือ (grid ยุบเป็นคอลัมน์เดียว)
                // จึงใช้ eager + fetchPriority แทน preload เพื่อไม่ฉีด <link preload> แย่ง critical path ของฟอนต์/CSS บนมือถือ
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 768px) 100vw, 540px"
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 rounded-xl bg-background/90 px-4 py-2.5 backdrop-blur">
                <p className="font-heading text-sm font-medium">Betta splendens</p>
                <p className="text-xs text-muted-foreground">ปลากัดครีบยาว · Halfmoon</p>
              </div>
            </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ============ KEYWORD STRIP ============ */}
      <div className="border-y border-border bg-card py-3.5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-5 gap-y-1 px-5 text-xs font-medium uppercase tracking-[0.2em] text-foreground/70 sm:gap-x-8">
          {["จัดตู้", "เครื่องกรอง", "ปรับสภาพน้ำ", "อาหารปลากัด", "การเพาะพันธุ์", "ป้องกันโรค"].map(
            (k, i) => (
              <span key={k} className="flex items-center gap-5 sm:gap-8">
                {i > 0 && <span aria-hidden className="text-betta">◆</span>}
                {k}
              </span>
            ),
          )}
        </div>
      </div>

      {/* ============ CATEGORIES ============ */}
      <section id="categories" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow"><span className="index-num">(สำรวจ)</span></span>
              <h2 className="mt-3 max-w-md font-heading text-4xl font-semibold tracking-tight">
                เริ่มจากเรื่องที่คุณอยากรู้
              </h2>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              เราแบ่งทุกอย่างเป็นหมวดให้หาง่าย ไม่ว่าคุณจะเพิ่งเริ่มหรือเลี้ยงมานานแล้ว
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.index} delay={i * 80}>
              <Link href={c.href} className="group block">
                <TiltCard className="rounded-xl">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="index-num absolute left-3 top-3 text-sm font-medium text-background/90 drop-shadow">
                    {c.index}
                  </span>
                </div>
                </TiltCard>
                <h3 className="mt-4 flex items-center gap-2 font-heading text-lg font-semibold">
                  {c.name}
                  <span aria-hidden className="text-betta opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    →
                  </span>
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ FEATURED ============ */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="grid overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-2">
            <div className="relative min-h-[280px]">
              <Image
                src={featured.image}
                alt={featured.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 540px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <span className="eyebrow text-betta"><span aria-hidden>●</span> บทความเด่น</span>
              <h2 className="mt-4 font-heading text-3xl font-semibold leading-snug tracking-tight sm:text-[2.3rem]">
                {featured.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{featured.excerpt}</p>
              <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                <span>อ่าน {featured.readMin} นาที</span>
                <span className="text-border">·</span>
                <span>{formatThaiDate(featured.date)}</span>
              </div>
              <Link
                href={`/articles/${featured.slug}`}
                className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary"
              >
                อ่านบทความ <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ LATEST ARTICLES ============ */}
      <section id="articles" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <Reveal>
          <div className="flex items-end justify-between">
            <h2 className="font-heading text-4xl font-semibold tracking-tight">อ่านล่าสุด</h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {latest.map((a, i) => {
            const inner = (
              <>
                <TiltCard className="rounded-xl">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                    <Image
                      src={a.image}
                      alt={a.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {!a.available && (
                      <span className="absolute right-3 top-3 rounded-full bg-foreground/85 px-3 py-1 text-[0.7rem] font-semibold text-background backdrop-blur">
                        เร็วๆ นี้
                      </span>
                    )}
                  </div>
                </TiltCard>
                <span className="mt-5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-betta">
                  {a.category}
                </span>
                <h3 className="mt-2 font-heading text-xl font-semibold leading-snug transition-colors group-hover:text-primary">
                  {a.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {a.excerpt}
                </p>
                <span className="mt-3 text-xs text-muted-foreground">อ่าน {a.readMin} นาที</span>
              </>
            );

            return (
              <Reveal key={a.slug} delay={i * 80}>
                {a.available ? (
                  <Link href={`/articles/${a.slug}`} className="group flex flex-col">
                    {inner}
                  </Link>
                ) : (
                  // หรี่เฉพาะรูป (ไม่หรี่ข้อความ) — กัน text-muted-foreground ตก contrast ต่ำกว่า 4.5:1; badge "เร็วๆ นี้" สื่อสถานะแล้ว
                  <div className="group flex cursor-default flex-col [&_img]:opacity-50">{inner}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ============ GALLERY ============ */}
      <section aria-labelledby="gallery-heading" className="bg-muted/40 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <span className="eyebrow"><span className="index-num">(แกลเลอรี)</span></span>
            <h2 id="gallery-heading" className="mt-3 font-heading text-4xl font-semibold tracking-tight">
              ความงามของปลากัด
            </h2>
          </Reveal>
          <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.map((g, i) => (
              <li key={g.src}>
                <Reveal delay={i * 80} className="group relative block aspect-[3/4] overflow-hidden rounded-xl">
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ VALUES ============ */}
      <section id="about" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <Reveal>
          <h2 className="max-w-xl font-heading text-4xl font-semibold tracking-tight">
            ข้อมูลที่เชื่อถือได้ เขียนโดยคนรักปลาจริงๆ
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
            {[
              { n: "01", t: "รีวิวจากการใช้จริง", d: "เราทดลองและคัดอุปกรณ์ก่อนแนะนำ ไม่ใช่แค่ก๊อปสเปกมาวาง" },
              { n: "02", t: "เข้าใจง่ายสำหรับมือใหม่", d: "อธิบายทีละขั้น ไม่ใช้ศัพท์ยาก ทำตามได้แม้ไม่เคยเลี้ยงมาก่อน" },
              { n: "03", t: "อัปเดตต่อเนื่อง", d: "มีบทความและรีวิวใหม่เพิ่มเรื่อยๆ ตามของและเทคนิคใหม่ในตลาด" },
            ].map((v) => (
              <div key={v.n} className="bg-background p-8">
                <span className="index-num text-2xl font-medium">{v.n}</span>
                <h3 className="mt-4 font-heading text-xl font-semibold">{v.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ============ CLOSING CTA (ไม่มีฟอร์ม/อีเมล — เป็นแค่ลิงก์ไปคู่มือ ตามจุดยืน privacy) ============ */}
      <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12">
            <div aria-hidden className="dot-light pointer-events-none absolute inset-0 opacity-20" />
            <div className="relative">
              <h2 className="mx-auto max-w-xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                อยากเลี้ยงปลากัดให้สวยและแข็งแรง?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-primary-foreground/80">
                เริ่มจากคู่มือจัดตู้ฉบับสมบูรณ์ แล้วต่อด้วยเรื่องเครื่องกรองและการให้อาหาร —
                อ่านฟรีครบทุกบทความ ไม่ต้องสมัครอะไรทั้งนั้น
              </p>
              <Link
                href="/articles/setup-betta-tank"
                className="mx-auto mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background transition-colors hover:bg-betta hover:text-betta-foreground"
              >
                อ่านคู่มือเริ่มต้น <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div>
      <div className="font-heading text-2xl font-semibold">{num}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
