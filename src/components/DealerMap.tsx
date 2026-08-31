"use client";

import { getDealers, zipToCoords } from "@/lib/dealers";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon in Next/SSR
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MILE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_CENTER: [number, number] = [39.5, -98.35];
const MAP_SHRINK_MS = 700;

function distanceMi(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth radius miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function MapCenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function MapInvalidate({ trigger }: { trigger: string }) {
  const map = useMap();
  useEffect(() => {
    const times = [0, 100, 250, 400, 550, 700, 800];
    const ids = times.map((ms) => window.setTimeout(() => map.invalidateSize(), ms));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [map, trigger]);
  return null;
}

export function DealerMap() {
  const dealers = useMemo(() => getDealers(), []);
  const [zip, setZip] = useState("");
  const [radiusMi, setRadiusMi] = useState(25);
  const [searchedZip, setSearchedZip] = useState("");
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(4);
  const [zipError, setZipError] = useState<string | null>(null);
  const [resultsVisible, setResultsVisible] = useState(false);

  const filtered = useMemo(() => {
    if (!searchedZip) return [];
    const coords = zipToCoords(searchedZip);
    if (!coords) return [];
    return dealers
      .map((d) => ({
        dealer: d,
        distance: distanceMi(coords.lat, coords.lng, d.lat, d.lng),
      }))
      .filter((entry) => entry.distance <= radiusMi)
      .sort((a, b) => a.distance - b.distance)
      .map((entry) => entry.dealer);
  }, [dealers, searchedZip, radiusMi]);

  const handleZipSearch = useCallback(() => {
    const cleaned = zip.replace(/\D/g, "").slice(0, 5);
    if (cleaned.length !== 5) {
      setZipError("Enter a valid 5-digit zip code.");
      setSearchedZip("");
      setCenter(DEFAULT_CENTER);
      setZoom(4);
      return;
    }
    const coords = zipToCoords(cleaned);
    if (!coords) {
      setZipError("Zip code not found. Try another nearby zip.");
      setSearchedZip("");
      setCenter(DEFAULT_CENTER);
      setZoom(4);
      return;
    }
    setZipError(null);
    setSearchedZip(cleaned);
    setCenter([coords.lat, coords.lng]);
    setZoom(radiusMi <= 25 ? 10 : radiusMi <= 50 ? 9 : 8);
  }, [zip, radiusMi]);

  const showResults = Boolean(searchedZip);

  useEffect(() => {
    if (!searchedZip) {
      setResultsVisible(false);
      return;
    }
    if (typeof window !== "undefined" && !window.matchMedia("(min-width: 1024px)").matches) {
      setResultsVisible(true);
      return;
    }
    if (resultsVisible) return;
    const fallback = window.setTimeout(() => setResultsVisible(true), MAP_SHRINK_MS);
    return () => window.clearTimeout(fallback);
  }, [searchedZip, resultsVisible]);

  return (
    <div id="dealers" className="scroll-mt-20 min-w-0 lg:col-span-2">
      <div
        className={`grid grid-cols-1 items-stretch transition-[grid-template-columns,gap] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showResults
            ? "gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
            : "gap-8 lg:gap-0 lg:grid-cols-[minmax(0,1fr)_0fr]"
        }`}
        onTransitionEnd={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.propertyName !== "grid-template-columns") return;
          if (searchedZip) setResultsVisible(true);
        }}
      >
        <div className="min-w-0">
          <p className="text-neutral-600">
            Search by zip code and radius to find dealers near you.
          </p>
          <form
            className="mt-3 flex flex-wrap items-end gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleZipSearch();
            }}
          >
            <div>
              <label className="block text-sm font-medium text-neutral-700">Zip code</label>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                placeholder="e.g. 27292"
                inputMode="numeric"
                className="mt-1 w-32 rounded border border-neutral-300 bg-white px-3 py-2 text-neutral-800 placeholder-neutral-400 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Mile radius</label>
              <select
                value={radiusMi}
                onChange={(e) => setRadiusMi(Number(e.target.value))}
                className="mt-1 rounded border border-neutral-300 bg-white px-3 py-2 text-neutral-800 focus:border-primary focus:outline-none"
              >
                {MILE_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m} miles
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
            >
              Search
            </button>
          </form>
          {zipError ? <p className="mt-2 text-sm text-red-700">{zipError}</p> : null}

          <div className="relative z-0 isolate mt-4 h-[min(560px,70vh)] min-w-0 overflow-hidden rounded-lg border border-neutral-200 shadow-sm">
            <MapContainer center={center} zoom={zoom} className="h-full w-full" scrollWheelZoom>
              <MapCenter center={center} zoom={zoom} />
              <MapInvalidate trigger={showResults ? searchedZip : "full"} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filtered.map((d) => (
                <Marker key={d.id} position={[d.lat, d.lng]} icon={icon}>
                  <Popup>
                    <strong>{d.name}</strong>
                    <br />
                    {d.address}
                    {d.address ? <br /> : null}
                    {d.city}, {d.state} {d.zip}
                    {d.phone ? (
                      <>
                        <br />
                        {d.phone}
                      </>
                    ) : null}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div
          className={`flex min-h-0 min-w-0 flex-col overflow-hidden lg:h-0 lg:min-h-full ${
            showResults ? "flex" : "hidden lg:flex lg:pointer-events-none lg:opacity-0"
          }`}
        >
          {resultsVisible ? (
            <>
              <p className="shrink-0 text-sm text-neutral-600">
                Showing {filtered.length} dealer{filtered.length !== 1 ? "s" : ""} within {radiusMi} miles of{" "}
                {searchedZip}.
              </p>
              {filtered.length > 0 ? (
                <ul className="mt-3 min-h-0 flex-1 divide-y divide-neutral-200 overflow-y-auto border-t border-neutral-200 pr-3 max-h-[min(560px,70vh)] lg:max-h-none">
                  {filtered.map((d) => (
                    <li
                      key={d.id}
                      className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                    >
                      <div>
                        <p className="font-medium text-neutral-900">{d.name}</p>
                        <p className="text-sm text-neutral-600">
                          {[d.address, `${d.city}, ${d.state} ${d.zip}`].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      {d.phone ? (
                        <a
                          href={`tel:${d.phone.replace(/\D/g, "")}`}
                          className="shrink-0 text-sm font-medium text-primary hover:underline"
                        >
                          {d.phone}
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-neutral-600">No dealers found in this radius.</p>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
