import React, { useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LoadingScreen from "./components/LoadingScreen";
import Dashboard from "./pages/Dashboard";
import BudgetPrediction from "./pages/BudgetPrediction";
import SectorAllocation from "./pages/SectorAllocation";
import ModelPerformance from "./pages/ModelPerformance";
import ExplainableAI from "./pages/ExplainableAI";
import SDGImpact from "./pages/SDGImpact";
import Recommendations from "./pages/Recommendations";
import Methodology from "./pages/Methodology";

export default function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <HashRouter future={{ v7_startTransition: true }}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0 px-4 py-6 md:px-8 md:py-8 animate-fade-in">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/budget-prediction" element={<BudgetPrediction />} />
            <Route path="/sector-allocation" element={<SectorAllocation />} />
            <Route path="/model-performance" element={<ModelPerformance />} />
            <Route path="/explainable-ai" element={<ExplainableAI />} />
            <Route path="/sdg-impact" element={<SDGImpact />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/methodology" element={<Methodology />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
