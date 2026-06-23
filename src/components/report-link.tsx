"use client";

import { useSyncExternalStore } from "react";
import { REPORT_EMAIL_PARTS } from "@/lib/site";

// ตรวจว่า component mount แล้วบน client โดยไม่ใช้ setState-in-effect (React 19)
// ฝั่ง server ตอบ false → SSR/prerendered HTML จะไม่มีอีเมลปรากฏ
const subscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

/**
 * ปุ่มแจ้งลิงก์เสีย/สินค้าหมด — เปิด mail client ของผู้อ่าน
 *
 * Render เฉพาะหลัง hydration → SSR/prerendered HTML ไม่มีอีเมลปรากฏเลย
 * (กัน scraper ที่อ่าน static HTML; scraper ที่รัน JS เต็มจะเห็นได้แต่นั่นคนละชั้น)
 */
export function ReportLink({ productName }: { productName: string }) {
  const mounted = useMounted();

  const [user, domain] = REPORT_EMAIL_PARTS;
  if (!mounted || !user || !domain) return null;

  const email = `${user}@${domain}`;
  const subject = encodeURIComponent(`[BettaHub] แจ้งลิงก์/สินค้า: ${productName}`);
  const body = encodeURIComponent(
    `พบปัญหากับสินค้า "${productName}" (เช่น ลิงก์เสีย หรือสินค้าหมด)\n\nรายละเอียดเพิ่มเติม: `,
  );

  return (
    <a
      href={`mailto:${email}?subject=${subject}&body=${body}`}
      className="text-xs text-muted-foreground underline-offset-2 hover:text-destructive hover:underline"
    >
      แจ้งลิงก์เสีย/สินค้าหมด
    </a>
  );
}
