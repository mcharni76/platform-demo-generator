---
name: platform-demo-sdlc
description: "SDLC enforcement for platform demo generation. Loaded at the start of every session. Handles memory protocol, git commits, session handover docs, and next-session prompt generation."
---

# SDLC Protocol — Platform Demo Generator

This sub-skill is loaded at the **start of every session** and defines the non-negotiable workflow rules. Follow all steps exactly.

---

## SESSION START PROTOCOL (always first)

### Step 0: Cost Tracking Init

At the start of every session, capture the baseline credit usage so we can compute session cost at the end:

```sql
SELECT SUM(CREDITS_USED) AS credits_before
FROM SNOWFLAKE.ACCOUNT_USAGE.WAREHOUSE_METERING_HISTORY
WHERE WAREHOUSE_NAME = '{SLUG}_DEMO_WH'
  AND START_TIME >= DATEADD('day', -1, CURRENT_TIMESTAMP());
```

Store the result as `credits_before` for this session. If the warehouse doesn't exist yet (S0/S1), set `credits_before = 0`.

Also record session start time: `session_start_time = CURRENT_TIMESTAMP()`.

### Step 1: Read Memory

```
memory view /memories/{slug}-demo-project.md
```

Also read the skill's gotchas reference (bundled with the skill):
```
Read references/gotchas-playbook.md
```

If `/memories/{slug}-demo-project.md` does not exist, this is **Session 0**. Create it using the template below.

### Step 1b: Knowledge Wiki Lookup

Check the shared knowledge wiki for patterns relevant to this session:

```
memory view /memories/_index.md
```

Scan for pages relevant to the current session scope. Read only matching pages.

**Always-relevant** (every session):
- `GOTCHAS.md` -- master gotcha registry
- `patterns/config-driven-zero-hardcoding.md`
- `concepts/snowflake-sql-gotchas-extended.md`

**Session-specific**:
| Session | Wiki pages to read |
|---------|-------------------|
| S1 Infra | `patterns/snowflake-sql-scripting-traps.md`, `concepts/spcs.md` |
| S2 Backend | `concepts/asyncio-snowpark-fastapi.md`, `concepts/cortex-ai-functions.md` |
| S3 Frontend | `decisions/spcs-over-streamlit.md` |
| S4 Testing | `patterns/gold-gate-test-battery.md` |
| S5 Deploy | `concepts/spcs-deployment.md`, `patterns/spcs-service-deployment.md` |
| S6 Docs | `patterns/session-handover-protocol.md` |

Report relevant findings before starting work.

### Step 2: Confirm Session Scope

After reading memory, state clearly:
- Current session: S{N} — {session_name}
- Status from memory: {what was completed in prior sessions}
- This session will deliver: {bulleted scope from PLAN.md}

Do not proceed until scope is confirmed (either by user or from the next-session prompt context).

---

## MEMORY FILE TEMPLATE (Session 0 only — create at project start)

Create `/memories/{slug}-demo-project.md` with:

```markdown
# {CustomerName} Platform Demo

## Status: S0 — Planning
## Created: {today's date}
## Project Path: {target_path}
## Snowflake Connection: {connection_name}

## Customer Context
- Name: {customer_name}
- Slug: {slug}
- Country: {country}
- Industry: {industry}  ← filled after research
- Language: {en | en+ar | en+fr | en+tr | en+fa | en+ur}
- Website: {website_url}
- Brand Color: {brand_color}
- Regulatory Context: {PDPL | GDPR | HIPAA | Generic}  ← filled after research

## Session Log
| Session | Name | Status | Commit | Date |
|---------|------|--------|--------|------|
| S0 | Planning | in-progress | — | {date} |
| S1 | Infrastructure | pending | — | — |
| S2 | Backend | pending | — | — |
| S3 | Frontend Core | pending | — | — |
| S4 | Frontend Advanced | pending | — | — |
| S5 | Polish + Demo Pack | pending | — | — |
| S6 | SPCS Deploy (optional) | pending | — | — |

## Research Summary
(filled during Session 0 research phase)
- Industry: 
- Key Entities: 
- Pain Points: 
- Regulatory Context: 
- Language Cue: 

## Gotchas Found
(append during any session)

## Build Cost Tracker
| Session | Credits (compute) | Credits (cloud) | Cortex tokens | Storage delta | Duration |
|---------|-------------------|-----------------|---------------|---------------|----------|
| S0 | 0 | 0 | 0 | 0 | {N} min |
| S1 | — | — | — | — | — |
| S2 | — | — | — | — | — |
| S3 | — | — | — | — | — |
| S4 | — | — | — | — | — |
| S5 | — | — | — | — | — |
| **Total** | **—** | **—** | **—** | **—** | **—** |
```

---

## GIT COMMIT PROTOCOL

### Within a session — commit after each logical unit:

```bash
git add {changed_files}
git commit -m "{type}: {description} — {slug}"
```

Commit types:
| Type | When |
|------|------|
| `feat` | New page, new endpoint, new feature |
| `fix` | Bug fix |
| `docs` | PLAN.md, handover docs, DEMO_SCRIPT.md, README |
| `chore` | config.toml, .gitignore, docker-compose.yml, tailwind config |

Examples:
```
feat: add PagePlatform + /api/platform/kpis endpoint — aramco
feat: add policy-intelligence page + Cortex Search seed — aramco
fix: resolve Tailwind content scan missing tsx files — aramco
docs: S3 frontend-core handover — aramco
chore: init project structure + .gitignore — aramco
```

### At session end — summary commit:
```bash
git add .
git commit -m "feat: S{N} {session_name} complete — {slug}"
```

---

## DESIGN-FIRST GATE (Session 0 and start of each generation session)

Before writing ANY code in a session, state the design intent:

```
DESIGN INTENT — Session {N}:
- What we're building: {scope from PLAN.md}
- Key pattern choices: {e.g. "Tab cache for Analytics, Wizard for Time Travel"}
- Architecture decisions this session: {e.g. "Using Cortex Search not CORTEX.COMPLETE for RAG"}
```

⚠️ STOPPING POINT: Get user acknowledgment of design intent before generating files. This prevents rework from misunderstood scope.

If a session introduces a hard-to-reverse choice (e.g. SPCS architecture, semantic model structure), document it as an ADR:

Write `{target_path}/docs/decisions/ADR-{NNN}-{title}.md`:
```markdown
# ADR-{NNN}: {Title}
## Status: Accepted
## Context: {Why this decision is needed}
## Decision: {What we chose}
## Alternatives: {What else was considered}
## Consequences: {What becomes easier/harder}
```

---

## SESSION END PROTOCOL (always last — before saying "done")

Follow these steps in order. Do not skip any.

### Step 0: SDLC Compliance Checklist

Before creating the handover, verify:

- [ ] All generated code has no hardcoded secrets or personal paths
- [ ] SQL uses fully qualified names (`{SLUG}_DEMO.{DOMAIN}_DATA.TABLE`)
- [ ] No `useEffect` auto-fetch in any React page
- [ ] Backend endpoints all return `execution_time_ms`
- [ ] If S2+: backend starts without errors (`/api/health` returns OK)
- [ ] If S3+: `npm run build` passes with zero errors
- [ ] Git: all changes committed with conventional format
- [ ] Memory file will be updated (Step 3 below)

If any check fails → fix it before proceeding. Do NOT skip to handover with known failures.

### Step 0b: Capture Session Build Cost

Query the credit usage since session start:

```sql
-- Credits consumed this session
SELECT
  SUM(CREDITS_USED) AS credits_this_session,
  SUM(CREDITS_USED_COMPUTE) AS compute_credits,
  SUM(CREDITS_USED_CLOUD_SERVICES) AS cloud_services_credits
FROM SNOWFLAKE.ACCOUNT_USAGE.WAREHOUSE_METERING_HISTORY
WHERE WAREHOUSE_NAME = '{SLUG}_DEMO_WH'
  AND START_TIME >= '{session_start_time}';

-- Cortex AI costs (if any Cortex functions were called this session)
SELECT
  FUNCTION_NAME,
  COUNT(*) AS calls,
  SUM(TOKENS_PRODUCED + TOKENS_CONSUMED) AS total_tokens
FROM SNOWFLAKE.ACCOUNT_USAGE.CORTEX_FUNCTIONS_USAGE_HISTORY
WHERE START_TIME >= '{session_start_time}'
GROUP BY FUNCTION_NAME;

-- Storage delta
SELECT
  SUM(AVERAGE_DATABASE_BYTES) / POWER(1024, 3) AS storage_tb
FROM SNOWFLAKE.ACCOUNT_USAGE.DATABASE_STORAGE_USAGE_HISTORY
WHERE DATABASE_NAME = '{SLUG}_DEMO'
  AND USAGE_DATE = CURRENT_DATE();
```

Record in the handover and memory:
```
Session {N} Build Cost:
  Warehouse credits: {compute_credits} compute + {cloud_services_credits} cloud services
  Cortex AI tokens:  {total_tokens} ({function_breakdown})
  Storage delta:     {storage_delta_gb} GB
  Session duration:  {duration_minutes} min
```

### Step 1: Create Handover Document

Write `{target_path}/docs/sessions/SESSION_{N}_HANDOVER.md`:

```markdown
# Session {N} Handover — {Session Name}
**Date**: {today}
**Project**: {customer_name} ({slug})

## What Was Completed
- [x] item 1
- [x] item 2
(list every file created or modified)

## Verified
- [x] item (e.g. "backend starts without errors", "npm run build passes")

## Deferred to Next Session
- [ ] item 1
- [ ] item 2

## Gotchas Found This Session
- Description: ...
  Fix: ...

## Git Commit
Hash: {commit_hash}
Message: feat: S{N} {session_name} complete — {slug}

## Build Cost This Session
| Metric | Value |
|--------|-------|
| Warehouse credits (compute) | {compute_credits} |
| Warehouse credits (cloud services) | {cloud_services_credits} |
| Cortex AI tokens | {total_tokens} |
| Storage delta | {storage_delta_gb} GB |
| Session duration | {duration_minutes} min |
| Cumulative build cost (S0-S{N}) | {running_total_credits} credits |
```

### Step 2: Git Summary Commit

```bash
cd {target_path}
git add .
git commit -m "feat: S{N} {session_name} complete — {slug}"
```

Capture the commit hash.

### Step 3: Update Memory File

```
memory str_replace /memories/{slug}-demo-project.md
```

Update the Session Log table:
- Mark S{N} as `complete` with commit hash and today's date
- Ensure S{N+1} row shows `pending`

Append any new gotchas found this session to the "Gotchas Found" section.

### Step 4: Compound Knowledge (if new gotchas or patterns discovered)

If you found any new technical patterns, gotchas, or insights not already documented:

1. **Update the project memory** (always): append to "Gotchas Found" section
2. **Update the skill's reference** (if the gotcha is generic/reusable across projects):
   - Read `references/gotchas-playbook.md`
   - Add new entry to the appropriate category
   - This compounds knowledge for future demo builds

```
memory str_replace /memories/{slug}-demo-project.md
  → append gotcha to "Gotchas Found" section
```

If the gotcha is generic (not customer-specific), also note it for the skill maintainer:
```
# In the handover doc, add:
## Knowledge to Compound
- Gotcha: {description}
  Category: {S1-S8 from gotchas-playbook.md}
  Suggested entry: {wrong} → {correct}
```

### Step 5: Write Next-Session Prompt to Disk

Write `{target_path}/docs/sessions/SESSION_{N}_NEXT_PROMPT.txt`:

```
========================================
NEXT SESSION PROMPT — Session {N+1}: {next_session_name}
Customer: {customer_name} ({slug})
========================================

I'm building a Snowflake Platform Demo for {customer_name} ({slug}).
Project path: {target_path}
Snowflake connection: {connection_name}

Current status: Session {N} ({session_name}) is COMPLETE.
Memory file: /memories/{slug}-demo-project.md

Please load the `platform-demo-generator` skill and start Session {N+1}: {next_session_name}.

Session {N+1} scope:
{copy the exact bullet list for Session N+1 from docs/PLAN.md}

Before starting, read:
  memory view /memories/{slug}-demo-project.md
  (skill loads references/gotchas-playbook.md automatically)
========================================
```

### Step 6: Output Next-Session Prompt in Chat

Output the exact same block in chat as a fenced code block so the user can copy it:

~~~
========================================
NEXT SESSION PROMPT — copy and paste this to start Session {N+1}
========================================

I'm building a Snowflake Platform Demo for {customer_name} ({slug}).
Project path: {target_path}
Snowflake connection: {connection_name}

Current status: Session {N} ({session_name}) is COMPLETE.
Memory file: /memories/{slug}-demo-project.md

Please load the `platform-demo-generator` skill and start Session {N+1}: {next_session_name}.

Session {N+1} scope:
{bullet list from PLAN.md}

Before starting, read:
  memory view /memories/{slug}-demo-project.md
========================================
~~~

---

## EDGE CASES

### Session 0 Edge Case (Planning only — no code written)

Session 0 has no handover doc and no "previous session to summarize". The S0 closing sequence is:

```
1. Write {target_path}/docs/PLAN.md   (produced by plan sub-skill)
2. Create /memories/{slug}-demo-project.md   (template above)
3. git init {target_path}
4. git add docs/PLAN.md
5. git commit -m "docs: S0 project plan — {slug}"
6. Write docs/sessions/SESSION_0_NEXT_PROMPT.txt  (scope = S1 Infrastructure)
7. Output the Session 1 next-session prompt in chat
```

No handover document is created for S0 (nothing was built).

### Session 5 Edge Case (Local-complete session — deployment is optional next)

If the user chose "Local only" or "Later" for deployment at end of S5, output a **DEMO READY** block instead of a next-session prompt:

~~~
========================================
DEMO READY — {customer_name} Platform Demo
========================================

Project: {target_path}
Connection: {connection_name}
Git commits: {N commits across sessions}

BUILD COST SUMMARY (S0-S5):
  Total warehouse credits:  {total_compute + total_cloud_services}
  Total Cortex AI tokens:   {total_tokens}
  Total storage:            {storage_gb} GB
  Total build time:         {total_duration} min across {N} sessions
  Estimated build cost:     ~${estimated_usd} USD

START LOCAL DEV:
  cd {target_path}/backend
  SNOWFLAKE_CONNECTION_NAME={connection_name} \
    uv run uvicorn app.main:app --host 0.0.0.0 --port 8200
  cd {target_path}/frontend && npm run dev   # → http://localhost:5300

KEY DOCUMENTS:
  Demo script:    {target_path}/docs/DEMO_SCRIPT.md
  Architecture:   {target_path}/docs/ARCHITECTURE.md
  Session log:    {target_path}/docs/sessions/

TOP SCENARIOS TO LEAD WITH:
{list top 3 scenarios from DEMO_SCRIPT.md with one-line hook each}

DEPLOYMENT (optional — run Session 6 anytime later):
  App Runtime (recommended): "Deploy the {slug} demo to App Runtime"
  SPCS (legacy):             "Deploy the {slug} demo to SPCS"
========================================
~~~

If the user chose "App Runtime" or "SPCS", generate a next-session prompt for S6 as normal.

---

## HARD STOP BOUNDARIES

The skill will not advance to the next session unless the user explicitly says one of:
- "continue", "start session N", "next session", "proceed", "approved"
- Or pastes the next-session prompt from the prior session

Never silently start the next session after completing a session.
