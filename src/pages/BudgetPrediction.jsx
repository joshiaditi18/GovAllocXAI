import React, { useState } from "react";
import { ChevronDown, Play, RotateCcw, Loader2, CheckCircle2 } from "lucide-react";
import Header from "../components/Header";
import { INPUT_GROUPS } from "../data/demoData";
import { predictBudget, PREDICTION_STAGES } from "../services/api";
import { SectorDonutChart } from "../components/SectorChart";
import AIInsight from "../components/AIInsight";

function buildDefaultInputs() {
  const values = {};
  INPUT_GROUPS.forEach((group) => {
    group.fields.forEach((f) => {
      values[f.key] = f.default;
    });
  });
  return values;
}

const GROUP_COLOR = {
  cyan: "text-cyan-300 border-cyan-500/20 bg-cyan-500/5",
  teal: "text-teal-300 border-teal-500/20 bg-teal-500/5",
  emerald: "text-emerald-300 border-emerald-500/20 bg-emerald-500/5",
  blue: "text-blue-300 border-blue-500/20 bg-blue-500/5",
};

export default function BudgetPrediction() {
  const [inputs, setInputs] = useState(buildDefaultInputs());
  const [openGroups, setOpenGroups] = useState({ economic: true });
  const [running, setRunning] = useState(false);
  const [stageIndex, setStageIndex] = useState(-1);
  const [result, setResult] = useState(null);

  function toggleGroup(id) {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function updateField(key, value) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setInputs(buildDefaultInputs());
    setResult(null);
    setStageIndex(-1);
  }

  async function runPrediction() {
    setRunning(true);
    setResult(null);
    setStageIndex(0);
    for (let i = 0; i < PREDICTION_STAGES.length; i++) {
      setStageIndex(i);
      await new Promise((r) => setTimeout(r, 650));
    }
    const res = await predictBudget(inputs);
    setResult(res);
    setRunning(false);
    setStageIndex(-1);
  }

  return (
    <div>
      <Header
        title="Budget Prediction"
        subtitle="Enter socioeconomic indicators to generate an AI-assisted total budget prediction and sector allocation."
        badge={<span className="badge-demo">Demo Pipeline</span>}
      />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Input form */}
        <div className="xl:col-span-3 space-y-3">
          {INPUT_GROUPS.map((group) => (
            <div key={group.id} className="glass-card overflow-hidden">
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md border ${GROUP_COLOR[group.color]}`}
                  >
                    {group.fields.length} fields
                  </span>
                  <span className="font-semibold text-white text-sm">{group.label}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${openGroups[group.id] ? "rotate-180" : ""}`}
                />
              </button>
              {openGroups[group.id] && (
                <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/[0.06] pt-4">
                  {group.fields.map((f) => (
                    <label key={f.key} className="flex flex-col gap-1.5 text-xs">
                      <span className="text-slate-400">{f.label}</span>
                      <input
                        type="number"
                        step={f.step}
                        min={f.min}
                        max={f.max}
                        value={inputs[f.key]}
                        onChange={(e) => updateField(f.key, parseFloat(e.target.value))}
                        className="bg-navy-800/80 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/50"
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button
              onClick={runPrediction}
              disabled={running}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-navy-950 font-semibold text-sm px-5 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Run Prediction
            </button>
            <button
              onClick={resetForm}
              disabled={running}
              className="inline-flex items-center justify-center gap-2 bg-white/[0.04] border border-white/[0.08] text-slate-300 font-semibold text-sm px-5 py-3 rounded-lg hover:bg-white/[0.07] transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Pipeline / results */}
        <div className="xl:col-span-2 space-y-5">
          {(running || result) && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Model Execution</h3>
              <div className="space-y-3">
                {PREDICTION_STAGES.map((stage, i) => {
                  const done = result ? true : i < stageIndex;
                  const active = running && i === stageIndex;
                  return (
                    <div key={stage} className="flex items-center gap-3 text-sm">
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : active ? (
                        <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-white/10 shrink-0" />
                      )}
                      <span className={done || active ? "text-slate-200" : "text-slate-600"}>{stage}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {result && (
            <>
              <div className="glass-card p-5">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  Predicted Total Budget
                </div>
                <div className="text-3xl font-bold text-white">
                  ${(result.total_budget / 1e9).toFixed(2)}B
                </div>
                <div className="text-xs text-slate-500 mt-1">Hybrid model output — demonstration value</div>
              </div>

              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-1">Generated Sector Allocation</h3>
                <p className="text-xs text-slate-500 mb-2">15-sector distribution from this prediction run</p>
                <SectorDonutChart data={result.sector_allocations} height={280} />
              </div>

              <AIInsight
                text="The hybrid ensemble combined XGBoost and CatBoost outputs to generate this allocation, balancing accuracy across sectors."
                footnote="Decision support only — final allocation requires human and institutional approval."
              />
            </>
          )}

          {!running && !result && (
            <div className="glass-card p-8 text-center text-sm text-slate-500">
              Configure the socioeconomic indicators on the left and click{" "}
              <span className="text-slate-300 font-medium">Run Prediction</span> to generate a budget forecast.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
