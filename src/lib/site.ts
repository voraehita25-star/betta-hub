export const SITE_NAME = "BettaHub";
// ผู้ดูแล/ผู้เขียนเว็บ (บุคคลคนเดียวตามจุดยืน honesty — ไม่ใช่องค์กร) ใช้ใน JSON-LD author/publisher
export const SITE_AUTHOR = "ผู้ดูแล BettaHub";

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

// ขนาดจริง (พิกเซล) ของรูปปกที่ใช้ใน OG/JSON-LD — ช่วยให้การ์ดแชร์ครอปถูก & ImageObject ผ่าน validation
// (อัปเดตเมื่อเปลี่ยนไฟล์รูป — เลขนี้คือขนาดจริงของไฟล์ใน public/images)
const IMAGE_DIMS: Record<string, { w: number; h: number }> = {
  "/images/hero.jpg": { w: 1800, h: 1200 },
  "/images/tank.jpg": { w: 1100, h: 733 },
  "/images/betta-red.jpg": { w: 1100, h: 880 },
  "/images/aquarium.jpg": { w: 1100, h: 686 },
  "/images/care.jpg": { w: 1100, h: 731 },
};

/** ขนาดจริงของรูป (ถ้ารู้) สำหรับใส่ใน og:image / schema.org ImageObject */
export function imageDims(path: string): { w: number; h: number } | undefined {
  return IMAGE_DIMS[path];
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
