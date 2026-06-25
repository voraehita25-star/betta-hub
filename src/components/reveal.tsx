"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// IntersectionObserver ตัวเดียวใช้ร่วมทุก <Reveal> (เดิมสร้าง 1 ตัว/instance → ~17 ตัวบนหน้าแรก)
// map element → callback ผ่าน WeakMap เพื่อ resolve เป้าหมายตอน intersect แล้ว unobserve ทิ้ง
let sharedObserver: IntersectionObserver | null = null;
const revealCallbacks = new WeakMap<Element, () => void>();
let jsRevealMarked = false;

function getRevealObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  sharedObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const cb = revealCallbacks.get(entry.target);
        if (cb) {
          cb();
          revealCallbacks.delete(entry.target);
          sharedObserver?.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
  );
  return sharedObserver;
}

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

    // เปิดสถานะ "ซ่อนก่อนเผย" ครั้งเดียว เฉพาะเมื่อ JS ทำงานจริง — no-JS users จะเห็นเนื้อหาตามปกติ
    if (!jsRevealMarked) {
      document.documentElement.classList.add("js-reveal");
      jsRevealMarked = true;
    }

    const io = getRevealObserver();
    if (!io) return;
    revealCallbacks.set(el, () => setShown(true));
    io.observe(el);
    return () => {
      revealCallbacks.delete(el);
      io.unobserve(el);
    };
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
