import type { Metadata } from "next";
import { changelog } from "@/data/changelog";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Suivez les dernières mises à jour et nouveautés de la plateforme Souki.",
};

const typeStyles = {
  feature: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  fix: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  change: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const typeLabels = {
  feature: "Nouveauté",
  fix: "Correction",
  change: "Modification",
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Changelog</h1>
          <p className="text-zinc-400">Suivez l&apos;évolution de Souki</p>
        </div>

        <div className="relative">
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-[#27272a]" />

          {changelog.map((entry) => (
            <div key={entry.version} className="relative pl-12 pb-12 last:pb-0">
              <div className="absolute left-[7px] top-1.5 w-[17px] h-[17px] rounded-full bg-amber-500 border-4 border-[#0a0a0b]" />

              <div className="mb-4">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-lg font-bold text-white">v{entry.version}</span>
                  <span className="text-sm text-zinc-500">{entry.date}</span>
                </div>
                <h2 className="text-sm text-zinc-300">{entry.title}</h2>
              </div>

              <ul className="space-y-2">
                {entry.items.map((item, i) => (
                  <li
                    key={i}
                    className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs ${typeStyles[item.type]}`}
                  >
                    <span className="font-medium">{typeLabels[item.type]}</span>
                    <span className="opacity-60">·</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
