# GovAllocXAI — Government Budget Intelligence Dashboard

Frontend for **"Intelligent Government Budget Management: An Explainable AI
Framework for Strategic and Sustainable Resource Allocation"** (Aavishkar
2026–27), demonstrating the **GovAllocXAI** research framework.

This is a fully functional React frontend running on **realistic demo data**.
It is structured so a real Flask/FastAPI + ML backend (XGBoost, CatBoost,
hybrid ensemble) can be plugged in later with minimal changes.

## 1. Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

Build for production:

```bash
npm run build
npm run preview
```

## 2. Folder structure

```
src/
  components/     Reusable UI: Sidebar, Header, KPICard, SectorChart,
                   ModelComparison, SDGCard, AllocationTable, AIInsight,
                   LoadingScreen, PipelineFlow
  pages/           One file per route (Dashboard, BudgetPrediction,
                   SectorAllocation, ModelPerformance, ExplainableAI,
                   SDGImpact, Recommendations, Methodology)
  data/
    demoData.js    ALL mock/demo values in one place, with each value
                   tagged source: "research" (exact reported metrics) or
                   source: "demo" (illustrative/synthetic)
  services/
    api.js         Mock API layer matching the intended backend contract
  App.jsx          Routing + layout
  main.jsx         Entry point
```

## 3. Where demo data lives

Everything is centralized in `src/data/demoData.js`:

- Model metrics (XGBoost / CatBoost / Hybrid R², MAE, RMSE) and system-level
  R² values are the **exact values reported in the research paper** — do not
  change these without updating the source paper values.
- Sector allocations, socioeconomic input defaults, SHAP-style demo feature
  impacts, SDG matrix, and training times are **illustrative/synthetic**, and
  are labeled `source: "demo"` throughout the file and in the UI (badges like
  "Demo Data", "Illustrative / High-Level SDG Alignment", "DEMO EXPLANATION —
  SHAP INTEGRATION PENDING").

## 4. Connecting a real Flask/FastAPI backend

All backend calls are centralized in `src/services/api.js`. Each exported
function currently returns mocked data derived from `demoData.js`. To connect
a real backend:

1. Set `USE_MOCK = false` at the top of `src/services/api.js`.
2. Set `VITE_API_BASE_URL` in a `.env` file (defaults to
   `http://localhost:8000/api`).
3. Uncomment the corresponding `fetch()` block in each function — the
   function signatures and return shapes already match the intended API
   contract:
   - `POST /api/predict-budget` — body `{ socioeconomic_features }` → returns
     `{ total_budget, sector_allocations, model_metrics, sdg_alignment }`
   - `POST /api/predict-allocation`
   - `POST /api/model-comparison`
   - `GET /api/sector-allocation`
   - `GET /api/sdg-impact`
   - `GET /api/explainability` (SHAP/LIME — planned/future backend work)

No changes should be required in `pages/` or `components/` once the backend
is wired up, since they only ever import from `services/api.js`.

## 5. What to replace when real XGBoost/CatBoost predictions are connected

- `src/services/api.js` → `predictBudget()`, `predictAllocation()`,
  `getModelComparison()`: replace mock bodies with real `fetch()` calls (see
  above).
- `src/data/demoData.js` → `MODEL_METRICS` / `SYSTEM_METRICS`: once live
  evaluation is available, these can be fetched from the backend instead of
  hardcoded (keep the current values as a fallback/reference).
- `src/pages/BudgetPrediction.jsx`: the `PREDICTION_STAGES` animation can stay
  as a UI loading sequence, but should be tied to real request/response
  timing (e.g. streaming stage updates via SSE/WebSocket) instead of fixed
  delays once a backend exists.
- `src/pages/ExplainableAI.jsx`: replace `XAI_DEMO_FEATURES` with real SHAP
  values from `GET /api/explainability` once SHAP/LIME are implemented
  server-side, and update the "Planned XAI Integration" badge accordingly.

## Research integrity notes

- The dataset is a synthetically constructed country-year panel (2000–2024,
  31 countries, 775 rows, 59 columns, 44 predictors, 15 target sectors) based
  on established international indicator taxonomies and plausible ranges —
  **not real government budget data**.
- SHAP/LIME explainability is **planned/future work**, not yet implemented —
  the Explainable AI page is clearly labeled as a demo/integration module.
- SDG mapping is **illustrative / high-level**, not a formally validated SDG
  indicator assessment.
- The system is a **decision-support demonstration**, not an autonomous
  government budgeting system; all recommendation pages carry a "Human
  Approval Required" / "Decision Support Only" disclaimer.
