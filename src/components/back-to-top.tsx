"use client";

import { useEffect, useState } from "react";

/**
 * ปุ่มกลับขึ้นบนสุด — โผล่หลังเลื่อนพ้น hero
 * ใช้ scrollTo แบบไม่ระบุ behavior เพื่อให้ตาม CSS scroll-behavior (smooth ปกติ / auto เมื่อ reduced-motion)
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setVisible(window.scrollY > 700);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="กลับขึ้นบนสุด"
      // ตอนซ่อน: เอาออกจาก tab order + a11y tree ไม่ให้คีย์บอร์ด/screen reader โฟกัสปุ่มที่มองไม่เห็น (WCAG 2.4.3/2.4.7)
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={() => window.scrollTo({ top: 0 })}
      className={`fixed bottom-6 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-lg backdrop-blur transition-all duration-300 hover:bg-muted hover:text-betta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:right-8 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
