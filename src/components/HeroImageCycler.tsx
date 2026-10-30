"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { HOME_PAGE_HERO_IMAGES } from "@/data/home-page-images";

const ROTATE_MS = 3500;
const FADE_MS = 1200;

export function HeroImageCycler() {
  const images = HOME_PAGE_HERO_IMAGES;
  const [index, setIndex] = useState(0);
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null);
  const indexRef = useRef(0);
  indexRef.current = index;

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => {
      const current = indexRef.current;
      setLeavingIndex(current);
      setIndex((i) => (i + 1) % images.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [images.length]);

  useEffect(() => {
    if (leavingIndex === null) return;
    const t = setTimeout(() => setLeavingIndex(null), FADE_MS);
    return () => clearTimeout(t);
  }, [leavingIndex]);

  if (images.length === 0) {
    return <div className="absolute inset-0 z-[1] bg-neutral-200" aria-hidden />;
  }

  return (
    <div className="absolute inset-0 z-[1]">
      {images.map((src, i) => {
        const isActive = i === index;
        const isLeaving = i === leavingIndex;
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
              quality={90}
              priority={i === 0}
              loading={i === 0 ? undefined : "eager"}
              fetchPriority={i === 0 ? "high" : "low"}
            />
          </div>
        );
      })}
    </div>
  );
}
