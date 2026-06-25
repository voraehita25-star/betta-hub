// ทะเบียนลิงก์พันธมิตร (affiliate) กลาง — แก้/วางลิงก์ที่นี่ "ที่เดียว"
// GearPick ทุกตัวในบทความที่อ้าง key เดียวกันจะดึงลิงก์นี้ไปใช้อัตโนมัติ
//
// วิธีเอาลิงก์จริงมาใส่ (ต้องเป็นลิงก์จากบัญชี Shopee Affiliate ของคุณเอง คอมมิชชันถึงจะเข้าคุณ):
//   1) สมัคร/ล็อกอิน affiliate.shopee.co.th แล้วให้ผ่านการอนุมัติ
//   2) เปิดหน้าสินค้าที่คุณเลือก → ใช้ "Generate Link" (หรือส่วนขยาย/แชร์ในแอป) สร้างลิงก์ติดตาม
//   3) ตอน generate ตั้ง sub-id เป็นชื่อ key ด้านล่าง (เช่น "sponge-filter") เพื่อดูในรายงานว่าปุ่มไหนคอนเวิร์ต
//   4) วางลิงก์ที่ได้ลงในช่อง url ของ key นั้น
//
// ปล่อย url เป็น undefined ไว้ก่อนได้ — GearPick จะขึ้นสถานะ "กำลังคัดรุ่นที่แนะนำ" ให้เองอย่างซื่อสัตย์
// อย่าใส่ลิงก์ที่ยังไม่ได้ทดสอบ/ไม่ได้ใช้จริง เพื่อรักษาจุดยืน "แนะนำเฉพาะของที่เชื่อว่าดีจริง"

export type AffiliatePick = {
  /** ป้ายอ้างอิงภายในว่า key นี้คือสินค้าอะไร — ไม่ถูกแสดงผล (ข้อความจริงมาจาก GearPick ในบทความ) */
  name: string;
  /** ลิงก์ affiliate จริงของคุณ — undefined = ยังไม่เปิดใช้ (GearPick จะขึ้น "กำลังคัดรุ่น") */
  url?: string;
};

export const AFFILIATE: Record<string, AffiliatePick> = {
  // หมายเหตุ: key คงไว้เป็น "betta-tank-5l" เพราะใช้เป็น Shopee sub-id ในรายงานคอนเวอร์ชันแล้ว
  // (เปลี่ยนชื่อจะทำให้สถิติเดิมขาดช่วง) — สินค้าจริงคือตู้นาโน ~8.4 ลิตร (26×17×19 ซม.)
  "betta-tank-5l": {
    name: "ตู้ปลานาโนหน้าโค้ง 10 นิ้ว",
    url: "https://s.shopee.co.th/AKYRoRebrK",
  },
  "sponge-filter": {
    name: "กรองฟองน้ำ XINYOU (XY Series)",
    url: "https://s.shopee.co.th/2qSQoykSLY",
  },
  "air-pump": {
    name: "ปั๊มลม SOBO SB-348 (2 ทาง ปรับแรงได้)",
    url: "https://s.shopee.co.th/7AbPz7Mpou",
  },
  "air-line": {
    name: "สายซิลิโคน AQUAPRO Master Series (4/6 มม.)",
    url: "https://s.shopee.co.th/Ll5sXObDi",
  },
  "betta-pellets": {
    name: "Hikari Betta Bio-Gold (อาหารปลากัดพรีเมียมจากญี่ปุ่น)",
    url: "https://s.shopee.co.th/4AxoN6pHzK",
  },
  // เพิ่ม key อื่นได้ตามต้องการ เช่น:
  // "water-conditioner": { name: "น้ำยาปรับสภาพน้ำ (ดีคลอรีน)", url: undefined },
  // "mini-heater": { name: "ฮีตเตอร์เล็ก + เทอร์โมมิเตอร์", url: undefined },
};

// Build-time guard: ลิงก์ทุกตัวต้องเป็น https:// (กัน mixed-content / javascript:/ data: ที่อาจหลุดมา)
// โมดูลนี้ถูก import จาก Server Components ตอน prerender → ลิงก์ผิดจะทำให้ next build fail ทันที
for (const [key, pick] of Object.entries(AFFILIATE)) {
  if (pick.url && !pick.url.startsWith("https://")) {
    throw new Error(`AFFILIATE["${key}"].url ต้องขึ้นต้นด้วย https:// (พบ: ${pick.url})`);
  }
}

/** ดึงลิงก์ affiliate จริงตาม key — undefined ถ้ายังไม่ได้ตั้งหรือไม่มี key นี้ */
export function affiliateHref(key: string): string | undefined {
  return AFFILIATE[key]?.url;
}
