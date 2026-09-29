# Skill Card: Platform Demo Generator

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   ❄️  PLATFORM DEMO GENERATOR                                            │
│                                                                          │
│   Generate a full Snowflake Platform Demo for any customer               │
│   in 5 structured sessions.                                              │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   Author:     Mohamed Charni           License:   Apache 2.0             │
│   Version:    2.0                      Status:    Published              │
│   Language:   English                  Type:      Community              │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   PROVEN ON:  NCIM (Gov) • IMSU (Edu) • MISK (Non-profit)               │
│                                                                          │
│   VERTICALS:  Government • Finance • Healthcare • Energy                 │
│               Telecom • Retail • Education • Logistics                   │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   TRIGGERS                                                               │
│   ─────────                                                              │
│   "platform demo" • "build demo for" • "generate demo" •                │
│   "demo for [customer]" • "scope document" • "presales demo" •           │
│   "partner demo" • "demo generator"                                      │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   INPUTS REQUIRED                                                        │
│   ───────────────                                                        │
│                                                                          │
│   ┌─────────────────┬───────────────────────────────────────────┐        │
│   │ Customer Name   │ "Saudi Aramco"                            │        │
│   │ Country         │ "Saudi Arabia"                            │        │
│   │ Website URL     │ "https://aramco.com"                      │        │
│   │ SF Connection   │ "aramco-deploy" (ACCOUNTADMIN)            │        │
│   │ Target Path     │ "~/Projects/ARAMCO"                       │        │
│   └─────────────────┴───────────────────────────────────────────┘        │
│   Optional: slug, language, brand color, RFP doc                         │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   OUTPUTS DELIVERED                                                      │
│   ────────────────                                                       │
│                                                                          │
│   ┌──────────────────────────────────────────────────────────┐           │
│   │  60+ files • Full-stack app • SPCS-deployable            │           │
│   ├──────────────────────────────────────────────────────────┤           │
│   │  FastAPI Backend    │ 50+ endpoints, Cortex Search seed  │           │
│   │  React Frontend     │ Dynamic pages, dark mode, multilingual │           │
│   │  Deploy Scripts     │ 7 SQL scripts + orchestrator       │           │
│   │  Synthetic Data     │ Scaled CSVs per vertical           │           │
│   │  Semantic Model     │ Cortex Analyst YAML                │           │
│   │  SPCS Deployment    │ Multi-container spec + scripts     │           │
│   │  Demo Script        │ Talking points per scenario        │           │
│   │  Scope Document     │ Excel workbook (6 tabs)            │           │
│   │  Documentation      │ README + ARCHITECTURE + Handovers  │           │
│   └──────────────────────────────────────────────────────────┘           │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   5-SESSION WORKFLOW                                                     │
│   ─────────────────                                                      │
│                                                                          │
│   S0 Planning ──→ S1 Infra ──→ S2 Backend ──→ S3 Frontend ──→           │
│                                                   Core                   │
│   ──→ S4 Frontend ──→ S5 Deploy                                          │
│       Advanced       + Demo Pack                                         │
│                                                                          │
│   Each session:                                                          │
│     ✓ Memory check at start                                              │
│     ✓ Git commit per feature                                             │
│     ✓ Handover doc at end                                                │
│     ✓ Next-session prompt generated                                      │
│     ✗ NEVER auto-advances                                                │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   PAGES GENERATED (from catalog + custom)                                  │
│   ──────────────────────────────────────                                 │
│                                                                          │
│   CORE (S3):                                                             │
│   ┌────────────────┬────────────────┬─────────────────┬────────────┐     │
│   │ Platform       │ Performance    │ Analytics       │ Time Travel│     │
│   │ Overview       │ at Scale       │ Dashboards      │            │     │
│   ├────────────────┼────────────────┼─────────────────┼────────────┤     │
│   │ Disaster       │ Data           │ Data            │ Ask        │     │
│   │ Recovery       │ Lineage        │ Quality         │ {Customer} │     │
│   └────────────────┴────────────────┴─────────────────┴────────────┘     │
│                                                                          │
│   ADVANCED (S4):                                                         │
│   ┌────────────────┬────────────────┬─────────────────┬────────────┐     │
│   │ Architecture   │ ML & AI        │ Cortex AI       │ Query      │     │
│   │ Overview       │ (Predict)      │ (NLP)           │ Optimizer  │     │
│   ├────────────────┼────────────────┼─────────────────┼────────────┤     │
│   │ Cost &         │ Dynamic        │ Policy          │ Data       │     │
│   │ Pricing        │ Tables         │ Intelligence    │ Masking    │     │
│   ├────────────────┼────────────────┼─────────────────┼────────────┤     │
│   │ Data           │                │                 │            │     │
│   │ Classification │  + CUSTOM...   │                 │            │     │
│   └────────────────┴────────────────┴─────────────────┴────────────┘     │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   SNOWFLAKE FEATURES DEMONSTRATED                                        │
│   ───────────────────────────────                                        │
│                                                                          │
│   Elastic Compute • Time Travel • CLONE/UNDROP • Dynamic Tables          │
│   Cortex AI (Sentiment/Summarize/Translate/Classify) • Cortex Search     │
│   Cortex Analyst • FORECAST • ANOMALY_DETECTION • CLASSIFICATION         │
│   Data Metric Functions • Dynamic Data Masking • SYSTEM$CLASSIFY         │
│   OBJECT_DEPENDENCIES • Result Cache • H3 Geospatial • SPCS             │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   TOOLS USED                                                             │
│   ──────────                                                             │
│   snowflake_sql_execute • Bash • Read • Write • Edit                     │
│   Glob • Grep • web_fetch • memory                                       │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   INSTALL                                                                │
│   ───────                                                                │
│   /skill add ~/.snowflake/cortex/skills/demo/platform-demo-generator     │
│                                                                          │
│   INVOKE                                                                 │
│   ──────                                                                 │
│   $platform-demo-generator Build a demo for ACME Corp                    │
│                                                                          │
│   SCOPE DOC ONLY                                                         │
│   ──────────────                                                         │
│   $platform-demo-generator Generate scope document for ACME              │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   FILES: 28 │ LINES: ~5,000 │ SUB-SKILLS: 9 │ REFERENCES: 5             │
│   SCRIPTS: 3 │ TEMPLATES: 8 │ VERTICALS: 8 │ GOTCHAS: 40+              │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## At a Glance

| Dimension | Value |
|-----------|-------|
| **Name** | `platform-demo-generator` |
| **Title** | Snowflake Platform Demo Builder |
| **Summary** | Generate a full 17-page Snowflake Platform Demo for any customer in 5 structured sessions |
| **Author** | Mohamed Charni |
| **Version** | 2.0 |
| **Status** | Published |
| **License** | Apache 2.0 |
| **Type** | Community |
| **Language** | English (generates en or en+{secondary} apps) |

## Compatibility

| Platform | Supported |
|----------|-----------|
| macOS (Apple Silicon) | Yes (requires `--platform linux/amd64` for Docker) |
| macOS (Intel) | Yes |
| Linux | Yes |
| Windows (WSL2) | Yes |
| Snowflake Edition | Standard, Enterprise, Business Critical |
| SPCS | Yes (CPU_X64_S default) |

## Dependencies (developer laptop)

| Tool | Version | Required for |
|------|---------|-------------|
| Cortex Code | Latest | Running the skill |
| Snow CLI | 3.0+ | SQL execution, deployment |
| Python | 3.12+ | Backend |
| Node.js | 18+ | Frontend |
| Docker Desktop | Latest | SPCS builds |
| openpyxl | Any | Scope document (optional) |

## Related Skills

| Skill | Relationship |
|-------|-------------|
| `sap-bdc-demo-generator` | Sibling — SAP BDC connector demos |
| `enablement-package` | Complementary — hands-on labs for the same customers |
| `solution-blueprint` | Upstream — architecture decisions before demo building |
| `developing-with-streamlit` | Alternative — single-page Streamlit apps |
| `cortex-agent` | Downstream — agents built on top of demo data |
