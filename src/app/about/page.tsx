import type { Metadata } from "next";
import Link from "next/link";
import { aboutJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumb } from "@/components/breadcrumb";

const OG_DESC =
  "เว็บคู่มือและรีวิวปลากัด ดูแลโดยคนรักปลากัดคนเดียวในฐานะงานอดิเรก — รีวิวจากการใช้จริง โปร่งใส อ่านฟรี";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา",
  description:
    "BettaHub คือเว็บคู่มือและรีวิวเรื่องการเลี้ยงปลากัด ดูแลและเขียนโดยคนรักปลากัดคนเดียวในฐานะงานอดิเรก — รีวิวจากการใช้จริง อ่านฟรี และโปร่งใสเรื่องลิงก์พันธมิตร",
  alternates: {
    canonical: "/about",
    types: { "application/rss+xml": "/feed.xml" },
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "BettaHub",
    title: "เกี่ยวกับ BettaHub",
    description: OG_DESC,
    images: ["/og-default.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "เกี่ยวกับ BettaHub",
    description: OG_DESC,
    images: ["/og-default.png"],
  },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <JsonLd data={aboutJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "หน้าแรก", path: "/" },
          { name: "เกี่ยวกับเรา", path: "/about" },
        ])}
      />

      <Breadcrumb current="เกี่ยวกับเรา" />
      <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        เกี่ยวกับ BettaHub
      </h1>

      <div className="article-prose mt-8">
        <p className="article-lead">
          BettaHub เป็นเว็บไซต์ให้ความรู้และรีวิวเรื่องการเลี้ยงปลากัด ที่ดูแลและเขียนโดยคนรักปลากัดคนเดียว
          ในฐานะงานอดิเรก ไม่ใช่บริษัทหรือองค์กร เป้าหมายง่ายๆ คืออยากให้ทุกคนเลี้ยงปลากัดได้อย่างถูกวิธี
          มีความสุข และเข้าถึงข้อมูลที่เชื่อถือได้แบบฟรีๆ
        </p>

        <h2>ทำไมถึงทำเว็บนี้</h2>
        <p>
          ตอนเริ่มเลี้ยงปลากัดใหม่ๆ ข้อมูลภาษาไทยที่ครบ ถูกต้อง และเข้าใจง่ายหายากกว่าที่คิด
          หลายเรื่องต้องลองผิดลองถูกเอง BettaHub จึงเกิดขึ้นเพื่อรวบรวมสิ่งที่ได้เรียนรู้และทดลองจริง
          มาเรียบเรียงให้มือใหม่อ่านเข้าใจง่ายและทำตามได้ทันที — โดยไม่ต้องเสียเงินหรือสมัครอะไรทั้งนั้น
        </p>

        <h2>เราทำงานยังไง</h2>
        <ul>
          <li>
            <strong>รีวิวจากการใช้จริง:</strong> เราทดลองและคัดอุปกรณ์ก่อนแนะนำ ไม่ใช่แค่ก๊อปสเปกมาวาง
          </li>
          <li>
            <strong>เข้าใจง่ายสำหรับมือใหม่:</strong> อธิบายทีละขั้น ไม่ใช้ศัพท์ยาก ทำตามได้แม้ไม่เคยเลี้ยงมาก่อน
          </li>
          <li>
            <strong>อัปเดตต่อเนื่อง:</strong> มีบทความและรีวิวใหม่เพิ่มเรื่อยๆ ตามของและเทคนิคใหม่ในตลาด
          </li>
        </ul>

        <h2>ความซื่อสัตย์และลิงก์พันธมิตร</h2>
        <p>
          บางลิงก์ในเว็บเป็นลิงก์พันธมิตร (เช่น Shopee / Lazada) เมื่อคุณคลิกแล้วไปสั่งซื้อ
          เราอาจได้รับค่าคอมมิชชันเล็กน้อยโดยที่คุณไม่ต้องจ่ายเพิ่ม ซึ่งช่วยให้เราทำคอนเทนต์ฟรีต่อไปได้ —
          แต่เราแนะนำเฉพาะของที่เชื่อว่าดีจริงเท่านั้น และการมีค่าคอมมิชชัน{" "}
          <strong>ไม่มีผล</strong>ต่อความเห็นในรีวิว อ่านรายละเอียดได้ใน{" "}
          <Link href="/privacy#affiliate" className="text-primary underline underline-offset-4">
            นโยบายความเป็นส่วนตัว
          </Link>
        </p>

        <h2>ความเป็นส่วนตัวของคุณ</h2>
        <p>
          เว็บนี้ไม่มีระบบสมาชิก ไม่มีการล็อกอิน และไม่ขออีเมลหรือข้อมูลติดต่อของคุณ
          เราตั้งใจเก็บข้อมูลให้น้อยที่สุดและโปร่งใสที่สุด อ่านเพิ่มได้ที่{" "}
          <Link href="/privacy" className="text-primary underline underline-offset-4">
            นโยบายความเป็นส่วนตัว
          </Link>
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-4 border-t border-border pt-8">
        <Link
          href="/articles/setup-betta-tank"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary"
        >
          เริ่มอ่านคู่มือจัดตู้ <span aria-hidden>→</span>
        </Link>
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 rounded-full border border-betta/50 px-6 py-3 text-sm font-medium text-betta transition-colors hover:border-betta"
        >
          ดูบทความทั้งหมด
        </Link>
      </div>
    </article>
  );
}
