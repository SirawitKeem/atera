import type { ReactNode } from 'react';

type StatCardTone = 'default' | 'critical' | 'important' | 'moderate' | 'online' | 'offline';

interface StatCardProps {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  icon?: ReactNode;
  tone?: StatCardTone;
  className?: string;
}

export function StatCard({ label, value, detail, icon, tone = 'default', className = '' }: StatCardProps) {
  return (
    <section className={`report-stat-card report-stat-card--${tone} ${className}`.trim()}>
      <div className="report-stat-card__header">
        <span className="report-stat-card__label">{label}</span>
        {icon ? <span className="report-stat-card__icon" aria-hidden="true">{icon}</span> : null}
      </div>
      <div>
        <div className="report-stat-card__value">{value}</div>
        {detail ? <p className="report-stat-card__detail">{detail}</p> : null}
      </div>
    </section>
  );
}