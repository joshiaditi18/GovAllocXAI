import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const PALETTE = [
  "#22d3ee", "#2dd4bf", "#3b82f6", "#a78bfa", "#f472b6",
  "#fb923c", "#fbbf24", "#4ade80", "#38bdf8", "#818cf8",
  "#f87171", "#34d399", "#60a5fa", "#e879f9", "#facc15",
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-navy-800 border border-white/10 rounded-lg px-3 py-2 text-xs shadow-glass">
      <div className="font-semibold text-white mb-0.5">{d.name}</div>
      <div className="text-slate-400">
        {d.percentage?.toFixed ? d.percentage.toFixed(1) : d.percentage}% ·{" "}
        {typeof d.amount === "number" ? `$${(d.amount / 1e9).toFixed(2)}B` : ""}
      </div>
    </div>
  );
}

export function SectorDonutChart({ data, height = 320 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="percentage"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="85%"
          paddingAngle={2}
          stroke="rgba(5,10,20,0.9)"
          strokeWidth={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          wrapperStyle={{ fontSize: 11, color: "#94a3b8", maxHeight: height, overflowY: "auto" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function SectorBarChart({ data, height = 420 }) {
  const sorted = [...data].sort((a, b) => b.percentage - a.percentage);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={sorted} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: "#64748b", fontSize: 11 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
          unit="%"
        />
        <YAxis
          type="category"
          dataKey="name"
          width={150}
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
          {sorted.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
