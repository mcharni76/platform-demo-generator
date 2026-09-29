# Platform Demo Generator

**A CoCo skill that generates a production-quality Snowflake Platform Demo for any customer in 5 interactive sessions.**

Built on architecture proven across 3 real presales engagements (NCIM, IMSU, MISK). Produces a full-stack application: FastAPI backend, React/Vite frontend, interactive pages customized per customer industry and requirements. Deployable via Snowflake App Runtime (recommended) or SPCS.

> **For partners across MEA and globally.** Supports 8 industry verticals, 6 secondary languages (Arabic, French, Turkish, Farsi, Urdu, Portuguese), 19 regulatory frameworks, and dynamic page selection from a catalog of Snowflake capabilities.

---

## Installation

### Prerequisites

| Requirement | Install |
|---|---|
| Cortex Code (CoCo) CLI or Desktop | `brew install snowflake-cli` then run `cortex` |
| Snow CLI with an active connection | [Install guide](https://docs.snowflake.com/en/developer-guide/snowflake-cli/installation) |
| ACCOUNTADMIN on a Snowflake account | Account admin grants required |
| Node.js 22+ | `brew install node` |
| Python 3.12+ | `brew install python@3.12` |
| Docker Desktop _(only for SPCS deploy)_ | [docker.com](https://docker.com) |

### Install the Skill

```bash
# Clone into your CoCo skills directory (one-time):
git clone https://github.com/mcharni76/platform-demo-generator.git \
  ~/.snowflake/cortex/skills/demo/platform-demo-generator
```

The skill is auto-discovered by CoCo when placed under `~/.snowflake/cortex/skills/`.

### Verify

In a CoCo session, run:

```
/skill list
```

You should see `platform-demo-generator` in the output.

---

## Quick Start

Type this in a CoCo session to begin:

```
Build a platform demo for <Customer Name>
```

Or use the skill prefix:

```
$platform-demo-generator Build a Snowflake platform demo for Saudi Aramco
```

CoCo activates the skill and walks you through an interactive planning session. No code is generated until you approve the plan.

---

## What the Skill Does

It generates a **complete, runnable Snowflake demo application** customized to a specific customer:

- **FastAPI backend** with 50+ endpoints covering all selected Snowflake features
- **React/Vite frontend** with interactive pages (KPI dashboards, ML cards, chatbot, governance panels)
- **Synthetic seed data** matched to the customer's industry with realistic distributions
- **Deploy scripts** (RBAC, DDL, ML models, Dynamic Tables, grants)
- **Cortex Search** RAG over regulatory documents (PDPL, GDPR, HIPAA, KVKK, POPIA, etc.)
- **Cortex Analyst** chatbot with a semantic model and predefined questions
- **Demo script** with talking points, scenario flow, and objection handlers

---

## Interactive Session Flow

The skill is fully interactive. Every decision point uses forms, multi-selects, and confirmations. You are always in control.

### Session 0: Planning

```
You type: "Build a platform demo for Accenture Middle East"
```

**Step 1 -- Intake** (3 interactive forms):

```
┌─ Form 1: Core Identity ──────────────────────┐
│  Customer name:  [Accenture Middle East     ] │
│  Country:        [Saudi Arabia              ] │
│  Website:        [https://accenture.com     ] │
└───────────────────────────────────────────────┘

┌─ Form 2: Configuration ──────────────────────────┐
│  Slug:        [accenture        ] (auto-derived) │
│  Language:    (o) en+ar  ( ) en  ( ) en+fr ...   │
│  Connection:  [accenture-deploy ]                │
│  Path:        [~/Projects/ACCENTURE]             │
└──────────────────────────────────────────────────┘

┌─ Form 3: Optional ──────────────────────────────────┐
│  Brand color:   [#A100FF          ]                 │
│  Context doc:   [/path/to/rfp.pdf ]                 │
│  Deployment:    (o) Local + App Runtime              │
│                 ( ) Local + SPCS                     │
│                 ( ) Local only                       │
└─────────────────────────────────────────────────────┘
```

**Step 2 -- Research** (automatic + confirmation):

CoCo fetches the customer website, reads any RFP/context document, and presents findings:

```
Research Complete: Accenture Middle East

Industry: Finance (consulting)
Regulatory: PDPL (Saudi Arabia)
Pain points:
  1. Data silos across client engagements
  2. Manual compliance reporting
  3. No self-service analytics for consultants

Does this look right?
  [Correct, continue] [Wrong industry] [Add pain points] [Adjust entities]
```

**Step 3 -- Feature Themes** (you choose what to emphasize):

```
Which Snowflake feature themes to emphasize? (select 2-4)
  [x] AI & Machine Learning
  [x] Data Governance
  [ ] Real-time & Streaming
  [x] Performance & Scale
  [ ] Open Formats & Interop
  [ ] Data Quality & Ops
```

**Step 4 -- Page Selection** (multi-select across 4 grouped questions):

```
Foundation & Analytics:          Governance & Compliance:
  [x] Platform Overview            [x] Data Masking
  [x] Performance at Scale         [x] Data Classification
  [x] Analytics Dashboards         [x] Policy Intelligence
  [x] ML & Predictive AI           [x] Data Lineage
  [ ] Time Travel                  [x] Data Quality
  [x] Cortex AI (NLP)

Innovation & Operations:         Additional:
  [x] Ask {Customer}               [ ] Time Travel
  [x] Cortex Agent                 [ ] Disaster Recovery
  [x] Dynamic Tables               [ ] Document AI
  [ ] Streaming (Snowpipe)         [ ] Notebooks
  [ ] Tasks + Streams              [ ] Query Optimization
  [ ] Iceberg Tables               [ ] Cost & Pricing
```

**Step 5 -- Gap Analysis**:

```
I noticed some capabilities that would strengthen your story:
  [ ] Data Classification -- "You selected Masking but not HOW you discover what to mask"
  [ ] Notebooks -- "Shows the data science WORKFLOW, not just ML results"
```

**Step 6 -- Plan Approval** (hard stop):

```
Plan created: 12 pages across 5 sessions.
Review PLAN.md and approve to proceed.
  [Approve plan] [Adjust scope]
```

### Sessions 1-5: Building

Each session is one CoCo conversation. Paste the next-session prompt to continue.

| Session | What CoCo generates | Interactive checkpoints |
|---------|-------------------|----------------------|
| **S1 Infrastructure** | config.toml, 7 SQL deploy scripts, deploy.py | Review config + DDL before commit. Data generation wizard (entities, regions, categories, scale). Preview sample rows. |
| **S2 Backend** | FastAPI main.py, session.py, Cortex Search seed | Backend health check. Endpoint smoke test results. |
| **S3 Frontend Core** | Selected core pages + shared components | Live browser preview at localhost:5300. Per-page verification. |
| **S4 Frontend Advanced** | Selected advanced pages + semantic model | Full page inventory table. Optional validation run. |
| **S5 Polish** | README, ARCHITECTURE.md, DEMO_SCRIPT.md | Demo script review (reorder pages, edit hooks, adjust timing). Deployment choice. |

### Session 6: Deploy (optional)

| Option | What happens |
|--------|-------------|
| **App Runtime** (recommended) | Next.js wrapper for React frontend via `snow app deploy`. FastAPI backend on SPCS. No Docker for frontend. |
| **SPCS** (legacy) | Both containers via Docker. Requires Docker Desktop. |
| **Local only** | Demo from localhost. No cloud deploy. |

---

## Supported Languages

| Code | Language | Direction | Countries |
|------|----------|-----------|-----------|
| `en+ar` | Arabic | RTL | Saudi Arabia, UAE, Qatar, Bahrain, Jordan, Egypt, Lebanon, Iraq |
| `en+fr` | French | LTR | Morocco, Tunisia, Algeria, Senegal, Ivory Coast, Cameroon |
| `en+tr` | Turkish | LTR | Turkey |
| `en+fa` | Farsi | RTL | Iran |
| `en+ur` | Urdu | RTL | Pakistan |
| `en+pt` | Portuguese | LTR | Mozambique, Angola |
| `en` | English only | LTR | All other countries |

Language auto-detected from country. You can override during intake.

---

## Supported Regulatory Frameworks

| Country | Regulation | Law |
|---------|-----------|-----|
| Saudi Arabia | PDPL | Personal Data Protection Law (2023) |
| UAE | PDPL-UAE | Federal Decree-Law No. 45/2021 |
| Qatar | PDPL-QA | Law No. 13 of 2016 |
| Bahrain | PDPL-BH | Law No. 30/2018 |
| Egypt | EDPL | Law No. 151/2020 |
| Morocco | CNDP | Law 09-08 |
| Turkey | KVKK | Law No. 6698 (2016) |
| South Africa | POPIA | Protection of Personal Information Act |
| Nigeria | NDPR | Data Protection Regulation (2019) |
| Kenya | DPA | Data Protection Act (2019) |
| EU / UK | GDPR | General Data Protection Regulation |
| USA (Healthcare) | HIPAA | Health Insurance Portability and Accountability Act |
| USA (Finance) | SOX/CCPA | Sarbanes-Oxley / California Consumer Privacy Act |

The Policy Intelligence page automatically seeds the correct regulatory documents based on the customer's country.

---

## Supported Industry Verticals

| Vertical | Primary Entities | Lead Scenario |
|----------|-----------------|---------------|
| Government | Citizens, Service Requests | Policy Intelligence, Classification |
| Finance | Customers, Transactions | Data Masking, ML/AI |
| Healthcare | Patients, Appointments | Data Masking, ML/AI, Quality |
| Energy | Assets, Production Records | Performance, Analytics, ML |
| Telecom | Subscribers, Call Records | ML/AI, Cortex AI |
| Retail | Customers, Orders | Analytics, ML/AI |
| Education | Students, Enrollments | Analytics, ML/AI |
| Logistics | Shipments, Routes | Performance, Dynamic Tables |

---

## Usage Modes

| Mode | How to invoke | What you get |
|------|--------------|--------------|
| **Full Build** | "Build a demo for {Customer}" | Complete 5-session interactive workflow |
| **Scope Document** | "Generate a scope document for {Customer}" | Excel workbook for stakeholder sign-off |
| **Resume Session** | Paste next-session prompt | Pick up where you left off |
| **Demo Script Only** | "Generate demo script for {slug}" | DEMO_SCRIPT.md with talking points |
| **Validate** | "Validate the {slug} demo" | Interactive smoke test with fix guidance |

---

## Page Capability Catalog

Pages are selected per customer during the research phase. The full catalog:

| Page | Snowflake Feature | UX Pattern |
|------|-------------------|------------|
| Architecture | Full Platform Overview | Static, clickable layer nodes |
| Platform | Unified Data Platform | KPI cards |
| Performance | Elastic Compute | Cold/warm benchmark |
| Analytics | Window Functions, H3 Geo | 7-tab cache + MapLibre |
| ML/AI | Forecast, Anomaly, Classification | 3 independent cards |
| Time Travel | AT(OFFSET) / BEFORE | Step-by-step wizard |
| Recovery | CLONE / UNDROP | 2-tab wizard |
| Cortex AI | Sentiment, Summarize, Translate | 5 NLP cards |
| Lineage | OBJECT_DEPENDENCIES | 3-column node graph |
| Quality | Data Metric Functions | 3-tab dashboard |
| Optimization | Result Cache / Pruning | ACCOUNT_USAGE + mock fallback |
| Pricing | Credit Consumption | Cost model explainer |
| Dynamic Tables | Declarative Pipelines | DT refresh demo |
| Policy Intelligence | Cortex Search (RAG) | NL Q&A over regulations |
| Data Masking | Column-Level Security | Raw/Policy/Masked cards |
| Data Classification | SYSTEM$CLASSIFY | Scan/Policy/Report tabs |
| Ask {Customer} | Cortex Analyst | Full chatbot |
| Document AI | AI_PARSE_DOCUMENT | Upload/Parse/Query cards |
| Cortex Agent | Agentic AI | Multi-tool chat |
| Notebooks | Snowflake Notebooks | Pre-rendered outputs |
| Iceberg Tables | Apache Iceberg | Metadata + query |
| Streaming | Snowpipe Streaming | Insert/query latency wizard |
| Tasks + Streams | CDC Pipelines | Stream/Task/Demo tabs |

---

## Skill Architecture

```
platform-demo-generator/
├── SKILL.md                  # Main entry point
├── README.md                 # This file
├── SKILL_CARD.md             # Visual one-pager
├── LICENSE                   # Apache 2.0
├── sub-skills/               # 9 interactive workflow steps
│   ├── sdlc/                 # Session protocol (git, memory, handovers)
│   ├── intake/               # 9-field customer interview
│   ├── research/             # Web research + storytelling + feature selection
│   ├── plan/                 # Multi-session plan generation
│   ├── data-gen/             # Interactive synthetic data generation
│   ├── generate/             # Per-session code scaffolding with checkpoints
│   ├── scope-doc/            # Excel customization form
│   ├── demo-script/          # DEMO_SCRIPT.md with talking points
│   └── validate/             # Interactive smoke testing with fix loop
├── references/               # Knowledge base
│   ├── misk-architecture.md  # Structural template
│   ├── demo-pages-catalog.md # Page catalog with endpoints
│   ├── data-domain-templates.md  # 8 verticals + regulatory docs
│   ├── scenario-matrix.md    # Industry priority matrix
│   └── gotchas-playbook.md   # 40+ battle-tested gotchas
├── assets/templates/         # 8 code skeletons
└── scripts/                  # Standalone Python tools (stdlib only)
```

---

## Example Prompts for Partners

Start a demo build:
```
Build a platform demo for Saudi Aramco
```

Build from an RFP:
```
Build a demo for National Water Company. Here's the RFP: /path/to/rfp.pdf
```

Generate scope document first:
```
Generate a scope document for Deloitte
```

Resume a session:
```
(paste the next-session prompt from the previous session)
```

Generate demo talking points:
```
Generate demo script for the aramco demo
```

Validate before presenting:
```
Validate the aramco demo
```

Deploy to App Runtime:
```
Deploy the aramco demo to App Runtime
```

---

## Tips for Partners

1. **Don't show all pages in one demo.** The skill recommends 10-12 pages. A focused demo is more compelling than a feature dump.
2. **Lead with the customer's pain, not Snowflake's features.** The storytelling arc puts their problems first.
3. **The demo script matters more than the code.** `DEMO_SCRIPT.md` contains the one-liners that land with stakeholders.
4. **You can always re-run a session.** Start a new CoCo session and paste the same next-session prompt.
5. **Validate before presenting.** Run `Validate the <slug> demo` to catch issues before the customer sees them.
6. **Choose your feature themes early.** The theme selection drives which pages are recommended and how the story is framed.
7. **Customize the data.** The data generation wizard lets you set domain-specific entity names, regions, and categories. Realistic data makes the demo convincing.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Skill doesn't trigger | Check `/skill list`. If missing, re-clone the repo to the skills directory. |
| "Connection not found" | Run `snow connection list`. Ensure connection has ACCOUNTADMIN. |
| Backend won't start | Check `pyproject.toml` has `packages = ["app"]` under hatchling. |
| Frontend classes missing | Ensure `tailwind.config.js` exists with content scan for `.tsx`. |
| SPCS stuck in PENDING | Check `readinessProbe.port` matches actual backend port (8200). |
| Empty data on Optimization/Pricing | Expected -- ACCOUNT_USAGE has 45-min latency. Wait or use mock. |
| Session state lost | Check `/memories/{slug}-demo-project.md`. |
| RTL layout issues | Verify `dir="rtl"` is set on the page wrapper for ar/fa/ur languages. |

---

## Extending the Skill

### Adding a new industry vertical

1. Add entity mapping to `references/data-domain-templates.md`
2. Add priority matrix to `references/scenario-matrix.md`
3. Add predefined questions to `references/scenario-matrix.md`
4. Add talking points to `sub-skills/demo-script/SKILL.md`

### Adding a new page type

1. Add row to `references/demo-pages-catalog.md`
2. If new UX pattern, add template to `assets/templates/`
3. Update session assignment in `sub-skills/plan/SKILL.md`

### Adding a new regulatory context

1. Add regulatory docs to `references/data-domain-templates.md`
2. Add country mapping to `sub-skills/intake/SKILL.md`

---

## License

Apache 2.0 -- see [LICENSE](./LICENSE).

The skill itself is open-source. Generated demo code belongs to you.
