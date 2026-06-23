# BettaHub — Vercel Hardening Checklist (Phase B)

> รายการนี้ตั้งใน **Vercel Dashboard** (โค้ดทำให้ไม่ได้) — ติ๊ก `[x]` เมื่อทำเสร็จ
> อ้างอิงจากแผน `hack-robust-kurzweil.md` Phase B

## บัญชี & การเข้าถึง
- [ ] เปิด **2FA แบบ Authenticator app** ทั้ง Vercel และ GitHub (อย่าใช้ SMS — กัน SIM swap)
- [ ] ตรวจ **Team Members / Collaborators** ให้เหลือเฉพาะคนที่ต้องมีจริง
- [ ] รู้จักที่อยู่ของ **Audit Log** (Vercel Team Settings) ไว้เปิดดูเป็นระยะ

## Deployment Protection (Project → Settings → Deployment Protection)
- [ ] Production: **Public** (เว็บสาธารณะ ให้คนทั่วไปเข้าได้)
- [ ] Preview: **Vercel Authentication** (กัน preview URL รั่วลง search engine / โดน scraper)

## Environment Variables (Project → Settings → Environment Variables)
- [ ] ตั้ง `NEXT_PUBLIC_SITE_URL` = โดเมน production จริง (เช่น `https://www.bettahub.com`) — **ห้ามมี trailing slash**
- [ ] ตั้ง `NEXT_PUBLIC_REPORT_EMAIL_USER` + `NEXT_PUBLIC_REPORT_EMAIL_DOMAIN` (ถ้าต้องการให้ปุ่ม "แจ้งลิงก์เสีย/สินค้าหมด" ทำงาน; เว้นว่าง = ซ่อนปุ่ม)
- [ ] ยืนยันไม่มี secret ที่ลืมค้าง / ไม่มี key ที่ไม่ใช้แล้ว
- [ ] เข้าใจว่า `NEXT_PUBLIC_*` ถูก **embed ลงบันเดิล (เปิดเผยได้)** → ห้ามใส่ของลับเป็น `NEXT_PUBLIC_`

## Domains
- [ ] เก็บเฉพาะ domain ที่ใช้จริง — ลบ alias / preview domain ที่ไม่ใช้

## Build & Region
- [ ] ตั้ง Function/Edge region ใกล้ผู้อ่าน: **Singapore `sin1`** หรือ **Tokyo `hnd1`** (สำหรับผู้อ่านไทย)

## หลัง deploy แล้วตรวจซ้ำ
- [ ] ทดสอบที่ <https://securityheaders.com/> → ควรได้เกรด **A หรือ A+**
- [ ] เปิด **DevTools → Console** บนหน้า production จริง → ต้องไม่มี **CSP violation**
- [ ] (Vercel **Pro+** เท่านั้น) เปิด **WAF**: "Block known malicious IPs" + rate limit พื้นฐาน

---
ตอนเกิดเหตุจริง (เว็บล่ม/ถูกแฮก): ดู [`incident-playbook.md`](./incident-playbook.md)
