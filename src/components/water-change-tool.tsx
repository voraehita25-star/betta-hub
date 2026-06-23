"use client";

import { useState } from "react";
import Link from "next/link";
import {
  weeklyChangeLiters,
  litersPerBetta,
  litersFromDimensions,
  type LengthUnit,
  MIN_LITERS_PER_BETTA,
  WEEKLY_CHANGE_MIN_PCT,
  WEEKLY_CHANGE_MAX_PCT,
} from "@/lib/care-math";

type Mode = "liters" | "dims";

function fmt(n: number) {
  return (Math.round(n * 10) / 10).toLocaleString("th-TH");
}

const inputClass =
  "mt-2 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

// ตัวอย่างค่า placeholder ของแต่ละหน่วย (ตู้ ~12 ลิตร)
const PLACEHOLDERS: Record<LengthUnit, { l: string; w: string; h: string }> = {
  in: { l: "เช่น 12", w: "เช่น 8", h: "เช่น 8" },
  cm: { l: "เช่น 30", w: "เช่น 20", h: "เช่น 20" },
};

/**
 * เครื่องคำนวณเปลี่ยนน้ำ — ทำงานในเบราว์เซอร์ของผู้ใช้ทั้งหมด ไม่ส่ง/เก็บข้อมูล
 * รับได้ทั้งปริมาตร (ลิตร) หรือขนาดตู้ (ยาว×กว้าง×สูง หน่วยนิ้วหรือซม.) สำหรับคนที่ไม่รู้ว่าตู้จุน้ำได้เท่าไร
 * ผลลัพธ์เป็น "ช่วง" ตามคู่มือ และน้ำยาดีคลอรีนให้ดูตามฉลาก (ไม่ระบุปริมาณตายตัวที่กุขึ้น)
 */
export function WaterChangeTool() {
  const [mode, setMode] = useState<Mode>("liters");
  const [unit, setUnit] = useState<LengthUnit>("in");
  const [volume, setVolume] = useState("5");
  const [len, setLen] = useState("");
  const [wid, setWid] = useState("");
  const [hei, setHei] = useState("");
  const [fish, setFish] = useState("1");

  // โหมดวัดขนาด: คำนวณปริมาตรเต็มจาก ยาว×กว้าง×สูง (ตามหน่วยที่เลือก) แล้วใช้ค่านั้นต่อ
  const dimsVolume =
    mode === "dims"
      ? litersFromDimensions(parseFloat(len), parseFloat(wid), parseFloat(hei), unit)
      : null;
  const v = mode === "liters" ? parseFloat(volume) : dimsVolume ?? NaN;
  const f = parseInt(fish, 10);
  const hasInput = Number.isFinite(v) && v > 0;
  const range = weeklyChangeLiters(hasInput ? v : 0);
  const perBetta = litersPerBetta(v, f);

  const modes: [Mode, string][] = [
    ["liters", "รู้ปริมาตร (ลิตร)"],
    ["dims", "วัดขนาดตู้"],
  ];
  const units: [LengthUnit, string][] = [
    ["in", "นิ้ว"],
    ["cm", "ซม."],
  ];
  const unitLabel = unit === "in" ? "นิ้ว" : "ซม.";
  const ph = PLACEHOLDERS[unit];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      {/* เลือกวิธีระบุขนาดตู้ */}
      <div
        role="group"
        aria-label="วิธีระบุขนาดตู้"
        className="inline-flex rounded-full border border-border bg-muted/50 p-1"
      >
        {modes.map(([m, label]) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === m
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* อินพุต */}
      {mode === "liters" ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">ปริมาตรตู้ (ลิตร)</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.5"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">จำนวนปลากัด</span>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={fish}
              onChange={(e) => setFish(e.target.value)}
              className={inputClass}
            />
          </label>
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {/* หน่วยวัด */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">หน่วย:</span>
            <div
              role="group"
              aria-label="หน่วยวัด"
              className="inline-flex rounded-full border border-border bg-muted/50 p-1"
            >
              {units.map(([u, label]) => (
                <button
                  key={u}
                  type="button"
                  aria-pressed={unit === u}
                  onClick={() => setUnit(u)}
                  className={`rounded-full px-3.5 py-1 text-sm font-medium transition-colors ${
                    unit === u
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium">ยาว ({unitLabel})</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.5"
                value={len}
                onChange={(e) => setLen(e.target.value)}
                placeholder={ph.l}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">กว้าง ({unitLabel})</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.5"
                value={wid}
                onChange={(e) => setWid(e.target.value)}
                placeholder={ph.w}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">สูง ({unitLabel})</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.5"
                value={hei}
                onChange={(e) => setHei(e.target.value)}
                placeholder={ph.h}
                className={inputClass}
              />
            </label>
          </div>
          <label className="block sm:max-w-[12rem]">
            <span className="text-sm font-medium">จำนวนปลากัด</span>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={fish}
              onChange={(e) => setFish(e.target.value)}
              className={inputClass}
            />
          </label>
          {dimsVolume !== null && (
            <p className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              ปริมาตรตู้ (เต็ม) ≈ <strong className="text-foreground">{fmt(dimsVolume)} ลิตร</strong>{" "}
              — น้ำจริงจะน้อยกว่านี้เล็กน้อย เพราะปกติเว้นขอบบนไว้และมีกรวด/ของแต่งกินที่
            </p>
          )}
        </div>
      )}

      {/* ผลลัพธ์ */}
      <div aria-live="polite" className="mt-6 space-y-4">
        {hasInput ? (
          <>
            <div className="rounded-xl border border-betta/30 bg-betta/5 px-5 py-4">
              <p className="text-sm text-muted-foreground">ควรเปลี่ยนน้ำสัปดาห์ละประมาณ</p>
              <p className="mt-1 font-heading text-2xl font-semibold text-foreground">
                {fmt(range.min)}–{fmt(range.max)} ลิตร
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                ({WEEKLY_CHANGE_MIN_PCT}–{WEEKLY_CHANGE_MAX_PCT}% ของปริมาตรตู้ · ตู้เล็กหรือไม่มีกรองให้เปลี่ยนถี่ขึ้น)
              </p>
            </div>

            {perBetta !== null && perBetta < MIN_LITERS_PER_BETTA && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-5 py-3 text-sm">
                <strong className="text-destructive">ตู้อาจเล็กไป:</strong> ได้ราว {fmt(perBetta)}{" "}
                ลิตร/ตัว — คู่มือแนะนำอย่างน้อย {MIN_LITERS_PER_BETTA} ลิตรต่อปลากัด 1 ตัว
              </div>
            )}

            <p className="text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground/80">น้ำยาปรับสภาพน้ำ (ดีคลอรีน):</strong>{" "}
              ใช้ตามอัตราที่ระบุบนฉลากของน้ำยาที่คุณใช้ เทียบกับปริมาณน้ำใหม่ที่เติม —
              แต่ละสูตรเข้มข้นไม่เท่ากัน เราจึงไม่ระบุปริมาณตายตัว
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {mode === "liters"
              ? "กรอกปริมาตรตู้เพื่อดูคำแนะนำ"
              : "กรอกขนาดตู้ทั้ง 3 ด้านเพื่อดูคำแนะนำ"}
          </p>
        )}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        ตัวเลขนี้เป็นแนวทางเริ่มต้นจาก{" "}
        <Link href="/articles/setup-betta-tank" className="underline underline-offset-4 hover:text-betta">
          คู่มือจัดตู้
        </Link>{" "}
        · คำนวณในเบราว์เซอร์ของคุณเอง ไม่มีการส่งหรือเก็บข้อมูล
      </p>
    </div>
  );
}
