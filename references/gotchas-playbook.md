# Gotchas Playbook

Battle-tested gotchas and solutions from NCIM (Government/Municipal), IMSU (Education), and MISK (Non-profit/Education) platform demo projects. Consult this BEFORE writing any code in Sessions 1–5.

---

## Category 1: Snowflake SQL

| # | Gotcha | Wrong | Correct | Impact |
|---|--------|-------|---------|--------|
| S1 | Division by zero | `a / b` | `DIV0(a, b)` | Runtime error kills endpoint |
| S2 | Upsert syntax | `ON CONFLICT DO UPDATE` | `MERGE INTO ... WHEN MATCHED` | SQL parse error |
| S3 | Indexes | `CREATE INDEX` | `ALTER TABLE CLUSTER BY (col)` | DDL error |
| S4 | NULL in GREATEST | `GREATEST(a, b, c)` | `GREATEST(COALESCE(a,0), ...)` | Returns NULL if any arg NULL |
| S5 | GRANT on SNOWFLAKE DB | `GRANT USAGE ON DATABASE SNOWFLAKE` | `GRANT IMPORTED PRIVILEGES ON DATABASE SNOWFLAKE` | Permission error |
| S6 | Future grants missing | Only grant on existing tables | Add `GRANT ... ON FUTURE TABLES IN SCHEMA` | New tables invisible to APP_ROLE |
| S7 | Bare table names | `FROM ENROLLMENTS` | `FROM {SLUG}_DEMO.{DOMAIN}_DATA.ENROLLMENTS` | Breaks in SPCS (no session context) |
| S8 | NULL sort order | Assume NULLs last | Snowflake: NULLs sort LAST in ASC by default — explicit if needed | Unexpected data order |
| S9 | Dynamic SQL in functions | `EXECUTE IMMEDIATE` in UDF | Only valid in STORED PROCEDURES | Compile error |

---

## Category 2: Snowpark / Python

| # | Gotcha | Wrong | Correct | Impact |
|---|--------|-------|---------|--------|
| P1 | Row key casing | `row["ROWS_LOADED"]` | `row["rows_loaded"]` (after as_dict) | KeyError |
| P2 | exec_sql contract | Assume any return | Always `(list[dict], list[str], float)` — lowercase keys | TypeError |
| P3 | session.close() | Call close() at end | Never close — use reconnect logic or context manager | Connection lost mid-session |
| P4 | hatchling packages | Omit build config | `[tool.hatch.build.targets.wheel] packages = ["app"]` | `uv sync` fails |
| P5 | httpx missing | Only list snowpark+fastapi | Add `httpx>=0.27.0` to dependencies | Cortex Analyst REST fails |
| P6 | COPY INTO after fail | Re-run without FORCE | Add `FORCE = TRUE` to bypass load history | Silent no-op (0 rows loaded) |
| P7 | Column count mismatch | CSVs missing DEFAULT cols | Add `ERROR_ON_COLUMN_COUNT_MISMATCH = FALSE` | COPY fails with column error |

---

## Category 3: SPCS / Docker

| # | Gotcha | Wrong | Correct | Impact |
|---|--------|-------|---------|--------|
| D1 | ARM images on SPCS | `docker build .` on M-series Mac | `docker build --platform linux/amd64 .` | Service crashes on start |
| D2 | Multi-container proxy | `proxy_pass http://backend:8200` | `proxy_pass http://localhost:8200` (same pod) | 502 Bad Gateway |
| D3 | readinessProbe port | Use wrong port number | Must exactly match container listen port | Service never becomes READY |
| D4 | Image repo case | Uppercase in path | All image paths must be lowercase | Push fails |
| D5 | ALTER vs DROP+CREATE | `DROP SERVICE; CREATE SERVICE` | `ALTER SERVICE ... FROM SPEC` | Loses public ingress URL |
| D6 | curl in slim image | healthcheck uses curl | `RUN apt-get install -y curl` in Dockerfile | healthcheck always fails |
| D7 | Token rotation | Read token once at startup | Re-read `/snowflake/session/token` on reconnect | Auth expires after ~1 hour |
| D8 | nginx timeout | Default 60s proxy_read_timeout | Set `proxy_read_timeout 300s` in nginx.conf | Cortex Analyst calls killed |

---

## Category 4: Snow CLI / Connections

| # | Gotcha | Wrong | Correct | Impact |
|---|--------|-------|---------|--------|
| C1 | Private key field | `private_key_path` | `private_key_file` (Snow CLI) | Auth silently fails |
| C2 | Authenticator case | `authenticator = "snowflake_jwt"` | `authenticator = "SNOWFLAKE_JWT"` | Misleading JWT error |
| C3 | SSL hostname | Use host with underscores for REST | `host.replace("_", "-")` before HTTPS calls | SSL CERTIFICATE_VERIFY_FAILED |
| C4 | Connection for step 01 | Use a different admin connection | Use same working connection with ACCOUNTADMIN | Connection not found |

---

## Category 5: Frontend / React

| # | Gotcha | Wrong | Correct | Impact |
|---|--------|-------|---------|--------|
| F1 | Auto-fetch in useEffect | `useEffect(() => fetch(), [])` | Explicit "Load" button + manual trigger | Demo unpredictable |
| F2 | Tailwind config missing | Rely on PostCSS alone | Create `tailwind.config.js` with content scan | Custom classes purged in prod |
| F3 | vite proxy port | Point to wrong backend port | Match exactly: `http://localhost:8200` | 404 on all API calls |
| F4 | Tab re-fetch | Fetch on every tab switch | `Partial<Record<TabKey, DataState>>` cache | Slow UX, unnecessary queries |
| F5 | Arabic RTL | Just set `dir="rtl"` on text | Also add `font-arabic` class + rotate send icon | Layout breaks |
| F6 | SqlPreviewButton z-index | Use `z-50` | Use `fixed inset-0 z-[100]` | Modal hidden behind sidebar |
| F7 | manualChunks vendor empty | Split react/react-dom | These may already be in framer-motion bundle | Warning but harmless |
| F8 | TS interface staleness | Keep old interface | Always sync api.ts interfaces with backend response | Type errors or silent bugs |

---

## Category 6: ML / Cortex AI

| # | Gotcha | Wrong | Correct | Impact |
|---|--------|-------|---------|--------|
| M1 | PREDICT as UDTF | `TABLE(MODEL!PREDICT(...))` | `MODEL!PREDICT(OBJECT_CONSTRUCT(...)):output::FLOAT` (scalar) | Unknown UDTF error |
| M2 | Feature leakage | Include NULL-correlated target column | Remove target-adjacent features from training view | 100% accuracy = useless model |
| M3 | Inference window | Use fixed dates | `DATEADD(month, -6, (SELECT MAX(date_col) FROM table))` | No data in window |
| M4 | DETECT_ANOMALIES timing | Inference dates overlap training | Inference timestamps MUST be AFTER training end | Error or empty results |
| M5 | Cortex Analyst semantic model | Use `agg` field | Must be `default_aggregation` | Validation error |
| M6 | Relationships missing PK | Only set `unique: true` on dim | Must have explicit `primary_key: columns: [col]` | Validation fails |
| M7 | Relationship fields | Add `join_type` / `relationship_type` | Omit — these are auto-inferred | Validation warning |
| M8 | Verified queries | Omit `name` field | Every VQR needs a `name` string | Validation error |

---

## Category 7: Deploy Script / Data Loading

| # | Gotcha | Wrong | Correct | Impact |
|---|--------|-------|---------|--------|
| L1 | Load order | Load dependent tables first | Reference tables before dependents: REGIONS → CATEGORIES → PROGRAMS → ... | FK violations |
| L2 | PUT duplicate files | Re-PUT every time | LIST stage first, skip if file exists (saves minutes on 100MB+) | Wasted time |
| L3 | DT query too early | Query DT right after step 06 | Wait for `INITIALIZE = ON_CREATE` to complete (poll `SHOW DYNAMIC TABLES`) | Empty results |
| L4 | ML train duration | Expect instant completion | Step 05 takes 5–10 min — don't interrupt or re-run concurrently | Corrupted model |
| L5 | deploy.py init required | Run `--all` on fresh env | Must run `--init` first (creates keys + connection entry) | Connection not found |
| L6 | Substitution regex | Custom template syntax | Use `&{VARIABLE}` → `re.sub(r"&\{(\w+)\}", replacer, sql)` | Missed substitutions |

---

## Category 8: ACCOUNT_USAGE Views

| # | Gotcha | Wrong | Correct | Impact |
|---|--------|-------|---------|--------|
| A1 | Query latency | Expect real-time data | ~45 min latency on all ACCOUNT_USAGE views | Empty results on fresh deploy |
| A2 | No mock fallback | Return empty array to frontend | Always provide `is_illustrative` flag + mock data | Broken demo page |
| A3 | QUERY_HISTORY empty | Assume it always has data | Fresh account = 0 rows for 45 min | Optimization page blank |

---

## Quick Decision Matrix

| Situation | Do this |
|-----------|---------|
| SQL returns empty but should have data | Check fully qualified names + role grants |
| Backend starts but endpoints 500 | Check exec_sql() return format — lowercase keys |
| Frontend build passes but classes missing | Add tailwind.config.js with content scan |
| SPCS service stuck in PENDING | Check readinessProbe.port matches actual listen port |
| Cortex Analyst returns SSL error | Apply `host.replace("_", "-")` fix |
| ML endpoint returns wrong predictions | Check for feature leakage in training view |
| COPY INTO loads 0 rows | Add `FORCE = TRUE` (load history blocks retry) |
| Demo page shows "Illustrative Data" banner | Expected — ACCOUNT_USAGE latency, not a bug |
