import Image from "next/image";

type TileImageProps = {
  src?: string | null;
  alt: string;
  /** Equal tile frame; default 1:1. */
  aspectClassName?: string;
  className?: string;
  sizes?: string;
  unoptimized?: boolean;
  /** Shown when src is missing. */
  emptyLabel?: string;
};

/**
 * Standard image frame for tiles: fixed aspect box, white background, object-contain.
 * Use this whenever an image sits inside a browse/product tile.
 */
export function TileImage({
  src,
  alt,
  aspectClassName = "aspect-square",
  className = "",
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12.5vw",
  unoptimized = false,
  emptyLabel = "No preview",
}: TileImageProps) {
  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden bg-white ${aspectClassName} ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain p-2"
          sizes={sizes}
          unoptimized={unoptimized}
        />
      ) : (
        <span className="px-2 text-center text-xs text-neutral-400">{emptyLabel}</span>
      )}
    </div>
  );
}
