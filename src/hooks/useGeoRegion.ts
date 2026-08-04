"use client";

import { useEffect, useState } from "react";
import type { FacilityAssignment } from "@/data/state-facility-map";
import type { GeoRegionResult } from "@/lib/state-facility";

type UseGeoRegionResult = {
  region: FacilityAssignment;
  state: string | null;
  source: string | null;
  ready: boolean;
};

const DEFAULT_REGION: FacilityAssignment = "east";

export function useGeoRegion(): UseGeoRegionResult {
  const [region, setRegion] = useState<FacilityAssignment>(DEFAULT_REGION);
  const [state, setState] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch("/api/geo-region");
        if (!response.ok) return;
        const data = (await response.json()) as GeoRegionResult;
        if (cancelled) return;
        if (data.region === "east" || data.region === "west" || data.region === "shared") {
          setRegion(data.region);
          setState(data.state);
          setSource(data.source);
        }
      } catch {
        // Keep east default.
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { region, state, source, ready };
}
