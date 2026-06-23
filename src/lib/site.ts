export const SITE_NAME = "BettaHub";

// อีเมลรับแจ้ง "ลิงก์เสีย/สินค้าหมด" — อ่านจาก env var (ไม่ฝัง string ใน source/git history)
// ป้องกัน scraper 2 ชั้น: (1) source/git ใน public repo ไม่มี email; (2) prerendered HTML ก็ไม่มี
//   เพราะ <ReportLink/> render เฉพาะหลัง client hydration
// ตั้งใน Vercel: NEXT_PUBLIC_REPORT_EMAIL_USER + NEXT_PUBLIC_REPORT_EMAIL_DOMAIN
// ตั้ง local ใน .env.local (gitignored); ดู .env.example
// ทั้งคู่เว้น "" เพื่อซ่อนปุ่มแจ้ง
export const REPORT_EMAIL_PARTS: readonly [string, string] = [
  process.env.NEXT_PUBLIC_REPORT_EMAIL_USER ?? "",
  process.env.NEXT_PUBLIC_REPORT_EMAIL_DOMAIN ?? "",
];

// อ่านโดเมนจาก env เพื่อแยก dev / preview / prod
// ลำดับความสำคัญ: ค่าที่ตั้งเองชัดเจน > โดเมน preview ของ Vercel > localhost (dev)
export function getSiteUrl(): string {
  // ตั้งค่าเองเสมอใน production จริง เช่น https://www.bettahub.com
  // บน Vercel preview/deploy ที่ไม่ได้ตั้ง NEXT_PUBLIC_SITE_URL — VERCEL_URL ไม่มี protocol
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
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
