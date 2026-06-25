import { Trirong, Anuphan } from "next/font/google";

// ฟอนต์ใช้ร่วมระหว่าง root layout และ global-error (global-error แทนที่ root layout ตอน error
// จึงต้อง re-apply ฟอนต์เอง) — ตั้งค่าที่นี่ที่เดียว เพื่อไม่ให้ weight/subset หลุดซิงก์กัน
export const trirong = Trirong({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600"],
  variable: "--font-trirong",
  display: "swap",
});

export const anuphan = Anuphan({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-anuphan",
  display: "swap",
});
