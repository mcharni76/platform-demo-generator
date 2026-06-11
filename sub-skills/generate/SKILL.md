---
name: platform-demo-generate
description: "Project scaffolding for platform demo generation. Invoked once per session (S1-S5). Generates files scoped to the current session using MISK as the structural template."
---

# Generate — Project Scaffolding

This sub-skill is invoked at the start of Sessions 1–5 (after loading the SDLC sub-skill). It generates files for the current session only — never all sessions at once.

Read `references/misk-architecture.md` before generating any file. It contains the full MISK structural reference including critical patterns, gotchas, and exact file content to adapt.

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
| `labelAr` fields | Keep if `language: en+ar`, remove if `language: en` |
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

---

## Session 3 — Frontend Core (8 pages)

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
Generate the `SCENARIOS` array with:
- All 17 page IDs defined in `references/demo-pages-catalog.md`
- Labels adapted to domain (e.g. `"Data Platform Overview"` not `"MISK Data Platform Overview"`)
- `labelAr` fields: include if `language: en+ar`, omit if `language: en`
- `snowflakeFeature` and `businessBenefit` adapted to domain

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
- Replace Arabic business scenario text if `language: en` (remove AR-only blocks)
- Keep all UX patterns identical: explicit Load buttons, tab cache, wizard steps, NCIM cards

**Commit after each page:**
```bash
git commit -m "feat: add Page{Name} — {slug}"
```

---

## Session 4 — Frontend Advanced (9 pages)

Same approach as Session 3. Additionally:

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
- SPCS deployment section (marked as optional/future)

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

### End of S5: Propose SPCS

After S5 is complete and the demo runs locally, ask the user:

```json
{
  "questions": [
    {
      "header": "SPCS Deploy",
      "question": "The demo is working locally. Would you like to port it to SPCS for a shareable public URL?",
      "type": "options",
      "multiSelect": false,
      "options": [
        {"label": "Yes, deploy to SPCS", "description": "I'll generate Dockerfiles, SPCS spec, and deploy script (Session 6)"},
        {"label": "No, local is enough", "description": "Keep it local-only — demo from laptop via localhost"},
        {"label": "Later", "description": "Skip for now, I can always run Session 6 later"}
      ]
    }
  ]
}
```

If "Yes" → generate next-session prompt for S6.
If "No" or "Later" → output DEMO READY block (no S6 prompt).

---

## Session 6 — SPCS Deploy (optional)

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
Generate multi-container spec (backend + frontend in same pod, localhost comms).

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

## Key Patterns to Preserve (from references/misk-architecture.md)

1. **`exec_sql()` pattern**: always returns `(list[dict], list[str], float)` — rows use lowercase keys
2. **Tab cache**: `Partial<Record<TabKey, DataState>>` prevents re-fetch on tab switch
3. **Wizard steps**: fetch all steps at once, reveal one-by-one client-side
4. **No auto-fetch**: every page has an explicit "Load Data" button — no `useEffect` auto-fetch
5. **Mock fallback**: ACCOUNT_USAGE views have ~45 min latency — always add `isIllustrative` flag + amber banner
6. **Fully qualified SQL**: `{SLUG}_DEMO.{DOMAIN}_DATA.TABLE_NAME` everywhere — no bare table names
7. **DIV0()**: never `a / b` in SQL — always `DIV0(a, b)`
8. **MERGE not ON CONFLICT**: Snowflake has no `ON CONFLICT` — use `MERGE INTO`
9. **Clustering not indexes**: `ALTER TABLE ... CLUSTER BY (col)` not `CREATE INDEX`
