"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Marker = {
  id: string;
  title: string;
  location: string;
  date: string;
  status: string;
  organizer: string;
  vehiclesCount: number;
  registrationsCount: number;
  spots: number;
  lat: number;
  lng: number;
};

export default function SoukMapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [loading, setLoading] = useState(true);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const leaflet = await import("leaflet");
      setL(() => leaflet);
    })();
  }, []);

  useEffect(() => {
    fetch("/api/souks/map")
      .then((r) => r.json())
      .then((data) => {
        setMarkers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!L || !mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [28.0339, 1.6596],
      zoom: 5,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [L]);

  useEffect(() => {
    if (!L || !mapInstanceRef.current || !markersLayerRef.current || markers.length === 0) return;

    markersLayerRef.current.clearLayers();

    markers.forEach((m) => {
      const color = m.status === "active" ? "#22c55e" : m.status === "completed" ? "#a1a1aa" : "#f59e0b";
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:14px;height:14px;background:${color};border:2px solid #18181b;border-radius:50%;box-shadow:0 0 8px ${color}40;"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([m.lat, m.lng], { icon }).addTo(markersLayerRef.current);
      marker.bindPopup(`
        <div style="font-family:sans-serif;font-size:13px;min-width:180px;">
          <strong style="font-size:14px;">${m.title}</strong><br/>
          <span style="color:#666;">${m.location}</span><br/>
          <span style="color:#666;">${new Date(m.date).toLocaleDateString("fr-FR")}</span><br/>
          <span>${m.vehiclesCount} véhicules · ${m.registrationsCount}/${m.spots} inscrits</span><br/>
          <span style="display:inline-block;margin-top:4px;padding:1px 6px;border-radius:4px;font-size:11px;background:${
            m.status === "active" ? "#22c55e20" : m.status === "completed" ? "#a1a1aa20" : "#f59e0b20"
          };color:${color}">${
            m.status === "active" ? "Actif" : m.status === "completed" ? "Terminé" : "À venir"
          }</span><br/>
          <a href="/souks/${m.id}" style="display:inline-block;margin-top:6px;color:#f59e0b;text-decoration:none;font-weight:500;">Voir le souk →</a>
        </div>
      `);
    });

    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [L, markers]);

  const statusLabels: Record<string, string> = {
    pending: "À venir",
    active: "Actif",
    completed: "Terminé",
    cancelled: "Annulé",
  };
  const statusColors: Record<string, string> = {
    pending: "text-amber-400 bg-amber-500/10",
    active: "text-green-400 bg-green-500/10",
    completed: "text-zinc-400 bg-zinc-500/10",
    cancelled: "text-red-400 bg-red-500/10",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--fg-base)]">Carte des souks</h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">{markers.length} souk{markers.length > 1 ? "s" : ""} affiché{markers.length > 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/souks"
          className="text-xs px-3 py-1.5 border border-[var(--border-color)] text-[var(--fg-muted)] rounded-lg hover:bg-[var(--bg-surface-hover)] transition-all"
        >
          Vue liste
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {loading ? (
            <div className="w-full aspect-[4/3] bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] flex items-center justify-center">
              <p className="text-sm text-[var(--fg-muted)]">Chargement de la carte...</p>
            </div>
          ) : (
            <div ref={mapRef} className="w-full aspect-[4/3] rounded-xl border border-[var(--border-color)] overflow-hidden z-0" style={{ background: "#18181b" }} />
          )}
        </div>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {markers.map((m) => (
            <Link
              key={m.id}
              href={`/souks/${m.id}`}
              className="block p-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg hover:border-amber-500/30 transition-all"
            >
              <p className="text-sm font-medium text-[var(--fg-base)]">{m.title}</p>
              <p className="text-xs text-[var(--fg-muted)] mt-0.5">{m.location}</p>
              <p className="text-xs text-[var(--fg-muted)]">{new Date(m.date).toLocaleDateString("fr-FR")}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${statusColors[m.status] || statusColors.pending}`}>
                  {statusLabels[m.status] || m.status}
                </span>
                <span className="text-[10px] text-[var(--fg-muted)]">{m.vehiclesCount} véhicules</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
