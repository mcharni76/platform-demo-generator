"""
session.py — Snowpark session factory for platform demos.
Handles both local development (connection name) and SPCS (OAuth token).

Replace: {SLUG}, {DOMAIN}, {connection_name}
"""

import logging
import os
import time
from pathlib import Path

from snowflake.snowpark import Session

log = logging.getLogger(__name__)

_SPCS_TOKEN = Path("/snowflake/session/token")
_session: Session | None = None


def get_session() -> Session:
    global _session
    if _session is not None:
        try:
            _session.sql("SELECT 1").collect()
            return _session
        except Exception:
            _session = None

    if _SPCS_TOKEN.exists():
        params = {
            "host": os.environ["SNOWFLAKE_HOST"],
            "account": os.environ.get("SNOWFLAKE_ACCOUNT", ""),
            "authenticator": "oauth",
            "token": _SPCS_TOKEN.read_text().strip(),
            "warehouse": os.getenv("SNOWFLAKE_WAREHOUSE", "{SLUG}_DEMO_WH"),
            "database": "{SLUG}_DEMO",
            "schema": "{DOMAIN}_DATA",
            "role": "{SLUG}_APP_ROLE",
        }
        _session = Session.builder.configs(params).create()
    else:
        conn_name = os.getenv("SNOWFLAKE_CONNECTION_NAME", "{connection_name}")
        _session = Session.builder.config("connection_name", conn_name).create()

    return _session


def exec_sql(sql: str) -> tuple[list[dict], list[str], float]:
    """Execute SQL and return (rows_as_lowercase_dicts, column_names, elapsed_ms)."""
    session = get_session()
    t0 = time.perf_counter()
    df = session.sql(sql)
    rows_raw = df.collect()
    ms = (time.perf_counter() - t0) * 1000
    cols = [f.name.lower() for f in df.schema.fields]
    rows = [{cols[i]: r[i] for i in range(len(cols))} for r in rows_raw]
    return rows, cols, round(ms, 1)
