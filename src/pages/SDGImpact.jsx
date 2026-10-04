import React from "react";
import Header from "../components/Header";
import SDGCard from "../components/SDGCard";
import { SECTOR_ALLOCATIONS_DEMO, SDG_DEFINITIONS, ECON_ENV_TRADEOFF_DEMO } from "../data/demoData";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SDGImpact() {
  const sdgToSectors = {};
  SECTOR_ALLOCATIONS_DEMO.forEach((s) => {
    if (!sdgToSectors[s.sdg]) sdgToSectors[s.sdg] = [];
    sdgToSectors[s.sdg].push(s.name);
  });

  return (
    <div>
      <Header
        title="SDG Impact"
        subtitle="Sustainable Development Goal alignment for the predicted sector allocation."
        badge={<span className="badge-demo">Illustrative / High-Level SDG Alignment</span>}
      />

      <div className="glass-card p-4 mb-6 text-xs text-slate-400 leading-relaxed">
        SDG mapping in this dashboard is illustrative and high-level, reflecting the research paper's treatment of
        SDG alignment. It is not a formally validated SDG indicator assessment.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Object.entries(SDG_DEFINITIONS).map(([code, def]) => (
          <SDGCard
            key={code}
            code={code}
            title={def.title}
            color={def.color}
            sectors={sdgToSectors[code] || []}
          />
        ))}
      </div>

      <div className="glass-card p-5 mb-6">
        <h3 className="text-sm font-semibold text-white mb-1">Sector → SDG Allocation Matrix</h3>
        <p className="text-xs text-slate-500 mb-3">Budget share routed toward each SDG's linked sectors (demo)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wide text-slate-400">
                <th className="text-left px-3 py-2">Sector</th>
                <th className="text-left px-3 py-2">SDG</th>
                <th className="text-left px-3 py-2">Allocation %</th>
              </tr>
            </thead>
            <tbody>
              {SECTOR_ALLOCATIONS_DEMO.map((s) => (
                <tr key={s.id} className="border-b border-white/[0.03]">
                  <td className="px-3 py-2.5 text-white font-medium">{s.name}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className="text-[11px] px-2 py-0.5 rounded-md font-semibold"
                      style={{ backgroundColor: `${SDG_DEFINITIONS[s.sdg]?.color}22`, color: SDG_DEFINITIONS[s.sdg]?.color }}
                    >
                      {s.sdg}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-300">{s.percentage.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-1">Economic vs Environmental Trade-off</h3>
        <p className="text-xs text-slate-500 mb-2">Sustainability positioning by sector (illustrative)</p>
        <ResponsiveContainer width="100%" height={340}>
          <ScatterChart margin={{ top: 10, right: 30, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              type="number"
              dataKey="economic"
              name="Economic"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
              label={{ value: "Economic Priority", position: "insideBottom", offset: -5, fill: "#64748b", fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="environmental"
              name="Environmental"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
              label={{ value: "Environmental Priority", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }}
            />
            <Tooltip
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
            <Scatter data={ECON_ENV_TRADEOFF_DEMO} fill="#2dd4bf" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
