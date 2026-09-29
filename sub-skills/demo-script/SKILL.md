---
name: platform-demo-script
description: "Demo script generator. Produces DEMO_SCRIPT.md with prioritized scenarios, talking points, and objection handlers tailored to the customer's industry and context."
---

# Demo Script — Talking Points Generator

Generates `{target_path}/docs/DEMO_SCRIPT.md` at the end of Session 5. Uses the research context and scenario matrix to select the top scenarios and write customer-specific talking points.

---

## Step 1: Load Scenario Priorities

Read `references/scenario-matrix.md` to get the prioritized scenario list for `{industry}`.

Always include these 4 as **must-lead** scenarios:
1. Platform Overview (S1) — "single source of truth" hook
2. Performance at Scale (S2) — query speed hook
3. Analytics Dashboards (S3) — business insight hook
4. Ask {display_name} (S16) — natural language / AI hook

Add industry-specific scenarios (from scenario-matrix.md) in priority order.

---

## Step 2: Produce DEMO_SCRIPT.md

Write the following structure to `{target_path}/docs/DEMO_SCRIPT.md`:

```markdown
# {customer_name} Platform Demo — Demo Script
**Industry**: {industry}
**Regulatory Context**: {regulation}
**Date**: {today}
**Prepared by**: Platform Demo Generator

---

## Pre-Demo Checklist
- [ ] Backend running: `SNOWFLAKE_CONNECTION_NAME={connection_name} uvicorn backend/app/main:app --port 8200`
- [ ] Frontend running: `cd frontend && npm run dev` → http://localhost:5300
- [ ] Verified: /api/health returns {"status": "ok"}
- [ ] Verified: All pages load without errors
- [ ] Browser: Chrome/Edge full-screen mode, dark theme recommended
- [ ] Audience: {intended audience — technical / business / executive}

---

## Recommended Demo Flow ({N} scenarios, ~{estimated time} min)

| # | Page | Time | Snowflake Feature | Lead Hook |
|---|------|------|-------------------|-----------|
{table row per scenario}

---

## Opening (2 min)
Start on the **Architecture** page.

> "Before we dive in, let me show you the full picture. Every node you see here is live and running on Snowflake right now. This isn't a mockup — it's a map of exactly how {customer_name}'s data platform would be structured. Click any node and it takes you directly to that capability."

Talking points:
- Single platform: ingestion → processing → ML → consumption → governance
- No data copies, no ETL pipelines between tools
- {customer_name} specific: point to their domain entities in the architecture layers

---
```

---

## Step 3: Generate Per-Scenario Blocks

For each selected scenario, generate a block using this template:

```markdown
---

## Scenario {N}: {scenario_title}
**Page**: {page_id}
**Snowflake Feature**: {snowflake_feature}
**Estimated time**: {2-5} min

### Business Hook for {customer_name}
"{one-sentence tailored hook using {customer_name} domain context}"

### Setup (before clicking)
> "{What to say before loading data}"

### Demo Steps
1. Click **{button label}** → {what the audience sees}
2. {next action} → {result}
3. {highlight} → {business takeaway}

### Talking Point
> "For {customer_name}, this means {business value statement tied to their industry and pain points}."

### Numbers to Highlight
- {specific metric from the demo, e.g. "10M records queried in 0.8 seconds"}
- {another metric}

### Objection Handler
**If asked: "{common objection for this scenario}"**
> "{concise response}"
```

---

## Industry-Specific Scenario Talking Points

Use these templates per industry. Adapt `{entity}` to the domain's primary entity.

### Energy
- **Performance**: "Querying 10M+ {production records / sensor readings} across 15 years of operations in under 2 seconds — no pre-aggregation."
- **Analytics**: "Real-time visibility across all {wells / assets / regions} — drill from regional KPIs down to individual asset performance."
- **ML/AI**: "Anomaly detection on {production / maintenance} data — surface equipment failures before they happen."
- **Policy Intelligence**: "Ask any {HSE / regulatory} compliance question in natural language — Cortex Search retrieves the exact {regulation} clause."
- **Dynamic Tables**: "Automatic refresh of {safety / operations} KPIs without manual pipeline maintenance."

### Finance
- **Data Masking**: "Analysts see masked {account numbers / national IDs} — compliance teams see full data. Same table, different views, zero extra infrastructure."
- **Data Classification**: "Auto-classify 500+ columns across 80 tables as PII, SENSITIVE, or QUASI_IDENTIFIER — in minutes."
- **Policy Intelligence**: "{GDPR / SOX / CCPA} compliance check: paste a data practice, get an instant AI-powered verdict."
- **Performance**: "{Transactions / trades} processed at {10M+} per day — queries return in milliseconds, not minutes."
- **Time Travel**: "Reconstruct exactly what a {customer's account / portfolio} looked like at any point in the past — no backup restore needed."

### Healthcare
- **Data Masking**: "{Patient IDs / diagnoses} masked for BI teams, visible for authorized clinical staff — one masking policy, automatic enforcement."
- **Data Classification**: "HIPAA-compliant data classification across your entire {EHR / clinical} data estate."
- **ML/AI**: "Predict {readmission risk / dropout from treatment} with Snowflake's built-in ML — no external tools, no data movement."
- **Lineage**: "Full audit trail: this {outcome metric} was derived from {source system} → transformed by {procedure} → consumed by {dashboard}."
- **Quality**: "Data Metric Functions running 24/7 on {patient / clinical} data — catch freshness issues, duplicate records, and null fields automatically."

### Government
- **Data Classification**: "Auto-tag all columns across your data estate as CONFIDENTIAL, RESTRICTED, or PUBLIC — one query, full inventory."
- **Policy Intelligence**: "Ask any {PDPL / internal regulation} question and get the exact article reference with an AI-powered compliance verdict."
- **Lineage**: "Complete audit trail for any published statistic — trace it back to the source system, the transformation, and the person who authorized it."
- **Time Travel**: "Query data as of any historical date — useful for audits, parliamentary inquiries, and reconciliation."
- **Data Masking**: "Citizen {national IDs / phone numbers} masked for operational teams, visible only to authorized roles — no code changes."

### Telecom / Retail
- **ML/AI**: "Churn prediction on {subscriber / customer} data — built-in CLASSIFICATION model, no Python environment, no external ML platform."
- **Cortex AI**: "Sentiment analysis on {customer feedback / support tickets} — classify, summarize, and translate in one SQL function call."
- **Dynamic Tables**: "Loyalty / churn score refreshes automatically as new {transactions / interactions} land — always fresh, no cron jobs."
- **Analytics**: "Drill from national KPIs down to individual {store / cell tower / subscriber} — 6 interactive tabs, all from one Snowflake query."

### Education
- **Analytics**: "Program performance across all {regions / campuses}: enrollment trends, completion rates, skills gap analysis — all in one platform."
- **ML/AI**: "Predict dropout risk before it happens — flag at-risk {students / trainees} for early intervention."
- **Time Travel**: "Audit trail: reconstruct {enrollment / assessment} records as of any historical date for accreditation reviews."
- **Ask {display_name}**: "Any stakeholder can ask '{how many students enrolled in Technology programs this quarter?}' in plain English and get an answer instantly."

---

## Closing (2 min)

End on the **Ask {display_name}** page.

> "Let me leave you with this. Everything you've seen today — the performance, the ML models, the governance, the compliance checks — all of it is accessible to a business user in plain language. No SQL. No BI tool. Just a question. That's what Snowflake means by AI Data Cloud."

Demo questions to use:
- "{domain-specific natural language question 1}"
- "{domain-specific natural language question 2}"

---

## Appendix: Feature Map

See `references/demo-pages-catalog.md` for the full feature-to-page mapping with business value hooks.
```

---

## Step 4: Review Demo Script with User (ask_user_question)

Before committing, present the key elements for user review:

```json
{
  "questions": [
    {
      "header": "Demo script",
      "question": "DEMO_SCRIPT.md generated. Here's the recommended flow:\n\n{demo flow table: # | Page | Time | Lead Hook}\n\nTotal estimated time: ~{N} min\n\nOpening hook:\n\"{opening_hook}\"\n\nClosing hook:\n\"{closing_hook}\"\n\nDoes this flow and timing work for your audience?",
      "multiSelect": false,
      "options": [
        {"label": "Approve script", "description": "Flow and hooks look good, commit it"},
        {"label": "Reorder pages", "description": "I want a different scenario sequence"},
        {"label": "Edit hooks", "description": "Some talking points need tweaking"},
        {"label": "Adjust timing", "description": "Some pages need more/less time"}
      ]
    }
  ]
}
```

If "Reorder" -- ask for the new order, regenerate the flow table.
If "Edit hooks" -- ask which scenario, present the current hook, let user edit.
If "Adjust timing" -- ask which pages, update time estimates.

## Step 5: Commit and Update Memory

```bash
git add docs/DEMO_SCRIPT.md
git commit -m "docs: DEMO_SCRIPT.md — {slug}"
```

Update `/memories/{slug}-demo-project.md` to note DEMO_SCRIPT.md is complete.
