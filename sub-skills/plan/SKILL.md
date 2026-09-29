---
name: platform-demo-plan
description: "Multi-session plan generator for platform demo projects. Uses create_plan tool to present the 5-session breakdown, customized per industry and scenario matrix."
---

# Plan — Multi-Session Project Plan Generator

This sub-skill runs at the end of Session 0, after intake and research are complete. It generates the full 5-session plan using the `create_plan` tool, creates the memory file, and writes `docs/PLAN.md`.

---

## Step 1: Load Selected Pages from Research Context

Read the research context block (produced by the research sub-skill) to get `selected_pages.core` and `selected_pages.advanced`. These lists drive what gets built in S3 and S4.

Read `references/scenario-matrix.md` to validate the selection against `{industry}` priorities.

**Session 3 Core Pages (from research selection — typically 8 pages):**
The research sub-skill recommends a core set based on universal value. The default core set is:
- Platform Overview
- Performance at Scale
- Analytics Dashboards
- Time Travel
- Disaster Recovery
- Data Lineage
- Data Quality
- Ask {CustomerName} (Cortex Analyst chatbot)

If the user deselected any core pages during research, respect that selection.

**Session 4 Advanced Pages (from research selection — varies by customer):**
Only pages the user selected during the research capability selection step are included. Available advanced pages:
- Platform Architecture (static — always first in S4 if selected)
- ML & Predictive AI
- Cortex AI (NLP functions)
- Query Optimization
- Cost & Pricing Model
- Dynamic Tables
- Data Masking + PDPL/GDPR framing
- Data Classification
- Policy Intelligence (Cortex Search) ← **lead scenario for Government/Finance/Healthcare**
- Document AI (AI_PARSE_DOCUMENT) ← **lead for Finance/Healthcare**
- Cortex Agent (Agentic AI) ← **multi-tool: Search + Analyst combined**
- Notebooks (Data Science Workflow)
- Iceberg Tables (Open Format)
- Snowpipe Streaming (Real-time Ingestion) ← **lead for Telecom/Energy**
- Tasks + Streams (CDC Pipelines) ← **complements Dynamic Tables**

---

## Step 2: Create the Project Folder

```bash
mkdir -p {target_path}/docs/sessions
mkdir -p {target_path}/deploy/scripts
mkdir -p {target_path}/backend/app/semantic_model
mkdir -p {target_path}/frontend/src
mkdir -p {target_path}/spcs
```

Initialize git:
```bash
cd {target_path}
git init
```

---

## Step 3: Write docs/PLAN.md

Write `{target_path}/docs/PLAN.md` with the full session breakdown:

```markdown
# {CustomerName} Platform Demo — Project Plan
**Created**: {date}
**Customer**: {customer_name} ({slug})
**Industry**: {industry}
**Regulatory Context**: {regulation}
**Deployment Mode**: {local_only | local_then_spcs | spcs_from_start}

## Session Overview

| Session | Name | Scope | Delivers |
|---------|------|-------|---------|
| S0 | Planning | This session | PLAN.md, memory file, project skeleton |
| S1 | Snowflake Infrastructure + Data | config + SQL deploy + seed data | config.toml, deploy scripts, deploy.py, seed CSVs, loaded tables |
| S2 | Backend | API layer (local) | session.py, main.py (endpoints), Cortex Search seed, semantic model |
| S3 | Frontend | All selected pages (local) | App.tsx, shared components, all selected pages (core + advanced) |
| S4 | Testing | Full test suite | Unit + integration + E2E tests, all passing |
| S5 | Deploy | Mandatory deployment | App Runtime frontend + SPCS backend (or full SPCS) |
| S6 | Documentation + Handoff | Customer-facing + technical docs | HTML deck, technical wiki, DEMO_SCRIPT.md, README |

## Session 1 -- Snowflake Infrastructure + Data
Files to create:
- config.toml (project settings, warehouse, roles, users)
- .gitignore
- docker-compose.yml
- deploy/deploy.py
- deploy/load_data.py
- deploy/scripts/01_rbac_setup.sql
- deploy/scripts/02_ddl.sql  ({domain} tables: {entity list})
- deploy/scripts/03_stage.sql
- deploy/scripts/04_ml_setup.sql
- deploy/scripts/05_ml_train.sql
- deploy/scripts/06_dynamic_tables.sql
- deploy/scripts/07_app_grants.sql
- deploy/scripts/99_teardown.sql
- scripts/generate_seed_data.py (domain-specific, interactive generation)
- data/output/*.csv (generated seed data)

Actions:
- Run deploy.py to create all Snowflake objects
- Run generate_seed_data.py to create seed CSVs
- Run load_data.py to load data into Snowflake
- Verify: tables have data, roles work, warehouse responds

## Session 2 -- Backend
Files to create:
- backend/pyproject.toml
- backend/app/session.py
- backend/app/main.py  (endpoints for selected pages + Cortex Search seed)
- backend/app/semantic_model/{slug}_semantic_model.yaml

Actions:
- Start backend locally, verify health endpoint
- Test 3-5 critical endpoints

## Session 3 -- Frontend
Files to create:
- frontend/package.json, vite.config.ts, tailwind.config.js, nginx.conf
- frontend/src/lib/api.ts, scenarios.ts
- frontend/src/App.tsx
- frontend/src/components/shared/ (Header, Sidebar, HeroSection, SqlPreviewButton, DataPreview, FeatureBadge, QueryTimeBadge, PanelCard)
- frontend/src/components/pages/ (ALL selected pages -- core + advanced)

Actions:
- npm install, npm run build (must pass)
- Preview all pages in browser at localhost:5300

## Session 4 -- Testing
Files to create:
- tests/conftest.py
- tests/unit/test_{page}.py (one per selected page)
- tests/integration/test_sql_compilation.py, test_data_loaded.py, test_cortex_search.py
- tests/e2e/test_demo_scenarios.py
- pytest.ini

Actions:
- Run all unit tests (must pass)
- Run integration tests against Snowflake (must pass)
- Run E2E tests with backend + frontend running (must pass)

## Session 5 -- Deploy (MANDATORY)
App Runtime path:
- app-runtime/next.config.js (proxy /api/* to SPCS backend)
- app-runtime/app.yml (App Runtime manifest)
- spcs/backend-only service spec

SPCS path:
- backend/Dockerfile
- frontend/Dockerfile + nginx.conf
- spcs/{slug}-service-spec.yaml
- spcs/spcs_deploy.sh

Actions:
- Deploy backend to SPCS
- Deploy frontend to App Runtime (or SPCS)
- Verify live URL works
- Share with roles

## Session 6 -- Documentation + Handoff
Files to create:
- docs/deck/{slug}_demo_deck.html (customer-facing interactive presentation)
- docs/wiki/{slug}_technical_wiki.html (technical setup with diagrams)
- docs/DEMO_SCRIPT.md (talking points + scenario flow)
- docs/COST_ESTIMATE.md (build cost + running cost)
- README.md (project documentation)

## Data Domain
Primary schema: {SLUG}_DEMO.{DOMAIN}_DATA
Entities: {entity list}
Regulatory: {regulation}
```

---

## Step 4: Present Plan with create_plan Tool

Use the `create_plan` tool to present the multi-session breakdown to the user. The plan overview should be:

> "6-session plan to build a {industry} Snowflake Platform Demo for {customer_name}. Covers {N_total} interactive pages, FastAPI backend, React/Vite frontend, full test suite, mandatory deployment, customer-facing HTML deck, and technical wiki."

The tasks for the `create_plan` tool should be:
1. S0 Planning -- Create project skeleton, memory file, PLAN.md (in_progress)
2. S1 Snowflake Infrastructure + Data -- deploy scripts + seed data generation + load
3. S2 Backend -- FastAPI main.py (endpoints for selected pages) + Cortex Search seed
4. S3 Frontend -- All {N_total} selected pages + shared components + semantic model
5. S4 Testing -- Unit + integration + E2E tests, all passing
6. S5 Deploy -- App Runtime frontend + SPCS backend (mandatory)
7. S6 Documentation + Handoff -- Customer HTML deck + technical wiki + DEMO_SCRIPT.md

---

## Step 5: HARD STOP — Wait for User Approval

After presenting the plan, say:

```
Plan created for {customer_name}. Please review and approve to proceed to Session 1,
or let me know if you'd like to adjust the scope, page selection, or session breakdown.
```

Do NOT proceed to any code generation until the user explicitly approves.

---

## Step 6: S0 Closing Sequence (after user approval)

Once approved:

1. Create `/memories/{slug}-demo-project.md` using the template from `sub-skills/sdlc/SKILL.md`
2. Populate the Research Summary section with the research context block
3. Run the S0 git sequence:
   ```bash
   cd {target_path}
   git add docs/PLAN.md
   git commit -m "docs: S0 project plan — {slug}"
   ```
4. Update memory: mark S0 as `complete`
5. Write `{target_path}/docs/sessions/SESSION_0_NEXT_PROMPT.txt`
6. Output the Session 1 next-session prompt in chat (format from `sub-skills/sdlc/SKILL.md`)
