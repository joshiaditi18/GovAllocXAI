# GovAllocXAI — Government Budget Intelligence Dashboard

Frontend for **"Intelligent Government Budget Management: An Explainable AI
Framework for Strategic and Sustainable Resource Allocation"** (Aavishkar
2026–27), demonstrating the **GovAllocXAI** research framework.

This is a React frontend using realistic demo data for the dashboard and a
FastAPI + XGBoost backend for live SHAP/LIME explanations of the healthcare
allocation model.

## 1. Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).
Use Python 3.10 or later. To use the live Explainable AI page, start the
backend in a second terminal:

```bash
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.main:app --reload --port 8000
```

The backend trains the healthcare XGBoost model from
`dataset/ML_Budget_Dataset_WorldBank_Completed (1).xlsx` during startup. Wait
for the server startup message before requesting an explanation. Its health
endpoint is `http://localhost:8000/api/health`.

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
    api.js         Mock data services plus the live explainability API client
  App.jsx          Routing + layout
  main.jsx         Entry point
backend/
  main.py          FastAPI app, healthcare XGBoost model, SHAP and LIME
  requirements.txt Python backend dependencies
```

## 3. Where demo data lives

Everything is centralized in `src/data/demoData.js`:

- Model metrics (XGBoost / CatBoost / Hybrid R², MAE, RMSE) and system-level
  R² values are the **exact values reported in the research paper** — do not
  change these without updating the source paper values.
- Sector allocations, socioeconomic input defaults, SDG matrix, and training
  times are **illustrative/synthetic**, and
  are labeled `source: "demo"` throughout the file and in the UI (badges like
  "Demo Data" and "Illustrative / High-Level SDG Alignment").

## 4. Connecting a real Flask/FastAPI backend

All backend calls are centralized in `src/services/api.js`. Most endpoints
currently return mocked data derived from `demoData.js`; the Explainable AI
page calls its backend endpoint directly. Configure `VITE_API_BASE_URL` to the
backend API base URL, including `/api`. During local development it defaults
to `/api`, which Vite proxies to `http://127.0.0.1:8000`:

- `POST /api/predict-budget` — body `{ socioeconomic_features }`
- `POST /api/predict-allocation`
- `POST /api/model-comparison`
- `GET /api/sector-allocation`
- `GET /api/sdg-impact`
- `POST /api/explainability` — body `{ target, features }` → returns
  `{ target, prediction, explanations }`, where each explanation contains
  `feature`, `feature_value`, `shap_value`, and `lime_coefficient`.

No changes should be required in `pages/` or `components/` once the backend
is wired up, since they only ever import from `services/api.js`.

For production, `.env.production` points the frontend at the deployed Render
backend. Vite embeds this URL at build time, so rebuild/redeploy the frontend
after changing it. For a different backend URL, update `VITE_API_BASE_URL` in
`.env.production` (or configure that variable in your frontend hosting
provider).

The backend allows Render-hosted frontend origins. If your frontend is hosted
elsewhere, set `FRONTEND_ORIGINS` on the backend service to its exact origin
(for example, `https://your-app.example.com`).

### XGBoost explainability endpoint

The Explainable AI page submits the 18 feature names used by
`ml_models/xgboost (2).ipynb` for the `healthcare_usd` target. Inputs must use
the model's original units. Each response row includes numeric
`feature_value`, `shap_value`, and `lime_coefficient` fields along with its
`feature` name. The UI also accepts the notebook's display-column names:
`Feature`, `Feature Value`, `SHAP Marginal Impact ($)`, and
`LIME Local Weight (Coeff)`.

The backend fits the healthcare XGBoost regressor with the notebook's feature
columns, 80:20 split seed, and XGBoost hyperparameters. It returns TreeSHAP
contributions and LIME local-surrogate coefficients for the supplied feature
values. LIME coefficients use standardized feature units. The frontend
reports connection or response errors rather than substituting demo
explanations.

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
- `src/pages/ExplainableAI.jsx`: calls the live explainability endpoint and
  displays the returned SHAP marginal contributions and LIME coefficients.

## Research integrity notes

- The dataset is a synthetically constructed country-year panel (2000–2024,
  31 countries, 775 rows, 59 columns, 44 predictors, 15 target sectors) based
  on established international indicator taxonomies and plausible ranges —
  **not real government budget data**.
- The XGBoost notebook includes an example SHAP/LIME explanation workflow for
  healthcare allocation. The frontend's backend serves live explanations for
  that target; other targets are not exposed by this endpoint yet.
- SDG mapping is **illustrative / high-level**, not a formally validated SDG
  indicator assessment.
- The system is a **decision-support demonstration**, not an autonomous
  government budgeting system; all recommendation pages carry a "Human
  Approval Required" / "Decision Support Only" disclaimer.
