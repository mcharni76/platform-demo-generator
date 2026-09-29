# Demo Pages Catalog

Capability catalog for the Platform Demo. Each page defines a Snowflake feature, backend endpoints, required tables, business benefit, and demo talking points. Pages are selected per customer during the research phase — not all pages are built for every demo.

---

## Page Catalog

### Page 0: architecture
| Field | Value |
|---|---|
| **Page ID** | `architecture` |
| **React File** | `PageArchitecture.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | Medallion Architecture / Full Platform |
| **Backend Endpoints** | **None — fully static** |
| **Required Tables** | None |
| **Business Benefit** | Executive overview of the full data journey from source to consumption |
| **Special** | Clickable layer nodes navigate via `{slug}:navigate` custom DOM event. LAYERS array has 7 tiers: Sources, Ingestion, Bronze, Silver, Gold, AI/ML, Consumption. Entity names in node labels must be replaced with domain entities. |
| **Demo Hook** | "Every node here is live and clickable — this isn't a diagram, it's a map of your actual data platform." |

---

### Page 1: platform
| Field | Value |
|---|---|
| **Page ID** | `platform` |
| **React File** | `PagePlatform.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | Unified Data Platform |
| **Backend Endpoints** | `GET /api/platform/kpis`, `GET /api/platform/stats`, `GET /api/platform/warehouse` |
| **Required Tables** | `{PRIMARY_ENTITY}`, `{SECONDARY_ENTITY}`, `{TERTIARY_ENTITY}` |
| **Business Benefit** | Single source of truth — row counts, active records, platform stats |
| **Demo Hook** | "One platform — your {entity} data, your {entity2} data, your {entity3} data — all in one place, no silos." |

---

### Page 2: performance
| Field | Value |
|---|---|
| **Page ID** | `performance` |
| **React File** | `PagePerformance.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | Elastic Compute / Virtual Warehouses |
| **Backend Endpoints** | `GET /api/performance/benchmark`, `GET /api/performance/compare`, `GET /api/performance/completion-rates`, `GET /api/performance/top-programs` |
| **Required Tables** | Largest domain entity (millions of rows) |
| **Business Benefit** | Query 10M+ records in seconds; cold vs warm cache comparison; warehouse size reference |
| **Special** | `QUERY_META` business value per query (shown as callout). Cold/Warm badge. Size Reference table comparing X-Small → 2X-Large credits/hour. |
| **Demo Hook** | "{X}M {entity} records queried in {N} seconds — no pre-aggregation, no materialized view." |

---

### Page 3: analytics
| Field | Value |
|---|---|
| **Page ID** | `analytics` |
| **React File** | `PageAnalytics.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | Window Functions, PIVOT, H3 Geospatial |
| **Backend Endpoints** | `GET /api/analytics/program-performance`, `/regional-impact`, `/demographics`, `/skills-gap`, `/startup-funnel`, `/event-impact`, `/enrollment-trends`, `/regional-map`, `/h3-grid`, `/region/{id}`, `/region/{id}/program/{id}` |
| **Required Tables** | All domain entities |
| **Business Benefit** | 7 interactive drill-down dashboards; MapLibre geographic choropleth; 3-level drill-down |
| **Special** | Tab cache pattern prevents re-fetch. MapLibre GL + H3 hex grid for geographic data. TAB_INSIGHTS per tab with EN+AR insight, table name, feature badge. |
| **Demo Hook** | "Drill from national KPIs → regional performance → individual {entity} profile — three levels, one platform." |

---

### Page 4: ml-ai
| Field | Value |
|---|---|
| **Page ID** | `ml-ai` |
| **React File** | `PageMLAI.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | FORECAST, DETECT_ANOMALIES, CLASSIFICATION |
| **Backend Endpoints** | `GET /api/ml/forecast`, `GET /api/ml/anomalies`, `GET /api/ml/classification`, `GET /api/ml/summary` |
| **Required Tables** | Time-series domain entity; classification target entity |
| **Business Benefit** | 3 independent NCIM cards: trend forecast, anomaly detection, risk classification |
| **Special** | DETECT_ANOMALIES requires inference timestamps AFTER training data end — use z-score SQL fallback when model call fails. CLASSIFICATION!PREDICT is a scalar method, not UDTF (no TABLE()). |
| **Demo Hook** | "Built-in ML — no Python environment, no external ML platform, no data movement. Just SQL." |

---

### Page 5: time-travel
| Field | Value |
|---|---|
| **Page ID** | `time-travel` |
| **React File** | `PageTimeTravel.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | Time Travel / AT(OFFSET) / BEFORE |
| **Backend Endpoints** | `GET /api/time-travel/demo`, `GET /api/time-travel/changes`, `POST /api/time-travel/step/{0-4}`, `POST /api/time-travel/reset`, `POST /api/time-travel/corrupt/step/{0-4}`, `POST /api/time-travel/corrupt/reset` |
| **Required Tables** | Main domain entity (updatable) |
| **Business Benefit** | Step-by-step wizard: corrupt data → verify with Time Travel → restore |
| **Special** | Fetch ALL steps at once on "Start Demo". Reveal one-by-one client-side. `BEFORE(STATEMENT => LAST_QUERY_ID())` may fail if no prior statement — use try/except fallback. |
| **Demo Hook** | "We just corrupted the data — now watch us restore it to the exact state before the corruption. No backup, no DBA." |

---

### Page 6: recovery
| Field | Value |
|---|---|
| **Page ID** | `recovery` |
| **React File** | `PageRecovery.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | CLONE / UNDROP |
| **Backend Endpoints** | `GET /api/recovery/demo`, `GET /api/recovery/clone` |
| **Required Tables** | Main domain entity |
| **Business Benefit** | Two-tab wizard: UNDROP a dropped table; clone a table for zero-copy backup |
| **Special** | Separate `visibleStep` state per tab. Progress bar colored by tab theme (green/purple). Needs DEPLOY_ROLE for DDL operations. |
| **Demo Hook** | "Someone dropped the table. Production is down. Watch — 3 seconds to restore. No DBA, no ticket, no backup restore." |

---

### Page 7: cortex-ai
| Field | Value |
|---|---|
| **Page ID** | `cortex-ai` |
| **React File** | `PageCortexAI.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | Cortex AI Functions (SENTIMENT, SUMMARIZE, TRANSLATE, CLASSIFY) |
| **Backend Endpoints** | `GET /api/cortex-ai/sentiment`, `/summarize`, `/translate`, `/classify`, `/all` |
| **Required Tables** | Text/feedback entity with multilingual content |
| **Business Benefit** | 5 independent NLP cards; multilingual text processing built-in |
| **Special** | Secondary language text in demo data. RTL handling for ar/fa/ur. For non-bilingual customers: translate → summarize → classify + sentiment flow. |
| **Demo Hook** | "No NLP library, no Python, no external service — sentiment analysis, translation, summarization in one SQL function." |

---

### Page 8: lineage
| Field | Value |
|---|---|
| **Page ID** | `lineage` |
| **React File** | `PageLineage.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | OBJECT_DEPENDENCIES (INFORMATION_SCHEMA) |
| **Backend Endpoints** | `GET /api/lineage` |
| **Required Tables** | Dynamic Tables and ML model views (for rich lineage graph) |
| **Business Benefit** | Interactive 3-column node graph: source tables → transformations → consumers |
| **Demo Hook** | "Full audit trail — trace any KPI back to the source system, the transformation that produced it, and the consumer that uses it." |

---

### Page 9: quality
| Field | Value |
|---|---|
| **Page ID** | `quality` |
| **React File** | `PageQuality.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | Data Metric Functions (DMFs) |
| **Backend Endpoints** | `GET /api/quality/metrics`, `/freshness`, `/duplicates` |
| **Required Tables** | Main domain entity |
| **Business Benefit** | 3-tab quality dashboard: freshness, null rates, duplicate detection |
| **Demo Hook** | "Automated quality governance — 24/7 monitoring with no external tools, no Airflow, no Great Expectations." |

---

### Page 10: optimization
| Field | Value |
|---|---|
| **Page ID** | `optimization` |
| **React File** | `PageOptimization.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | Result Cache / Partition Pruning / ACCOUNT_USAGE |
| **Backend Endpoints** | `GET /api/optimization/query-history`, `/slow-queries`, `/clustering`, `/warehouse-utilization` |
| **Required Tables** | SNOWFLAKE.ACCOUNT_USAGE views |
| **Business Benefit** | Query history analysis; slow query identification; clustering recommendations |
| **Special** | ACCOUNT_USAGE has ~45 min latency — always implement mock fallback with `is_illustrative: true` flag and amber banner in UI. |
| **Demo Hook** | "Result cache means repeated queries cost zero credits. Clustering means we skip 90% of micro-partitions." |

---

### Page 11: pricing
| Field | Value |
|---|---|
| **Page ID** | `pricing` |
| **React File** | `PagePricing.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | Pay-per-Use / Credit Consumption |
| **Backend Endpoints** | `GET /api/pricing/credit-usage`, `/warehouse-sizes`, `/breakdown`, `/cost-per-query` |
| **Required Tables** | SNOWFLAKE.ACCOUNT_USAGE.WAREHOUSE_METERING_HISTORY |
| **Business Benefit** | 3-pillar cost model: compute + storage + cloud services. Always-visible explainer. |
| **Special** | Mock fallback mandatory (ACCOUNT_USAGE latency). Cost model explainer always visible (not behind a load button). Illustrative banner when showing mock data. |
| **Demo Hook** | "Pay for what you run, not what you provision. Auto-suspend at 2 minutes of inactivity." |

---

### Page 12: dynamic-tables
| Field | Value |
|---|---|
| **Page ID** | `dynamic-tables` |
| **React File** | `PageDynamicTables.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | Dynamic Tables (Declarative Pipelines) |
| **Backend Endpoints** | `GET /api/dynamic-tables` |
| **Required Tables** | `DT_{ENTITY}_ENRICHED` dynamic table |
| **Business Benefit** | Declarative pipeline: define the result, Snowflake manages the refresh |
| **Special** | `INITIALIZE = ON_CREATE` can take several minutes on first deploy — do not query immediately after step 06. |
| **Demo Hook** | "No cron jobs, no Airflow, no task graphs — define the output you want, Snowflake handles the refresh." |

---

### Page 13: policy-intelligence
| Field | Value |
|---|---|
| **Page ID** | `policy-intelligence` |
| **React File** | `PagePolicyIntelligence.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | **Cortex Search** (RAG on unstructured data) |
| **Backend Endpoints** | `GET /api/policy/documents`, `POST /api/policy/search`, `POST /api/policy/compliance-check` |
| **Required Tables** | `POLICY_DOCUMENTS` (seeded at backend startup) |
| **Required Service** | `CORTEX SEARCH SERVICE {SLUG}_DEMO.{DOMAIN}_DATA.POLICY_SEARCH` (created at backend startup) |
| **Business Benefit** | Natural language Q&A over regulatory/policy documents; AI-powered compliance check |
| **Special** | Regulatory documents adapted per country (PDPL for KSA, GDPR for EU, HIPAA for US healthcare). Predefined questions adapted to regulation. Compliance check uses AI_COMPLETE/SNOWFLAKE.CORTEX.COMPLETE to evaluate a stated practice against the regulation. |
| **Scenario Priority** | MUST for Government, Finance, Healthcare. RECOMMENDED for Telecom, Energy. OPTIONAL for Retail, Education. |
| **Demo Hook** | "Ask any compliance question in natural language — Cortex Search retrieves the exact {regulation} clause in milliseconds." |

---

### Page 14: data-masking
| Field | Value |
|---|---|
| **Page ID** | `data-masking` |
| **React File** | `PageDataMasking.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | Column-Level Security / Dynamic Data Masking |
| **Backend Endpoints** | `GET /api/masking/raw`, `/masking/policy`, `/masking/masked` |
| **Required Tables** | Main domain entity with PII columns |
| **Business Benefit** | PDPL/GDPR/HIPAA-compliant PII protection enforced at the data layer, zero code changes |
| **Special** | 3 NCIM cards: Raw (shows PII) → Policy (shows masking SQL) → Masked (shows protected view). Masking column names and descriptions adapted to regulatory context. |
| **Demo Hook** | "Same table, different views. Analysts see masked data. Authorized roles see full data. Zero extra infrastructure." |

---

### Page 15: data-classification
| Field | Value |
|---|---|
| **Page ID** | `data-classification` |
| **React File** | `PageDataClassification.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | SYSTEM$CLASSIFY / Sensitive Data Classification |
| **Backend Endpoints** | `GET /api/classification/scan`, `/classification/policy`, `/classification/report` |
| **Required Tables** | All domain entity tables |
| **Business Benefit** | Auto-discover PII columns across the entire data estate — compliance inventory in minutes |
| **Special** | 3-tab flow: Scan → Policy → Report. Category labels adapted to regulatory context (PDPL: SENSITIVE/QUASI_IDENTIFIER/IDENTIFIER; GDPR: PERSONAL_DATA/SPECIAL_CATEGORY; HIPAA: PHI/DEMOGRAPHIC). |
| **Demo Hook** | "Auto-classify 500+ columns across 80 tables as PII, SENSITIVE, or QUASI_IDENTIFIER — in one query." |

---

### Page 16: ask-misk (→ ask-{slug})
| Field | Value |
|---|---|
| **Page ID** | `ask-{slug}` |
| **React File** | `PageAsk{Name}.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | Cortex Analyst (Natural Language to SQL) |
| **Backend Endpoints** | `GET /api/ask-{slug}/status`, `POST /api/ask-{slug}/query`, `POST /api/ask-{slug}/analyst` |
| **Required Tables** | 4-6 primary domain entities (semantic model tables) |
| **Required File** | `{slug}_semantic_model.yaml` on stage |
| **Business Benefit** | Any business user can query data in plain language — no SQL, no BI tool |
| **Special** | Full-height NCIM chatbot. EN/{secondary_lang} toggle (RTL flip for ar/fa/ur). 8 predefined question grid. Conversation history. Timing bubbles. Interpretation panel. Suggestions. Semantic model auto-uploaded to stage on startup. |
| **Demo Hook** | "No SQL, no BI tool — just ask '{domain-specific question}' and get an answer with the SQL that generated it." |

---

### Page 17: document-ai
| Field | Value |
|---|---|
| **Page ID** | `document-ai` |
| **React File** | `PageDocumentAI.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | AI_PARSE_DOCUMENT / Document AI |
| **Backend Endpoints** | `GET /api/document-ai/documents`, `POST /api/document-ai/parse`, `POST /api/document-ai/query` |
| **Required Tables** | `DOCUMENTS` (staged PDFs/images on internal stage) |
| **Business Benefit** | Extract structured data from invoices, contracts, receipts — no external OCR tool |
| **Special** | NCIM-card pattern: 3 cards (Upload/List → Parse/Extract → Query Extracted). Files must be on a Snowflake stage. `AI_PARSE_DOCUMENT` returns JSON — flatten into table for querying. |
| **Demo Hook** | "Drop a PDF invoice on Snowflake — AI extracts vendor, amount, line items, dates. Query it like a table. No OCR pipeline, no external service." |

---

### Page 18: cortex-agent
| Field | Value |
|---|---|
| **Page ID** | `cortex-agent` |
| **React File** | `PageCortexAgent.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | Cortex Agent (Agentic AI) |
| **Backend Endpoints** | `POST /api/agent/chat`, `GET /api/agent/status`, `GET /api/agent/tools` |
| **Required Tables** | Same as Ask {Customer} + POLICY_DOCUMENTS (agent uses both Analyst + Search) |
| **Required Service** | Cortex Agent configured with Cortex Search + Cortex Analyst as tools |
| **Business Benefit** | Multi-tool AI agent that can search docs, query data, and reason across both — single conversational interface |
| **Special** | Chatbot pattern (same as Ask {Customer} but with agent orchestration). Agent decides whether to use Search (unstructured) or Analyst (structured) based on the question. Show tool-use trace in UI. |
| **Demo Hook** | "Ask anything — the agent figures out whether to search your policy docs or query your data warehouse. One interface, two knowledge sources, zero prompt engineering." |

---

### Page 19: notebooks
| Field | Value |
|---|---|
| **Page ID** | `notebooks` |
| **React File** | `PageNotebooks.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | Snowflake Notebooks |
| **Backend Endpoints** | `GET /api/notebooks/list`, `GET /api/notebooks/output/{name}` |
| **Required Tables** | ML training view (same as ML/AI page) |
| **Business Benefit** | Data science workflow inside Snowflake — no Jupyter export, no data movement, runs on Snowflake compute |
| **Special** | Mostly static/visual page. Shows notebook cell outputs (pre-rendered). Backend returns stored notebook results (markdown + chart images). No live notebook execution in demo. |
| **Demo Hook** | "Your data scientists work in notebooks — inside Snowflake. Same compute, same governance, same lineage. No data ever leaves the platform." |

---

### Page 20: iceberg-tables
| Field | Value |
|---|---|
| **Page ID** | `iceberg-tables` |
| **React File** | `PageIcebergTables.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | Apache Iceberg Tables (Managed + Unmanaged) |
| **Backend Endpoints** | `GET /api/iceberg/tables`, `GET /api/iceberg/metadata/{table}`, `POST /api/iceberg/query` |
| **Required Tables** | At least 1 Iceberg table created in the schema |
| **Business Benefit** | Open table format — no vendor lock-in, interoperable with Spark/Trino/Flink, Snowflake manages the catalog |
| **Special** | Tab-cache pattern: Tab 1 = list Iceberg tables + metadata (snapshots, partitions). Tab 2 = query Iceberg table (same as regular table — that's the point). Tab 3 = show external catalog integration config. |
| **Demo Hook** | "This table is Apache Iceberg. Query it exactly like any Snowflake table. But the data is on YOUR storage, in open Parquet format. No lock-in. Switch engines tomorrow if you want." |

---

### Page 21: streaming
| Field | Value |
|---|---|
| **Page ID** | `streaming` |
| **React File** | `PageStreaming.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | Snowpipe Streaming / Continuous Ingestion |
| **Backend Endpoints** | `GET /api/streaming/status`, `POST /api/streaming/insert`, `GET /api/streaming/latency`, `GET /api/streaming/history` |
| **Required Tables** | `STREAMING_EVENTS` (landing table for streaming inserts) |
| **Business Benefit** | Sub-second data ingestion without file staging — real-time analytics pipeline |
| **Special** | Wizard pattern: Step 1 = show empty table. Step 2 = insert rows via Snowpipe Streaming API (simulated). Step 3 = query immediately (show latency < 1s). Step 4 = show ingestion history chart. Uses `SNOWFLAKE.ACCOUNT_USAGE.PIPE_USAGE_HISTORY` for real metrics (mock fallback). |
| **Demo Hook** | "We just inserted 1000 rows. Query them now — sub-second latency. No staging files, no COPY INTO, no waiting. Real-time." |

---

### Page 22: tasks-streams
| Field | Value |
|---|---|
| **Page ID** | `tasks-streams` |
| **React File** | `PageTasksStreams.tsx` |
| **Session** | S3 (Frontend) |
| **Snowflake Feature** | Tasks + Streams (CDC / Event-driven Pipelines) |
| **Backend Endpoints** | `GET /api/tasks/list`, `GET /api/tasks/history`, `GET /api/streams/status`, `POST /api/tasks/run` |
| **Required Tables** | Source table with STREAM + downstream TASK |
| **Business Benefit** | Event-driven data processing — only process changed rows, automatic scheduling |
| **Special** | Tab-cache pattern: Tab 1 = Streams (show stream offset, pending rows, CDC visualization). Tab 2 = Tasks (show task DAG, run history, success/fail). Tab 3 = Run demo (insert rows → stream detects → task fires → show result). Complementary to Dynamic Tables — show "imperative" vs "declarative" pipeline approaches. |
| **Demo Hook** | "Stream captures every change. Task fires automatically. Only changed rows get processed. Zero wasted compute." |

---

## API Summary (60+ endpoints)

```
GET  /api/health
GET  /api/tiles/{z}/{x}/{y}          # Map tile proxy (OSM)
GET  /api/platform/kpis|stats|warehouse
GET  /api/performance/benchmark|compare|completion-rates|top-{entities}
GET  /api/analytics/program-performance|regional-impact|demographics|skills-gap|
              startup-funnel|event-impact|enrollment-trends|regional-map|h3-grid
GET  /api/analytics/region/{id}
GET  /api/analytics/region/{id}/program/{id}
GET  /api/ml/forecast|anomalies|classification|summary
GET  /api/time-travel/demo|changes
POST /api/time-travel/step/{n}|reset|corrupt/step/{n}|corrupt/reset
GET  /api/recovery/demo|clone
GET  /api/cortex-ai/sentiment|summarize|translate|classify|all
GET  /api/lineage
GET  /api/quality/metrics|freshness|duplicates
GET  /api/optimization/query-history|slow-queries|clustering|warehouse-utilization
GET  /api/pricing/credit-usage|warehouse-sizes|breakdown|cost-per-query
GET  /api/dynamic-tables
GET  /api/masking/raw|policy|masked
GET  /api/classification/scan|policy|report
GET  /api/policy/documents
POST /api/policy/search
POST /api/policy/compliance-check
GET  /api/ask-{slug}/status
POST /api/ask-{slug}/query|analyst
```
