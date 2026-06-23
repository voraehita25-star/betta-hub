"use client";

import { useSyncExternalStore } from "react";

/**
 * อ่านผลของ media query ใดๆ แบบไม่ใช้ setState-in-effect
 * (useSyncExternalStore ตามแนวทาง React 19) จึงไม่ชนกฎ react-hooks/set-state-in-effect
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    // ฝั่ง server ตอบ false ไว้ก่อน (จะถูกแก้ให้ตรงตอน hydrate)
    () => false,
  );
}

/** ผู้ใช้ตั้งค่าลดการเคลื่อนไหวของระบบหรือไม่ (prefers-reduced-motion: reduce) */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
