"use client";

import { useState } from "react";

const VIDEO_ID = "qXPqlM4JAN8";
const THUMB_HQ = `https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`;
const THUMB_MAX = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`;
const EMBED_URL = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1`;

export function InstallationVideo() {
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState(THUMB_MAX);

  if (playing) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <iframe
          src={EMBED_URL}
          title="Installation overview video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label="Play installation overview video"
    >
      <img
        src={thumb}
        alt=""
        className="aspect-video w-full object-cover"
        onError={() => setThumb(THUMB_HQ)}
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg transition group-hover:scale-110 sm:h-20 sm:w-20">
          <svg className="ml-1 h-7 w-7 sm:h-8 sm:w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
