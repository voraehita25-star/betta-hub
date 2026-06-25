import Link from "next/link";
import { categories } from "@/lib/content";

const COLS = [
  {
    title: "หมวดหมู่",
    // ปลายทางจริงจาก content.ts (เดิมทุกลิงก์ชี้ /#categories ที่เดียวกัน)
    links: categories.map((c) => ({ label: c.name, href: c.href })),
  },
  {
    title: "เกี่ยวกับ",
    links: [
      { label: "เกี่ยวกับเรา", href: "/about" },
      { label: "บทความทั้งหมด", href: "/articles" },
      { label: "เครื่องคำนวณเปลี่ยนน้ำ", href: "/tools/water-change" },
      { label: "นโยบายความเป็นส่วนตัว", href: "/privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-[oklch(0.13_0.013_240)] text-foreground/70">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <div className="font-heading text-2xl font-semibold text-foreground">
              Betta<span className="text-betta">Hub</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-foreground/55">
              แหล่งรวมความรู้และรีวิวเรื่องปลากัด ตู้ปลา และอุปกรณ์
              เพื่อให้ทุกคนเลี้ยงปลาได้อย่างมีความสุขและถูกวิธี
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h5 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                {col.title}
              </h5>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-foreground/55 transition-colors hover:text-betta"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 h-px w-full bg-foreground/10" />

        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-foreground/70">
          <span className="font-medium text-foreground/90">การเปิดเผยข้อมูล:</span>{" "}
          เว็บไซต์นี้อาจมีลิงก์พันธมิตร (Affiliate) เช่น Shopee / Lazada
          เมื่อคุณคลิกและสั่งซื้อ เราอาจได้รับค่าคอมมิชชันเล็กน้อยโดยที่คุณไม่ต้องจ่ายเพิ่ม
          ซึ่งช่วยสนับสนุนการทำคอนเทนต์ฟรีให้ทุกคน — เราแนะนำเฉพาะของที่เราเชื่อว่าดีจริงเท่านั้น
        </p>
        <p className="mt-4 text-xs text-foreground/70">© {new Date().getFullYear()} BettaHub · สร้างเพื่อคนรักปลากัด</p>
      </div>
    </footer>
  );
}
