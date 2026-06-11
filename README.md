# Platform Demo Generator

**Generate a production-quality Snowflake Platform Demo for any customer in 5 structured sessions.**

Built on architecture proven across 3 real presales engagements (NCIM, IMSU, MISK). Produces a full-stack application: FastAPI backend, React/Vite frontend, 17+ interactive pages, SPCS-deployable — customized to any industry vertical.

---

## Quick Start

### 1. Install the Skill

```bash
# Option A: From a Git repo (if published)
# In a Cortex Code session:
Install the skill at https://github.com/<your-org>/platform-demo-generator

# Option B: From local path
# In a Cortex Code session:
Install the skill at ~/.snowflake/cortex/skills/demo/platform-demo-generator

# Option C: Already in your skills directory
# If the folder is at ~/.snowflake/cortex/skills/demo/platform-demo-generator/
# it's auto-discovered — no install needed.
```

### 2. Verify Installation

```
/skill list
```

You should see `platform-demo-generator` in the list.

### 3. Invoke the Skill

```
$platform-demo-generator Build a Snowflake platform demo for Saudi Aramco
```

Or just say naturally:
```
Build a platform demo for ACME Corp
```

CoCo will auto-activate the skill based on trigger keywords.

---

## Usage Modes

| Mode | How to invoke | What you get |
|------|--------------|--------------|
| **Full Build** | "Build a demo for {Customer}" | Complete 5-session workflow → deployable app |
| **Scope Document** | "Generate a scope document for {Customer}" | Excel workbook for stakeholder review |
| **Resume Session** | "Continue session 3 for aramco" or paste next-session prompt | Pick up where you left off |
| **Demo Script Only** | "Generate demo script for aramco" | DEMO_SCRIPT.md with talking points |
| **Validate** | "Validate the aramco demo" | Smoke test report |

---

## How It Works

### The 5-Session Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│  SESSION 0: Planning                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Intake  │→ │ Research │→ │   Plan   │→ │ Approve  │       │
│  │ (9 fields)│  │(web+RFP) │  │(PLAN.md) │  │(STOP)    │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
├─────────────────────────────────────────────────────────────────┤
│  SESSION 1: Infrastructure                                       │
│  config.toml + deploy/scripts/*.sql + deploy.py + load_data.py  │
├─────────────────────────────────────────────────────────────────┤
│  SESSION 2: Backend                                              │
│  session.py + main.py (50+ endpoints) + Cortex Search seed      │
├─────────────────────────────────────────────────────────────────┤
│  SESSION 3: Frontend Core (8 pages)                              │
│  shared components + Platform + Performance + Analytics +        │
│  Time Travel + Recovery + Lineage + Quality + Ask {Customer}     │
├─────────────────────────────────────────────────────────────────┤
│  SESSION 4: Frontend Advanced (9+ pages)                         │
│  Architecture + ML/AI + Cortex AI + Optimization + Pricing +     │
│  Dynamic Tables + Masking + Classification + Policy Intelligence │
├─────────────────────────────────────────────────────────────────┤
│  SESSION 5: Deploy + Demo Pack                                   │
│  SPCS spec + Docker + README + ARCHITECTURE.md + DEMO_SCRIPT.md  │
└─────────────────────────────────────────────────────────────────┘
```

### Between Sessions

Each session ends with a **next-session prompt** — copy-paste it to start the next session in a new CoCo context. Session state persists via memory files.

---

## Prerequisites

| Requirement | Why | Install | Auto-checked? |
|---|---|---|---|
| Cortex Code (CoCo) | Skill runtime | `brew install snowflake-cli` | Yes (can't run skill without it) |
| Snow CLI + connection | SQL execution, deployment | [docs.snowflake.com](https://docs.snowflake.com/en/developer-guide/snowflake-cli/installation) | Yes (intake verifies connection) |
| ACCOUNTADMIN on Snowflake | RBAC setup, SPCS | Account admin grants | No — user must confirm |
| Node.js 18+ | Frontend build | `brew install node` | Yes (validate sub-skill checks) |
| Python 3.12+ | Backend | `brew install python@3.12` | Yes (validate sub-skill checks) |
| Docker Desktop | SPCS image builds (optional) | [docker.com](https://docker.com) | Only checked in S6 |
| openpyxl _(optional)_ | Scope document Excel | `pip install openpyxl` | Yes (auto-installed during scope-doc) |
| uv _(optional)_ | Python env management | `pip install uv` | Yes (auto-installed during validation) |

**All sub-skills are self-contained** — they reference only files bundled within the skill directory. No external skill dependencies, no personal memory files, no remote URLs that must be available at runtime.

---

## Inputs (What You Provide)

The skill collects 9 fields during the intake interview:

| # | Field | Required | Example |
|---|-------|----------|---------|
| 1 | Customer name | Yes | "Saudi Aramco" |
| 2 | Slug | Yes (or auto-derived) | "aramco" |
| 3 | Country | Yes | "Saudi Arabia" |
| 4 | Language | Yes (defaults by country) | "en+ar" |
| 5 | Website URL | Yes | "https://aramco.com" |
| 6 | RFP/context document | No | URL or local path |
| 7 | Snowflake connection | Yes | "aramco-deploy" |
| 8 | Target project path | Yes | "~/Projects/ARAMCO" |
| 9 | Brand color | No (detected from website) | "#009B77" |

---

## Outputs (What You Get)

### Generated Project (~60+ files)

```
~/Projects/{SLUG}/
├── config.toml                     # Project settings
├── docker-compose.yml              # Local dev environment
├── deploy/
│   ├── deploy.py                   # SQL orchestrator
│   ├── load_data.py                # Snowpark data loader
│   └── scripts/01-07.sql, 99.sql  # RBAC, DDL, ML, DT, grants, teardown
├── backend/
│   ├── app/main.py                 # FastAPI — 50+ endpoints
│   ├── app/session.py              # Snowpark session (local + SPCS)
│   └── app/semantic_model/*.yaml   # Cortex Analyst model
├── frontend/
│   └── src/components/pages/       # 17+ React page components
├── data/output/                    # Synthetic seed CSVs
├── spcs/                           # SPCS deployment spec + scripts
└── docs/
    ├── PLAN.md                     # Project plan
    ├── ARCHITECTURE.md             # System architecture
    ├── DEMO_SCRIPT.md              # Presenter talking points
    ├── sessions/                   # Handover docs per session
    └── {slug}_scope_v1.xlsx        # Scope document (if generated)
```

### Snowflake Objects Created

| Object | Type | Purpose |
|--------|------|---------|
| `{SLUG}_DEMO` | Database | All demo data |
| `{SLUG}_DEMO.{DOMAIN}_DATA` | Schema | Domain tables |
| `{SLUG}_DEMO_WH` | Warehouse | Compute |
| `{SLUG}_DEPLOY_ROLE` | Role | DDL + DML (deployment) |
| `{SLUG}_APP_ROLE` | Role | DML only (runtime) |
| `{SLUG}_READER_ROLE` | Role | SELECT only |
| `POLICY_SEARCH` | Cortex Search Service | RAG on regulatory docs |
| `{SLUG}_BACKEND` | SPCS Service | Deployed app |

---

## Supported Industry Verticals

The skill auto-adapts entities, regulatory docs, scenario priorities, and demo talking points per vertical:

| Vertical | Primary Entity | Regulatory | Lead Scenario |
|----------|---------------|-----------|---------------|
| Government | Citizens, Service Requests | PDPL | Policy Intelligence → Classification |
| Finance | Customers, Transactions | PDPL/GDPR | Data Masking → ML/AI |
| Healthcare | Patients, Appointments | HIPAA | Data Masking → ML/AI → Quality |
| Energy | Employees, Production Records | HSE/ISO | Performance → Analytics → ML |
| Telecom | Subscribers, Call Records | PDPL/GDPR | ML/AI → Cortex AI |
| Retail | Customers, Orders | GDPR/CCPA | Analytics → ML/AI |
| Education | Students, Enrollments | Generic | Analytics → ML/AI |
| Logistics | Customers, Shipments | Generic | Performance → Dynamic Tables |

---

## Skill Architecture

```
platform-demo-generator/
│
├── SKILL.md                  # Main entry — routing, overview, common mistakes
├── README.md                 # This file — how to install and use
├── SKILL_CARD.md             # Visual one-pager summary
├── LICENSE                   # Apache 2.0
│
├── sub-skills/               # Workflow steps (loaded on demand)
│   ├── sdlc/                 # Session protocol (git, memory, handovers)
│   ├── scope-doc/            # Excel scope/customization form
│   ├── intake/               # 9-field customer interview
│   ├── research/             # Web fetch + RFP analysis
│   ├── plan/                 # Multi-session plan generation
│   ├── data-gen/             # Synthetic CSV generation
│   ├── generate/             # Per-session code scaffolding
│   ├── demo-script/          # DEMO_SCRIPT.md talking points
│   └── validate/             # Post-generation smoke testing
│
├── references/               # Knowledge base (loaded on demand)
│   ├── misk-architecture.md  # Structural template (23 pages, patterns)
│   ├── demo-pages-catalog.md # Full page catalog with endpoints
│   ├── data-domain-templates.md # 8 verticals with DDL + regulatory docs
│   ├── scenario-matrix.md    # Industry priority matrix
│   └── gotchas-playbook.md   # 40+ battle-tested gotchas
│
├── assets/templates/         # Code skeletons (reduce LLM hallucination)
│   ├── config.toml           # Project config
│   ├── session.py            # Snowpark session factory
│   ├── main.py               # FastAPI skeleton
│   ├── App.tsx               # React app shell
│   ├── PageTemplate.tsx      # Single-load page pattern
│   ├── TabCachePage.tsx      # Multi-tab with cache
│   ├── WizardStepPage.tsx    # Step-by-step reveal
│   └── NCIMCardPage.tsx      # Independent-card pattern
│
└── scripts/                  # Standalone automation (Python stdlib)
    ├── validate.py           # Anti-pattern checker
    ├── generate_seed_data.py # Synthetic data generator
    └── generate_scope_doc.py # Excel scope document (needs openpyxl)
```

---

## Examples

### Example 1: Full demo build

```
> Build a Snowflake platform demo for National Water Company

CoCo activates the skill, runs intake:
  Customer: National Water Company
  Slug: nwc
  Country: Saudi Arabia → PDPL, en+ar
  Industry: energy (utilities)
  ...

Produces PLAN.md, asks for approval, then generates across 5 sessions.
```

### Example 2: Scope document only

```
> Generate a scope document for Deloitte

CoCo generates: deloitte_scope_v1.xlsx
  - Tab 1: Customer Context (pre-filled)
  - Tab 2: 17 template pages + custom rows
  - Tab 3: Data domain mapping (finance defaults)
  - Tab 4: Scenario flow
  - Tab 5: Timeline
  - Tab 6: Sign-off
```

### Example 3: Resume mid-project

```
> (paste the next-session prompt from SESSION_2_NEXT_PROMPT.txt)

CoCo reads memory, confirms "Session 3: Frontend Core",
and starts generating 8 pages + shared components.
```

---

## SDLC Enforcement

The skill enforces professional practices automatically:

| Rule | Enforcement |
|------|-------------|
| Memory persistence | `/memories/{slug}-demo-project.md` read at start, updated at end |
| Git commits | After every feature + summary commit at session end |
| Session handovers | `docs/sessions/SESSION_N_HANDOVER.md` written at close |
| Next-session prompt | Generated and output in chat for copy-paste |
| Hard stops | Never auto-advances between sessions |
| Scope freeze | Scope doc sign-off required before generation |
| Validation | `validate` sub-skill available after any session S2+ |

---

## Extending the Skill

### Adding a new industry vertical

1. Add entity mapping to `references/data-domain-templates.md`
2. Add priority matrix row to `references/scenario-matrix.md`
3. Add predefined questions to `references/scenario-matrix.md`
4. Add talking points to `sub-skills/demo-script/SKILL.md`

### Adding a new page type

1. Add row to `references/demo-pages-catalog.md`
2. If it's a new UX pattern, add a template to `assets/templates/`
3. Update session assignment (S3 core vs S4 advanced) in `sub-skills/plan/SKILL.md`

### Adding a new regulatory context

1. Add regulatory docs to `references/data-domain-templates.md` → `{context}_policy_docs`
2. Add country mapping to `sub-skills/research/SKILL.md` → Step 5

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Skill doesn't trigger | Check `/skill list`. If missing, run install command above. |
| "Connection not found" | Run `snow connection list` — ensure connection has ACCOUNTADMIN. |
| Backend won't start | Check `pyproject.toml` has `packages = ["app"]` under hatchling. |
| Frontend classes missing | Ensure `tailwind.config.js` exists with content scan for `.tsx`. |
| SPCS stuck in PENDING | Check `readinessProbe.port` matches actual backend port (8200). |
| Empty data on Optimization/Pricing | Expected — ACCOUNT_USAGE has 45-min latency. Wait or use mock. |
| Session state lost | Check `/memories/{slug}-demo-project.md` — it persists between sessions. |

---

## License

Apache 2.0 — see [LICENSE](./LICENSE).

The skill itself is open-source. Generated demo code belongs to you (the user).
