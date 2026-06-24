import type { Metadata } from "next";
import { devConfigured, isDevAuthed } from "@/lib/dev-auth";
import { listReports, reportsConfigured, type ReportReason } from "@/lib/reports";
import { loginAction, logoutAction, deleteAction } from "./actions";

// หน้า dev — ห้าม index, ต้องไม่ถูก prerender (อ่าน cookie + Blob ตอน request)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reports (dev)",
  robots: { index: false, follow: false },
};

const REASON_LABEL: Record<ReportReason, string> = {
  "broken-link": "ลิงก์เสีย",
  "out-of-stock": "สินค้าหมด",
  other: "อื่นๆ",
};

function fmt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
}

export default async function DevReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">คำแจ้งจากผู้ใช้ (dev)</h1>

      {!devConfigured() ? (
        <p className="mt-6 rounded-xl border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm">
          ยังไม่ได้ตั้งค่า <code>DEV_REPORTS_TOKEN</code> — ตั้งใน environment variables ก่อนจึงจะเปิดหน้านี้ได้
        </p>
      ) : !(await isDevAuthed()) ? (
        <form action={loginAction} className="mt-8 max-w-sm">
          <label className="block text-sm font-medium">รหัสผ่าน dev</label>
          <input
            type="password"
            name="token"
            autoComplete="off"
            className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {sp.e && (
            <p role="alert" className="mt-2 text-sm text-destructive">
              รหัสผ่านไม่ถูกต้อง
            </p>
          )}
          <button
            type="submit"
            className="mt-4 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-primary"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      ) : (
        <DevReportsTable />
      )}
    </div>
  );
}

async function DevReportsTable() {
  return (
    <>
      <div className="mt-4 flex items-center justify-end gap-4">
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-muted-foreground hover:text-foreground">
            ออกจากระบบ
          </button>
        </form>
      </div>
      {!reportsConfigured() ? (
        <p className="mt-6 rounded-xl border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm">
          ยังไม่ได้ต่อ Vercel Blob store (<code>BLOB_READ_WRITE_TOKEN</code>) — ต่อใน Storage → Blob ก่อนจึงจะเก็บ/อ่านคำแจ้งได้
        </p>
      ) : (
        <ReportsList />
      )}
    </>
  );
}

async function ReportsList() {
  const reports = await listReports();

  return (
    <>
      <p className="mt-4 text-sm text-muted-foreground">ทั้งหมด {reports.length} รายการ</p>

      {reports.length === 0 ? (
        <p className="mt-8 rounded-xl border border-border bg-card/50 px-5 py-8 text-center text-sm text-muted-foreground">
          ยังไม่มีคำแจ้ง
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {reports.map((r) => (
            <li key={r.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="rounded-full bg-betta/15 px-2.5 py-0.5 text-xs font-medium text-betta">
                  {REASON_LABEL[r.reason] ?? r.reason}
                </span>
                <span className="font-medium text-foreground">{r.productName}</span>
                <span className="text-muted-foreground">· {fmt(r.createdAt)}</span>
              </div>
              {r.note && (
                <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/85">{r.note}</p>
              )}
              <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>{r.pageUrl}</span>
                <form action={deleteAction}>
                  <input type="hidden" name="id" value={r.id} />
                  <button type="submit" className="text-destructive hover:underline">
                    ลบ
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
