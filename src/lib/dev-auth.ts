import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// การล็อกหน้า /dev: เก็บ sha256(DEV_REPORTS_TOKEN) ใน httpOnly cookie แล้วเทียบแบบ constant-time
// (ไม่เก็บ token ดิบในเบราว์เซอร์; หมุน token = cookie เก่าใช้ไม่ได้ทันที)

export const DEV_COOKIE = "dev_session";

function sha256hex(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

/** เทียบ string แบบ constant-time (hash ทั้งคู่ให้ยาวเท่ากันก่อน) */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/** ตั้ง DEV_REPORTS_TOKEN ไว้หรือยัง */
export function devConfigured(): boolean {
  return Boolean(process.env.DEV_REPORTS_TOKEN);
}

/** ค่าที่จะเก็บใน cookie = hash ของ token จริง */
export function devSessionValue(): string {
  return sha256hex(process.env.DEV_REPORTS_TOKEN ?? "");
}

/** cookie ปัจจุบันตรงกับ token ที่ตั้งไว้ไหม (อ่านอย่างเดียว — เรียกได้ทั้งใน render และ action) */
export async function isDevAuthed(): Promise<boolean> {
  if (!devConfigured()) return false;
  const value = (await cookies()).get(DEV_COOKIE)?.value;
  if (!value) return false;
  const expected = devSessionValue();
  // ทั้งคู่เป็น hex 64 ตัว (32 ไบต์) ความยาวเท่ากันเสมอ → timingSafeEqual ได้ตรงๆ
  if (value.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
  } catch {
    return false;
  }
}
