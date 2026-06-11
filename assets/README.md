# Assets — Code Templates

These are skeleton code templates used by the `generate` sub-skill when scaffolding demo projects. They encode the proven patterns from NCIM, IMSU, and MISK — reducing LLM hallucination by providing actual code to adapt rather than relying solely on prose descriptions.

## Templates

| File | Used in | Pattern |
|------|---------|---------|
| `config.toml` | S1 Infrastructure | Project configuration — all substitution placeholders |
| `session.py` | S2 Backend | Snowpark session factory (local + SPCS dual mode) |
| `main.py` | S2 Backend | FastAPI skeleton with lifespan, Cortex Search seed, endpoint patterns |
| `App.tsx` | S3 Frontend | Application shell with page router, dark mode, navigation events |
| `PageTemplate.tsx` | S3/S4 Frontend | Standard single-load page pattern |
| `TabCachePage.tsx` | S3/S4 Frontend | Multi-tab page with cache (no re-fetch on switch) |
| `WizardStepPage.tsx` | S3 Frontend | Step-by-step reveal pattern (Time Travel, Recovery) |
| `NCIMCardPage.tsx` | S4 Frontend | Independent-card pattern (ML/AI, Masking, Classification) |

## How to Use

The `generate/SKILL.md` sub-skill should:
1. Read the appropriate template from this directory
2. Apply the Universal Substitution Map (see generate/SKILL.md)
3. Expand with domain-specific endpoints/components from `references/demo-pages-catalog.md`
4. Write the result to `{target_path}/`

Templates contain `{PLACEHOLDER}` markers that match the substitution map variables.

## Page Pattern Selection Guide

| Page characteristic | Use this template |
|---|---|
| Single load button, one data set | `PageTemplate.tsx` |
| Multiple tabs, each with its own data | `TabCachePage.tsx` |
| Step-by-step guided demo (reveal one at a time) | `WizardStepPage.tsx` |
| 3+ independent capabilities, each runs alone | `NCIMCardPage.tsx` |
| Fully static, no API calls | Custom (Architecture page) |
| Full-page chatbot (Ask {Name}) | Custom (unique pattern) |
