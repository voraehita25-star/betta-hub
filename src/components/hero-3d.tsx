"use client";

import dynamic from "next/dynamic";
import { useMediaQuery } from "@/hooks/use-reduced-motion";

// โหลดเฉพาะฝั่ง client: r3f Canvas แตะ window/WebGL จึง SSR ไม่ได้
// ssr:false ใช้ได้เพราะไฟล์นี้เป็น Client Component ('use client') ตาม docs Next 16
const HeroCanvas = dynamic(() => import("./hero-canvas"), { ssr: false });

export function Hero3D() {
  // gate ก่อน mount: bundle three.js/r3f/drei จะถูก "ดาวน์โหลด" ก็ต่อเมื่อ <HeroCanvas/> ถูก render จริง
  // → มือถือ + ผู้ใช้ reduced-motion ไม่ต้องโหลด/พาร์ส bundle หนักเพื่อพื้นหลัง decorative (มี .dot-mask แทนแล้ว)
  // useMediaQuery (useSyncExternalStore) ตอบ false ฝั่ง server/ก่อน hydrate → ไม่ทำให้ hydration mismatch
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (reduced || !isDesktop) return null;
  return <HeroCanvas />;
}
