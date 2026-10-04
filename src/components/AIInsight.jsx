import React from "react";
import { Sparkles, Info } from "lucide-react";

export default function AIInsight({ text, footnote }) {
  return (
    <div className="glass-card p-5 border-cyan-500/10 relative overflow-hidden">
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="flex items-start gap-3 relative">
        <div className="p-2 rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/20 shrink-0">
          <Sparkles className="w-4 h-4 text-cyan-300" />
        </div>
        <div className="space-y-2">
          <div className="text-xs font-semibold tracking-widest uppercase text-cyan-300">AI Insight</div>
          <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
          {footnote && (
            <div className="flex items-start gap-1.5 text-[11px] text-slate-500 pt-1">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{footnote}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
