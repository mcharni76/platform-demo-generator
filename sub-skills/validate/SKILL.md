---
name: platform-demo-validate
description: "Post-generation validation for platform demos. Smoke-tests backend startup, frontend build, SQL compilation, API endpoints, and SPCS readiness. Run after any session S2+ to catch issues early."
---

# Validate — Post-Generation Smoke Testing

Run this sub-skill after completing any session S2 or later. It validates the generated demo works before the next session builds on top of it.

---

## When to Run

| After Session | What to validate |
|---|---|
| S1 (Infrastructure) | SQL compilation only — no backend yet |
| S2 (Backend) | Backend starts + health endpoint + SQL compile |
| S3 (Frontend Core) | Backend + frontend build + API smoke test |
| S4 (Frontend Advanced) | Full stack + semantic model upload |
| S5 (Deploy) | Everything + SPCS spec validation |

---

## Step 1: Validate SQL Scripts Compile

For each file in `{target_path}/deploy/scripts/*.sql`:

```bash
for f in {target_path}/deploy/scripts/0*.sql; do
  echo "--- Validating: $f ---"
  # Use snowflake_sql_execute with only_compile=true for key statements
done
```

Check for:
- No bare table names (must be `{SLUG}_DEMO.{DOMAIN}_DATA.TABLE`)
- No `ON CONFLICT` (must be `MERGE INTO`)
- No `CREATE INDEX` (must be `CLUSTER BY`)
- No `a / b` division (must be `DIV0(a, b)`)
- No `GRANT USAGE ON DATABASE SNOWFLAKE` (must be `GRANT IMPORTED PRIVILEGES`)

⚠️ STOPPING POINT: If SQL validation fails, report issues and wait for user decision (fix now or defer).

---

## Step 2: Validate Backend Starts

Ensure backend dependencies are installed, then test:

```bash
cd {target_path}/backend
# Install deps if not already present
command -v uv >/dev/null 2>&1 || pip install uv
uv sync
SNOWFLAKE_CONNECTION_NAME={connection_name} uv run uvicorn app.main:app --port 8200 &
sleep 5
curl -f http://localhost:8200/api/health
kill %1
```

Expected: `{"status": "ok"}` or similar health response.

Common failures:
- Missing `httpx` in dependencies (Cortex Analyst REST calls need it)
- `session.py` connection name typo
- `hatchling` missing `packages = ["app"]` in pyproject.toml
- Import errors from missing semantic model file path

⚠️ STOPPING POINT: If backend fails to start, diagnose and fix before proceeding.

---

## Step 3: Validate Frontend Builds

```bash
cd {target_path}/frontend
command -v node >/dev/null 2>&1 || { echo "ERROR: Node.js not installed. Run: brew install node"; exit 1; }
npm install
npm run build
```

Expected: Build completes with no errors.

Common failures:
- Missing `tailwind.config.js` (custom classes absent in prod)
- TypeScript interface mismatch with backend response
- Unused imports/variables in strict mode
- Missing vite.config.ts proxy target

---

## Step 4: API Endpoint Smoke Test

Start backend, then test critical endpoints:

```bash
# Platform KPIs (most basic — if this fails, nothing works)
curl -s http://localhost:8200/api/platform/kpis | jq .

# Performance benchmark (tests large table query)
curl -s http://localhost:8200/api/performance/benchmark | jq .

# Lineage (tests INFORMATION_SCHEMA access)
curl -s http://localhost:8200/api/lineage | jq .

# Quality metrics (tests DMF queries)
curl -s http://localhost:8200/api/quality/metrics | jq .
```

Validate each response:
- Returns HTTP 200
- Contains `execution_time_ms` field
- Data arrays are non-empty (or gracefully empty with explanation)

---

## Step 5: Semantic Model Validation (after S4)

```bash
# Check semantic model YAML is well-formed
python -c "import yaml; yaml.safe_load(open('{target_path}/backend/app/semantic_model/{slug}_semantic_model.yaml'))"
```

Verify:
- All referenced tables exist in `{SLUG}_DEMO.{DOMAIN}_DATA`
- Primary keys defined for all tables used in relationships
- `default_aggregation` used (not `agg`)
- Relationships have `name` field
- No `join_type` or `relationship_type` fields (auto-inferred)

---

## Step 6: SPCS Spec Validation (after S5)

```bash
# Validate YAML structure
python -c "import yaml; yaml.safe_load(open('{target_path}/spcs/{slug}-service-spec.yaml'))"
```

Check:
- `readinessProbe.port` matches actual backend port (8200)
- Image paths are lowercase
- Endpoints section has `public: true`
- No references to old MISK paths or names

---

## Step 7: Produce Validation Report

Output a summary table:

```markdown
# Validation Report — {customer_name} ({slug})
**Date**: {today}
**Session validated after**: S{N}

| Check | Status | Notes |
|-------|--------|-------|
| SQL compilation | ✅/❌ | {details} |
| Backend startup | ✅/❌ | {details} |
| Frontend build | ✅/❌ | {details} |
| API smoke test | ✅/❌ | {N}/{total} endpoints OK |
| Semantic model | ✅/❌/⏭️ | {details or "not yet generated"} |
| SPCS spec | ✅/❌/⏭️ | {details or "not yet generated"} |

## Issues Found
{list any issues with recommended fixes}

## Verdict
{PASS — ready for next session | BLOCKED — fix issues before proceeding}
```

Write to `{target_path}/docs/VALIDATION_S{N}.md`.

---

## Common Validation Failures (from NCIM/MISK/IMSU)

1. **Port mismatch**: vite.config.ts proxies to wrong backend port (was 8002, should be 8200)
2. **hatchling packages**: pyproject.toml missing `[tool.hatch.build.targets.wheel] packages = ["app"]`
3. **Tailwind content scan**: Missing `.tsx` in content array → classes purged in production
4. **ACCOUNT_USAGE latency**: Optimization/Pricing pages return empty on fresh accounts — this is expected, not a failure
5. **Cortex Search unavailable**: Backend logs warning but continues — check `_seed_policy_documents()` try/except
6. **ML model not trained**: If step 05 hasn't run, ML endpoints return SQL fallback (z-score) — acceptable
7. **DT not ready**: Dynamic table may still be initializing — check `SHOW DYNAMIC TABLES` refresh status
