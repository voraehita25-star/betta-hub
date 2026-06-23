// ค่าคงที่อ้างอิงจากคู่มือจริงในเว็บ (ไม่กุตัวเลขเอง):
// - เปลี่ยนน้ำ 25–50% ต่อสัปดาห์ (setup-betta-tank)
// - ขั้นต่ำ 3–5 ลิตรต่อปลากัด 1 ตัว
export const WEEKLY_CHANGE_MIN_PCT = 25;
export const WEEKLY_CHANGE_MAX_PCT = 50;
export const MIN_LITERS_PER_BETTA = 3;

export type LengthUnit = "in" | "cm";

// ค่าคงที่จริง (ไม่ใช่ค่าประมาณ):
// 1 นิ้ว = 2.54 ซม. → 1 ลบ.นิ้ว = 2.54³ = 16.387064 ลบ.ซม. = 0.016387064 ลิตร
// 1 ลบ.ซม. = 1 มล. = 0.001 ลิตร
export const LITERS_PER_CUBIC_INCH = 0.016387064;
export const LITERS_PER_CUBIC_CM = 0.001;

/**
 * แปลงขนาดตู้ (ยาว×กว้าง×สูง) เป็นลิตร — รองรับหน่วยนิ้วหรือซม.
 * คืน "ปริมาตรเต็ม" ตามเรขาคณิต; น้ำจริงจะน้อยกว่านี้เล็กน้อยเพราะเว้นขอบบน + กรวด/ของแต่งกินที่
 * (เราแจ้งให้ผู้ใช้รู้ ไม่หักลบเป็นตัวเลขที่กุขึ้น) — คืน null ถ้าค่าใดไม่ถูกต้อง
 */
export function litersFromDimensions(
  length: number,
  width: number,
  height: number,
  unit: LengthUnit,
): number | null {
  const dims = [length, width, height];
  if (dims.some((n) => !Number.isFinite(n) || n <= 0)) return null;
  const factor = unit === "in" ? LITERS_PER_CUBIC_INCH : LITERS_PER_CUBIC_CM;
  return length * width * height * factor;
}

/** ช่วงปริมาณน้ำที่ควรเปลี่ยนต่อสัปดาห์ (ลิตร) — เป็น "ช่วง" ไม่ใช่ค่าเป๊ะ ตามแนวทางในคู่มือ */
export function weeklyChangeLiters(volumeL: number): { min: number; max: number } {
  const v = Number.isFinite(volumeL) && volumeL > 0 ? volumeL : 0;
  return {
    min: (v * WEEKLY_CHANGE_MIN_PCT) / 100,
    max: (v * WEEKLY_CHANGE_MAX_PCT) / 100,
  };
}

/** ปริมาตรต่อปลากัด 1 ตัว (ลิตร) — ใช้เตือนเมื่อตู้เล็กเกินไป; คืน null ถ้า input ไม่ถูกต้อง */
export function litersPerBetta(volumeL: number, fish: number): number | null {
  if (!Number.isFinite(volumeL) || volumeL <= 0 || !Number.isFinite(fish) || fish <= 0) return null;
  return volumeL / fish;
}
