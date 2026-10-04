// =========================================================================
// demoData.js — Centralized demo/mock dataset for GovAllocXAI
// -------------------------------------------------------------------------
// IMPORTANT (research integrity):
// Values explicitly reported in the research paper (model R², MAE, RMSE for
// XGBoost / CatBoost / Hybrid, Total Budget Predictor R², Autonomous
// Allocation System R², SDG-aligned overall model R², dataset dimensions)
// are marked with `source: "research"`.
//
// All other values (sector amounts, socioeconomic inputs, SDG matrix
// weighting, training time, etc.) are
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
    "SHAP marginal-contribution approximation",
    "LIME local surrogate",
    "SDG mapping",
  ],
  planned: [
    "SHAP/LIME explanations for all sector targets",
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

// -------------------------------------------------------------------------
// Benchmark XGBoost Explainability (SHAP & LIME) — Trained Model Data
// Source: Trained XGBoost model on WorldBank Completed Dataset (Row 0 of X_test)
// -------------------------------------------------------------------------
export const BENCHMARK_XAI_FEATURES = {
  population: 4564855,
  urban_population_percent: 77.26,
  gdp_usd: 229192678173,
  gdp_per_capita_usd: 50208,
  gdp_growth_percent: 1.1,
  inflation_percent: 2.49,
  tax_revenue_usd: 59340979068,
  government_debt_usd: 117279557368,
  poverty_rate_percent: 0.2,
  unemployment_rate_percent: 4.22,
  literacy_rate_percent: 90.38,
  life_expectancy_years: 79.39,
  health_expenditure_usd: 21070945894,
  internet_users_percent: 78.13,
  electricity_access_percent: 100.0,
  co2_emissions: 518716,
  corruption_index: 88.94,
  government_effectiveness: 2.83,
};

export const BENCHMARK_XAI_RESULT = {
  target: "healthcare_usd",
  prediction: 20076382208,
  source: "benchmark",
  explanations: [
    {
      feature: "health_expenditure_usd",
      feature_value: 21070945894,
      shap_value: -100692525056,
      lime_coefficient: 3932309975,
    },
    {
      feature: "government_debt_usd",
      feature_value: 117279557368,
      shap_value: -32829042688,
      lime_coefficient: 197875585,
    },
    {
      feature: "gdp_usd",
      feature_value: 229192678173,
      shap_value: -14838914048,
      lime_coefficient: 105826504,
    },
    {
      feature: "population",
      feature_value: 4564855,
      shap_value: -8587266560,
      lime_coefficient: 31649893,
    },
    {
      feature: "tax_revenue_usd",
      feature_value: 59340979068,
      shap_value: -7435858432,
      lime_coefficient: -666760894,
    },
    {
      feature: "urban_population_percent",
      feature_value: 77.26,
      shap_value: 1473667584,
      lime_coefficient: 270233949,
    },
    {
      feature: "co2_emissions",
      feature_value: 518716,
      shap_value: -932971840,
      lime_coefficient: 550966282,
    },
    {
      feature: "corruption_index",
      feature_value: 88.94,
      shap_value: 203575088,
      lime_coefficient: 669592805,
    },
    {
      feature: "unemployment_rate_percent",
      feature_value: 4.22,
      shap_value: -194976928,
      lime_coefficient: 554719950,
    },
    {
      feature: "gdp_per_capita_usd",
      feature_value: 50208,
      shap_value: 128414952,
      lime_coefficient: 391746566,
    },
    {
      feature: "gdp_growth_percent",
      feature_value: 1.1,
      shap_value: 116071504,
      lime_coefficient: -513358711,
    },
    {
      feature: "internet_users_percent",
      feature_value: 78.13,
      shap_value: 106623232,
      lime_coefficient: 428154162,
    },
    {
      feature: "poverty_rate_percent",
      feature_value: 0.2,
      shap_value: 105756728,
      lime_coefficient: -433471152,
    },
    {
      feature: "inflation_percent",
      feature_value: 2.49,
      shap_value: 100780568,
      lime_coefficient: 70183320,
    },
    {
      feature: "government_effectiveness",
      feature_value: 2.83,
      shap_value: 87356544,
      lime_coefficient: -197005374,
    },
    {
      feature: "literacy_rate_percent",
      feature_value: 90.38,
      shap_value: -76912376,
      lime_coefficient: -277556845,
    },
    {
      feature: "life_expectancy_years",
      feature_value: 79.39,
      shap_value: -70423520,
      lime_coefficient: -560921591,
    },
    {
      feature: "electricity_access_percent",
      feature_value: 100,
      shap_value: -814694,
      lime_coefficient: 476285406,
    },
  ],
};

export const BENCHMARK_ALL_SECTORS = [
  { target: "healthcare_usd", name: "Healthcare", predicted_amount: 20838768640, percentage: 25.21 },
  { target: "education_usd", name: "Education", predicted_amount: 15335211008, percentage: 18.55 },
  { target: "social_welfare_freebies_usd", name: "Social Welfare", predicted_amount: 8265477120, percentage: 10.00 },
  { target: "infrastructure_usd", name: "Infrastructure", predicted_amount: 5510315520, percentage: 6.67 },
  { target: "research_and_development_usd", name: "Research & Development", predicted_amount: 5512207360, percentage: 6.67 },
  { target: "transport_usd", name: "Transport", predicted_amount: 4132738560, percentage: 5.00 },
  { target: "energy_usd", name: "Energy", predicted_amount: 3464536064, percentage: 4.19 },
  { target: "housing_urban_development_usd", name: "Housing & Urban Dev", predicted_amount: 3099554560, percentage: 3.75 },
  { target: "defence_usd", name: "Defence", predicted_amount: 2953890816, percentage: 3.57 },
  { target: "agriculture_usd", name: "Agriculture", predicted_amount: 2755157760, percentage: 3.33 },
  { target: "rural_development_usd", name: "Rural Development", predicted_amount: 2410763008, percentage: 2.92 },
  { target: "industry_msme_usd", name: "Industry & MSME", predicted_amount: 2410763008, percentage: 2.92 },
  { target: "water_sanitation_usd", name: "Water & Sanitation", predicted_amount: 2066369280, percentage: 2.50 },
  { target: "environment_climate_usd", name: "Environment & Climate", predicted_amount: 1732268032, percentage: 2.10 },
  { target: "digital_it_usd", name: "Digital & IT", predicted_amount: 1377578880, percentage: 1.67 },
];
