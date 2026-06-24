"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll-reveal wrapper — เนื้อหาค่อยๆ จางขึ้น+เลื่อนขึ้นเมื่อเลื่อนถึง (premium feel)
 *
 * ออกแบบให้ปลอดภัยทุกทาง:
 * - prefers-reduced-motion → แสดงทันที ไม่มีการเคลื่อนไหว (เคารพ WCAG 2.3.3)
 * - ไม่มี JS / IO ไม่รองรับ → แสดงทันที (สถานะ "ซ่อน" เปิดเฉพาะหลัง JS ยืนยันทำงาน
 *   ผ่านคลาส .js-reveal บน <html> ดู globals.css) จึง crawler/no-JS เห็นเนื้อหาเสมอ
 * - ใช้ opacity/transform เท่านั้น → composited, ไม่เกิด layout shift (CLS)
 * - inline style ใช้แค่ transition-delay ซึ่ง CSP อนุญาต (style-src-attr 'unsafe-inline')
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** หน่วงเวลาเริ่ม (มิลลิวินาที) สำหรับเอฟเฟกต์ stagger ในกริด */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // reduced-motion หรือไม่มี IntersectionObserver → ไม่เปิดสถานะ "ซ่อน" เลย (ไม่ใส่ .js-reveal)
    // เนื้อหาจึงแสดงทันทีผ่าน CSS โดยไม่ต้อง setState ในเอฟเฟกต์ (เลี่ยง cascading render ตามกฎโปรเจกต์)
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // เปิดสถานะ "ซ่อนก่อนเผย" เฉพาะเมื่อ JS ทำงานจริง — no-JS users จะเห็นเนื้อหาตามปกติ
    document.documentElement.classList.add("js-reveal");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${shown ? " is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
