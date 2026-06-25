import { saveReport, reportsConfigured, type ReportReason } from "@/lib/reports";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

// ฟีเจอร์แจ้งปัญหาเปิดใช้เมื่อ flag เปิด (แหล่งความจริงเดียวกับ UI) — กัน endpoint รับเขียน
// ทั้งที่ปุ่มถูกซ่อน (เดิมเปิด-ปิดด้วย BLOB token เท่านั้น แยกจาก NEXT_PUBLIC_REPORTS_ENABLED)
const ENABLED = process.env.NEXT_PUBLIC_REPORTS_ENABLED === "1";

const REASONS: ReadonlySet<ReportReason> = new Set<ReportReason>([
  "broken-link",
  "out-of-stock",
  "other",
]);

const MAX_PRODUCT = 120;
const MAX_NOTE = 500;
const MAX_URL = 200;

// กัน flood/abuse ของ endpoint สาธารณะ: จำกัดจำนวนคำแจ้งต่อ IP ต่อหน้าต่างเวลา (best-effort ต่อ instance)
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

export async function POST(req: Request): Promise<Response> {
  if (!ENABLED || !reportsConfigured()) {
    return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (!rateLimit(`report:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return Response.json({ ok: false }, { status: 400 });
  }
  const data = body as Record<string, unknown>;

  // honeypot: บอตมักกรอก field ที่ซ่อนไว้ → ตอบสำเร็จแต่ไม่บันทึก (ไม่ให้บอตจับสัญญาณ)
  if (typeof data.company === "string" && data.company.trim() !== "") {
    return Response.json({ ok: true });
  }

  const reason = String(data.reason ?? "") as ReportReason;
  const productName = String(data.productName ?? "").trim();
  const note = data.note == null ? "" : String(data.note).trim();
  const pageUrl = String(data.pageUrl ?? "").trim();

  if (!REASONS.has(reason)) return Response.json({ ok: false }, { status: 400 });
  if (!productName || productName.length > MAX_PRODUCT)
    return Response.json({ ok: false }, { status: 400 });
  if (note.length > MAX_NOTE) return Response.json({ ok: false }, { status: 400 });
  if (pageUrl.length > MAX_URL || (pageUrl !== "" && !pageUrl.startsWith("/")))
    return Response.json({ ok: false }, { status: 400 });

  try {
    await saveReport({
      productName,
      reason,
      note: note || undefined,
      pageUrl: pageUrl || "/",
    });
  } catch (err) {
    console.error("[report] save failed", err);
    return Response.json({ ok: false }, { status: 500 });
  }

  return Response.json({ ok: true });
}

export function GET(): Response {
  return Response.json({ ok: false }, { status: 405 });
}
