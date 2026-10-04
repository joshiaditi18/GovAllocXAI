import React, { useEffect, useState } from "react";
import { Database, Cpu, PieChart, Leaf, ShieldCheck } from "lucide-react";

const STAGES = [
  { label: "Data", icon: Database },
  { label: "AI Models", icon: Cpu },
  { label: "Allocation", icon: PieChart },
  { label: "Sustainability", icon: Leaf },
];

export default function LoadingScreen({ onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (stage >= STAGES.length) {
      const t = setTimeout(() => onComplete?.(), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStage((s) => s + 1), 550);
    return () => clearTimeout(t);
  }, [stage, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-navy-950 flex flex-col items-center justify-center gap-10 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-glow">
          <ShieldCheck className="w-7 h-7 text-navy-950" strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-2xl font-bold text-white tracking-tight">GovAllocXAI</div>
          <div className="text-xs text-slate-400 tracking-wide">Intelligent Government Budget Management</div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {STAGES.map((s, i) => {
          const Icon = s.icon;
          const active = i <= stage;
          return (
            <React.Fragment key={s.label}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 ${
                    active
                      ? "bg-cyan-500/15 border-cyan-400/40 shadow-glow"
                      : "bg-white/[0.02] border-white/[0.08]"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? "text-cyan-300" : "text-slate-600"}`} />
                </div>
                <span className={`text-[11px] font-medium ${active ? "text-slate-300" : "text-slate-600"}`}>
                  {s.label}
                </span>
              </div>
              {i < STAGES.length - 1 && (
                <div className={`w-6 md:w-10 h-px ${i < stage ? "bg-cyan-400/40" : "bg-white/[0.08]"}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="w-56 h-1 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-500 rounded-full"
          style={{ width: `${(Math.min(stage, STAGES.length) / STAGES.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
