---
name: platform-demo-generate
description: "Project scaffolding for platform demo generation. Invoked once per session (S1-S5). Generates files scoped to the current session using MISK as the structural template."
---

# Generate -- Project Scaffolding

This sub-skill is invoked at the start of Sessions 1-5 (after loading the SDLC sub-skill). It generates files for the current session only -- never all sessions at once.

Read `references/misk-architecture.md` before generating any file. It contains the full MISK structural reference including critical patterns, gotchas, and exact file content to adapt.

---

## Interactive Flow (MANDATORY)

Every session follows this pattern. Do not skip any interactive step.

```
ANNOUNCE what will be generated (list files)
  → GENERATE files in batches
    → CHECKPOINT: show what was created, ask user to confirm
      → VERIFY: run smoke check (compile, start, build)
        → COMMIT + report
```

At each checkpoint, use `ask_user_question`:

```json
{
  "questions": [
    {
      "header": "Progress",
      "question": "{description of what was just generated}\n\nFiles created:\n- {file1}\n- {file2}\n\n{any notes about key decisions made}\n\nHow should I proceed?",
      "multiSelect": false,
      "options": [
        {"label": "Continue", "description": "Looks good, proceed to the next batch"},
        {"label": "Show me a file", "description": "I want to review a specific file before continuing"},
        {"label": "Adjust something", "description": "I want to change something before moving on"}
      ]
    }
  ]
}
```

If "Show me a file" -- ask which file, display it, then re-ask.
If "Adjust something" -- ask what to change, make the edit, then re-ask.

---

## Universal Substitution Map

Apply these substitutions across ALL generated files:

| MISK value | Replacement |
|---|---|
| `MISK_DEMO` | `{SLUG}_DEMO` (e.g. `ARAMCO_DEMO`) |
| `PROGRAMS_DATA` | `{DOMAIN}_DATA` (e.g. `OPERATIONS_DATA`) |
| `ML` (schema) | `ML` (keep as-is) |
| `MISK Foundation` | `{customer_name}` |
| `MISK` (UI labels) | `{display_name}` |
| `misk` (lowercase, Docker/SPCS/service names) | `{slug}` |
| `misk-green` / `#2D6A4F` | `{slug}-primary` / `{brand_color}` |
| `misk-green-dark` | `{slug}-primary-dark` (darken `{brand_color}` by 15%) |
| `MISK_DEMO_WH` | `{SLUG}_DEMO_WH` |
| `MISK_DEPLOY_ROLE` | `{SLUG}_DEPLOY_ROLE` |
| `MISK_APP_ROLE` | `{SLUG}_APP_ROLE` |
| `MISK_READER_ROLE` | `{SLUG}_READER_ROLE` |
| `MISK_DEPLOY_USER` | `{SLUG}_DEPLOY_USER` |
| `MISK_APP_USER` | `{SLUG}_APP_USER` |
| `misk-deploy` (connection) | `{slug}-deploy` |
| `misk-images` (image repo) | `{slug}-images` |
| `MISK_POOL` (compute pool) | `{SLUG}_POOL` |
| Entity names (BENEFICIARIES, ENROLLMENTS, PROGRAMS, etc.) | Domain entities from `references/data-domain-templates.md` |
| `labelAr` fields | Generalize to `label{Lang}` (e.g. `labelFr`, `labelTr`). Keep if bilingual, remove if `language: en` |
| `ask-misk` | `ask-{slug}` |
| `Ask MISK` | `Ask {display_name}` |
| Port 8200 (backend) | Keep 8200 |
| Port 5300 (frontend) | Keep 5300 |
| `{original_connection}` (author's connection) | `{connection_name}` |

---

## Session 1 — Infrastructure

Generate these files (see `references/misk-architecture.md` for templates):

### `config.toml`
```toml
[project]
name        = "{slug}-platform-demo"
database    = "{SLUG}_DEMO"
data_schema = "{DOMAIN}_DATA"
ml_schema   = "ML"

[warehouse]
name         = "{SLUG}_DEMO_WH"
size         = "MEDIUM"
auto_suspend = 120
max_clusters = 2

[roles]
deploy = "{SLUG}_DEPLOY_ROLE"
app    = "{SLUG}_APP_ROLE"
reader = "{SLUG}_READER_ROLE"

[users]
deploy = "{SLUG}_DEPLOY_USER"
app    = "{SLUG}_APP_USER"

[connections]
admin  = "{slug}-deploy"
deploy = "{slug}-deploy"

[spcs]
database        = "{SLUG}_DEMO"
schema          = "{DOMAIN}_DATA"
image_repo      = "{SLUG}_IMAGES"
compute_pool    = "{SLUG}_POOL"
instance_family = "CPU_X64_S"
backend_service = "{SLUG}_BACKEND"
backend_port    = 8200
frontend_port   = 80

[data]
seed_dir = "{target_path}/data/output"
stage    = "{SLUG}_SEED_STAGE"
```

### `deploy/scripts/02_ddl.sql`
Generate using the domain entities from `references/data-domain-templates.md` for `{industry}`. Each entity becomes a table in `{SLUG}_DEMO.{DOMAIN}_DATA`. Preserve all MISK patterns:
- `created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()`
- Clustering keys instead of indexes
- `DIV0()` for any division
- Fully qualified names everywhere
- `MERGE INTO` instead of `ON CONFLICT`

### All other deploy scripts (`01`, `03`–`07`, `99`)
Apply the substitution map. Entity-specific references (table names in grants, DMFs, dynamic tables) use the new domain entity names.

### `deploy/deploy.py`
Apply substitution map to all string literals referencing MISK names.

### `deploy/load_data.py`
Update table names to domain entity names, keeping the same Snowpark session pattern.

### `.gitignore`
```
deploy/keys/
*.p8
*.env
__pycache__/
.venv/
node_modules/
dist/
*.egg-info/
.DS_Store
```

### `docker-compose.yml`
Apply substitution map to service names, image names, and environment variables.

**Commit after completing infrastructure:**
```bash
git add .
git commit -m "chore: S1 infrastructure scaffolding — {slug}"
```

### S1 Checkpoint: Review config + deploy scripts (ask_user_question)

After generating all S1 files, present a summary:

```json
{
  "questions": [
    {
      "header": "S1 Review",
      "question": "Infrastructure generated:\n\n- config.toml: database={SLUG}_DEMO, warehouse={SLUG}_DEMO_WH\n- 7 deploy scripts (RBAC, DDL with {N} tables, stage, ML, DTs, grants, teardown)\n- deploy.py orchestrator + load_data.py\n- .gitignore + docker-compose.yml\n\nKey decisions:\n- {N} domain tables based on {industry} vertical\n- Warehouse size: MEDIUM (auto-suspend 120s)\n- RBAC: 3 roles (deploy, app, reader)\n\nWant to review any file or adjust before I commit?",
      "multiSelect": false,
      "options": [
        {"label": "Commit and proceed", "description": "Everything looks right, commit S1"},
        {"label": "Show config.toml", "description": "Review the project configuration"},
        {"label": "Show DDL", "description": "Review the table definitions (02_ddl.sql)"},
        {"label": "Adjust something", "description": "I need to change a setting"}
      ]
    }
  ]
}
```

After S1 commit, propose data generation:

```json
{
  "questions": [
    {
      "header": "Data",
      "question": "Infrastructure is committed. Next step: generate synthetic seed data. Run data generation now?",
      "multiSelect": false,
      "options": [
        {"label": "Yes, generate data now", "description": "I'll walk you through entity names, regions, and scale"},
        {"label": "Skip for now", "description": "I'll generate data later (before S2 deploy)"}
      ]
    }
  ]
}
```

If "Yes" -- load `sub-skills/data-gen/SKILL.md` and run the interactive data generation flow.

---

## Session 2 — Backend

### `backend/app/session.py`
Direct copy of MISK `session.py` with substitution map applied (warehouse name, database name, connection name).

### `backend/app/main.py`

Generate the full FastAPI application with all endpoints. Use `references/demo-pages-catalog.md` as the endpoint index. Apply these rules:

1. **All SQL queries**: replace MISK table names with domain entity names
2. **KPI labels**: adapt to domain (e.g. `total_beneficiaries` → `total_{primary_entity_plural}`)
3. **Column names**: use domain-specific columns from `references/data-domain-templates.md`
4. **Warehouse name**: `{SLUG}_DEMO_WH`
5. **Database/schema**: `{SLUG}_DEMO.{DOMAIN}_DATA`

**Special handling — Cortex Search (Policy Intelligence):**

The `_seed_policy_documents()` function at backend startup inserts regulatory documents and creates the Cortex Search Service. Adapt it per `{regulatory_context}`:

| Regulatory context | Document content to seed |
|---|---|
| PDPL | PDPL Chapter 1-5 articles from `references/data-domain-templates.md` → pdpl_policy_docs |
| GDPR | GDPR Art.5-17 rights and obligations |
| HIPAA | HIPAA Privacy Rule, Minimum Necessary, Breach Notification |
| SOX | SOX Section 302, 404 data control requirements |
| Generic | Internal data governance policy template |

The service name: `{SLUG}_DEMO.{DOMAIN}_DATA.POLICY_SEARCH`

The function is always wrapped in try/except — non-fatal if Cortex Search is unavailable.

**Commit after completing backend:**
```bash
git add backend/
git commit -m "feat: S2 backend API — {slug}"
```

### S2 Checkpoint: Verify backend starts + test endpoints (ask_user_question)

After generating backend, start the server and test:

```bash
cd {target_path}/backend
uv sync
SNOWFLAKE_CONNECTION_NAME={connection_name} uv run uvicorn app.main:app --port 8200 &
sleep 5
curl -f http://localhost:8200/api/health
curl -s http://localhost:8200/api/platform/kpis | python -m json.tool | head -20
kill %1
```

Present results to user:

```json
{
  "questions": [
    {
      "header": "S2 Verify",
      "question": "Backend verification:\n\n- Health check: {PASS/FAIL}\n- /api/platform/kpis: {PASS/FAIL} ({N} rows, {time}ms)\n- Cortex Search seed: {seeded N docs / skipped}\n- Semantic model: {generated / deferred to S4}\n\nEndpoints generated: {N} across {M} page groups.\n\nReady to proceed to frontend?",
      "multiSelect": false,
      "options": [
        {"label": "Proceed to S3", "description": "Backend is working, start frontend core"},
        {"label": "Show endpoint list", "description": "List all generated endpoints"},
        {"label": "Test more endpoints", "description": "Run additional smoke tests"},
        {"label": "Fix an issue", "description": "Something is broken, help me debug"}
      ]
    }
  ]
}
```

---

## Session 3 — Frontend Core (selected pages)

**Important**: Only generate pages listed in `selected_pages.core` from the research context. If a page was deselected during research, skip it entirely (no file, no endpoint, no route).

### Package files
Generate `package.json`, `vite.config.ts`, `tailwind.config.js`, `nginx.conf` from MISK equivalents with substitution map applied.

Key `tailwind.config.js` change:
```js
colors: {
  '{slug}-primary': '{brand_color}',
  '{slug}-primary-dark': '{brand_color_darkened}',
  // keep snow-cyan, snow-blue, text-primary, text-secondary, etc.
}
```

### `frontend/src/lib/scenarios.ts`
Generate the `SCENARIOS` array with only the selected pages from `selected_pages.core` and `selected_pages.advanced`:
- Page IDs and labels adapted to domain
- `label{Lang}` fields: include secondary language labels if bilingual (`en+ar` → `labelAr`, `en+fr` → `labelFr`, etc.), omit if `language: en`
- `snowflakeFeature` and `businessBenefit` adapted to domain
- Only include entries for pages that were selected during research

### Shared components (copy with substitution map):
- `Header.tsx` — replace MISK logo reference with `{slug}-logo` + update title
- `Sidebar.tsx` — replace MISK brand color references
- `HeroSection.tsx` — generic, minimal changes
- `SqlPreviewButton.tsx` — copy as-is (no MISK-specific content)
- `DataPreview.tsx` — copy as-is
- `FeatureBadge.tsx` — copy as-is
- `QueryTimeBadge.tsx` — copy as-is
- `PanelCard.tsx` — copy as-is

### Core pages (8 pages)
For each page, adapt from MISK equivalent:
- Replace all MISK entity names with domain entity names
- Adapt KPI labels, chart titles, and business scenario text to domain
- Replace secondary language business scenario text if `language: en` (remove bilingual blocks)
- For RTL languages (ar, fa, ur): add `dir="rtl"` + appropriate font class
- For LTR languages (fr, tr, pt): add translated labels, no RTL handling needed
- Keep all UX patterns identical: explicit Load buttons, tab cache, wizard steps, NCIM cards

**Commit after each page:**
```bash
git commit -m "feat: add Page{Name} — {slug}"
```

### S3 Checkpoint: Preview in browser (ask_user_question)

After generating all core pages, start both servers for a live preview:

```bash
# Terminal 1: Backend
cd {target_path}/backend
SNOWFLAKE_CONNECTION_NAME={connection_name} uv run uvicorn app.main:app --port 8200 &

# Terminal 2: Frontend
cd {target_path}/frontend
npm install && npm run dev &
```

```json
{
  "questions": [
    {
      "header": "S3 Preview",
      "question": "Core pages generated and running at http://localhost:5300\n\nPages built:\n{list of core pages with status}\n\nOpen the browser and check:\n1. Sidebar shows all pages\n2. Platform page loads KPIs on button click\n3. Analytics tabs switch without re-fetching\n4. Ask {display_name} page shows question grid\n\nHow does it look?",
      "multiSelect": false,
      "options": [
        {"label": "Looks good, commit S3", "description": "All pages working, proceed"},
        {"label": "A page has an issue", "description": "I'll describe what's wrong"},
        {"label": "Styling needs adjustment", "description": "Colors, layout, or text need tweaking"},
        {"label": "Show me the page list", "description": "Remind me which pages were built"}
      ]
    }
  ]
}
```

If any issues -- fix them before committing. Do not leave S3 with broken pages.

---

## Session 4 — Frontend Advanced (selected pages)

Same approach as Session 3. **Only generate pages listed in `selected_pages.advanced` from the research context.** Skip any page the user did not select. Additionally:

### `PageArchitecture.tsx` — Special handling (static page)
This page has no backend calls. Generate the `LAYERS` array by:
1. Reading `references/data-domain-templates.md` → `{industry}` → architecture nodes
2. Replacing MISK layer node labels (Enrollment System, Beneficiaries, etc.) with domain-specific equivalents
3. Keeping all layer colors, structure, navigation event pattern (`{slug}:navigate` custom event) identical

### `PagePolicyIntelligence.tsx` — Special handling (Cortex Search)
Adapt predefined questions to `{regulatory_context}`:
- PDPL: "What are the PDPL rules for collecting {primary_entity} data?"
- GDPR: "What is the GDPR data retention requirement for {primary_entity} records?"
- HIPAA: "What does HIPAA require for {primary_entity} data sharing?"

Adapt compliance check practice examples to domain entities.

### `backend/app/semantic_model/{slug}_semantic_model.yaml`
Generate Cortex Analyst semantic model for 4-6 primary domain entities. Structure:
```yaml
name: {slug}_semantic_model
tables:
  - name: {PRIMARY_ENTITY}
    base_table:
      database: {SLUG}_DEMO
      schema: {DOMAIN}_DATA
      table: {PRIMARY_ENTITY}
    # dimensions, time_dimensions, measures adapted to entity columns
```

**Commit after completing advanced pages:**
```bash
git commit -m "feat: S4 frontend-advanced — {slug}"
```

### S4 Checkpoint: Full page inventory review (ask_user_question)

After S4, the full demo is built. Present the complete page inventory:

```json
{
  "questions": [
    {
      "header": "S4 Review",
      "question": "All selected pages are now built.\n\n| # | Page | Session | Status |\n|---|------|---------|--------|\n{full page table with build status}\n\nTotal: {N} pages ({core} core + {advanced} advanced)\n\nSemantic model: {slug}_semantic_model.yaml generated with {N} tables.\n\nOpen http://localhost:5300 and navigate through the pages.\n\nReady for S5 (polish + demo pack)?",
      "multiSelect": false,
      "options": [
        {"label": "All pages work, proceed to S5", "description": "Ready for polish, docs, and demo script"},
        {"label": "A page needs fixing", "description": "I found an issue on a specific page"},
        {"label": "Run full validation", "description": "Run the validate sub-skill for a thorough check"},
        {"label": "Add another page", "description": "I want to include a page I didn't select earlier"}
      ]
    }
  ]
}
```

---

## Session 5 — Polish + Demo Pack

This session is **local-first**. No Docker, no SPCS. Focus on verifying the app works locally and producing documentation.

### Verify Local Run

Run these checks and fix any issues:

```bash
# Backend
cd {target_path}/backend
uv sync
SNOWFLAKE_CONNECTION_NAME={connection_name} uv run uvicorn app.main:app --port 8200 &
sleep 5
curl -f http://localhost:8200/api/health
# Test 3 critical endpoints
curl -s http://localhost:8200/api/platform/kpis | python -m json.tool
curl -s http://localhost:8200/api/performance/benchmark | python -m json.tool
curl -s http://localhost:8200/api/lineage | python -m json.tool
kill %1

# Frontend
cd {target_path}/frontend
npm install
npm run build    # Must pass with zero errors
npm run dev &    # Start dev server on port 5300
sleep 3
# Verify proxy works
curl -s http://localhost:5300/api/health
kill %1
```

### `README.md`
Generate a full project README documenting:
- Customer context and architecture
- Local dev setup instructions (backend + frontend)
- How to deploy data (`python deploy/deploy.py --all`)
- How to run locally (`uvicorn` + `npm run dev`)
- Page inventory with screenshots/descriptions
- App Runtime + SPCS deployment details

### `docs/ARCHITECTURE.md`
Generate system architecture documentation covering:
- Medallion architecture for `{industry}` domain
- RBAC design
- API catalog (all 50+ endpoints)
- Data model (entity relationships)

### `docs/DEMO_SCRIPT.md`
Load `sub-skills/demo-script/SKILL.md` and generate talking points.

**Commit after completing polish pack:**
```bash
git commit -m "docs: S5 local verification + README + DEMO_SCRIPT — {slug}"
```

### S5 Cost Estimator: Deployed Demo Running Cost

Before proposing deployment, calculate and present the estimated ongoing cost of the deployed demo. This helps partners set expectations with customers.

Run these queries:

```sql
-- Current storage
SELECT
  ROUND(SUM(AVERAGE_DATABASE_BYTES) / POWER(1024, 3), 3) AS storage_tb
FROM SNOWFLAKE.ACCOUNT_USAGE.DATABASE_STORAGE_USAGE_HISTORY
WHERE DATABASE_NAME = '{SLUG}_DEMO'
  AND USAGE_DATE = CURRENT_DATE();

-- Warehouse config
SHOW WAREHOUSES LIKE '{SLUG}_DEMO_WH';
-- Extract: size, auto_suspend, min/max_cluster_count

-- Cortex Search service (always-on cost)
SHOW CORTEX SEARCH SERVICES IN SCHEMA {SLUG}_DEMO.{DOMAIN}_DATA;

-- Count active Dynamic Tables
SELECT COUNT(*) AS dt_count
FROM INFORMATION_SCHEMA.DYNAMIC_TABLES
WHERE TABLE_SCHEMA = '{DOMAIN}_DATA';
```

Present the cost estimate:

```json
{
  "questions": [
    {
      "header": "Demo cost",
      "question": "Estimated running cost of the deployed demo:\n\n| Component | Config | Est. monthly cost |\n|-----------|--------|-------------------|\n| Warehouse ({SLUG}_DEMO_WH) | {size}, auto-suspend {N}s | ~{X} credits/mo (idle: ~0) |\n| Storage | {N} GB | ~${Y}/mo ($23/TB) |\n| Cortex Search service | {N} docs indexed | ~{Z} credits/mo |\n| Dynamic Tables ({N} DTs) | {target_lag} refresh | ~{W} credits/mo |\n| Cortex AI functions | Per-query (on demand) | ~{V} credits per demo run |\n| App Runtime / SPCS | {config} | ~{U} credits/hr when active |\n| **Total idle cost** | | **~{total_idle} credits/mo** |\n| **Total per demo run** | ~30 min active | **~{per_run} credits** |\n\nNotes:\n- Warehouse auto-suspends after {N}s of inactivity -- idle cost is near zero\n- Cortex Search has a baseline cost while the service exists\n- Dynamic Tables refresh automatically -- cost depends on target lag\n- Per demo run = ~30 min of warehouse + Cortex AI calls\n\nProceed to deployment options?",
      "multiSelect": false,
      "options": [
        {"label": "Understood, proceed", "description": "Show me deployment options"},
        {"label": "Reduce costs", "description": "Help me optimize (smaller warehouse, longer auto-suspend, fewer DTs)"},
        {"label": "Generate cost doc", "description": "Write a cost breakdown document I can share with the customer"}
      ]
    }
  ]
}
```

If "Reduce costs" -- suggest optimizations:
- Increase auto-suspend to 300s (from 120s)
- Use X-SMALL warehouse for demos with <1M rows
- Suspend Cortex Search service between demo sessions
- Set Dynamic Table target lag to 1 hour (instead of downstream)

If "Generate cost doc" -- write `{target_path}/docs/COST_ESTIMATE.md` with the full breakdown.

### End of S5: Propose Deployment

After S5 is complete and the demo runs locally, ask the user:

```json
{
  "questions": [
    {
      "header": "Deploy",
      "question": "The demo is working locally. How would you like to deploy it?",
      "type": "options",
      "multiSelect": false,
      "options": [
        {"label": "App Runtime (recommended)", "description": "Deploy as a Next.js app via snow app deploy — no Docker, no compute pool, live URL in minutes"},
        {"label": "SPCS (legacy)", "description": "Deploy as Docker multi-container service on SPCS — requires Docker Desktop + compute pool"},
        {"label": "No, local is enough", "description": "Keep it local-only — demo from laptop via localhost"},
        {"label": "Later", "description": "Skip for now, I can always deploy later"}
      ]
    }
  ]
}
```

If "App Runtime" → generate next-session prompt for S6 (App Runtime path).
If "SPCS" → generate next-session prompt for S6 (SPCS legacy path).
If "No" or "Later" → output DEMO READY block (no S6 prompt).

---

## Session 6a -- App Runtime Deploy (recommended)

Only run if the user chose "App Runtime" during S5 or explicitly requests it.

App Runtime deploys a Next.js app directly to Snowflake -- no Docker for the frontend, no compute pool, live URL in minutes. The app runs inside Snowflake's security perimeter with SSO and RBAC.

### Architecture: FastAPI backend (SPCS) + React frontend (App Runtime)

The FastAPI backend is kept as-is and deployed as an SPCS service (single container, no frontend). The React frontend is wrapped in a minimal Next.js shell and deployed via App Runtime. The Next.js app proxies API calls to the SPCS backend endpoint.

```
[User Browser] --> [App Runtime: Next.js frontend] --> [SPCS: FastAPI backend] --> [Snowflake]
```

### Step 1: Create Next.js wrapper for the React frontend

Generate a Next.js project that serves the existing React pages and proxies `/api/*` calls to the SPCS backend:

```
{target_path}/app-runtime/
  app.yml                    # App Runtime manifest
  next.config.js             # rewrites /api/* to SPCS backend URL
  package.json
  src/                       # symlink or copy from frontend/src
  public/                    # static assets
```

`next.config.js`:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.BACKEND_URL
          ? `${process.env.BACKEND_URL}/api/:path*`
          : 'http://localhost:8200/api/:path*',
      },
    ];
  },
};
module.exports = nextConfig;
```

### Step 2: Deploy FastAPI backend to SPCS (single container)

Use the same `backend/Dockerfile` from the SPCS legacy path (Session 6b below), but deploy only the backend -- no frontend container, no nginx proxy.

```bash
# Build and push backend image only
cd {target_path}/backend
docker build --platform linux/amd64 -t {slug}-backend:latest .
docker tag {slug}-backend:latest <registry>/{slug}-backend:latest
docker push <registry>/{slug}-backend:latest

# Create single-container SPCS service for backend
```

The SPCS spec is simpler -- just the backend container:
```yaml
spec:
  containers:
    - name: backend
      image: /{SLUG}_DEMO/{DOMAIN}_DATA/{SLUG}_IMAGES/{slug}-backend:latest
      env:
        SNOWFLAKE_ACCOUNT: {{{{id.name}}}}
        SNOWFLAKE_HOST: {{{{id.name}}}}.snowflakecomputing.com
      readinessProbe:
        port: 8200
        path: /api/health
  endpoints:
    - name: backend
      port: 8200
      public: true
```

### Step 3: Deploy frontend via App Runtime

`app.yml`:
```yaml
version: 2

name: {SLUG}_DEMO_APP
database: SNOWFLAKE_APPS
schema: PUBLIC
query_warehouse: {SLUG}_DEMO_WH

env:
  BACKEND_URL: https://<spcs-backend-endpoint>

ignore:
  - node_modules
  - .env*
  - .next
  - .git
```

```bash
cd {target_path}/app-runtime
snow app setup --app-name {SLUG}_DEMO_APP
snow app deploy
snow app open
```

### Step 4: Share with roles

```sql
GRANT USAGE ON DATABASE SNOWFLAKE_APPS TO ROLE {SLUG}_APP_ROLE;
GRANT USAGE ON SCHEMA SNOWFLAKE_APPS.PUBLIC TO ROLE {SLUG}_APP_ROLE;
GRANT USAGE ON APPLICATION SERVICE SNOWFLAKE_APPS.PUBLIC.{SLUG}_DEMO_APP TO ROLE {SLUG}_APP_ROLE;
```

### Key Differences from Full SPCS

| Aspect | App Runtime + SPCS backend | Full SPCS |
|--------|---------------------------|-----------|
| Docker required | Backend only | Both containers |
| Frontend deploy | `snow app deploy` (minutes) | Docker build + push (10+ min) |
| Frontend auth | Snowflake SSO built-in | Token flow via SPCS ingress |
| Frontend rebuild | Seconds (no Docker) | Minutes (Docker rebuild) |
| Backend | Same SPCS service | Same SPCS service |
| nginx proxy | Not needed (Next.js rewrites) | Required |

### Limitations

- App Runtime is Node.js/Next.js only -- the FastAPI backend still requires SPCS
- Not available on trial accounts or government regions
- Backend SPCS endpoint URL must be known before frontend deploy

**Commit after App Runtime deploy:**
```bash
git commit -m "feat: S6 App Runtime frontend + SPCS backend — {slug}"
```

---

## Session 6b — SPCS Deploy (legacy)

Only run if the user opted in during S5 or explicitly requests SPCS later.

### `backend/Dockerfile`
```dockerfile
FROM python:3.12-slim
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY pyproject.toml .
RUN pip install uv && uv sync --frozen
COPY app/ app/
EXPOSE 8200
HEALTHCHECK CMD curl -f http://localhost:8200/api/health
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8200"]
```

### `frontend/Dockerfile`
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### `frontend/nginx.conf`
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location /api/ {
        proxy_pass http://localhost:8200;
        proxy_read_timeout 300s;
        proxy_connect_timeout 10s;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### `spcs/01_infra.sql`
Apply substitution map to create compute pool + image repo.

### `spcs/{slug}-service-spec.yaml`
Generate single-container SPCS spec for backend only. Frontend is deployed via App Runtime (see S6a above).

### `spcs/spcs_deploy.sh`
Build → push → CREATE/ALTER SERVICE script.

**Critical SPCS rules:**
- Always `docker build --platform linux/amd64` on Apple Silicon
- Image paths must be lowercase
- `readinessProbe.port` must exactly match 8200
- Use `ALTER SERVICE` not `DROP + CREATE` (preserves ingress URL)

**Commit after SPCS deploy:**
```bash
git commit -m "feat: S6 SPCS deployment — {slug}"
```

---

## UX Standard (MANDATORY — enforced from MISK + Imam University reference projects)

The following UX patterns are the **proven standard** extracted from both MISK and Imam University projects. Every generated page MUST follow these patterns exactly. Deviations will produce a demo that looks broken.

### Button State Machine (the only acceptable pattern)

```
Initial:    <Play className="w-4 h-4" />     + "{Action Verb}"     → bg-{slug}-primary
Loading:    <Loader2 className="w-4 h-4 animate-spin" />  + same label   → disabled:opacity-50
Loaded:     <RefreshCw className="w-4 h-4" />  + "Refresh"          → same class
```

**NEVER generate**: "Done", "Loaded ✓", "Complete", "Finished", "OK", or any terminal state button. The button always allows re-run via "Refresh".

### Pre-Load State (what the user sees before clicking)

```tsx
{/* 1. Header zone: title + FeatureBadge + action button (right-aligned) */}
{/* 2. ScenarioHeader: business context (always visible, collapses post-load) */}
{/* 3. Empty state card: contextual icon + CTA text */}
```

The empty state uses a **contextual icon** matching the page theme:
| Page type | Icon | CTA text pattern |
|-----------|------|-----------------|
| Platform/Overview | `Database` | Click **Explore Platform** to load infrastructure metrics |
| Performance | `Zap` | Click **Run Benchmark** to measure query performance |
| Analytics | `BarChart3` | Click **Load Data** to explore enrollment analytics |
| ML/AI | `Brain` | Run each card independently to see ML in action |
| Lineage | `GitBranch` | Click **Trace Lineage** to map data flow |
| Time Travel | `Clock` | Click **Start Demo** to begin the recovery walkthrough |
| Quality | `Shield` | Click **Run Quality Check** to scan data metrics |
| Governance | `Lock` | Click **Run** to demonstrate the policy |

### Post-Load State (animated reveal)

```tsx
{loaded && (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    {/* Visualizations here — NEVER JSON.stringify */}
  </motion.div>
)}
```

After data loads, the header zone gains two new elements:
- `QueryTimeBadge` — shows execution time (green pill, font-mono)
- `SqlPreviewButton` — opens modal with the SQL that ran (copy button inside)

### Tab Cache Pattern (multi-tab pages)

```tsx
const [cache, setCache] = useState<Partial<Record<TabKey, DataState>>>({})
```

Green dot `●` on tab label indicates cached data. Switching tabs preserves loaded data. Each tab has its own Load button (no auto-fetch on tab switch).

### Card Pattern (independent feature cards)

Each card in NCIMCardPage has its own:
- Play → Loader2 → RefreshCw button
- Independent loading state
- Own visualization (chart/table, never JSON)

### Wizard Pattern (step-by-step pages)

Start Demo → fetch all steps at once → reveal one-by-one via "Next Step (2/4)" → "All steps completed!" with CheckCircle + "Reset Demo" button.

### Anti-patterns to NEVER generate

| Anti-pattern | What to do instead |
|---|---|
| `JSON.stringify(data, null, 2)` in a `<pre>` tag | Use ChartCard, KPIGrid, or styled table |
| "Done" button after loading | Use RefreshCw + "Refresh" |
| "Loaded ✓" terminal state | Use RefreshCw + "Refresh" |
| Auto-fetch in `useEffect` | Explicit button click required |
| Generic `HeroSection` component | Use `ScenarioHeader` with all props filled |
| Inline color values (#2D6A4F) | Use Tailwind classes: `bg-{slug}-primary` |
| `dangerouslySetInnerHTML` for SQL | Use `SqlPreviewButton` modal |

### Cortex Agent / Semantic View Gotchas (from knowledge wiki)

When generating pages that use Cortex Agent or Cortex Analyst:

- **Cortex Agent**: Use `SNOWFLAKE.CORTEX.DATA_AGENT_RUN(agent_name, question)` — NOT `AGENT!COMPLETE()` method-call syntax (it does not work in SQL)
- **Semantic View**: Created via `CALL SYSTEM$CREATE_SEMANTIC_VIEW_FROM_YAML(schema, yaml, verify_only)` — there is no `CREATE SEMANTIC VIEW` DDL
- **Semantic View YAML**: The verified-queries field key is `sql` (not `verified_query`); `verified_at` must be int64 timestamp or omitted — a date string fails
- **AI functions in Dynamic Tables**: NEVER put `AI_COMPLETE`, `AI_CLASSIFY`, etc. in a Dynamic Table definition — they re-run on every refresh with non-deterministic output and credit cost. Use stored procedures instead.
- **AI_COMPLETE**: Use `AI_COMPLETE` (not `SNOWFLAKE.CORTEX.COMPLETE`) — it supports `response_format => {'type':'json','schema':{...}}` for guaranteed valid JSON
- **GRANT for Cortex**: `GRANT DATABASE ROLE SNOWFLAKE.CORTEX_USER TO ROLE {SLUG}_APP_ROLE` requires ACCOUNTADMIN

---

## Key Patterns to Preserve (from references/misk-architecture.md)

1. **`exec_sql()` pattern**: always returns `(list[dict], list[str], float)` -- rows use lowercase keys
2. **Tab cache**: `Partial<Record<TabKey, DataState>>` prevents re-fetch on tab switch
3. **Wizard steps**: fetch all steps at once, reveal one-by-one client-side
4. **No auto-fetch**: every page has an explicit "Load Data" button -- no `useEffect` auto-fetch
5. **Mock fallback**: ACCOUNT_USAGE views have ~45 min latency -- always add `isIllustrative` flag + amber banner
6. **Fully qualified SQL**: `{SLUG}_DEMO.{DOMAIN}_DATA.TABLE_NAME` everywhere -- no bare table names
7. **DIV0()**: never `a / b` in SQL -- always `DIV0(a, b)`
8. **MERGE not ON CONFLICT**: Snowflake has no `ON CONFLICT` -- use `MERGE INTO`
9. **Clustering not indexes**: `ALTER TABLE ... CLUSTER BY (col)` not `CREATE INDEX`

## Visualization Rules (MANDATORY -- no JSON dumps)

**NEVER render API response data as `JSON.stringify` in a `<pre>` tag.** Every page MUST use the appropriate visualization component from `assets/templates/`:

| Page type | Visualization component | When to use |
|-----------|------------------------|-------------|
| KPI overview (Platform) | `KPIGrid.tsx` | 3-6 large metric cards with trend arrows |
| Bar/line/area charts (Analytics, Performance, ML) | `ChartCard.tsx` (Recharts) | Any time series, distribution, or comparison data |
| Drill-down data (Analytics, regional) | `DrillDownTable.tsx` | Tables where clicking a row loads detail data |
| Node graph (Lineage) | `LineageGraph.tsx` | 3-column source/transform/consumer graph |
| Quality metrics (Data Quality) | `DataQualityPanel.tsx` | Gauge bars with pass/warn/fail status |
| Step-by-step demo (Time Travel, Recovery) | `WizardStepPage.tsx` | Progressive reveal with status indicators |
| Independent cards (ML, Masking, Classification) | `NCIMCardPage.tsx` | 3 side-by-side cards, each with own load button |
| Multi-tab data (Analytics, Quality) | `TabCachePage.tsx` | Tabs with cached data, chart per tab |
| Pie/donut (Cost breakdown, classification results) | `ChartCard.tsx` type="pie" | Distribution/proportion data |

### Page-to-visualization mapping

| Page | Primary visualization | Chart types |
|------|----------------------|-------------|
| Platform | KPIGrid (3-4 cards) + ChartCard bar | KPI cards + bar chart breakdown |
| Performance | KPIGrid (benchmark result) + ChartCard bar (cold vs warm) | Bar comparison |
| Analytics | ChartCard per tab (bar, line, area) + DrillDownTable + MapLibre | 7 different chart types across tabs |
| ML/AI | NCIMCardPage with ChartCard inside each card | Line (forecast), scatter (anomalies), bar (classification) |
| Time Travel | WizardStepPage with status-colored steps | Step indicators, not charts |
| Cortex AI | NCIMCardPage with sentiment bar charts per card | Bar (sentiment), table (entities) |
| Lineage | **LineageGraph** (3-column node layout) | Node graph, NOT a table |
| Quality | **DataQualityPanel** with gauge bars | Quality bars with thresholds, NOT raw numbers |
| Optimization | ChartCard bar (query history) + KPIGrid | Bar chart + KPI |
| Pricing | ChartCard pie (cost breakdown) + KPIGrid | Pie chart + explainer |
| Dynamic Tables | ChartCard area (refresh timeline) + table | Area chart + status table |
| Data Masking | NCIMCardPage: raw table → policy code → masked table | 3 cards showing transformation |
| Data Classification | TabCachePage: scan results as ChartCard pie | Pie (categories) + table (columns) |
| Ask {Customer} | Chat UI (custom) | Conversation bubbles, not charts |
| Cortex Agent | Chat UI (custom) | Conversation with tool-use trace |

### Required packages in `package.json`

```json
{
  "dependencies": {
    "recharts": "^2.12.0",
    "maplibre-gl": "^4.0.0",
    "framer-motion": "^11.0.0"
  }
}
```

The generate sub-skill MUST include these in the generated `package.json`. Without them, pages fall back to JSON dumps.

## Scenario Context Rules (MANDATORY -- no generic business text)

**Every generated page MUST include a `<ScenarioHeader>` component** (from `assets/templates/ScenarioHeader.tsx`) with ALL props filled using domain-specific content from the research context. Generic text is not acceptable.

### What generic looks like (WRONG):
```tsx
<ScenarioHeader
  painPoint="This page shows performance."
  businessValue="Fast queries."
  snowflakeFeature="Elastic Compute"
  expectedOutcome="Data loads quickly."
/>
```

### What domain-specific looks like (CORRECT):
```tsx
<ScenarioHeader
  painPoint="{customer_name} processes 10M+ {entity} records daily across 13 regions. Legacy systems take 45+ minutes for a single regional report."
  businessValue="Any analyst can query 10M records in under 2 seconds — no pre-aggregation, no materialized views, no waiting."
  snowflakeFeature="Elastic Compute / Virtual Warehouses"
  expectedOutcome="Watch the query time badge: cold cache ~1.8s, warm cache ~0.3s. The size reference table shows how this scales."
  presenterMode={presenterMode}
  talkingPoint="{customer_name} queries 10M {entity} records in 0.8 seconds — no pre-aggregation, no materialized view."
  demoSteps={[
    "Click 'Run Benchmark' — point out the cold cache time in the badge",
    "Click 'Run Again' — point out the warm cache improvement (result cache)",
    "Show the warehouse size reference table — explain auto-suspend and scaling",
  ]}
  transition="Now that we've seen the speed — let's see what you can DO with that speed. Analytics dashboards."
/>
```

### Where the content comes from

| ScenarioHeader prop | Source |
|---------------------|--------|
| `painPoint` | Research context → `pain_points` list → the pain point that maps to this page |
| `businessValue` | Research context → `story_arcs` → the `hook` for this page |
| `snowflakeFeature` | `references/demo-pages-catalog.md` → Snowflake Feature column |
| `expectedOutcome` | `references/demo-pages-catalog.md` → Special column + domain adaptation |
| `talkingPoint` | `references/demo-pages-catalog.md` → Demo Hook column |
| `demoSteps` | `references/demo-pages-catalog.md` → endpoint list → translate to user actions |
| `transition` | Research context → `demo_sequence` → what connects this page to the next |

### Presenter Mode

Every page receives `presenterMode` as a prop from the App.tsx context (`PresenterModeContext`). When the presenter clicks the "Presenter Mode" toggle in the header:
- Purple panel appears below the business context with talking points, demo steps, and transition text
- Audience sees only the challenge/value/outcome (the purple panel is visually marked "audience can't see this")
- The partner uses this as a built-in teleprompter during the live demo

### Enforcement checklist (generate sub-skill MUST verify)

Before committing any page component, verify:
- [ ] `ScenarioHeader` is imported and used (not the old Business Scenario `<div>`)
- [ ] `painPoint` references the customer name and specific domain entities
- [ ] `businessValue` is a concrete outcome (not "this is useful")
- [ ] `expectedOutcome` says what to look for after clicking Load (specific numbers or behaviors)
- [ ] `talkingPoint` is adapted from the demo-pages-catalog Demo Hook with domain entities
- [ ] `demoSteps` has 2-4 concrete actions (not "explore the data")
- [ ] `transition` connects to the next page in the demo flow
- [ ] `presenterMode={presenterMode}` is passed (not hardcoded to false)
