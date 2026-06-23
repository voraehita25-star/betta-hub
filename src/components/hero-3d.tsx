"use client";

import dynamic from "next/dynamic";

// โหลดเฉพาะฝั่ง client: r3f Canvas แตะ window/WebGL จึง SSR ไม่ได้
// ssr:false ใช้ได้เพราะไฟล์นี้เป็น Client Component ('use client') ตาม docs Next 16
const HeroCanvas = dynamic(() => import("./hero-canvas"), { ssr: false });

export function Hero3D() {
  return <HeroCanvas />;
}
