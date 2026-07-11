export async function geocodeLocation(location: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location + ", Algérie")}&limit=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Souki/1.0 (contact@souki.dz)" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}
