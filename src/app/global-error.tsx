"use client"; // Error boundaries ต้องเป็น Client Component

// global-error แทนที่ root layout ตอนเกิด error ที่ root จึงต้อง:
// - มี <html>/<body> เอง  - re-import globals.css เพื่อให้มีธีมพื้นฐาน
// - ใช้ unstable_retry (Next 16.2) ไม่ใช่ reset  - ใช้ React <title> แทน metadata export
import "./globals.css";

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="th">
      <body className="flex min-h-screen flex-col items-center justify-center bg-background px-5 text-center text-foreground">
        <title>เกิดข้อผิดพลาด · BettaHub</title>
        <p className="font-heading text-5xl font-semibold tracking-tight text-betta">อ๊ะ!</p>
        <h1 className="mt-4 font-heading text-2xl font-semibold tracking-tight">
          เกิดข้อผิดพลาดบางอย่าง
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          ระบบมีปัญหาชั่วคราว ลองโหลดใหม่อีกครั้ง หากยังไม่หายโปรดกลับมาใหม่ภายหลัง
        </p>
        <button
          onClick={() => unstable_retry()}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary"
        >
          ลองอีกครั้ง
        </button>
      </body>
    </html>
  );
}
