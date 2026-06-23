"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export type ProductImage = { src: string; alt: string; label?: string };

/**
 * แกลเลอรีสินค้าแบบ interactive — รูปหลัก + ทัมบ์เนลสลับดูได้ + คลิกรูปหลักเพื่อดูขนาดใหญ่ (lightbox)
 * crossfade/แอนิเมชันใช้ CSS ซึ่งถูกปิดอัตโนมัติเมื่อผู้ใช้ตั้ง prefers-reduced-motion (ดู globals.css)
 */
export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const single = images.length <= 1;
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  const next = () => setActive((i) => (i + 1) % images.length);
  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);

  // ตอนเปิด lightbox: ล็อกสกรอลล์พื้นหลัง, โฟกัสปุ่มปิด, รับคีย์ Esc/ลูกศร
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      else if (e.key === "ArrowRight" && !single) setActive((i) => (i + 1) % images.length);
      else if (e.key === "ArrowLeft" && !single) setActive((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, single, images.length]);

  function closeLightbox() {
    setOpen(false);
    openerRef.current?.focus();
  }

  return (
    <div className="w-full">
      {/* รูปหลัก — คลิกเพื่อดูขนาดใหญ่ */}
      <button
        type="button"
        ref={openerRef}
        onClick={() => setOpen(true)}
        aria-label="ดูรูปขนาดใหญ่"
        className="group/zoom relative block aspect-[3/4] w-full cursor-zoom-in overflow-hidden rounded-xl bg-white ring-1 ring-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-betta"
      >
        {images.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            fill
            sizes="128px"
            aria-hidden={i === active ? undefined : true}
            className={`object-contain p-1.5 transition-opacity duration-300 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* ไอคอนแว่นขยายบอกใบ้ว่ากดขยายได้ */}
        <span
          aria-hidden
          className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-foreground/70 text-background opacity-0 transition-opacity group-hover/zoom:opacity-100"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {/* ทัมบ์เนลสลับขนาด/สี */}
      {!single && (
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              aria-pressed={i === active}
              aria-label={`ดูรูปขนาด ${img.label ?? String(i + 1)}`}
              className="group flex flex-col items-center gap-1 rounded-md p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className={`relative block h-12 w-10 overflow-hidden rounded-md bg-white ring-1 transition-colors ${
                  i === active ? "ring-betta" : "ring-foreground/10 group-hover:ring-foreground/30"
                }`}
              >
                <Image src={img.src} alt="" fill sizes="40px" className="object-contain p-0.5" />
              </span>
              {img.label && (
                <span
                  className={`text-[0.6rem] leading-none transition-colors ${
                    i === active ? "font-medium text-betta" : "text-muted-foreground"
                  }`}
                >
                  {img.label}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox — IIFE เพื่อ narrow images[active] ครั้งเดียวให้ TS (noUncheckedIndexedAccess) */}
      {open && (() => {
        const current = images[active];
        if (!current) return null;
        return (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="รูปสินค้าขยาย"
            onClick={closeLightbox}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <div className="relative h-[80vh] w-[min(90vw,42rem)]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="(max-width: 768px) 90vw, 42rem"
                className="rounded-xl bg-white object-contain p-4"
              />

              {/* ปุ่มปิด */}
              <button
                ref={closeRef}
                type="button"
                onClick={closeLightbox}
                aria-label="ปิด"
                className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background shadow-lg ring-1 ring-black/10 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-betta"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>

              {/* ลูกศร + ป้ายสี เมื่อมีหลายรูป */}
              {!single && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="รูปก่อนหน้า"
                    className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/80 text-background transition-colors hover:bg-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-betta"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="รูปถัดไป"
                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/80 text-background transition-colors hover:bg-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-betta"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {current.label && (
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground/85 px-3 py-1 text-xs font-medium text-background">
                      {current.label} ({active + 1}/{images.length})
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
