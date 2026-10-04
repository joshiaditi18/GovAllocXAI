import React from "react";
import { Leaf } from "lucide-react";

export default function SDGCard({ code, title, color, sectors = [] }) {
  return (
    <div className="glass-card glass-card-hover p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs text-white"
          style={{ backgroundColor: color }}
        >
          {code.replace("SDG ", "")}
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-300">{code}</div>
          <div className="text-sm font-semibold text-white leading-tight">{title}</div>
        </div>
      </div>
      {sectors.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/[0.06]">
          {sectors.map((s) => (
            <span
              key={s}
              className="text-[10px] px-2 py-1 rounded-md bg-white/[0.04] text-slate-400 border border-white/[0.06]"
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function SDGBadge({ code, color }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md"
      style={{ backgroundColor: `${color}22`, color }}
    >
      <Leaf className="w-3 h-3" />
      {code}
    </span>
  );
}
