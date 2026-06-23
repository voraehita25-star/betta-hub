import type { ReactNode } from "react";
import { BackToTop } from "@/components/back-to-top";

// Nested layout ครอบทุกหน้าใต้ /articles — mount ปุ่มกลับขึ้นบนครั้งเดียวสำหรับคู่มือยาวๆ
export default function ArticlesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <BackToTop />
    </>
  );
}
