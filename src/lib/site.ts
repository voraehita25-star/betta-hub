export const SITE_NAME = "BettaHub";

// อ่านโดเมนจาก env เพื่อแยก dev / preview / prod
// ลำดับความสำคัญ: ค่าที่ตั้งเองชัดเจน > โดเมน preview ของ Vercel > localhost (dev)
export function getSiteUrl(): string {
  // ตั้งค่าเองเสมอใน production จริง เช่น https://www.bettahub.com
  // ลำดับ fallback บน Vercel (สำคัญต่อ canonical/OG/sitemap):
  //   VERCEL_PROJECT_PRODUCTION_URL = โดเมน production ที่ "เสถียร" → ปลอดภัยใช้เป็น canonical ของ prod
  //   VERCEL_URL = โดเมนต่อ deployment ที่เปลี่ยนทุกครั้ง → ใช้ได้เฉพาะ preview (ห้ามเป็น canonical ของ prod
  //   ไม่งั้นจะเกิด duplicate-content ชี้ไป hostname ชั่วคราว)
  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");
  // ตัด trailing slash กัน `//` ซ้อนเวลาเอาไปต่อ path ใน sitemap/robots/JSON-LD
  return raw.replace(/\/+$/, "");
}

const TH_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

/** แปลงวันที่ ISO (YYYY-MM-DD) เป็นรูปแบบไทย เช่น "18 มิถุนายน 2026" (คงปีคริสต์ศักราชตามข้อมูล) */
export function formatThaiDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  // fail-safe: ถ้า input ว่าง/เพี้ยน คืน iso ดิบแทนการ emit "undefined NaN" (กันวันที่จาก CMS ในอนาคต)
  if (!y || !m || !d || m < 1 || m > 12) return iso;
  const month = TH_MONTHS[m - 1] ?? "";
  return `${d} ${month} ${y}`;
}
