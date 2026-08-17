# Atera Report Design System

## Purpose

This document is the UI contract for the Atera Report App. It reduces duplicated
report markup while preserving the A4/print layout. Read this file and inspect
`components/ui/` before adding or changing report UI.

## Project context

- Stack: Next.js 16, React 19, TypeScript, Tailwind CSS v4.
- Report flow: `app/page.tsx` → `components/ReportView.tsx` → `components/reports/*.tsx`.
- Presentation refactors must not change Atera/MSRC endpoints, field mappings, or
  introduce mock or synthetic data.
- Use **Devices**, never “Hosts”; use **Device Type**, never “OS Category”.

## Tokens

All new UI colors, typography sizes, and spacing must use tokens from
`app/globals.css`. Do not add hex, rgb, or arbitrary Tailwind color/size values
in JSX. If a value is missing, add a semantic token first.

Required semantic tokens include:

- Severity: `--color-severity-critical`, `--color-severity-important`,
  `--color-severity-moderate`
- Device status: `--color-status-online`, `--color-status-offline`
- Report surfaces: `--color-report-canvas`, `--color-report-surface`,
  `--color-report-heading`, `--color-report-table-header`
- Typography: `text-report-caption`, `text-report-label`, `text-report-body`,
  `text-report-heading`, `text-report-title`
- Spacing: `report-1` through `report-4`

Legacy report styles will be migrated incrementally. Do not copy them into new
code.

## Reuse policy

Check `components/ui/` first. These primitives are the target public API:

| Pattern | Required component |
| --- | --- |
| Severity or risk level | `SeverityBadge` |
| Numeric report metric | `StatCard` |
| Report title/date area | `ReportPageHeader` |
| Standard data table shell | `ReportTable` |

If a UI pattern exists in two or more report pages, extract a generic reusable
component under `components/ui/` before using it again. Keep components focused;
do not create a page-specific “shared” component with a generic name.

## Migration sequence

1. Establish tokens and shared primitives.
2. Migrate Summary and Devices; verify A4 print layout.
3. Migrate Alerts and Tickets.
4. Migrate Patches, CVE, and Risk Scorecard.
5. Remove superseded local markup only after its consumers are migrated.

For each change, report the primitives added or updated and identify the next
report pages that should adopt them.

## Review checklist

- No new hardcoded color, arbitrary color, or arbitrary font-size/spacing class.
- Existing primitive reused when applicable.
- English-only report text remains English.
- Standard vocabulary is retained.
- No data-layer change or synthetic fallback was introduced.
- `npx tsc --noEmit` and `npm run build` pass.