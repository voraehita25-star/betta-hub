import Link from "next/link";

/** breadcrumb มาตรฐาน "หน้าแรก / <current>" — ใช้ร่วมในหน้า article, เครื่องมือ และ privacy */
export function Breadcrumb({ current }: { current: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link href="/" className="hover:text-betta">
        หน้าแรก
      </Link>
      <span aria-hidden>/</span>
      <span className="text-foreground/70">{current}</span>
    </div>
  );
}
