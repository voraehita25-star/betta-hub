"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEV_COOKIE, devSessionValue, isDevAuthed, safeEqual } from "@/lib/dev-auth";
import { deleteReport } from "@/lib/reports";

export async function loginAction(formData: FormData): Promise<void> {
  const token = String(formData.get("token") ?? "");
  const expected = process.env.DEV_REPORTS_TOKEN ?? "";
  if (!expected || !safeEqual(token, expected)) {
    redirect("/dev/reports?e=1");
  }
  (await cookies()).set(DEV_COOKIE, devSessionValue(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/dev",
    maxAge: 60 * 60 * 24 * 7, // 7 วัน
  });
  redirect("/dev/reports");
}

export async function logoutAction(): Promise<void> {
  (await cookies()).set(DEV_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/dev",
    maxAge: 0,
  });
  redirect("/dev/reports");
}

export async function deleteAction(formData: FormData): Promise<void> {
  // เช็ก auth ซ้ำในแอ็กชันเสมอ (ไม่เชื่อหน้า)
  if (!(await isDevAuthed())) redirect("/dev/reports");
  const id = String(formData.get("id") ?? "");
  if (id) {
    try {
      await deleteReport(id);
    } catch {
      /* id ผิดรูปแบบ/ลบไม่ได้ → ข้าม */
    }
  }
  redirect("/dev/reports");
}
