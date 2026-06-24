import type { NextConfig } from "next";

// เว็บ prerender แบบ static ทั้งหมด + ทุก resource เป็น same-origin (ฟอนต์ self-host, ไม่มีสคริปต์ภายนอก)
// จึงใช้ CSP แบบ non-nonce ได้ (ไม่ใช้ nonce/proxy ที่บังคับ dynamic จนเสีย CDN cache)
// dev เท่านั้นที่ต้องการ 'unsafe-eval' (React Refresh) + 'unsafe-inline' style (Next dev HMR) + ws: (HMR)
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  // style-src ทั้งก้อน — fallback สำหรับ browser ที่ไม่รองรับ style-src-elem/-attr (CSP3)
  "style-src 'self' 'unsafe-inline'",
  // style-src-elem: บล็อก <style> tag จาก inline (vector หลักของ CSS keylogger / data exfil)
  // dev: Next ฉีด <style> สำหรับ HMR — ต้องเปิด
  // prod: ตรวจด้วย browser แล้ว ทุกหน้าจริงโหลด CSS ผ่าน <link> external เท่านั้น (0 inline <style>, 0 CSP violation)
  //   ข้อยกเว้นเดียว: หน้า _global-error ภายในของ Next มี <style> boilerplate (ตัวแปรสีเริ่มต้น) ที่ถูก
  //   global-error.tsx ของเราแทนที่อยู่แล้ว → ถ้าโดนบล็อกก็แค่สีเพี้ยนชั่วคราวบนหน้า error ไม่กระทบฟังก์ชัน
  `style-src-elem 'self'${isDev ? " 'unsafe-inline'" : ""}`,
  // style-src-attr: ยอม inline style= attribute ของ <img> ที่ next/image ใส่ (position/size สำหรับ fill mode)
  "style-src-attr 'unsafe-inline'",
  // 'unsafe-inline' รองรับสคริปต์ hydration ที่ Next ฝัง inline (static export ไม่มี nonce/proxy)
  // ทุกสคริปต์เป็น same-origin first-party (ไม่มี external <script>) → script-src 'self' เพียงพอ
  // ปล่อย 'unsafe-inline' ใน script-src — trade-off: ตัดต้องใช้ middleware ที่เสีย static caching
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  // ฮีโร่ 3D (r3f/drei: Float/Environment/Lightformer + meshPhysicalMaterial) ไม่ spawn web worker ใดๆ
  // จึงตัด blob: ออก (ลด attack surface) — เพิ่มกลับเมื่อมี loader ที่ใช้ worker จริง (Draco/KTX2/Splat)
  "worker-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // ปิด X-Powered-By: Next.js (ไม่ leak ชนิด/เวอร์ชัน framework ให้ scanner)
  poweredByHeader: false,
  // หมายเหตุ: เคยเปิด experimental.sri (integrity hash) แต่ปิดทิ้งแล้ว —
  //   (1) บน Vercel + Turbopack hash ของ turbopack runtime chunk ไม่ตรง → browser บล็อกสคริปต์ → hydration พัง
  //   (2) ไม่มี external <script> ในไซต์นี้ (ทุกสคริปต์ same-origin เสิร์ฟโดย Vercel เอง) SRI จึงแทบไม่เพิ่มความปลอดภัย
  //   CSP `script-src 'self'` จำกัดแหล่งสคริปต์ให้อยู่ origin เดียวอยู่แล้ว (ตรงกับที่แผนระบุว่า SRI "ไม่มีจุดใส่")
  images: {
    formats: ["image/avif", "image/webp"],
    // จงใจปิด remote image — ทุกภาพต้องอยู่ใน /public; กันคนเผลอเปิด domain ใหม่ภายหลัง
    remotePatterns: [],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
