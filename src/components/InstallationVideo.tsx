"use client";

import { useState } from "react";

type InstallationVideoProps = {
  videoId: string;
  title: string;
  /** Start playback at this offset (seconds). */
  startSeconds?: number;
};

export function InstallationVideo({
  videoId,
  title,
  startSeconds = 0,
}: InstallationVideoProps) {
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);

  const embedParams = new URLSearchParams({ autoplay: "1" });
  if (startSeconds > 0) {
    embedParams.set("start", String(startSeconds));
  }
  const embedUrl = `https://www.youtube.com/embed/${videoId}?${embedParams.toString()}`;

  return (
    <div className="min-w-0 flex-1">
      <h3 className="mb-3 text-center text-lg font-medium text-neutral-900">{title}</h3>
      {playing ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group relative block w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label={`Play ${title}`}
        >
          <img
            src={thumb}
            alt=""
            className="aspect-video w-full object-cover"
            onError={() => setThumb(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`)}
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg transition group-hover:scale-110 sm:h-20 sm:w-20">
              <svg className="ml-1 h-7 w-7 sm:h-8 sm:w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
