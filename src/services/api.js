// =========================================================================
// api.js — Backend-ready API service layer
// -------------------------------------------------------------------------
// Every function below MOCKS the response of a real Flask/FastAPI + ML
// backend using data from demoData.js. When a real backend is available,
// replace the body of each function with the corresponding `fetch()` call
// (already sketched in comments) — the function signatures and return
// shapes are designed to match what the real API should return, so no
// changes should be needed in the pages/components that call them.
// =========================================================================

import {
  SECTOR_ALLOCATIONS_DEMO,
  TOTAL_PREDICTED_BUDGET_DEMO,
  MODEL_METRICS,
  SYSTEM_METRICS,
  SDG_DEFINITIONS,
  XAI_DEMO_FEATURES,
} from "../data/demoData";

const USE_MOCK = true; // flip to false once a real backend is connected
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

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
 * GET /api/explainability
 * NOTE: real SHAP/LIME integration is PLANNED / FUTURE WORK. This mock
 * mirrors the intended future response shape so the frontend does not
 * need to change once real explainability is wired up.
 */
export async function getExplainability() {
  if (USE_MOCK) {
    await simulateDelay(500);
    return {
      status: "planned",
      note: "DEMO EXPLANATION — SHAP INTEGRATION PENDING",
      features: XAI_DEMO_FEATURES,
    };
  }
  // const response = await fetch(`${API_BASE_URL}/explainability`);
  // return response.json();
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
