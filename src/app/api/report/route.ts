import { saveReport, reportsConfigured, type ReportReason } from "@/lib/reports";

export const runtime = "nodejs";

const REASONS: ReadonlySet<ReportReason> = new Set<ReportReason>([
  "broken-link",
  "out-of-stock",
  "other",
]);

const MAX_PRODUCT = 120;
const MAX_NOTE = 500;
const MAX_URL = 200;

export async function POST(req: Request): Promise<Response> {
  if (!reportsConfigured()) {
    return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
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
