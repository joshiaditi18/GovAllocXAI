import React from "react";
import Header from "../components/Header";
import { SectorDonutChart, SectorBarChart } from "../components/SectorChart";
import AllocationTable from "../components/AllocationTable";
import { SECTOR_ALLOCATIONS_DEMO } from "../data/demoData";

export default function SectorAllocation() {
  return (
    <div>
      <Header
        title="Sector Allocation"
        subtitle="Predicted budget distribution across all 15 target sectors."
        badge={<span className="badge-demo">Demo Data</span>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Allocation Share</h3>
          <p className="text-xs text-slate-500 mb-2">Donut view — percentage of total predicted budget</p>
          <SectorDonutChart data={SECTOR_ALLOCATIONS_DEMO} height={360} />
        </div>
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Ranked Allocation</h3>
          <p className="text-xs text-slate-500 mb-2">Horizontal bar view — sorted by percentage</p>
          <SectorBarChart data={SECTOR_ALLOCATIONS_DEMO} height={420} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white mb-1">Detailed Allocation Table</h3>
        <p className="text-xs text-slate-500 mb-3">Click a column header to sort · click a row to view sector detail</p>
        <AllocationTable data={SECTOR_ALLOCATIONS_DEMO} />
      </div>
    </div>
  );
}
