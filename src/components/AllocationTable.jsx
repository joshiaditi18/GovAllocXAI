import React, { useMemo, useState } from "react";
import { ArrowUpDown, ChevronRight, X } from "lucide-react";
import { SDG_DEFINITIONS } from "../data/demoData";

const PRIORITY_STYLES = {
  High: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  Medium: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  Low: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
};

function formatCurrency(n) {
  return `$${(n / 1e9).toFixed(2)}B`;
}

export default function AllocationTable({ data }) {
  const [sortKey, setSortKey] = useState("percentage");
  const [sortDir, setSortDir] = useState("desc");
  const [selected, setSelected] = useState(null);

  const sorted = useMemo(() => {
    const arr = [...data];
    arr.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return arr;
  }, [data, sortKey, sortDir]);

  function toggleSort(key) {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const columns = [
    { key: "name", label: "Sector" },
    { key: "amount", label: "Predicted Amount" },
    { key: "percentage", label: "Percentage" },
    { key: "priority", label: "Priority" },
    { key: "sdg", label: "SDG Link" },
  ];

  return (
    <>
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 cursor-pointer select-none hover:text-cyan-300 transition-colors"
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className="w-3 h-3 opacity-50" />
                  </span>
                </th>
              ))}
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={row.id}
                onClick={() => setSelected(row)}
                className="border-b border-white/[0.03] hover:bg-white/[0.03] cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{row.name}</td>
                <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{formatCurrency(row.amount)}</td>
                <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{row.percentage.toFixed(1)}%</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`text-[11px] px-2 py-0.5 rounded-md border ${PRIORITY_STYLES[row.priority]}`}>
                    {row.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{row.sdg}</td>
                <td className="px-4 py-3">
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md h-full bg-navy-900 border-l border-white/[0.08] p-6 overflow-y-auto animate-slide-up">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:bg-white/[0.06]"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-xs font-semibold uppercase tracking-wide text-cyan-300 mb-1">Sector Detail</div>
            <h2 className="text-xl font-bold text-white mb-4">{selected.name}</h2>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="glass-card p-3">
                <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Allocation</div>
                <div className="text-lg font-bold text-white">{formatCurrency(selected.amount)}</div>
              </div>
              <div className="glass-card p-3">
                <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Percentage</div>
                <div className="text-lg font-bold text-white">{selected.percentage.toFixed(1)}%</div>
              </div>
            </div>

            <div className="mb-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                Relevant Socioeconomic Factors
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["GDP", "Population", "Sector Expenditure Ratio", "Regional Priority Index"].map((f) => (
                  <span
                    key={f}
                    className="text-[11px] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-slate-400"
                  >
                    {f}
                  </span>
                ))}
              </div>
              <div className="text-[10px] text-slate-600 mt-1.5">Illustrative factors — demo only</div>
            </div>

            <div className="mb-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">SDG Connection</div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  backgroundColor: `${SDG_DEFINITIONS[selected.sdg]?.color}22`,
                  color: SDG_DEFINITIONS[selected.sdg]?.color,
                }}
              >
                {selected.sdg} — {SDG_DEFINITIONS[selected.sdg]?.title}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Explanation</div>
              <p className="text-sm text-slate-300 leading-relaxed">
                The model allocates a higher share to {selected.name.toLowerCase()} when socioeconomic indicators
                associated with this sector (e.g. demand pressure, coverage gaps, or strategic priority) are
                elevated relative to other sectors. This explanation is illustrative; live SHAP/LIME explanations
                are currently available only for the healthcare target on the Explainable AI page.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
