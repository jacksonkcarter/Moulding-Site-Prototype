"use client";

import Image from "next/image";
import { useState } from "react";

type OptionalImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fallbackClassName?: string;
};

export function OptionalImage({
  src,
  alt,
  fill = true,
  className = "object-cover",
  sizes,
  priority,
  fallbackClassName = "absolute inset-0 bg-neutral-100",
}: OptionalImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return <div className={fallbackClassName} aria-hidden />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setError(true)}
    />
  );
}
