"use client";

import { getDummyDealers, zipToCoords } from "@/lib/dealers";
import { useCallback, useMemo, useState } from "react";
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

function MapCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export function DealerMap() {
  const dealers = useMemo(() => getDummyDealers(), []);
  const [zip, setZip] = useState("");
  const [radiusMi, setRadiusMi] = useState(50);
  const [center, setCenter] = useState<[number, number]>([39.5, -98.35]);

  const filtered = useMemo(() => {
    if (!zip.trim()) return dealers;
    const coords = zipToCoords(zip);
    if (!coords) return dealers;
    return dealers.filter(
      (d) => distanceMi(coords.lat, coords.lng, d.lat, d.lng) <= radiusMi
    );
  }, [dealers, zip, radiusMi]);

  const handleZipSearch = useCallback(() => {
    const coords = zip ? zipToCoords(zip) : null;
    if (coords) setCenter([coords.lat, coords.lng]);
    else setCenter([39.5, -98.35]);
  }, [zip]);

  return (
    <section id="dealers" className="scroll-mt-20 border-t border-neutral-200 bg-white pt-5 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="font-sans text-3xl font-medium tracking-tight text-neutral-900 text-center">
          Find a dealer
        </h2>
        <p className="mt-2 text-neutral-600 text-center">
          Search by zip code and radius to find dealers near you.
        </p>
        <div className="mt-6 flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700">Zip code</label>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              placeholder="e.g. 27292"
              className="mt-1 w-32 rounded border border-neutral-300 bg-white px-3 py-2 text-neutral-800 placeholder-neutral-400 focus:border-[#9f1b20] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Mile radius</label>
            <select
              value={radiusMi}
              onChange={(e) => setRadiusMi(Number(e.target.value))}
              className="mt-1 rounded border border-neutral-300 bg-white px-3 py-2 text-neutral-800 focus:border-[#9f1b20] focus:outline-none"
            >
              {MILE_OPTIONS.map((m) => (
                <option key={m} value={m}>{m} miles</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleZipSearch}
            className="rounded-full bg-[#9f1b20] px-4 py-2 text-sm font-medium text-white hover:bg-[#8a171b]"
          >
            Search
          </button>
        </div>
        <p className="mt-2 text-sm text-neutral-600">
          Showing {filtered.length} dealer{filtered.length !== 1 ? "s" : ""} within {radiusMi} miles.
        </p>
        <div className="mt-6 h-[480px] w-full overflow-hidden rounded-lg border border-neutral-200 shadow-sm">
          <MapContainer
            center={center}
            zoom={4}
            className="h-full w-full"
            scrollWheelZoom
          >
            <MapCenter center={center} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map((d) => (
              <Marker key={d.id} position={[d.lat, d.lng]} icon={icon}>
                <Popup>
                  <strong>{d.name}</strong>
                  <br />
                  {d.address}, {d.city}, {d.state} {d.zip}
                  <br />
                  {d.phone}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
