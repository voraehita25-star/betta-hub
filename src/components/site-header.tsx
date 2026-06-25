"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FishMark } from "@/components/fish-mark";

// ปลายทางแต่ละเมนูแยกกันชัดเจน (ก่อนหน้านี้ "ตู้ปลา"/"เครื่องกรอง" ชี้ /#categories ที่เดียวกัน)
const NAV = [
  { label: "หน้าแรก", href: "/" },
  { label: "รู้จักปลากัด", href: "/articles/betta-types" },
  { label: "จัดตู้", href: "/articles/setup-betta-tank" },
  { label: "เครื่องกรอง", href: "/articles/best-betta-filters" },
  { label: "ให้อาหาร", href: "/articles/feeding-betta" },
];

// ปิดเมนู <details> หลังคลิกลิงก์ (เมื่อมี JS) — ถ้าไม่มี JS การนำทางจะรีโหลดหน้า แล้ว <details> รีเซ็ตเป็นปิดเอง
function closeMenu(e: MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.closest("details")?.removeAttribute("open");
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* Wordmark */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="text-betta transition-transform duration-300 group-hover:-translate-y-0.5">
            <FishMark className="h-6 w-9" />
          </span>
          <span className="font-heading text-xl font-semibold tracking-tight">
            Betta<span className="text-primary">Hub</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className="group relative text-sm font-medium text-foreground/70 transition-colors hover:text-foreground aria-[current=page]:text-foreground"
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-betta transition-all duration-300 group-hover:w-full group-aria-[current=page]:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/articles/setup-betta-tank"
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-primary"
          >
            เริ่มต้นที่นี่
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Mobile menu — ใช้ <details> เพื่อให้เปิดได้แม้ไม่มี JS (no-JS safe; เดิมผูก React state จึงเปิดไม่ได้ถ้าปิด JS) */}
        <details className="group/menu md:hidden">
          <summary
            aria-label="เมนู"
            className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden"
          >
            <div className="space-y-1.5">
              <span className="block h-0.5 w-6 bg-current transition-transform duration-300 group-open/menu:translate-y-2 group-open/menu:rotate-45" />
              <span className="block h-0.5 w-6 bg-current transition-opacity duration-300 group-open/menu:opacity-0" />
              <span className="block h-0.5 w-6 bg-current transition-transform duration-300 group-open/menu:-translate-y-2 group-open/menu:-rotate-45" />
            </div>
          </summary>

          {/* Panel — absolute เต็มความกว้าง header ใต้แถบ (header เป็น sticky จึงเป็น positioning context) */}
          <nav
            id="mobile-menu"
            className="absolute inset-x-0 top-16 border-t border-border bg-background px-5 py-4"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 sm:px-3">
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="rounded-md px-3 py-2.5 text-base font-medium text-foreground/80 hover:bg-muted aria-[current=page]:text-betta"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/articles/setup-betta-tank"
                onClick={closeMenu}
                className="mt-2 rounded-full bg-foreground px-4 py-2.5 text-center text-base font-medium text-background"
              >
                เริ่มต้นที่นี่ <span aria-hidden>→</span>
              </Link>
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
