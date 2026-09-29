---
name: platform-demo-intake
description: "Interactive wizard-style intake for platform demo generation. Uses ask_user_question tool to collect inputs step-by-step with smart defaults, validation, and confirmation."
---

# Intake — Interactive Wizard

Collect all inputs needed to generate the platform demo using an interactive wizard. Uses `ask_user_question` tool to prompt the user step-by-step with smart defaults and validation.

---

## Wizard Flow

The intake runs as a **3-step wizard** (not a wall of text). Each step uses `ask_user_question` with pre-filled defaults where possible.

---

## Step 1: Core Identity (ask_user_question — 3 fields)

Use the `ask_user_question` tool with these questions:

```json
{
  "questions": [
    {
      "header": "Customer",
      "question": "What is the customer's full name?",
      "type": "text",
      "defaultValue": ""
    },
    {
      "header": "Country",
      "question": "Which country is the customer in?",
      "type": "text",
      "defaultValue": "Saudi Arabia"
    },
    {
      "header": "Website",
      "question": "What is the customer's website URL?",
      "type": "text",
      "defaultValue": "https://"
    }
  ]
}
```

After receiving answers:
- **Derive slug** from customer name (lowercase, max 12 chars, no special chars)
- **Derive language** from country (GCC/Levant/Egypt → `en+ar`, Maghreb → `en+fr`, Turkey → `en+tr`, etc.)
- **Derive regulatory context** from country (KSA → PDPL, EU → GDPR, USA Healthcare → HIPAA)
- **Derive target path** as `~/Projects/{SLUG_UPPERCASE}`

---

## Step 2: Configuration (ask_user_question — smart defaults pre-filled)

Now ask with all derived values as defaults:

```json
{
  "questions": [
    {
      "header": "Slug",
      "question": "Project slug (used for DB name, folder, Docker images)?",
      "type": "text",
      "defaultValue": "{derived_slug}"
    },
    {
      "header": "Language",
      "question": "UI language mode?",
      "type": "options",
      "multiSelect": false,
      "options": [
        {"label": "en", "description": "English only"},
        {"label": "en+ar", "description": "Bilingual English + Arabic (RTL toggle)"},
        {"label": "en+fr", "description": "Bilingual English + French"},
        {"label": "en+tr", "description": "Bilingual English + Turkish"},
        {"label": "en+fa", "description": "Bilingual English + Farsi (RTL toggle)"},
        {"label": "en+ur", "description": "Bilingual English + Urdu (RTL toggle)"}
      ]
    },
    {
      "header": "Connection",
      "question": "Which Snow CLI connection to use? (needs ACCOUNTADMIN)",
      "type": "text",
      "defaultValue": "{slug}-deploy"
    },
    {
      "header": "Path",
      "question": "Where should the project be created?",
      "type": "text",
      "defaultValue": "~/Projects/{SLUG_UPPERCASE}"
    }
  ]
}
```

If the user doesn't know their connection name, run `snow connection list` and present the results.

---

## Step 3: Optional Enrichment (ask_user_question — all optional)

```json
{
  "questions": [
    {
      "header": "Brand color",
      "question": "Primary brand color (hex)? Leave default to auto-detect from website.",
      "type": "text",
      "defaultValue": "#29B5E8"
    },
    {
      "header": "Context doc",
      "question": "Do you have a context document? (RFP, MoM summary, demo scope brief, requirements doc — URL or local path, or leave empty)",
      "type": "text",
      "defaultValue": ""
    },
    {
      "header": "Deployment",
      "question": "Where will the demo run?",
      "type": "options",
      "multiSelect": false,
      "options": [
        {"label": "Local only", "description": "Run on laptop (uvicorn + npm run dev) — fastest, no cloud setup needed"},
        {"label": "Local + App Runtime", "description": "Build locally first, then deploy to Snowflake App Runtime (Next.js, no Docker) — recommended"},
        {"label": "Local + SPCS", "description": "Build locally, then port to SPCS (Docker multi-container) — legacy approach"},
        {"label": "App Runtime from start", "description": "Design as Next.js app for App Runtime from Session 1 (snow app deploy)"}
      ]
    }
  ]
}
```

### Context Document Types

The skill accepts any of these as `context_source`:

| Document type | What the skill extracts from it |
|---|---|
| **RFP** (Request for Proposal) | Evaluation criteria, use cases, compliance requirements, timeline |
| **MoM** (Minutes of Meeting) | Pain points discussed, priorities agreed, stakeholder names |
| **Demo Scope Brief** | Specific pages/scenarios requested, audience level, time constraints |
| **Requirements Doc** | Functional requirements, data sources, integration points |
| **Presentation / Deck** | Customer goals, strategic priorities, existing architecture |

All types are processed the same way: `web_fetch` (if URL) or `read` (if local path), then analyzed by the research sub-skill for industry, entities, pain points, and regulatory context.

---

## Step 4: Confirm Context Block

After all 3 steps, produce and display the confirmed context block:

```yaml
# Customer Demo Context — confirmed {date}
customer_name: "{full display name}"
slug: "{slug}"
display_name: "{short name}"
country: "{country}"
language: "{en | en+ar | en+fr | en+tr | ...}"
website_url: "{url}"
context_source: "{url or path | none}"
connection_name: "{connection}"
target_path: "{path}"
brand_color: "{color}"
regulatory_context: "{PDPL | GDPR | HIPAA | SOX | Generic}"
```

Then ask for final confirmation:

```json
{
  "questions": [
    {
      "header": "Confirm",
      "question": "Does this look correct? (I'll proceed to research next)",
      "type": "options",
      "multiSelect": false,
      "options": [
        {"label": "Yes, proceed", "description": "Start research phase with these settings"},
        {"label": "Edit fields", "description": "Let me correct something before proceeding"}
      ]
    }
  ]
}
```

If "Edit fields" → ask which field to change, update, re-confirm.
If "Yes, proceed" → move to research sub-skill.

---

## Derivation Rules

### Slug
- Lowercase the customer name
- Take the most distinctive word (skip "Saudi", "National", "Royal", "The")
- Replace spaces with hyphens
- Remove special characters
- Max 12 characters
- Examples:
  - "Saudi Aramco" → `aramco`
  - "MISK Foundation" → `misk`
  - "National Commercial Bank" → `ncb`
  - "King Faisal University" → `kfu`
  - "Deloitte Consulting" → `deloitte`

### Language
| Country / Region | Default | Secondary | Script direction |
|---|---|---|---|
| Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Oman | `en+ar` | Arabic | RTL |
| Jordan, Egypt, Lebanon, Iraq, Libya, Sudan | `en+ar` | Arabic | RTL |
| Morocco, Tunisia, Algeria | `en+fr` | French | LTR |
| Turkey | `en+tr` | Turkish | LTR |
| Iran | `en+fa` | Farsi/Persian | RTL |
| Pakistan | `en+ur` | Urdu | RTL |
| Senegal, Ivory Coast, Cameroon, DRC, Mali | `en+fr` | French | LTR |
| Mozambique, Angola | `en+pt` | Portuguese | LTR |
| Kenya, Nigeria, Ghana, South Africa, Tanzania, Ethiopia | `en` | — | LTR |
| EU countries, UK | `en` | — | LTR |
| USA, Canada, Australia | `en` | — | LTR |
| All others | `en` | — | LTR |

RTL languages (Arabic, Farsi, Urdu) require `dir="rtl"` on text containers + an RTL-compatible font.

### Regulatory Context
| Country / Region | Regulation | Key law | Policy docs source |
|---|---|---|---|
| Saudi Arabia | PDPL | Personal Data Protection Law (2023) | `pdpl_policy_docs` |
| UAE | PDPL-UAE | Federal Decree-Law No. 45/2021 on Personal Data Protection | `pdpl_policy_docs` (adapted) |
| Qatar | PDPL-QA | Law No. 13 of 2016 on Personal Data Privacy | `pdpl_policy_docs` (adapted) |
| Bahrain | PDPL-BH | Personal Data Protection Law No. 30/2018 | `pdpl_policy_docs` (adapted) |
| Kuwait, Oman | Generic-GCC | No comprehensive data protection law yet | `generic_policy_docs` |
| Jordan | Draft-PDPL | Draft Personal Data Protection Law (pending) | `generic_policy_docs` |
| Egypt | EDPL | Egypt Data Protection Law No. 151/2020 | `generic_policy_docs` (adapted) |
| Morocco | CNDP | Law 09-08 on Protection of Personal Data | `generic_policy_docs` (adapted) |
| Tunisia | INPDP | Organic Law No. 2004-63 on Personal Data Protection | `generic_policy_docs` (adapted) |
| Turkey | KVKK | Personal Data Protection Law No. 6698 (2016) | `generic_policy_docs` (adapted) |
| South Africa | POPIA | Protection of Personal Information Act (2013) | `generic_policy_docs` (adapted) |
| Nigeria | NDPR | Nigeria Data Protection Regulation (2019) | `generic_policy_docs` (adapted) |
| Kenya | DPA | Data Protection Act (2019) | `generic_policy_docs` (adapted) |
| EU countries, UK | GDPR | General Data Protection Regulation | `gdpr_policy_docs` |
| USA + Healthcare | HIPAA | Health Insurance Portability and Accountability Act | `hipaa_policy_docs` |
| USA + Finance | SOX/CCPA | Sarbanes-Oxley / California Consumer Privacy Act | `generic_policy_docs` |
| Pakistan | Draft | Personal Data Protection Bill (pending) | `generic_policy_docs` |
| Iran | Generic | No comprehensive data protection law | `generic_policy_docs` |
| All others | Generic | Internal governance policies | `generic_policy_docs` |

### Target Path
- Default: `~/Projects/{SLUG_UPPERCASE}`
- Example: slug `aramco` → `~/Projects/ARAMCO`
- If folder exists, warn the user

### Brand Color
- If user provides → use it
- If empty → attempt detection from website during research phase
- Final fallback: Snowflake blue `#29B5E8`

---

## Connection Guidance

If the user says "I don't know" for connection:

1. Run: `snow connection list`
2. Present available connections
3. Ask user to pick one
4. Verify it has ACCOUNTADMIN: `snow sql -c {connection} -q "SELECT CURRENT_ROLE()"`

If no suitable connection exists, guide them:
```
You'll need to create a connection first:
  snow connection add {slug}-deploy
Then set it up with ACCOUNTADMIN privileges.
```

---

## Edge Cases

- **User provides all 9 fields in a single message**: Skip the wizard, parse directly, jump to Step 4 (confirm).
- **User pastes an RFP**: Extract customer name + country from it, pre-fill remaining fields, run wizard from Step 2.
- **User says "same as last time"**: Check memory for the most recent `*-demo-project.md`, offer to clone settings.
- **User says "just use defaults for Aramco"**: Use country-based defaults, fill slug/path/connection automatically.

---

## Common Mistakes

- **Asking all 9 questions in a text dump**. Use `ask_user_question` tool — it renders as an interactive form, not a wall of text.
- **Not validating connection exists**. Always verify with `snow connection list` before proceeding.
- **Hardcoding language without checking country**. GCC/Levant/Egypt → `en+ar`, Maghreb → `en+fr`, Turkey → `en+tr`, Pakistan → `en+ur`, Iran → `en+fa`.
- **Using the full company name as slug**. "Saudi Electricity Company" → `sec` not `saudi-electricity-company`.
- **Skipping confirmation**. Always show the context block and get explicit "proceed" before research.
