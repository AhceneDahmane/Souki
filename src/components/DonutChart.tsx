interface Slice {
  label: string;
  value: number;
  color: string;
}

export default function DonutChart({ data, title }: { data: Slice[]; title?: string }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const gap = 0.02;
  const totalGaps = gap * data.length;
  const usable = 1 - totalGaps;

  let offset = 0;

  return (
    <div>
      {title && <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>}
      <div className="flex items-center gap-6">
        <svg width="120" height="120" viewBox="0 0 100 100" className="shrink-0">
          <g transform="rotate(-90 50 50)">
            {data.map((slice) => {
              const sliceSize = (slice.value / total) * usable;
              const dashArray = sliceSize * circumference;
              const dashGap = gap * circumference;
              const o = offset;
              offset += dashArray + dashGap;
              return (
                <circle
                  key={slice.label}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth="12"
                  strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                  strokeDashoffset={-o}
                  className="transition-all duration-1000"
                />
              );
            })}
            <circle cx="50" cy="50" r="28" fill="#0a0a0b" />
          </g>
          <text x="50" y="48" textAnchor="middle" fill="#fafafa" fontSize="16" fontWeight="bold">
            {total}
          </text>
          <text x="50" y="60" textAnchor="middle" fill="#a1a1aa" fontSize="7">
            Total
          </text>
        </svg>

        <div className="space-y-2">
          {data.map((slice) => (
            <div key={slice.label} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: slice.color }} />
              <span className="text-zinc-400">{slice.label}</span>
              <span className="text-zinc-500 ml-auto">{Math.round((slice.value / total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
