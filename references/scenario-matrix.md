# Scenario Matrix
| Document AI | MEDIUM | "Parse supplier invoices — extract line items, PO numbers automatically" | AP automation |
| Cortex Agent | HIGH | "Category managers ask about both GDPR rules AND sales data" | Self-service |
| Notebooks | MEDIUM | "Demand forecasters work in notebooks — live connection to order data" | Forecasting |
| Iceberg Tables | MEDIUM | "Clickstream data in open format — accessible by marketing tools" | CDP |
| Streaming | HIGH | "Real-time order events — inventory updates in sub-second" | Stock mgmt |
| Tasks + Streams | HIGH | "Only stock-below-threshold events trigger replenishment orders" | Automation || Document AI | MEDIUM | "Parse customer contracts — extract terms, SLAs, renewal dates" | Contract mgmt |
| Cortex Agent | HIGH | "NOC engineers ask about both regulations AND network performance" | Operations |
| Notebooks | MEDIUM | "Churn modelers iterate in notebooks — connected to live CDR data" | Data science |
| Iceberg Tables | HIGH | "CDR data in open format — query from Snowflake OR Spark without copies" | Data lake |
| Streaming | MUST | "CDR ingestion at millions of events/second — real-time network monitoring" | Core workload |
| Tasks + Streams | MUST | "Only network anomalies trigger incident creation — event-driven NOC" | Automation || Document AI | MEDIUM | "Parse safety inspection reports — extract findings automatically" | HSE compliance |
| Cortex Agent | MEDIUM | "Engineers ask about both HSE regulations AND production data" | Operational |
| Notebooks | MEDIUM | "Reservoir engineers run models in Snowflake — connected to live SCADA" | Engineering |
| Iceberg Tables | HIGH | "Sensor data in open format — accessible by Spark, Databricks, Snowflake" | Data lake |
| Streaming | MUST | "Real-time sensor ingestion — millions of readings per day, sub-second" | IoT/SCADA |
| Tasks + Streams | MUST | "Only pressure anomalies trigger maintenance workflows — event-driven" | Predictive maintenance || Document AI | MUST | "Parse clinical notes, lab reports, referral letters — structured extraction" | Clinical docs |
| Cortex Agent | HIGH | "Clinicians ask about both HIPAA rules AND patient data in one interface" | Multi-source |
| Notebooks | HIGH | "Clinical data scientists build models in Snowflake — PHI never leaves" | Governance |
| Iceberg Tables | MEDIUM | "Research data in open format — interoperable with external tools" | Multi-engine |
| Streaming | MEDIUM | "Real-time vital signs ingestion from IoT devices" | Patient monitoring |
| Tasks + Streams | MEDIUM | "Alert pipeline — only abnormal readings trigger downstream processing" | Clinical alerts || Document AI | MUST | "Parse invoices, contracts, KYC docs — extract structured data automatically" | Document volume |
| Cortex Agent | HIGH | "Compliance officer asks about both regulations AND customer data in one chat" | Multi-source |
| Notebooks | MEDIUM | "Risk modelers work in notebooks — connected to live data, governed" | Model development |
| Iceberg Tables | HIGH | "Open format for multi-engine access — Spark + Snowflake on same data" | No lock-in |
| Streaming | HIGH | "Real-time transaction monitoring — sub-second fraud detection pipeline" | Fraud detection |
| Tasks + Streams | HIGH | "Only new transactions trigger risk scoring — zero wasted compute" | Cost efficiency || Document AI | MEDIUM | "Parse citizen documents — extract data without manual entry" | Form processing |
| Cortex Agent | HIGH | "One AI interface for both regulations and citizen data" | Multi-source Q&A |
| Notebooks | OPTIONAL | "Data analysts work in notebooks — inside Snowflake" | Analytics workflow |
| Iceberg Tables | OPTIONAL | "Open format compliance for data sovereignty" | No lock-in |
| Streaming | MEDIUM | "Real-time citizen service tracking — sub-second ingestion" | Service SLAs |
| Tasks + Streams | MEDIUM | "Event-driven case processing — only new applications trigger workflows" | Automation |
Maps industry verticals to prioritized Snowflake demo scenarios. Used by:
- `sub-skills/plan/SKILL.md` — to assign pages to Session 3 (core) vs Session 4 (advanced)
- `sub-skills/demo-script/SKILL.md` — to order scenarios and write industry-specific talking points
- `sub-skills/generate/SKILL.md` — to determine which predefined questions to use in Ask {Name} and Policy Intelligence pages

Priority levels:
- **MUST** — lead with this; critical for the story
- **HIGH** — include in every demo
- **MEDIUM** — include if time permits
- **OPTIONAL** — background capability, mention if asked

---

## Session Assignment

### Always Session 3 (Core — 8 pages)
Regardless of industry, these 8 pages are built in Session 3:

| Page | Rationale |
|---|---|
| Platform Overview | Foundation — "single source of truth" hook |
| Performance at Scale | Universal pain point — speed and scale |
| Analytics Dashboards | Business value — interactive insights |
| Time Travel | Unique to Snowflake — high wow factor |
| Disaster Recovery | Risk mitigation — resonates with all buyers |
| Data Lineage | Governance — resonates with data teams |
| Data Quality | Governance — resonates with data teams |
| Ask {Name} (Cortex Analyst) | AI differentiator — closes every demo |

### Always Session 4 (Advanced — 9 pages)
All advanced pages are built in Session 4. Industry drives their **demo order** in Session 5 (DEMO_SCRIPT.md), not whether they're built.

| Page | Notes |
|---|---|
| Architecture | Always first in S4 — static page, quick to build |
| ML & Predictive AI | |
| Cortex AI (NLP) | |
| Query Optimization | |
| Cost & Pricing | |
| Dynamic Tables | |
| Data Masking | Regulatory framing varies by country |
| Data Classification | Regulatory labels vary by country |
| Policy Intelligence | Cortex Search docs vary by regulatory_context |
| Document AI | Parse invoices/contracts — high for Finance/Healthcare |
| Cortex Agent | Multi-tool AI agent — Analyst + Search combined |
| Notebooks | Data science workflow — visual, mostly static |
| Iceberg Tables | Open format — high for enterprises with multi-engine |
| Streaming (Snowpipe) | Real-time ingestion — high for Telecom/IoT/Energy |
| Tasks + Streams | CDC pipelines — complements Dynamic Tables |

---

## Scenario Priority Matrix

### Government

| Scenario | Priority | Talking Point Theme | Why |
|---|---|---|---|
| Architecture | MUST | "Every system your ministry uses — unified" | Executive audience needs the big picture |
| Policy Intelligence | MUST | "Ask any regulation question in natural language" | Compliance is a daily pain point |
| Data Classification | MUST | "Auto-classify all data as CONFIDENTIAL / RESTRICTED" | Data sovereignty and classification laws |
| Data Masking | MUST | "Citizen national IDs masked by default — regulation compliant" | PDPL/GDPR mandatory |
| Lineage | HIGH | "Full audit trail for any published statistic" | Parliamentary accountability |
| Time Travel | HIGH | "Reconstruct data as of any historical date for audits" | Audit and reconciliation |
| Platform Overview | MUST | "Single source of truth for all citizen services" | Data silos across ministries |
| Ask {Name} | MUST | "Any official can ask questions without SQL" | Self-service for policy teams |
| Performance | HIGH | "National-scale queries in seconds" | Scale of national data |
| Quality | HIGH | "Automated quality monitoring — 24/7" | Data integrity for decisions |
| Dynamic Tables | MEDIUM | "Service KPIs refresh automatically — no pipeline code" | Reporting automation |
| ML/AI | MEDIUM | "Predict service demand, detect anomalies in incident reports" | Operational forecasting |
| Cortex AI | MEDIUM | "Sentiment analysis on citizen feedback in Arabic" | Arabic NLP (KSA relevant) |
| Optimization | OPTIONAL | "Pay only for what you run" | Budget justification |
| Pricing | OPTIONAL | "Transparent cost model" | Budget justification |
| Recovery | HIGH | "Zero-downtime recovery — no DBA needed" | Business continuity |

**Lead scenario for Government**: Policy Intelligence → Data Classification → Data Masking → Lineage → Ask {Name}

---

### Finance (Banking / Insurance / Fintech)

| Scenario | Priority | Talking Point Theme | Why |
|---|---|---|---|
| Data Masking | MUST | "Account numbers, national IDs masked by default — PDPL/GDPR compliant" | Regulatory compliance non-negotiable |
| Data Classification | MUST | "Auto-discover all PII across your entire data estate" | GDPR/PDPL Article 30 data inventory |
| Policy Intelligence | MUST | "Ask any compliance question — instant regulatory guidance" | Daily compliance burden |
| Performance | MUST | "10M+ transactions queried in milliseconds" | Core financial workload |
| ML/AI | MUST | "Fraud detection, churn prediction, credit risk — built-in ML" | Revenue and risk impact |
| Lineage | HIGH | "Audit trail for every risk model and regulatory report" | Model governance / SR 11-7 |
| Time Travel | HIGH | "Reconstruct any account state at any past moment" | SOX, audit requirements |
| Ask {Name} | MUST | "Risk officers ask questions without SQL" | Self-service analytics |
| Dynamic Tables | HIGH | "Risk scores refresh automatically — no batch jobs" | Real-time risk management |
| Quality | HIGH | "Data quality monitoring on transaction data — catch anomalies early" | Data accuracy for risk models |
| Optimization | MEDIUM | "Result cache means repeated risk queries cost zero" | Cost efficiency |
| Pricing | MEDIUM | "Pay-per-use — no license cost for unused capacity" | TCO comparison |
| Cortex AI | MEDIUM | "Sentiment on customer feedback — NLP built-in" | Customer experience |
| Architecture | HIGH | "From core banking to ML to BI — one platform" | Anti-data-silo story |

**Lead scenario for Finance**: Data Masking → Data Classification → Policy Intelligence → ML/AI → Ask {Name}

---

### Healthcare

| Scenario | Priority | Talking Point Theme | Why |
|---|---|---|---|
| Data Masking | MUST | "Patient IDs, diagnoses masked — HIPAA/PDPL compliant" | PHI protection mandatory |
| Data Classification | MUST | "Auto-classify PHI across your EHR data estate" | HIPAA compliance |
| Policy Intelligence | MUST | "Ask any HIPAA or clinical protocol question" | Compliance guidance |
| ML/AI | MUST | "Predict readmission risk, detect anomalies in vitals" | Clinical outcomes impact |
| Quality | MUST | "Data quality on patient data — catch errors before clinical decisions" | Patient safety |
| Lineage | HIGH | "Trace any clinical metric back to source — full audit trail" | FDA/regulatory audit |
| Time Travel | HIGH | "Reconstruct patient record state at any historical date" | Medical record audits |
| Ask {Name} | HIGH | "Clinicians and managers ask questions without SQL" | Self-service for clinical staff |
| Dynamic Tables | MEDIUM | "Care pathway KPIs refresh automatically" | Operational efficiency |
| Performance | HIGH | "10M+ patient records queried in seconds" | Scale of health systems |
| Cortex AI | MEDIUM | "Sentiment on patient feedback — identify satisfaction trends" | Patient experience |

**Lead scenario for Healthcare**: Data Masking → ML/AI → Data Classification → Quality → Policy Intelligence

---

### Energy (Oil & Gas / Utilities)

| Scenario | Priority | Talking Point Theme | Why |
|---|---|---|---|
| Performance | MUST | "10M+ sensor readings / production records queried in seconds" | Core operational workload |
| Analytics | MUST | "Regional production performance, asset KPIs — drill to individual well" | Operations visibility |
| Dynamic Tables | MUST | "Production KPIs refresh automatically — no ETL pipelines" | Real-time operations |
| Quality | MUST | "Data quality on sensor data — catch anomalies before incidents" | HSE and reliability |
| Lineage | HIGH | "Trace any production report back to the SCADA source" | Audit and compliance |
| Policy Intelligence | HIGH | "Ask any HSE regulation question — instant guidance" | Safety compliance |
| ML/AI | HIGH | "Predictive maintenance — detect equipment anomalies before failure" | Cost and safety |
| Optimization | HIGH | "Query optimization for large time-series workloads" | Cost efficiency |
| Data Classification | MEDIUM | "Classify operational data as RESTRICTED / SENSITIVE" | Data governance |
| Data Masking | MEDIUM | "Employee IDs masked for external reporting" | Privacy compliance |
| Time Travel | HIGH | "Reconstruct production data as of any historical date — incident analysis" | Root cause analysis |

**Lead scenario for Energy**: Performance → Analytics → ML/AI (predictive maintenance) → Dynamic Tables → Policy Intelligence

---

### Telecom

| Scenario | Priority | Talking Point Theme | Why |
|---|---|---|---|
| ML/AI | MUST | "Churn prediction — built-in ML, no external platform" | Revenue retention |
| Analytics | MUST | "Network performance, subscriber KPIs — drill to individual cell/subscriber" | Operations and marketing |
| Cortex AI | MUST | "Sentiment on support tickets — NLP built-in" | Customer experience |
| Dynamic Tables | MUST | "Churn scores and network KPIs refresh automatically" | Real-time operations |
| Performance | HIGH | "Billions of CDRs queried in seconds" | Core data scale |
| Data Masking | HIGH | "MSISDN (phone numbers) masked — PDPL/GDPR compliant" | Privacy compliance |
| Policy Intelligence | HIGH | "Ask any telecom regulation question" | Regulatory compliance |
| Optimization | MEDIUM | "Repeated network queries hit result cache — zero cost" | Cost efficiency |
| Ask {Name} | MUST | "Marketing and operations ask questions without SQL" | Self-service |
| Quality | MEDIUM | "Data quality on CDR data — catch rating errors early" | Revenue assurance |

**Lead scenario for Telecom**: ML/AI → Analytics → Cortex AI → Dynamic Tables → Ask {Name}

---

### Retail / E-Commerce

| Scenario | Priority | Talking Point Theme | Why |
|---|---|---|---|
| Analytics | MUST | "Sales performance, inventory, customer LTV — drill to product/store" | Core retail analytics |
| ML/AI | MUST | "Predict churn, recommend products, classify customer segments" | Revenue and engagement |
| Cortex AI | HIGH | "Sentiment on product reviews — NLP built-in" | Product and CX insights |
| Dynamic Tables | MUST | "Loyalty scores and inventory KPIs refresh automatically" | Real-time personalization |
| Performance | HIGH | "Millions of orders queried in seconds" | Scale |
| Data Masking | HIGH | "Customer emails, addresses masked — GDPR/PDPL compliant" | Privacy compliance |
| Ask {Name} | MUST | "Category managers ask questions without SQL" | Self-service |
| Policy Intelligence | MEDIUM | "Ask any GDPR data subject rights question" | Compliance guidance |
| Quality | MEDIUM | "Data quality on order data — catch duplicate orders early" | Revenue integrity |

**Lead scenario for Retail**: Analytics → ML/AI → Cortex AI → Dynamic Tables → Ask {Name}

---

## Predefined Questions by Vertical (for Ask {Name} page)

### Government
```
How many service requests were submitted in each region last quarter?
What is the average resolution time for building permit applications?
Which service type has the highest citizen satisfaction score?
How many citizens submitted applications for the first time this year?
What percentage of applications were resolved within the SLA?
Show me the top 5 regions by number of unresolved requests.
How did service request volume change year over year?
Which officer teams have the highest case closure rate?
```

### Finance
```
What was the total transaction volume processed last month?
Which customer segments have the highest default risk score?
Show me accounts with no activity in the past 90 days.
What is the average time to approve a loan application?
Which products have the highest customer churn rate?
How did fraud detection rates change in the last 6 months?
What percentage of customers are classified as high risk?
Show me the top 10 customers by total assets under management.
```

### Healthcare
```
How many patients were admitted last month by diagnosis category?
What is the average length of stay for cardiovascular patients?
Which care program has the highest readmission rate?
How many patients missed their follow-up appointment?
What is the no-show rate trend over the last 12 months?
Which physicians have the highest patient satisfaction scores?
How many new patients enrolled in diabetes management programs this quarter?
What percentage of diagnoses are associated with preventable conditions?
```

### Energy
```
What was total production volume across all wells last month?
Which assets had the most downtime hours in the past quarter?
Show me wells with production below 80% of forecast.
What is the average time between scheduled and unscheduled maintenance?
Which region has the highest safety incident rate?
How did production efficiency change year over year?
What percentage of assets are due for maintenance in the next 30 days?
Show me the top 10 highest-producing assets this year.
```

### Telecom
```
How many subscribers churned last month by region?
What is the average revenue per user for 5G subscribers?
Which network cells had the most outage incidents this quarter?
Show me subscribers who downgraded their plan in the last 30 days.
What percentage of support tickets are resolved within 24 hours?
How did data usage trend over the last 6 months?
Which subscriber segments have the highest churn risk score?
Show me the top 10 highest-value subscribers by ARPU.
```

### Retail
```
What was total revenue by product category last month?
Which products have the highest return rate?
Show me customers who haven't purchased in 90 days.
What is the average order value trend over the last quarter?
Which store locations have the highest inventory turnover?
How did customer acquisition change year over year?
What percentage of customers are in the loyalty program?
Show me the top 10 best-selling products this year.
```
