/** โลโก้ปลากัด (SVG) — ไม่มี hook ใช้ได้ทั้ง Server/Client Component (เช่นหน้า 404) */
export function FishMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden="true" fill="none">
      <path
        d="M30 16c0-7-6.5-12.5-15-12.5C9 3.5 3.5 7 1 16c2.5 9 8 12.5 14 12.5C23.5 28.5 30 23 30 16Z"
        fill="currentColor"
      />
      <path
        d="M30 16c4 1 9-3 16-9-2.5 9-2.5 9 0 18-7-6-12-8-16-9Z"
        fill="currentColor"
        opacity="0.55"
      />
      <circle cx="9" cy="13" r="1.6" fill="var(--paper)" />
    </svg>
  );
}
