import React from "react";
import { CheckCircle2, Circle, Info } from "lucide-react";
import Header from "../components/Header";
import PipelineFlow from "../components/PipelineFlow";
import { METHODOLOGY_PIPELINE, PREPROCESSING_STEPS, DATASET_SUMMARY, RESEARCH_STATUS } from "../data/demoData";

export default function Methodology() {
  return (
    <div>
      <Header
        title="Research / Methodology"
        subtitle="Pipeline, dataset, and current implementation status for GovAllocXAI."
      />

      <div className="glass-card p-5 mb-6">
        <h3 className="text-sm font-semibold text-white mb-4">Research Pipeline</h3>
        <div className="overflow-x-auto pb-2">
          <PipelineFlow steps={METHODOLOGY_PIPELINE} direction="vertical" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Preprocessing Steps</h3>
          <ul className="space-y-2">
            {PREPROCESSING_STEPS.map((step) => (
              <li key={step} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Dataset Summary</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Type</div>
              <div className="text-slate-200">{DATASET_SUMMARY.type}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Years</div>
              <div className="text-slate-200">{DATASET_SUMMARY.years}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Countries</div>
              <div className="text-slate-200">{DATASET_SUMMARY.countries}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Rows</div>
              <div className="text-slate-200">{DATASET_SUMMARY.rows}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Columns</div>
              <div className="text-slate-200">{DATASET_SUMMARY.columns}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Predictors</div>
              <div className="text-slate-200">{DATASET_SUMMARY.predictors}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Target Sectors</div>
              <div className="text-slate-200">{DATASET_SUMMARY.targetSectors}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Implemented
          </h3>
          <ul className="space-y-2">
            {RESEARCH_STATUS.implemented.map((item) => (
              <li key={item} className="text-sm text-slate-300 flex items-center gap-2">
                <span className="text-emerald-400">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Circle className="w-3.5 h-3.5 text-violet-400" /> Planned / Future
          </h3>
          <ul className="space-y-2">
            {RESEARCH_STATUS.planned.map((item) => (
              <li key={item} className="text-sm text-slate-400 flex items-center gap-2">
                <span className="text-violet-400">○</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass-card p-5 border-cyan-500/15 bg-cyan-500/[0.03] flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-300 mt-0.5 shrink-0" />
        <div className="text-xs text-cyan-100/80 leading-relaxed space-y-2">
          <p>
            Current results are based on an experimental synthetic dataset and should not be interpreted as
            validated real-world government budget recommendations.
          </p>
          <p>
            Real-world deployment requires validation using official government budget data, temporal
            validation, policy constraints, formal SDG indicator validation and human oversight.
          </p>
        </div>
      </div>
    </div>
  );
}
