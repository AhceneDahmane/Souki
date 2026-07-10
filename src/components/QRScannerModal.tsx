"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

type Props = {
  soukId: string;
  onClose: () => void;
  onAssigned: () => void;
};

export default function QRScannerModal({ soukId, onClose, onAssigned }: Props) {
  const readerRef = useRef<Html5Qrcode | null>(null);
  const [scanned, setScanned] = useState<{ sellerId: string; sellerName: string; registrationId: string } | null>(null);
  const [spotNumber, setSpotNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const reader = new Html5Qrcode("qr-reader");
    readerRef.current = reader;

    reader.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      async (decodedText) => {
        await reader.stop();
        reader.clear();

        let parsed: { type: string; soukId: string; sellerId: string };
        try {
          parsed = JSON.parse(decodedText);
        } catch {
          setError("QR code invalide");
          return;
        }

        if (parsed.type !== "souk-access") {
          setError("Ce QR code n'est pas un code d'accès souk");
          return;
        }

        if (parsed.soukId !== soukId) {
          setError("Ce QR code n'appartient pas à ce souk");
          return;
        }

        try {
          const res = await fetch("/api/qrcode/scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qrData: decodedText }),
          });
          if (!res.ok) {
            const data = await res.json();
            setError(data.error || "Erreur lors du scan");
            return;
          }
          const data = await res.json();
          setScanned({
            sellerId: parsed.sellerId,
            sellerName: data.registration?.sellerName || "Vendeur inconnu",
            registrationId: data.registration?.id || "",
          });
        } catch {
          setError("Erreur réseau");
        }
      },
      () => {},
    );

    return () => {
      reader.stop().catch(() => {});
      reader.clear();
    };
  }, [soukId]);

  async function handleAssign() {
    if (!spotNumber || !scanned) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/souks/${soukId}/register`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: scanned.registrationId,
          action: "present",
          spotNumber: parseInt(spotNumber),
        }),
      });
      if (res.ok) {
        onAssigned();
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || "Erreur");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-white">
            {scanned ? "Attribuer un emplacement" : "Scanner le QR code"}
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-400 mb-3 p-2 bg-red-500/10 rounded-lg">{error}</p>
        )}

        {!scanned ? (
          <div id="qr-reader" className="w-full aspect-square rounded-lg overflow-hidden border border-[#27272a]" />
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-[#0a0a0b] rounded-lg border border-[#27272a]">
              <p className="text-xs text-zinc-500 mb-1">Vendeur scanné</p>
              <p className="text-sm font-medium text-white">{scanned.sellerName}</p>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Numéro d&apos;emplacement *</label>
              <input
                type="number"
                min="1"
                value={spotNumber}
                onChange={(e) => setSpotNumber(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#27272a] rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
                placeholder="Ex: 42"
                autoFocus
              />
            </div>
            <button
              onClick={handleAssign}
              disabled={submitting || !spotNumber}
              className="w-full py-2.5 bg-amber-500 text-black text-sm font-medium rounded-lg hover:bg-amber-400 disabled:opacity-50 transition-all"
            >
              {submitting ? "Attribution..." : "Attribuer l'emplacement"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
