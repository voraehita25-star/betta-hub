import Link from "next/link";
import { FishMark } from "@/components/fish-mark";
import { articles } from "@/lib/content";

// Server Component — render อยู่ใน root layout จึงได้ header/footer/ฟอนต์/ธีมมาเอง
// และยังรับ URL ที่ไม่ตรง route ใดๆ ของทั้งเว็บด้วย
export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center sm:px-8 sm:py-32">
      <span className="text-betta">
        <FishMark className="h-16 w-24" />
      </span>
      <p className="mt-6 font-heading text-6xl font-semibold tracking-tight text-betta">404</p>
      <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        ไม่พบหน้านี้
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        ดูเหมือนปลาตัวนี้จะว่ายหนีไปแล้ว — หน้าที่คุณกำลังหาอาจถูกย้าย เปลี่ยนชื่อ
        หรือไม่เคยมีอยู่ ลองกลับไปเริ่มที่หน้าแรก หรืออ่านคู่มือด้านล่างได้เลย
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary"
      >
        <span aria-hidden>←</span> กลับหน้าแรก
      </Link>

      <div className="mt-14 w-full border-t border-border pt-8">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          หรืออ่านคู่มือเหล่านี้
        </h2>
        <ul className="mx-auto mt-5 grid max-w-xl gap-2 text-left sm:grid-cols-2">
          {articles
            .filter((a) => a.available)
            .map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/articles/${a.slug}`}
                  className="group flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-3 text-sm transition-colors hover:border-betta/50"
                >
                  <span aria-hidden className="text-betta">
                    →
                  </span>
                  <span className="font-medium leading-snug transition-colors group-hover:text-betta">
                    {a.title}
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
