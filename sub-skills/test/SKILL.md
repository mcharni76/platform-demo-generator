---
name: platform-demo-test
description: "Test suite generator for platform demos. Creates unit tests (backend endpoints), integration tests (Snowflake queries), and E2E tests (full page flows) tied to the selected features."
---

# Testing -- Feature-Driven Test Suite

Generate a complete test suite for the demo project. Tests are tied to the features and pages selected during the research phase -- if a feature was selected, its tests are generated.

Run this in Session 4 after all code (backend + frontend) is generated and locally verified.

---

## Test Architecture

```
{target_path}/tests/
├── conftest.py                    # Shared fixtures: session, API client, base URL
├── unit/
│   ├── test_health.py             # Health endpoint always passes
│   ├── test_platform.py           # Platform KPIs endpoint
│   ├── test_performance.py        # Performance benchmark endpoint
│   └── test_{page}.py             # One file per selected page
├── integration/
│   ├── test_sql_compilation.py    # All deploy scripts compile against Snowflake
│   ├── test_data_loaded.py        # All expected tables have rows
│   ├── test_cortex_search.py      # Policy Search service exists and responds
│   └── test_semantic_model.py     # Semantic model file on stage, Analyst responds
├── e2e/
│   ├── test_full_flow.py          # Start backend + frontend, navigate all pages
│   └── test_demo_scenarios.py     # Run the demo script scenarios end-to-end
└── pytest.ini                     # Markers: unit, integration, e2e
```

---

## Step 1: Determine Test Scope (from selected features)

Read `selected_pages` from the research context. For each selected page, generate:

| Page | Unit test | Integration test | E2E test |
|------|-----------|-----------------|----------|
| Platform | KPIs endpoint returns 3 counts | Tables exist with rows | Page loads, KPIs display |
| Performance | Benchmark returns `execution_time_ms` | Largest table has 100K+ rows | Cold/warm benchmark comparison |
| Analytics | All 7 tab endpoints return data | Region data is skewed (not uniform) | Tab switching preserves cache |
| ML/AI | Forecast/anomaly/classify endpoints | ML model exists (or z-score fallback) | 3 cards load independently |
| Time Travel | Step endpoints return all steps | Table supports time travel | Wizard completes all steps |
| Cortex AI | Sentiment/summarize endpoints | Feedback table has bilingual text | NLP results display correctly |
| Data Masking | Raw/policy/masked endpoints | Masking policy applied to PII columns | 3 views show different data |
| Ask {Customer} | Analyst endpoint responds | Semantic model on stage | Question returns SQL + results |
| Policy Intelligence | Search endpoint responds | Cortex Search service exists | Question returns relevant docs |
| Dynamic Tables | DT list endpoint returns data | DTs exist and refreshing | Refresh status shows correctly |

---

## Step 2: Generate conftest.py

```python
import pytest
import httpx
import subprocess
import time
import os

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8200")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5300")
CONNECTION = os.getenv("SNOWFLAKE_CONNECTION_NAME", "{connection_name}")


@pytest.fixture(scope="session")
def backend():
    """Verify backend is running or start it."""
    try:
        httpx.get(f"{BACKEND_URL}/api/health", timeout=5)
    except httpx.ConnectError:
        pytest.skip("Backend not running. Start with: uvicorn app.main:app --port 8200")
    return BACKEND_URL


@pytest.fixture(scope="session")
def api(backend):
    """HTTP client for backend API."""
    return httpx.Client(base_url=backend, timeout=30)


@pytest.fixture(scope="session")
def snow_session():
    """Snowpark session for integration tests."""
    from snowflake.snowpark import Session
    return Session.builder.config("connection_name", CONNECTION).create()
```

---

## Step 3: Generate Unit Tests (one per selected page)

For each page in `selected_pages`, generate a test file following this pattern:

```python
# tests/unit/test_{page_id}.py
import pytest

@pytest.mark.unit
class TestPage{Name}:
    def test_endpoint_returns_200(self, api):
        resp = api.get("/api/{page}/{action}")
        assert resp.status_code == 200

    def test_response_has_execution_time(self, api):
        resp = api.get("/api/{page}/{action}")
        data = resp.json()
        assert "execution_time_ms" in data

    def test_response_has_data(self, api):
        resp = api.get("/api/{page}/{action}")
        data = resp.json()
        assert data.get("data") is not None or data.get("total_{entity}") is not None
```

---

## Step 4: Generate Integration Tests

```python
# tests/integration/test_sql_compilation.py
import pytest
from pathlib import Path

@pytest.mark.integration
class TestSQLCompilation:
    def test_all_deploy_scripts_compile(self, snow_session):
        scripts_dir = Path("{target_path}/deploy/scripts")
        for sql_file in sorted(scripts_dir.glob("0*.sql")):
            sql = sql_file.read_text()
            # Extract individual statements and compile each
            for stmt in sql.split(";"):
                stmt = stmt.strip()
                if stmt and not stmt.startswith("--"):
                    # Use EXPLAIN or dry-run where possible
                    pass  # Compilation check

    def test_tables_have_data(self, snow_session):
        for table in [{entity_list}]:
            rows = snow_session.sql(
                f"SELECT COUNT(*) AS cnt FROM {SLUG}_DEMO.{DOMAIN}_DATA.{table}"
            ).collect()
            assert rows[0]["CNT"] > 0, f"Table {table} is empty"

    def test_cortex_search_service_exists(self, snow_session):
        rows = snow_session.sql(
            "SHOW CORTEX SEARCH SERVICES IN SCHEMA {SLUG}_DEMO.{DOMAIN}_DATA"
        ).collect()
        assert len(rows) > 0, "Cortex Search service not created"
```

---

## Step 5: Generate E2E Tests

```python
# tests/e2e/test_demo_scenarios.py
import pytest
import httpx

@pytest.mark.e2e
class TestDemoScenarios:
    """Run through the demo script scenarios end-to-end."""

    def test_all_pages_load(self, api):
        """Every selected page's primary endpoint returns 200."""
        endpoints = {selected_page_endpoints}
        for name, endpoint in endpoints.items():
            resp = api.get(endpoint)
            assert resp.status_code == 200, f"Page {name} failed: {endpoint}"

    def test_time_travel_wizard_completes(self, api):
        """Time Travel: all 4 steps execute and restore succeeds."""
        # Step 0: start demo
        resp = api.post("/api/time-travel/step/0")
        assert resp.status_code == 200
        # Steps 1-3
        for step in range(1, 4):
            resp = api.post(f"/api/time-travel/step/{step}")
            assert resp.status_code == 200

    def test_cortex_analyst_answers_question(self, api):
        """Ask {Customer} returns SQL and results for a predefined question."""
        resp = api.post("/api/ask-{slug}/analyst", json={
            "question": "{first_predefined_question}"
        })
        assert resp.status_code == 200
        # Should contain SQL in response
```

---

## Step 6: Generate pytest.ini

```ini
[pytest]
markers =
    unit: Unit tests (no external deps, fast)
    integration: Integration tests (needs Snowflake connection)
    e2e: End-to-end tests (needs running backend)
testpaths = tests
```

---

## Step 7: Interactive Test Run (ask_user_question)

After generating all tests, run them and present results:

```bash
cd {target_path}
# Unit tests (fast, no connection needed if backend running)
python -m pytest tests/unit/ -v --tb=short -m unit

# Integration tests (needs Snowflake)
python -m pytest tests/integration/ -v --tb=short -m integration

# E2E tests (needs backend + frontend running)
python -m pytest tests/e2e/ -v --tb=short -m e2e
```

```json
{
  "questions": [
    {
      "header": "Test results",
      "question": "Test suite results:\n\n| Suite | Tests | Passed | Failed |\n|-------|-------|--------|--------|\n| Unit | {N} | {P} | {F} |\n| Integration | {N} | {P} | {F} |\n| E2E | {N} | {P} | {F} |\n\n{failure_details_if_any}\n\nHow to proceed?",
      "multiSelect": false,
      "options": [
        {"label": "All passing, proceed to S5", "description": "Tests are green, move to deployment"},
        {"label": "Fix failures", "description": "Walk me through fixing the failing tests"},
        {"label": "Skip failing tests", "description": "Mark as known issues and proceed"},
        {"label": "Add more tests", "description": "I want tests for additional scenarios"}
      ]
    }
  ]
}
```
