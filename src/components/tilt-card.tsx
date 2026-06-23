"use client";

import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function TiltCard({
  children,
  className = "",
  intensity = 9,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${px * intensity}deg) rotateX(${-py * intensity}deg) scale(1.025)`;
    el.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
    el.style.setProperty("--glow", "0.9");
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)";
    el.style.setProperty("--glow", "0");
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`tilt-3d group/tilt relative transition-transform duration-300 ease-out will-change-transform ${className}`}
    >
      {children}
      <span
        aria-hidden
        className="tilt-glow pointer-events-none absolute inset-0 z-20 rounded-[inherit] mix-blend-soft-light"
      />
    </div>
  );
}
