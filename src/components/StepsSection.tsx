import Link from "next/link";

interface Step {
  label: string;
  done: boolean;
  href?: string;
  icon: string;
}

export default function StepsSection({ title, steps }: { title: string; steps: Step[] }) {
  const allDone = steps.every((s) => s.done);
  if (allDone) return null;

  return (
    <div className="mb-8 p-5 bg-gradient-to-br from-amber-500/5 to-transparent rounded-xl border border-amber-500/20">
      <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        {title}
      </h2>
      <div className="space-y-2">
        {steps.map((step) => (
          <div key={step.label} className="flex items-center gap-3 text-sm">
            {step.done ? (
              <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                </svg>
              </div>
            )}
            {step.href && !step.done ? (
              <Link href={step.href} className="text-zinc-400 hover:text-amber-400 transition-colors">
                {step.label} →
              </Link>
            ) : (
              <span className={`${step.done ? "text-zinc-600 line-through" : "text-zinc-400"}`}>{step.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
