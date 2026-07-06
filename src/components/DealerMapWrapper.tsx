"use client";

import dynamic from "next/dynamic";

const DealerMap = dynamic(
  () => import("./DealerMap").then((m) => ({ default: m.DealerMap })),
  { ssr: false }
);

export function DealerMapWrapper() {
  return <DealerMap />;
}
