---
name: platform-demo-plan
description: "Multi-session plan generator for platform demo projects. Uses create_plan tool to present the 5-session breakdown, customized per industry and scenario matrix."
---

# Plan — Multi-Session Project Plan Generator

This sub-skill runs at the end of Session 0, after intake and research are complete. It generates the full 5-session plan using the `create_plan` tool, creates the memory file, and writes `docs/PLAN.md`.

---

## Step 1: Load Scenario Matrix

Read `references/scenario-matrix.md` to determine which pages go in Session 3 (core) vs Session 4 (advanced) based on `{industry}` from the research context.

**Session 3 Core Pages (always included — 8 pages):**
- Platform Overview
- Performance at Scale
- Analytics Dashboards
- Time Travel
- Disaster Recovery
- Data Lineage
- Data Quality
- Ask {CustomerName} (Cortex Analyst chatbot)

**Session 4 Advanced Pages (industry-driven priority — all 15 included, order varies):**
- Platform Architecture (static — always first in S4)
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
| S1 | Infrastructure | config + SQL deploy | config.toml, 7 deploy scripts, deploy.py, load_data.py |
| S2 | Backend | API layer | session.py, main.py (all endpoints + Cortex Search seed) |
| S3 | Frontend Core | 8 pages | scenarios.ts, shared components, core pages |
| S4 | Frontend Advanced | 9 pages + semantic model | Advanced pages, {slug}_semantic_model.yaml |
| S5 | Polish + Demo Pack | Local run verified | README, ARCHITECTURE.md, DEMO_SCRIPT.md |
| S6 | SPCS Deploy _(optional)_ | Port to Snowflake | Dockerfiles, SPCS spec, deploy script |

## Session 1 — Infrastructure
Files to create:
- config.toml (project settings, warehouse, roles, users, SPCS)
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

## Session 2 — Backend
Files to create:
- backend/pyproject.toml
- backend/Dockerfile
- backend/app/session.py
- backend/app/main.py  (all endpoints for 23 pages + Cortex Search seed)

## Session 3 — Frontend Core
Files to create:
- frontend/package.json, vite.config.ts, tailwind.config.js, nginx.conf
- frontend/src/lib/api.ts, scenarios.ts
- frontend/src/App.tsx
- frontend/src/components/shared/ (Header, Sidebar, HeroSection, SqlPreviewButton, DataPreview, FeatureBadge, QueryTimeBadge, PanelCard)
- frontend/src/components/pages/ (8 core pages: PagePlatform, PagePerformance, PageAnalytics, PageTimeTravel, PageRecovery, PageLineage, PageQuality, PageAsk{Name})

## Session 4 — Frontend Advanced
Files to create:
- frontend/src/components/pages/ (15 advanced pages: PageArchitecture, PageMLAI, PageCortexAI, PageOptimization, PagePricing, PageDynamicTables, PageDataMasking, PageDataClassification, PagePolicyIntelligence, PageDocumentAI, PageCortexAgent, PageNotebooks, PageIcebergTables, PageStreaming, PageTasksStreams)
- backend/app/semantic_model/{slug}_semantic_model.yaml

## Session 5 — Polish + Demo Pack
Files to create:
- README.md
- docs/ARCHITECTURE.md
- docs/DEMO_SCRIPT.md

Verify:
- Backend starts locally: `SNOWFLAKE_CONNECTION_NAME={connection} uvicorn app.main:app --port 8200`
- Frontend builds and runs: `cd frontend && npm install && npm run dev`
- All selected pages load without errors
- Key endpoints return data

## Session 6 — SPCS Deploy _(optional — only if deployment_mode != local_only)_
Files to create:
- backend/Dockerfile
- frontend/Dockerfile + nginx.conf
- spcs/01_infra.sql
- spcs/{slug}-service-spec.yaml
- spcs/spcs_deploy.sh

## Data Domain
Primary schema: {SLUG}_DEMO.{DOMAIN}_DATA
Entities: {entity list}
Regulatory: {regulation} → Policy Intelligence docs will cover {regulation} articles
```

---

## Step 4: Present Plan with create_plan Tool

Use the `create_plan` tool to present the multi-session breakdown to the user. The plan overview should be:

> "5-session plan to build a {industry} Snowflake Platform Demo for {customer_name}. Covers 17 interactive pages, FastAPI backend, React/Vite frontend, SPCS deployment, and a DEMO_SCRIPT.md with prioritized {industry}-specific talking points."

The tasks for the `create_plan` tool should be:
1. S0 Planning — Create project skeleton, memory file, PLAN.md ← in_progress
2. S1 Infrastructure — config.toml + 7 deploy SQL scripts
3. S2 Backend — FastAPI main.py (50+ endpoints) + Cortex Search seed
4. S3 Frontend Core — 8 core pages + shared components
5. S4 Frontend Advanced — 15 advanced pages + semantic model
6. S5 Polish + Demo Pack — Local verification + README + DEMO_SCRIPT.md
7. S6 SPCS Deploy _(optional)_ — Dockerfiles + SPCS spec + deploy script

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
