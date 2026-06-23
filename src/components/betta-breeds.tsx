import type { ReactNode } from "react";
import Image from "next/image";

export type BreedType =
  | "veiltail"
  | "halfmoon"
  | "crowntail"
  | "doubletail"
  | "plakat"
  | "dumbo";

/** ปลากัดส่วนลำตัว + ตา (วาดทับครีบ) ใช้ร่วมทุกสายพันธุ์ */
function Body() {
  return (
    <>
      <ellipse cx="74" cy="70" rx="48" ry="22" fill="currentColor" />
      <circle cx="44" cy="64" r="3.6" fill="var(--background)" />
    </>
  );
}

/**
 * ภาพประกอบสายพันธุ์ปลากัด (วาดเอง) — เน้นรูปทรงครีบ/หางที่เป็นเอกลักษณ์ของแต่ละแบบ
 * หัวอยู่ซ้าย หางอยู่ขวา; ครีบวาดก่อนแล้วลำตัวทับด้านบน
 */
export function BettaShape({
  type,
  className = "",
}: {
  type: BreedType;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 140"
      className={className}
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {type === "veiltail" && (
        <g fill="currentColor" opacity="0.8">
          <path d="M116 64 Q176 72 178 128 Q150 104 114 84 Z" />
          <path d="M70 52 Q88 28 104 50 Q88 53 70 55 Z" />
          <path d="M58 88 Q92 132 128 96 Q90 92 58 84 Z" />
        </g>
      )}

      {type === "halfmoon" && (
        <g fill="currentColor" opacity="0.8">
          <path d="M118 70 L118 26 A50 50 0 0 1 118 114 Z" />
          <path d="M64 50 Q86 16 110 48 Q88 53 64 55 Z" />
          <path d="M56 88 Q86 126 118 90 Q88 92 56 84 Z" />
        </g>
      )}

      {type === "crowntail" && (
        <g>
          <path
            d="M118 70 L118 44 A30 30 0 0 1 118 96 Z"
            fill="currentColor"
            opacity="0.8"
          />
          <g
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="round"
            opacity="0.9"
          >
            <line x1="116" y1="68" x2="150" y2="32" />
            <line x1="118" y1="64" x2="164" y2="46" />
            <line x1="120" y1="70" x2="172" y2="70" />
            <line x1="118" y1="76" x2="164" y2="94" />
            <line x1="116" y1="72" x2="150" y2="108" />
          </g>
          <path
            d="M70 52 Q86 30 102 50 Q86 53 70 55 Z"
            fill="currentColor"
            opacity="0.8"
          />
          <path
            d="M64 88 Q88 118 110 92 Q88 92 64 84 Z"
            fill="currentColor"
            opacity="0.8"
          />
        </g>
      )}

      {type === "doubletail" && (
        <g fill="currentColor" opacity="0.8">
          <path d="M116 70 Q150 48 174 42 Q158 64 120 72 Z" />
          <path d="M116 70 Q150 92 174 98 Q158 76 120 68 Z" />
          <path d="M60 50 Q86 12 114 46 Q88 52 60 56 Z" />
          <path d="M58 88 Q88 124 118 92 Q88 92 58 84 Z" />
        </g>
      )}

      {type === "plakat" && (
        <g fill="currentColor" opacity="0.85">
          <path d="M118 70 L118 54 A18 18 0 0 1 118 86 Z" />
          <path d="M78 55 Q90 42 104 55 Z" />
          <path d="M76 85 Q90 100 106 86 Z" />
        </g>
      )}

      {type === "dumbo" && (
        <g fill="currentColor">
          <path
            d="M118 70 L118 48 A24 24 0 0 1 118 92 Z"
            opacity="0.8"
          />
          <path d="M70 52 Q88 30 106 50 Q88 53 70 55 Z" opacity="0.8" />
          <path d="M64 88 Q90 116 114 92 Q88 92 64 84 Z" opacity="0.8" />
          {/* ครีบอกใหญ่คล้ายหูช้าง */}
          <ellipse cx="68" cy="98" rx="30" ry="17" opacity="0.5" />
        </g>
      )}

      <Body />
    </svg>
  );
}

/** การ์ดสายพันธุ์: ภาพประกอบ + ชื่อ + ระดับความเหมาะกับมือใหม่ + คำอธิบาย */
export function Breed({
  type,
  thai,
  eng,
  level,
  image,
  imageAlt,
  children,
}: {
  type: BreedType;
  thai: string;
  eng: string;
  level?: string;
  /** รูปถ่ายจริงของสายพันธุ์ (ถ้ามี) — ถ้าไม่ส่งจะใช้ภาพวาดประกอบแทน */
  image?: string;
  imageAlt?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-5 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[180px_1fr] sm:p-6">
      {image ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-foreground/10">
          <Image
            src={image}
            alt={imageAlt ?? `${thai} (${eng})`}
            fill
            sizes="(max-width: 640px) 90vw, 180px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="relative flex aspect-[4/3] items-center justify-center rounded-xl bg-background/50 p-3 ring-1 ring-foreground/10">
          <BettaShape type={type} className="h-24 w-full text-betta" />
          <span className="absolute bottom-1.5 right-2 text-[0.62rem] text-muted-foreground">
            ภาพประกอบ
          </span>
        </div>
      )}
      <div>
        <h3 className="font-heading text-xl font-semibold">
          {thai}{" "}
          <span className="text-base font-normal text-muted-foreground">({eng})</span>
        </h3>
        {level && (
          <span className="mt-1.5 inline-block rounded-full bg-betta/15 px-2.5 py-0.5 text-xs font-medium text-betta">
            {level}
          </span>
        )}
        <div className="mt-2.5 space-y-2 text-sm leading-relaxed text-foreground/85">
          {children}
        </div>
      </div>
    </div>
  );
}
