"use client";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface Tilt3DCardProps {
  children: ReactNode;
  className?: string;
  /** Degrees of max tilt (default 14) */
  intensity?: number;
  /** Show moving radial glow under cursor */
  glow?: boolean;
}

export function Tilt3DCard({
  children,
  className,
  intensity = 14,
  glow = true,
}: Tilt3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rx = ((y - height / 2) / (height / 2)) * -intensity;
    const ry = ((x - width / 2) / (width / 2)) * intensity;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;

    if (glow && glowRef.current) {
      const px = (x / width) * 100;
      const py = (y / height) * 100;
      glowRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(45,127,249,0.13) 0%, transparent 68%)`;
      glowRef.current.style.opacity = "1";
    }
  }

  function onLeave() {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    if (glowRef.current) glowRef.current.style.opacity = "0";
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("relative transition-transform duration-200 ease-out", className)}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {glow && (
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300"
        />
      )}
      {children}
    </div>
  );
}
