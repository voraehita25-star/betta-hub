"use client";

import { useRef, useMemo, useState, useEffect, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion, useMediaQuery } from "@/hooks/use-reduced-motion";

type Mouse = RefObject<{ x: number; y: number }>;

const TEAL = ["#2dd4cf", "#5eead4", "#22b8b0"];
const CORAL = ["#ff8a5c", "#ff6b4a", "#ff9d6e"];

function Bubble({
  position,
  scale,
  color,
  speed,
  segments,
  glass,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
  segments: number;
  /** เปิด transmission (กระจกใส) เฉพาะเดสก์ท็อป — บนมือถือปิดเพื่อตัด render pass พิเศษทุกเฟรม */
  glass: boolean;
}) {
  return (
    <Float speed={speed * 2} rotationIntensity={1} floatIntensity={1.1}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, segments, segments]} />
        <meshPhysicalMaterial
          color={color}
          transmission={glass ? 0.92 : 0}
          thickness={glass ? 1.1 : 0}
          roughness={0.08}
          metalness={0}
          ior={1.4}
          clearcoat={1}
          clearcoatRoughness={0.08}
          attenuationColor={color}
          attenuationDistance={1.4}
          emissive={color}
          emissiveIntensity={0.12}
          transparent
          opacity={0.92}
        />
      </mesh>
    </Float>
  );
}

function Scene({
  mouse,
  reduced,
  count,
  segments,
  glass,
}: {
  mouse: Mouse;
  reduced: boolean;
  count: number;
  segments: number;
  glass: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  // วางฟองฝั่งขวา/บน/ล่าง ไม่ให้บังหัวข้อทางซ้าย
  const bubbles = useMemo(() => {
    const base: [number, number, number, number, "t" | "c"][] = [
      [4.2, 1.6, 0.2, 0.46, "t"],
      [3.5, -0.3, 0.5, 0.5, "c"],
      [2.8, 1.4, 0.7, 0.4, "t"],
      [3.2, -1.9, 0.3, 0.38, "t"],
      [2.4, -0.7, 1.0, 0.32, "c"],
      [1.9, 2.4, 0.5, 0.3, "c"],
      [-1.0, 2.6, 0.3, 0.24, "t"],
      [0.4, -2.9, 0.8, 0.3, "t"],
      [4.6, -1.6, -0.2, 0.4, "c"],
    ];
    return base.slice(0, count).map(([x, y, z, s, c], i) => {
      const palette = c === "t" ? TEAL : CORAL;
      // palette มี 3 สีคงที่ และ i%3 ∈ {0,1,2} → ไม่มีทาง undefined (narrowing ไม่ผ่าน TS)
      const color = palette[i % 3] ?? palette[0]!;
      return {
        pos: [x, y, z] as [number, number, number],
        scale: s,
        color,
        speed: 0.45 + (i % 4) * 0.16,
      };
    });
  }, [count]);

  useFrame(() => {
    if (reduced || !group.current) return;
    const m = mouse.current;
    // พารัลแลกซ์ตามเมาส์เบาๆ (ไม่หมุนทั้งกลุ่ม ฟองจะอยู่โซนเดิม)
    group.current.rotation.y += (m.x * 0.12 - group.current.rotation.y) * 0.06;
    group.current.rotation.x += (-m.y * 0.08 - group.current.rotation.x) * 0.06;
    group.current.position.x += (m.x * 0.25 - group.current.position.x) * 0.06;
  });

  return (
    <group ref={group}>
      {bubbles.map((b, i) => (
        <Bubble
          key={i}
          position={b.pos}
          scale={b.scale}
          color={b.color}
          speed={b.speed}
          segments={segments}
          glass={glass}
        />
      ))}
    </group>
  );
}

// default export เพื่อให้ dynamic(() => import('./hero-canvas')) หยิบไปได้ตรงๆ
export default function HeroCanvas() {
  const mouse = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");

  // หยุดเรนเดอร์เมื่อ hero เลื่อนพ้นจอ (ประหยัด GPU/แบต โดยไม่กระทบภาพที่มองเห็น)
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry && setVisible(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // parallax ไม่ถูกใช้เลยเมื่อ reduced-motion (useFrame early-return) หรือ hero พ้นจอ (frameloop "never")
  // → ไม่ผูก listener ความถี่สูงในสองสถานะนั้น (ประหยัด main-thread; reduced/visible เป็น reactive จึงผูก/ถอดเองตามสถานะ)
  useEffect(() => {
    if (reduced || !visible) return;
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, visible]);

  // ปรับคุณภาพตามอุปกรณ์: มือถือเบาลง (ลด segments/จำนวนฟอง/dpr) เดสก์ท็อปคงความสวย
  const segments = isMobile ? 24 : 32;
  const count = isMobile ? 6 : 9;
  const dpr: [number, number] = isMobile ? [1, 1.5] : [1, 2];

  // reduced-motion → เรนเดอร์ครั้งเดียวแบบนิ่ง, นอกจอ → หยุด, ปกติ → เล่นต่อเนื่อง
  const frameloop = reduced ? "demand" : visible ? "always" : "never";

  return (
    <div ref={containerRef} className="h-full w-full">
      <Canvas
        frameloop={frameloop}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={dpr}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[6, 5, 5]} intensity={2.6} color="#ff8a5c" />
        <pointLight position={[-6, -3, 4]} intensity={2.6} color="#43d6d0" />
        <pointLight position={[2, 3, 6]} intensity={2.4} color="#ffffff" />
        {/* สร้าง environment สำหรับแสงสะท้อนบนผิวแก้วในเครื่อง (ไม่ดึงไฟล์ HDR จาก CDN) */}
        <Environment resolution={64}>
          <Lightformer
            intensity={2.4}
            color="#ff8a5c"
            position={[5, 3, 5]}
            scale={[8, 8, 1]}
          />
          <Lightformer
            intensity={2.4}
            color="#43d6d0"
            position={[-5, -2, 4]}
            scale={[8, 8, 1]}
          />
          <Lightformer
            intensity={3}
            color="#ffffff"
            position={[0, 5, -4]}
            scale={[10, 6, 1]}
          />
        </Environment>
        <Scene mouse={mouse} reduced={reduced} count={count} segments={segments} glass={!isMobile} />
      </Canvas>
    </div>
  );
}
