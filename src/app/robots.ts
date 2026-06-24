import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // ให้เฉพาะ production จริงถูก index — preview/branch deploy (และ build ในเครื่อง) ห้าม index
  // กัน preview URL หลุดเป็น duplicate content แข่งกับโดเมนจริง (อ่านตอน build จึงยัง static cache ได้)
  if (process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/dev/", // หน้าเครื่องมือ dev — ไม่ให้ index (คู่กับ noindex ในหน้า)
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
