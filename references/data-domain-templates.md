# Data Domain Templates

Per-vertical entity definitions, DDL templates, and regulatory document content. Used by the generate sub-skill to adapt MISK's education domain to any customer vertical.

---

## How to Use

1. Read the customer's `{industry}` from the research context
2. Find the matching vertical below
3. Use the **entity list** to replace MISK's entities in `02_ddl.sql`
4. Use the **architecture nodes** to replace MISK's node labels in `PageArchitecture.tsx`
5. Use the **regulatory doc content** to replace MISK's PDPL content in `_seed_policy_documents()`

---

## Vertical: education

**Primary entities**: STUDENTS, ENROLLMENTS, COURSES, ASSESSMENTS, INSTRUCTORS, OUTCOMES

**MISK entity mapping**:
| MISK | Education |
|---|---|
| BENEFICIARIES | STUDENTS |
| ENROLLMENTS | ENROLLMENTS |
| PROGRAMS | COURSES |
| TRAINERS | INSTRUCTORS |
| SKILL_ASSESSMENTS | ASSESSMENTS |
| FEEDBACK | STUDENT_FEEDBACK |
| STARTUPS | ALUMNI_STARTUPS |
| EVENTS | CAMPUS_EVENTS |

**Architecture nodes (Sources layer)**:
- Student Information System — {N}K students (CSV)
- Course Management — {N} courses + {N} instructors
- Events & Alumni — {N}K records
- Feedback (text) — {N}K text responses
- Policy Documents — Education regulations + internal policies

**Architecture nodes (Bronze layer)**:
- STUDENTS — {N}K rows
- ENROLLMENTS — {N}M rows
- COURSES / INSTRUCTORS — {N} + {N} rows
- ASSESSMENTS — {N}M rows
- Time Travel + UNDROP — 90-day history
- POLICY_DOCUMENTS — unstructured text

**DDL highlights**: `student_id`, `enrollment_date`, `course_id`, `completion_status`, `assessment_score`, `dropout_risk_score`

---

## Vertical: finance

**Primary entities**: CUSTOMERS, ACCOUNTS, TRANSACTIONS, LOANS, RISK_SCORES, COMPLIANCE_EVENTS

**MISK entity mapping**:
| MISK | Finance |
|---|---|
| BENEFICIARIES | CUSTOMERS |
| ENROLLMENTS | TRANSACTIONS |
| PROGRAMS | PRODUCTS |
| TRAINERS | ADVISORS |
| SKILL_ASSESSMENTS | RISK_ASSESSMENTS |
| FEEDBACK | CUSTOMER_FEEDBACK |
| STARTUPS | FINTECHS |
| EVENTS | COMPLIANCE_EVENTS |

**Architecture nodes (Sources layer)**:
- Core Banking System — {N}M customers (API)
- Transaction Ledger — {N}M transactions/day
- Risk Engine — {N}K daily risk assessments
- Customer Feedback — {N}K text responses
- Regulatory Documents — Basel III, AML, GDPR/PDPL policies

**Architecture nodes (Bronze layer)**:
- CUSTOMERS — {N}M rows
- TRANSACTIONS — {N}M rows
- ACCOUNTS / PRODUCTS — {N}K rows
- RISK_ASSESSMENTS — {N}M rows
- Time Travel + UNDROP — 90-day audit history
- POLICY_DOCUMENTS — regulatory corpus

**DDL highlights**: `customer_id`, `account_number` (PII — masked), `transaction_amount`, `transaction_date`, `risk_score`, `fraud_flag`, `national_id_hash` (PII — masked)

**Regulatory docs (PDPL/KSA)**: see pdpl_policy_docs below
**Regulatory docs (GDPR/EU)**: see gdpr_policy_docs below

---

## Vertical: healthcare

**Primary entities**: PATIENTS, APPOINTMENTS, DIAGNOSES, PRESCRIPTIONS, CLINICAL_TRIALS, OUTCOMES

**MISK entity mapping**:
| MISK | Healthcare |
|---|---|
| BENEFICIARIES | PATIENTS |
| ENROLLMENTS | APPOINTMENTS |
| PROGRAMS | CARE_PROGRAMS |
| TRAINERS | PHYSICIANS |
| SKILL_ASSESSMENTS | DIAGNOSES |
| FEEDBACK | PATIENT_FEEDBACK |
| STARTUPS | HEALTH_STARTUPS |
| EVENTS | CLINICAL_EVENTS |

**Architecture nodes (Sources layer)**:
- EHR System — {N}M patient records
- Appointment System — {N}M appointments
- Lab & Imaging — {N}M results
- Patient Feedback — {N}K text
- Policy Documents — HIPAA / internal clinical protocols

**DDL highlights**: `patient_id`, `national_id` (PII — masked), `diagnosis_code`, `appointment_date`, `readmission_risk`, `treatment_outcome`

---

## Vertical: government

**Primary entities**: CITIZENS, APPLICATIONS, PERMITS, INSPECTIONS, SERVICE_REQUESTS, FEEDBACK

**MISK entity mapping**:
| MISK | Government |
|---|---|
| BENEFICIARIES | CITIZENS |
| ENROLLMENTS | SERVICE_REQUESTS |
| PROGRAMS | GOVERNMENT_SERVICES |
| TRAINERS | OFFICERS |
| SKILL_ASSESSMENTS | INSPECTIONS |
| FEEDBACK | CITIZEN_FEEDBACK |
| STARTUPS | LICENSED_BUSINESSES |
| EVENTS | PUBLIC_EVENTS |

**Architecture nodes (Sources layer)**:
- National Registry — {N}M citizen records
- Service Portal — {N}M service requests
- Permit & License System — {N}K permits
- Citizen Feedback — {N}K text responses
- Policy Documents — PDPL + internal regulations

**DDL highlights**: `citizen_id`, `national_id` (PII — masked), `service_type`, `request_date`, `resolution_time_days`, `satisfaction_score`

---

## Vertical: energy

**Primary entities**: WELLS, PRODUCTION_RECORDS, ASSETS, EMPLOYEES, MAINTENANCE_LOGS, SAFETY_INCIDENTS

**MISK entity mapping**:
| MISK | Energy |
|---|---|
| BENEFICIARIES | EMPLOYEES |
| ENROLLMENTS | PRODUCTION_RECORDS |
| PROGRAMS | ASSETS |
| TRAINERS | ENGINEERS |
| SKILL_ASSESSMENTS | INSPECTIONS |
| FEEDBACK | INCIDENT_REPORTS |
| STARTUPS | VENDORS |
| EVENTS | MAINTENANCE_EVENTS |

**Architecture nodes (Sources layer)**:
- SCADA / IoT Sensors — {N}M readings/day
- Asset Management System — {N}K assets
- HR System — {N}K employees
- Safety Reporting — {N}K incidents/year
- Policy Documents — HSE regulations + ISO 55001

**DDL highlights**: `well_id`, `asset_id`, `production_date`, `volume_bbls`, `downtime_hours`, `safety_classification`, `maintenance_type`

---

## Vertical: telecom

**Primary entities**: SUBSCRIBERS, CALLS, DATA_USAGE, INCIDENTS, PLANS, CHURN_PREDICTIONS

**MISK entity mapping**:
| MISK | Telecom |
|---|---|
| BENEFICIARIES | SUBSCRIBERS |
| ENROLLMENTS | CALL_RECORDS |
| PROGRAMS | PLANS |
| TRAINERS | AGENTS |
| SKILL_ASSESSMENTS | NETWORK_ASSESSMENTS |
| FEEDBACK | SUPPORT_TICKETS |
| STARTUPS | RESELLERS |
| EVENTS | NETWORK_EVENTS |

**DDL highlights**: `subscriber_id`, `msisdn` (PII — masked), `plan_id`, `usage_date`, `data_gb`, `churn_score`, `nps_score`

---

## Vertical: retail

**Primary entities**: CUSTOMERS, ORDERS, PRODUCTS, INVENTORY, REVIEWS, LOYALTY_POINTS

**MISK entity mapping**:
| MISK | Retail |
|---|---|
| BENEFICIARIES | CUSTOMERS |
| ENROLLMENTS | ORDERS |
| PROGRAMS | PRODUCTS |
| TRAINERS | STORE_MANAGERS |
| SKILL_ASSESSMENTS | PRODUCT_REVIEWS |
| FEEDBACK | CUSTOMER_FEEDBACK |
| STARTUPS | BRANDS |
| EVENTS | PROMOTIONAL_EVENTS |

**DDL highlights**: `customer_id`, `email` (PII — masked), `order_id`, `order_date`, `total_amount`, `loyalty_points`, `churn_risk`, `clv_score`

---

## Vertical: logistics

**Primary entities**: SHIPMENTS, ROUTES, VEHICLES, DRIVERS, WAREHOUSES, DELIVERY_EVENTS

**MISK entity mapping**:
| MISK | Logistics |
|---|---|
| BENEFICIARIES | CUSTOMERS |
| ENROLLMENTS | SHIPMENTS |
| PROGRAMS | ROUTES |
| TRAINERS | DRIVERS |
| SKILL_ASSESSMENTS | DELIVERY_ASSESSMENTS |
| FEEDBACK | CUSTOMER_FEEDBACK |
| STARTUPS | CARRIERS |
| EVENTS | DELIVERY_EVENTS |

**DDL highlights**: `shipment_id`, `driver_id`, `vehicle_id`, `pickup_date`, `delivery_date`, `on_time_flag`, `delivery_score`

---

## Regulatory Document Content

### pdpl_policy_docs (Saudi Arabia / GCC — PDPL)

Seed these documents into `POLICY_DOCUMENTS`:

```
doc_id: pdpl_ch1, doc_name: "PDPL Chapter 1 — General Provisions", doc_type: regulatory
content: Personal Data Protection Law (PDPL) - Kingdom of Saudi Arabia. Chapter 1: General Provisions.
Article 1: Definitions. Personal Data means any data—whatever its source or form—that would lead to the identification of an individual specifically, or that would make it possible to identify an individual directly or indirectly, including name, personal identification number, addresses, contact numbers, license plates, records, personal property, bank account and credit card numbers, photographs, video footage, and other data of a personal nature.
Article 2: Objectives. This Law aims to: (1) protect privacy of personal data; (2) regulate collection and processing of personal data; (3) protect rights of personal data owners; (4) regulate transfer of personal data to outside the Kingdom; (5) enable safe circulation of personal data between entities.
Article 3: Scope. This law applies to any processing of personal data of individuals residing in the Kingdom of Saudi Arabia.

doc_id: pdpl_ch3, doc_name: "PDPL Chapter 3 — Principles of Personal Data Processing", doc_type: regulatory
content: Article 8: Lawful Basis for Processing. Personal data shall not be collected or processed except for a lawful purpose directly related to the activities of the controller, and on the condition that the necessity and adequacy of the data is fulfilled by the purpose for which it is collected. Article 9: Sensitive Data. Sensitive personal data—including data about racial or ethnic origin, political opinions, religious beliefs, biometric data, genetic data, health data, financial data, criminal records—may only be processed with explicit consent or for a clearly defined legitimate purpose. Article 11: Data Minimization. The controller shall ensure that the personal data collected and processed is limited to what is necessary for the stated purpose.

doc_id: pdpl_ch4, doc_name: "PDPL Chapter 4 — Rights of Personal Data Owners", doc_type: regulatory
content: Article 13: Right of Access. A personal data owner has the right to be informed of the personal data held about them and the purpose of processing. Article 14: Right to Rectification. A personal data owner has the right to request correction of any inaccurate personal data. Article 15: Right to Erasure. A personal data owner has the right to request destruction of their personal data if the purpose for which it was collected is fulfilled, the data is no longer needed, or consent is withdrawn. Article 16: Right to Data Portability. A personal data owner may request transfer of their data to another controller in a structured machine-readable format.

doc_id: pdpl_ch5, doc_name: "PDPL Chapter 5 — Data Transfer Outside the Kingdom", doc_type: regulatory
content: Article 29: Cross-Border Transfer. Personal data may only be transferred to a country outside the Kingdom of Saudi Arabia if: (a) the receiving country provides an adequate level of protection; (b) the transfer is necessary for performance of a contract; (c) the data owner has given explicit consent; (d) the transfer is in the vital interest of the data owner. Article 30: Binding Corporate Rules. Controllers may transfer personal data to group entities outside the Kingdom under approved Binding Corporate Rules. The controller must obtain prior approval from SDAIA for any such transfer.

doc_id: internal_gov, doc_name: "Internal Data Governance Policy", doc_type: governance
content: Internal Data Governance Policy. Section 1: Data Classification. All data assets are classified as: PUBLIC (no restrictions), INTERNAL (limited to employees), CONFIDENTIAL (role-based access), RESTRICTED (executive and compliance only). Section 2: Data Retention. Operational data is retained for 7 years. Archived data is retained for 15 years in cold storage. Backup data is retained for 90 days. Section 3: Access Control. All access to RESTRICTED and CONFIDENTIAL data requires: manager approval, role assignment by IT Security, quarterly access review. Section 4: Incident Response. All data breaches must be reported to the Data Protection Officer within 24 hours. SDAIA must be notified within 72 hours for breaches affecting more than 100 individuals.
```

### gdpr_policy_docs (European Union)

```
doc_id: gdpr_art5, doc_name: "GDPR Article 5 — Principles of Processing", doc_type: regulatory
content: Article 5 GDPR: Personal data shall be processed lawfully, fairly and in a transparent manner (lawfulness, fairness and transparency); collected for specified, explicit and legitimate purposes (purpose limitation); adequate, relevant and limited to what is necessary (data minimisation); accurate and kept up to date (accuracy); kept in a form which permits identification no longer than necessary (storage limitation); processed in a manner that ensures appropriate security (integrity and confidentiality).

doc_id: gdpr_art17, doc_name: "GDPR Article 17 — Right to Erasure", doc_type: regulatory
content: Article 17 GDPR: The data subject shall have the right to obtain from the controller the erasure of personal data without undue delay where: (a) the personal data are no longer necessary; (b) the data subject withdraws consent; (c) the data subject objects to the processing; (d) the personal data have been unlawfully processed. The controller shall communicate any erasure to each recipient to whom the personal data have been disclosed.

doc_id: gdpr_art32, doc_name: "GDPR Article 32 — Security of Processing", doc_type: regulatory
content: Article 32 GDPR: The controller and processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk, including: (a) pseudonymisation and encryption; (b) ability to ensure ongoing confidentiality, integrity, availability; (c) ability to restore availability in a timely manner; (d) process for regularly testing, assessing and evaluating the effectiveness of measures.
```

### hipaa_policy_docs (US Healthcare)

```
doc_id: hipaa_privacy, doc_name: "HIPAA Privacy Rule — Key Requirements", doc_type: regulatory
content: HIPAA Privacy Rule: Covered entities must implement safeguards to protect PHI. PHI (Protected Health Information) includes: name, address, birth date, social security number, account numbers, certificate numbers, device identifiers, URLs, IP addresses, biometric identifiers, full-face photographs, any unique identifying number or code. Minimum Necessary Standard: Covered entities must make reasonable efforts to use, disclose, and request only the minimum amount of PHI needed to accomplish the intended purpose.

doc_id: hipaa_security, doc_name: "HIPAA Security Rule — Administrative Safeguards", doc_type: regulatory
content: HIPAA Security Rule Administrative Safeguards: (1) Security Management Process — conduct risk analysis, implement risk management; (2) Workforce Training — train all workforce on security policies; (3) Information Access Management — implement policies for authorizing access to ePHI; (4) Security Incident Procedures — implement policies to address security incidents; (5) Contingency Plan — data backup plan, disaster recovery plan, emergency mode operation plan.
```

### generic_policy_docs (All other verticals)

```
doc_id: data_gov_policy, doc_name: "Enterprise Data Governance Policy", doc_type: governance
content: Enterprise Data Governance Policy v2.0. Purpose: This policy establishes principles and requirements for managing data as a strategic asset. Scope: Applies to all employees, contractors, and third parties who collect, store, process, or transmit organizational data. Data Classification: CRITICAL (core business data, regulatory data), SENSITIVE (customer PII, financial records, employee data), INTERNAL (operational data, internal communications), PUBLIC (marketing materials, public reports). Data Retention: Customer data: 7 years after relationship ends. Transaction data: 10 years. Employee data: 7 years after departure. Log data: 2 years.

doc_id: access_control_policy, doc_name: "Data Access Control Policy", doc_type: internal
content: Data Access Control Policy. Section 1: Principle of Least Privilege. All users are granted the minimum level of access required to perform their job functions. Access is reviewed quarterly and revoked immediately upon role change or departure. Section 2: Role-Based Access Control. Data access is controlled through roles: VIEWER (read-only), ANALYST (read + aggregate), DATA_ENGINEER (read + write), DATA_ADMIN (full access). Section 3: PII Handling. All personally identifiable information must be masked in non-production environments. Direct access to production PII requires manager approval and is logged automatically.
```
