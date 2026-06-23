"use client";

import { useState, useEffect, useRef } from "react";
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

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // ปิดเมนูมือถือด้วยปุ่ม Escape แล้วคืน focus กลับปุ่ม toggle
  // (WCAG 2.4.3 — ไม่งั้น focus จะตกไปที่ <body> หลังเมนูหาย)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* Wordmark */}
        <Link href="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
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

        {/* Mobile toggle */}
        <button
          ref={toggleRef}
          className="flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-current transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-current transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <nav id="mobile-menu" className="border-t border-border bg-background px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === item.href ? "page" : undefined}
                className="rounded-md px-3 py-2.5 text-base font-medium text-foreground/80 hover:bg-muted aria-[current=page]:text-betta"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/articles/setup-betta-tank"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-foreground px-4 py-2.5 text-center text-base font-medium text-background"
            >
              เริ่มต้นที่นี่ →
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
