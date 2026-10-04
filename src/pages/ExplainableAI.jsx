import React, { useState, useRef } from "react";
import {
  AlertTriangle, BarChart3, Brain, Info,
  Loader2, Play, RefreshCw, Sparkles, ChevronDown,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from "recharts";
import Header from "../components/Header";
import { getExplainability } from "../services/api";
import { BENCHMARK_XAI_FEATURES } from "../data/demoData";

// ─── Constants ────────────────────────────────────────────────────────────────
const AVAILABLE_SECTORS = [
  { id: "healthcare_usd",                name: "Healthcare" },
  { id: "education_usd",                 name: "Education" },
  { id: "defence_usd",                   name: "Defence" },
  { id: "infrastructure_usd",            name: "Infrastructure" },
  { id: "research_and_development_usd",  name: "Research & Development" },
  { id: "agriculture_usd",               name: "Agriculture" },
  { id: "rural_development_usd",         name: "Rural Development" },
  { id: "social_welfare_freebies_usd",   name: "Social Welfare" },
  { id: "energy_usd",                    name: "Energy" },
  { id: "transport_usd",                 name: "Transport" },
  { id: "housing_urban_development_usd", name: "Housing & Urban Dev" },
  { id: "water_sanitation_usd",          name: "Water & Sanitation" },
  { id: "environment_climate_usd",       name: "Environment & Climate" },
  { id: "digital_it_usd",               name: "Digital & IT" },
  { id: "industry_msme_usd",            name: "Industry & MSME" },
];

const PALETTE = [
  "#22d3ee","#2dd4bf","#3b82f6","#a78bfa","#f472b6",
  "#fb923c","#fbbf24","#4ade80","#38bdf8","#818cf8",
  "#f87171","#34d399","#60a5fa","#e879f9","#facc15",
];

const MODEL_FEATURES = [
  { key: "population",                  label: "Population" },
  { key: "urban_population_percent",    label: "Urban population (%)" },
  { key: "gdp_usd",                     label: "GDP (USD)" },
  { key: "gdp_per_capita_usd",          label: "GDP per capita (USD)" },
  { key: "gdp_growth_percent",          label: "GDP growth (%)" },
  { key: "inflation_percent",           label: "Inflation (%)" },
  { key: "tax_revenue_usd",             label: "Tax revenue (USD)" },
  { key: "government_debt_usd",         label: "Government debt (USD)" },
  { key: "poverty_rate_percent",        label: "Poverty rate (%)" },
  { key: "unemployment_rate_percent",   label: "Unemployment rate (%)" },
  { key: "literacy_rate_percent",       label: "Literacy rate (%)" },
  { key: "life_expectancy_years",       label: "Life expectancy (years)" },
  { key: "health_expenditure_usd",      label: "Health expenditure (USD)" },
  { key: "internet_users_percent",      label: "Internet users (%)" },
  { key: "electricity_access_percent",  label: "Electricity access (%)" },
  { key: "co2_emissions",               label: "CO₂ emissions" },
  { key: "corruption_index",            label: "Corruption index" },
  { key: "government_effectiveness",    label: "Government effectiveness" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function emptyFeatureValues() {
  return Object.fromEntries(MODEL_FEATURES.map(({ key }) => [key, ""]));
}
function benchmarkFeatureValues() {
  return Object.fromEntries(
    MODEL_FEATURES.map(({ key }) => [
      key,
      BENCHMARK_XAI_FEATURES[key] !== undefined ? String(BENCHMARK_XAI_FEATURES[key]) : "",
    ])
  );
}

function normalizeResult(data) {
  const sourceRows = data?.explanations ?? data?.feature_explanations;
  if (!Array.isArray(sourceRows) || sourceRows.length === 0)
    throw new Error("Explainability API returned no feature explanations.");

  const rows = sourceRows.map((row) => {
    const feature          = row.feature ?? row.Feature;
    const featureValue     = row.feature_value ?? row["Feature Value"];
    const shapValue        = row.shap_value ?? row.shap_marginal_impact ?? row["SHAP Marginal Impact ($)"];
    const limeCoefficient  = row.lime_coefficient ?? row.lime_local_weight ?? row["LIME Local Weight (Coeff)"];

    if (
      typeof feature !== "string" || feature.trim() === "" ||
      featureValue == null || shapValue == null || limeCoefficient == null ||
      !Number.isFinite(Number(featureValue)) || !Number.isFinite(Number(shapValue)) ||
      !Number.isFinite(Number(limeCoefficient))
    ) throw new Error("Explainability API returned an invalid feature row.");

    return {
      feature,
      featureValue:    Number(featureValue),
      shapValue:       Number(shapValue),
      limeCoefficient: Number(limeCoefficient),
    };
  });

  // all_sectors from live API or benchmark fallback
  const allSectors = Array.isArray(data.all_sectors) ? data.all_sectors : [];
  const totalBudget = typeof data.total_budget === "number" ? data.total_budget
    : allSectors.reduce((s, x) => s + (x.predicted_amount ?? 0), 0);

  return {
    target:        data.target || "healthcare_usd",
    targetName:    data.target_name || AVAILABLE_SECTORS.find(s => s.id === data.target)?.name || data.target,
    prediction:    data.prediction != null && Number.isFinite(Number(data.prediction)) ? Number(data.prediction) : null,
    totalBudget,
    allSectors,
    source:        data.source || "live",
    offlineNotice: data.offlineNotice || null,
    rows:          rows.sort((a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue)),
  };
}

function formatUsd(value, compact = false) {
  if (compact) {
    if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  }
  return new Intl.NumberFormat(undefined, {
    style: "currency", currency: "USD", maximumSignificantDigits: 5,
  }).format(value);
}
function formatNumber(value) {
  return new Intl.NumberFormat(undefined, { maximumSignificantDigits: 4 }).format(value);
}

// ─── Custom chart tooltips ────────────────────────────────────────────────────
function SectorBarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs shadow-lg">
      <div className="font-semibold text-white mb-0.5">{d.name}</div>
      <div className="text-slate-300">{formatUsd(d.predicted_amount, true)}</div>
      <div className="text-slate-500">{d.percentage?.toFixed(1)}% of total</div>
    </div>
  );
}

function ShapBarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs shadow-lg max-w-[220px]">
      <div className="font-semibold text-white mb-1">{d.feature}</div>
      <div className={d.shapValue >= 0 ? "text-emerald-300" : "text-rose-300"}>
        SHAP: {formatUsd(d.shapValue, true)}
      </div>
      <div className="text-slate-400">LIME coef: {formatNumber(d.limeCoefficient)}</div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ExplainableAI() {
  const [features, setFeatures]       = useState(benchmarkFeatureValues);
  const [selectedSector, setSelectedSector] = useState("healthcare_usd");
  const [result, setResult]           = useState(null);
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [sectorOpen, setSectorOpen]   = useState(false);
  const sectorRef = useRef(null);

  function updateFeature(key, value) {
    setFeatures((c) => ({ ...c, [key]: value }));
  }

  async function submitExplanation(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    const numericFeatures = {};
    for (const { key, label } of MODEL_FEATURES) {
      const value = features[key].trim();
      if (value === "" || !Number.isFinite(Number(value))) {
        setError(`Enter a valid numeric value for "${label}".`);
        return;
      }
      numericFeatures[key] = Number(value);
    }

    setLoading(true);
    try {
      const response = await getExplainability(numericFeatures, selectedSector);
      setResult(normalizeResult(response));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load model explanations.");
    } finally {
      setLoading(false);
    }
  }

  // When sector changes in dropdown, auto-re-run if we already have a result
  async function changeSector(sectorId) {
    setSelectedSector(sectorId);
    setSectorOpen(false);

    if (!result) return; // No current result – nothing to re-run

    const numericFeatures = {};
    for (const { key } of MODEL_FEATURES) {
      const value = features[key].trim();
      if (value === "" || !Number.isFinite(Number(value))) return; // can't re-run with missing values
      numericFeatures[key] = Number(value);
    }

    setLoading(true);
    setError("");
    try {
      const response = await getExplainability(numericFeatures, sectorId);
      setResult(normalizeResult(response));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load model explanations.");
    } finally {
      setLoading(false);
    }
  }

  const maxAbsShap = result ? Math.max(...result.rows.map((r) => Math.abs(r.shapValue)), 1) : 1;
  const selectedSectorName = AVAILABLE_SECTORS.find(s => s.id === selectedSector)?.name || selectedSector;

  // Prepare chart data
  const sectorChartData = result?.allSectors?.slice()
    .sort((a, b) => b.predicted_amount - a.predicted_amount) ?? [];

  const shapBarData = result ? result.rows.slice(0, 10) : [];

  return (
    <div>
      <Header
        title="Explainable AI — All Sectors"
        subtitle="Select any of the 15 budget sectors. Predictions, SHAP contributions, and LIME coefficients all update live for your input."
        badge={<span className="badge-implemented">SHAP + LIME · 15 Sectors</span>}
      />

      {/* Info banner */}
      <div className="glass-card p-4 mb-6 flex items-start gap-3 border-cyan-500/20 bg-cyan-500/[0.03]">
        <Brain className="w-4 h-4 text-cyan-300 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-300 leading-relaxed">
          Each sector uses its own trained XGBoost model. TreeSHAP values show each feature's
          contribution in USD towards the selected sector's budget. LIME local-surrogate coefficients
          use standardized feature units. These are model explanations — not causal effects or policy decisions.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={submitExplanation} className="glass-card p-5 mb-6">
        {/* Header row: title + sector dropdown */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-sm font-semibold text-white">Socioeconomic inputs</h2>
            <p className="text-xs text-slate-500 mt-1">18 predictors used by the XGBoost models, in original units.</p>
          </div>

          {/* Sector selector */}
          <div className="relative" ref={sectorRef}>
            <button
              type="button"
              onClick={() => setSectorOpen((o) => !o)}
              className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/40 text-cyan-200 font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-cyan-500/20 transition-colors min-w-[220px] justify-between"
            >
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                {selectedSectorName}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${sectorOpen ? "rotate-180" : ""}`} />
            </button>
            {sectorOpen && (
              <div className="absolute right-0 top-full mt-1 z-50 w-64 bg-slate-900 border border-white/10 rounded-xl shadow-xl overflow-hidden">
                <div className="max-h-72 overflow-y-auto">
                  {AVAILABLE_SECTORS.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => changeSector(s.id)}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-white/[0.05] transition-colors ${s.id === selectedSector ? "text-cyan-300 bg-cyan-500/[0.08]" : "text-slate-300"}`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                      />
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 18-feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {MODEL_FEATURES.map(({ key, label }) => (
            <label key={key} className="flex flex-col gap-1.5 text-xs">
              <span className="text-slate-400">{label}</span>
              <input
                type="number"
                step="any"
                required
                value={features[key]}
                onChange={(e) => updateFeature(key, e.target.value)}
                placeholder={key}
                className="bg-navy-800/80 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/50"
              />
            </label>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-5">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-navy-950 font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {loading ? "Computing…" : `Explain — ${selectedSectorName}`}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => { setFeatures(benchmarkFeatureValues()); setError(""); }}
            className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            Load Benchmark
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => { setFeatures(emptyFeatureValues()); setResult(null); setError(""); }}
            className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] text-slate-300 font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-white/[0.07] transition-colors disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            Clear
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div role="alert" className="glass-card p-4 mb-6 flex items-start gap-3 border-rose-500/20 bg-rose-500/[0.04]">
          <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
          <p className="text-xs text-rose-200 leading-relaxed">{error}</p>
        </div>
      )}

      {/* Offline notice */}
      {result?.offlineNotice && (
        <div role="status" className="glass-card p-4 mb-6 flex items-start gap-3 border-amber-500/20 bg-amber-500/[0.04]">
          <Info className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-200 leading-relaxed">{result.offlineNotice}</p>
        </div>
      )}

      {result ? (
        <>
          {/* ── Summary Cards ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Selected sector prediction */}
            <div className="glass-card p-5 col-span-1">
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-300" />
                {result.targetName} Allocation
              </div>
              <div className="text-xl font-bold text-white">
                {result.prediction !== null ? formatUsd(result.prediction, true) : "—"}
              </div>
              {result.totalBudget > 0 && result.prediction !== null && (
                <div className="text-xs text-slate-500 mt-1">
                  {((result.prediction / result.totalBudget) * 100).toFixed(1)}% of predicted total
                </div>
              )}
            </div>

            {/* Total budget */}
            <div className="glass-card p-5 col-span-1">
              <div className="text-xs text-slate-400 mb-1">Total Budget (All Sectors)</div>
              <div className="text-xl font-bold text-white">
                {result.totalBudget > 0 ? formatUsd(result.totalBudget, true) : "—"}
              </div>
              <div className="text-xs text-slate-500 mt-1">Sum across all 15 sectors</div>
            </div>

            {/* Top SHAP driver */}
            {result.rows[0] && (
              <div className="glass-card p-5 col-span-1">
                <div className="text-xs text-slate-400 mb-1">Top SHAP Driver</div>
                <div className="text-sm font-semibold text-white truncate">{result.rows[0].feature}</div>
                <div className={`text-lg font-bold mt-0.5 ${result.rows[0].shapValue >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                  {formatUsd(result.rows[0].shapValue, true)}
                </div>
              </div>
            )}

            {/* Model engine */}
            <div className="glass-card p-5 col-span-1">
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-teal-300" />
                Model Engine
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full shrink-0 ${result.source === "live" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                <span className="text-sm font-semibold text-white">
                  {result.source === "live" ? "Live XGBoost" : "Benchmark"}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">SHAP + LIME · 15-sector model</div>
            </div>
          </div>

          {/* ── Sector Predictions Chart ───────────────────────────────────── */}
          {sectorChartData.length > 0 && (
            <div className="glass-card p-5 mb-6">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-white">All-Sector Budget Predictions</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Predicted allocation for all 15 sectors based on current input. Click sector dropdown to switch explanation target.
                </p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={sectorChartData} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => formatUsd(v, true)}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={130}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<SectorBarTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="predicted_amount" radius={[0, 4, 4, 0]}>
                    {sectorChartData.map((entry, i) => {
                      const idx = AVAILABLE_SECTORS.findIndex(s => s.id === entry.target);
                      const isSelected = entry.target === result.target;
                      return (
                        <Cell
                          key={entry.target}
                          fill={PALETTE[idx >= 0 ? idx : i]}
                          opacity={isSelected ? 1 : 0.55}
                          stroke={isSelected ? "#ffffff" : "none"}
                          strokeWidth={isSelected ? 1 : 0}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ── SHAP Top-10 Bar Chart ──────────────────────────────────────── */}
          <div className="glass-card p-5 mb-6">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-white">
                Top 10 SHAP Contributions — {result.targetName}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                TreeSHAP marginal impact in USD for the selected sector model. Green = pushes allocation up; red = pulls it down.
              </p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={shapBarData} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(v) => formatUsd(v, true)}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="feature"
                  type="category"
                  width={145}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ShapBarTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="shapValue" radius={[0, 4, 4, 0]}>
                  {shapBarData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.shapValue >= 0 ? "#34d399" : "#f87171"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── Full Explanation Table ─────────────────────────────────────── */}
          <div className="glass-card p-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-white">
                Full Feature Explanation — {result.targetName}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                All 18 features sorted by absolute SHAP impact. LIME coefficients are in standardized units.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="text-left px-3 py-2">Feature</th>
                    <th className="text-right px-3 py-2">Input Value</th>
                    <th className="text-left px-3 py-2">TreeSHAP (USD)</th>
                    <th className="text-right px-3 py-2">LIME Coefficient</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row) => (
                    <tr key={row.feature} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-3 py-3 text-white font-medium">{row.feature}</td>
                      <td className="px-3 py-3 text-right text-slate-300 tabular-nums">
                        {formatNumber(row.featureValue)}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <span className={`w-24 shrink-0 text-right tabular-nums text-xs font-medium ${row.shapValue >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                            {formatUsd(row.shapValue, true)}
                          </span>
                          <div className="h-1.5 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${row.shapValue >= 0 ? "bg-emerald-400" : "bg-rose-400"}`}
                              style={{ width: `${(Math.abs(row.shapValue) / maxAbsShap) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className={`px-3 py-3 text-right tabular-nums text-xs ${row.limeCoefficient >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {formatNumber(row.limeCoefficient)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        !loading && !error && (
          <div className="glass-card p-10 text-center">
            <Brain className="w-10 h-10 text-slate-600 mx-auto mb-4" />
            <p className="text-sm font-medium text-slate-300 mb-1">Ready to explain any sector</p>
            <p className="text-xs text-slate-500">
              Pick a sector from the dropdown, fill in the 18 socioeconomic inputs (or load the benchmark profile), then click <strong className="text-cyan-400">Explain</strong>.
            </p>
            <p className="text-xs text-slate-600 mt-3">
              Backend: <code className="text-slate-400">POST /api/explainability</code> · 15-sector XGBoost model
            </p>
          </div>
        )
      )}
    </div>
  );
}
