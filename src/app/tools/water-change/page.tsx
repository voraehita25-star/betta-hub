import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { WaterChangeTool } from "@/components/water-change-tool";

const OG_DESC = "คำนวณปริมาณน้ำที่ควรเปลี่ยนต่อสัปดาห์สำหรับตู้ปลากัด จากขนาดตู้และจำนวนปลา";

export const metadata: Metadata = {
  title: "เครื่องคำนวณเปลี่ยนน้ำตู้ปลากัด",
  description:
    "คำนวณปริมาณน้ำที่ควรเปลี่ยนต่อสัปดาห์สำหรับตู้ปลากัด (25–50% ของปริมาตร) จากขนาดตู้และจำนวนปลา ทำงานในเบราว์เซอร์ของคุณเอง ไม่เก็บข้อมูล",
  alternates: { canonical: "/tools/water-change" },
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "BettaHub",
    title: "เครื่องคำนวณเปลี่ยนน้ำตู้ปลากัด",
    description: OG_DESC,
    // ตั้ง images เอง — ลูกที่ตั้ง openGraph จะ "แทนที่" openGraph ของ root ทั้งก้อน (รวม images) ตาม shallow-merge ของ Next 16
    images: ["/images/hero.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "เครื่องคำนวณเปลี่ยนน้ำตู้ปลากัด",
    description: OG_DESC,
    images: ["/images/hero.jpg"],
  },
};

export default function WaterChangePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <Breadcrumb current="เครื่องมือ" />
      <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        เครื่องคำนวณเปลี่ยนน้ำ
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        ใส่ปริมาตรตู้เป็นลิตร หรือถ้าไม่รู้ว่าตู้จุน้ำเท่าไร ก็วัดขนาดตู้ (ยาว×กว้าง×สูง) เป็นนิ้วหรือเซนติเมตรได้
        แล้วดูว่าควรเปลี่ยนน้ำสัปดาห์ละประมาณเท่าไร — อิงแนวทาง 25–50% ต่อสัปดาห์จาก
        <Link href="/articles/setup-betta-tank" className="text-primary underline underline-offset-4">
          คู่มือจัดตู้
        </Link>
      </p>

      <div className="mt-8">
        <WaterChangeTool />
      </div>

      <div className="mt-10 rounded-xl border border-border bg-muted/40 px-6 py-5 text-sm leading-relaxed text-muted-foreground">
        <strong className="text-foreground/80">ทำไมต้องเปลี่ยนน้ำ:</strong>{" "}
        น้ำสะอาดคือหัวใจของการเลี้ยงปลากัด การเปลี่ยนน้ำบางส่วนสม่ำเสมอช่วยคุมของเสียโดยไม่ช็อกปลา
        อ่านวิธีปรับสภาพน้ำและจัดตู้แบบละเอียดได้ใน
        <Link href="/articles/setup-betta-tank" className="text-primary underline underline-offset-4">
          {" "}
          คู่มือจัดตู้ปลากัด
        </Link>{" "}
        และ
        <Link href="/articles/best-betta-filters" className="text-primary underline underline-offset-4">
          คู่มือเครื่องกรอง
        </Link>
      </div>
    </div>
  );
}
