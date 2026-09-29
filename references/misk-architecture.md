# MISK Architecture Reference

Full technical reference for the platform demo architecture (derived from the MISK project). Use this as the structural template when generating customer demos. Read this file before writing any code in Sessions 1–5.

---

## Project Structure

```
{target_path}/
├── config.toml                      # Project config — non-sensitive, commit safely
├── .gitignore
├── docker-compose.yml               # Local dev: backend:8200, frontend:5300
├── deploy/
│   ├── deploy.py                    # Orchestrator — runs SQL steps via snow sql
│   ├── load_data.py                 # Snowpark PUT + COPY INTO for seed CSVs
│   └── scripts/
│       ├── 01_rbac_setup.sql        # ACCOUNTADMIN: roles, users, warehouse
│       ├── 02_ddl.sql               # DEPLOY_ROLE: database + tables
│       ├── 03_stage.sql             # DEPLOY_ROLE: seed stage
│       ├── 04_ml_setup.sql          # DEPLOY_ROLE: ML views + training data
│       ├── 05_ml_train.sql          # DEPLOY_ROLE: train ML models
│       ├── 06_dynamic_tables.sql    # DEPLOY_ROLE: DT + Cortex AI seed data
│       ├── 07_app_grants.sql        # DEPLOY_ROLE: runtime grants
│       └── 99_teardown.sql          # ACCOUNTADMIN: cleanup
├── backend/
│   ├── Dockerfile                   # python:3.12-slim, uv, installs app
│   ├── pyproject.toml               # uv-based: snowflake-snowpark-python, fastapi, httpx
│   └── app/
│       ├── session.py               # Snowpark session factory (local vs SPCS)
│       ├── main.py                  # FastAPI app — endpoints for selected pages
│       └── semantic_model/
│           └── misk_semantic_model.yaml   # Cortex Analyst semantic model
├── frontend/
│   ├── Dockerfile                   # node:20-alpine build, nginx:alpine serve
│   ├── nginx.conf                   # Reverse proxy /api → backend:8200; proxy_read_timeout 300s
│   ├── package.json                 # React 18, Vite, Tailwind 3, Recharts, Framer Motion, MapLibre
│   ├── vite.config.ts               # Dev proxy /api → localhost:8200; manualChunks
│   ├── tailwind.config.js           # Required: content scan + custom color tokens
│   └── src/
│       ├── lib/
│       │   ├── api.ts               # apiFetch() — base URL /api, TypeScript interfaces
│       │   ├── scenarios.ts         # SCENARIOS array: selected pages with labels, icons, features
│       │   └── csv.ts               # CSV download utility
│       ├── App.tsx                  # PAGE_MAP + sidebar + guided mode + transition
│       └── components/
│           ├── shared/
│           │   ├── Header.tsx       # Top bar: logo, title, theme toggle, dark mode
│           │   ├── Sidebar.tsx      # Left nav: scenario list, collapse/expand
│           │   ├── GuidedBar.tsx    # Top progress bar in guided mode
│           │   ├── HeroSection.tsx  # Gradient header per page with feature badge
│           │   ├── SqlPreviewButton.tsx  # Dark modal SQL viewer (fixed z-[100])
│           │   ├── DataPreview.tsx  # Scrollable table + CSV download
│           │   ├── FeatureBadge.tsx # Snowflake feature pill
│           │   ├── QueryTimeBadge.tsx   # Execution time badge
│           │   └── PanelCard.tsx   # NCIM card wrapper
│           └── pages/               # Page components (per selection from research phase)
└── spcs/
    ├── 01_infra.sql                 # Compute pool + image repo
    ├── misk-service-spec.yaml       # SPCS backend-only service spec (frontend on App Runtime)
    └── spcs_deploy.sh               # Build → push → CREATE/ALTER SERVICE
```

---

## Backend Patterns (session.py + main.py)

### Session Factory (session.py)

```python
import os
from pathlib import Path
from snowflake.snowpark import Session

_SPCS_TOKEN = Path("/snowflake/session/token")

def get_session() -> Session:
    if _SPCS_TOKEN.exists():
        # SPCS: OAuth token
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
        return Session.builder.configs(params).create()
    else:
        # Local: connection name from env
        conn_name = os.getenv("SNOWFLAKE_CONNECTION_NAME", "{connection_name}")
        return Session.builder.config("connection_name", conn_name).create()

def exec_sql(sql: str) -> tuple[list[dict], list[str], float]:
    import time
    session = get_session()
    t0 = time.perf_counter()
    rows = session.sql(sql).collect()
    ms = (time.perf_counter() - t0) * 1000
    cols = [f.name.lower() for f in session.sql(sql).schema.fields]
    return [dict(zip(cols, [r[i] for i in range(len(cols))])) for r in rows], cols, round(ms, 1)
```

**Critical**: `exec_sql()` returns `(list[dict], list[str], float)`. Dict keys are **lowercase**. Never use uppercase keys.

### main.py Patterns

```python
# Standard page endpoint pattern
@app.get("/api/platform/kpis")
def platform_kpis():
    sql = """
    SELECT
        COUNT(*) AS total_{primary_entity_plural},
        ...
    FROM {SLUG}_DEMO.{DOMAIN}_DATA.{PRIMARY_ENTITY}
    """
    rows, _, ms = exec_sql(sql)
    return {**rows[0], "execution_time_ms": round(ms, 1)}

# Always include execution_time_ms in every response — QueryTimeBadge depends on it
```

### Cortex Search Seed (runs at backend startup in lifespan)

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        session = get_session()
        _upload_semantic_model()    # uploads YAML to stage
        _seed_policy_documents()    # inserts docs + creates Cortex Search Service
    except Exception as e:
        log.error("Startup failed: %s", e)
    yield

def _seed_policy_documents():
    # Insert {regulatory_context} policy documents into POLICY_DOCUMENTS table
    # Then:
    exec_sql("""
        CREATE OR REPLACE CORTEX SEARCH SERVICE {SLUG}_DEMO.{DOMAIN}_DATA.POLICY_SEARCH
            ON content
            WAREHOUSE = {SLUG}_DEMO_WH
            TARGET_LAG = '1 day'
            AS (SELECT doc_id, doc_name, doc_type, section, content
                FROM {SLUG}_DEMO.{DOMAIN}_DATA.POLICY_DOCUMENTS)
    """)
    # Wrapped in try/except — non-fatal if Cortex Search unavailable
```

---

## Frontend Patterns

### No Auto-fetch Rule
**Never** use `useEffect` to auto-fetch data. Every page has an explicit Load button:

```typescript
const [state, setState] = useState<{loading: boolean; data: T | null; error: string | null; ms: number | null}>({
  loading: false, data: null, error: null, ms: null
})

const load = async () => {
  setState({ loading: true, data: null, error: null, ms: null })
  try {
    const res = await apiFetch<T>('/api/endpoint')
    setState({ loading: false, data: res, error: null, ms: res.execution_time_ms })
  } catch (e) {
    setState({ loading: false, data: null, error: String(e), ms: null })
  }
}
```

### Tab Cache Pattern
Prevents re-fetch when switching tabs:

```typescript
type TabKey = 'tab1' | 'tab2' | 'tab3'
const [tabData, setTabData] = useState<Partial<Record<TabKey, DataState>>>({})

const loadTab = async (tab: TabKey) => {
  if (tabData[tab]) return  // already loaded — skip
  // ... fetch and setTabData(prev => ({ ...prev, [tab]: result }))
}
```

### Wizard Step Pattern (Time Travel, Recovery)
```typescript
const [steps, setSteps] = useState<Step[]>([])
const [visibleCount, setVisibleCount] = useState(0)

// On "Start Demo": fetch ALL steps at once, reveal count = 1
// On "Next Step": increment visibleCount
// Reveal one-by-one client-side — no per-step API call
```

### NCIM Card Pattern (ML/AI, Masking, Classification)
Each card is fully independent:
```typescript
// Each card has its own state: loading / data / error / ms
// Load button per card — never auto-fetch
// Business Scenario box always visible (above the fold, not gated)
// Input/Output split: left = SQL/config, right = result
```

### Bilingual Toggle (any secondary language)
```typescript
const [isSecondaryLang, setIsSecondaryLang] = useState(false)
const isRtl = ['ar', 'fa', 'ur'].includes(secondaryLang) && isSecondaryLang
// Wrap page: <div dir={isRtl ? 'rtl' : 'ltr'}>
// RTL languages (ar, fa, ur): add font class + rotate send icon in RTL mode
// LTR languages (fr, tr, pt): translated labels only, no dir change
// Toggle button in header shows EN / {secondary_lang_code}
```

### Architecture Page (fully static — no API)

Navigation between pages uses a custom DOM event:
```typescript
function navigate(pageId: PageId) {
  window.dispatchEvent(new CustomEvent('{slug}:navigate', { detail: pageId }))
}
```

App.tsx listens for this event and updates `activePage`.

The `LAYERS` array defines medallion architecture tiers. Each `ArchNode` has:
- `label`: entity or system name
- `sublabel`: row count or description
- `implemented`: true → clickable + green badge, false → dimmed "Roadmap" badge
- `pageId`: optional → click navigates to that page
- `scenarioLevel`: "S1"..."S16" badge shown

Layer colors (do not change — domain-agnostic):
- Sources: slate
- Ingestion: blue
- Bronze: orange
- Silver: sky
- Gold: emerald
- AI/ML: purple
- Consumption: rose

---

## SQL Patterns

> **Full SQL gotchas list**: See `references/gotchas-playbook.md` → Category 1.
> Below are only the structural patterns needed for code generation.

### Always Use
```sql
-- Fully qualified names
SELECT * FROM {SLUG}_DEMO.{DOMAIN}_DATA.TABLE_NAME

-- Division safety
SELECT DIV0(numerator, denominator) AS ratio

-- Upsert pattern
MERGE INTO target t USING source s ON (t.id = s.id)
WHEN MATCHED THEN UPDATE SET ...
WHEN NOT MATCHED THEN INSERT ...

-- Future grants (critical — prevents re-granting after new tables)
GRANT SELECT, INSERT, UPDATE, DELETE
    ON FUTURE TABLES IN SCHEMA {SLUG}_DEMO.{DOMAIN}_DATA TO ROLE {SLUG}_APP_ROLE;
```

### Mock Fallback for ACCOUNT_USAGE (Optimization, Pricing pages)
```python
rows, _, ms = exec_sql("SELECT ... FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY ...")
is_illustrative = len(rows) == 0
display_data = rows if rows else MOCK_DATA
return {"data": display_data, "is_illustrative": is_illustrative, "execution_time_ms": ms}
```

---

## SPCS Patterns

> **Full SPCS gotchas**: See `references/gotchas-playbook.md` → Category 3.
> Below are only the structural patterns needed for spec generation.

### Multi-Container Pod
Backend deploys to SPCS as a single container. Frontend deploys to Snowflake App Runtime via `snow app deploy`. The App Runtime frontend proxies `/api/*` to the SPCS backend endpoint.
nginx proxies `/api/*` → `http://localhost:8200` (not the container name).

### Service Spec Key Fields
```yaml
spec:
  containers:
    - name: backend
      image: {image_repo}/{slug}-backend:latest
      env:
        SNOWFLAKE_WAREHOUSE: {SLUG}_DEMO_WH
      readinessProbe:
        port: 8200
    - name: frontend
      image: {image_repo}/{slug}-frontend:latest
  endpoints:
    - name: ui
      port: 80
      public: true
```

### Image Build
Always: `docker build --platform linux/amd64 ...` on Apple Silicon Macs.

---

## Ports (local dev)
- Backend: **8200**
- Frontend: **5300** (vite dev) / **80** (nginx in SPCS)
- docker-compose maps backend:8200, frontend dev serves on 5300

---

## Deploy Script Variable Substitution
SQL scripts use `&{VARIABLE}` placeholders. `deploy.py::build_vars()` maps them from `config.toml`. Substitution: `re.sub(r"&\{(\w+)\}", replacer, raw_sql)`.

Step-to-connection mapping:
```python
STEP_CONNECTION = {
    "01": "admin",    # ACCOUNTADMIN
    "02": "deploy",   # DEPLOY_ROLE
    ...
    "99": "admin",    # ACCOUNTADMIN teardown
}
```

---

## Tailwind Config (required — without it, custom classes are missing in prod)

```js
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        '{slug}-primary': '{brand_color}',
        '{slug}-primary-dark': '{brand_color_darkened}',
        'snow-cyan': '#29B5E8',
        'snow-blue': '#0C3D8A',
        'text-primary': '#1a1a2e',
        'text-secondary': '#4a4a6a',
        'text-muted': '#8888aa',
        // ... dark mode equivalents
      },
      fontFamily: {
        arabic: ['Noto Sans Arabic', 'sans-serif'],
      }
    }
  }
}
```

---

## pyproject.toml Key Dependencies

```toml
[project]
dependencies = [
    "snowflake-snowpark-python>=1.21.0",
    "fastapi>=0.110.0",
    "uvicorn[standard]>=0.29.0",
    "httpx>=0.27.0",          # for Cortex Analyst REST + tile proxy
    "pydantic>=2.6.0",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["app"]           # REQUIRED — without this, uv sync fails
```

---

## Semantic Model Structure (Cortex Analyst)

```yaml
# backend/app/semantic_model/{slug}_semantic_model.yaml
name: {slug}_semantic_model
tables:
  - name: {PRIMARY_ENTITY}        # e.g. CUSTOMERS, PATIENTS, WELLS
    base_table:
      database: {SLUG}_DEMO
      schema: {DOMAIN}_DATA
      table: {PRIMARY_ENTITY}
    dimensions:
      - name: {entity_id}
        expr: {entity_id}
        data_type: VARCHAR
      - name: {category_field}
        expr: {category_field}
        data_type: VARCHAR
    time_dimensions:
      - name: created_at
        expr: created_at
        data_type: TIMESTAMP_NTZ
    measures:
      - name: total_count
        expr: COUNT(*)
        data_type: NUMBER
        default_aggregation: count
```

Uploaded to stage at backend startup: `session.file.put(local_path, "@{SLUG}_DEMO.{DOMAIN}_DATA.{SLUG}_STAGE/semantic_model/", auto_compress=False, overwrite=True)`
