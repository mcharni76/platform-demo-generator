---
name: platform-demo-data-gen
description: "Synthetic seed data generator for platform demos. Creates realistic CSVs per industry vertical with configurable scale. Outputs to {target_path}/data/output/ ready for load_data.py."
---

# Data Generation — Synthetic Seed Data

Generates realistic synthetic CSV files for the demo's data domain. Run this after Session 1 (infrastructure) creates the DDL, so the CSVs match the table schemas exactly.

---

## When to Run

- After S1 Infrastructure is complete (DDL defines the schema)
- Before running `deploy.py --steps 04` (which expects data in the stage)
- When resuming a demo that needs fresh/different data volumes

---

## Step 1: Determine Scale

Ask the user for data scale:

| Scale | Rows (primary entity) | Total rows across all tables | Demo feel |
|-------|----------------------|------------------------------|-----------|
| `small` | 10K | ~100K | Fast iteration, minimal storage |
| `medium` | 100K | ~2M | Good for performance demos |
| `large` | 500K | ~10M | Full MISK-equivalent, impressive benchmark numbers |

Default: `medium` (matches most presales demos).

---

## Step 2: Generate the Script

Create `{target_path}/scripts/generate_seed_data.py`:

```python
#!/usr/bin/env python3
"""Generate synthetic seed data for {customer_name} platform demo."""

import csv
import os
import random
from datetime import datetime, timedelta
from pathlib import Path

# --- Configuration ---
SCALE = os.getenv("SCALE", "medium")
OUTPUT_DIR = Path("{target_path}/data/output")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

SCALE_MULTIPLIER = {"small": 0.02, "medium": 0.2, "large": 1.0}[SCALE]

# --- Domain Config (adapted per vertical) ---
REGIONS = {regions_from_data_domain_templates}
CATEGORIES = {categories_from_data_domain_templates}

# --- Helpers ---
RANDOM = random.Random(42)  # deterministic seed for reproducibility

def rand_date(start_year=2022, end_year=2026):
    start = datetime(start_year, 1, 1)
    delta = (datetime(end_year, 6, 1) - start).days
    return start + timedelta(days=RANDOM.randint(0, delta))

def rand_choice(lst):
    return RANDOM.choice(lst)

def write_csv(filename, headers, rows):
    path = OUTPUT_DIR / filename
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)
    print(f"  {filename}: {len(rows):,} rows")
```

---

## Step 3: Generate Entity Data

For each entity in the domain (from `references/data-domain-templates.md`), generate a CSV using these rules:

### Row Count by Entity Type

| Entity type | Formula | Example (medium) |
|-------------|---------|------------------|
| Reference tables (regions, categories) | Fixed small count | 13 regions, 150 categories |
| Primary entity (customers, patients, etc.) | `500K × SCALE_MULTIPLIER` | 100K |
| Secondary entity (orders, enrollments) | `primary × 4` | 400K |
| Assessment/detail entity | `primary × 16` | 1.6M |
| Feedback/text entity | `primary × 0.1` | 10K |
| Events/small tables | Fixed 500 | 500 |

### Data Quality Rules (critical for demo realism)

1. **Regional variance**: NOT uniform distribution. Top region gets 3-5x more than bottom region.
   ```python
   # Example: Riyadh 22%, Eastern 15%, Makkah 12%, ... , Northern Borders 1.5%
   REGION_WEIGHTS = [0.22, 0.15, 0.12, 0.10, 0.09, 0.08, 0.07, 0.05, 0.04, 0.03, 0.02, 0.015, 0.015]
   ```

2. **Temporal variance**: NOT flat. Include seasonal patterns.
   ```python
   # More activity in Q1/Q3, less in Q2 (summer), spike in Q4
   MONTH_WEIGHTS = [1.0, 0.9, 1.1, 1.2, 0.8, 0.6, 0.5, 0.7, 1.0, 1.1, 1.2, 1.3]
   ```

3. **Category variance**: Top category 2x the bottom category (never uniform).

4. **Status distribution**: Completion rates between 42–62% (not all 50%). Vary by category AND region.

5. **PII columns**: Generate realistic-looking masked values:
   ```python
   def fake_national_id(): return f"{RANDOM.randint(1,2)}{RANDOM.randint(10,99)}{RANDOM.randint(1000000,9999999)}"
   def fake_email(name): return f"{name.lower().replace(' ','.')}@example.com"
   def fake_phone(): return f"+966{RANDOM.randint(500000000,599999999)}"
   ```

6. **Text columns (for Cortex AI demos)**: Include mix of English and Arabic (if bilingual):
   ```python
   FEEDBACK_TEMPLATES_EN = [
       "The {entity} program was excellent. I learned a lot about {category}.",
       "Average experience. Could improve the {aspect}.",
       "Very disappointed with the {entity}. Not what I expected.",
       # ... 20+ templates
   ]
   FEEDBACK_TEMPLATES_AR = [
       "البرنامج كان ممتازاً. تعلمت الكثير عن {category}.",
       "تجربة عادية. يمكن تحسين {aspect}.",
       # ... 20+ templates
   ]
   ```

---

## Step 4: Generate Regulatory Documents (for Policy Intelligence)

Create `{target_path}/data/output/POLICY_DOCUMENTS.csv` with regulatory content from `references/data-domain-templates.md` → `{regulatory_context}_policy_docs` section.

Headers: `doc_id,doc_name,doc_type,section,content`

This seeds the Cortex Search service for the Policy Intelligence page.

---

## Step 5: Verify Output

After generation, print a summary:

```
=== Seed Data Generated ===
Scale: {scale}
Output: {target_path}/data/output/

| File | Rows | Size |
|------|------|------|
| REGIONS.csv | 13 | 1 KB |
| {PRIMARY}.csv | 100,000 | 12 MB |
| {SECONDARY}.csv | 400,000 | 48 MB |
| ...
| POLICY_DOCUMENTS.csv | 12 | 8 KB |

Total: {N} files, {X} MB
Ready for: python deploy/load_data.py
```

⚠️ STOPPING POINT: Verify data looks reasonable before loading. Spot-check:
- Regional distribution is skewed (not uniform)
- Dates span 2022–2026 with seasonal patterns
- PII columns have realistic format
- Text feedback has both sentiments (positive/negative mix)
- Completion rates vary by category (42–62% range)

---

## Step 6: Make the Script Executable

```bash
chmod +x {target_path}/scripts/generate_seed_data.py
```

Add to `docs/PLAN.md` the data generation step between S1 and the first `deploy.py --all`:

```
After S1: Run `python scripts/generate_seed_data.py` (SCALE=medium by default)
Then: `python deploy/deploy.py --all`
```

---

## Common Mistakes

- **Uniform distributions everywhere**. Real data is skewed — top region should be 3-5x larger than bottom. This makes Analytics page drill-downs actually interesting.
- **Flat temporal data**. Without seasonal variance, forecast and anomaly detection produce boring results.
- **All completion rates ~50%**. Vary by category (42–62%) AND by region. This was the #1 MISK demo realism issue.
- **Forgetting Arabic feedback text**. Cortex AI page needs Arabic content for sentiment/translate demos.
- **PII that looks fake**. Use realistic formats (10-digit national IDs, +966 phone numbers for KSA) so masking demo is convincing.
- **Missing POLICY_DOCUMENTS.csv**. Without it, the Cortex Search service has nothing to index — Policy Intelligence page is empty.
- **Non-deterministic randomness**. Always use `Random(42)` seed — reproducible data means consistent demo results across re-runs.
