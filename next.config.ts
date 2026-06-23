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
  // External scripts เพิ่มความปลอดภัยด้วย Subresource Integrity (experimental.sri ด้านล่าง)
  // ปล่อย 'unsafe-inline' ใน script-src — trade-off: ตัดต้องใช้ middleware ที่เสีย static caching
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "worker-src 'self' blob:",
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
  // Subresource Integrity: ใส่ integrity hash ให้ external <script> ตอน build
  // → กัน CDN/MITM แอบเปลี่ยน bundle (browser verify hash ก่อน execute)
  // คงรองรับ static export (ต่างจาก nonce ที่ต้อง dynamic render)
  experimental: {
    sri: { algorithm: "sha256" },
  },
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
