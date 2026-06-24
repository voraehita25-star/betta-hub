"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReportReason } from "@/lib/reports";

// แสดงปุ่มเฉพาะเมื่อเปิดฟีเจอร์ (กันปุ่มเสียก่อนต่อ Vercel Blob store)
const ENABLED = process.env.NEXT_PUBLIC_REPORTS_ENABLED === "1";

const REASONS: { value: ReportReason; label: string }[] = [
  { value: "broken-link", label: "ลิงก์เสีย" },
  { value: "out-of-stock", label: "สินค้าหมด" },
  { value: "other", label: "อื่นๆ" },
];

type Status = "idle" | "sending" | "ok" | "err";

/**
 * ปุ่มแจ้งลิงก์เสีย/สินค้าหมด → เปิดฟอร์มเล็ก แล้ว POST /api/report (บันทึกฝั่งเซิร์ฟเวอร์ ดูได้เฉพาะ dev)
 * ไม่ขออีเมล/ชื่อ; โน้ตไม่บังคับ; เคารพ a11y (radiogroup/label/Esc/โฟกัส)
 */
export function ReportLink({ productName }: { productName: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [reason, setReason] = useState<ReportReason>("broken-link");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");

  const panelId = useId();
  const btnRef = useRef<HTMLButtonElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // เปิดแล้วโฟกัสตัวเลือกแรก; ปิดด้วย Esc แล้วคืนโฟกัสปุ่ม (WCAG 2.4.3)
  useEffect(() => {
    if (!open) return;
    firstFieldRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!ENABLED) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return; // กันกดซ้ำระหว่างกำลังส่ง (ปุ่มก็ disabled อยู่แล้ว)

    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem("company") as HTMLInputElement | null)?.value ?? "";

    setStatus("sending");
    setMsg("");
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          reason,
          note: note.trim() || undefined,
          pageUrl: window.location.pathname,
          company: honeypot,
        }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (res.ok && data?.ok) {
        setStatus("ok");
        setMsg("ขอบคุณ ส่งคำแจ้งแล้ว เราจะรีบตรวจสอบ");
        setNote("");
      } else {
        setStatus("err");
        setMsg("ส่งไม่สำเร็จ ลองใหม่อีกครั้งภายหลังได้");
      }
    } catch {
      setStatus("err");
      setMsg("ส่งไม่สำเร็จ ตรวจสอบการเชื่อมต่อแล้วลองใหม่");
    }
  }

  return (
    <span className="relative inline-block">
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="text-xs text-muted-foreground underline-offset-2 hover:text-destructive hover:underline"
      >
        แจ้งลิงก์เสีย/สินค้าหมด
      </button>

      {open && (
        <div
          id={panelId}
          className="absolute left-0 top-7 z-30 w-72 rounded-xl border border-border bg-card p-4 text-left shadow-lg"
        >
          {status === "ok" ? (
            <div>
              <p className="text-sm text-foreground">{msg}</p>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  btnRef.current?.focus();
                }}
                className="mt-3 text-xs font-medium text-betta underline-offset-2 hover:underline"
              >
                ปิด
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="text-xs font-medium text-foreground/80">
                แจ้งปัญหาเกี่ยวกับ &ldquo;{productName}&rdquo;
              </p>

              <fieldset className="mt-3">
                <legend className="text-xs text-muted-foreground">ปัญหาที่พบ</legend>
                <div className="mt-1.5 flex flex-col gap-1.5">
                  {REASONS.map((r, i) => (
                    <label key={r.value} className="flex items-center gap-2 text-sm">
                      <input
                        ref={i === 0 ? firstFieldRef : undefined}
                        type="radio"
                        name="reason"
                        value={r.value}
                        checked={reason === r.value}
                        onChange={() => setReason(r.value)}
                        className="accent-betta"
                      />
                      {r.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="mt-3 block">
                <span className="text-xs text-muted-foreground">รายละเอียดเพิ่มเติม (ไม่บังคับ)</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={500}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <span className="mt-1 block text-[0.68rem] text-muted-foreground">
                  อย่าใส่ข้อมูลส่วนตัว (อีเมล/เบอร์/ชื่อ) ในช่องนี้
                </span>
              </label>

              {/* honeypot — ซ่อนจากผู้ใช้/AT, บอตมักกรอก */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="sr-only"
              />

              <div className="mt-3 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="rounded-full bg-betta px-4 py-1.5 text-xs font-medium text-betta-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {status === "sending" ? "กำลังส่ง…" : "ส่งคำแจ้ง"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    btnRef.current?.focus();
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  ยกเลิก
                </button>
              </div>

              {status === "err" && (
                <p role="alert" className="mt-2 text-xs text-destructive">
                  {msg}
                </p>
              )}
            </form>
          )}
        </div>
      )}
    </span>
  );
}
