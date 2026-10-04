import React from "react";
import { AlertTriangle } from "lucide-react";
import Header from "../components/Header";
import PipelineFlow from "../components/PipelineFlow";
import { XAI_DEMO_FEATURES, XAI_PIPELINE_STEPS } from "../data/demoData";

const IMPACT_STYLES = {
  High: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  Medium: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  Low: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const DIRECTION_STYLES = {
  Positive: "text-emerald-400",
  Negative: "text-rose-400",
};

export default function ExplainableAI() {
  return (
    <div>
      <Header
        title="Explainable AI — Integration Module"
        subtitle="How feature-level explanations will work once SHAP/LIME are integrated into the pipeline."
        badge={<span className="badge-planned">Planned XAI Integration</span>}
      />

      <div className="glass-card p-4 mb-6 flex items-start gap-3 border-amber-500/20 bg-amber-500/[0.03]">
        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-200/80 leading-relaxed">
          SHAP and LIME are described as <span className="font-semibold">planned / future integration</span> in the
          research paper. The visualizations below are illustrative demo explanations only and have not been
          produced by an experimentally validated SHAP implementation.
        </p>
      </div>

      <div className="glass-card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Feature Contribution (Demo)</h3>
          <span className="badge-demo">Demo Explanation — SHAP Integration Pending</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[420px]">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wide text-slate-400">
                <th className="text-left px-3 py-2">Feature</th>
                <th className="text-left px-3 py-2">Impact</th>
                <th className="text-left px-3 py-2">Direction</th>
              </tr>
            </thead>
            <tbody>
              {XAI_DEMO_FEATURES.map((f) => (
                <tr key={f.feature} className="border-b border-white/[0.03]">
                  <td className="px-3 py-2.5 text-white font-medium">{f.feature}</td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[11px] px-2 py-0.5 rounded-md border ${IMPACT_STYLES[f.impact]}`}>
                      {f.impact}
                    </span>
                  </td>
                  <td className={`px-3 py-2.5 font-medium ${DIRECTION_STYLES[f.direction]}`}>{f.direction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">How the Model Will Explain an Allocation</h3>
        <div className="overflow-x-auto pb-2">
          <PipelineFlow steps={XAI_PIPELINE_STEPS} direction="vertical" />
        </div>
        <p className="text-xs text-slate-500 mt-4 leading-relaxed">
          Once SHAP is integrated, each sector allocation will be paired with a ranked list of contributing
          features and their marginal effect, giving policymakers a transparent, human-interpretable rationale
          for the model's output.
        </p>
      </div>
    </div>
  );
}
