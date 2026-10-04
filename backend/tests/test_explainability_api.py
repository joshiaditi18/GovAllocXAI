import pytest
from fastapi.testclient import TestClient

from backend.main import FEATURE_COLUMNS, app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_explainability_returns_model_prediction_and_both_explanations(client: TestClient) -> None:
    features = {feature: 1.0 for feature in FEATURE_COLUMNS}

    response = client.post(
        "/api/explainability",
        json={"target": "healthcare_usd", "features": features},
        headers={"Origin": "http://localhost:5173"},
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
    payload = response.json()
    assert payload["target"] == "healthcare_usd"
    assert isinstance(payload["prediction"], float)
    assert len(payload["explanations"]) == len(FEATURE_COLUMNS)
    assert {
        "feature",
        "feature_value",
        "shap_value",
        "lime_coefficient",
    } <= payload["explanations"][0].keys()


def test_explainability_rejects_missing_features(client: TestClient) -> None:
    response = client.post(
        "/api/explainability",
        json={"target": "healthcare_usd", "features": {"population": 1.0}},
    )

    assert response.status_code == 422
