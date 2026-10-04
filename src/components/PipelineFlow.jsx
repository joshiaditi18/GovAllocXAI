import React from "react";
import { ArrowDown, ArrowRight } from "lucide-react";

export default function PipelineFlow({ steps, direction = "vertical" }) {
  const isVertical = direction === "vertical";
  return (
    <div className={`flex ${isVertical ? "flex-col items-center" : "flex-wrap items-center"} gap-2`}>
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <div className="glass-card px-4 py-2.5 text-sm font-medium text-slate-200 text-center min-w-[160px]">
            {step}
          </div>
          {i < steps.length - 1 &&
            (isVertical ? (
              <ArrowDown className="w-4 h-4 text-cyan-500/60" />
            ) : (
              <ArrowRight className="w-4 h-4 text-cyan-500/60" />
            ))}
        </React.Fragment>
      ))}
    </div>
  );
}
