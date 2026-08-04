import { NextRequest, NextResponse } from "next/server";
import { facilityRegionFromState, type GeoRegionResult } from "@/lib/state-facility";

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip");
}

function regionFromHeaders(request: NextRequest): GeoRegionResult | null {
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry");

  const stateCode = request.headers.get("x-vercel-ip-country-region");

  if (country && country !== "US" && country !== "USA") {
    return { region: "east", state: stateCode, source: "non-us-default" };
  }

  const facility = facilityRegionFromState(stateCode);
  if (!facility) return null;

  return {
    region: facility,
    state: stateCode,
    source: "edge-headers",
  };
}

async function regionFromIpLookup(ip: string): Promise<GeoRegionResult | null> {
  try {
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;

    const data = (await response.json()) as {
      success?: boolean;
      region?: string;
      region_code?: string;
      country_code?: string;
    };

    if (data.success === false) return null;

    if (data.country_code && data.country_code !== "US") {
      return {
        region: "east",
        state: data.region_code ?? data.region ?? null,
        source: "ipwho-non-us",
      };
    }

    const facility =
      facilityRegionFromState(data.region_code) ?? facilityRegionFromState(data.region);
    if (!facility) return null;

    return {
      region: facility,
      state: data.region_code ?? data.region ?? null,
      source: "ipwho",
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const fromHeaders = regionFromHeaders(request);
  if (fromHeaders) {
    return NextResponse.json(fromHeaders);
  }

  const ip = getClientIp(request);
  if (ip && ip !== "127.0.0.1" && ip !== "::1") {
    const fromIp = await regionFromIpLookup(ip);
    if (fromIp) {
      return NextResponse.json(fromIp);
    }
  }

  const fallback: GeoRegionResult = {
    region: "east",
    state: null,
    source: "default",
  };
  return NextResponse.json(fallback);
}
