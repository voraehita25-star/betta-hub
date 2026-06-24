import type { ReactNode } from "react";
import { BackToTop } from "@/components/back-to-top";
import { ReadingProgress } from "@/components/reading-progress";

// Nested layout ครอบทุกหน้าใต้ /articles — แถบความคืบหน้าการอ่าน + ปุ่มกลับขึ้นบน สำหรับคู่มือยาวๆ
export default function ArticlesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ReadingProgress />
      {children}
      <BackToTop />
    </>
  );
}
