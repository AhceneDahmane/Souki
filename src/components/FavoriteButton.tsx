"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function FavoriteButton({ vehicleId }: { vehicleId: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFavorited(data.some((f: { vehicleId: string }) => f.vehicleId === vehicleId));
        }
      })
      .catch(() => {});
  }, [user, vehicleId]);

  async function toggle() {
    if (!user) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId }),
      });
      if (res.ok) {
        const data = await res.json();
        setFavorited(data.favorited);
      }
    } catch {}
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`p-1.5 rounded-lg transition-all ${
        favorited
          ? "text-red-400 bg-red-500/10 hover:bg-red-500/20"
          : "text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
      }`}
      title={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <svg
        className="w-4 h-4"
        fill={favorited ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}
