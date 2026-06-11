---
name: platform-demo-scope-doc
description: "Generates an Excel scope/customization form for platform demo projects. Contains the full page catalog as a baseline template but allows extending with custom requirements. Produces a shareable .xlsx for PM/stakeholder review and sign-off before generation begins."
---

# Scope Document — Customization Intake Form (Excel)

Generates a structured Excel workbook that captures ALL demo requirements before code generation starts. The 17 template pages are a baseline — customers can ADD custom pages, REMOVE irrelevant ones, and MODIFY priorities.

This is the **first deliverable** — produced during or before Session 0. It replaces ad-hoc emails/Slack messages with a formal, version-controlled scope document that stakeholders can review and approve.

---

## When to Run

- **Before Session 0** — as a pre-engagement scoping exercise
- **During Session 0** — after intake/research, before plan approval
- **After an RFP review** — to translate RFP requirements into a demo scope
- **When scope changes** — to re-generate an updated version mid-project

---

## Step 1: Collect Inputs

Use the intake sub-skill answers OR ask directly:

```
To generate the scope document, I need:
1. Customer name
2. Industry vertical (or let me detect from website)
3. Country (for regulatory context)
4. Any specific requirements or RFP pages to address
5. Stakeholder name(s) for the sign-off section
```

If intake was already completed, pull from `/memories/{slug}-demo-project.md`.

---

## Step 2: Generate Excel Workbook

Use `mcp_google-worksp_create_spreadsheet` (if Google Workspace available) OR write locally with openpyxl.

### Workbook Structure: 6 Tabs

---

### Tab 1: "Customer Context"

| Row | Field | Value |
|-----|-------|-------|
| 1 | Customer Name | {customer_name} |
| 2 | Slug | {slug} |
| 3 | Industry | {industry} |
| 4 | Country | {country} |
| 5 | Language | {en / en+ar} |
| 6 | Regulatory Context | {PDPL / GDPR / HIPAA / Generic} |
| 7 | Brand Color | {#RRGGBB} |
| 8 | Website | {url} |
| 9 | Snowflake Account | {account_name} |
| 10 | Connection Name | {connection_name} |
| 11 | Target Path | {target_path} |
| 12 | Date Created | {today} |
| 13 | Created By | {author} |
| 14 | Stakeholders | {comma-separated names} |

---

### Tab 2: "Page Requirements"

This is the **core tab** — includes the 17 template pages as baseline + empty rows for custom additions.

| # | Page Name | Category | Include? | Priority | Snowflake Feature | Custom Requirements | Notes |
|---|-----------|----------|----------|----------|-------------------|--------------------:|-------|
| 1 | Architecture Overview | Core | ✅ | MUST | Medallion Architecture | | Static — always first |
| 2 | Platform Overview | Core | ✅ | MUST | Unified Data Platform | | |
| 3 | Performance at Scale | Core | ✅ | MUST | Elastic Compute | | |
| 4 | Analytics Dashboards | Core | ✅ | MUST | Window Functions, H3 | | 7 tabs, MapLibre map |
| 5 | Time Travel | Core | ✅ | HIGH | AT/BEFORE/UNDROP | | Step-by-step wizard |
| 6 | Disaster Recovery | Core | ✅ | HIGH | CLONE/UNDROP | | Two-tab wizard |
| 7 | Data Lineage | Core | ✅ | HIGH | OBJECT_DEPENDENCIES | | Node graph |
| 8 | Data Quality | Core | ✅ | HIGH | Data Metric Functions | | 3-tab layout |
| 9 | ML & Predictive AI | Advanced | ✅ | {industry-driven} | FORECAST/ANOMALY/CLASSIFY | | 3 NCIM cards |
| 10 | Cortex AI (NLP) | Advanced | ✅ | {industry-driven} | SENTIMENT/SUMMARIZE/TRANSLATE | | 5 cards, Arabic text |
| 11 | Query Optimization | Advanced | ✅ | MEDIUM | Result Cache/ACCOUNT_USAGE | | Mock fallback |
| 12 | Cost & Pricing | Advanced | ✅ | MEDIUM | Pay-per-Use | | Mock fallback |
| 13 | Dynamic Tables | Advanced | ✅ | {industry-driven} | Declarative Pipelines | | |
| 14 | Policy Intelligence | Advanced | ✅ | {industry-driven} | Cortex Search (RAG) | | {regulatory} docs |
| 15 | Data Masking | Advanced | ✅ | {industry-driven} | Column-Level Security | | {regulatory} PII |
| 16 | Data Classification | Advanced | ✅ | {industry-driven} | SYSTEM$CLASSIFY | | |
| 17 | Ask {Customer} | Core | ✅ | MUST | Cortex Analyst | | NL-to-SQL chatbot |
| 18 | _Custom Page 1_ | Custom | ❓ | — | — | | _Describe requirement_ |
| 19 | _Custom Page 2_ | Custom | ❓ | — | — | | _Describe requirement_ |
| 20 | _Custom Page 3_ | Custom | ❓ | — | — | | _Describe requirement_ |
| ... | _(add more rows as needed)_ | | | | | | |

**Column definitions:**
- **Include?**: ✅ = build it, ❌ = skip, ❓ = discuss
- **Priority**: MUST / HIGH / MEDIUM / OPTIONAL / CUSTOM
- **Category**: Core (S3), Advanced (S4), Custom (additional session)
- **Custom Requirements**: Free text — any specific ask beyond the template behavior
- **Notes**: Implementation notes, dependencies, constraints

---

### Tab 3: "Data Domain Mapping"

| # | Template Entity (MISK) | Customer Entity | Table Name | Est. Row Count | PII Columns | Notes |
|---|------------------------|-----------------|------------|---------------|-------------|-------|
| 1 | BENEFICIARIES | {primary entity} | {TABLE_NAME} | {N}K | {cols} | Primary entity |
| 2 | ENROLLMENTS | {secondary entity} | {TABLE_NAME} | {N}M | — | Transaction entity |
| 3 | PROGRAMS | {tertiary entity} | {TABLE_NAME} | {N} | — | Reference table |
| 4 | TRAINERS | {fourth entity} | {TABLE_NAME} | {N}K | — | |
| 5 | SKILL_ASSESSMENTS | {fifth entity} | {TABLE_NAME} | {N}M | — | Largest table |
| 6 | FEEDBACK | {feedback entity} | {TABLE_NAME} | {N}K | — | Text for Cortex AI |
| 7 | EVENTS | {events entity} | {TABLE_NAME} | {N} | — | |
| 8 | STARTUPS | {extra entity} | {TABLE_NAME} | {N} | — | |
| 9 | _(custom entity 1)_ | | | | | |
| 10 | _(custom entity 2)_ | | | | | |

**Pre-fill** using `references/data-domain-templates.md` → `{industry}` vertical.

---

### Tab 4: "Scenario Flow & Demo Script"

| # | Demo Order | Page | Time (min) | Lead Hook (1 sentence) | Snowflake Feature | Audience Resonance |
|---|-----------|------|------------|----------------------|-------------------|-------------------|
| 1 | Opening | Architecture | 2 | "Every node is live and clickable" | Full Platform | Executive |
| 2 | {N} | {page} | {2-5} | {hook from scenario-matrix} | {feature} | {Technical/Business/Executive} |
| ... | | | | | | |
| N | Closing | Ask {Customer} | 3 | "Any question, plain language, instant answer" | Cortex Analyst | All |

**Pre-fill** from `references/scenario-matrix.md` → `{industry}` lead scenario order.

Total estimated demo time: `=SUM(C2:C{N})` minutes.

---

### Tab 5: "Timeline & Sessions"

| Session | Name | Scope | Target Date | Status | Dependencies | Notes |
|---------|------|-------|-------------|--------|--------------|-------|
| S0 | Planning | Scope doc, PLAN.md, memory | {date} | ⬜ Pending | Intake complete | |
| S0.5 | Data Gen | Synthetic CSVs | {date} | ⬜ Pending | S0 approved | |
| S1 | Infrastructure | config + deploy SQL | {date} | ⬜ Pending | S0 approved | |
| S2 | Backend | FastAPI + Cortex Search | {date} | ⬜ Pending | S1 complete | |
| S3 | Frontend Core | 8 pages + shared | {date} | ⬜ Pending | S2 complete | |
| S4 | Frontend Advanced | 9+ pages + semantic model | {date} | ⬜ Pending | S3 complete | |
| S5 | Deploy + Demo Pack | SPCS + DEMO_SCRIPT | {date} | ⬜ Pending | S4 complete | |
| S6 | _Custom (if needed)_ | Custom pages | {date} | ⬜ Pending | S5 complete | Only if custom pages added |

---

### Tab 6: "Sign-Off"

| # | Field | Value |
|---|-------|-------|
| 1 | Document Version | 1.0 |
| 2 | Scope Frozen Date | {to be filled} |
| 3 | Approved By | {stakeholder name} |
| 4 | Approval Date | {to be filled} |
| 5 | Change Log | |
| | v1.0 — Initial scope | {date} |
| | v1.1 — {change description} | {date} |

**Below the approval block, add:**

```
SCOPE AGREEMENT:
- Pages marked ✅ MUST will be built.
- Pages marked ❓ will be discussed and confirmed before S3/S4.
- Custom pages (Category = Custom) add approximately 1 session each.
- Any scope change after sign-off resets the Timeline tab.
- Data domain mapping (Tab 3) drives DDL, endpoints, and frontend labels.
```

---

## Step 3: Apply Industry Defaults

Before presenting to the user, pre-fill priority values from `references/scenario-matrix.md`:

| Industry | Pages set to MUST (beyond baseline) | Pages set to OPTIONAL |
|----------|-------------------------------------|----------------------|
| Government | Policy Intelligence, Data Classification, Data Masking | Optimization, Pricing |
| Finance | Data Masking, Data Classification, ML/AI, Policy Intelligence | — |
| Healthcare | Data Masking, ML/AI, Quality, Data Classification | Optimization, Pricing |
| Energy | Performance, Analytics, Dynamic Tables, Quality | Data Classification |
| Telecom | ML/AI, Cortex AI, Dynamic Tables, Analytics | Policy Intelligence |
| Retail | Analytics, ML/AI, Cortex AI, Dynamic Tables | Policy Intelligence |

---

## Step 4: Generate the File

### Option A: Google Sheets (if MCP available)

```
mcp_google-worksp_create_spreadsheet:
  title: "{customer_name} — Platform Demo Scope v1.0"
  sheets:
    - name: "Customer Context"
      headers: ["Field", "Value"]
      rows: [...14 rows from Step 2 Tab 1...]
    - name: "Page Requirements"
      headers: ["#", "Page Name", "Category", "Include?", "Priority", "Snowflake Feature", "Custom Requirements", "Notes"]
      rows: [...17+ rows...]
    - name: "Data Domain Mapping"
      headers: ["#", "Template Entity", "Customer Entity", "Table Name", "Est. Rows", "PII Columns", "Notes"]
      rows: [...8+ rows...]
    - name: "Scenario Flow"
      headers: ["#", "Demo Order", "Page", "Time (min)", "Lead Hook", "Feature", "Audience"]
      rows: [...]
    - name: "Timeline & Sessions"
      headers: ["Session", "Name", "Scope", "Target Date", "Status", "Dependencies", "Notes"]
      rows: [...7 rows...]
    - name: "Sign-Off"
      headers: ["Field", "Value"]
      rows: [...]
```

### Option B: Local .xlsx (if no Google Workspace)

First ensure openpyxl is available:
```bash
pip install openpyxl 2>/dev/null || pip3 install openpyxl
```

Then run the generator:
```bash
python scripts/generate_scope_doc.py \
  --customer "{customer_name}" \
  --slug "{slug}" \
  --industry "{industry}" \
  --country "{country}" \
  --output "{target_path}/docs/{slug}_scope_v1.xlsx"
```

---

## Step 5: Present to User

After generating:

```
Scope document created: {path or Google Sheets URL}

Tabs:
1. Customer Context — your project settings
2. Page Requirements — 17 template pages + rows for custom pages
3. Data Domain Mapping — entity names to finalize
4. Scenario Flow — demo order and timing
5. Timeline & Sessions — target dates to fill
6. Sign-Off — freeze scope before generation

Next steps:
1. Review Tab 2 (Page Requirements) — mark any ❓ as ✅ or ❌
2. Fill Tab 3 (Data Domain) — confirm entity names for your domain
3. Add any CUSTOM pages in Tab 2 (rows 18+)
4. Set target dates in Tab 5
5. Get stakeholder sign-off in Tab 6

Once approved, paste the next-session prompt to start Session 1.
```

⚠️ STOPPING POINT: Do NOT proceed to code generation until the scope document is reviewed and the Sign-Off tab is filled.

---

## Handling Custom Pages (beyond the 17 template)

When a user adds custom pages in Tab 2:

1. Each custom page automatically adds ~1 extra session to the timeline
2. The generate sub-skill will prompt for:
   - What Snowflake feature does this showcase?
   - What endpoints are needed?
   - Which page pattern fits? (single-load / tab-cache / wizard / NCIM-card / chatbot / static)
3. Custom pages are generated in a **Session 6+** (never squeeze into S3/S4)
4. The DEMO_SCRIPT.md includes custom pages in the recommended flow

### Examples of common custom page requests:

| Request | Snowflake Feature | Pattern |
|---------|-------------------|---------|
| "Data Sharing / Marketplace" | Secure Data Sharing | Single-load (show shares + grants) |
| "Snowpark ML Pipeline" | Snowpark Python | NCIM-card (3 pipeline stages) |
| "Real-time Streaming" | Snowpipe Streaming | Wizard (ingest → transform → query) |
| "External Functions / API" | External Functions | Single-load (call + result) |
| "Geospatial Analytics" | H3 / Geography | Tab-cache (map + grid + drill) |
| "Document AI" | AI_PARSE_DOCUMENT | NCIM-card (upload → extract → query) |
| "Multi-cluster Warehouse" | MWH Auto-scaling | Single-load (concurrency demo) |
| "Data Clean Room" | DCR / Secure Sharing | Wizard (create → share → run) |

---

## Common Mistakes

- **Skipping the scope doc and jumping to code**. Scope changes mid-build waste entire sessions. Always scope first.
- **Not including custom requirements column**. Generic "include" checkboxes are insufficient — custom notes drive the actual implementation.
- **Uniform priorities**. If everything is MUST, nothing is prioritized. Force-rank using scenario-matrix.md.
- **Missing entity mapping**. Without Tab 3, the generate sub-skill guesses entity names — leading to inconsistent naming across SQL, API, and UI.
- **No sign-off date**. Without a frozen scope, stakeholders add pages mid-build and blame the builder.
