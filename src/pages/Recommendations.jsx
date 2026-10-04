import React from "react";
import { ShieldAlert } from "lucide-react";
import Header from "../components/Header";
import { SectorBarChart } from "../components/SectorChart";
import {
  SECTOR_ALLOCATIONS_DEMO,
  TOTAL_PREDICTED_BUDGET_DEMO,
  RECOMMENDATION_SUMMARY_DEMO,
  PRIORITY_GROUPS_DEMO,
} from "../data/demoData";

function PriorityColumn({ title, items, accent }) {
  return (
    <div className="glass-card p-4">
      <div className={`text-xs font-semibold uppercase tracking-wide mb-3 ${accent}`}>{title}</div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm text-slate-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Recommendations() {
  return (
    <div>
      <Header
        title="AI-Assisted Budget Recommendation"
        subtitle="A consolidated view of the system's recommended allocation for demonstration purposes."
        badge={<span className="badge-demo">Decision Support Only</span>}
      />

      <div className="glass-card p-5 mb-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
          Total Predicted Budget
        </div>
        <div className="text-4xl font-bold text-white mb-1">
          ${(TOTAL_PREDICTED_BUDGET_DEMO / 1e9).toFixed(1)}B
        </div>
        <div className="text-xs text-slate-500">Illustrative value generated from synthetic experimental data</div>
      </div>

      <div className="glass-card p-5 mb-6">
        <h3 className="text-sm font-semibold text-white mb-1">Recommended 15-Sector Allocation</h3>
        <p className="text-xs text-slate-500 mb-2">Ranked by predicted budget share</p>
        <SectorBarChart data={SECTOR_ALLOCATIONS_DEMO} height={480} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <PriorityColumn title="Economic Priorities" items={PRIORITY_GROUPS_DEMO.economic} accent="text-cyan-300" />
        <PriorityColumn title="Social Priorities" items={PRIORITY_GROUPS_DEMO.social} accent="text-teal-300" />
        <PriorityColumn title="Environmental Priorities" items={PRIORITY_GROUPS_DEMO.environmental} accent="text-emerald-300" />
      </div>

      <div className="glass-card p-5 mb-6">
        <h3 className="text-sm font-semibold text-white mb-2">Recommendation Summary</h3>
        <p className="text-sm text-slate-300 leading-relaxed">{RECOMMENDATION_SUMMARY_DEMO}</p>
      </div>

      <div className="glass-card p-5 border-amber-500/20 bg-amber-500/[0.03] flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
        <div>
          <div className="text-sm font-semibold text-amber-300 mb-1">Decision Support Only</div>
          <p className="text-xs text-amber-200/80 leading-relaxed">
            Final allocation requires human and institutional approval. This system is designed to assist, not
            replace, policymakers and budget officials.
          </p>
        </div>
      </div>
    </div>
  );
}
