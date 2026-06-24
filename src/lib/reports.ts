import { randomUUID } from "node:crypto";
import { put, list, get, del } from "@vercel/blob";

// คำแจ้ง "ลิงก์เสีย/สินค้าหมด" — เก็บเป็น Vercel Blob แบบ private (อ่านได้ฝั่งเซิร์ฟเวอร์เท่านั้น)
// privacy: เก็บเฉพาะสิ่งที่ผู้ใช้พิมพ์ + บริบทขั้นต่ำ ไม่มีอีเมล/ชื่อ/IP

export type ReportReason = "broken-link" | "out-of-stock" | "other";

export type Report = {
  id: string;
  productName: string;
  reason: ReportReason;
  note?: string;
  /** pathname ของหน้าที่แจ้ง เช่น /articles/best-betta-filters */
  pageUrl: string;
  /** ISO เวลาฝั่งเซิร์ฟเวอร์ (ไม่เชื่อเวลาจาก client) */
  createdAt: string;
};

export type ReportInput = {
  productName: string;
  reason: ReportReason;
  note?: string;
  pageUrl: string;
};

const PREFIX = "reports/";

/** มี Blob store ต่อไว้หรือยัง (SDK อ่าน BLOB_READ_WRITE_TOKEN จาก env เอง) */
export function reportsConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** บันทึก 1 คำแจ้ง = 1 ไฟล์ JSON (เขียนอิสระ ไม่ race) + log ให้เห็นใน Vercel Logs ทันที */
export async function saveReport(input: ReportInput): Promise<Report> {
  const createdAt = new Date().toISOString();
  const id = `${Date.now()}-${randomUUID()}`;
  const report: Report = { id, ...input, createdAt };

  await put(`${PREFIX}${id}.json`, JSON.stringify(report), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
  });

  console.warn(
    `[report] reason=${report.reason} product=${JSON.stringify(report.productName)} page=${report.pageUrl} at=${createdAt}`,
  );
  return report;
}

/** อ่านคำแจ้งทั้งหมด (dev only) — เรียงใหม่→เก่า */
export async function listReports(): Promise<Report[]> {
  const { blobs } = await list({ prefix: PREFIX });
  const items = await Promise.all(
    blobs.map(async (b) => {
      try {
        const res = await get(b.pathname, { access: "private", useCache: false });
        if (!res || res.statusCode !== 200) return null;
        const text = await new Response(res.stream).text();
        return JSON.parse(text) as Report;
      } catch {
        return null;
      }
    }),
  );
  return items
    .filter((r): r is Report => r !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** id ที่ถูกต้องตามรูปแบบที่เราออกเอง (กัน path traversal ตอนลบ) */
const ID_RE = /^[0-9]+-[0-9a-fA-F-]+$/;

/** ลบคำแจ้ง 1 รายการ (dev only) */
export async function deleteReport(id: string): Promise<void> {
  if (!ID_RE.test(id)) throw new Error("invalid report id");
  await del(`${PREFIX}${id}.json`);
}
