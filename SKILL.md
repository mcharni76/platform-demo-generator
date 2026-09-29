---
name: platform-demo-generator
title: Platform Demo Builder v5.0
summary: Generate a customized Snowflake Platform Demo for any customer in 6 structured sessions. v5.0.
description: |
  Build a production-quality Snowflake Platform Demo customized per customer. Pages are selected
  dynamically based on customer industry, pain points, and use case requirements — drawn from a
  catalog of capabilities covering compute, governance, AI/ML, data engineering, and open formats.
  FastAPI backend (SPCS), React/Vite frontend (App Runtime). Enforces SDLC: plan-first, multi-session
  boundaries, git commit per feature, memory persistence, and auto-generated next-session prompt.
  Proven on NCIM, IMSU, and MISK projects.
  Triggers: platform demo, demo pack, generate demo, customer demo, build demo, demo generator,
  demo for [customer], create demo, snowflake demo, presales demo, partner demo.
  Do NOT use for: SAP BDC demos (use sap-bdc-demo-generator), single-page Streamlit apps
  (use developing-with-streamlit), or enablement labs (use enablement-package).
tools:
  - snowflake_sql_execute
  - Bash
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - web_fetch
  - memory
  - ask_user_question
  - system_todo_write
prompt: Build a Snowflake platform demo for ACME Corp
language: en
status: Published
author: Mohamed Charni
type: community
---

# Platform Demo Generator

## Overview

Generates a production-quality Snowflake Platform Demo for any customer in 5 structured sessions.
Built on the proven MISK Foundation architecture — battle-tested across NCIM (Government/Municipal),
IMSU (Education), and MISK (Non-profit/Education) projects. Pages are selected dynamically from a
catalog of capabilities based on customer industry, pain points, and requirements.

**In scope:** Full-stack demo generation (FastAPI + React/Next.js), RBAC, deployment (App Runtime or SPCS), semantic model,
Cortex Search RAG, Cortex Analyst chatbot, ML pipelines, data governance pages, demo script.

**Out of scope:** Production data pipelines, real customer data loading, CI/CD setup, monitoring/alerting.

## Prerequisites

1. Snowflake account with ACCOUNTADMIN privileges (or SYSADMIN + grants).
2. Snow CLI installed and authenticated (`snow connection list` shows active connection).
3. Node.js 18+ and Python 3.12+ available locally.
4. Docker Desktop installed (for SPCS image builds on macOS: `--platform linux/amd64` required).
5. Customer context: at minimum a name, country, and website URL.

## When to Use

- Build a new Snowflake Platform Demo for a presales engagement
- Generate a customized demo from an RFP or customer context document
- Resume a demo generation session already in progress
- Generate the DEMO_SCRIPT.md talking points for an existing demo

## When NOT to Use

| Topic | Use instead |
|---|---|
| SAP BDC connector demo with streaming | `sap-bdc-demo-generator` |
| Single-page Streamlit data app | `developing-with-streamlit` |
| Hands-on enablement lab package | `enablement-package` |
| Solution architecture blueprint (no code) | `solution-blueprint` |
| Cortex Agent setup and debugging | `cortex-agent` |

## Workflow

### Step 0 — SDLC Protocol (every session)

**Before doing anything else**, load `sub-skills/sdlc/SKILL.md`. This enforces:
- Memory check at session start
- Git commit after every feature and at session end
- Session handover document creation
- Next-session prompt generated at session close

### Step 1 — Intent Detection

| Intent | Triggers | Action |
|--------|----------|--------|
| NEW | "build demo for", "create demo", "new demo", "generate demo for" | Full workflow — start with intake |
| SCOPE | "scope document", "customization form", "intake form", "scope excel", "requirements doc" | Generate Excel scope/customization workbook via scope-doc sub-skill |
| RESUME | "resume session", "continue session", "start session N", "next session" | Load memory → jump to session N |
| DEMO SCRIPT ONLY | "generate demo script", "talking points", "demo pack only" | Load research context → run demo-script sub-skill only |
| VALIDATE | "validate demo", "smoke test", "check demo" | Run validate sub-skill |

If the user pastes a **next-session prompt** (contains "NEXT SESSION PROMPT"), immediately:
1. Load `sub-skills/sdlc/SKILL.md`
2. Read `/memories/{slug}-demo-project.md`
3. Start the session indicated in the prompt

⚠️ STOPPING POINT: After identifying intent, confirm the action before proceeding.

### Step 2 — Session 0: Planning

```
1. Load sub-skills/intake/SKILL.md       → collect 9 customer fields
2. Load sub-skills/research/SKILL.md     → web fetch + RFP analysis
3. Load sub-skills/plan/SKILL.md         → create_plan + PLAN.md + memory file
4. HARD STOP: wait for user plan approval
5. Run S0 closing sequence (git + next-session prompt S1)
```

⚠️ STOPPING POINT: Plan must be explicitly approved before any code generation begins.

### Step 3 -- Sessions 1-6: Build, Test, Deploy, Document

| Session | Name | Scope | Sub-skill |
|---------|------|-------|-----------|
| S1 | Snowflake Infrastructure | config.toml + deploy SQL scripts + deploy.py + seed data | `generate/SKILL.md` + `data-gen/SKILL.md` |
| S2 | Backend | session.py + main.py (endpoints for selected pages) + Cortex Search seed | `generate/SKILL.md` |
| S3 | Frontend | All selected pages (core + advanced) + shared components + semantic model | `generate/SKILL.md` |
| S4 | Testing | Unit tests + integration tests + E2E tests tied to selected features | `test/SKILL.md` |
| S5 | Deploy | App Runtime frontend + SPCS backend (or full SPCS). Mandatory. | `generate/SKILL.md` |
| S6 | Documentation + Handoff | Customer-facing HTML deck + technical wiki + DEMO_SCRIPT.md + README | `demo-script/SKILL.md` + `docs-gen/SKILL.md` |

**Build locally first, deploy always.** Sessions 1-3 produce a working demo on `localhost`. Session 4 validates it. Session 5 deploys it. Session 6 generates the documentation and presentation materials.

### Knowledge Wiki Integration

At the start of every session, the SDLC sub-skill reads relevant pages from the shared knowledge wiki (`/memories/_index.md`). This brings in:
- **Patterns**: SPCS deployment patterns, session handover protocol, config-driven zero-hardcoding
- **Concepts**: Cortex AI functions, SPCS networking, Snowflake SQL gotchas
- **Decisions**: React+FastAPI on SPCS over Streamlit, stored procs for AI pipelines
- **GOTCHAS.md**: 173+ battle-tested gotchas across all projects

This compounds knowledge from every project you've built -- the skill gets smarter over time.

### Code Templates (Verified Working Code)

The skill uses **8 verified code templates** in `assets/templates/` as the structural base for every generated file. The LLM adapts these templates (substituting domain entities, endpoints, config) but NEVER generates page patterns from scratch. This ensures:
- Every page follows a proven UX pattern (PageTemplate, TabCachePage, WizardStepPage, NCIMCardPage)
- Backend follows the exact `exec_sql()` contract
- Session factory handles both local and SPCS auth
- No hallucinated React patterns or broken FastAPI structures

⚠️ STOPPING POINT: Never auto-advance between sessions. Wait for explicit user instruction.

## Sub-Flows

| Sub-skill | File | Purpose |
|-----------|------|---------|
| SDLC Protocol | `sub-skills/sdlc/SKILL.md` | Memory, git, handovers, next-session prompts |
| Scope Document | `sub-skills/scope-doc/SKILL.md` | Excel customization form for stakeholder sign-off |
| Intake | `sub-skills/intake/SKILL.md` | 9-field customer interview |
| Research | `sub-skills/research/SKILL.md` | Web fetch + RFP analysis + industry mapping |
| Plan | `sub-skills/plan/SKILL.md` | Multi-session plan generation |
| Data Gen | `sub-skills/data-gen/SKILL.md` | Synthetic CSV generation per vertical |
| Generate | `sub-skills/generate/SKILL.md` | Per-session file scaffolding |
| Testing | `sub-skills/test/SKILL.md` | Unit + integration + E2E test generation |
| Demo Script | `sub-skills/demo-script/SKILL.md` | DEMO_SCRIPT.md with talking points |
| Docs Generation | `sub-skills/docs-gen/SKILL.md` | Customer-facing HTML deck + technical wiki |
| Validate | `sub-skills/validate/SKILL.md` | Post-generation smoke testing |

## Reference Files

| File | Purpose |
|------|---------|
| `references/misk-architecture.md` | Full file map, patterns, Cortex Search setup |
| `references/demo-pages-catalog.md` | Page catalog × Snowflake feature × endpoints × hooks |
| `references/data-domain-templates.md` | 8 verticals with entity DDL + regulatory docs |
| `references/scenario-matrix.md` | Industry × scenario priority matrix |
| `references/gotchas-playbook.md` | Battle-tested gotchas from NCIM, IMSU, MISK |

## Key Design Principles

1. **No auto-fetch**: every page uses explicit "Load Data" / "Run" buttons — no `useEffect` auto-fetch
2. **Tab cache pattern**: `Partial<Record<TabKey, DataState>>` — switching tabs never re-fetches
3. **NCIM philosophy**: Business Scenario always visible, Input/Output split, independent run per card
4. **Fully qualified SQL**: always `{SLUG}_DEMO.{DOMAIN}_DATA.TABLE_NAME`
5. **Bilingual toggle**: Secondary language via `language` field from intake. RTL languages (ar, fa, ur) get `dir="rtl"` + appropriate font. LTR languages (fr, tr, pt) get translated labels only.
6. **Mock fallback**: ACCOUNT_USAGE views have ~45 min latency — always have illustrative fallback
7. **Cortex Search**: seeded at backend startup, non-fatal try/except around service creation
8. **exec_sql() contract**: always returns `(list[dict], list[str], float)` — lowercase keys
9. **Deployment architecture**: App Runtime for React frontend (no Docker), SPCS for FastAPI backend (single container). Frontend proxies `/api/*` to SPCS backend.

## Stopping Points

- Step 1 — Confirm intent before starting workflow
- Step 2 — Confirm plan approval before any code generation
- Step 3 — Never auto-advance between sessions
- Step 4 — Confirm validation results before declaring DEMO READY

## Common Mistakes

- **Auto-fetching data in `useEffect`**. Every page MUST have a manual "Load" button. Auto-fetch
  makes demo unpredictable (data loads before presenter is ready to explain).
- **Using uppercase keys from Snowpark Row**. `exec_sql()` normalizes to lowercase. Never access
  `row["ROWS_LOADED"]` — use `row["rows_loaded"]`.
- **Forgetting `DIV0()`**. Snowflake has no safe division — bare `a/b` throws on zero. Always `DIV0(a, b)`.
- **Using `ON CONFLICT` or `CREATE INDEX`**. Snowflake uses `MERGE INTO` and `CLUSTER BY`.
- **Skipping `ERROR_ON_COLUMN_COUNT_MISMATCH = FALSE`** in COPY INTO when CSVs lack `created_at` (DEFAULT column).
- **Using `GRANT USAGE ON DATABASE SNOWFLAKE`**. Must be `GRANT IMPORTED PRIVILEGES ON DATABASE SNOWFLAKE`.
- **Building Docker images without `--platform linux/amd64`** on Apple Silicon. SPCS rejects arm64 images.
- **Forgetting `FORCE = TRUE`** in COPY INTO after a failed load (load history blocks retry).
- **Pointing nginx proxy to container hostname in multi-container pod**. Use `localhost` — same network namespace.
- **Using `private_key_path` in Snow CLI**. Must be `private_key_file`. Connector-python uses `private_key_path`.
- **Lowercase `authenticator` in Snow CLI**. Must be `SNOWFLAKE_JWT` (uppercase). Connector-python accepts either.
- **Missing future grants**. Without `GRANT ... ON FUTURE TABLES`, new tables created after initial deploy are invisible to APP_ROLE.
- **Forgetting `proxy_read_timeout 300s`** in nginx.conf. Cortex Analyst calls can take 30+ seconds; default 60s timeout kills them.
- **Querying DT immediately after creation**. `INITIALIZE = ON_CREATE` can take several minutes. Add a wait or poll.
- **Including target-leaking features in ML training**. (e.g. `final_grade` NULL for all dropped students = pure leakage).
- **Calling `TABLE(MODEL!PREDICT(...))`**. Snowflake ML Classification PREDICT is a scalar method, not UDTF.
- **Hardcoding dates in ML inference**. Always anchor to `(SELECT MAX(date_col) FROM source_table)` for synthetic data.
- **Forgetting Cortex Analyst SSL host fix**. Replace underscores with dashes: `host.replace("_", "-")` before REST calls.
