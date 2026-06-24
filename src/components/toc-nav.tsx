"use client";

import { useEffect, useState } from "react";

/**
 * สารบัญแบบ scrollspy — ไฮไลต์หัวข้อที่กำลังอ่านอยู่ตามตำแหน่งเลื่อน
 * เฝ้าดู <h2 id> ในหน้าด้วย IntersectionObserver แล้วเลือกหัวข้อบนสุดที่อยู่ในโซนอ่าน
 * เป็นแค่การไฮไลต์ลิงก์ (ไม่มี motion) — ลิงก์ทั้งหมดยังคลิกข้ามไปยัง id ได้ตามปกติแม้ไม่มี JS
 */
export function TocNav({ items }: { items: { label: string; id: string }[] }) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const headings = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // โซนอ่าน: แถบราว 20%–35% จากบนจอ
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [items]);

  return (
    <ol className="mt-3 ml-5 list-decimal space-y-1.5 text-sm text-muted-foreground marker:text-betta">
      {items.map((it) => (
        <li key={it.id}>
          <a
            href={`#${it.id}`}
            aria-current={active === it.id ? "true" : undefined}
            className="underline-offset-4 transition-colors hover:text-betta hover:underline aria-[current=true]:font-medium aria-[current=true]:text-betta"
          >
            {it.label}
          </a>
        </li>
      ))}
    </ol>
  );
}
