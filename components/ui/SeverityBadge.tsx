import type { HTMLAttributes } from 'react';

type Severity = 'critical' | 'important' | 'moderate' | 'unknown';

interface SeverityBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  severity?: string;
}

const severityAliases: Record<string, Severity> = {
  critical: 'critical',
  high: 'critical',
  important: 'important',
  warning: 'important',
  medium: 'moderate',
  moderate: 'moderate',
  info: 'moderate',
  low: 'moderate',
};

export function SeverityBadge({ severity, className = '', children, ...props }: SeverityBadgeProps) {
  const normalized = severityAliases[String(severity ?? '').trim().toLowerCase()] ?? 'unknown';
  const label = children ?? severity ?? 'Unknown';

  return (
    <span className={`report-severity-badge report-severity-badge--${normalized} ${className}`.trim()} {...props}>
      {label}
    </span>
  );
}