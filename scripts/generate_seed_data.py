#!/usr/bin/env python3
"""
generate_seed_data.py — Synthetic data generator for platform demos.

Usage:
    SCALE=medium python scripts/generate_seed_data.py

Environment:
    SCALE: small (10K primary) | medium (100K) | large (500K)
    OUTPUT_DIR: override output path (default: ./data/output)

Output:
    Creates CSVs in data/output/ matching the DDL from deploy/scripts/02_ddl.sql.
    Ready for load_data.py to PUT + COPY INTO.

Dependencies: Python 3.10+ (stdlib only — no pip install needed)
"""

import csv
import os
import random
import string
from datetime import datetime, timedelta
from pathlib import Path

# --- Configuration ---
SCALE = os.getenv("SCALE", "medium")
OUTPUT_DIR = Path(os.getenv("OUTPUT_DIR", "./data/output"))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

SCALE_MAP = {"small": 0.02, "medium": 0.2, "large": 1.0}
MULTIPLIER = SCALE_MAP.get(SCALE, 0.2)

SEED = 42
RNG = random.Random(SEED)

print(f"=== Seed Data Generator ===")
print(f"Scale: {SCALE} (multiplier: {MULTIPLIER})")
print(f"Output: {OUTPUT_DIR.resolve()}")
print()


# --- Helpers ---

def rand_date(start_year=2022, end_year=2026):
    start = datetime(start_year, 1, 1)
    delta = (datetime(end_year, 6, 1) - start).days
    return (start + timedelta(days=RNG.randint(0, delta))).strftime("%Y-%m-%d")


def rand_timestamp(start_year=2022, end_year=2026):
    start = datetime(start_year, 1, 1)
    delta = int((datetime(end_year, 6, 1) - start).total_seconds())
    return (start + timedelta(seconds=RNG.randint(0, delta))).strftime("%Y-%m-%d %H:%M:%S")


def rand_id(prefix="", length=8):
    return prefix + "".join(RNG.choices(string.ascii_uppercase + string.digits, k=length))


def weighted_choice(items, weights):
    return RNG.choices(items, weights=weights, k=1)[0]


def write_csv(filename, headers, rows):
    path = OUTPUT_DIR / filename
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)
    size_mb = path.stat().st_size / (1024 * 1024)
    print(f"  {filename}: {len(rows):>10,} rows  ({size_mb:.1f} MB)")
    return len(rows)


# --- Regional Distribution (skewed — NOT uniform) ---
REGIONS = [
    ("REG001", "Region A", 0.22),
    ("REG002", "Region B", 0.15),
    ("REG003", "Region C", 0.12),
    ("REG004", "Region D", 0.10),
    ("REG005", "Region E", 0.09),
    ("REG006", "Region F", 0.08),
    ("REG007", "Region G", 0.07),
    ("REG008", "Region H", 0.05),
    ("REG009", "Region I", 0.04),
    ("REG010", "Region J", 0.03),
    ("REG011", "Region K", 0.02),
    ("REG012", "Region L", 0.015),
    ("REG013", "Region M", 0.015),
]

REGION_IDS = [r[0] for r in REGIONS]
REGION_WEIGHTS = [r[2] for r in REGIONS]

# --- Categories (replace with domain-specific) ---
CATEGORIES = [f"Category_{i:03d}" for i in range(1, 151)]
CATEGORY_WEIGHTS = [max(0.1, 1.0 - i * 0.006) for i in range(150)]

# --- Month weights (seasonal variance) ---
MONTH_WEIGHTS = [1.0, 0.9, 1.1, 1.2, 0.8, 0.6, 0.5, 0.7, 1.0, 1.1, 1.2, 1.3]

# --- Feedback templates ---
FEEDBACK_EN = [
    "Excellent experience. Highly recommend.",
    "Good overall, but could improve communication.",
    "Average. Met basic expectations.",
    "Below expectations. Slow response times.",
    "Very disappointed. Will not return.",
    "Outstanding service. Exceeded all expectations.",
    "Satisfactory. Nothing exceptional but no complaints.",
    "The process was smooth and efficient.",
    "Needs significant improvement in all areas.",
    "Decent experience, good value for the cost.",
]

FEEDBACK_AR = [
    "تجربة ممتازة. أنصح بها بشدة.",
    "جيدة بشكل عام لكن يمكن تحسين التواصل.",
    "متوسطة. حققت التوقعات الأساسية.",
    "أقل من التوقعات. أوقات استجابة بطيئة.",
    "محبط جداً. لن أعود مرة أخرى.",
    "خدمة متميزة. تجاوزت كل التوقعات.",
    "مرضية. لا شيء استثنائي لكن بدون شكاوى.",
    "العملية كانت سلسة وفعالة.",
    "تحتاج تحسين كبير في جميع المجالات.",
    "تجربة لائقة، قيمة جيدة مقابل التكلفة.",
]


# ============================================================
# GENERATE TABLES
# ============================================================

total_rows = 0

# --- Regions (reference table — fixed size) ---
rows = [(r[0], r[1], f"Description for {r[1]}") for r in REGIONS]
total_rows += write_csv("REGIONS.csv", ["region_id", "region_name", "description"], rows)

# --- Categories (reference table) ---
rows = [(f"CAT{i:03d}", cat, f"Category description {i}", weighted_choice(["Active", "Inactive"], [0.9, 0.1]))
        for i, cat in enumerate(CATEGORIES, 1)]
total_rows += write_csv("CATEGORIES.csv", ["category_id", "category_name", "description", "status"], rows)

# --- Primary Entity (e.g. Customers/Students/Patients) ---
PRIMARY_COUNT = int(500_000 * MULTIPLIER)
rows = []
for i in range(PRIMARY_COUNT):
    region = weighted_choice(REGION_IDS, REGION_WEIGHTS)
    category = weighted_choice(CATEGORIES, CATEGORY_WEIGHTS)
    rows.append((
        rand_id("PRI"),
        f"Entity_{i:07d}",
        region,
        category,
        rand_date(2020, 2025),
        RNG.choice(["Active", "Inactive", "Pending"]),
        round(RNG.uniform(0, 100), 2),
    ))
total_rows += write_csv("PRIMARY_ENTITY.csv",
    ["entity_id", "name", "region_id", "category", "registration_date", "status", "score"], rows)

# --- Secondary Entity (e.g. Orders/Enrollments — 4x primary) ---
SECONDARY_COUNT = int(PRIMARY_COUNT * 4)
rows = []
for i in range(SECONDARY_COUNT):
    entity_id = f"PRI{RNG.choice(rows[:PRIMARY_COUNT])[0][3:]}" if PRIMARY_COUNT > 0 else rand_id("PRI")
    # Vary completion by month (seasonal)
    date = rand_date(2022, 2026)
    month = int(date.split("-")[1])
    completion_base = 0.52 + RNG.uniform(-0.10, 0.10)
    completed = RNG.random() < (completion_base * MONTH_WEIGHTS[month - 1] / 1.0)
    rows.append((
        rand_id("SEC"),
        rand_id("PRI"),
        rand_id("PRG"),
        date,
        "completed" if completed else RNG.choice(["in_progress", "dropped", "pending"]),
        round(RNG.uniform(50, 100), 1) if completed else None,
    ))
total_rows += write_csv("SECONDARY_ENTITY.csv",
    ["record_id", "entity_id", "program_id", "start_date", "status", "final_score"], rows)

# --- Feedback (text — 10% of primary, mix EN/AR) ---
FEEDBACK_COUNT = int(PRIMARY_COUNT * 0.1)
rows = []
for i in range(FEEDBACK_COUNT):
    is_arabic = RNG.random() < 0.3
    text = RNG.choice(FEEDBACK_AR if is_arabic else FEEDBACK_EN)
    sentiment = "positive" if any(w in text.lower() for w in ["excellent", "outstanding", "good", "ممتاز", "متميز"]) else \
                "negative" if any(w in text.lower() for w in ["disappointed", "below", "محبط"]) else "neutral"
    rows.append((
        rand_id("FB"),
        rand_id("PRI"),
        text,
        sentiment,
        RNG.randint(1, 5),
        rand_timestamp(),
    ))
total_rows += write_csv("FEEDBACK.csv",
    ["feedback_id", "entity_id", "text", "sentiment", "rating", "submitted_at"], rows)

# --- Policy Documents (for Cortex Search) ---
POLICY_DOCS = [
    ("policy_001", "Data Governance Policy", "governance", "Section 1", "All data assets are classified as: PUBLIC, INTERNAL, CONFIDENTIAL, RESTRICTED. Access control requires manager approval for CONFIDENTIAL and above."),
    ("policy_002", "Data Retention Policy", "governance", "Section 2", "Operational data retained 7 years. Archived data retained 15 years. Backup data retained 90 days."),
    ("policy_003", "Access Control Policy", "internal", "Section 1", "Principle of Least Privilege. All users granted minimum access required. Quarterly access reviews mandatory."),
    ("policy_004", "Incident Response Policy", "internal", "Section 2", "All data breaches reported to DPO within 24 hours. Regulatory authority notified within 72 hours for breaches affecting 100+ individuals."),
    ("policy_005", "Data Processing Principles", "regulatory", "Article 5", "Personal data processed lawfully, fairly, transparently. Collected for specified legitimate purposes. Adequate, relevant, limited to necessity."),
    ("policy_006", "Rights of Data Subjects", "regulatory", "Article 13-16", "Right of access. Right to rectification. Right to erasure. Right to data portability. Right to restrict processing."),
    ("policy_007", "Cross-Border Transfer", "regulatory", "Article 29", "Data transfer outside jurisdiction requires adequate protection level, contract necessity, or explicit consent."),
    ("policy_008", "Sensitive Data Processing", "regulatory", "Article 9", "Sensitive data (health, biometric, financial, criminal) requires explicit consent or clearly defined legitimate purpose."),
    ("policy_009", "Data Minimization", "regulatory", "Article 11", "Controller ensures personal data collected is limited to what is necessary for stated purpose."),
    ("policy_010", "Security Measures", "regulatory", "Article 32", "Implement appropriate technical measures: pseudonymisation, encryption, confidentiality, availability, regular testing."),
    ("policy_011", "Breach Notification", "regulatory", "Article 34", "Communication to data subjects without undue delay when breach likely results in high risk to rights and freedoms."),
    ("policy_012", "Data Protection Officer", "internal", "Section 5", "Organization designates DPO responsible for monitoring compliance, providing advice, cooperating with supervisory authority."),
]
rows = [(d[0], d[1], d[2], d[3], d[4]) for d in POLICY_DOCS]
total_rows += write_csv("POLICY_DOCUMENTS.csv",
    ["doc_id", "doc_name", "doc_type", "section", "content"], rows)


# ============================================================
print(f"\n{'='*50}")
print(f"Total: {total_rows:,} rows across all tables")
print(f"Output: {OUTPUT_DIR.resolve()}")
print(f"\nNext: python deploy/load_data.py")
