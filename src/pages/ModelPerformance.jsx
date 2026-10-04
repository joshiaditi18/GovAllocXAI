import React from "react";
import Header from "../components/Header";
import {
  ModelMetricCard,
  MetricComparisonBarChart,
  ActualVsPredictedChart,
} from "../components/ModelComparison";
import { MODEL_METRICS, SYSTEM_METRICS, TRAINING_TIME_DEMO, ACTUAL_VS_PREDICTED_DEMO } from "../data/demoData";

export default function ModelPerformance() {
  return (
    <div>
      <Header
        title="Model Performance"
        subtitle="Comparison of XGBoost, CatBoost and the Hybrid ensemble on the experimental dataset."
        badge={<span className="badge-implemented">Research Results</span>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <ModelMetricCard name="XGBoost" metrics={MODEL_METRICS.xgboost} trainingTime={TRAINING_TIME_DEMO.xgboost} />
        <ModelMetricCard name="CatBoost" metrics={MODEL_METRICS.catboost} trainingTime={TRAINING_TIME_DEMO.catboost} />
        <ModelMetricCard name="Hybrid" metrics={MODEL_METRICS.hybrid} trainingTime={TRAINING_TIME_DEMO.hybrid} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-5">
          <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Total Budget Predictor R²</div>
          <div className="text-2xl font-bold text-white">{SYSTEM_METRICS.totalBudgetPredictorR2.value.toFixed(4)}</div>
        </div>
        <div className="glass-card p-5">
          <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Autonomous Allocation System R²</div>
          <div className="text-2xl font-bold text-white">{SYSTEM_METRICS.autonomousAllocationR2.value.toFixed(4)}</div>
        </div>
        <div className="glass-card p-5">
          <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">SDG-aligned Overall Model R²</div>
          <div className="text-2xl font-bold text-white">{SYSTEM_METRICS.sdgAlignedOverallR2.value.toFixed(4)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">R² Comparison</h3>
          <p className="text-xs text-slate-500 mb-2">Reported research values</p>
          <MetricComparisonBarChart metrics={MODEL_METRICS} metricKey="r2" />
        </div>
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">MAE Comparison</h3>
          <p className="text-xs text-slate-500 mb-2">Lower is better</p>
          <MetricComparisonBarChart metrics={MODEL_METRICS} metricKey="mae" />
        </div>
      </div>

      <div className="glass-card p-5 mb-6">
        <h3 className="text-sm font-semibold text-white mb-1">Actual vs Predicted</h3>
        <p className="text-xs text-slate-500 mb-2">Illustrative comparison across recent years (demo)</p>
        <ActualVsPredictedChart data={ACTUAL_VS_PREDICTED_DEMO} />
      </div>

      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Model Architecture</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
          <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div className="font-semibold text-cyan-300 mb-1.5">XGBoost</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gradient-boosted decision trees trained on the 44 socioeconomic predictors, optimized for
              multi-sector budget regression.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div className="font-semibold text-teal-300 mb-1.5">CatBoost</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ordered boosting with built-in handling of categorical/country-level features, used as an
              independent comparison model.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div className="font-semibold text-violet-300 mb-1.5">Hybrid Ensemble</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Combines XGBoost and CatBoost outputs into a single prediction used for total budget and
              15-sector allocation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
