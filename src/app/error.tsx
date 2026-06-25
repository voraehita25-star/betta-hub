"use client"; // Error boundaries ต้องเป็น Client Component

// error boundary ระดับ segment — แทนที่เฉพาะส่วนเนื้อหา (header/footer ใน root layout ยังอยู่)
// ต่างจาก global-error.tsx ที่แทนทั้งหน้า; ใช้ unstable_retry (Next 16.2) เพื่อ re-render เฉพาะ segment ที่พัง
import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center">
      <p className="font-heading text-5xl font-semibold tracking-tight text-betta">อ๊ะ!</p>
      <h1 className="mt-4 font-heading text-2xl font-semibold tracking-tight">
        เปิดส่วนนี้ไม่สำเร็จ
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        เกิดข้อผิดพลาดชั่วคราวขณะโหลดเนื้อหาส่วนนี้ ลองอีกครั้งได้เลย หากยังไม่หายโปรดกลับมาใหม่ภายหลัง
      </p>
      <button
        onClick={() => unstable_retry()}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary"
      >
        ลองอีกครั้ง
      </button>
    </div>
  );
}
