"use client";

import { useEffect, useState } from "react";

/**
 * แถบแสดงความคืบหน้าการอ่าน — เส้นบางบนสุดของจอที่ยาวขึ้นตามการเลื่อนหน้า
 * decorative ล้วน (aria-hidden) · ใช้ scaleX (composited, ถูก) · throttle ด้วย rAF
 * เคารพ reduced-motion ผ่านกฎ global ใน globals.css (transition กลายเป็นทันที)
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-betta to-primary transition-transform duration-150 ease-out"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}
