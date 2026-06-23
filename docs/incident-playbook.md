# BettaHub — Incident Playbook (คู่มือรับมือเหตุฉุกเฉิน)

> 1 หน้า ใช้ตอนเว็บมีปัญหาหรือสงสัยถูกบุกรุก
> BettaHub เป็น **static content site** — ไม่มี database / secret runtime / ข้อมูลผู้ใช้ → ความเสียหายวงแคบ
> หลักการ: **"หยุดเลือดก่อน → ค่อยสืบสาเหตุ"**

## 0) ของสำคัญอยู่ที่ไหน (ห้ามใส่ใน repo / chat)
- รหัสผ่าน + recovery codes → **password manager เท่านั้น**
- บัญชีที่เกี่ยว: **Vercel** (โฮสต์), **GitHub** (ซอร์สโค้ด), **Shopee Affiliate** (ลิงก์รายได้), **Gmail** (อีเมลรับแจ้งลิงก์เสีย)
- เจ้าของ/ผู้ติดต่อ: _<เติมชื่อ + ช่องทางติดต่อตัวเอง/ทีม>_

## 1) ประเมินความรุนแรงเร็ว ๆ
| อาการ | ไปที่ |
|---|---|
| เว็บล่ม / หน้าเพี้ยน แต่บัญชียังปลอดภัย | **ข้อ 2** (rollback) |
| มี commit/deploy แปลก, สงสัย token/บัญชีถูกขโมย, secret หลุด | **ข้อ 3 ก่อน** (กันความเสียหายต่อ) |

## 2) เว็บล่ม / deploy ใหม่พัง → Rollback Vercel (เร็วสุด)
1. Vercel Dashboard → โปรเจกต์ `betta-hub` → แท็บ **Deployments**
2. หา deployment ล่าสุดสถานะ **Ready** ที่ทำงานดี (ตัวก่อนที่จะพัง)
3. เมนู ⋯ → **Instant Rollback** (หรือ Promote to Production)
   - ทางเลือก CLI: `vercel rollback <deployment-url>`
4. เว็บกลับเป็นเวอร์ชันดี **ทันที** (ไม่ต้อง build ใหม่)
5. ค่อยแก้สาเหตุใน branch → เปิด PR → **CI ต้องผ่านก่อน merge**

## 3) สงสัยถูกบุกรุก (บัญชี / token / commit แปลก)
1. **GitHub** → Settings → Password → เปลี่ยนรหัส; → Sessions → **Sign out other sessions**
2. **GitHub** → Developer settings → Personal access tokens / OAuth apps → **revoke** ตัวที่ไม่รู้จัก
3. ยืนยัน **2FA (Authenticator app)** เปิดอยู่ทั้ง GitHub และ Vercel
4. **Vercel** → เปลี่ยนรหัส/re-auth; Team → **Audit Log** ดูกิจกรรมผิดปกติ
5. มี commit แปลกบน `main`:
   - `git log --oneline` หา SHA ต้องสงสัย
   - `git revert <sha>` (ปลอดภัยกว่า reset) → push  **หรือ** rollback Vercel ตามข้อ 2
6. สิทธิ์ repo ถูกแก้: Settings → Collaborators/Manage access → ลบคนแปลกหน้า

## 4) Secret / token หลุด (เช่นโผล่ใน git หรือ log)
- ตอนนี้ BettaHub ไม่มี secret runtime (env เป็น `NEXT_PUBLIC_*` ที่เปิดเผยได้)
- ถ้าอนาคตมี secret แล้วหลุด: ไปที่ provider → **rotate/revoke ทันที** → ตั้งใหม่ใน Vercel Env → redeploy
- ลบจาก git history ถ้าจำเป็น (`git filter-repo` หรือ BFG) แล้ว force-push (ระวัง)
- ⚠️ ลบ commit ไม่พอ — ของที่ public ไปแล้วถือว่า **หลุดถาวร** ต้อง rotate เสมอ

## 5) Dependency CVE (Dependabot / npm audit เตือน)
1. ดู PR ของ Dependabot หรือรัน `npm audit`
2. ให้ **CI (tsc + lint + build + audit) ผ่านก่อน merge**
3. ถ้าเป็น transitive ที่ patch ไม่ขึ้นตรง ๆ: ใช้ `overrides` ใน `package.json` (เหมือนที่ทำกับ `postcss`)

## 6) หลังเหตุการณ์ (post-incident)
- จดสั้น ๆ: **เกิดอะไร / รู้ได้ยังไง / แก้ด้วยอะไร / กันซ้ำยังไง**
- ถ้าเกี่ยวกับโค้ด → เพิ่ม guard หรือ test กันพลาดซ้ำ (เช่น build-time guard ใน `src/lib/affiliate.ts`)

---
การตั้งค่าฝั่ง Vercel ที่ต้องทำใน dashboard: ดู [`vercel-hardening-checklist.md`](./vercel-hardening-checklist.md)
