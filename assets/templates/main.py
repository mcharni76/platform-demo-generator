"""
main.py — FastAPI application skeleton for platform demos.
Contains the lifespan, health endpoint, and pattern for all page endpoints.

Replace: {SLUG}, {DOMAIN}, {slug}, {display_name}, {connection_name}, {regulatory_context}
Expand: Add all 50+ endpoints per references/demo-pages-catalog.md
"""

import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .session import exec_sql, get_session

log = logging.getLogger(__name__)


# --- Cortex Search / Semantic Model Seed ---

def _upload_semantic_model():
    """Upload semantic model YAML to stage at startup."""
    try:
        session = get_session()
        local_path = str(Path(__file__).parent / "semantic_model" / "{slug}_semantic_model.yaml")
        session.file.put(
            local_path,
            "@{SLUG}_DEMO.{DOMAIN}_DATA.{SLUG}_STAGE/semantic_model/",
            auto_compress=False,
            overwrite=True,
        )
        log.info("Semantic model uploaded to stage")
    except Exception as e:
        log.warning("Semantic model upload failed (non-fatal): %s", e)


def _seed_policy_documents():
    """Insert regulatory docs and create Cortex Search Service."""
    try:
        session = get_session()
        # Check if already seeded
        rows, _, _ = exec_sql(
            "SELECT COUNT(*) AS cnt FROM {SLUG}_DEMO.{DOMAIN}_DATA.POLICY_DOCUMENTS"
        )
        if rows and rows[0].get("cnt", 0) > 0:
            log.info("Policy documents already seeded (%d rows)", rows[0]["cnt"])
            return

        # Insert regulatory documents (from data-domain-templates.md)
        # ... INSERT statements for {regulatory_context} docs ...

        # Create Cortex Search Service (non-fatal)
        exec_sql("""
            CREATE OR REPLACE CORTEX SEARCH SERVICE {SLUG}_DEMO.{DOMAIN}_DATA.POLICY_SEARCH
                ON content
                WAREHOUSE = {SLUG}_DEMO_WH
                TARGET_LAG = '1 day'
                AS (SELECT doc_id, doc_name, doc_type, section, content
                    FROM {SLUG}_DEMO.{DOMAIN}_DATA.POLICY_DOCUMENTS)
        """)
        log.info("Cortex Search Service created")
    except Exception as e:
        log.warning("Policy seed failed (non-fatal): %s", e)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: upload semantic model + seed policy docs."""
    _upload_semantic_model()
    _seed_policy_documents()
    yield


# --- App Setup ---

app = FastAPI(title="{display_name} Platform Demo", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Health ---

@app.get("/api/health")
def health():
    return {"status": "ok"}


# --- Platform Overview ---

@app.get("/api/platform/kpis")
def platform_kpis():
    sql = """
    SELECT
        (SELECT COUNT(*) FROM {SLUG}_DEMO.{DOMAIN}_DATA.{PRIMARY_ENTITY}) AS total_{primary_plural},
        (SELECT COUNT(*) FROM {SLUG}_DEMO.{DOMAIN}_DATA.{SECONDARY_ENTITY}) AS total_{secondary_plural},
        (SELECT COUNT(*) FROM {SLUG}_DEMO.{DOMAIN}_DATA.{TERTIARY_ENTITY}) AS total_{tertiary_plural}
    """
    rows, _, ms = exec_sql(sql)
    return {**rows[0], "execution_time_ms": ms}


# --- Performance Benchmark ---
# Pattern: include execution_time_ms in EVERY response

@app.get("/api/performance/benchmark")
def performance_benchmark():
    sql = """
    SELECT COUNT(*) AS total_rows,
           MIN({date_col}) AS earliest,
           MAX({date_col}) AS latest
    FROM {SLUG}_DEMO.{DOMAIN}_DATA.{LARGEST_ENTITY}
    """
    rows, _, ms = exec_sql(sql)
    return {**rows[0], "execution_time_ms": ms}


# --- Endpoint Pattern (repeat for all pages) ---
# See references/demo-pages-catalog.md for full endpoint list
# Each endpoint follows: sql → exec_sql → return {**data, "execution_time_ms": ms}

# --- Mock Fallback Pattern (for ACCOUNT_USAGE pages) ---

MOCK_QUERY_HISTORY = [
    {"query_type": "SELECT", "count": 1250, "avg_time_ms": 340},
    {"query_type": "INSERT", "count": 890, "avg_time_ms": 120},
    {"query_type": "MERGE", "count": 45, "avg_time_ms": 890},
]


@app.get("/api/optimization/query-history")
def optimization_query_history():
    sql = """
    SELECT query_type, COUNT(*) AS count,
           AVG(execution_time) AS avg_time_ms
    FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY
    WHERE start_time > DATEADD(day, -7, CURRENT_TIMESTAMP())
    GROUP BY query_type ORDER BY count DESC LIMIT 10
    """
    rows, _, ms = exec_sql(sql)
    is_illustrative = len(rows) == 0
    return {
        "data": rows if rows else MOCK_QUERY_HISTORY,
        "is_illustrative": is_illustrative,
        "execution_time_ms": ms,
    }


# --- Cortex Analyst (Ask {display_name}) ---

@app.post("/api/ask-{slug}/analyst")
async def ask_analyst(request: dict):
    """NL-to-SQL via Cortex Analyst REST API."""
    question = request.get("question", "")
    session = get_session()

    # Get host (fix underscores for SSL)
    host = session._conn._conn.host.replace("_", "-")
    token = session._conn._conn.rest.token

    async with httpx.AsyncClient(verify=True, timeout=120) as client:
        resp = await client.post(
            f"https://{host}/api/v2/cortex/analyst/message",
            headers={"Authorization": f"Snowflake Token=\"{token}\""},
            json={
                "messages": [{"role": "user", "content": [{"type": "text", "text": question}]}],
                "semantic_model_file": f"@{SLUG}_DEMO.{DOMAIN}_DATA.{SLUG}_STAGE/semantic_model/{slug}_semantic_model.yaml",
            },
        )
    # Parse response, extract SQL, execute, return results
    # ... (see misk-architecture.md for full implementation)
    return resp.json()
