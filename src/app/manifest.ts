import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

// Web App Manifest — ติดตั้งบนหน้าจอมือถือได้ + ไอคอน/สีแบรนด์ในแท็บ/ผลค้นหา
// ไอคอนสร้างจาก fish-mark (เป็น app icon ไม่ใช่ schema.org Organization logo — คงจุดยืน honesty)
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BettaHub — คู่มือและรีวิวเรื่องปลากัด ตู้ปลา และอุปกรณ์",
    short_name: SITE_NAME,
    description: "คู่มือเลี้ยงปลากัดและรีวิวอุปกรณ์ตู้ปลา — อ่านฟรี ไม่ต้องสมัคร",
    start_url: "/",
    display: "standalone",
    lang: "th",
    background_color: "#090f13",
    theme_color: "#090f13",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
