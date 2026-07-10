"use client";

export default function SoukiLoader({ fullScreen = true }: { fullScreen?: boolean }) {
  return (
    <div className={`${fullScreen ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0b]" : "flex flex-col items-center justify-center py-20"}`}>
      <div className="relative">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="animate-pulse">
          <rect x="4" y="4" width="40" height="40" rx="10" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
          <text x="24" y="30" textAnchor="middle" fill="#f59e0b" fontSize="20" fontWeight="bold" fontFamily="sans-serif">S</text>
        </svg>
        <div className="absolute -inset-2 rounded-xl border-2 border-amber-500/20 animate-ping" />
      </div>
      <div className="mt-6 flex gap-1">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <p className="mt-4 text-sm text-zinc-600 font-mono animate-pulse">Souki</p>
    </div>
  );
}
