// =========================================================================
// api.js — Backend-ready API service layer
// -------------------------------------------------------------------------
// Most functions below mock responses from the Flask/FastAPI + ML backend
// using data from demoData.js. Explainability uses the live API because the
// explanation values must come from the trained model.
// =========================================================================

import {
  SECTOR_ALLOCATIONS_DEMO,
  TOTAL_PREDICTED_BUDGET_DEMO,
  MODEL_METRICS,
  SYSTEM_METRICS,
  SDG_DEFINITIONS,
  BENCHMARK_XAI_RESULT,
  BENCHMARK_ALL_SECTORS,
} from "../data/demoData";

const USE_MOCK = true; // applies to the demo endpoints, not explainability
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://govallocxai.onrender.com/api"
).replace(/\/+$/, "");

function simulateDelay(ms = 900) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Small deterministic-ish jitter so repeated "predictions" don't look static
function jitter(value, pct = 0.04) {
  const delta = value * pct * (Math.random() * 2 - 1);
  return value + delta;
}

/**
 * POST /api/predict-budget
 * Input:  { socioeconomic_features }
 * Output: { total_budget, sector_allocations, model_metrics, sdg_alignment }
 */
export async function predictBudget(socioeconomicFeatures) {
  if (USE_MOCK) {
    await simulateDelay(1400);
    const total = Math.round(jitter(TOTAL_PREDICTED_BUDGET_DEMO, 0.05));
    const sectorAllocations = SECTOR_ALLOCATIONS_DEMO.map((s) => {
      const pct = Math.max(0.5, jitter(s.percentage, 0.08));
      return {
        ...s,
        percentage: Number(pct.toFixed(1)),
        amount: Math.round((total * pct) / 100),
      };
    });

    return {
      total_budget: total,
      sector_allocations: sectorAllocations,
      model_metrics: MODEL_METRICS,
      sdg_alignment: Object.keys(SDG_DEFINITIONS),
      meta: {
        source: "demo",
        note: "Generated from demo logic using synthetic experimental data. Not a validated real-world budget outcome.",
        input_echo: socioeconomicFeatures,
      },
    };
  }

  // --- Real backend call (uncomment when Flask/FastAPI is available) ---
  // const response = await fetch(`${API_BASE_URL}/predict-budget`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ socioeconomic_features: socioeconomicFeatures }),
  // });
  // if (!response.ok) throw new Error("predict-budget request failed");
  // return response.json();
}

/**
 * POST /api/predict-allocation
 */
export async function predictAllocation(totalBudget, socioeconomicFeatures) {
  if (USE_MOCK) {
    await simulateDelay(700);
    return SECTOR_ALLOCATIONS_DEMO.map((s) => ({
      ...s,
      amount: Math.round((totalBudget * s.percentage) / 100),
    }));
  }
  // const response = await fetch(`${API_BASE_URL}/predict-allocation`, { ... });
  // return response.json();
}

/**
 * POST /api/model-comparison
 */
export async function getModelComparison() {
  if (USE_MOCK) {
    await simulateDelay(400);
    return {
      metrics: MODEL_METRICS,
      system_metrics: SYSTEM_METRICS,
    };
  }
  // const response = await fetch(`${API_BASE_URL}/model-comparison`, { method: "POST" });
  // return response.json();
}

/**
 * GET /api/sector-allocation
 */
export async function getSectorAllocation() {
  if (USE_MOCK) {
    await simulateDelay(400);
    return SECTOR_ALLOCATIONS_DEMO;
  }
  // const response = await fetch(`${API_BASE_URL}/sector-allocation`);
  // return response.json();
}

/**
 * GET /api/sdg-impact
 */
export async function getSdgImpact() {
  if (USE_MOCK) {
    await simulateDelay(400);
    return SDG_DEFINITIONS;
  }
  // const response = await fetch(`${API_BASE_URL}/sdg-impact`);
  // return response.json();
}

/**
 * POST /api/explainability
 * Input: { target, features } using the XGBoost notebook's feature names.
 */
export async function getExplainability(features, target = "healthcare_usd") {
  const candidateUrls = [
    `${API_BASE_URL}/explainability`,
    "http://127.0.0.1:8000/api/explainability",
    "http://localhost:8000/api/explainability",
  ];

  for (const url of candidateUrls) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, features }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          ...data,
          source: "live",
        };
      }
    } catch {
      // Try next candidate URL
    }
  }

  // Graceful fallback to pre-computed XGBoost model benchmark explanations (SHAP & LIME)
  // if backend server is unreachable
  const targetSectorItem = BENCHMARK_ALL_SECTORS.find((s) => s.target === target) || BENCHMARK_ALL_SECTORS[0];
  const explanations = BENCHMARK_XAI_RESULT.explanations.map((exp) => ({
    ...exp,
    feature_value:
      features && features[exp.feature] !== undefined && features[exp.feature] !== ""
        ? Number(features[exp.feature])
        : exp.feature_value,
  }));

  const totalBudget = BENCHMARK_ALL_SECTORS.reduce((sum, s) => sum + s.predicted_amount, 0);

  return {
    target: target || "healthcare_usd",
    target_name: targetSectorItem.name,
    prediction: targetSectorItem.predicted_amount,
    total_budget: totalBudget,
    all_sectors: BENCHMARK_ALL_SECTORS,
    source: "benchmark",
    offlineNotice: "Backend server not responding. Displaying benchmark XGBoost model explanations (SHAP & LIME). To enable live inferences, start backend via 'npm run backend'.",
    explanations,
  };
}

// Simulated multi-stage pipeline progress used by the Budget Prediction page
// to show "Running XGBoost...", "Running CatBoost...", etc.
export const PREDICTION_STAGES = [
  "Processing socioeconomic indicators...",
  "Running XGBoost...",
  "Running CatBoost...",
  "Generating hybrid prediction...",
  "Calculating sector allocation...",
];

export async function runPredictionPipeline(onStageChange) {
  for (let i = 0; i < PREDICTION_STAGES.length; i++) {
    onStageChange?.(i, PREDICTION_STAGES[i]);
    await simulateDelay(650);
  }
}
