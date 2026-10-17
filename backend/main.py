from __future__ import annotations

from contextlib import asynccontextmanager
from dataclasses import dataclass
import os
from pathlib import Path
from typing import Literal

import numpy as np
import pandas as pd
import shap
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from sklearn.linear_model import Ridge
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from xgboost import XGBRegressor

FEATURE_COLUMNS = [
    "population",
    "urban_population_percent",
    "gdp_usd",
    "gdp_per_capita_usd",
    "gdp_growth_percent",
    "inflation_percent",
    "tax_revenue_usd",
    "government_debt_usd",
    "poverty_rate_percent",
    "unemployment_rate_percent",
    "literacy_rate_percent",
    "life_expectancy_years",
    "health_expenditure_usd",
    "internet_users_percent",
    "electricity_access_percent",
    "co2_emissions",
    "corruption_index",
    "government_effectiveness",
]

AVAILABLE_SECTORS: dict[str, str] = {
    "healthcare_usd": "Healthcare",
    "education_usd": "Education",
    "defence_usd": "Defence",
    "infrastructure_usd": "Infrastructure",
    "research_and_development_usd": "Research & Development",
    "agriculture_usd": "Agriculture",
    "rural_development_usd": "Rural Development",
    "social_welfare_freebies_usd": "Social Welfare",
    "energy_usd": "Energy",
    "transport_usd": "Transport",
    "housing_urban_development_usd": "Housing & Urban Development",
    "water_sanitation_usd": "Water & Sanitation",
    "environment_climate_usd": "Environment & Climate",
    "digital_it_usd": "Digital & IT",
    "industry_msme_usd": "Industry & MSME",
}

DEFAULT_TARGET = "healthcare_usd"
DATASET_PATH = (
    Path(__file__).resolve().parents[1]
    / "dataset"
    / "ML_Budget_Dataset_WorldBank_Completed (1).xlsx"
)


class HealthcareFeatures(BaseModel):
    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)

    population: float
    urban_population_percent: float
    gdp_usd: float
    gdp_per_capita_usd: float
    gdp_growth_percent: float
    inflation_percent: float
    tax_revenue_usd: float
    government_debt_usd: float
    poverty_rate_percent: float
    unemployment_rate_percent: float
    literacy_rate_percent: float
    life_expectancy_years: float
    health_expenditure_usd: float
    internet_users_percent: float
    electricity_access_percent: float
    co2_emissions: float
    corruption_index: float
    government_effectiveness: float


class ExplainabilityRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)

    target: str = DEFAULT_TARGET
    features: HealthcareFeatures


@dataclass
class ModelBundle:
    models: dict[str, XGBRegressor]
    explainers: dict[str, shap.TreeExplainer]
    scaler: StandardScaler
    X_train: pd.DataFrame

    def get_explainer(self, target: str) -> shap.TreeExplainer:
        if target not in self.explainers:
            self.explainers[target] = shap.TreeExplainer(
                self.models[target],
                feature_perturbation="tree_path_dependent",
            )
        return self.explainers[target]


def load_model_bundle() -> ModelBundle:
    if not DATASET_PATH.is_file():
        raise RuntimeError(f"Required XGBoost training dataset not found: {DATASET_PATH}")

    dataset = pd.read_excel(DATASET_PATH, sheet_name="Completed_Dataset")
    target_columns = list(AVAILABLE_SECTORS.keys())
    required_columns = [*FEATURE_COLUMNS, *target_columns]
    missing_columns = sorted(set(required_columns) - set(dataset.columns))
    if missing_columns:
        raise RuntimeError(f"Training dataset is missing columns: {', '.join(missing_columns)}")

    clean_data = dataset[required_columns].replace([np.inf, -np.inf], np.nan).dropna()
    if clean_data.empty:
        raise RuntimeError("No complete, finite training rows are available in the dataset.")

    X_train, _, y_train, _ = train_test_split(
        clean_data[FEATURE_COLUMNS],
        clean_data[target_columns],
        test_size=0.20,
        random_state=42,
    )

    models: dict[str, XGBRegressor] = {}
    explainers: dict[str, shap.TreeExplainer] = {}

    for target in target_columns:
        model = XGBRegressor(
            objective="reg:squarederror",
            n_estimators=100,
            learning_rate=0.08,
            max_depth=5,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            n_jobs=-1,
        )
        model.fit(X_train, y_train[target])
        models[target] = model

    # Pre-initialize healthcare explainer
    explainers[DEFAULT_TARGET] = shap.TreeExplainer(
        models[DEFAULT_TARGET],
        feature_perturbation="tree_path_dependent",
    )

    return ModelBundle(
        models=models,
        explainers=explainers,
        scaler=StandardScaler().fit(X_train),
        X_train=X_train,
    )


model_bundle: ModelBundle | None = None


@asynccontextmanager
async def lifespan(_: FastAPI):
    global model_bundle
    model_bundle = load_model_bundle()
    yield
    model_bundle = None


app = FastAPI(
    title="GovAllocXAI Explainability API",
    description="Multi-sector government budget prediction with SHAP and LIME explanations.",
    version="1.1.0",
    lifespan=lifespan,
)

frontend_origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGINS", "").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        *frontend_origins,
    ],
    allow_origin_regex=(
        r"http://(localhost|127\.0\.0\.1)(:\d+)?"
        r"|https://[a-zA-Z0-9-]+\.onrender\.com"
    ),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check() -> dict[str, object]:
    return {
        "status": "ok" if model_bundle is not None else "initializing",
        "model": "xgboost-multi-sector",
        "sectors_count": len(model_bundle.models) if model_bundle else 0,
        "available_sectors": list(AVAILABLE_SECTORS.keys()),
    }


@app.get("/api/sectors")
def get_sectors() -> list[dict[str, str]]:
    return [
        {"id": key, "name": name}
        for key, name in AVAILABLE_SECTORS.items()
    ]


@app.post("/api/explainability")
def explain_prediction(request: ExplainabilityRequest) -> dict[str, object]:
    if model_bundle is None:
        raise HTTPException(status_code=503, detail="The XGBoost models are not ready.")

    target = request.target
    if target not in AVAILABLE_SECTORS:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown sector target '{target}'. Available targets: {list(AVAILABLE_SECTORS.keys())}",
        )

    model = model_bundle.models[target]
    explainer = model_bundle.get_explainer(target)

    feature_values = request.features.model_dump()
    instance = pd.DataFrame(
        [[feature_values[column] for column in FEATURE_COLUMNS]],
        columns=FEATURE_COLUMNS,
    )

    prediction = float(model.predict(instance)[0])

    shap_values = np.asarray(explainer.shap_values(instance))
    if shap_values.ndim == 2:
        shap_values = shap_values[0]
    if shap_values.shape != (len(FEATURE_COLUMNS),):
        raise HTTPException(
            status_code=500,
            detail="The SHAP explainer returned an unexpected value shape.",
        )

    instance_scaled = model_bundle.scaler.transform(instance)
    random_state = np.random.RandomState(42)
    noise = random_state.normal(
        0,
        0.1,
        size=(1000, len(FEATURE_COLUMNS)),
    )
    samples_scaled = instance_scaled + noise
    samples = pd.DataFrame(
        model_bundle.scaler.inverse_transform(samples_scaled),
        columns=FEATURE_COLUMNS,
    )
    sample_predictions = model.predict(samples)
    distances = np.linalg.norm(samples_scaled - instance_scaled, axis=1)
    weights = np.exp(-(distances**2) / (2 * 0.1**2))

    lime_model = Ridge(alpha=1.0)
    lime_model.fit(samples_scaled, sample_predictions, sample_weight=weights)

    explanations = [
        {
            "feature": feature,
            "feature_value": float(feature_values[feature]),
            "shap_value": float(shap_value),
            "lime_coefficient": float(lime_coefficient),
        }
        for feature, shap_value, lime_coefficient in zip(
            FEATURE_COLUMNS,
            shap_values,
            lime_model.coef_,
            strict=True,
        )
    ]

    if not np.isfinite(prediction) or any(
        not np.isfinite(row[key])
        for row in explanations
        for key in ("feature_value", "shap_value", "lime_coefficient")
    ):
        raise HTTPException(
            status_code=500,
            detail="The model produced non-finite prediction or explanation values.",
        )

    explanations.sort(key=lambda row: abs(row["shap_value"]), reverse=True)

    # Compute predictions across all sectors for the current input
    all_sectors = []
    for s_target, s_name in AVAILABLE_SECTORS.items():
        s_pred = max(0.0, float(model_bundle.models[s_target].predict(instance)[0]))
        all_sectors.append({
            "target": s_target,
            "name": s_name,
            "predicted_amount": s_pred,
        })
    total_budget = sum(item["predicted_amount"] for item in all_sectors)
    for item in all_sectors:
        item["percentage"] = round((item["predicted_amount"] / total_budget * 100) if total_budget > 0 else 0, 2)

    return {
        "target": target,
        "target_name": AVAILABLE_SECTORS[target],
        "prediction": prediction,
        "total_budget": total_budget,
        "all_sectors": all_sectors,
        "explanations": explanations,
    }
