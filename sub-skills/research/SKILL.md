---
name: platform-demo-research
description: "Customer research, storytelling arc, capability selection, and gap analysis for platform demo generation. Fetches website, reads context docs, maps pain points to Snowflake capabilities, builds a compelling demo narrative, lets the user select pages, and suggests missing capabilities."
---

# Research — Customer Context, Storytelling & Capability Selection

This sub-skill does three things:
1. **Research** the customer (website + docs) to understand their world
2. **Build a story** — map their pain points to a compelling Snowflake narrative
3. **Let the user select** which capabilities to include + suggest what they're missing

---

## Step 1: Fetch the Website

Use `web_fetch` on `{website_url}`:

```
web_fetch(url="{website_url}", extract_text=true)
```

From the response, extract:

| Field | What to look for |
|-------|-----------------|
| **Industry vertical** | Business description, products/services, sector keywords |
| **Key data entities** | What data the company produces/manages (transactions, assets, patients, etc.) |
| **Data scale signals** | "millions of customers", "global operations", "real-time", "IoT sensors" |
| **Pain points** | Legacy systems, data silos, compliance challenges, growth pressure |
| **Language cue** | Is the website in Arabic or bilingual? → set `language: en+ar` |
| **Brand color** | Look for prominent color in logo/header description if `brand_color` was not provided |
| **Competitors/tools mentioned** | Current tech stack, vendors they reference |

---

## Step 2: Read Context Document (if provided)

The `context_source` can be any of these document types:

| Type | Signals to look for | What to extract |
|------|--------------------|-----------------| 
| **RFP** | "Request for Proposal", evaluation criteria, scoring | Use cases, compliance requirements, timeline, competitors |
| **MoM** (Minutes of Meeting) | "Action items", "Agreed", attendee list | Pain points discussed, priorities, stakeholder names |
| **Demo Scope Brief** | "Pages", "scenarios", "audience", "duration" | Specific pages requested, audience level, time constraints |
| **Requirements Doc** | "Functional requirements", "shall", "must" | Data sources, integration points, scale requirements |
| **Presentation / Deck** | Slide structure, strategic language | Customer goals, existing architecture, future state |

If `context_source` is a URL:
```
web_fetch(url="{context_source}", extract_text=true)
```

If `context_source` is a local file path:
```
read(file_path="{context_source}")
```

From the document, extract:
- Specific Snowflake use cases mentioned (data warehouse, ML, sharing, governance)
- Evaluation criteria (performance, security, compliance, cost)
- Timeline or deadline signals
- Competitor mentions (if any)
- Specific regulatory requirements named
- **Explicit asks** (e.g. "we need to see real-time ingestion", "show us ML capabilities")

---

## Step 3: Determine Industry & Regulatory Context

Map to vertical using `references/scenario-matrix.md` industry list.
Map to regulation using country (PDPL/GDPR/HIPAA/SOX/Generic).
Identify key data entities from `references/data-domain-templates.md`.

---

## Step 4: Build the Storytelling Arc

This is the critical step that separates a good demo from a feature dump.

**A compelling demo tells a STORY, not a feature list.** Structure it as:

```
PROBLEM → PAIN → SOLUTION → PROOF → VISION
```

For the customer, construct:

### 4a: Identify the NARRATIVE THREAD

Based on research, pick ONE overarching narrative that connects all pages:

| Industry | Narrative thread examples |
|----------|--------------------------|
| Government | "From citizen data chaos to a unified, secure, self-service platform" |
| Finance | "From compliance burden to automated governance with AI-powered insights" |
| Healthcare | "From siloed patient data to a governed, ML-enriched clinical platform" |
| Energy | "From delayed sensor data to real-time predictive operations" |
| Telecom | "From reactive churn management to AI-driven proactive retention" |
| Retail | "From batch inventory updates to real-time personalization at scale" |

### 4b: Map Pain Points → Snowflake Capabilities

For each pain point found in research, map to a specific Snowflake capability:

```yaml
story_arcs:
  - pain: "{pain point from research}"
    snowflake_answer: "{capability}"
    page: "{page_id}"
    hook: "{one-sentence business outcome}"
    
  - pain: "Data silos across 12 legacy systems"
    snowflake_answer: "Unified Data Platform + Medallion Architecture"
    page: "architecture"
    hook: "All your data in one governed platform — no more silos"
    
  - pain: "Compliance team spends 40 hours/week on manual regulatory checks"
    snowflake_answer: "Cortex Search RAG + AI-powered compliance"
    page: "policy-intelligence"
    hook: "Ask any regulation question in natural language — instant answer"
```

### 4c: Sequence the Demo as a JOURNEY

Order pages so each builds on the previous:

```
1. HOOK (Architecture) — "Here's the big picture"
2. FOUNDATION (Platform + Performance) — "It works, and it's fast"
3. BUSINESS VALUE (Analytics + ML) — "Here's what you can DO with it"
4. GOVERNANCE (Masking + Classification + Policy) — "It's secure and compliant"
5. INNOVATION (Agent + Streaming + Iceberg) — "And here's what's next"
6. CLOSE (Ask {Customer}) — "Anyone can use it — no SQL needed"
```

---

## Step 5: Present Research + Recommended Capabilities

Present findings to the user with a clear recommendation:

```
=== Research Complete: {customer_name} ===

Industry: {vertical}
Narrative: "{one-sentence story thread}"
Key pain points found:
  1. {pain} → maps to {capability} ({page})
  2. {pain} → maps to {capability} ({page})
  3. {pain} → maps to {capability} ({page})

RECOMMENDED DEMO FLOW ({N} pages, ~{M} min):
  Opening:  Architecture → Platform → Performance
  Core:     {3-4 pages driven by pain points}
  Advanced: {3-4 pages driven by industry priority}
  Close:    Ask {Customer}
```

---

## Step 6: Capability Selection (Interactive — ask_user_question)

Now present ALL 23 capabilities grouped by relevance and let the user choose:

```json
{
  "questions": [
    {
      "header": "Capabilities",
      "question": "Based on research, I recommend these capabilities. Select which ones to INCLUDE in the demo (you can add/remove):",
      "multiSelect": true,
      "options": [
        {"label": "Platform Overview", "description": "✅ RECOMMENDED — unified data platform KPIs"},
        {"label": "Performance at Scale", "description": "✅ RECOMMENDED — 10M+ records in seconds"},
        {"label": "Analytics Dashboards", "description": "✅ RECOMMENDED — 7-tab drill-down + map"},
        {"label": "ML & Predictive AI", "description": "✅ RECOMMENDED — forecast, anomaly, classify"},
        {"label": "Time Travel", "description": "✅ RECOMMENDED — point-in-time restore"},
        {"label": "Cortex Agent", "description": "🆕 SUGGESTED — multi-tool AI (Search + Analyst)"}
      ]
    }
  ]
}
```

**Important**: The options are dynamic — built from research findings:
- Pages that map to discovered pain points → marked `✅ RECOMMENDED`
- Pages that are MUST for the industry (from scenario-matrix) → marked `✅ RECOMMENDED`
- Pages that would strengthen the story but weren't explicitly asked for → marked `🆕 SUGGESTED`
- Pages that are low priority for this vertical → NOT shown (unless user asks for full list)

The `multiSelect: true` lets the user check/uncheck freely.

---

## Step 7: Gap Analysis & Suggestions

After the user selects capabilities, analyze for GAPS:

### 7a: Missing capabilities that would strengthen the story

Look at the user's selection and suggest additions if:

| If user selected... | But is missing... | Suggest because... |
|---|---|---|
| Data Masking | Data Classification | "You're showing masking but not HOW you discovered what to mask — Classification completes the story" |
| ML/AI | Notebooks | "You're showing ML results but not WHERE data scientists build models — Notebooks shows the workflow" |
| Dynamic Tables | Tasks + Streams | "DTs are declarative; Tasks+Streams show event-driven — together they cover all pipeline patterns" |
| Policy Intelligence | Cortex Agent | "Policy Search is great, but Agent combines it with data queries — more powerful story" |
| Performance | Streaming | "You're showing query speed but not ingestion speed — Streaming completes the real-time story" |
| Analytics | Iceberg Tables | "You're querying data but not showing open format — Iceberg proves no lock-in" |
| Ask {Customer} | Cortex Agent | "Analyst is NL-to-SQL; Agent adds RAG + reasoning — strictly more powerful" |

### 7b: Present gap suggestions

```json
{
  "questions": [
    {
      "header": "Suggestions",
      "question": "I noticed some capabilities that would strengthen your demo story. Add any of these?",
      "multiSelect": true,
      "options": [
        {"label": "Data Classification", "description": "Completes the governance story — auto-discover PII before masking it"},
        {"label": "Notebooks", "description": "Shows the data science WORKFLOW, not just the results"},
        {"label": "Streaming", "description": "Completes the real-time story — ingestion speed, not just query speed"}
      ]
    }
  ]
}
```

If the user declines all suggestions → that's fine, proceed with their selection.
If they add some → update the page list.

---

## Step 8: Document-Driven Scope Validation

If the user provided a context document (RFP, MoM, scope brief):

### 8a: Cross-check requirements vs selected capabilities

```
Checking document requirements against selected capabilities:

| Requirement from doc | Covered by | Status |
|---|---|---|
| "Must demonstrate real-time ingestion" | Streaming page | ✅ Covered |
| "Show ML capabilities" | ML/AI page | ✅ Covered |
| "PDPL compliance demonstration" | Masking + Classification + Policy Intel | ✅ Covered |
| "Data sharing between departments" | NOT SELECTED | ⚠️ GAP |
```

### 8b: Alert on gaps

If requirements from the document are NOT covered by the selected pages:

```json
{
  "questions": [
    {
      "header": "Doc gaps",
      "question": "Your RFP mentions requirements that aren't covered by your current selection. Add these?",
      "multiSelect": true,
      "options": [
        {"label": "Streaming (Snowpipe)", "description": "⚠️ RFP requires 'real-time data ingestion demonstration'"},
        {"label": "Tasks + Streams", "description": "⚠️ MoM mentions 'event-driven processing for new applications'"}
      ]
    }
  ]
}
```

---

## Step 9: Finalize & Produce Research Context Block

After all selections are confirmed, produce:

```yaml
# Research Context — {customer_name}
industry: "{vertical}"
secondary_industry: "{secondary | none}"
narrative_thread: "{one-sentence story}"
key_entities:
  - {ENTITY_1}
  - {ENTITY_2}
  - {ENTITY_3}
  - {ENTITY_4}
  - {ENTITY_5}
data_scale: "{e.g. 10M+ transactions/day, global operations}"
pain_points:
  - "{pain point 1}"
  - "{pain point 2}"
  - "{pain point 3}"
regulatory_context: "{PDPL | GDPR | HIPAA | SOX | Generic}"
language: "{en | en+ar}"
brand_color_detected: "{#RRGGBB | not detected}"

# Selected capabilities (user-confirmed)
selected_pages:
  core:
    - platform
    - performance
    - analytics
    - time-travel
    - recovery
    - lineage
    - quality
    - ask-{slug}
  advanced:
    - architecture
    - ml-ai
    - cortex-ai
    - {... user selections ...}
  
# Story arcs (pain → capability → hook)
story_arcs:
  - pain: "{pain 1}"
    page: "{page_id}"
    hook: "{business outcome}"
  - pain: "{pain 2}"
    page: "{page_id}"
    hook: "{business outcome}"

# Demo flow sequence
demo_sequence:
  opening: [architecture, platform, performance]
  core: [{pain-driven pages}]
  advanced: [{industry-driven pages}]
  close: [ask-{slug}]
  
# Gaps acknowledged (user declined)
declined_suggestions:
  - "{capability}: {reason user declined or 'not relevant'}"
```

Update `/memories/{slug}-demo-project.md` with the Research Summary section.

---

## Step 10: Transition to Plan

Present the final alignment:

```
=== Story Confirmed ===

Narrative: "{thread}"
Pages selected: {N} (8 core + {M} advanced)
Demo duration: ~{N*3} min estimated
Gaps: {N declined | 0 — full coverage}

Proceeding to multi-session plan generation with these {N} pages.
```

Then load `sub-skills/plan/SKILL.md`.

---

## Storytelling Principles (for reference)

1. **Start with THEIR world, not Snowflake's features.** Open with their pain, not our product.
2. **Every page must answer "so what?"** If you can't connect a page to a stated pain point, it's filler.
3. **Build tension then resolve.** Time Travel works because you CORRUPT data first, THEN restore it.
4. **End with empowerment.** Ask {Customer} shows ANYONE can use the platform — not just data engineers.
5. **Never show more than 12 pages in one demo.** If 23 are available, pick the strongest 10-12 for the flow.
6. **The architecture page is the MAP.** Start there so the audience knows where they are throughout.
7. **Group by theme, not by Snowflake feature.** "Governance" (masking + classification + policy) > showing them as 3 unrelated pages.

---

## Common Mistakes

- **Showing all 23 pages.** A demo is not a feature dump. Pick 10-12 that tell a story.
- **Not reading the RFP/MoM.** If the document says "real-time ingestion" and you skip Streaming, you lose credibility.
- **Ordering by session (S3 then S4) instead of by story.** The demo flow is NOT the build order.
- **Skipping gap analysis.** If the user selects Masking but not Classification, they'll get asked "how did you know what to mask?" — suggest it proactively.
- **Generic hooks.** "This shows performance" is weak. "{customer_name} queries 10M {entity} records in 0.8 seconds — no pre-aggregation" is strong.
- **No narrative thread.** Without a connecting story, the demo is 12 disconnected features.
