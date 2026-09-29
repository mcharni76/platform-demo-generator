---
name: platform-demo-data-gen
description: "Interactive synthetic seed data generator for platform demos. Walks the user through entity naming, regional config, scale selection, and data preview before committing. Outputs domain-realistic CSVs ready for load_data.py."
---

# Data Generation -- Interactive Synthetic Seed Data

Generates realistic synthetic CSV files for the demo's data domain. This sub-skill is **interactive** -- it walks the user through confirming domain names, regions, and scale before generating, and shows a preview after.

Run this after Session 1 (infrastructure) creates the DDL, so the CSVs match the table schemas exactly.

---

## Step 1: Confirm Domain Entities (ask_user_question)

Read `references/data-domain-templates.md` for the `{industry}` vertical. Present the entity mapping to the user for confirmation:

```json
{
  "questions": [
    {
      "header": "Entities",
      "question": "I'll generate synthetic data for these domain entities. Confirm or edit the names:",
      "type": "text",
      "defaultValue": "{entity_list_from_data_domain_templates, comma-separated}"
    }
  ]
}
```

The user can rename entities to match their customer's actual terminology (e.g., "BENEFICIARIES" -> "POLICY_HOLDERS" for insurance).

---

## Step 2: Confirm Regions (ask_user_question)

Regions must be country-specific, not generic. Present the default region list for the customer's country:

```json
{
  "questions": [
    {
      "header": "Regions",
      "question": "Which regions should appear in the data? (These drive the Analytics drill-down and geographic charts)",
      "type": "text",
      "defaultValue": "{country_specific_regions}"
    }
  ]
}
```

Default region lists by country:

| Country | Regions |
|---------|---------|
| Saudi Arabia | Riyadh, Eastern Province, Makkah, Madinah, Asir, Tabuk, Hail, Jazan, Najran, Al-Baha, Northern Borders, Al-Jouf, Qassim |
| UAE | Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah |
| Egypt | Cairo, Giza, Alexandria, Qalyubia, Dakahlia, Sharqia, Gharbia, Monufia, Beheira, Port Said |
| Jordan | Amman, Irbid, Zarqa, Balqa, Mafraq, Karak, Tafilah, Ma'an, Ajloun, Jerash, Madaba, Aqaba |
| USA | California, Texas, New York, Florida, Illinois, Pennsylvania, Ohio, Georgia, Michigan, North Carolina |
| UK | London, South East, North West, East of England, West Midlands, South West, Yorkshire, East Midlands, North East, Scotland |
| Generic | Region 1-10 (user should customize) |

---

## Step 3: Confirm Scale and Data Profile (ask_user_question)

```json
{
  "questions": [
    {
      "header": "Scale",
      "question": "How much data should we generate?",
      "multiSelect": false,
      "options": [
        {"label": "Small (10K primary)", "description": "~100K total rows. Fast iteration, quick deploys. Good for development."},
        {"label": "Medium (100K primary)", "description": "~2M total rows. Realistic demo feel. Performance page shows meaningful benchmark."},
        {"label": "Large (500K primary)", "description": "~10M total rows. Impressive benchmark numbers. Takes longer to generate and load."}
      ]
    },
    {
      "header": "Categories",
      "question": "What are the main categories/types in this domain? (e.g., for healthcare: Cardiology, Oncology, Pediatrics...)",
      "type": "text",
      "defaultValue": "{industry_default_categories}"
    }
  ]
}
```

Default categories by industry:

| Industry | Categories |
|----------|-----------|
| Healthcare | Cardiology, Oncology, Pediatrics, Orthopedics, Neurology, Obstetrics, Emergency, Dermatology, Radiology, Psychiatry, Internal Medicine, General Surgery |
| Finance | Savings, Checking, Credit Card, Personal Loan, Mortgage, Investment, Insurance, Business Account, Foreign Exchange, Trade Finance |
| Government | Building Permits, Business Licenses, Citizen Services, Public Safety, Environmental, Transportation, Education, Health Services, Social Services, Planning |
| Energy | Crude Production, Gas Production, Refining, Distribution, Maintenance, Safety, Environmental, Logistics, Drilling, Reservoir |
| Telecom | Prepaid, Postpaid, 5G, Fiber, Enterprise, Roaming, Data-Only, IoT, Wholesale, MVNO |
| Retail | Electronics, Clothing, Groceries, Home & Garden, Sports, Beauty, Toys, Automotive, Books, Jewelry |
| Education | Engineering, Business, Medicine, Arts, Science, Law, Education, IT, Architecture, Agriculture |
| Logistics | Express, Standard, Freight, Cold Chain, Hazmat, Last-Mile, Cross-Border, Returns, Warehousing, Fulfillment |

---

## Step 4: Generate the Script

Create `{target_path}/scripts/generate_seed_data.py` using the confirmed entity names, regions, categories, and scale. The generated script MUST include:

### Mandatory data realism rules

1. **Country-specific regions** with skewed distribution (top region 3-5x larger than bottom):
   ```python
   REGIONS = [
       ("REG001", "Riyadh", 0.22),
       ("REG002", "Eastern Province", 0.15),
       ("REG003", "Makkah", 0.12),
       # ... actual region names from Step 2
   ]
   ```

2. **Domain-specific categories** with non-uniform distribution:
   ```python
   CATEGORIES = ["Cardiology", "Oncology", "Pediatrics", ...]  # from Step 3
   ```

3. **Realistic entity names** using domain-appropriate patterns:
   ```python
   # Healthcare: culturally appropriate names for the customer's country
   # KSA/GCC: Arabic names. Morocco/Tunisia: French + Arabic. Turkey: Turkish. etc.
   FIRST_NAMES = ["Mohammed", "Ahmed", "Fatima", "Sara", ...]  # adapted per country
   LAST_NAMES = ["Al-Rashid", "Al-Qahtani", ...]  # adapted per country
   ```

4. **PII columns** (critical for Data Masking page):
   ```python
   def fake_national_id(): return f"{RNG.randint(1,2)}{RNG.randint(10,99)}{RNG.randint(1000000,9999999)}"
   def fake_email(first, last): return f"{first.lower()}.{last.lower()}@{RNG.choice(['gmail.com','outlook.com','company.sa'])}"
   def fake_phone(): return f"+966{RNG.randint(500000000,599999999)}"
   ```

5. **Valid foreign keys** (every secondary entity FK references a real primary entity ID):
   ```python
   primary_ids = [row[0] for row in primary_rows]
   for i in range(SECONDARY_COUNT):
       entity_id = RNG.choice(primary_ids)  # MUST reference existing primary
   ```

6. **Seasonal temporal patterns** (for Forecast page):
   ```python
   MONTH_WEIGHTS = [1.0, 0.9, 1.1, 1.2, 0.8, 0.6, 0.5, 0.7, 1.0, 1.1, 1.2, 1.3]
   # Generate dates weighted by month
   ```

7. **Anomaly injection** (for Anomaly Detection page -- 3-5 spikes):
   ```python
   ANOMALY_MONTHS = [(2024, 3), (2024, 7), (2025, 1)]  # 3 months with anomalies
   # During anomaly months: 3x normal volume + 20% higher scores
   ```

8. **ML classification target** (for Classification page):
   ```python
   # Completion/churn/risk varies by category AND region (not random)
   # High-risk categories: lower completion, higher dropout
   # Low-risk categories: higher completion, lower dropout
   category_risk = {cat: RNG.uniform(0.3, 0.7) for cat in CATEGORIES}
   ```

9. **Completion rates vary by category AND region** (42-62% range, correlated):
   ```python
   base_rate = category_risk[category]  # 0.3-0.7 from above
   region_modifier = REGION_COMPLETION_BIAS[region]  # +/- 0.05
   completed = RNG.random() < (base_rate + region_modifier)
   ```

10. **50+ feedback templates** (for Cortex AI sentiment diversity):
    ```python
    FEEDBACK_EN = [
        # Positive (15+ templates)
        "Exceptional {category} service. The {entity} process was seamless.",
        "Very impressed with the {category} team. Professional and efficient.",
        "Best experience I've had. The {aspect} was outstanding.",
        # ... 12 more positive
        # Neutral (10+ templates)
        "The {category} service met basic expectations. Nothing exceptional.",
        "Average {aspect}. Could be improved with better communication.",
        # ... 8 more neutral
        # Negative (10+ templates)
        "Disappointed with the {category} service. Long wait times.",
        "Below expectations. The {aspect} needs significant improvement.",
        # ... 8 more negative
    ]
    FEEDBACK_SECONDARY = [
        # 30+ templates in the customer's secondary language
        # Arabic (ar): "البرنامج كان ممتازاً..."
        # French (fr): "Le programme était excellent..."
        # Turkish (tr): "Program mükemmeldi..."
        # Adapt per language from intake
    ]
    ```

11. **Regulatory documents from data-domain-templates.md** (not generic):
    ```python
    # Read the actual PDPL/GDPR/HIPAA content from the reference
    # The script must use the regulatory_context to select the right docs
    ```

---

## Step 5: Run and Preview (interactive)

After generating the script, run it and show the user a preview:

```bash
cd {target_path}
SCALE={scale} python scripts/generate_seed_data.py
```

Then show the user a summary AND sample rows:

```json
{
  "questions": [
    {
      "header": "Data preview",
      "question": "Here's what was generated. Does this look realistic for {customer_name}?\n\n{summary_table}\n\nSample primary entity rows:\n| name | region | category | status | score |\n|------|--------|----------|--------|-------|\n| {row1} |\n| {row2} |\n| {row3} |\n\nSample feedback:\n- EN: \"{sample_en}\"\n- {secondary_lang}: \"{sample_secondary}\"\n\nApprove or regenerate?",
      "multiSelect": false,
      "options": [
        {"label": "Looks good, proceed", "description": "Load this data into Snowflake"},
        {"label": "Regenerate with changes", "description": "I'll tell you what to adjust"},
        {"label": "Change scale", "description": "Generate at a different scale"}
      ]
    }
  ]
}
```

If "Regenerate" -- ask what to change, update the script, re-run.
If "Change scale" -- re-run with different SCALE env var.
If "Looks good" -- proceed to load.

---

## Step 6: Load Data

```bash
cd {target_path}
python deploy/load_data.py
```

Show the user the load results (rows loaded per table, any errors).

---

## Common Mistakes

- **Generic region names (Region A, Region B)**. Use the actual country's regions. "Riyadh 22%" is convincing; "Region A 22%" is not.
- **Generic entity names (Entity_0000001)**. Use culturally appropriate names for the customer's country.
- **Uniform distributions everywhere**. Real data is skewed -- top region should be 3-5x larger than bottom.
- **Flat temporal data**. Without seasonal variance, forecast and anomaly detection produce boring results.
- **No anomaly injection**. Anomaly detection needs actual anomalies (3-5 spikes) to produce interesting results.
- **All completion rates ~50%**. Vary by category (42-62%) AND by region. This was the #1 MISK demo realism issue.
- **No PII columns**. Without national_id, email, phone -- the Data Masking page has nothing to mask.
- **Only 10 feedback templates**. Cortex AI on 10K rows with 10 templates looks obviously synthetic. Need 50+.
- **Missing POLICY_DOCUMENTS.csv**. Without it, the Cortex Search service has nothing to index.
- **Broken foreign keys**. Secondary entity IDs must reference actual primary entity IDs.
- **Non-deterministic randomness**. Always use `Random(42)` seed -- reproducible data means consistent demo results.
