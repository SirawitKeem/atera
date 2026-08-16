# Project Context

This document is based on repository inspection only. Any item that could not be verified from code or project artifacts is marked as: TODO: ต้องยืนยันกับเจ้าของโปรเจกต์.

---

## 1. Project Overview

- Project purpose:
  - This app generates Atera-backed executive reports for MSP/IT operations review.
  - The main screen loads live data from Atera and renders multi-page PDF-style report views such as summary, devices, alerts, tickets, patches, and health.
  - Software inventory pages were removed because no real Atera software API exists in this project.
  - Evidence: app/page.tsx, components/ReportView.tsx, components/reports/*.tsx, README.md.
- Intended users:
  - Likely IT admin / MSP operations team / executive stakeholders reviewing customer health and patch status.
  - TODO: ต้องยืนยันกับเจ้าของโปรเจกต์ ว่า target user เป็นทีมไหนและลูกค้าแบบไหน.
- Tech stack:
  - Framework: Next.js 16.2.11 (package.json)
  - Language: TypeScript + React 19.2.4 (package.json)
  - UI: App Router in app/ with Tailwind CSS v4 (package.json, postcss.config.mjs, app/globals.css)
  - Database: None found in repository for app runtime.
  - Hosting / deployment: No explicit deploy config found in repo. The app is set up as a Next.js app and likely deployable on Vercel by default, but this is not verified from code.
  - Package manager: npm (package.json scripts; no pnpm-lock or yarn.lock found in root)
- Common commands:
  - Install: npm install
  - Dev server: npm run dev
  - Production build: npm run build
  - Start production server: npm run start
  - Lint: npm run lint
  - Source evidence: package.json

---

## 2. External API Integration (Atera & Microsoft MSRC)

### 2.1 Base URL and authentication

- Base URL: https://app.atera.com/api/v3
  - Source: lib/atera/fetcher.ts
- API version: v3
  - Source: lib/atera/fetcher.ts
- Auth method:
  - API key or JWT token is accepted.
  - In code, it checks if the key starts with eyJ or length > 100; then it sends Authorization: Bearer <token>, otherwise it sends X-API-KEY.
  - Source: lib/atera/fetcher.ts
- Env var names:
  - ATERA_API_URL = optional override, default https://app.atera.com/api/v3
  - ATERA_API_KEY = required runtime key
  - Source: lib/atera/fetcher.ts

### 2.2 Microsoft MSRC (Microsoft Security Update Guide) API
- Purpose: Map missing update KB numbers to security vulnerabilities (CVEs), CVSS scores, descriptions, and severity levels.
- Base URL: `https://api.msrc.microsoft.com/sug/v2.0/en-US/affectedProduct`
- Cache file: `lib/cve-cache.json`

### 2.3 Actual endpoints used by the project

| Full path | Method | Purpose | File(s) where called | Sample response (if present) | Rate limit / pagination behavior |
|---|---|---|---|---|---|
| /api/v3/accounts | GET | Fetch account info for company metadata and branding. | lib/atera/account.ts -> getAccountInfo ; app/page.tsx -> AteraClient.getAccountInfo() | TODO: no saved sample response in repo | fetchAtera uses query params and no explicit rate-limit handling; fetchAllPages in app/page.tsx loops with page and itemsInPage=100 |
| /api/v3/agents | GET | Fetch monitored devices / agents for customer and device inventory. | lib/atera/agent.ts -> getAgents ; app/page.tsx -> fetchAllPages(AteraClient.getAgents) | TODO: no saved sample response in repo | page + itemsInPage=100; same fetchAllPages contract |
| /api/v3/agents/{agentId} | GET | Fetch single agent by ID. | lib/atera/agent.ts -> getAgent | TODO: no sample response | Not used in current UI; no explicit pagination behavior |
| /api/v3/agents/customer/{customerId} | GET | Fetch agents by customer. | lib/atera/agent.ts -> getAgentsByCustomer | TODO: no sample response | Not used in current UI |
| /api/v3/alerts | GET | Get alert history used in alert summary/report pages. | lib/atera/alert.ts -> getAlerts ; app/page.tsx -> fetchAllPages(AteraClient.getAlerts) | TODO: no sample response | page + itemsInPage=100 |
| /api/v3/billing/invoices | GET | Fetch billing/invoice data. | lib/atera/billing.ts -> getInvoices | TODO: no sample response | Not used in any report page in current repo; only API wrapper exists |
| /api/v3/contacts | GET | Fetch contact records for customer contact tables. | lib/atera/contact.ts -> getContacts ; app/page.tsx -> fetchAllPages(AteraClient.getContacts) | TODO: no sample response | page + itemsInPage=100 |
| /api/v3/contracts | GET | Fetch contracts for customer service coverage tables. | lib/atera/contract.ts -> getContracts ; app/page.tsx -> fetchAllPages(AteraClient.getContracts) | TODO: no sample response | page + itemsInPage=100 |
| /api/v3/customers | GET | Fetch customer list for report filters and company data. | lib/atera/customer.ts -> getCustomers ; app/page.tsx -> fetchAllPages(AteraClient.getCustomers) | TODO: no sample response | page + itemsInPage=100 |
| /api/v3/customers/{customerId} | GET | Fetch one customer by ID. | lib/atera/customer.ts -> getCustomer | TODO: no sample response | Not used in current UI |
| /api/v3/customvalues | GET | Fetch custom values / extra metadata. | lib/atera/customvalue.ts -> getCustomValues | TODO: no sample response | Not used in current UI; page + itemsInPage possible |
| /api/v3/departments | GET | Fetch department records. | lib/atera/department.ts -> getDepartments | TODO: no sample response | Not used in current UI |
| /api/v3/devices | GET | Fetch device inventory. | lib/atera/device.ts -> getDevices | TODO: no sample response | Not used in current UI; wrapper exists |
| /api/v3/knowledgebase | GET | Fetch knowledge-base articles. | lib/atera/knowledgebase.ts -> getKbArticles | TODO: no sample response | Not used in current UI |
| /api/v3/agents/{deviceGuid}/installed-patches | GET | **DISABLED** | - | - | **DISABLED as per client directive**. We no longer call the `/installed-patches` endpoint to optimize report loading performance and avoid pulling already-installed patches. |
| /api/v3/agents/{deviceGuid}/available-patches | GET | Pull patch list available for each device. This is the core source for OS patch status and CVE/CVSS mappings. | lib/atera/patch.ts -> getAvailablePatches ; app/page.tsx -> AteraClient.getAvailablePatches(deviceGuid) | - | No explicit rate limit found; app/page.tsx uses Promise.all per device |
| /api/v3/rates | GET | Fetch rate tables. | lib/atera/rate.ts -> getRates | TODO: no sample response | Not used in current UI |
| /api/v3/tickets | GET | Fetch ticket records used in service desk and SLA pages. | lib/atera/ticket.ts -> getTickets ; app/page.tsx -> fetchAllPages(AteraClient.getTickets) and filtered by status | TODO: no sample response | page + itemsInPage=100; statuses are fetched separately and later merged by TicketID |
| /api/v3/workhours | GET | Fetch workhour records for operations reporting. | lib/atera/workhour.ts -> getWorkhours ; app/page.tsx -> fetchAllPages(AteraClient.getWorkhours) | TODO: no sample response | page + itemsInPage=100 |

### 2.4 Glossary / terminology guardrail

- **Devices** vs **Hosts**:
  - The project standardizes on the term **"Devices"** (or **"Device"**). The term **"Hosts"** has been completely replaced in labels and headers to maintain term consistency.
- **Device Type**:
  - The project references Device Type (e.g. `Server` or `Workstation`) retrieved directly from the API field `agent.DeviceType`, replacing any `OS Category` or `OS category` labels.

---

## 3. Data Model / Field Mapping

These are actual field names explicitly referenced in the project.

| Code field / variable | Atera API source field used in code | Notes |
|---|---|---|
| agent.DeviceGuid | DeviceGuid | Used as identifier for patch fetches; see app/page.tsx |
| agent.MachineName | MachineName | Used as agent name in report rows |
| agent.AgentName | AgentName | Fallback when MachineName missing |
| agent.OS | OS | Used to detect Linux / Windows |
| agent.CustomerName | CustomerName | Used for customer mapping |
| agent.DeviceType | DeviceType | Used in report grouping / Device Type column |
| agent.Online | Online / online | Used to count active devices |
| a.Archived | Archived / archived | Used to filter alerts |
| t.TicketCreatedDate | TicketCreatedDate / CreatedDate / created | Used for date range filtering |
| t.TicketStatus | TicketStatus / status / Status / StatusName | Used to classify open vs resolved tickets |
| t.TicketPriority | TicketPriority / priority | Used to count critical tickets |
| p.name | name | Patch name in available/installed patch payload |
| p.class | class | Patch classification used to infer software vs OS update |
| p.kbId | kbId | Patch identifier in report tables |
| p.installDate | installDate | Used in patch payload normalization |
| accountInfo.CompanyName | CompanyName | Used as report branding |

---

## 4. Known Issues / Fixed Bugs Log

### Fixed / observed issues in code

- **[2026-08-16] Software inventory page removed**
  - *Symptom:* The Atera API has no verified software inventory / software update endpoint for this implementation.
  - *Resolution:* Removed all software-related page logic and report content from the live report flow. This project now focuses on patch compliance and CVE-based risk assessment only.

- **[2026-08-16] Unification of terms (Hosts -> Devices & OS Category -> Device Type)**
  - *Symptom:* Inconsistency in labels.
  - *Resolution:* Replaced "Hosts" with "Devices" globally. Changed `OS CATEGORY` to `DEVICE TYPE` on Page 5's table, mapping the cells directly to the API's `dev.deviceType` (`Server` or `Workstation`).

- **[2026-08-16] Filter strictly by Pending Patches**
  - *Symptom:* Installed patches should not be retrieved or counted.
  - *Resolution:* Completely removed the Atera `getInstalledPatches` call from `app/page.tsx` as per the client's directive. We now only query available (pending) patches. Patch-related reports apply a strict filter to ensure only patches with available/pending status are evaluated.

- **[2026-08-16] CVE ID Duplication Bug**
  - *Symptom:* Previously, because Microsoft MSRC returns multiple product targets for a single KB, a device's CVE counts (Critical/Important) were inflated because the loop directly incremented for each product row.
  - *Resolution:* Implemented per-device deduplication inside `SoftwarePage.tsx` using a unique `Map<string, string>` (cveId -> level) to ensure counts strictly represent unique CVE IDs missing on that device.

- **[2026-08-16] Linux patch fallback injects synthetic values**
  - *Symptom:* app/page.tsx injected 21 fake available updates and 669 installed updates for Linux agents when lists returned empty.
  - *Status:* RESOLVED. Removed mock fallback logic. Linux agents now show real data (0 or "No data").

---

## 5. File Structure

Root folders and important files:

- `app/`
  - `app/page.tsx`: server orchestration; loads agents, fetches available patches (skips installed patches), enriches missing KBs with MSRC CVEs, and creates reportData payload.
- `components/`
  - `components/ReportView.tsx`: main layout; coordinates layout parameters and passes patch/CVE data to pages.
  - `components/reports/`: report templates.
    - `PatchesPage.tsx`: patch summary page.
    - `RiskScorecardPage.tsx`: security assessment page.
- `lib/`
  - `lib/atera/cve.ts`: fetches, normalizes, and caches Microsoft MSRC CVE records.
  - `lib/cve-cache.json`: local cache file for Microsoft MSRC records.
