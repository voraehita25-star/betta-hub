/**
 * Render structured data เป็น <script type="application/ld+json"> ตามคำแนะนำ Next 16
 * (node_modules/next/dist/docs/01-app/02-guides/json-ld.md)
 * escape `<` เป็น < กัน XSS จาก JSON.stringify เป็น Server Component (ไม่มี 'use client')
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
