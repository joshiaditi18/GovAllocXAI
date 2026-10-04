import React from "react";
import { Wallet, LayersIcon, Cpu, Target } from "lucide-react";
import Header from "../components/Header";
import KPICard from "../components/KPICard";
import AIInsight from "../components/AIInsight";
import { SectorDonutChart } from "../components/SectorChart";
import { ActualVsPredictedChart, MetricComparisonBarChart } from "../components/ModelComparison";
import {
  SECTOR_ALLOCATIONS_DEMO,
  TOTAL_PREDICTED_BUDGET_DEMO,
  MODEL_METRICS,
  SYSTEM_METRICS,
  ACTUAL_VS_PREDICTED_DEMO,
  ECON_ENV_TRADEOFF_DEMO,
  AI_INSIGHT_DEMO,
} from "../data/demoData";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";

export default function Dashboard() {
  return (
    <div>
      <Header
        title="GovAllocXAI — Intelligent Government Budget Management"
        subtitle="Explainable AI for Strategic and Sustainable Resource Allocation"
        badge={<span className="badge-demo">Demonstration System</span>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          label="Predicted Total Budget"
          value={`$${(TOTAL_PREDICTED_BUDGET_DEMO / 1e9).toFixed(1)}B`}
          sublabel="Illustrative — synthetic dataset"
          icon={Wallet}
          accent="cyan"
        />
        <KPICard label="Number of Sectors" value="15" sublabel="Target budget sectors" icon={LayersIcon} accent="teal" />
        <KPICard
          label="Model R² (Hybrid)"
          value={MODEL_METRICS.hybrid.r2.toFixed(4)}
          sublabel="Reported research result"
          icon={Cpu}
          accent="blue"
        />
        <KPICard
          label="Allocation System R²"
          value={SYSTEM_METRICS.autonomousAllocationR2.value.toFixed(4)}
          sublabel="Autonomous allocation system"
          icon={Target}
          accent="amber"
        />
      </div>

      <p className="text-xs text-slate-500 mb-6 -mt-2">
        Evaluation results are based on the experimental dataset.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Sector Allocation</h3>
          <p className="text-xs text-slate-500 mb-2">Predicted budget distribution across 15 sectors (demo)</p>
          <SectorDonutChart data={SECTOR_ALLOCATIONS_DEMO} />
        </div>
        <AIInsight
          text={AI_INSIGHT_DEMO}
          footnote="This is a demonstration recommendation, not an autonomous government decision."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Actual vs Predicted</h3>
          <p className="text-xs text-slate-500 mb-2">Illustrative time-series comparison (demo)</p>
          <ActualVsPredictedChart data={ACTUAL_VS_PREDICTED_DEMO} />
        </div>
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Model Performance Comparison</h3>
          <p className="text-xs text-slate-500 mb-2">R² across XGBoost, CatBoost, Hybrid (research values)</p>
          <MetricComparisonBarChart metrics={MODEL_METRICS} metricKey="r2" />
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-1">Economic vs Environmental Trade-off</h3>
        <p className="text-xs text-slate-500 mb-2">Illustrative sector positioning (demo)</p>
        <ResponsiveContainer width="100%" height={340}>
          <ScatterChart margin={{ top: 10, right: 30, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              type="number"
              dataKey="economic"
              name="Economic Priority"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
              label={{ value: "Economic Priority", position: "insideBottom", offset: -5, fill: "#64748b", fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="environmental"
              name="Environmental Priority"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
              label={{ value: "Environmental Priority", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }}
            />
            <ZAxis range={[80, 80]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{ background: "#0d1626", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
              formatter={(value, name) => [value, name]}
              labelFormatter={() => ""}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-navy-800 border border-white/10 rounded-lg px-3 py-2 text-xs">
                    <div className="font-semibold text-white mb-1">{d.sector}</div>
                    <div className="text-slate-400">Economic: {d.economic}</div>
                    <div className="text-slate-400">Environmental: {d.environmental}</div>
                  </div>
                );
              }}
            />
            <Scatter data={ECON_ENV_TRADEOFF_DEMO} fill="#22d3ee" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
