// =========================================================================
// demoData.js — Centralized demo/mock dataset for GovAllocXAI
// -------------------------------------------------------------------------
// IMPORTANT (research integrity):
// Values explicitly reported in the research paper (model R², MAE, RMSE for
// XGBoost / CatBoost / Hybrid, Total Budget Predictor R², Autonomous
// Allocation System R², SDG-aligned overall model R², dataset dimensions)
// are marked with `source: "research"`.
//
// All other values (sector amounts, socioeconomic inputs, SHAP-style demo
// feature impacts, SDG matrix weighting, training time, etc.) are
// synthetic/illustrative and are marked with `source: "demo"`.
//
// Nothing in this file should be presented to a user as a validated,
// real-world government budget outcome.
// =========================================================================

export const PROJECT_META = {
  projectTitle:
    "Intelligent Government Budget Management: An Explainable AI Framework for Strategic and Sustainable Resource Allocation",
  paperTitle:
    "GovAllocXAI: An Explainable Hybrid Machine Learning Framework for Intelligent Government Budget Allocation",
  program: "Aavishkar 2026–27 Research Project",
};

// -------------------------------------------------------------------------
// Reported model metrics (source: research) — DO NOT MODIFY THESE VALUES
// -------------------------------------------------------------------------
export const MODEL_METRICS = {
  xgboost: { r2: 0.9948, mae: 0.123, rmse: 0.156, source: "research" },
  catboost: { r2: 0.9926, mae: 0.13, rmse: 0.16, source: "research" },
  hybrid: { r2: 0.9926, mae: 0.13, rmse: 0.16, source: "research" },
};

export const SYSTEM_METRICS = {
  totalBudgetPredictorR2: { value: 0.9143, source: "research" },
  autonomousAllocationR2: { value: 0.9051, source: "research" },
  sdgAlignedOverallR2: { value: 0.9823, source: "research" },
};

// Training time is not reported in the research — always labeled "Demo / simulated"
export const TRAINING_TIME_DEMO = {
  xgboost: { seconds: 4.2, label: "Demo / simulated", source: "demo" },
  catboost: { seconds: 6.8, label: "Demo / simulated", source: "demo" },
  hybrid: { seconds: 11.1, label: "Demo / simulated", source: "demo" },
};

// -------------------------------------------------------------------------
// Dataset summary (source: research)
// -------------------------------------------------------------------------
export const DATASET_SUMMARY = {
  type: "Country-Year Panel (synthetic, indicator-taxonomy based)",
  years: "2000–2024",
  countries: 31,
  rows: 775,
  columns: 59,
  predictors: 44,
  targetSectors: 15,
  source: "research",
};

// -------------------------------------------------------------------------
// 15 Target Budget Sectors (source: research — sector list; amounts: demo)
// -------------------------------------------------------------------------
export const SECTORS = [
  { id: "defence", name: "Defence", sdg: "SDG 16", priority: "High" },
  { id: "infrastructure", name: "Infrastructure", sdg: "SDG 9", priority: "High" },
  { id: "rnd", name: "R&D", sdg: "SDG 9", priority: "Medium" },
  { id: "education", name: "Education", sdg: "SDG 4", priority: "High" },
  { id: "healthcare", name: "Healthcare", sdg: "SDG 3", priority: "High" },
  { id: "agriculture", name: "Agriculture", sdg: "SDG 2", priority: "Medium" },
  { id: "rural", name: "Rural Development", sdg: "SDG 1", priority: "Medium" },
  { id: "welfare", name: "Social Welfare", sdg: "SDG 10", priority: "Medium" },
  { id: "energy", name: "Energy", sdg: "SDG 7", priority: "High" },
  { id: "transport", name: "Transport", sdg: "SDG 9", priority: "Medium" },
  { id: "housing", name: "Housing & Urban Development", sdg: "SDG 11", priority: "Medium" },
  { id: "water", name: "Water & Sanitation", sdg: "SDG 6", priority: "High" },
  { id: "environment", name: "Environment & Climate", sdg: "SDG 13", priority: "High" },
  { id: "digital", name: "Digital & IT", sdg: "SDG 9", priority: "Medium" },
  { id: "msme", name: "Industry & MSME", sdg: "SDG 8", priority: "Medium" },
];

// Demo allocation percentages (must sum to 100) — source: demo
const ALLOCATION_WEIGHTS = {
  defence: 13.5,
  infrastructure: 12.8,
  education: 11.2,
  healthcare: 10.6,
  rnd: 4.1,
  agriculture: 6.4,
  rural: 5.2,
  welfare: 6.8,
  energy: 6.1,
  transport: 5.6,
  housing: 5.0,
  water: 4.2,
  environment: 3.8,
  digital: 3.1,
  msme: 1.6,
};

export const TOTAL_PREDICTED_BUDGET_DEMO = 48_250_000_000; // USD, illustrative — source: demo

export const SECTOR_ALLOCATIONS_DEMO = SECTORS.map((s) => {
  const pct = ALLOCATION_WEIGHTS[s.id];
  return {
    ...s,
    percentage: pct,
    amount: Math.round((TOTAL_PREDICTED_BUDGET_DEMO * pct) / 100),
    source: "demo",
  };
});

// -------------------------------------------------------------------------
// Actual vs Predicted (illustrative time series) — source: demo
// -------------------------------------------------------------------------
export const ACTUAL_VS_PREDICTED_DEMO = [
  { year: 2019, actual: 38.2, predicted: 37.6 },
  { year: 2020, actual: 36.9, predicted: 37.4 },
  { year: 2021, actual: 39.8, predicted: 39.1 },
  { year: 2022, actual: 42.6, predicted: 42.9 },
  { year: 2023, actual: 45.1, predicted: 44.6 },
  { year: 2024, actual: 47.3, predicted: 47.9 },
].map((d) => ({ ...d, source: "demo" }));

// -------------------------------------------------------------------------
// Economic vs Environmental trade-off (illustrative) — source: demo
// -------------------------------------------------------------------------
export const ECON_ENV_TRADEOFF_DEMO = [
  { sector: "Defence", economic: 92, environmental: 18 },
  { sector: "Infrastructure", economic: 85, environmental: 45 },
  { sector: "Education", economic: 68, environmental: 55 },
  { sector: "Healthcare", economic: 62, environmental: 58 },
  { sector: "Agriculture", economic: 58, environmental: 62 },
  { sector: "Energy", economic: 70, environmental: 74 },
  { sector: "Environment & Climate", economic: 40, environmental: 96 },
  { sector: "Water & Sanitation", economic: 48, environmental: 82 },
  { sector: "Digital & IT", economic: 66, environmental: 38 },
  { sector: "Industry & MSME", economic: 74, environmental: 34 },
].map((d) => ({ ...d, source: "demo" }));

// -------------------------------------------------------------------------
// Socioeconomic input schema — 44 predictors organized into 4 groups
// (source: research — grouping/category structure; field list illustrative)
// -------------------------------------------------------------------------
export const INPUT_GROUPS = [
  {
    id: "economic",
    label: "Economic Indicators",
    color: "cyan",
    fields: [
      { key: "gdp", label: "GDP (USD Billion)", default: 420, min: 1, max: 25000, step: 1 },
      { key: "gdpGrowth", label: "GDP Growth Rate (%)", default: 4.2, min: -10, max: 15, step: 0.1 },
      { key: "incomePerCapita", label: "Income Per Capita (USD)", default: 8500, min: 200, max: 120000, step: 100 },
      { key: "inflation", label: "Inflation Rate (%)", default: 5.1, min: -5, max: 40, step: 0.1 },
      { key: "govDebt", label: "Government Debt (% of GDP)", default: 62, min: 0, max: 250, step: 1 },
      { key: "taxRevenue", label: "Tax Revenue (% of GDP)", default: 17.5, min: 2, max: 45, step: 0.1 },
      { key: "fiscalDeficit", label: "Fiscal Deficit (% of GDP)", default: 4.8, min: -5, max: 20, step: 0.1 },
      { key: "fdiInflow", label: "FDI Inflow (USD Billion)", default: 12.3, min: 0, max: 500, step: 0.1 },
      { key: "exportsGdp", label: "Exports (% of GDP)", default: 21.4, min: 0, max: 150, step: 0.1 },
      { key: "importsGdp", label: "Imports (% of GDP)", default: 24.1, min: 0, max: 150, step: 0.1 },
      { key: "unemploymentRate", label: "Unemployment Rate (%)", default: 6.3, min: 0, max: 40, step: 0.1 },
      { key: "interestRate", label: "Policy Interest Rate (%)", default: 6.0, min: 0, max: 30, step: 0.1 },
    ],
  },
  {
    id: "social",
    label: "Social Indicators",
    color: "teal",
    fields: [
      { key: "population", label: "Population (Millions)", default: 210, min: 0.1, max: 1500, step: 0.1 },
      { key: "populationGrowth", label: "Population Growth Rate (%)", default: 1.1, min: -2, max: 5, step: 0.1 },
      { key: "urbanPopulation", label: "Urban Population (%)", default: 45.2, min: 0, max: 100, step: 0.1 },
      { key: "literacyRate", label: "Literacy Rate (%)", default: 78.5, min: 20, max: 100, step: 0.1 },
      { key: "schoolEnrollment", label: "School Enrollment Rate (%)", default: 89.2, min: 20, max: 100, step: 0.1 },
      { key: "educationExpGdp", label: "Education Expenditure (% of GDP)", default: 3.6, min: 0, max: 12, step: 0.1 },
      { key: "lifeExpectancy", label: "Life Expectancy (Years)", default: 71.8, min: 40, max: 90, step: 0.1 },
      { key: "infantMortality", label: "Infant Mortality (per 1,000)", default: 24.6, min: 0, max: 120, step: 0.1 },
      { key: "healthExpGdp", label: "Health Expenditure (% of GDP)", default: 3.9, min: 0, max: 15, step: 0.1 },
      { key: "hospitalBeds", label: "Hospital Beds (per 1,000)", default: 2.1, min: 0, max: 15, step: 0.1 },
      { key: "povertyRate", label: "Poverty Rate (%)", default: 18.4, min: 0, max: 80, step: 0.1 },
      { key: "giniIndex", label: "Gini Index (Inequality)", default: 37.2, min: 15, max: 65, step: 0.1 },
    ],
  },
  {
    id: "environmental",
    label: "Environmental Indicators",
    color: "emerald",
    fields: [
      { key: "co2Emissions", label: "CO₂ Emissions (Mt)", default: 620, min: 0, max: 12000, step: 1 },
      { key: "renewableShare", label: "Renewable Energy Share (%)", default: 28.6, min: 0, max: 100, step: 0.1 },
      { key: "forestCover", label: "Forest Cover (%)", default: 21.3, min: 0, max: 100, step: 0.1 },
      { key: "avgTempAnomaly", label: "Avg. Temperature Anomaly (°C)", default: 1.1, min: -1, max: 4, step: 0.1 },
      { key: "waterStress", label: "Water Stress Index", default: 42, min: 0, max: 100, step: 1 },
      { key: "airQualityIndex", label: "Air Quality Index (AQI)", default: 118, min: 0, max: 400, step: 1 },
      { key: "wasteManagementRate", label: "Waste Management Rate (%)", default: 54, min: 0, max: 100, step: 1 },
      { key: "climateVulnerability", label: "Climate Vulnerability Index", default: 0.46, min: 0, max: 1, step: 0.01 },
      { key: "energyExpGdp", label: "Energy Sector Expenditure (% of GDP)", default: 2.4, min: 0, max: 10, step: 0.1 },
      { key: "protectedAreas", label: "Protected Land Area (%)", default: 12.6, min: 0, max: 60, step: 0.1 },
    ],
  },
  {
    id: "digital",
    label: "Digital / Infrastructure Indicators",
    color: "blue",
    fields: [
      { key: "internetPenetration", label: "Internet Penetration (%)", default: 58.3, min: 0, max: 100, step: 0.1 },
      { key: "mobileSubscriptions", label: "Mobile Subscriptions (per 100)", default: 92.4, min: 0, max: 200, step: 0.1 },
      { key: "digitalGovServices", label: "Digital Government Services Index", default: 0.52, min: 0, max: 1, step: 0.01 },
      { key: "roadDensity", label: "Road Density (km per 100 km²)", default: 84.5, min: 0, max: 500, step: 0.1 },
      { key: "electricityAccess", label: "Electricity Access (%)", default: 88.6, min: 0, max: 100, step: 0.1 },
      { key: "railDensity", label: "Rail Network Density Index", default: 0.41, min: 0, max: 1, step: 0.01 },
      { key: "techExports", label: "High-Tech Exports (% of manuf. exports)", default: 14.2, min: 0, max: 60, step: 0.1 },
      { key: "rndExpGdp", label: "R&D Expenditure (% of GDP)", default: 0.9, min: 0, max: 6, step: 0.05 },
      { key: "housingDeficit", label: "Housing Deficit Index", default: 0.38, min: 0, max: 1, step: 0.01 },
      { key: "urbanInfraIndex", label: "Urban Infrastructure Index", default: 0.55, min: 0, max: 1, step: 0.01 },
    ],
  },
];

// -------------------------------------------------------------------------
// Explainable AI — demo feature contribution table
// IMPORTANT: SHAP/LIME are PLANNED / FUTURE work in the research paper.
// This is a stand-in visualization only, clearly labeled as such.
// -------------------------------------------------------------------------
export const XAI_DEMO_FEATURES = [
  { feature: "GDP", impact: "High", direction: "Positive" },
  { feature: "Tax Revenue", impact: "High", direction: "Positive" },
  { feature: "Population", impact: "Medium", direction: "Positive" },
  { feature: "Inflation", impact: "Medium", direction: "Negative" },
  { feature: "Government Debt", impact: "Medium", direction: "Negative" },
  { feature: "Environmental Indicators", impact: "Medium", direction: "Positive" },
  { feature: "Literacy Rate", impact: "Medium", direction: "Positive" },
  { feature: "Unemployment Rate", impact: "Low", direction: "Negative" },
].map((d) => ({ ...d, source: "demo" }));

export const XAI_PIPELINE_STEPS = [
  "Socioeconomic Inputs",
  "ML Prediction",
  "Feature Contribution Analysis",
  "Sector Allocation",
  "Human-Interpretable Explanation",
];

// -------------------------------------------------------------------------
// SDG mapping — illustrative / high-level only (per research paper)
// -------------------------------------------------------------------------
export const SDG_DEFINITIONS = {
  "SDG 1": { title: "No Poverty", color: "#e5243b" },
  "SDG 2": { title: "Zero Hunger", color: "#dda63a" },
  "SDG 3": { title: "Good Health & Well-being", color: "#4c9f38" },
  "SDG 4": { title: "Quality Education", color: "#c5192d" },
  "SDG 6": { title: "Clean Water & Sanitation", color: "#26bde2" },
  "SDG 7": { title: "Affordable & Clean Energy", color: "#fcc30b" },
  "SDG 8": { title: "Decent Work & Economic Growth", color: "#a21942" },
  "SDG 9": { title: "Industry, Innovation & Infrastructure", color: "#fd6925" },
  "SDG 10": { title: "Reduced Inequalities", color: "#dd1367" },
  "SDG 11": { title: "Sustainable Cities & Communities", color: "#fd9d24" },
  "SDG 13": { title: "Climate Action", color: "#3f7e44" },
  "SDG 16": { title: "Peace, Justice & Strong Institutions", color: "#00689d" },
};

// -------------------------------------------------------------------------
// Methodology pipeline
// -------------------------------------------------------------------------
export const METHODOLOGY_PIPELINE = [
  "Data Collection",
  "Data Preprocessing",
  "Missing Value Handling",
  "Feature Engineering",
  "Train-Test Split (80:20)",
  "XGBoost + CatBoost",
  "Model Comparison",
  "Hybrid Ensemble",
  "15-Sector Prediction",
  "Budget Allocation",
  "SDG Alignment",
  "Explainability Integration",
  "Decision Support",
];

export const PREPROCESSING_STEPS = [
  "Median-based missing value imputation",
  "Deduplication",
  "Logical validation",
  "IQR-based outlier analysis",
  "Redundancy mitigation",
  "Feature analysis",
  "80:20 train-test split",
];

export const RESEARCH_STATUS = {
  implemented: [
    "Data preprocessing",
    "Feature analysis",
    "XGBoost",
    "CatBoost",
    "Hybrid modeling",
    "Multi-sector prediction",
    "Total budget prediction",
    "Allocation logic",
    "SDG mapping",
  ],
  planned: [
    "SHAP",
    "LIME",
    "Constrained optimization",
    "Real-world official budget validation",
    "Time-series validation",
    "Human-in-the-loop deployment",
  ],
};

export const AI_INSIGHT_DEMO =
  "Predicted allocation indicates a balanced distribution across infrastructure, education, healthcare and sustainability-oriented sectors. This is a demonstration recommendation generated from synthetic data — not an autonomous government decision.";

export const RECOMMENDATION_SUMMARY_DEMO =
  "Based on the provided socioeconomic indicators, the system generates a sector-wise budget allocation intended to balance economic development, social priorities and environmental sustainability.";

export const PRIORITY_GROUPS_DEMO = {
  economic: ["Infrastructure", "Digital & IT", "Industry & MSME", "Transport"],
  social: ["Education", "Healthcare", "Social Welfare", "Rural Development"],
  environmental: ["Environment & Climate", "Water & Sanitation", "Energy", "Agriculture"],
};
