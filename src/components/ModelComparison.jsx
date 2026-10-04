import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const MODEL_COLORS = {
  XGBoost: "#22d3ee",
  CatBoost: "#2dd4bf",
  Hybrid: "#a78bfa",
};

export function MetricComparisonBarChart({ metrics, metricKey = "r2", height = 300 }) {
  const data = Object.entries(metrics).map(([name, vals]) => ({
    name: name === "xgboost" ? "XGBoost" : name === "catboost" ? "CatBoost" : "Hybrid",
    value: vals[metricKey],
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} tickLine={false} />
        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#0d1626", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#fff" }}
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={MODEL_COLORS[d.name] || "#22d3ee"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ActualVsPredictedChart({ data, height = 320 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} tickLine={false} />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 11 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
          label={{ value: "Budget Index ($B)", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }}
        />
        <Tooltip
          contentStyle={{ background: "#0d1626", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#fff" }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
        <Line type="monotone" dataKey="actual" name="Actual" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#a78bfa" strokeWidth={2.5} strokeDasharray="5 4" dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ModelMetricCard({ name, metrics, trainingTime }) {
  const color = MODEL_COLORS[name] || "#22d3ee";
  return (
    <div className="glass-card glass-card-hover p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="font-semibold text-white text-sm">{name}</h3>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-lg font-bold text-white">{metrics.r2.toFixed(4)}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">R²</div>
        </div>
        <div>
          <div className="text-lg font-bold text-white">{metrics.mae.toFixed(3)}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">MAE</div>
        </div>
        <div>
          <div className="text-lg font-bold text-white">{metrics.rmse.toFixed(3)}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">RMSE</div>
        </div>
      </div>
      {trainingTime && (
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
          <span className="text-slate-500">Training Time</span>
          <span className="text-slate-400">
            {trainingTime.seconds}s <span className="text-amber-400/80">({trainingTime.label})</span>
          </span>
        </div>
      )}
    </div>
  );
}
