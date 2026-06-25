// Rate limit แบบ in-memory (fixed window) คีย์ตาม IP — กัน flood/abuse ของ endpoint สาธารณะ
// หมายเหตุสำคัญ: บน serverless/Fluid Compute แต่ละ instance มี state แยกกัน จึงเป็นการกัน
// "เบื้องต้นต่อ instance" ไม่ใช่ distributed ถ้าต้องการกันทั้งระบบจริงจัง ให้ใช้ Upstash/Vercel KV
// หรือ Vercel Firewall (rate-limit rules) ที่ทำงานก่อนถึงฟังก์ชัน

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** คืน true = ผ่าน (อนุญาต), false = เกินโควตาในหน้าต่างเวลานี้ */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    // กัน Map โตไม่จำกัด: เก็บกวาด entry ที่หมดอายุเป็นครั้งคราว
    if (buckets.size > 5000) {
      for (const [k, b] of buckets) if (now >= b.resetAt) buckets.delete(k);
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}
