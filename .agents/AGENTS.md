# Project Guidelines & Memory for Atera MSP Project

## CRITICAL USER REQUIREMENTS
1. **Primary Output Format**: This project is exclusively an **A4 Printable PDF Executive Report** (`ReportView.tsx`), NOT a web dashboard app with sidebars.
2. **Main Page Component**: `app/page.tsx` MUST always render `<ReportView>` directly as the root component. Do NOT wrap or replace it with `<DashboardView>`.
3. **No Hardcode Policy ("ห้าม Hardcode")**: All report data (devices, tickets, alerts, patches, customers) MUST be dynamically driven by the Atera API v3 endpoints.
4. **Report Structure & Page Order**:
   - Page 1: Cover Page (`CoverPage.tsx`)
   - Page 2: Executive Summary (`SummaryPage.tsx`)
   - Page 3: Infrastructure Overview (`DevicesPage.tsx`)
   - Page 4: OS Patch Compliance (`PatchesPage.tsx`)
   - Page 5: Available OS Patches / Devices Missing OS Patches (`SoftwarePage.tsx`)
   - Page 6: Security & System Alerts (`AlertsPage.tsx`)
   - Page 7: Ticket & Support Performance (`TicketsPage.tsx`)
   - Page 8: Security Risk Scorecard (`RiskScorecardPage.tsx`)
   - Page 9: Device Health & Connectivity (`HealthPage.tsx`)
5. **Dynamic Date Range Filtering**: All pages must accept and display `dateRangeDisplay` from the capsule date picker in `ReportView.tsx`.
