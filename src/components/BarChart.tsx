interface Bar {
  label: string;
  value: number;
  color?: string;
}

export default function BarChart({ data, title }: { data: Bar[]; title?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div>
      {title && <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>}
      <div className="space-y-3">
        {data.map((bar) => (
          <div key={bar.label}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-zinc-400">{bar.label}</span>
              <span className="text-zinc-500">{bar.value}</span>
            </div>
            <div className="h-2.5 bg-[#27272a] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${(bar.value / max) * 100}%`,
                  background: bar.color || "linear-gradient(90deg, #f59e0b, #d97706)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
