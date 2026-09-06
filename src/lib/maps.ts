/**
 * Map & geocoding utilities using OpenStreetMap + Nominatim
 */

export interface GeoLocation {
  lat: number;
  lon: number;
  displayName: string;
}

export async function geocodeAddress(address: string): Promise<GeoLocation | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    const results = await response.json();
    if (results && results.length > 0) {
      return {
        lat: parseFloat(results[0].lat),
        lon: parseFloat(results[0].lon),
        displayName: results[0].display_name,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const result = await response.json();
    return result.display_name || null;
  } catch {
    return null;
  }
}
