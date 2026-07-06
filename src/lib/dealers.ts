// 100 dummy dealer locations (US approximate)
export type Dealer = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
};

function randomIn(min: number, max: number) {
  return min + Math.random() * (max - min);
}

const states = [
  "NC", "SC", "VA", "GA", "FL", "TX", "CA", "UT", "CO", "AZ",
  "TN", "AL", "MS", "LA", "AR", "OK", "OH", "IN", "KY", "PA",
  "NY", "NJ", "CT", "MA", "MD", "WA", "OR", "NV", "NM", "IL",
];

export function getDummyDealers(): Dealer[] {
  const dealers: Dealer[] = [];
  const used = new Set<string>();
  for (let i = 0; i < 100; i++) {
    const lat = randomIn(25, 48);
    const lng = randomIn(-122, -75);
    const state = states[i % states.length];
    const zip = String(27000 + Math.floor(Math.random() * 50000)).slice(0, 5);
    const id = `D${i + 1}`;
    if (used.has(id)) continue;
    used.add(id);
    dealers.push({
      id,
      name: `Dealer ${i + 1}`,
      lat,
      lng,
      address: `${100 + (i % 900)} Main St`,
      city: `City ${i + 1}`,
      state,
      zip,
      phone: `(555) ${100 + (i % 900)}-${1000 + (i % 9000)}`,
    });
  }
  return dealers;
}

// Approximate US zip to lat/lng (sample - in production use geocoding API)
const ZIP_SAMPLES: Record<string, { lat: number; lng: number }> = {
  "27292": { lat: 35.82, lng: -80.25 },
  "84601": { lat: 40.23, lng: -111.66 },
  "90210": { lat: 34.09, lng: -118.41 },
  "10001": { lat: 40.75, lng: -73.99 },
  "60601": { lat: 41.89, lng: -87.62 },
  "75201": { lat: 32.78, lng: -96.8 },
  "32801": { lat: 28.54, lng: -81.38 },
  "30301": { lat: 33.75, lng: -84.39 },
};

export function zipToCoords(zip: string): { lat: number; lng: number } | null {
  const cleaned = zip.replace(/\D/g, "").slice(0, 5);
  if (ZIP_SAMPLES[cleaned]) return ZIP_SAMPLES[cleaned];
  // Fallback: use first 2 digits for rough region
  const prefix = parseInt(cleaned.slice(0, 2), 10);
  if (Number.isNaN(prefix) || prefix < 1) return null;
  const lat = 25 + (prefix / 100) * 25;
  const lng = -122 + (prefix / 100) * 47;
  return { lat, lng };
}
