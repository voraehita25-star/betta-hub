# BettaHub — บันทึกคำแจ้ง "ลิงก์เสีย/สินค้าหมด" (dev-only) — Design Spec

วันที่: 2026-06-24
สถานะ: implement แล้ว + ตรวจสอบ (tsc/lint/build เขียว, ทดสอบเบราว์เซอร์: dev-gate/cookie httpOnly/noindex/ฟอร์ม/สัญญา API) — เหลือ persistence จริงที่ต้องมี Vercel Blob token

## 1. เป้าหมาย

เปลี่ยนปุ่ม "แจ้งลิงก์เสีย/สินค้าหมด" (ปัจจุบันเปิด `mailto:` ของผู้ใช้) ให้ **บันทึกคำแจ้งไว้ในระบบของเว็บ** และให้ **เฉพาะ dev ดูได้**

ตามที่ตกลง:
- **ทั้ง log ทันที + เก็บถาวร** — log ผ่าน `console.warn` (เห็นใน Vercel Logs) และเก็บถาวรลง **Vercel Blob**
- ส่งผ่าน **ฟอร์มเล็ก** (เลือกเหตุผล + โน้ตไม่บังคับ) — ไม่ขออีเมล/ชื่อ
- ดูที่หน้า **`/dev/reports`** ที่ล็อกด้วย **token form + httpOnly cookie**

## 2. หลักการที่ต้องไม่ละเมิด (ethos)

- **privacy-first**: ไม่เก็บ PII (อีเมล/ชื่อ/IP). เก็บเฉพาะสิ่งที่ผู้ใช้พิมพ์เอง (เหตุผล + โน้ตไม่บังคับ) + บริบทขั้นต่ำ (หน้า, เวลา)
- **honest**: หน้า privacy ปัจจุบันระบุ "ไม่มีฟอร์มเก็บข้อมูล" → **ต้องแก้ให้ตรงความจริง**
- **static**: ส่วนที่เพิ่มเป็น dynamic เฉพาะ `/api/report` และ `/dev/*` เท่านั้น หน้าอื่นยัง static
- **a11y**: ฟอร์มต้องเข้าถึงได้ (label/radiogroup/โฟกัส/Esc) และเคารพ reduced-motion (กฎ global เดิมครอบให้แล้ว)
- **security**: endpoint สาธารณะต้อง validate + กันสแปม; เทียบ token แบบ constant-time; `/dev` ต้อง noindex + cookie httpOnly/secure; เก็บ blob เป็น **private** (อ่านฝั่งเซิร์ฟเวอร์เท่านั้น)
- **CSP**: ฟอร์มยิง `fetch` same-origin → ผ่าน `connect-src 'self'` เดิม **ไม่ต้องแก้ CSP**

## 3. โมเดลข้อมูล

```ts
type ReportReason = "broken-link" | "out-of-stock" | "other";

type Report = {
  id: string;          // `${createdAt-ms}-${rand}` ใช้เป็นชื่อ blob ด้วย
  productName: string; // จากการ์ด GearPick (รู้อยู่แล้ว) — cap 120
  reason: ReportReason;
  note?: string;       // ผู้ใช้พิมพ์เอง ไม่บังคับ — trim + cap 500
  pageUrl: string;     // pathname ของหน้า เช่น /articles/best-betta-filters — cap 200
  createdAt: string;   // ISO เวลาฝั่งเซิร์ฟเวอร์ (ห้ามเชื่อเวลา client)
};
```

เก็บ **1 ไฟล์ JSON ต่อ 1 คำแจ้ง** ที่ `reports/<id>.json` (write แต่ละครั้งเป็นอิสระ → ไม่ race / ไม่สูญหายแบบ single-file read-modify-write)

## 4. ไฟล์

### เพิ่ม
- `src/lib/reports.ts` — โมเดล + helper เหนือ `@vercel/blob`
  - `saveReport(input): Promise<Report>` — เติม id/createdAt, `put('reports/<id>.json', json, { access: 'private', contentType, token })`, `console.warn('[report] …')`
  - `listReports(): Promise<Report[]>` — `list({ prefix: 'reports/' })` → ดึงเนื้อหาแต่ละไฟล์ (ฝั่งเซิร์ฟเวอร์) → parse → เรียง createdAt ใหม่→เก่า
  - `deleteReport(id): Promise<void>` — `del()` ไฟล์นั้น
  - `reportsConfigured(): boolean` — มี `BLOB_READ_WRITE_TOKEN` ไหม
  - ⚠️ **ก่อนเขียน**: `npm i @vercel/blob` แล้ว **อ่าน type/เวอร์ชันจริง** ยืนยัน API `access:'private'` + วิธีอ่านเนื้อหา blob แบบ private (AGENTS.md: อ่านไลบรารีจริงก่อนใช้). ถ้าเวอร์ชันที่ติดตั้งยังไม่รองรับ private → ใช้ public + key เดาไม่ได้ และบันทึกข้อจำกัดไว้ใน spec
- `src/app/api/report/route.ts` — `POST` สาธารณะ
  - parse JSON อย่างปลอดภัย (ไม่ใช่ JSON → 400)
  - validate: `reason ∈ enum`, `productName` 1–120, `note?` ≤500 (trim), `pageUrl` ≤200 และขึ้นต้น `/`
  - **honeypot**: ถ้า field ล่อ (`company`) ไม่ว่าง → ตอบ 200 `{ok:true}` แต่ **ไม่บันทึก** (ไม่ให้บอตรู้)
  - ถ้า `!reportsConfigured()` → 503
  - สำเร็จ → `saveReport` → 200 `{ok:true}`
  - `runtime = 'nodejs'`
- `src/app/dev/reports/page.tsx` — Server Component, `dynamic = 'force-dynamic'`, `metadata.robots = { index:false, follow:false }`
  - `isDevAuthed()` อ่าน cookie `dev_session` (= `sha256(DEV_REPORTS_TOKEN)` แบบ hex) เทียบ constant-time กับ hash ของ env
  - ไม่ผ่าน → แสดงฟอร์มกรอก token (action = `loginAction`)
  - ผ่าน → `listReports()` → ตาราง (เวลา/หน้า/สินค้า/เหตุผล/โน้ต) + ปุ่มลบรายตัว (`deleteAction`) + ปุ่ม logout
  - `loginAction`/`deleteAction`/`logoutAction` เป็น **Server Actions** (`"use server"`): login เทียบ token constant-time → ตั้ง cookie httpOnly/secure/sameSite=lax/path=/dev; delete/logout **เช็ก auth ซ้ำในแอ็กชัน** (ไม่เชื่อหน้า)
  - ⚠️ Next 16: `cookies()` เป็น **async** → ต้อง `await cookies()` (ยืนยันกับ docs ใน node_modules ตอนทำ)

### แก้
- `src/components/report-link.tsx` — เขียนใหม่จาก mailto → ปุ่ม + ฟอร์มเล็ก (client)
  - gate: render เฉพาะเมื่อ `process.env.NEXT_PUBLIC_REPORTS_ENABLED === "1"` (ไม่งั้น `null` — ซ่อนปุ่มก่อน provision)
  - ปุ่ม `aria-expanded`/`aria-controls` toggle ฟอร์ม inline (ไม่ใช่ modal เต็ม — focus ง่ายกว่า): radiogroup 3 เหตุผล + textarea โน้ต (maxLength 500) + honeypot ซ่อน + ปุ่มส่ง
  - submit: `fetch('/api/report', {method:'POST', json})` → สถานะ idle/submitting/success/error; สำเร็จ → ข้อความ "ขอบคุณ ส่งคำแจ้งแล้ว"
  - ข้อความเตือนใต้ textarea: "อย่าใส่ข้อมูลส่วนตัวในโน้ต"
  - soft-throttle: localStorage cooldown ~30 วิ กันกดซ้ำ (UX ไม่ใช่ security)
  - Esc ปิดฟอร์ม + คืนโฟกัสปุ่ม
- `src/app/robots.ts` — branch prod เพิ่ม `disallow: "/dev/"` (คู่กับ noindex ในหน้า)
- `src/lib/site.ts` — ลบ `REPORT_EMAIL_PARTS` (ไม่ใช้แล้ว) — เช็กว่าไม่มีที่อื่นอ้างถึง (มีแค่ report-link.tsx)
- `src/app/privacy/page.tsx` — **ความซื่อสัตย์**: ปรับ bullet "ไม่มีฟอร์มเก็บข้อมูล" + เพิ่มหัวข้อ "การแจ้งปัญหาสินค้า/ลิงก์ (ไม่บังคับ)": ถ้าใช้ปุ่มแจ้ง เราจะรับ+เก็บ เหตุผล/โน้ตที่พิมพ์/หน้า/เวลา; ไม่ขอ-ไม่เก็บ ชื่อ/อีเมล/IP; อย่าใส่ข้อมูลส่วนตัวในโน้ต; ใช้เพื่อแก้ปัญหาเท่านั้น; เก็บเท่าที่จำเป็นแล้วลบ
- `.env.example` (ถ้ามีในรีโป) — ลบ `NEXT_PUBLIC_REPORT_EMAIL_*`, เพิ่ม `BLOB_READ_WRITE_TOKEN`, `DEV_REPORTS_TOKEN`, `NEXT_PUBLIC_REPORTS_ENABLED`
- `package.json` — เพิ่ม `@vercel/blob`

## 5. Access control (หน้า dev)

- cookie `dev_session` = `hex(sha256(DEV_REPORTS_TOKEN))` (เก็บ hash ไม่เก็บ token ดิบในเบราว์เซอร์)
- เทียบแบบ constant-time (`crypto.timingSafeEqual` บน buffer ความยาวเท่ากัน — hash จึงยาวคงที่)
- cookie: `httpOnly, secure, sameSite:'lax', path:'/dev', maxAge ~7วัน`
- หมุน token (เปลี่ยน env) → cookie เก่าใช้ไม่ได้ทันที
- ทุก action (list ผ่านหน้า, delete, logout) เช็ก auth ฝั่งเซิร์ฟเวอร์เสมอ

## 6. กันสแปม/abuse

- validate enum + cap ความยาว (note/productName/pageUrl)
- honeypot field
- soft-throttle ฝั่ง client (localStorage)
- dev ลบสแปมได้จากหน้า /dev
- *(อนาคตถ้าโดนหนัก: เสริม Vercel BotID — ไม่ทำตอนนี้)*
- หมายเหตุข้อจำกัด: ไม่มี rate-limit แบบ IP (ตั้งใจ ไม่เก็บ IP) → log ว่าตัดสินใจนี้ไว้

## 7. ENV (ผู้ใช้ตั้งใน Vercel + .env.local — โค้ดพร้อมเสียบ)

| ตัวแปร | ที่ใช้ | หมายเหตุ |
|---|---|---|
| `BLOB_READ_WRITE_TOKEN` | server | อัตโนมัติเมื่อต่อ Vercel Blob store |
| `DEV_REPORTS_TOKEN` | server | รหัสลับ dev เปิด /dev (ความยาวพอเหมาะ) |
| `NEXT_PUBLIC_REPORTS_ENABLED` | client | `"1"` = โชว์ปุ่มแจ้ง; ไม่ตั้ง = ซ่อน |

## 8. ผลต่อ build/CSP/SEO

- `/api/report`, `/dev/reports` = dynamic (ƒ) — ที่เหลือยัง static (○)
- build ไม่ต้องใช้ BLOB token (route เป็น dynamic ไม่ถูกรันตอน build); ถ้า `NEXT_PUBLIC_REPORTS_ENABLED` ไม่ตั้งตอน build ปุ่มจะถูกซ่อน
- CSP เดิมพอ (`connect-src 'self'`); ไม่มี dangerouslySetInnerHTML ใหม่ (เรนเดอร์ข้อมูลเป็น text → React escape ให้)
- `/dev` noindex + robots disallow

## 9. แผนตรวจสอบ

- `tsc --noEmit` + `npm run lint` + `npm run build` เขียว
- เบราว์เซอร์ (prod, ตั้ง `NEXT_PUBLIC_REPORTS_ENABLED=1` + `DEV_REPORTS_TOKEN` ใน .env.local):
  - ฟอร์มเปิด/ปิด, validate, a11y (โฟกัส/Esc/radiogroup)
  - /dev/reports: ไม่มี cookie → ฟอร์ม token; token ผิด → ปฏิเสธ; token ถูก → เข้าได้; logout ได้
  - /dev ตอบ noindex; ไม่อยู่ใน sitemap
- **ข้อจำกัดการทดสอบ**: การเขียน/อ่าน Blob จริงต้องมี `BLOB_READ_WRITE_TOKEN` (Vercel Blob store ของผู้ใช้) — ในเครื่องที่ไม่มี token จะตรวจ path 503 + UI + dev-gate ได้ แต่ persistence จริงต้องผู้ใช้ทดสอบบน Vercel/หลังต่อ Blob

## 10. สิ่งที่ผู้ใช้ต้องทำเอง (เพราะ dev/code ทำให้ไม่ได้)

1. Vercel → Storage → สร้าง Blob store + connect กับโปรเจกต์ (จะได้ `BLOB_READ_WRITE_TOKEN` อัตโนมัติ)
2. ตั้ง env `DEV_REPORTS_TOKEN` (production + ใส่ .env.local เพื่อทดสอบ)
3. ตั้ง `NEXT_PUBLIC_REPORTS_ENABLED=1` (เมื่อพร้อมเปิดปุ่ม)

## 11. นอกขอบเขต (YAGNI)

- ไม่ทำ rate-limit แบบ IP, ไม่ทำ BotID (ตอนนี้), ไม่ทำ export/แจ้งเตือนอีเมลถึง dev, ไม่ทำ pagination หน้า dev (ปริมาณน้อย), ไม่เก็บ analytics เพิ่ม
