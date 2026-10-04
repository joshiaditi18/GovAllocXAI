import React from "react";

const ACCENTS = {
  cyan: { text: "text-cyan-300", bg: "bg-cyan-500/10", ring: "ring-cyan-500/20" },
  teal: { text: "text-teal-300", bg: "bg-teal-500/10", ring: "ring-teal-500/20" },
  blue: { text: "text-blue-300", bg: "bg-blue-500/10", ring: "ring-blue-500/20" },
  amber: { text: "text-amber-300", bg: "bg-amber-500/10", ring: "ring-amber-500/20" },
};

export default function KPICard({ label, value, sublabel, icon: Icon, accent = "cyan", trend }) {
  const c = ACCENTS[accent] || ACCENTS.cyan;
  return (
    <div className="glass-card glass-card-hover p-5 flex flex-col gap-3 animate-slide-up">
      <div className="flex items-start justify-between">
        <span className="section-label">{label}</span>
        {Icon && (
          <div className={`p-2 rounded-lg ${c.bg} ring-1 ${c.ring}`}>
            <Icon className={`w-4 h-4 ${c.text}`} strokeWidth={2} />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">{value}</span>
        {trend && (
          <span className={`text-xs font-medium ${trend.positive ? "text-emerald-400" : "text-rose-400"}`}>
            {trend.positive ? "▲" : "▼"} {trend.label}
          </span>
        )}
      </div>
      {sublabel && <span className="text-xs text-slate-400">{sublabel}</span>}
    </div>
  );
}
