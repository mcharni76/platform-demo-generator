---
name: platform-demo-generator
title: Platform Demo Builder v5.2
summary: Generate a customized Snowflake Platform Demo linking technical capabilities to business outcomes. v5.2.
description: |
  Build a production-quality Snowflake Platform Demo customized per customer. Every page connects a
  Snowflake capability to a concrete business outcome — the demo tells a story, not a feature list.
  Pages selected dynamically from 30+ capabilities across compute, governance, AI/ML, data engineering,
  application development, data sharing, and open formats. FastAPI backend (SPCS) + React/Vite frontend
  (App Runtime). Three interaction modes: Quick (one-prompt), Guided (wizard), Expert (full control).
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

## Step 1 — Detect Intent

| User says | Action |
|-----------|--------|
| "build/create/generate demo for {customer}" | NEW → Step 2 |
| "resume/continue session", "start session N", next-session prompt | RESUME → Read `/memories/{slug}-demo-project.md`, jump to session |
| "scope document", "intake form", "requirements" | SCOPE → Read `sub-skills/scope-doc/SKILL.md` |
| "demo script", "talking points" | SCRIPT → Read `sub-skills/demo-script/SKILL.md` |
| "validate", "smoke test" | VALIDATE → Read `sub-skills/validate/SKILL.md` |

Confirm intent before proceeding.

## Step 2 — Choose Interaction Mode

```json
{
  "questions": [{
    "header": "Mode",
    "question": "How do you want to build this demo?",
    "multiSelect": false,
    "options": [
      {"label": "Quick", "description": "One prompt — I'll tell you the customer, industry, and what I need. You handle the rest with smart defaults."},
      {"label": "Guided", "description": "Step-by-step wizard — you ask me questions at every decision point. Best for first-time use."},
      {"label": "Expert", "description": "Full control — I pick every feature, every page, every config option. Maximum customization."}
    ]
  }]
}
```

**Quick mode**: Extract all fields from the user's prompt (customer name, country, industry, pain points). Fill remaining fields with industry-pack defaults (see intake sub-skill). Present the full context block for confirmation. Skip to plan.

**Guided mode**: Run `sub-skills/intake/SKILL.md` → `sub-skills/research/SKILL.md` → `sub-skills/plan/SKILL.md` with interactive questions at every step.

**Expert mode**: Same as Guided but with additional granular questions: exact feature selection, page-by-page customization, endpoint-level control, manual brand color entry, deployment architecture choice upfront.

## Step 3 — Session 0: Plan

Always load `sub-skills/sdlc/SKILL.md` first (memory + git protocol).

```
Read sub-skills/intake/SKILL.md       → collect customer context
Read sub-skills/research/SKILL.md     → map pain points to capabilities
Read sub-skills/plan/SKILL.md         → generate PLAN.md
HARD STOP: wait for plan approval
```

## Step 4 — Sessions 1-6: Build → Test → Deploy → Document

| Session | Name | Read these sub-skills |
|---------|------|-----------------------|
| S1 | Infrastructure + Data | `sub-skills/generate/SKILL.md` (S1 section) + `sub-skills/data-gen/SKILL.md` |
| S2 | Backend API | `sub-skills/generate/SKILL.md` (S2 section) |
| S3 | Frontend | `sub-skills/generate/SKILL.md` (S3 section) |
| S4 | Testing | `sub-skills/test/SKILL.md` |
| S5 | Deploy (mandatory) | `sub-skills/generate/SKILL.md` (S5 section) |
| S6 | Documentation + Handoff | `sub-skills/demo-script/SKILL.md` + `sub-skills/docs-gen/SKILL.md` |

**Never auto-advance between sessions.** Each session ends with a git commit and a next-session prompt.

## Sub-Skills

| Sub-skill | File | When loaded |
|-----------|------|-------------|
| SDLC Protocol | `sub-skills/sdlc/SKILL.md` | Every session start |
| Intake | `sub-skills/intake/SKILL.md` | S0 |
| Research | `sub-skills/research/SKILL.md` | S0 |
| Plan | `sub-skills/plan/SKILL.md` | S0 |
| Generate | `sub-skills/generate/SKILL.md` | S1, S2, S3, S5 |
| Data Gen | `sub-skills/data-gen/SKILL.md` | S1 |
| Testing | `sub-skills/test/SKILL.md` | S4 |
| Demo Script | `sub-skills/demo-script/SKILL.md` | S6 |
| Docs Generation | `sub-skills/docs-gen/SKILL.md` | S6 |
| Scope Document | `sub-skills/scope-doc/SKILL.md` | On demand |
| Validate | `sub-skills/validate/SKILL.md` | On demand |

## References

| File | Content |
|------|---------|
| `references/misk-architecture.md` | Structural reference: file map, patterns, SPCS setup |
| `references/demo-pages-catalog.md` | Page catalog: 30+ pages × features × endpoints × business hooks |
| `references/data-domain-templates.md` | 8 verticals: entity DDL + regulatory docs |
| `references/scenario-matrix.md` | Industry × scenario priority + narrative threads |
| `references/gotchas-playbook.md` | 50+ battle-tested gotchas from NCIM, IMSU, MISK |

## Rules

1. **Business value first**: every page connects a Snowflake capability to a measurable business outcome via `ScenarioHeader`
2. **No auto-fetch**: explicit "Load Data" / "Run" buttons on every page — no `useEffect` data loading
3. **Templates, not hallucination**: use `assets/templates/` as structural base — adapt, never invent from scratch
4. **Fully qualified SQL**: `{SLUG}_DEMO.{DOMAIN}_DATA.TABLE_NAME` — no bare table names
5. **Deploy architecture**: App Runtime (React frontend, no Docker) + SPCS (FastAPI backend, single container)
6. **exec_sql() contract**: returns `(list[dict], list[str], float)` — lowercase keys always
7. **Read `references/gotchas-playbook.md`** before writing any SQL, Python, or React code
