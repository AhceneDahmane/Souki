"use client";

import { useState } from "react";
import Image from "next/image";

export default function QRCodeZoom({ src }: { src: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="hover:opacity-80 transition-opacity">
        <Image src={src} alt="QR" width={80} height={80} className="rounded" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
          onClick={() => setOpen(false)}
        >
          <div className="p-4 bg-white rounded-xl" onClick={(e) => e.stopPropagation()}>
            <Image src={src} alt="QR" width={300} height={300} className="rounded" />
          </div>
        </div>
      )}
    </>
  );
}
