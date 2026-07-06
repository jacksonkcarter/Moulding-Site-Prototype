"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const HERO_IMAGES = [
  "/design-style/Modern-Farmhouse.png",
  "/design-style/Colonial.png",
  "/design-style/Mid-Century-Modern.jpg",
];

const ROTATE_MS = 5000;
const FADE_MS = 1200;

export function HeroImageCycler() {
  const [index, setIndex] = useState(0);
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null);
  const indexRef = useRef(0);
  indexRef.current = index;

  useEffect(() => {
    const id = setInterval(() => {
      const current = indexRef.current;
      setLeavingIndex(current);
      setIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (leavingIndex === null) return;
    const t = setTimeout(() => setLeavingIndex(null), FADE_MS);
    return () => clearTimeout(t);
  }, [leavingIndex]);

  return (
    <div className="absolute inset-0 z-[1]">
      {HERO_IMAGES.map((src, i) => {
        const isActive = i === index;
        const isLeaving = i === leavingIndex;
        // Incoming slide sits underneath at opacity 1; leaving slide on top fades out (smooth crossfade, no blank on wrap)
        return (
          <div
            key={src}
            className={`absolute inset-0 ${isLeaving ? "transition-opacity duration-[1200ms] ease-in-out" : ""}`}
            style={{
              opacity: isActive ? 1 : isLeaving ? 0 : 0,
              zIndex: isLeaving ? 2 : isActive ? 1 : 0,
              pointerEvents: "none",
            }}
            aria-hidden
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        );
      })}
    </div>
  );
}
